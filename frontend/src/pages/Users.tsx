import { useState, useEffect } from 'react';
import { Users as UsersIcon, Shield, Lock, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

export default function Users() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({ email: '', notificationEmail: '', password: '', role: 'OPERATOR' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith('@nexviewconcept.com.ng')) {
      alert('Login email must be a company email (@nexviewconcept.com.ng)');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/users', {
        email: formData.email,
        notificationEmail: formData.notificationEmail,
        password: formData.password,
        roles: [formData.role]
      });
      setCreateModal(false);
      setFormData({ email: '', notificationEmail: '', password: '', role: 'OPERATOR' });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} this user?`)) return;
    try {
      await api.put(`/users/${id}/status`, { status: newStatus });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const updateRole = async (id: string, newRole: string) => {
    try {
      await api.put(`/users/${id}/roles`, { roles: [newRole] });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update role');
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to completely delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-[#E50914]" />
            User Management & Permissions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage system accounts, roles, and access control.</p>
        </div>
        <button 
          onClick={() => setCreateModal(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Role / Permission Level</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date Created</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No users found.</td></tr>
            ) : users.map(user => {
              const currentRole = user.roles?.[0]?.role?.name || 'UNKNOWN';
              return (
                <tr key={user.id} className="hover:bg-gray-50 dark:bg-gray-950">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 flex items-center justify-center mr-3">
                        <UsersIcon className="w-4 h-4" />
                      </div>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={currentRole} 
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className="text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 bg-white dark:bg-gray-900 focus:outline-none focus:border-red-500"
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="DIRECTOR">DIRECTOR</option>
                      <option value="OPERATOR">OPERATOR</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleStatus(user.id, user.status)}
                        className="text-gray-400 hover:text-red-500 transition px-2"
                        title={user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.status === 'ACTIVE' ? <Lock className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                      </button>
                      {currentUser?.roles?.includes('SUPER_ADMIN') && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-gray-400 hover:text-red-600 transition px-2"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create New System Account">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Login Email</label>
            <input required type="email" placeholder="e.g. staff@nexviewconcept.com.ng" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Personal Notification Email (Optional)</label>
            <input type="email" placeholder="e.g. name@gmail.com" value={formData.notificationEmail} onChange={e => setFormData({...formData, notificationEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">They will receive their login details here as well.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role / Permissions</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500">
              <option value="OPERATOR">OPERATOR (Restricted Access)</option>
              <option value="DIRECTOR">DIRECTOR (Management Access)</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setCreateModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
