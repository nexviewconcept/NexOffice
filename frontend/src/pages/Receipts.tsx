import { useState, useEffect } from 'react';
import { Plus, Download, Mail, Search, Trash2, Eye, MessageCircle, CheckCircle, Loader2, Edit, FileText } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

export default function Receipts() {
  const { user } = useAuthStore();
  const [receipts, setReceipts] = useState<any[]>([]);

  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editMethod, setEditMethod] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/receipts');
      setReceipts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (rec: any) => {
    try {
      const email = window.prompt("Enter Email address to send to:", rec.invoice?.client?.email || "");
      if (email === null) return;
      await api.post(`/receipts/${rec.id}/send-email`, { email });
      alert('Receipt sent via Email successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send via Email');
    }
  };

  const handleSendWhatsapp = async (rec: any) => {
    try {
      const phone = window.prompt("Enter WhatsApp number (include country code, e.g. +234):", rec.invoice?.client?.phone || "");
      if (phone === null) return;
      await api.post(`/receipts/${rec.id}/send-whatsapp`, { phone });
      alert('Receipt sent to client via WhatsApp successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send via WhatsApp');
    }
  };

  const handleDownload = async (id: string, action: 'download' | 'preview' = 'download') => {
    try {
      if (action === 'preview') {
        setPreviewLoading(true);
        setIsPreviewOpen(true);
      }
      
      const res = await api.get(`/receipts/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      
      if (action === 'preview') {
        setPreviewUrl(url);
        setPreviewLoading(false);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Receipt_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed', err);
      if (action === 'preview') {
        setPreviewLoading(false);
        setIsPreviewOpen(false);
        alert('Failed to load preview');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/receipts/${selectedReceipt.id}`, { amount: editAmount, paymentMethod: editMethod, notes: editNotes });
      setEditModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to edit receipt');
    }
  };

  const deleteReceipt = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this receipt?')) return;
    try {
      await api.delete(`/receipts/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete receipt');
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Official Receipts</h2>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Receipt No</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Invoice Ref</th>
              <th className="px-6 py-4 font-medium">Payment Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
            ) : receipts.map(rec => (
              <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:bg-gray-900 dark:bg-gray-950 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {rec.receiptNumber}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{rec.invoice?.client?.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{rec.paymentMethod.replace('_', ' ')}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{rec.invoice?.invoiceNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(rec.paymentDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-green-700">₦{rec.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleDownload(rec.id, 'preview')}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition" title="Preview PDF"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleSendEmail(rec)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Send Email to Client"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleSendWhatsapp(rec)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Send WhatsApp to Client"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDownload(rec.id, 'download')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {user?.roles?.some(r => ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'MANAGER'].includes(r)) && (
                      <>
                        <button onClick={() => { setSelectedReceipt(rec); setEditAmount(rec.amount); setEditMethod(rec.paymentMethod); setEditNotes(rec.notes || ''); setEditModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Receipt"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => deleteReceipt(rec.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Receipt"><Trash2 className="w-5 h-5" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {receipts.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No receipts generated yet.
          </div>
        )}
      </div>
    
      <Modal isOpen={isPreviewOpen} onClose={() => { setIsPreviewOpen(false); if (previewUrl) window.URL.revokeObjectURL(previewUrl); setPreviewUrl(''); }} title="Preview Document">
        <div className="w-full max-w-4xl">
          {previewLoading ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-[70vh]">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading preview...
            </div>
          ) : previewUrl ? (
            <iframe src={previewUrl} className="w-full h-[75vh] border rounded-lg bg-gray-50 dark:bg-gray-950" title="Document Preview" />
          ) : null}
        </div>
      </Modal>
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Receipt">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Paid (₦)</label>
            <input required type="number" step="0.01" value={editAmount} onChange={e => setEditAmount(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xl font-bold text-gray-800 dark:text-gray-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
            <select value={editMethod} onChange={e => setEditMethod(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
              <option value="POS">POS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Transaction ID, etc)</label>
            <input type="text" value={editNotes} onChange={e => setEditNotes(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Transaction ID..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setEditModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}





