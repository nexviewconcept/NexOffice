import { useState, useEffect } from 'react';
import { Plus, Download, CheckCircle, Trash2, DollarSign, Eye } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export default function Invoices() {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);

  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([{ description: '', quantity: 1, unit: '', unitPrice: 0 }]);
  
  // Payment Modal
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, cliRes] = await Promise.all([
        api.get('/invoices'),
        api.get('/clients')
      ]);
      setInvoices(invRes.data);
      setClients(cliRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/invoices', { clientId, notes, dueDate, items });
      setIsModalOpen(false);
      setClientId('');
      setNotes('');
      setDueDate('');
      setItems([{ description: '', quantity: 1, unit: '', unitPrice: 0 }]);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit: '', unitPrice: 0 }]);
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value as never };
    setItems(newItems);
  };
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

      const handleDownload = async (id: string, action: 'download' | 'preview' = 'download') => {
    try {
      if (action === 'preview') {
        setPreviewLoading(true);
        setIsPreviewOpen(true);
      }
      
      const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      
      if (action === 'preview') {
        setPreviewUrl(url);
        setPreviewLoading(false);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice_${id}.pdf`);
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

  const deleteInvoice = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice? Related receipts will also be deleted.')) return;
    try {
      await api.delete(`/invoices/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete invoice');
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/receipts', {
        invoiceId: selectedInvoice.id,
        amount: Number(paymentAmount),
        paymentMethod,
        notes: paymentNotes
      });
      setPaymentModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-green-100 text-green-700';
      case 'PARTIALLY_PAID': return 'bg-blue-100 text-blue-700';
      case 'SENT': return 'bg-yellow-100 text-yellow-700';
      case 'DRAFT': return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const calculateSubtotal = () => items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Invoices</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Invoice No</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Issue Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
            ) : invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50 dark:bg-gray-950">
                <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">{inv.invoiceNumber}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{inv.client.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{inv.client.email || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(inv.issueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-100">₦{inv.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusColor(inv.status)}`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {inv.status !== 'PAID' && (
                      <button 
                        onClick={() => { setSelectedInvoice(inv); setPaymentAmount(inv.total.toString()); setPaymentModal(true); }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Record Payment"
                      >
                        <DollarSign className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDownload(inv.id, 'preview')}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 rounded-lg transition" title="Preview PDF"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDownload(inv.id, 'download')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {user?.roles?.includes('SUPER_ADMIN') && (
                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Invoice"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Invoice">
        <form onSubmit={handleCreate} className="space-y-4 w-full max-w-2xl overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
              <select required value={clientId} onChange={e => setClientId(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
                <option value="">Select a client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date (Optional)</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Line Items</h4>
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 mb-3 items-end bg-gray-50 dark:bg-gray-950 p-3 sm:p-0 sm:bg-transparent rounded-lg">
                <div className="col-span-12 sm:col-span-5">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:hidden">Description</label>
                  <input required type="text" placeholder="Description" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:hidden">Qty</label>
                  <input required type="number" min="1" placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="col-span-8 sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:hidden">Unit</label>
                  <input type="text" placeholder="Unit (e.g. Yrs)" value={item.unit} onChange={e => updateItem(idx, 'unit', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="col-span-10 sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 sm:hidden">Price</label>
                  <input required type="number" min="0" placeholder="Price" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="col-span-2 sm:col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeItem(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 sm:border-transparent w-full flex justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addItem} className="text-sm text-[#E50914] font-medium flex items-center hover:underline mt-2">
              <Plus className="w-3 h-3 mr-1" /> Add Item
            </button>
          </div>

          <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-950 p-4 rounded-lg">
            <div className="font-medium text-gray-500 dark:text-gray-400">Subtotal</div>
            <div className="font-bold text-xl text-gray-800 dark:text-gray-100">₦{calculateSubtotal().toLocaleString()}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Payment terms..." rows={2} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700">Generate Invoice</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title="Record Payment">
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount Paid (₦)</label>
            <input required type="number" step="0.01" max={selectedInvoice?.total} value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-xl font-bold text-gray-800 dark:text-gray-100" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Invoice Total: ₦{selectedInvoice?.total?.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference / Notes</label>
            <input type="text" value={paymentNotes} onChange={e => setPaymentNotes(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Transaction ID..." />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setPaymentModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" /> Save & Generate Receipt
            </button>
          </div>
        </form>
      </Modal>

    
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
    </div>
  );
}