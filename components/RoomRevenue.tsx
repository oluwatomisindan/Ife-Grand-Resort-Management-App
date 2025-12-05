import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { DollarSign, TrendingUp, Calendar, Award } from 'lucide-react';

export const RoomRevenue: React.FC = () => {
    const { roomRevenue, revenueStats, fetchRoomRevenue } = useAppContext();

    useEffect(() => {
        fetchRoomRevenue();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Room Revenue Analytics</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
                        <div className="p-2 bg-white/20 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(parseFloat(revenueStats.total_revenue || 0))}</p>
                    <p className="text-xs opacity-75 mt-1">All-time earnings</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Total Bookings</h3>
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Calendar className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{revenueStats.total_bookings || 0}</p>
                    <p className="text-xs opacity-75 mt-1">Completed reservations</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium opacity-90">Average Revenue</h3>
                        <div className="p-2 bg-white/20 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(parseFloat(revenueStats.average_revenue || 0))}</p>
                    <p className="text-xs opacity-75 mt-1">Per booking</p>
                </div>
            </div>

            {/* Room Revenue Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-600" />
                        Revenue by Room
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Room Number
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Total Revenue
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Bookings
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    Avg per Booking
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {roomRevenue.map((room, index) => {
                                const avgPerBooking = room.booking_count > 0 
                                    ? parseFloat(room.total_revenue) / parseInt(room.booking_count)
                                    : 0;
                                
                                return (
                                    <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                                                    index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500' :
                                                    index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                                                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                                                    'bg-gradient-to-br from-blue-400 to-blue-500'
                                                }`}>
                                                    {room.number}
                                                </div>
                                                {index < 3 && (
                                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                                        #{index + 1}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {room.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-bold text-emerald-600">
                                                {formatCurrency(parseFloat(room.total_revenue))}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-semibold text-slate-700">
                                                {room.booking_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm text-slate-600">
                                                {formatCurrency(avgPerBooking)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {roomRevenue.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <DollarSign className="w-12 h-12 opacity-20" />
                                            <p>No revenue data available yet</p>
                                            <p className="text-xs">Revenue will appear here after guests check in</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
