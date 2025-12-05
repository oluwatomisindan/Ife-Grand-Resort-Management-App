import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
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
import { RoomRevenue } from './components/RoomRevenue';
import { User } from './types';
import { Building2, Lock, ArrowLeft, Mail, Loader2, User as UserIcon, AlertCircle, Eye, EyeOff } from 'lucide-react';

// Authentication Screens Component
const AuthScreen = () => {
  const { signIn, signUp } = useAuth();
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signUp(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

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
                <div className="p-6 md:p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                            <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Ife Grand Resort</h1>
                        <p className="text-slate-500 text-sm mt-1">Management Portal</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                                    placeholder="••••••••" 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button 
                            onClick={() => setView('signup')} 
                            className="text-sm text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            First time setup? <span className="font-semibold">Create Super Admin</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Sign Up View */}
            {view === 'signup' && (
                <div className="p-6 md:p-8">
                    <button onClick={() => setView('login')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/20">
                            <UserIcon className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Create Super Admin</h1>
                        <p className="text-slate-500 text-sm mt-1">Set up your management account</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                                    placeholder="John Doe" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                                    placeholder="admin@iferesort.com" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                                    placeholder="••••••••" 
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-bold shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex justify-center items-center"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>
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
        </div>
        <div className="absolute bottom-4 text-center z-10">
            <p className="text-white/60 text-xs">© 2024 Ife Grand Resort Systems. All rights reserved.</p>
        </div>
    </div>
  );
};

// Main App Component with Auth
const AppContent = () => {
  const { currentUser, signOut: authSignOut } = useAuth();
  const [aiOpen, setAiOpen] = useState(false);

  if (!currentUser) {
    return <AuthScreen />;
  }

  // Convert UserData to User type for compatibility
  const user: User = {
    id: currentUser.uid,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    avatar: currentUser.avatar
  };

  return (
    <AppProvider>
        <Router>
        <Layout user={user} onLogout={authSignOut} onOpenAI={() => setAiOpen(true)}>
            <Routes>
            {/* Dashboards */}
            <Route path="/" element={<Dashboard user={user} />} />
            
            {/* Front Desk */}
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reservations/create" element={<Reservations />} />
            <Route path="/reservations/:id/edit" element={<Reservations />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/check-out" element={<CheckOut />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/guests/create" element={<Guests />} />
            <Route path="/guests/:id/edit" element={<Guests />} />
            <Route path="/guests/companies" element={<Guests />} />
            <Route path="/guests/companies/create" element={<Guests />} />
            <Route path="/guests/companies/:id/edit" element={<Guests />} />
            
            {/* Housekeeping */}
            <Route path="/housekeeping" element={<Housekeeping />} />
            
            {/* Maintenance */}
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/maintenance/create" element={<Maintenance />} />
            <Route path="/maintenance/:id/edit" element={<Maintenance />} />
            
            {/* Restaurant & Bar */}
            <Route path="/pos" element={<POS />} />
            
            {/* Accounting */}
            <Route path="/accounting" element={<Accounting />} />
            <Route path="/accounting/invoices/create" element={<Accounting />} />
            <Route path="/revenue/rooms" element={<RoomRevenue />} />
            
            {/* Admin */}
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/users/create" element={<Users />} />
            <Route path="/admin/users/:id/edit" element={<Users />} />
            <Route path="/admin/users/:id/delete" element={<Users />} />
            <Route path="/admin/settings" element={<Settings />} />
            
            {/* Utilities */}
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />
            <Route path="/help" element={<HelpPage />} />
            
            {/* Error Pages */}
            <Route path="/error/403" element={<Error403 />} />
            <Route path="/error/500" element={<Error500 />} />
            <Route path="*" element={<Error404 />} />
            </Routes>
        </Layout>
        {aiOpen && <AIChat onClose={() => setAiOpen(false)} />}
        </Router>
    </AppProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;