import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Reservations } from './components/Reservations';
import { Housekeeping } from './components/Housekeeping';
import { Maintenance } from './components/Maintenance';
import { POS } from './components/POS';
import { AIChat } from './components/AIChat';
import { Users } from './components/Users';
import { Guests } from './components/Guests';
import { Accounting } from './components/Accounting';
import { Settings } from './components/Settings';
import { NotificationsPage, ActivityLogPage, HelpPage } from './components/Utilities';
import { Error404, Error403, Error500 } from './components/SystemPages';
import { CheckIn, CheckOut } from './components/CheckInCheckOut';
import { MOCK_USERS } from './constants';
import { User } from './types';
import { Building2, Lock, ArrowRight, Mail, Loader2, ArrowLeft } from 'lucide-react';

// Authentication Screens Component
const AuthScreen = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [view, setView] = useState<'login' | 'forgot' | 'setup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Mock login handler
  const handleDemoLogin = (user: User) => {
    setIsLoading(true);
    setTimeout(() => {
        onLogin(user);
        setIsLoading(false);
    }, 800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate generic login
      handleDemoLogin(MOCK_USERS[0]);
  };

  // Resort Exterior Background - Updated to match the requested style (White building, palm trees)
  // Note: To use your specific uploaded image, place it in the public folder and change this to "/your-image.jpg"
  const BG_IMAGE = "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2532&auto=format&fit=crop";

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans">
        {/* Background */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${BG_IMAGE})` }}
        >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        </div>

        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            {/* Login View */}
            {view === 'login' && (
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Ife Grand Resort</h1>
                        <p className="text-slate-500 text-sm mt-1">Management Portal</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="email" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    placeholder="admin@iferesort.com" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                                <button type="button" onClick={() => setView('forgot')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot?</button>
                            </div>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="password" 
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    placeholder="••••••••" 
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="remember" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                            <label htmlFor="remember" className="text-sm text-slate-600">Remember this device</label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    {/* Quick Demo Login - For ease of testing */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-xs text-center text-slate-400 mb-4 uppercase tracking-wider font-semibold">Quick Demo Access</p>
                        <div className="grid grid-cols-2 gap-2">
                            {MOCK_USERS.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => handleDemoLogin(user)}
                                    className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all text-left"
                                >
                                    <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                                    <div className="overflow-hidden">
                                        <p className="text-xs font-bold text-slate-700 truncate">{user.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{user.role}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            New property? <button onClick={() => setView('setup')} className="text-blue-600 font-bold hover:underline">Setup System</button>
                        </p>
                    </div>
                </div>
            )}

            {/* Forgot Password View */}
            {view === 'forgot' && (
                <div className="p-8">
                    <button onClick={() => setView('login')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
                        <p className="text-slate-500 text-sm mt-2">Enter your email address and we'll send you a link to reset your password.</p>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setView('login'); }}>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="name@company.com" 
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-bold shadow-md transition-all">
                            Send Reset Link
                        </button>
                    </form>
                </div>
            )}

            {/* Setup View */}
            {view === 'setup' && (
                <div className="bg-white">
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                             <h2 className="font-bold text-slate-900">System Setup</h2>
                             <span className="text-xs font-medium text-slate-500">Step 1 of 4</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 w-1/4 rounded-full"></div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Property Details</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Property Name</label>
                                    <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Ife Grand Resort" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Address</label>
                                    <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123 Resort Blvd, Lagos" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center justify-between">
                            <button onClick={() => setView('login')} className="text-sm text-slate-500 hover:text-slate-800 font-medium">Cancel</button>
                            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="absolute bottom-4 text-center z-10">
            <p className="text-white/60 text-xs">© 2024 Ife Grand Resort Systems. All rights reserved.</p>
        </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [aiOpen, setAiOpen] = useState(false);

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <AppProvider>
        <Router>
        <Layout user={user} onLogout={() => setUser(null)} onOpenAI={() => setAiOpen(true)}>
            <Routes>
            {/* Dashboards */}
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/dashboard/admin" element={<Dashboard user={user} />} />
            <Route path="/dashboard/frontdesk-manager" element={<Dashboard user={user} />} />
            <Route path="/dashboard/frontdesk-agent" element={<Dashboard user={user} />} />
            <Route path="/dashboard/housekeeping-supervisor" element={<Dashboard user={user} />} />
            <Route path="/dashboard/housekeeping-staff" element={<Dashboard user={user} />} />
            <Route path="/dashboard/maintenance-manager" element={<Dashboard user={user} />} />
            <Route path="/dashboard/maintenance-staff" element={<Dashboard user={user} />} />
            <Route path="/dashboard/accountant" element={<Dashboard user={user} />} />
            <Route path="/dashboard/pos" element={<Dashboard user={user} />} />

            {/* Front Office & Reservations */}
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reservations/tape-chart" element={<Reservations />} />
            <Route path="/reservations/create" element={<Reservations />} />
            <Route path="/reservations/:id" element={<Reservations />} />
            <Route path="/reservations/:id/edit" element={<Reservations />} />
            <Route path="/reservations/:id/cancel" element={<Reservations />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/companies" element={<Guests />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/checkout" element={<CheckOut />} />
            <Route path="/guest-folio/:guestId" element={<Reservations />} />

            {/* Housekeeping */}
            <Route path="/housekeeping" element={<Housekeeping />} />
            <Route path="/housekeeping/assignments" element={<Housekeeping />} />
            <Route path="/housekeeping/inspections" element={<Housekeeping />} />
            <Route path="/housekeeping/tasks" element={<Housekeeping />} />
            <Route path="/housekeeping/report-issue" element={<Housekeeping />} />

            {/* Maintenance */}
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/maintenance/tickets" element={<Maintenance />} />
            <Route path="/maintenance/tickets/create" element={<Maintenance />} />
            <Route path="/maintenance/tickets/:id/assign" element={<Maintenance />} />
            <Route path="/maintenance/reports" element={<Maintenance />} />
            <Route path="/maintenance/work-orders" element={<Maintenance />} />
            <Route path="/maintenance/work-orders/:id" element={<Maintenance />} />

            {/* Accounting */}
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/accounting/general-ledger" element={<Accounting />} />
            <Route path="/accounting/accounts-payable" element={<Accounting />} />
            <Route path="/accounting/accounts-receivable" element={<Accounting />} />
            <Route path="/accounting/invoices" element={<Accounting />} />
            <Route path="/accounting/invoices/create" element={<Accounting />} />
            <Route path="/accounting/bank-balances" element={<Accounting />} />
            <Route path="/accounting/cashflow" element={<Accounting />} />

            {/* POS */}
            <Route path="/pos" element={<POS />} />
            <Route path="/pos/table-map" element={<POS />} />
            <Route path="/pos/orders/create" element={<POS />} />
            <Route path="/pos/orders/:id" element={<POS />} />
            <Route path="/pos/orders/:id/bill" element={<POS />} />
            <Route path="/pos/orders/:id/payment" element={<POS />} />

            {/* Admin & Settings */}
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/create" element={<Users />} />
            <Route path="/admin/users/:id/edit" element={<Users />} />
            <Route path="/admin/users/:id/delete" element={<Users />} />
            <Route path="/admin/users/roles-permissions" element={<Users />} />
            
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/settings/rooms" element={<Settings />} />
            <Route path="/admin/settings/rates" element={<Settings />} />
            <Route path="/admin/settings/payments" element={<Settings />} />
            <Route path="/admin/settings/departments" element={<Settings />} />

            {/* Utilities */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/profile/change-password" element={<Settings />} />
            <Route path="/help" element={<HelpPage />} />

            {/* System Pages */}
            <Route path="/404" element={<Error404 />} />
            <Route path="/403" element={<Error403 />} />
            <Route path="/500" element={<Error500 />} />
            <Route path="*" element={<Error404 />} />
            </Routes>
        </Layout>
        <AIChat isOpen={aiOpen} onClose={() => setAiOpen(false)} context={`User Role: ${user.role}`} />
        </Router>
    </AppProvider>
  );
};

export default App;