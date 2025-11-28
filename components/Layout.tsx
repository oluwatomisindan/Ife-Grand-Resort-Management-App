import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarRange, 
  Hotel, 
  Wrench, 
  Utensils, 
  Receipt, 
  Settings, 
  LogOut, 
  Menu,
  Bell,
  Search,
  Bot,
  Building2,
  Briefcase,
  UserCog,
  FileText,
  Activity
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  onOpenAI: () => void;
}

const SidebarGroup = ({ title, children, collapsed }: { title: string; children?: React.ReactNode; collapsed: boolean }) => {
  // Only render group if it has children (valid permissions)
  if (!children) return null;
  // If children is an array and empty, don't render
  if (Array.isArray(children) && children.filter(Boolean).length === 0) return null;

  return (
    <div className="mb-4">
      {!collapsed && <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</h3>}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

const SidebarItem = ({ to, icon: Icon, label, collapsed }: { to: string; icon: any; label: string; collapsed: boolean }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-l-4 ${
        isActive
          ? 'border-blue-500 bg-slate-800 text-white'
          : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`
    }
  >
    <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
    {!collapsed && <span>{label}</span>}
  </NavLink>
);

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onOpenAI }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    // Format complex paths like 'housekeeping/inspections'
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // RBAC Helper
  const hasAccess = (allowedRoles: UserRole[]) => allowedRoles.includes(user.role);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white flex flex-col transition-all duration-300 shadow-xl z-20 border-r border-slate-800`}
      >
        <div className="h-16 flex items-center justify-between px-4 bg-slate-950">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
               <Building2 className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && <span className="text-lg font-bold tracking-tight text-white">IFE GRAND</span>}
          </div>
          {sidebarOpen && (
             <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <Menu className="w-5 h-5" />
             </button>
          )}
        </div>

        {!sidebarOpen && (
             <button onClick={() => setSidebarOpen(true)} className="w-full py-4 text-slate-400 hover:text-white flex justify-center">
                <Menu className="w-6 h-6" />
             </button>
        )}

        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide">
          <SidebarGroup title="Overview" collapsed={!sidebarOpen}>
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={!sidebarOpen} />
          </SidebarGroup>

          {/* Front Office - Accessible to Admin, Front Desk, Receptionist */}
          {hasAccess([UserRole.SUPER_ADMIN, UserRole.FRONT_DESK, UserRole.RECEPTIONIST]) && (
            <SidebarGroup title="Front Office" collapsed={!sidebarOpen}>
                {hasAccess([UserRole.SUPER_ADMIN, UserRole.FRONT_DESK]) && (
                    <SidebarItem to="/reservations" icon={CalendarRange} label="Reservations" collapsed={!sidebarOpen} />
                )}
                <SidebarItem to="/checkin" icon={Briefcase} label="Check-In" collapsed={!sidebarOpen} />
                <SidebarItem to="/checkout" icon={LogOut} label="Check-Out" collapsed={!sidebarOpen} />
                <SidebarItem to="/guests" icon={Users} label="Guests & Companies" collapsed={!sidebarOpen} />
            </SidebarGroup>
          )}

          <SidebarGroup title="Operations" collapsed={!sidebarOpen}>
            {hasAccess([UserRole.SUPER_ADMIN, UserRole.HOUSEKEEPING]) && (
                <SidebarItem to="/housekeeping" icon={Hotel} label="Housekeeping" collapsed={!sidebarOpen} />
            )}
            {hasAccess([UserRole.SUPER_ADMIN, UserRole.MAINTENANCE]) && (
                <SidebarItem to="/maintenance" icon={Wrench} label="Maintenance" collapsed={!sidebarOpen} />
            )}
            {hasAccess([UserRole.SUPER_ADMIN, UserRole.RESTAURANT, UserRole.BAR_RECEPTIONIST]) && (
                <SidebarItem to="/pos" icon={Utensils} label="Restaurant POS" collapsed={!sidebarOpen} />
            )}
          </SidebarGroup>

          {hasAccess([UserRole.SUPER_ADMIN, UserRole.ACCOUNTANT]) && (
            <SidebarGroup title="Finance & Admin" collapsed={!sidebarOpen}>
                {hasAccess([UserRole.SUPER_ADMIN]) && (
                    <SidebarItem to="/admin/users" icon={UserCog} label="User Management" collapsed={!sidebarOpen} />
                )}
                <SidebarItem to="/accounting" icon={Receipt} label="Accounting" collapsed={!sidebarOpen} />
                {hasAccess([UserRole.SUPER_ADMIN]) && (
                    <SidebarItem to="/admin/settings" icon={Settings} label="System Settings" collapsed={!sidebarOpen} />
                )}
            </SidebarGroup>
          )}

          <SidebarGroup title="Utilities" collapsed={!sidebarOpen}>
            <SidebarItem to="/activity-log" icon={Activity} label="Activity Log" collapsed={!sidebarOpen} />
            <SidebarItem to="/notifications" icon={Bell} label="Notifications" collapsed={!sidebarOpen} />
            <SidebarItem to="/help" icon={FileText} label="Help Center" collapsed={!sidebarOpen} />
          </SidebarGroup>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <img src={user.avatar} alt="User" className="w-9 h-9 rounded-full border border-slate-600" />
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-slate-200">{user.name}</p>
                <Link to="/profile" className="text-xs text-slate-500 truncate hover:text-blue-400">View Profile</Link>
              </div>
            )}
            {sidebarOpen && (
               <button onClick={onLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                 <LogOut className="w-5 h-5" />
               </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800 capitalize">{getPageTitle()}</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 rounded-lg text-sm transition-all outline-none"
              />
            </div>
            
            <NavLink to="/notifications" className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </NavLink>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <button 
                onClick={onOpenAI}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95 group"
            >
                <Bot className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                <span className="text-sm font-medium">Ask AI</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};