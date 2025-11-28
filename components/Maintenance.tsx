
import React, { useState } from 'react';
import { MaintenanceTicket, RoomStatus } from '../types';
import { useAppContext } from '../context/AppContext';
import { 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    MoreHorizontal, 
    Plus, 
    MapPin, 
    Calendar,
    User as UserIcon,
    AlertTriangle,
    X,
    Save,
    ClipboardList,
    BarChart3
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';

export const Maintenance: React.FC = () => {
  const { tickets, addTicket, staff, updateTicket, rooms, updateRoom } = useAppContext();
  const [activeTab, setActiveTab] = useState('tickets');
  const navigate = useNavigate();
  const location = useLocation();

  const isCreate = location.pathname.includes('/tickets/create');
  const maintenanceStaff = staff.filter(s => s.role === 'Maintenance');
  
  // Assign Modal
  const [assignTicketId, setAssignTicketId] = useState<string | null>(null);

  // Status Modal
  const [resolveTicket, setResolveTicket] = useState<MaintenanceTicket | null>(null);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
        case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
        case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'Low': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAssign = (ticketId: string, staffId: string) => {
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
          updateTicket({ ...ticket, assignedTo: staffId, status: ticket.status === 'Open' ? 'In Progress' : ticket.status });
      }
      setAssignTicketId(null);
  };

  const toggleOOO = (ticket: MaintenanceTicket) => {
      const roomNum = ticket.location.replace('Room ', '');
      const room = rooms.find(r => r.number === roomNum);
      
      if (room) {
          if (room.status !== RoomStatus.OOO) {
              updateRoom({ ...room, status: RoomStatus.OOO });
              alert(`Room ${roomNum} marked as Out of Order.`);
          } else {
              alert(`Room ${roomNum} is already Out of Order.`);
          }
      } else {
          alert('Could not link ticket location to a specific room.');
      }
  };

  const finalizeResolve = (status: RoomStatus | 'NoChange') => {
      if (!resolveTicket) return;

      updateTicket({ ...resolveTicket, status: 'Resolved' });
      
      if (status !== 'NoChange') {
          const roomNum = resolveTicket.location.replace('Room ', '');
          const room = rooms.find(r => r.number === roomNum);
          if (room) {
              updateRoom({ ...room, status: status });
          }
      }
      setResolveTicket(null);
  };

  const CreateTicketModal = () => {
      const [success, setSuccess] = useState(false);
      
      const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);

          addTicket({
              id: Date.now().toString(),
              location: formData.get('location') as string,
              priority: formData.get('priority') as any,
              description: formData.get('description') as string,
              status: 'Open',
              createdAt: new Date().toISOString()
          } as MaintenanceTicket);

          setSuccess(true);
          setTimeout(() => {
              navigate('/maintenance');
          }, 1500);
      };

      if (success) {
          return (
             <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm">
                 <div className="bg-white p-8 rounded-xl flex flex-col items-center animate-in zoom-in-95">
                     <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                         <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                     </div>
                     <h3 className="text-lg font-bold">Ticket Created!</h3>
                 </div>
             </div>
          );
      }

      return (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
             <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 animate-in zoom-in-95">
                 <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                     <h3 className="text-xl font-bold text-slate-800">Create Maintenance Ticket</h3>
                     <button onClick={() => navigate('/maintenance')}><X className="w-5 h-5 text-slate-400" /></button>
                 </div>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label className="text-xs font-bold text-slate-600 block mb-1">Issue Location</label>
                         <input name="location" type="text" required placeholder="e.g. Room 304" className="w-full px-4 py-2 border rounded-lg" />
                     </div>
                     <div>
                         <label className="text-xs font-bold text-slate-600 block mb-1">Priority</label>
                         <select name="priority" className="w-full px-4 py-2 border rounded-lg bg-white">
                             <option>Low</option>
                             <option>Medium</option>
                             <option>High</option>
                             <option>Critical</option>
                         </select>
                     </div>
                     <div>
                         <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                         <textarea name="description" required placeholder="Describe the issue..." className="w-full px-4 py-2 border rounded-lg h-32" />
                     </div>
                     <div className="pt-4 flex gap-3">
                         <button type="button" onClick={() => navigate('/maintenance')} className="flex-1 px-4 py-2 border text-slate-600 rounded-lg">Cancel</button>
                         <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Submit Ticket</button>
                     </div>
                 </form>
             </div>
          </div>
      );
  }

  const getAssignee = (id?: string) => staff.find(s => s.id === id);

  const KanbanColumn = ({ title, status, tickets, icon: Icon, colorClass }: { title: string, status: string, tickets: MaintenanceTicket[], icon: any, colorClass: string }) => (
    <div className="flex-1 min-w-[300px] flex flex-col h-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${colorClass} bg-opacity-10`}>
                    <Icon className={`w-4 h-4 ${colorClass.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="font-bold text-slate-700 text-sm">{title}</h3>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold border border-slate-200">{tickets.length}</span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
                <Plus className="w-4 h-4" />
            </button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {tickets.map(ticket => {
                const assignee = getAssignee(ticket.assignedTo);
                
                return (
                    <div 
                        key={ticket.id} 
                        className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group relative"
                        onClick={() => setAssignTicketId(ticket.id)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                            </span>
                            {/* OOO Toggle */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleOOO(ticket); }}
                                className="text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                Mark OOO
                            </button>
                        </div>
                        
                        <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2 leading-snug">{ticket.description}</h4>
                        
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
                            <MapPin className="w-3 h-3" />
                            <span>{ticket.location}</span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            {assignee ? (
                                <div className="flex items-center gap-2" title={`Assigned to ${assignee.name}`}>
                                    <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-full border border-slate-200 object-cover" />
                                    <span className="text-xs text-slate-600 truncate max-w-[80px]">{assignee.name.split(' ')[0]}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 border-dashed">
                                        <UserIcon className="w-3 h-3 text-slate-400" />
                                    </div>
                                    <span className="text-xs text-slate-400 italic">Unassigned</span>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                            </div>
                        </div>

                        {/* Resolve Button */}
                        {ticket.status !== 'Resolved' && (
                            <div className="absolute inset-0 bg-white/95 items-center justify-center hidden group-hover:flex rounded-lg z-10 gap-2 p-2">
                                <button onClick={(e) => { e.stopPropagation(); setResolveTicket(ticket); }} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-emerald-700 w-full">Mark Resolved</button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );

  const WorkOrdersView = () => (
      <div className="max-w-4xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Active Work Orders</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Location</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Technician</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                          <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {tickets.filter(t => t.status === 'In Progress').map(ticket => (
                          <tr key={ticket.id}>
                              <td className="px-6 py-4 font-mono text-sm text-slate-600">WO-{ticket.id}</td>
                              <td className="px-6 py-4 font-bold text-slate-800">{ticket.location}</td>
                              <td className="px-6 py-4 text-sm">{getAssignee(ticket.assignedTo)?.name || 'Unassigned'}</td>
                              <td className="px-6 py-4"><span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">In Progress</span></td>
                              <td className="px-6 py-4">
                                  <button onClick={() => setResolveTicket(ticket)} className="text-blue-600 hover:underline text-sm font-bold">Complete</button>
                              </td>
                          </tr>
                      ))}
                      {tickets.filter(t => t.status === 'In Progress').length === 0 && (
                          <tr><td colSpan={5} className="text-center py-8 text-slate-400">No active work orders.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const ReportsView = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg"><BarChart3 className="w-6 h-6 text-blue-600"/></div>
                  <h3 className="font-bold text-slate-800">Monthly Ticket Volume</h3>
              </div>
              <div className="h-48 flex items-end gap-2 px-4 pb-2 border-b border-slate-100">
                  <div className="w-full bg-blue-200 h-[60%] rounded-t"></div>
                  <div className="w-full bg-blue-500 h-[80%] rounded-t"></div>
                  <div className="w-full bg-blue-300 h-[40%] rounded-t"></div>
                  <div className="w-full bg-blue-600 h-[90%] rounded-t"></div>
              </div>
              <p className="text-center text-xs text-slate-500 mt-2">Tickets per week (Current Month)</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-rose-100 rounded-lg"><AlertTriangle className="w-6 h-6 text-rose-600"/></div>
                   <h3 className="font-bold text-slate-800">Issues by Category</h3>
              </div>
              <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span className="text-slate-600">Plumbing</span><span className="font-bold">42%</span></div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[42%]"></div></div>
                  
                  <div className="flex justify-between text-sm"><span className="text-slate-600">Electrical</span><span className="font-bold">28%</span></div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[28%]"></div></div>
                  
                  <div className="flex justify-between text-sm"><span className="text-slate-600">HVAC</span><span className="font-bold">15%</span></div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-rose-500 h-full w-[15%]"></div></div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] relative">
      {isCreate && <CreateTicketModal />}
      
      {/* Assign Modal */}
      {assignTicketId && (
           <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95">
                  <h3 className="font-bold text-lg mb-4">Assign Technician</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                      {maintenanceStaff.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => handleAssign(assignTicketId, s.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all text-left"
                          >
                              <img src={s.avatar} className="w-8 h-8 rounded-full" alt="" />
                              <span className="font-medium text-slate-700">{s.name}</span>
                          </button>
                      ))}
                      {maintenanceStaff.length === 0 && <p className="text-sm text-slate-400 text-center">No maintenance staff available.</p>}
                  </div>
                  <button onClick={() => setAssignTicketId(null)} className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-slate-500">Cancel</button>
              </div>
          </div>
      )}

      {/* Resolve / Room Status Modal */}
      {resolveTicket && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
                  <h3 className="font-bold text-lg mb-2">Resolve Ticket</h3>
                  <p className="text-slate-500 mb-6 text-sm">Ticket for {resolveTicket.location} will be closed. Update room status?</p>
                  
                  <div className="space-y-3">
                      <button onClick={() => finalizeResolve(RoomStatus.CLEAN)} className="w-full p-3 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-left hover:bg-emerald-100 flex justify-between">
                          <span>Mark Room Available / Clean</span> <CheckCircle2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => finalizeResolve(RoomStatus.INSPECT)} className="w-full p-3 border border-amber-200 bg-amber-50 text-amber-700 rounded-lg font-bold text-left hover:bg-amber-100 flex justify-between">
                          <span>Mark for Inspection</span> <ClipboardList className="w-5 h-5" />
                      </button>
                      <button onClick={() => finalizeResolve('NoChange')} className="w-full p-3 border border-slate-200 text-slate-600 rounded-lg font-medium text-left hover:bg-slate-50">
                          Do Not Change Room Status
                      </button>
                  </div>
                  <button onClick={() => setResolveTicket(null)} className="mt-4 w-full py-2 text-slate-400 hover:text-slate-600">Cancel</button>
              </div>
          </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex gap-4 items-center overflow-x-auto">
            <h1 className="text-2xl font-bold text-slate-800 whitespace-nowrap">Maintenance</h1>
            <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
            <div className="flex gap-2">
                 {['tickets', 'work-orders', 'reports'].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:text-slate-800'}`}
                     >
                        {tab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                     </button>
                 ))}
            </div>
        </div>
        <button 
            onClick={() => navigate('/maintenance/tickets/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition-colors whitespace-nowrap w-fit"
        >
            <Plus className="w-4 h-4" /> Create Ticket
        </button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        {activeTab === 'tickets' && (
             <div className="flex gap-6 h-full min-w-full lg:min-w-0">
                <KanbanColumn 
                    title="To Do" 
                    status="Open" 
                    tickets={tickets.filter(t => t.status === 'Open')} 
                    icon={AlertCircle}
                    colorClass="bg-rose-500 text-rose-500"
                />
                <KanbanColumn 
                    title="In Progress" 
                    status="In Progress" 
                    tickets={tickets.filter(t => t.status === 'In Progress')} 
                    icon={Clock}
                    colorClass="bg-amber-500 text-amber-500"
                />
                <KanbanColumn 
                    title="Resolved" 
                    status="Resolved" 
                    tickets={tickets.filter(t => t.status === 'Resolved')} 
                    icon={CheckCircle2}
                    colorClass="bg-emerald-500 text-emerald-500"
                />
            </div>
        )}
        {activeTab === 'work-orders' && <WorkOrdersView />}
        {activeTab === 'reports' && <ReportsView />}
      </div>
    </div>
  );
};
