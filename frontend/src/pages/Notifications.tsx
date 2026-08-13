import { useState, useEffect } from 'react';
import { Bell, Plus, Loader2, StopCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';
import { useAuthStore } from '../store/authStore';

interface Announcement {
  id: string;
  title: string;
  message: string;
  recurrence: string;
  status: string;
  channel: string;
  audience: string;
  startDate: string;
  expiryDate: string | null;
  _count?: { occurrences: number };
}

export default function Notifications() {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes('SUPER_ADMIN') || user?.roles?.includes('DIRECTOR');
  
  const [activeTab, setActiveTab] = useState<'FEED' | 'MANAGE'>('FEED');
  
  // Feed State
  const [feed, setFeed] = useState<any[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  // Manage State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnn, setLoadingAnn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', message: '', recurrence: 'ONCE', channel: 'DASHBOARD', audience: 'ALL', repeatEmail: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeed();
    if (isAdmin) {
      fetchAnnouncements();
    }
  }, [isAdmin]);

  const fetchFeed = async () => {
    try {
      const res = await api.get('/notifications/my-feed');
      setFeed(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeed(false);
    }
  };

  const fetchAnnouncements = async () => {
    setLoadingAnn(true);
    try {
      const res = await api.get('/notifications/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnn(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/notifications/announcements', formData);
      setIsModalOpen(false);
      setFormData({ title: '', message: '', recurrence: 'ONCE', channel: 'DASHBOARD', audience: 'ALL', repeatEmail: false });
      fetchAnnouncements();
      fetchFeed(); // Refresh feed in case 'ONCE' was sent to 'ALL'
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStop = async (id: string) => {
    try {
      await api.patch(`/notifications/announcements/${id}/status`, { status: 'STOPPED' });
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (occurrenceId: string) => {
    try {
      await api.post(`/notifications/${occurrenceId}/read`);
      setFeed(feed.map(f => f.id === occurrenceId ? { ...f, isRead: true } : f));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Notifications Center</h2>
        
        {isAdmin && (
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('FEED')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'FEED' ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
            >
              My Feed
            </button>
            <button 
              onClick={() => setActiveTab('MANAGE')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'MANAGE' ? 'bg-white dark:bg-gray-900 shadow-sm text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300'}`}
            >
              Manage Campaigns
            </button>
          </div>
        )}
      </div>

      {activeTab === 'FEED' ? (
        <div className="space-y-4 max-w-3xl">
          {loadingFeed ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : feed.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 shadow-sm">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              You're all caught up! No new notifications.
            </div>
          ) : (
            feed.map((item) => (
              <div key={item.id} className={`bg-white dark:bg-gray-900 p-5 rounded-xl border ${item.isRead ? 'border-gray-100 dark:border-gray-800' : 'border-[#E50914] shadow-md'} transition-all relative overflow-hidden`}>
                {!item.isRead && <div className="absolute top-0 left-0 w-1 h-full bg-[#E50914]" />}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-bold ${item.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'} text-lg flex items-center gap-2`}>
                      {item.title}
                      {!item.isRead && <span className="bg-[#E50914] text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">New</span>}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">{item.message}</p>
                    <div className="text-xs text-gray-400 mt-4 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(item.firedAt).toLocaleString()}
                    </div>
                  </div>
                  {!item.isRead && (
                    <button 
                      onClick={() => handleMarkAsRead(item.id)}
                      className="text-[#E50914] hover:bg-red-50 p-2 rounded-full transition-colors flex-shrink-0"
                      title="Mark as Read"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-950/50">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <Bell className="w-4 h-4 mr-2" /> Active Campaigns
            </h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#E50914] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" /> New Campaign
            </button>
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3 font-medium">Campaign</th>
                <th className="px-6 py-3 font-medium">Recurrence</th>
                <th className="px-6 py-3 font-medium">Audience</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingAnn ? (
                 <tr><td colSpan={5} className="p-6 text-center text-gray-400"><Loader2 className="animate-spin mx-auto" /></td></tr>
              ) : announcements.length === 0 ? (
                 <tr><td colSpan={5} className="p-6 text-center text-gray-400">No campaigns found.</td></tr>
              ) : announcements.map(ann => (
                <tr key={ann.id} className="hover:bg-gray-50 dark:bg-gray-950 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800 dark:text-gray-100">{ann.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sent {ann._count?.occurrences || 0} times</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">{ann.recurrence.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{ann.audience}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      ann.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                      ann.status === 'EXPIRED' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {ann.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {ann.status === 'ACTIVE' && (
                      <button 
                        onClick={() => handleStop(ann.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded text-sm font-medium inline-flex items-center"
                      >
                        <StopCircle className="w-4 h-4 mr-1" /> Stop
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Scheduled Announcement">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-[#E50914] outline-none" placeholder="System Maintenance..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-[#E50914] outline-none h-24" placeholder="Type your message here..." />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Schedule / Recurrence</label>
              <select value={formData.recurrence} onChange={e => setFormData({...formData, recurrence: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
                <option value="ONCE">Send Once (Now)</option>
                <option value="DAILY">Daily (9:00 AM)</option>
                <option value="TWICE_DAILY">Twice Daily (8AM & 6PM)</option>
                <option value="WEEKLY">Weekly (Monday 9AM)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
              <select value={formData.audience} onChange={e => setFormData({...formData, audience: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
                <option value="ALL">Everyone</option>
                <option value="STAFF">General Staff</option>
                <option value="DIRECTORS">Directors Only</option>
                <option value="OPERATORS">Operators Only</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-[#E50914] hover:bg-red-700 rounded-lg flex items-center">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Launch Campaign
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
