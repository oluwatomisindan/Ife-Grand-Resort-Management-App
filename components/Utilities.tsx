import React from 'react';
import { MOCK_LOGS, MOCK_NOTIFICATIONS } from '../constants';
import { Bell, Activity, HelpCircle, FileText } from 'lucide-react';

export const NotificationsPage = () => (
    <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-600" /> Notifications
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className={`p-4 border-b border-slate-100 flex gap-4 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                        <p className="text-sm text-slate-600">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const ActivityLogPage = () => (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> System Activity Log
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                        <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Target</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_LOGS.map((log) => (
                        <tr key={log.id} className="text-sm">
                            <td className="px-6 py-3 text-slate-500">{log.timestamp}</td>
                            <td className="px-6 py-3 font-medium text-slate-800">{log.user}</td>
                            <td className="px-6 py-3">
                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-semibold border border-slate-200">{log.action}</span>
                            </td>
                            <td className="px-6 py-3 text-slate-600">{log.target}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
    </div>
);

export const HelpPage = () => (
    <div className="max-w-3xl mx-auto space-y-8 text-center pt-10">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">How can we help you?</h2>
        <div className="relative max-w-lg mx-auto">
            <input type="text" placeholder="Search knowledge base..." className="w-full px-5 py-3 rounded-full border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-10">
            <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                <FileText className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-slate-800 mb-2">User Guides</h3>
                <p className="text-sm text-slate-500">Comprehensive documentation for all system modules.</p>
            </div>
             <div className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer group">
                <Activity className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-slate-800 mb-2">System Status</h3>
                <p className="text-sm text-slate-500">Check current system operational status and uptime.</p>
            </div>
        </div>
    </div>
);