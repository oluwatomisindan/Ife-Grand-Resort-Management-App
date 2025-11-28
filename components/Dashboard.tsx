
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, BedDouble, DollarSign, CalendarCheck, 
  Briefcase, LogOut, LogIn, Plus, AlertTriangle, CheckCircle2, Clock, Wrench, CreditCard, Receipt, FileText, X, Wine, Utensils
} from 'lucide-react';
import { User, UserRole, RoomStatus, MaintenanceTicket } from '../types';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { POS_TABLES, POS_MENU } from '../constants';

interface DashboardProps {
  user: User;
}

// -- Shared Components --

const StatCard = ({ title, value, change, icon: Icon, colorClass, subtext }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-full">
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
        {change !== undefined && (
          <span className={`text-sm font-medium flex items-center ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
    {subtext && <p className="text-xs text-slate-400 mt-3">{subtext}</p>}
  </div>
);

const SectionHeader = ({ title, action }: { title: string, action?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    {action}
  </div>
);

// -- Role Specific Views --

const AdminDashboard = () => {
  const revenueData = [
    { name: 'Jan', revenue: 45000, expenses: 32000 },
    { name: 'Feb', revenue: 52000, expenses: 34000 },
    { name: 'Mar', revenue: 48000, expenses: 31000 },
    { name: 'Apr', revenue: 61000, expenses: 40000 },
    { name: 'May', revenue: 55000, expenses: 38000 },
    { name: 'Jun', revenue: 67000, expenses: 42000 },
    { name: 'Jul', revenue: 72000, expenses: 45000 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="RevPAR" value="$142.50" change={5.2} icon={DollarSign} colorClass="bg-blue-600 text-blue-600" subtext="Revenue Per Available Room" />
        <StatCard title="ADR" value="$185.00" change={2.1} icon={Briefcase} colorClass="bg-indigo-600 text-indigo-600" subtext="Average Daily Rate" />
        <StatCard title="Occupancy Rate" value="78.4%" change={-1.4} icon={BedDouble} colorClass="bg-teal-600 text-teal-600" subtext="Vs. 82% target" />
        <StatCard title="Total Revenue" value="$452k" change={12.5} icon={DollarSign} colorClass="bg-slate-600 text-slate-600" subtext="YTD Revenue" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <SectionHeader 
          title="Financial Overview" 
          action={
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1 outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          }
        />
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fillOpacity={0} fill="transparent" strokeDasharray="5 5" name="Expenses" />
              <Legend iconType="circle" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const AccountantDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Accounts Receivable" value="$24,500" change={-2.4} icon={CreditCard} colorClass="bg-blue-600 text-blue-600" subtext="Pending payments" />
                <StatCard title="Accounts Payable" value="$12,350" change={1.2} icon={Receipt} colorClass="bg-rose-600 text-rose-600" subtext="Due this week" />
                <StatCard title="Cash on Hand" value="$185,000" change={4.5} icon={DollarSign} colorClass="bg-emerald-600 text-emerald-600" subtext="Healthy liquidity" />
                <StatCard title="Net Profit (MoM)" value="+15%" change={15.0} icon={Briefcase} colorClass="bg-indigo-600 text-indigo-600" subtext="Growing steady" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <SectionHeader title="Recent Invoices" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0">
                                <div>
                                    <p className="font-medium text-slate-800">INV-2024-00{i}</p>
                                    <p className="text-xs text-slate-500">Corporate Booking - Acme Corp</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">$1,250.00</p>
                                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Paid</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <SectionHeader title="Expense Breakdown" />
                     <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={[{name: 'Labor', value: 45}, {name: 'Supplies', value: 20}, {name: 'Utilities', value: 15}, {name: 'Food', value: 20}]} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8">
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#ef4444" />
                                    <Cell fill="#f59e0b" />
                                    <Cell fill="#10b981" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>
        </div>
    )
}

const FrontDeskDashboard = () => {
  const { rooms, updateRoom, addTicket, reservations } = useAppContext();
  const navigate = useNavigate();

  // Use real reservations from context
  const today = new Date().toISOString().split('T')[0];
  const arrivals = reservations.filter(r => r.checkIn === '2024-05-12' || r.status === 'Confirmed'); // Mock date logic for demo

  const reportIssue = (room: any) => {
    const issue = prompt(`Report maintenance issue for Room ${room.number}:`);
    if (issue) {
        addTicket({
            id: Date.now().toString(),
            location: `Room ${room.number}`,
            description: issue,
            priority: 'Medium',
            status: 'Open',
            createdAt: new Date().toISOString()
        } as MaintenanceTicket);
        
        // Also update room to OOO potentially?
        if(window.confirm("Mark room as Out of Order?")) {
            updateRoom({ ...room, status: RoomStatus.OOO });
        }
        
        alert('Ticket created successfully!');
    }
  };

  const markDirty = (room: any) => {
      updateRoom({ ...room, status: RoomStatus.DIRTY });
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Arrivals Today" value={arrivals.length.toString()} icon={LogIn} colorClass="bg-blue-600 text-blue-600" subtext="Pending Check-in" />
        <StatCard title="Departures Today" value="8" icon={LogOut} colorClass="bg-orange-500 text-orange-500" subtext="2 Pending" />
        <StatCard title="In-House Guests" value="45" icon={Users} colorClass="bg-teal-600 text-teal-600" subtext="68% Occupancy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Arrivals List */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <SectionHeader title="Live Room Grid" />
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {rooms.map(room => (
                        <div key={room.id} className="group relative">
                            <div 
                                className={`
                                    p-3 rounded-lg border-2 text-center cursor-pointer transition-all hover:scale-105
                                    ${room.status === RoomStatus.CLEAN ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 
                                      room.status === RoomStatus.DIRTY ? 'bg-rose-50 border-rose-500 text-rose-700' :
                                      room.status === RoomStatus.INSPECT ? 'bg-amber-50 border-amber-500 text-amber-700' : 
                                      'bg-slate-100 border-slate-400 text-slate-600'}
                                `}
                            >
                                <span className="font-bold block text-lg">{room.number}</span>
                                <span className="text-[10px] uppercase font-bold">{room.status.substring(0,3)}</span>
                            </div>
                            
                            {/* Hover Menu */}
                            <div className="absolute top-full left-0 w-32 bg-white shadow-xl rounded-lg border border-slate-200 z-20 hidden group-hover:block p-1">
                                <button onClick={() => reportIssue(room)} className="w-full text-left px-2 py-1.5 hover:bg-slate-50 text-xs text-slate-700 flex gap-2">
                                    <Wrench className="w-3 h-3" /> Report Issue
                                </button>
                                <button onClick={() => markDirty(room)} className="w-full text-left px-2 py-1.5 hover:bg-slate-50 text-xs text-slate-700 flex gap-2">
                                    <Users className="w-3 h-3" /> Mark Dirty
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <SectionHeader title="Upcoming Arrivals" />
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                        <th className="px-4 py-3 rounded-l-lg">Guest</th>
                        <th className="px-4 py-3">Room</th>
                        <th className="px-4 py-3">Arrival</th>
                        <th className="px-4 py-3 rounded-r-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {arrivals.slice(0, 5).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-medium text-slate-900">{item.guestName}</td>
                            <td className="px-4 py-3 text-slate-500">
                                {rooms.find(r => r.id === item.roomId)?.number || 'Unassigned'}
                            </td>
                            <td className="px-4 py-3 text-slate-500">{item.checkIn}</td>
                            <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.status === 'Checked In' ? 'bg-emerald-100 text-emerald-700' :
                                item.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {item.status}
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <SectionHeader title="Quick Actions" />
          <div className="space-y-3">
            <button 
                onClick={() => navigate('/reservations/create')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Reservation
            </button>
            <button 
                onClick={() => navigate('/checkin')}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Guest Check-In
            </button>
            <button 
                onClick={() => navigate('/guests')}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Users className="w-4 h-4" /> Guest Lookup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HousekeepingDashboard = () => {
    const { rooms } = useAppContext();
    const pieData = [
      { name: 'Clean', value: rooms.filter(r => r.status === RoomStatus.CLEAN).length, color: '#10b981' }, 
      { name: 'Dirty', value: rooms.filter(r => r.status === RoomStatus.DIRTY).length, color: '#f43f5e' },
      { name: 'Inspect', value: rooms.filter(r => r.status === RoomStatus.INSPECT).length, color: '#f59e0b' },
      { name: 'OOO', value: rooms.filter(r => r.status === RoomStatus.OOO).length, color: '#64748b' },
    ];
  
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Overview Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Room Status</h3>
            <p className="text-sm text-slate-500 mb-6">Real-time housekeeping status</p>
            
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-3xl font-bold text-slate-800">{rooms.length}</span>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Total</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Staff & Priority */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard title="Staff On Duty" value="8" icon={Users} colorClass="bg-blue-600 text-blue-600" subtext="2 Supervisors, 6 Attendants" />
              <StatCard title="Priority Rooms" value="5" icon={Clock} colorClass="bg-rose-600 text-rose-600" subtext="Arrivals within 2 hours" />
            </div>
  
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1">
              <SectionHeader title="Priority Cleaning Queue" />
              <div className="space-y-4">
                {rooms.filter(r => r.status === RoomStatus.DIRTY).slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-blue-200 transition-colors bg-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 font-bold">
                        {item.number}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.type}</p>
                        <p className="text-xs text-slate-500">Status: {item.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

const MaintenanceDashboard = () => {
    const { tickets } = useAppContext();
    const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Open Tickets" value={tickets.filter(t => t.status === 'Open').length.toString()} icon={AlertTriangle} colorClass="bg-rose-600 text-rose-600" subtext="Requires Attention" />
        <StatCard title="In Progress" value={tickets.filter(t => t.status === 'In Progress').length.toString()} icon={Clock} colorClass="bg-amber-500 text-amber-500" subtext="Being worked on" />
        <StatCard title="Resolved" value={tickets.filter(t => t.status === 'Resolved').length.toString()} icon={CheckCircle2} colorClass="bg-emerald-600 text-emerald-600" subtext="Closed Tickets" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <SectionHeader 
          title="Active Work Orders" 
          action={<button onClick={() => navigate('/maintenance/tickets/create')} className="text-sm font-medium text-blue-600 hover:underline">+ New Ticket</button>}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {tickets.slice(0, 5).map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/50 group">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      ticket.priority === 'Critical' || ticket.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                      ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">{ticket.id.toUpperCase()}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{ticket.location}</td>
                  <td className="px-4 py-3 text-slate-600 truncate max-w-xs">{ticket.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${
                          ticket.status === 'Open' ? 'bg-rose-500' :
                          ticket.status === 'In Progress' ? 'bg-amber-500' : 'bg-emerald-500'
                       }`}></span>
                       {ticket.status}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => navigate('/maintenance')} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Wrench className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const BarDashboard = () => {
    const navigate = useNavigate();
    const busyTables = POS_TABLES.filter(t => t.status === 'Occupied').length;
    const reservedTables = POS_TABLES.filter(t => t.status === 'Reserved').length;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Tables" value={busyTables.toString()} change={20} icon={Utensils} colorClass="bg-blue-600 text-blue-600" subtext={`${POS_TABLES.length - busyTables} Available`} />
                <StatCard title="Pending Orders" value="4" icon={Clock} colorClass="bg-amber-500 text-amber-500" subtext="Kitchen Queue" />
                <StatCard title="Today's Sales" value="$1,250" change={15} icon={DollarSign} colorClass="bg-emerald-600 text-emerald-600" subtext="Shift Total" />
                <StatCard title="Reservations" value={reservedTables.toString()} icon={CalendarCheck} colorClass="bg-indigo-600 text-indigo-600" subtext="Upcoming tonight" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <SectionHeader title="Popular Items Today" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {POS_MENU.slice(0, 4).map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                                <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                                    <p className="text-xs text-slate-500">{item.category}</p>
                                </div>
                                <div className="ml-auto font-bold text-blue-600">${item.price}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <SectionHeader title="Quick Actions" />
                    <div className="space-y-3">
                        <button 
                            onClick={() => navigate('/pos')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> New Order
                        </button>
                        <button 
                            onClick={() => navigate('/pos/table-map')}
                            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                        >
                            <Wine className="w-4 h-4" /> View Table Map
                        </button>
                        <button className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                             <Receipt className="w-4 h-4" /> Close Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// -- Main Component --

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { generateReport } = useAppContext();
  const [showReportModal, setShowReportModal] = useState(false);

  const ReportModal = () => (
      <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Generate Report</h3>
                  <button onClick={() => setShowReportModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Report Type</label>
                      <select id="reportType" className="w-full px-4 py-2 border rounded-lg bg-white">
                          <option>Occupancy Report</option>
                          <option>Financial Summary</option>
                          <option>Maintenance Log</option>
                          <option>Housekeeping Efficiency</option>
                      </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Start Date</label>
                          <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">End Date</label>
                          <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                  </div>
                  <button 
                      onClick={() => {
                          generateReport('Custom', {start: '2024-01-01', end: '2024-02-01'});
                          setShowReportModal(false);
                      }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 mt-2"
                  >
                      Download PDF
                  </button>
              </div>
          </div>
      </div>
  );

  const getDashboard = () => {
    switch (user.role) {
        case UserRole.SUPER_ADMIN: return <AdminDashboard />;
        case UserRole.FRONT_DESK:
        case UserRole.RECEPTIONIST: return <FrontDeskDashboard />;
        case UserRole.HOUSEKEEPING: return <HousekeepingDashboard />;
        case UserRole.MAINTENANCE: return <MaintenanceDashboard />;
        case UserRole.ACCOUNTANT: return <AccountantDashboard />;
        case UserRole.BAR_RECEPTIONIST:
        case UserRole.RESTAURANT: return <BarDashboard />;
        default: return <AdminDashboard />;
    }
  };

  return (
    <div className="relative">
        {/* Report Button (Hidden for Receptionist/Bar) */}
        {user.role !== UserRole.RECEPTIONIST && user.role !== UserRole.BAR_RECEPTIONIST && (
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition-colors"
                >
                    <FileText className="w-4 h-4" /> Generate Report
                </button>
            </div>
        )}

        {showReportModal && <ReportModal />}
        {getDashboard()}
    </div>
  );
};
