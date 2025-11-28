
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfToday, eachDayOfInterval, differenceInDays, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Filter, Calendar, Save, Trash2, X, AlertTriangle, Calculator, Tag } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReservationStatus, Reservation } from '../types';
import { useAppContext } from '../context/AppContext';

export const Reservations: React.FC = () => {
  const { reservations, addReservation, updateReservation, rooms } = useAppContext();
  const [startDate, setStartDate] = useState(startOfToday());
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Determine mode based on URL
  const isCreate = location.pathname.includes('/create');
  const isEdit = location.pathname.includes('/edit');
  const isCancel = location.pathname.includes('/cancel');
  
  // -- Form State --
  const [formData, setFormData] = useState({
      guestName: '',
      roomId: '',
      checkIn: '',
      checkOut: '',
      status: ReservationStatus.CONFIRMED,
  });

  // Discount & Pricing State
  const [basePrice, setBasePrice] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [giveDiscount, setGiveDiscount] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load data for edit/cancel
  useEffect(() => {
      if ((isEdit || isCancel) && params.id) {
          const res = reservations.find(r => r.id === params.id);
          if (res) {
              setFormData({
                  guestName: res.guestName,
                  roomId: res.roomId,
                  checkIn: res.checkIn,
                  checkOut: res.checkOut,
                  status: res.status
              });
              setBasePrice(res.totalAmount); // Assuming stored total is the agreed price
              setAmountPaid(res.totalAmount);
          }
      }
  }, [isEdit, isCancel, params.id, reservations]);

  // Recalculate Base Price when Room or Dates change (Only for Create mode or if user changes values)
  useEffect(() => {
      if (formData.roomId && formData.checkIn && formData.checkOut) {
          const room = rooms.find(r => r.id === formData.roomId);
          if (room) {
              const start = parseISO(formData.checkIn);
              const end = parseISO(formData.checkOut);
              const nights = differenceInDays(end, start);
              
              if (nights > 0) {
                  const calculatedPrice = room.price * nights;
                  // Only update base price if we are creating, OR if the calculated price differs significantly (user changed dates/room)
                  // For simplicity in this demo, we update base price on form change.
                  if (isCreate) {
                      setBasePrice(calculatedPrice);
                      if (!giveDiscount) {
                          setAmountPaid(calculatedPrice);
                      }
                  } else if (isEdit) {
                      // In edit, we might want to keep original price unless explicitly changed, 
                      // but here we recalc for dynamic behavior
                      setBasePrice(calculatedPrice);
                  }
              }
          }
      }
  }, [formData.roomId, formData.checkIn, formData.checkOut, rooms, isCreate, isEdit, giveDiscount]);

  // Handle Checkbox Toggle
  const handleDiscountToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setGiveDiscount(e.target.checked);
      if (!e.target.checked) {
          setAmountPaid(basePrice); // Reset to base price if discount disabled
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const resData: any = {
          id: params.id || Date.now().toString(),
          ...formData,
          totalAmount: amountPaid // Save the final discounted amount
      };

      if (isEdit) {
          updateReservation(resData);
      } else {
          addReservation(resData);
      }
      setShowSuccess(true);
  };

  const handleDelete = () => {
      if (params.id) {
          const res = reservations.find(r => r.id === params.id);
          if (res) {
              updateReservation({ ...res, status: ReservationStatus.CANCELLED });
              setShowSuccess(true);
          }
      }
  }

  // Calculate Discount Value for Display
  const discountValue = Math.max(0, basePrice - amountPaid);
  const discountPercent = basePrice > 0 ? ((basePrice - amountPaid) / basePrice) * 100 : 0;

  // -- Render Views --

  if (showSuccess) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Save className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Success!</h2>
              <p className="text-slate-600 mb-6">The reservation has been successfully {isCancel ? 'cancelled' : isEdit ? 'updated' : 'created'}.</p>
              <button 
                  onClick={() => { setShowSuccess(false); navigate('/reservations'); }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                  Return to Calendar
              </button>
          </div>
      );
  }

  if (isCreate || isEdit) {
      return (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit Reservation' : 'New Reservation'}</h2>
                  <button onClick={() => navigate('/reservations')} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Guest Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.guestName}
                        onChange={e => setFormData({...formData, guestName: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="Enter guest full name"
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">Check In</label>
                          <input 
                            type="date" 
                            required
                            value={formData.checkIn}
                            onChange={e => setFormData({...formData, checkIn: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">Check Out</label>
                          <input 
                            type="date" 
                            required
                            value={formData.checkOut}
                            onChange={e => setFormData({...formData, checkOut: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Room Assignment</label>
                      <select 
                        value={formData.roomId}
                        onChange={e => setFormData({...formData, roomId: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                          <option value="">Select a Room</option>
                          {rooms.map(r => (
                              <option key={r.id} value={r.id}>Room {r.number} - {r.type} (${r.price}/night)</option>
                          ))}
                      </select>
                  </div>

                  {/* Pricing & Discount Section */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                          <h3 className="font-bold text-slate-800 flex items-center gap-2">
                              <Calculator className="w-4 h-4 text-blue-600" /> Pricing Details
                          </h3>
                          <div className="flex items-center gap-2">
                              <input 
                                id="discountCheckbox"
                                type="checkbox" 
                                checked={giveDiscount}
                                onChange={handleDiscountToggle}
                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                              />
                              <label htmlFor="discountCheckbox" className="text-sm font-medium text-slate-700 select-none">Give Discount</label>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Fixed Price (Total)</label>
                              <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                  <input 
                                    type="number" 
                                    value={basePrice} 
                                    readOnly 
                                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-bold cursor-not-allowed"
                                  />
                              </div>
                          </div>

                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Discount Given</label>
                              <div className="relative">
                                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex gap-1 z-10">
                                     <span className="text-slate-400 font-bold">$</span>
                                  </div>
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                     {giveDiscount && basePrice > 0 && <span className="text-xs bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-bold">{discountPercent.toFixed(0)}%</span>}
                                  </div>
                                  <input 
                                    type="number" 
                                    value={discountValue} 
                                    readOnly 
                                    className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg bg-white text-emerald-600 font-bold"
                                  />
                              </div>
                          </div>

                          <div className="col-span-2 space-y-1">
                              <label className="text-xs font-bold text-blue-600 uppercase">Amount Paid / Final Price</label>
                              <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-800 font-bold">$</span>
                                  <input 
                                    type="number" 
                                    value={amountPaid} 
                                    onChange={e => {
                                        if (giveDiscount) {
                                            setAmountPaid(Number(e.target.value));
                                        }
                                    }}
                                    readOnly={!giveDiscount}
                                    className={`w-full pl-8 pr-4 py-3 border rounded-lg font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                        giveDiscount 
                                        ? 'bg-white border-blue-300 text-blue-700' 
                                        : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                                    }`}
                                  />
                              </div>
                              <p className="text-xs text-slate-400 text-right">
                                  {giveDiscount ? 'Enter the final agreed amount.' : 'Tick "Give Discount" to modify.'}
                              </p>
                          </div>
                      </div>
                  </div>
                  
                  {/* Availability Check Mock */}
                  {formData.checkIn && formData.checkOut && (
                       <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-700 flex items-center gap-2">
                            <Save className="w-4 h-4" /> Rooms are available for these dates.
                       </div>
                  )}

                  <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => navigate('/reservations')} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                      <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">
                          {isEdit ? 'Update Reservation' : 'Create Reservation'}
                      </button>
                  </div>
              </form>
          </div>
      );
  }

  if (isCancel) {
      return (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-10">
              <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Cancel Reservation?</h2>
                  <p className="text-slate-600 mb-6">
                      Are you sure you want to cancel the reservation for <strong>{formData.guestName}</strong>? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                      <button onClick={() => navigate('/reservations')} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">Keep It</button>
                      <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-md">Yes, Cancel It</button>
                  </div>
              </div>
          </div>
      );
  }

  // -- Default Tape Chart View --

  const daysToShow = 14;
  
  const dates = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, daysToShow - 1)
  });

  const getReservationForRoomAndDate = (roomId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return reservations.find(r => 
      r.roomId === roomId && 
      dateStr >= r.checkIn && 
      dateStr < r.checkOut &&
      r.status !== ReservationStatus.CANCELLED
    );
  };

  const getReservationStart = (roomId: string, date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return reservations.find(r => r.roomId === roomId && r.checkIn === dateStr && r.status !== ReservationStatus.CANCELLED);
  }

  const handlePrev = () => setStartDate(d => addDays(d, -7));
  const handleNext = () => setStartDate(d => addDays(d, 7));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
      {/* Controls */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="hidden sm:block">Tape Chart</h2>
            </div>
            
            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button onClick={handlePrev} className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"><ChevronLeft className="w-5 h-5" /></button>
                <span className="px-4 text-sm font-medium text-slate-700 min-w-[140px] text-center">{format(startDate, 'MMM d, yyyy')}</span>
                <button onClick={handleNext} className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-slate-600"><ChevronRight className="w-5 h-5" /></button>
            </div>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate('/reservations/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
            >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Reservation</span>
            </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto relative scrollbar-hide">
        <div className="inline-block min-w-full">
            {/* Header Row */}
            <div className="flex border-b border-slate-200 sticky top-0 bg-slate-50 z-20 shadow-sm">
                <div className="w-40 flex-shrink-0 p-4 border-r border-slate-200 font-semibold text-slate-600 text-sm sticky left-0 bg-slate-50 z-30">
                    Room / Type
                </div>
                {dates.map(date => (
                    <div key={date.toString()} className={`w-28 flex-shrink-0 p-3 border-r border-slate-200 text-center ${['Sat', 'Sun'].includes(format(date, 'EEE')) ? 'bg-slate-100/50' : ''}`}>
                        <div className="text-xs text-slate-500 uppercase font-medium tracking-wider">{format(date, 'EEE')}</div>
                        <div className="text-sm font-bold text-slate-800">{format(date, 'd')}</div>
                    </div>
                ))}
            </div>

            {/* Room Rows */}
            {rooms.map(room => (
                <div key={room.id} className="flex border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                    <div className="w-40 flex-shrink-0 p-4 bg-white border-r border-slate-200 flex flex-col justify-center sticky left-0 z-10 group-hover:bg-slate-50/80 transition-colors border-l-4 border-l-transparent hover:border-l-blue-500">
                        <div className="flex items-center justify-between">
                             <span className="font-bold text-slate-800 text-lg">{room.number}</span>
                             <span className="text-xs font-medium text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">{room.type.substring(0,3).toUpperCase()}</span>
                        </div>
                        <span className="text-xs text-slate-500 mt-1">${room.price}/night</span>
                    </div>
                    {dates.map(date => {
                        const reservation = getReservationForRoomAndDate(room.id, date);
                        const isStart = getReservationStart(room.id, date);
                        const isWeekend = ['Sat', 'Sun'].includes(format(date, 'EEE'));
                        
                        return (
                            <div key={date.toString()} className={`w-28 flex-shrink-0 border-r border-slate-100 relative h-20 p-1 ${isWeekend ? 'bg-slate-50/30' : ''}`}>
                                {reservation && (
                                    <div 
                                        className={`
                                            h-full rounded-md text-xs p-2 text-white overflow-hidden shadow-sm cursor-pointer hover:brightness-105 transition-all flex flex-col justify-center
                                            ${reservation.status === 'Checked In' ? 'bg-emerald-500' : 
                                              reservation.status === 'Checked Out' ? 'bg-slate-400' : 'bg-blue-500'}
                                            ${!isStart ? 'opacity-90 rounded-l-none border-l border-white/20' : ''} 
                                            ${isStart ? 'z-10 relative ml-0.5' : ''}
                                        `}
                                        onClick={() => navigate(`/reservations/${reservation.id}/edit`)}
                                    >
                                        {isStart && (
                                            <>
                                                <p className="font-bold truncate text-sm">{reservation.guestName}</p>
                                                <div className="flex justify-between items-center mt-0.5">
                                                     <p className="opacity-90 text-[10px] uppercase tracking-wide">{reservation.status}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-4 md:gap-6 text-xs text-slate-600 justify-end px-6">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Checked In</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Confirmed</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Checked Out</div>
      </div>
    </div>
  );
};
