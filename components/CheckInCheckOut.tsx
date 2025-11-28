
import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, UserCheck, LogOut, CheckCircle2, X, UserPlus, Building2, CreditCard, Calendar, User, Tag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ReservationStatus, RoomStatus, Guest } from '../types';
import { useNavigate } from 'react-router-dom';

export const CheckIn = () => {
    const { reservations, updateReservation, rooms, updateRoom, guests, updateGuest, addGuest, companies } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRes, setSelectedRes] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Form State for Guest Details inside Check-In
    const [guestForm, setGuestForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idType: 'Passport',
        idNumber: '',
        company: ''
    });

    // Discount & Payment State
    const [basePrice, setBasePrice] = useState(0);
    const [amountPaid, setAmountPaid] = useState(0);
    const [giveDiscount, setGiveDiscount] = useState(false);

    // Filter reservations that are Confirmed and match search
    const filteredReservations = reservations.filter(r => 
        r.status === ReservationStatus.CONFIRMED && 
        (r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || r.roomId.includes(searchTerm))
    );

    const handleStartCheckIn = (res: any) => {
        setSelectedRes(res);
        setBasePrice(res.totalAmount); // Initial base price from reservation
        setAmountPaid(res.totalAmount); // Default to full payment
        setGiveDiscount(false); // Reset discount
        
        // Try to pre-fill guest details if they exist in our guest database
        const existingGuest = guests.find(g => 
            `${g.firstName} ${g.lastName}`.toLowerCase() === res.guestName.toLowerCase()
        );

        if (existingGuest) {
            setGuestForm({
                firstName: existingGuest.firstName,
                lastName: existingGuest.lastName,
                email: existingGuest.email,
                phone: existingGuest.phone,
                idType: existingGuest.idType,
                idNumber: existingGuest.idNumber,
                company: existingGuest.company || ''
            });
        } else {
            // Split name from reservation if possible
            const nameParts = res.guestName.split(' ');
            setGuestForm({
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: '',
                phone: '',
                idType: 'Passport',
                idNumber: '',
                company: ''
            });
        }

        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setGuestForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle Payment/Discount Changes
    const handleDiscountToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGiveDiscount(e.target.checked);
        if (!e.target.checked) {
            setAmountPaid(basePrice); // Reset if discount disabled
        }
    };

    const confirmCheckIn = () => {
        if (!selectedRes) return;

        // 1. Update or Create Guest Profile
        const fullGuestName = `${guestForm.firstName} ${guestForm.lastName}`;
        const existingGuest = guests.find(g => g.id === selectedRes.guestId || `${g.firstName} ${g.lastName}` === fullGuestName);
        
        const guestData: Guest = {
            id: existingGuest ? existingGuest.id : Date.now().toString(),
            firstName: guestForm.firstName,
            lastName: guestForm.lastName,
            email: guestForm.email,
            phone: guestForm.phone,
            idType: guestForm.idType,
            idNumber: guestForm.idNumber,
            company: guestForm.company
        };

        if (existingGuest) {
            updateGuest(guestData);
        } else {
            addGuest(guestData);
        }

        // 2. Update Reservation Status & Price
        updateReservation({
            ...selectedRes,
            guestName: fullGuestName,
            status: ReservationStatus.CHECKED_IN,
            totalAmount: amountPaid // Save final agreed amount
        });

        // 3. Update Room Status
        const room = rooms.find(r => r.id === selectedRes.roomId);
        if (room) {
             updateRoom({ ...room, status: RoomStatus.CLEAN });
        }

        setShowModal(false);
        setSelectedRes(null);
        alert("Check-In Successful! Guest registered and room updated.");
    };

    const discountValue = Math.max(0, basePrice - amountPaid);
    const discountPercent = basePrice > 0 ? ((basePrice - amountPaid) / basePrice) * 100 : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div className="text-left">
                    <h2 className="text-3xl font-bold text-slate-900">Guest Check-In</h2>
                    <p className="text-slate-500 mt-1">Locate confirmed reservation or register walk-in.</p>
                </div>
                <button 
                    onClick={() => navigate('/guests')}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
                >
                    <UserPlus className="w-5 h-5" /> Walk-In / New Guest
                </button>
            </div>

            <div className="relative shadow-lg rounded-2xl bg-white border border-slate-100">
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, confirmation # or room..." 
                    className="w-full pl-6 pr-6 py-5 rounded-2xl border-none outline-none text-lg bg-transparent" 
                    autoFocus 
                />
                <div className="absolute right-3 top-3 bottom-3 bg-blue-600 text-white px-6 rounded-xl font-bold flex items-center justify-center shadow-md">
                    <Search className="w-5 h-5" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {filteredReservations.length === 0 ? (
                    <div className="col-span-full text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <UserCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No confirmed reservations found matching "{searchTerm}"</p>
                    </div>
                ) : (
                    filteredReservations.map(res => (
                        <div key={res.id} onClick={() => handleStartCheckIn(res)} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-500 cursor-pointer transition-all group shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                        {res.guestName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{res.guestName}</h3>
                                        <p className="text-slate-500 text-xs uppercase tracking-wide">CONF: {res.id.toUpperCase()}</p>
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">{res.status}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Room</p>
                                    <p className="font-bold text-slate-800">{rooms.find(r => r.id === res.roomId)?.number || 'Unassigned'}</p>
                                </div>
                                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Dates</p>
                                    <p className="font-bold text-slate-800 text-xs">{res.checkIn} → {res.checkOut}</p>
                                </div>
                            </div>

                            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-blue-100">
                                Start Check-In <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Redesigned Check In Modal */}
            {showModal && selectedRes && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col md:flex-row max-h-[90vh]">
                        
                        {/* Left Column: Guest Registration Form */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-slate-900 mb-1">Guest Registration</h3>
                                <p className="text-slate-500 text-sm">Verify and update guest details below.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-600">First Name</label>
                                        <input 
                                            name="firstName" 
                                            value={guestForm.firstName} 
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-600">Last Name</label>
                                        <input 
                                            name="lastName" 
                                            value={guestForm.lastName} 
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">Email Address</label>
                                    <input 
                                        name="email" 
                                        type="email"
                                        value={guestForm.email} 
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600">Phone Number</label>
                                    <input 
                                        name="phone" 
                                        value={guestForm.phone} 
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-600">ID Type</label>
                                        <select 
                                            name="idType" 
                                            value={guestForm.idType} 
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white"
                                        >
                                            <option>Passport</option>
                                            <option>Driver License</option>
                                            <option>National ID</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-600">ID Number</label>
                                        <input 
                                            name="idNumber" 
                                            value={guestForm.idNumber} 
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                        <Building2 className="w-3 h-3" /> Company (Optional)
                                    </label>
                                    <select 
                                        name="company" 
                                        value={guestForm.company} 
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white"
                                    >
                                        <option value="">None / Private Guest</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Reservation Summary */}
                        <div className="md:w-96 bg-slate-50 p-8 border-l border-slate-100 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800">Stay Summary</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Check In</p>
                                        <p className="font-bold text-slate-800">{selectedRes.checkIn}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                        <LogOut className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Check Out</p>
                                        <p className="font-bold text-slate-800">{selectedRes.checkOut}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Discount / Payment Section */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 mb-6">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
                                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-blue-600" /> Pricing
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            id="chkDiscount"
                                            type="checkbox" 
                                            checked={giveDiscount}
                                            onChange={handleDiscountToggle}
                                            className="w-4 h-4 text-blue-600 rounded border-slate-300"
                                        />
                                        <label htmlFor="chkDiscount" className="text-xs font-bold text-slate-600">Give Discount</label>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Fixed Price (Rate)</label>
                                    <div className="flex justify-between font-bold text-slate-400 bg-slate-50 p-2 rounded">
                                        <span>Base</span>
                                        <span>${basePrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                {giveDiscount && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Discount Applied</label>
                                        <div className="flex justify-between font-bold text-emerald-600 bg-emerald-50 p-2 rounded">
                                            <div className="flex gap-2">
                                                <span>Off</span>
                                                <span className="text-xs bg-emerald-200 px-1.5 rounded-sm flex items-center">{discountPercent.toFixed(0)}%</span>
                                            </div>
                                            <span>-${discountValue.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1 pt-2">
                                    <label className="text-[10px] font-bold text-blue-600 uppercase">Amount Paid / To Pay</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800 font-bold">$</span>
                                        <input 
                                            type="number"
                                            value={amountPaid}
                                            onChange={(e) => {
                                                if(giveDiscount) setAmountPaid(Number(e.target.value));
                                            }}
                                            readOnly={!giveDiscount}
                                            className={`w-full pl-6 pr-3 py-2 border rounded-lg font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 text-right ${
                                                giveDiscount ? 'bg-white border-blue-300 text-blue-700' : 'bg-slate-100 border-slate-200 text-slate-700 cursor-not-allowed'
                                            }`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-4">
                                <button 
                                    onClick={confirmCheckIn}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Complete Check-In
                                </button>
                                <p className="text-center text-xs text-slate-400 mt-4">
                                    By clicking complete, you agree to the terms of service.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export const CheckOut = () => {
    const { rooms, updateRoom, reservations, updateReservation } = useAppContext();
    const [roomSearch, setRoomSearch] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    const handleSearch = () => {
        const room = rooms.find(r => r.number === roomSearch);
        if (room) {
            // Find active reservation
            const res = reservations.find(r => r.roomId === room.id && r.status === ReservationStatus.CHECKED_IN);
            if (res) {
                setSelectedRoom({ room, reservation: res });
            } else {
                alert("Room is found but no active check-in associated.");
            }
        } else {
            alert("Room not found.");
        }
    };

    const processCheckout = () => {
        if (!selectedRoom) return;

        // 1. Update Reservation
        updateReservation({
            ...selectedRoom.reservation,
            status: ReservationStatus.CHECKED_OUT
        });

        // 2. Update Room Status to Dirty
        updateRoom({
            ...selectedRoom.room,
            status: RoomStatus.DIRTY
        });

        alert(`Check-out complete for Room ${selectedRoom.room.number}. Room marked Dirty.`);
        setSelectedRoom(null);
        setRoomSearch('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">Guest Check-Out</h2>
                <p className="text-slate-500 mt-2">Process payments and finalize stays</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                 <div className="flex gap-4 mb-6">
                    <input 
                        type="text" 
                        value={roomSearch}
                        onChange={(e) => setRoomSearch(e.target.value)}
                        placeholder="Room Number..." 
                        className="w-32 px-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-blue-500 text-center font-bold text-lg" 
                    />
                    <button onClick={handleSearch} className="bg-slate-900 text-white px-6 rounded-lg font-bold hover:bg-slate-800">Find Room</button>
                 </div>

                 {!selectedRoom && (
                     <div className="border-t border-slate-100 pt-6">
                         <p className="text-slate-400 text-center italic">Enter a room number to pull up the folio.</p>
                     </div>
                 )}

                 {selectedRoom && (
                     <div className="animate-in fade-in slide-in-from-bottom-4">
                         <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-6">
                             <div>
                                 <h3 className="text-2xl font-bold text-slate-800">Room {selectedRoom.room.number}</h3>
                                 <p className="text-slate-500">{selectedRoom.reservation.guestName}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-sm text-slate-500">Balance</p>
                                 <p className="text-2xl font-bold text-slate-900">$0.00</p>
                             </div>
                         </div>
                         
                         <div className="flex gap-3">
                             <button className="flex-1 border border-slate-200 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-50">
                                 Print Folio
                             </button>
                             <button onClick={processCheckout} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-100">
                                 Complete Check-Out
                             </button>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
};
