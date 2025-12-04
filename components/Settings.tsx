import React, { useState } from 'react';
import { Save, Plus, Edit, Trash2, X, Users, Briefcase } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../auth/AuthContext';
import { RoomStatus, Room, Staff, UserRole } from '../types';

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
            editingRoom || { number: '', type: 'Standard', price: '', status: RoomStatus.CLEAN }
        );

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            if (editingRoom) {
                updateRoom({ ...editingRoom, ...formData } as Room);
            } else {
                addRoom({ ...formData, id: Date.now().toString() } as Room);
            }
            setShowRoomModal(false);
        };

        return (
            <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h3 className="font-bold text-lg">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
                        <button onClick={() => setShowRoomModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Room Number</label>
                            <input required type="text" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Type</label>
                            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg bg-white">
                                <option>Standard</option>
                                <option>Deluxe</option>
                                <option>Suite</option>
                                <option>Villa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-1">Price per Night (₦)</label>
                            <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">Save Room</button>
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
                                <table className="w-full text-left min-w-[500px]">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Room #</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Type</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                                            <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {rooms.map(room => (
                                            <tr key={room.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-800">{room.number}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{room.type}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">₦{room.price}</td>
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