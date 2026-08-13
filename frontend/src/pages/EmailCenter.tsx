import { useState, useEffect } from 'react';
import { Mail, RefreshCw, Send, XCircle, Clock } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Modal } from '../components/ui/Modal';

export default function EmailCenter() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Send Email Modal
  const [sendModal, setSendModal] = useState(false);
  const [emailData, setEmailData] = useState({
    senderEmail: user?.email || 'info@nexviewconcept.com.ng',
    recipient: '',
    subject: '',
    body: ''
  });
  const [sending, setSending] = useState(false);

  const getSenderOptions = () => {
    const userEmail = user?.email || 'user@nexviewconcept.com.ng';
    const roles = user?.roles || [];

    if (roles.includes('SUPER_ADMIN') || roles.includes('DIRECTOR')) {
      return [
        { label: 'info@nexviewconcept.com.ng (Company Main)', value: 'info@nexviewconcept.com.ng' },
        { label: 'support@nexviewconcept.com.ng (Support Desk)', value: 'support@nexviewconcept.com.ng' },
        { label: 'md@nexviewconcept.com.ng (Managing Director)', value: 'md@nexviewconcept.com.ng' },
        { label: 'admin@nexviewconcept.com.ng (System Admin)', value: 'admin@nexviewconcept.com.ng' },
        { label: `${userEmail} (My Personal Account)`, value: userEmail }
      ];
    }

    if (roles.includes('OPERATOR')) {
      return [
        { label: 'info@nexviewconcept.com.ng (Company Main)', value: 'info@nexviewconcept.com.ng' },
        { label: 'support@nexviewconcept.com.ng (Support Desk)', value: 'support@nexviewconcept.com.ng' },
        { label: `${userEmail} (My Personal Account)`, value: userEmail }
      ];
    }

    return [
      { label: `${userEmail} (My Personal Account)`, value: userEmail }
    ];
  };

  useEffect(() => {
    fetchLogs();
    
    // Auto-refresh logs every 3 seconds to show background queue updates
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/emails/logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post('/emails/send', emailData);
      setSendModal(false);
      setEmailData({ senderEmail: 'info@nexviewconcept.com.ng', recipient: '', subject: '', body: '' });
      fetchLogs();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleRetry = async (id: string) => {
    try {
      await api.post(`/emails/${id}/retry`);
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'SENT').length,
    failed: logs.filter(l => l.status === 'FAILED').length,
    queued: logs.filter(l => l.status === 'QUEUED' || l.status === 'RETRY').length
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Email Center</h2>
        <button 
          onClick={() => setSendModal(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center shadow-sm"
        >
          <Mail className="w-4 h-4 mr-2" /> Compose Email
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center">
          <Mail className="w-8 h-8 text-blue-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sent</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.sent}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center">
          <XCircle className="w-8 h-8 text-red-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Failed</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.failed}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center">
          <Clock className="w-8 h-8 text-orange-500 mb-2" />
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Queued</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.queued}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col justify-center items-center">
          <Send className="w-8 h-8 text-gray-400 mb-2" />
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Processed</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Email Logs</h3>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> Auto-refreshing
          </span>
        </div>
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Recipient</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Template</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && logs.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No emails have been sent yet.</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 dark:bg-gray-950">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(log.sentAt).toLocaleString()}</td>
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{log.recipient}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{log.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{log.template || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    log.status === 'SENT' ? 'bg-green-100 text-green-700' :
                    log.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {log.status === 'FAILED' && (
                    <button 
                      onClick={() => handleRetry(log.id)} 
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-lg transition inline-flex items-center"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" /> Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={sendModal} onClose={() => setSendModal(false)} title="Compose & Send Email">
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Send From</label>
            <select value={emailData.senderEmail} onChange={e => setEmailData({...emailData, senderEmail: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
              {getSenderOptions().map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Template (Optional)</label>
            <select 
              onChange={e => {
                const val = e.target.value;
                if (val === 'welcome') {
                  setEmailData({
                    ...emailData,
                    subject: 'Welcome to Nexview Concept Limited',
                    body: 'Dear Client/Staff,\n\nWelcome to Nexview Concept Limited! We are thrilled to have you onboard.\n\nBest Regards,\nNexOffice Management'
                  });
                } else if (val === 'invoice') {
                  setEmailData({
                    ...emailData,
                    subject: 'Invoice Issued - Nexview Concept Ltd',
                    body: 'Dear Client,\n\nYour official invoice has been generated. Please find the details in your account portal.\n\nThank you for choosing Nexview Concept Limited!'
                  });
                } else if (val === 'support') {
                  setEmailData({
                    ...emailData,
                    subject: 'Support Ticket Update',
                    body: 'Hello,\n\nThank you for contacting Support. Your inquiry is being attended to by our team.\n\nWarm Regards,\nSupport Team'
                  });
                }
              }} 
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300"
            >
              <option value="">-- Choose a Pre-made Template --</option>
              <option value="welcome">Welcome Email Template</option>
              <option value="invoice">Invoice Notification Template</option>
              <option value="support">Support Response Template</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Email</label>
            <input required type="email" value={emailData.recipient} onChange={e => setEmailData({...emailData, recipient: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="client@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input required type="text" value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Official Inquiry / Notification" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
            <textarea required rows={5} value={emailData.body} onChange={e => setEmailData({...emailData, body: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Type your email content here or choose a template above..." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setSendModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950 text-sm">Cancel</button>
            <button type="submit" disabled={sending} className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center text-sm font-medium">
              {sending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send Official Email
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
