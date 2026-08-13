import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Plus, Send, Shield, Loader2 } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export default function SupportTickets() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Ticket Modal
  const [createModal, setCreateModal] = useState(false);
  const [formData, setFormData] = useState({ subject: '', category: 'GENERAL', priority: 'NORMAL', message: '' });
  const [submitting, setSubmitting] = useState(false);

  // View/Reply Modal
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/tickets', formData);
      setCreateModal(false);
      setFormData({ subject: '', category: 'GENERAL', priority: 'NORMAL', message: '' });
      fetchTickets();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const openTicket = async (id: string) => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setSelectedTicket(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to load ticket');
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      await api.post(`/tickets/${selectedTicket.id}/messages`, { message: replyMessage });
      setReplyMessage('');
      openTicket(selectedTicket.id); // refresh chat
      fetchTickets(); // refresh list to update timestamp/status
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/tickets/${id}/status`, { status });
      if (selectedTicket && selectedTicket.id === id) {
        openTicket(id);
      }
      fetchTickets();
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">Open</span>;
      case 'CLOSED': return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-medium">Closed</span>;
      default: return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Support Helpdesk</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and respond to support tickets</p>
        </div>
        <button onClick={() => setCreateModal(true)} className="bg-[#E50914] text-white px-4 py-2 rounded-lg flex items-center hover:bg-red-700 transition font-medium text-sm shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium">Ticket ID</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                {user?.roles?.includes('SUPER_ADMIN') && <th className="px-6 py-4 font-medium">User</th>}
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={user?.roles?.includes('SUPER_ADMIN') ? 5 : 4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket.id} onClick={() => openTicket(ticket.id)} className="hover:bg-gray-50 dark:bg-gray-950 cursor-pointer transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.ticketNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {ticket.subject}
                      <span className="block text-xs text-gray-400 font-normal mt-1">{ticket.category} • {ticket.priority} Priority</span>
                    </td>
                    {user?.roles?.includes('SUPER_ADMIN') && <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{ticket.user.email}</td>}
                    <td className="px-6 py-4 text-sm">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(ticket.updatedAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Open New Support Ticket">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" placeholder="Brief summary of the issue" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option value="GENERAL">General Query</option>
                <option value="TECHNICAL">Technical Issue</option>
                <option value="BILLING">Billing / Finance</option>
                <option value="HR">Human Resources</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 min-h-[120px]" placeholder="Describe your issue in detail..." />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex justify-center items-center">
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Ticket'}
          </button>
        </form>
      </Modal>

      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket ${selectedTicket.ticketNumber}`}>
          <div className="flex flex-col h-[60vh] max-h-[600px]">
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
              <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100">{selectedTicket.subject}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedTicket.user.email} • {new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>
              <div>{getStatusBadge(selectedTicket.status)}</div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {selectedTicket.messages.map((msg: any) => (
                <div key={msg.id} className={`flex flex-col ${msg.isStaff ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
                    {msg.isStaff && <Shield className="w-3 h-3 text-red-500" />}
                    {msg.isStaff ? 'Support Team' : msg.user.staffProfile?.firstName || msg.user.email.split('@')[0]}
                  </span>
                  <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${msg.isStaff ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none'}`}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'CLOSED' ? (
              user?.roles?.some((r: string) => ['SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'].includes(r)) ? (
                <form onSubmit={handleReply} className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 flex gap-2">
                  <input
                    type="text"
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Type official admin response..."
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:border-blue-500 text-sm bg-gray-50 dark:bg-gray-950"
                  />
                  <button type="submit" disabled={replying || !replyMessage.trim()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50">
                    {replying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              ) : (
                <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 text-center text-xs text-gray-400">
                  ⏳ Waiting for Support Admin response. Regular users cannot reply directly.
                </div>
              )
            ) : (
              <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                This ticket is closed.
                {user?.roles?.some((r: string) => ['SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'].includes(r)) && (
                  <button onClick={() => updateStatus(selectedTicket.id, 'OPEN')} className="text-blue-600 hover:underline ml-2">Reopen</button>
                )}
              </div>
            )}
            
            {user?.roles?.some((r: string) => ['SUPER_ADMIN', 'DIRECTOR', 'OPERATOR'].includes(r)) && selectedTicket.status !== 'CLOSED' && (
              <div className="mt-2 text-center">
                <button onClick={() => updateStatus(selectedTicket.id, 'CLOSED')} className="text-xs text-red-500 hover:underline">Close Ticket</button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
