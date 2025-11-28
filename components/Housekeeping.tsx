
import React, { useState } from 'react';
import { RoomStatus, Staff, MaintenanceTicket } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Filter, MoreHorizontal, Clock, Brush, User as UserIcon, ClipboardList, AlertOctagon, Wrench, X, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Housekeeping: React.FC = () => {
  const { rooms, staff, updateRoom, addTicket } = useAppContext();
  const [activeTab, setActiveTab] = useState('assignments');
  const [filter, setFilter] = useState<RoomStatus | 'All'>('All');
  
  // Modals
  const [assignModalRoom, setAssignModalRoom] = useState<string | null>(null);
  const [reportIssueModal, setReportIssueModal] = useState(false);

  const housekeepingStaff = staff.filter(s => s.role === 'Housekeeping');

  const getStatusStyles = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.CLEAN: 
        return { 
            badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
            border: 'border-emerald-500',
            icon: CheckCircle2,
            bg: 'bg-white'
        };
      case RoomStatus.DIRTY: 
        return { 
            badge: 'bg-rose-100 text-rose-700 border-rose-200', 
            border: 'border-rose-500',
            icon: XCircle,
            bg: 'bg-rose-50/30'
        };
      case RoomStatus.INSPECT: 
        return { 
            badge: 'bg-amber-100 text-amber-700 border-amber-200', 
            border: 'border-amber-500',
            icon: AlertTriangle,
            bg: 'bg-amber-50/30'
        };
      case RoomStatus.OOO: 
        return { 
            badge: 'bg-slate-100 text-slate-700 border-slate-200', 
            border: 'border-slate-500',
            icon: AlertTriangle,
            bg: 'bg-slate-50'
        };
      default: return { badge: '', border: '', icon: CheckCircle2, bg: 'bg-white' };
    }
  };

  const handleAssign = (roomId: string, staffId: string) => {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
          updateRoom({ ...room, assignedStaffId: staffId });
      }
      setAssignModalRoom(null);
  }

  const handleMarkClean = (e: React.MouseEvent, roomId: string) => {
      e.stopPropagation();
      const room = rooms.find(r => r.id === roomId);
      if (room) {
          updateRoom({ ...room, status: RoomStatus.CLEAN });
      }
  }

  const handleMarkInspected = (roomId: string) => {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
          updateRoom({ ...room, status: RoomStatus.CLEAN });
      }
  }

  const handleSubmitIssue = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const roomNumber = formData.get('roomNumber') as string;
      const description = formData.get('description') as string;

      if(roomNumber && description) {
          addTicket({
              id: Date.now().toString(),
              location: `Room ${roomNumber}`,
              description: description,
              priority: 'Medium',
              status: 'Open',
              createdAt: new Date().toISOString()
          } as MaintenanceTicket);
          
          alert("Maintenance Ticket Created Successfully!");
          setReportIssueModal(false);
          setActiveTab('assignments');
      }
  }

  const filteredRooms = filter === 'All' ? rooms : rooms.filter(r => r.status === filter);
  const getAssignee = (id?: string) => staff.find(s => s.id === id);

  const renderAssignments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map(room => {
            const styles = getStatusStyles(room.status);
            const StatusIcon = styles.icon;
            const assignee = getAssignee(room.assignedStaffId);
            
            return (
                <div 
                    key={room.id} 
                    className={`${styles.bg} border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group cursor-pointer`}
                    onClick={() => setAssignModalRoom(room.id)}
                >
                    <div className={`absolute top-0 left-0 w-full h-1 ${styles.border.replace('border-', 'bg-')}`}></div>
                    <div className="flex justify-between items-start mb-4 mt-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-slate-800">{room.number}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border border-slate-200 px-1.5 py-0.5 rounded">{room.type}</span>
                            </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wide ${styles.badge}`}>
                            <StatusIcon className="w-3 h-3" />
                            {room.status}
                        </span>
                    </div>
                    <div className="mb-4">
                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-2">Assigned To</p>
                        {assignee ? (
                            <div className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-slate-100">
                                <img src={assignee.avatar} alt={assignee.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">{assignee.name}</p>
                                    <p className="text-xs text-slate-400">Housekeeper</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-dashed border-slate-300">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                </div>
                                <p className="text-xs text-slate-400 italic">Unassigned (Click to Assign)</p>
                            </div>
                        )}
                    </div>
                    
                    {room.status === RoomStatus.DIRTY && (
                        <button 
                            onClick={(e) => handleMarkClean(e, room.id)}
                            className="w-full py-2 bg-emerald-600 text-white rounded-md text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Mark Clean
                        </button>
                    )}
                </div>
            );
        })}
    </div>
  );

  const renderInspections = () => {
      const roomsToInspect = rooms.filter(r => r.status === RoomStatus.INSPECT);
      
      return (
          <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="font-bold text-lg text-slate-800">Pending Inspections</h3>
              {roomsToInspect.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                      <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500">No rooms pending inspection.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {roomsToInspect.map(room => (
                          <div key={room.id} className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm flex justify-between items-center">
                              <div>
                                  <div className="flex items-center gap-3 mb-1">
                                      <span className="text-2xl font-bold text-slate-800">{room.number}</span>
                                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-bold">Pending</span>
                                  </div>
                                  <p className="text-sm text-slate-500">{room.type} Room</p>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={() => setReportIssueModal(true)} className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-sm font-bold">
                                      Fail / Report
                                  </button>
                                  <button onClick={() => handleMarkInspected(room.id)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                                      <Check className="w-4 h-4" /> Pass
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  }

  const renderTasks = () => (
      <div className="max-w-4xl mx-auto">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Ad-Hoc Tasks</h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {[
                  { id: 1, task: "Restock Laundry Cart - 2nd Floor", status: "Pending", assignee: "Maria G." },
                  { id: 2, task: "Deep Clean Lobby Carpets", status: "In Progress", assignee: "Sarah J." },
                  { id: 3, task: "Window Washing - Suite 301", status: "Pending", assignee: "Unassigned" },
              ].map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${task.status === 'Pending' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                          <div>
                              <p className="font-medium text-slate-800">{task.task}</p>
                              <p className="text-xs text-slate-500">Assigned: {task.assignee}</p>
                          </div>
                      </div>
                      <button className="text-xs font-bold text-blue-600 hover:underline">Manage</button>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="space-y-6 relative">
      {/* Assignment Modal */}
      {assignModalRoom && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm animate-in zoom-in-95">
                  <h3 className="font-bold text-lg mb-4">Assign Staff to Room {rooms.find(r => r.id === assignModalRoom)?.number}</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                      {housekeepingStaff.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => handleAssign(assignModalRoom, s.id)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all text-left"
                          >
                              <img src={s.avatar} className="w-8 h-8 rounded-full" alt="" />
                              <span className="font-medium text-slate-700">{s.name}</span>
                          </button>
                      ))}
                      {housekeepingStaff.length === 0 && <p className="text-sm text-slate-400 text-center">No staff available.</p>}
                  </div>
                  <button onClick={() => setAssignModalRoom(null)} className="mt-4 w-full py-2 border border-slate-200 rounded-lg text-slate-500">Cancel</button>
              </div>
          </div>
      )}

      {/* Report Issue Modal (Global for Housekeeping) */}
      {reportIssueModal && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center backdrop-blur-sm p-4">
              <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold text-lg">Report Maintenance Issue</h3>
                       <button onClick={() => setReportIssueModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <form onSubmit={handleSubmitIssue} className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Room Number / Location</label>
                          <input name="roomNumber" type="text" required placeholder="e.g. 101" className="w-full px-4 py-2 border rounded-lg" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-600 block mb-1">Description</label>
                          <textarea name="description" required placeholder="Describe issue..." className="w-full px-4 py-2 border rounded-lg h-32"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700">Submit Ticket</button>
                  </form>
              </div>
          </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { label: 'Clean', count: rooms.filter(r => r.status === RoomStatus.CLEAN).length, color: 'text-emerald-600', icon: CheckCircle2 },
            { label: 'Dirty', count: rooms.filter(r => r.status === RoomStatus.DIRTY).length, color: 'text-rose-600', icon: Brush },
            { label: 'Inspect', count: rooms.filter(r => r.status === RoomStatus.INSPECT).length, color: 'text-amber-600', icon: Clock },
            { label: 'Out of Order', count: rooms.filter(r => r.status === RoomStatus.OOO).length, color: 'text-slate-600', icon: AlertTriangle },
        ].map(stat => (
            <div key={stat.label} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                </div>
                <div className={`p-3 rounded-full bg-slate-50`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
            </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-16rem)]">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-t-xl">
            <div className="flex gap-4 overflow-x-auto w-full sm:w-auto">
                {['assignments', 'inspections', 'tasks'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize px-3 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
                <button 
                    onClick={() => setReportIssueModal(true)}
                    className="ml-auto bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <Wrench className="w-4 h-4" /> Report Issue
                </button>
            </div>
            
            {activeTab === 'assignments' && (
                <div className="flex p-1 bg-slate-100 rounded-lg overflow-x-auto max-w-full">
                    {(['All', ...Object.values(RoomStatus)] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                                filter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {activeTab === 'assignments' && renderAssignments()}
            {activeTab === 'inspections' && renderInspections()}
            {activeTab === 'tasks' && renderTasks()}
        </div>
      </div>
    </div>
  );
};
