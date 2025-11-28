import React, { useState, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import { Plus, Edit, Trash2, Shield, X, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserRole } from '../types';

export const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const isCreate = location.pathname.includes('/create');
  const isEdit = location.pathname.includes('/edit');
  const isDelete = location.pathname.includes('/delete');

  const [formData, setFormData] = useState({ name: '', email: '', role: UserRole.FRONT_DESK });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if ((isEdit || isDelete) && params.id) {
        const user = MOCK_USERS.find(u => u.id === params.id);
        if (user) {
            setFormData({ name: user.name, email: user.email, role: user.role });
        }
    }
  }, [isEdit, isDelete, params.id]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setShowSuccess(true);
  };

  const handleReturn = () => {
      setShowSuccess(false);
      navigate('/admin/users');
  }

  // --- Views ---

  if (showSuccess) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Operation Successful!</h2>
              <p className="text-slate-600 mb-6">User has been successfully {isDelete ? 'deleted' : isEdit ? 'updated' : 'created'}.</p>
              <button onClick={handleReturn} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                  Return to Users
              </button>
          </div>
      );
  }

  if (isCreate || isEdit) {
      return (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
             <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">{isEdit ? 'Edit User' : 'Create New User'}</h2>
                  <button onClick={() => navigate('/admin/users')} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-5">
                 <div className="space-y-1">
                     <label className="text-sm font-semibold text-slate-700">Full Name</label>
                     <input 
                        type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                     />
                 </div>
                 <div className="space-y-1">
                     <label className="text-sm font-semibold text-slate-700">Email Address</label>
                     <input 
                        type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                     />
                 </div>
                 <div className="space-y-1">
                     <label className="text-sm font-semibold text-slate-700">Role</label>
                     <select 
                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 bg-white"
                     >
                         {Object.values(UserRole).map(role => (
                             <option key={role} value={role}>{role}</option>
                         ))}
                     </select>
                 </div>
                 <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => navigate('/admin/users')} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                      <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">
                          {isEdit ? 'Save Changes' : 'Create User'}
                      </button>
                  </div>
             </form>
        </div>
      );
  }

  if (isDelete) {
      return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mt-10">
            <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Delete User?</h2>
                <p className="text-slate-600 mb-6">
                    Are you sure you want to delete <strong>{formData.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={() => navigate('/admin/users')} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium">Cancel</button>
                    <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold shadow-md">Delete</button>
                </div>
            </div>
        </div>
      );
  }

  // --- List View ---

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
                <h2 className="text-lg font-bold text-slate-800">User Management</h2>
                <p className="text-sm text-slate-500">Manage system access and permissions</p>
            </div>
            <button 
                onClick={() => navigate('/admin/users/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
                <Plus className="w-4 h-4" /> Add User
            </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">User</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_USERS.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                                    <p className="text-xs text-slate-400">ID: #{user.id}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                    <Shield className="w-3 h-3" />
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                                <span className="text-sm text-slate-600">Active</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/admin/users/${user.id}/delete`)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};