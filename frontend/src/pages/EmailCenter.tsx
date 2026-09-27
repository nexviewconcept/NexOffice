import { useState, useEffect } from 'react';
import { Mail, RefreshCw, Send, Clock, Inbox, Eye } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { Modal } from '../components/ui/Modal';

export default function EmailCenter() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  
  const [logs, setLogs] = useState<any[]>([]);
  const [inboxEmails, setInboxEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState('');
  
  const [sendModal, setSendModal] = useState(false);
  const [viewEmailModal, setViewEmailModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    template: '',
    body: '',
    senderEmail: 'info@nexviewconcept.com.ng'
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchLogs();
    fetchInbox();
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

  const fetchInbox = async () => {
    setInboxLoading(true);
    setInboxError('');
    try {
      const res = await api.get('/emails/inbox');
      setInboxEmails(res.data);
    } catch (err: any) {
      console.error(err);
      setInboxError(err.response?.data?.message || 'Failed to fetch IMAP inbox. Please ensure IMAP is enabled in Zoho settings.');
    } finally {
      setInboxLoading(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('recipient', emailData.recipient);
      formData.append('subject', emailData.subject);
      formData.append('body', emailData.body);
      formData.append('senderEmail', emailData.senderEmail);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      await api.post('/emails/send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSendModal(false);
      setEmailData({ recipient: '', subject: '', template: '', body: '', senderEmail: 'info@nexviewconcept.com.ng' });
      setAttachment(null);
      if (activeTab === 'sent') fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to send email');
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

  const getSenderOptions = () => {
    const opts = [{ value: 'info@nexviewconcept.com.ng', label: 'info@nexviewconcept.com.ng (General)' }];
    if (user?.email) {
      opts.push({ value: user.email, label: `${user.email} (Your Address)` });
    }
    return opts;
  };

  const handleReply = (email: any) => {
    // Extract raw email address from standard "Name <email@example.com>" format
    let recipient = email.from;
    const match = recipient.match(/<([^>]+)>/);
    if (match) recipient = match[1];

    setEmailData({
      ...emailData,
      recipient,
      subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
      body: `\n\n--- Replying to ---\n${email.text?.substring(0, 200)}...`
    });
    setViewEmailModal(false);
    setSendModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Mail className="w-8 h-8 mr-3 text-[#E50914]" />
            Mailbox & Communications
          </h1>
          <p className="text-gray-500 mt-1">Manage official company emails, view inbox, and send notifications.</p>
        </div>
        <button 
          onClick={() => {
            setEmailData({ recipient: '', subject: '', template: '', body: '', senderEmail: 'info@nexviewconcept.com.ng' });
            setSendModal(true);
          }}
          className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 font-medium inline-flex items-center shadow-sm"
        >
          <Send className="w-4 h-4 mr-2" />
          Compose Official Email
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`py-3 px-6 text-sm font-medium border-b-2 flex items-center transition-colors ${
            activeTab === 'inbox' 
              ? 'border-[#E50914] text-[#E50914]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <Inbox className="w-4 h-4 mr-2" />
          Live Inbox
        </button>
        <button
          onClick={() => { setActiveTab('sent'); fetchLogs(); }}
          className={`py-3 px-6 text-sm font-medium border-b-2 flex items-center transition-colors ${
            activeTab === 'sent' 
              ? 'border-[#E50914] text-[#E50914]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Sent Logs
        </button>
      </div>

      {/* Inbox Tab */}
      {activeTab === 'inbox' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Zoho Mail Inbox</h3>
            <button 
              onClick={fetchInbox} 
              disabled={inboxLoading}
              className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${inboxLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
          
          {inboxError && (
            <div className="p-4 bg-orange-50 border-b border-orange-100 text-orange-800 text-sm">
              <strong>Warning:</strong> {inboxError}
              <p className="mt-1 text-xs">You might need to log into Zoho Mail, go to Settings -> Mail Accounts -> IMAP Access, and enable it.</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">From</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {inboxLoading && inboxEmails.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading IMAP inbox...</td></tr>
                ) : inboxEmails.length === 0 && !inboxError ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-400">Your inbox is empty.</td></tr>
                ) : inboxEmails.map(email => (
                  <tr key={email.uid} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[200px]">{email.from}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[300px]">{email.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(email.date).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedEmail(email); setViewEmailModal(true); }}
                        className="px-3 py-1.5 text-xs font-medium text-[#E50914] bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition inline-flex items-center"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sent Logs Tab */}
      {activeTab === 'sent' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Sent Email Logs</h3>
            <button 
              onClick={fetchLogs} 
              className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Recipient</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading && logs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No emails have been sent yet.</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:bg-gray-900 dark:bg-gray-950 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(log.sentAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{log.recipient}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{log.subject}</td>
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
      )}

      {/* Compose Email Modal */}
      <Modal isOpen={sendModal} onClose={() => setSendModal(false)} title="Compose Official Email">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Email</label>
            <input required type="email" value={emailData.recipient} onChange={e => setEmailData({...emailData, recipient: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="client@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input required type="text" value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Official Inquiry / Notification" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
            <textarea required rows={8} value={emailData.body} onChange={e => setEmailData({...emailData, body: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Type your email content here..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach File (PDF, etc)</label>
            <input type="file" onChange={e => setAttachment(e.target.files ? e.target.files[0] : null)} className="w-full text-sm dark:text-gray-300" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setSendModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950 text-sm">Cancel</button>
            <button type="submit" disabled={sending} className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center text-sm font-medium">
              {sending ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send Email
            </button>
          </div>
        </form>
      </Modal>

      {/* View Email Modal */}
      <Modal isOpen={viewEmailModal} onClose={() => setViewEmailModal(false)} title="Read Email">
        {selectedEmail && (
          <div className="space-y-4">
            <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedEmail.subject}</h2>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="font-medium text-gray-700 dark:text-gray-300">From: {selectedEmail.from}</span>
                <span>{new Date(selectedEmail.date).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg min-h-[250px] max-h-[500px] overflow-y-auto">
              {selectedEmail.html ? (
                <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} className="text-gray-800 dark:text-gray-200" />
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans">{selectedEmail.text}</pre>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => handleReply(selectedEmail)}
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium inline-flex items-center text-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Reply
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
