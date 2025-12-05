import React, { useState } from 'react';
import { Save, Plus, Edit, Trash2, X, Users, Briefcase } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import { RoomStatus, RoomCategory, Room, Staff, UserRole } from '../types';
import { ROOM_TYPES, getRoomTypesByCategory, getPriceForRoomType, getRoomPrefix } from '../config/roomTypes';

export const Settings = () => {
    const { rooms, addRoom, updateRoom, deleteRoom, staff, addStaff, updateStaff, deleteStaff } = useAppContext();
    const { currentUser } = useAuth();
    const isAdmin = currentUser?.role === UserRole.SUPER_ADMIN;

    const [activeTab, setActiveTab] = useState('general');
    const [showRoomModal, setShowRoomModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    // Staff State
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const tabs = ['general', 'rooms', 'staff', 'rates', 'payments', 'departments'];

    // -- Room Handlers --
    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setShowRoomModal(true);
    };

    const handleDeleteRoom = (id: string) => {
        if(window.confirm("Are you sure you want to delete this room?")) {
            deleteRoom(id);
        }
    };

    // -- Staff Handlers --
    const handleEditStaff = (s: Staff) => {
        setEditingStaff(s);
        setShowStaffModal(true);
    }
    const handleDeleteStaff = (id: string) => {
        if(window.confirm("Delete this staff member?")) deleteStaff(id);
    }

    const RoomModal = () => {
        const [formData, setFormData] = useState<Partial<Room>>(
            editingRoom || { number: '', type: 'Standard', category: RoomCategory.STANDARD, roomType: '', price: '', status: RoomStatus.CLEAN }
        );
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [availableRoomTypes, setAvailableRoomTypes] = useState<any[]>([]);
        const [maxRoomNumber, setMaxRoomNumber] = useState<number>(999);

        // Update available room types when category changes
        React.useEffect(() => {
            if (formData.category) {
                const types = getRoomTypesByCategory(formData.category);
                setAvailableRoomTypes(types);
                
                // Reset room type and price when category changes
                if (!editingRoom) {
                    setFormData(prev => ({ ...prev, roomType: '', price: '', type: 'Standard', number: '' }));
                    setMaxRoomNumber(999);
                }
            }
        }, [formData.category]);

        // Update price, type, and max room number when room type changes
        const handleRoomTypeChange = (roomType: string) => {
            const price = getPriceForRoomType(formData.category!, roomType);
            
            // Find the selected room type to get total rooms
            const selectedType = availableRoomTypes.find(t => t.name === roomType);
            const maxRooms = selectedType ? selectedType.totalRooms : 999;
            
            // Generate room prefix
            const prefix = getRoomPrefix(roomType);
            
            // Set the room type name as the "type" field and reset number
            setFormData({ ...formData, roomType, type: roomType, price, number: '' });
            setMaxRoomNumber(maxRooms);
        };

        // Format room number with validation based on room type capacity
        const handleRoomNumberChange = (value: string) => {
            // Remove any non-numeric characters
            let numericValue = value.replace(/[^0-9]/g, '');
            
            // Convert to number for validation
            const numberValue = parseInt(numericValue) || 0;
            
            // Validate against max room number for this room type
            if (numberValue > maxRoomNumber) {
                setError(`Room number cannot exceed ${maxRoomNumber} for ${formData.roomType}`);
                return;
            } else {
                setError(null);
            }
            
            // Limit to 3 digits
            if (numericValue.length > 3) {
                numericValue = numericValue.slice(0, 3);
            }
            
            setFormData({ ...formData, number: numericValue });
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);
            setIsSubmitting(true);

            try {
                // Validate price
                const priceValue = typeof formData.price === 'string' 
                    ? parseFloat(formData.price.replace(/[^0-9.]/g, ''))
                    : formData.price;

                if (!priceValue || isNaN(priceValue) || priceValue <= 0) {
                    setError('Please select a room type to set the price');
                    setIsSubmitting(false);
                    return;
                }

                if (!formData.roomType) {
                    setError('Please select a room type');
                    setIsSubmitting(false);
                    return;
                }

                if (!formData.number) {
                    setError('Please enter a room number');
                    setIsSubmitting(false);
                    return;
                }

                // Validate room number is within range
                const roomNum = parseInt(formData.number);
                if (roomNum < 1 || roomNum > maxRoomNumber) {
                    setError(`Room number must be between 001 and ${maxRoomNumber.toString().padStart(3, '0')} for ${formData.roomType}`);
                    setIsSubmitting(false);
                    return;
                }

                // Generate room prefix and combine with padded number
                const prefix = getRoomPrefix(formData.roomType!);
                const paddedNumber = formData.number.padStart(3, '0');
                const finalRoomNumber = `${prefix}${paddedNumber}`;

                const roomData = {
                    ...formData,
                    number: finalRoomNumber,
                    type: formData.roomType, // Use room type name as the type
                    price: priceValue,
                    category: formData.category || RoomCategory.STANDARD,
                    id: editingRoom?.id || `room-${Date.now()}`,
                    status: formData.status || RoomStatus.CLEAN
                } as Room;

                if (editingRoom) {
                    await updateRoom(roomData);
                } else {
                    await addRoom(roomData);
                }
                
                setShowRoomModal(false);
                setEditingRoom(null);
            } catch (err: any) {
                console.error('Error saving room:', err);
                setError(err.response?.data?.message || err.message || 'Failed to save room');
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-lg">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                        <button onClick={() => { setShowRoomModal(false); setEditingRoom(null); }}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Step 1: Category */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs mr-2">1</span>
                                Room Category
                            </label>
                            <select 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value as RoomCategory})} 
                                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            >
                                <option value={RoomCategory.STANDARD}>Standard</option>
                                <option value={RoomCategory.PREMIUM}>Premium</option>
                                <option value={RoomCategory.SUPER_PREMIUM}>Super Premium</option>
                                <option value={RoomCategory.SUPER_PREMIUM_PLUS}>Super Premium Plus</option>
                                <option value={RoomCategory.EXECUTIVE}>Executive</option>
                                <option value={RoomCategory.ROYAL_DIPLOMATIC}>Royal Diplomatic</option>
                                <option value={RoomCategory.KINGS}>Kings</option>
                            </select>
                        </div>

                        {/* Step 2: Room Type */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs mr-2">2</span>
                                Room Type
                            </label>
                            <select 
                                required
                                value={formData.roomType || ''} 
                                onChange={e => handleRoomTypeChange(e.target.value)} 
                                className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                            >
                                <option value="">Select Room Type</option>
                                {availableRoomTypes.map(type => (
                                    <option key={type.name} value={type.name}>
                                        {type.name} - ₦{type.price.toLocaleString()}/night ({type.totalRooms} rooms)
                                    </option>
                                ))}
                            </select>
                            {formData.category && availableRoomTypes.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">No room types available for this category</p>
                            )}
                            {formData.roomType && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-700 font-medium">
                                        ✓ Room type: <span className="font-bold">{formData.roomType}</span>
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        📊 Available room numbers: <span className="font-mono font-bold">001-{maxRoomNumber.toString().padStart(3, '0')}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Room Number */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs mr-2">3</span>
                                Room Number
                            </label>
                            <div className="relative">
                                {formData.roomType && (
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-bold font-mono text-lg z-10">
                                        {getRoomPrefix(formData.roomType)}
                                    </span>
                                )}
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.number} 
                                    onChange={e => handleRoomNumberChange(e.target.value)} 
                                    disabled={!formData.roomType}
                                    className={`w-full ${formData.roomType ? 'pl-20' : 'pl-3'} pr-3 py-2 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold text-lg disabled:bg-slate-100 disabled:cursor-not-allowed`}
                                    placeholder={formData.roomType ? "001" : "Select room type first"}
                                    maxLength={3}
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {formData.roomType ? (
                                    <>
                                        Range: <span className="font-mono font-bold">1-{maxRoomNumber}</span>
                                        {formData.number && ` • Will be saved as: `}
                                        {formData.number && <span className="font-mono font-bold text-blue-600">{getRoomPrefix(formData.roomType)}{formData.number.padStart(3, '0')}</span>}
                                    </>
                                ) : (
                                    'Select a room type first to enable room number input'
                                )}
                            </p>
                        </div>
                        
                        {/* Step 4: Price (Auto-filled) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs mr-2">✓</span>
                                Price per Night
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₦</span>
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.price ? parseFloat(formData.price.toString()).toLocaleString() : ''} 
                                    readOnly
                                    className="w-full pl-8 pr-3 py-2 border rounded-lg bg-emerald-50 text-emerald-700 font-bold text-lg cursor-not-allowed" 
                                    placeholder="Auto-filled"
                                />
                            </div>
                            <p className="text-xs text-emerald-600 mt-1 font-medium">✓ Price automatically set based on room type</p>
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !formData.roomType || !formData.number}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Room'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const StaffModal = () => {
        const [formData, setFormData] = useState<Partial<Staff>>(
            editingStaff || { name: '', role: 'Housekeeping', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
        );

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (editingStaff) {
                updateStaff({ ...editingStaff, ...formData } as Staff);
            } else {
                addStaff({ ...formData, id: `s${Date.now()}` } as Staff);
            }
            setShowStaffModal(false);
        };

        return (
            <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-lg">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h3>
                        <button onClick={() => setShowStaffModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Department</label>
                            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white">
                                <option value="Housekeeping">Housekeeping</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Avatar URL</label>
                            <input type="text" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="https://..." />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Save Staff</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {showRoomModal && <RoomModal />}
            {showStaffModal && <StaffModal />}
            <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
            
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-row md:flex-col overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`w-full text-left px-5 py-3 text-sm font-medium md:border-l-4 md:border-b-0 border-b-4 transition-all whitespace-nowrap ${
                                    activeTab === tab 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                                } capitalize`}
                            >
                                {tab} Settings
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
                            <h3 className="text-lg font-bold text-slate-800 capitalize">{activeTab} Configuration</h3>
                            {activeTab !== 'rooms' && activeTab !== 'staff' && (
                                <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                                    <Save className="w-4 h-4" /> Save Changes
                                </button>
                            )}
                            {activeTab === 'rooms' && isAdmin && (
                                <button 
                                    onClick={() => { setEditingRoom(null); setShowRoomModal(true); }}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Room
                                </button>
                            )}
                            {activeTab === 'staff' && (
                                <button 
                                    onClick={() => { setEditingStaff(null); setShowStaffModal(true); }}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Staff
                                </button>
                            )}
                        </div>

                        {activeTab === 'general' && (
                            <div className="max-w-xl space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Property Name</label>
                                    <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" defaultValue="Ife Grand Resort" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700">Base Currency</label>
                                    <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                        <option>NGN (₦)</option>
                                        <option>USD ($)</option>
                                        <option>EUR (€)</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === 'rooms' && (
                            <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Room #</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rooms.map(room => (
                                            <tr key={room.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-800">{room.number}</td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {room.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{room.type}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">₦{room.price}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                        room.status === 'Clean' ? 'bg-emerald-100 text-emerald-700' :
                                                        room.status === 'Dirty' ? 'bg-rose-100 text-rose-700' :
                                                        room.status === 'Occupied' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {room.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                    {isAdmin && (
                                                        <>
                                                            <button onClick={() => handleEditRoom(room)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md"><Edit className="w-4 h-4" /></button>
                                                            <button onClick={() => handleDeleteRoom(room.id)} className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"><Trash2 className="w-4 h-4" /></button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'staff' && (
                            <div className="space-y-6">
                                {/* Group by Role */}
                                {['Housekeeping', 'Maintenance'].map(role => (
                                    <div key={role} className="space-y-3">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                            {role === 'Housekeeping' ? <Users className="w-4 h-4 text-emerald-600"/> : <Briefcase className="w-4 h-4 text-orange-600"/>} 
                                            {role} Team
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {staff.filter(s => s.role === role).map(s => (
                                                <div key={s.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                                                        <div>
                                                            <p className="font-semibold text-sm text-slate-800">{s.name}</p>
                                                            <p className="text-xs text-slate-400">ID: {s.id}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button onClick={() => handleEditStaff(s)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDeleteStaff(s.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {staff.filter(s => s.role === role).length === 0 && (
                                                <div className="text-xs text-slate-400 italic py-2">No staff registered.</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                         {activeTab === 'rates' && (
                            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                Rate Codes & Seasons Configuration Panel
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};