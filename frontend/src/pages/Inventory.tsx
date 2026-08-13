import { useState, useEffect } from 'react';
import { Plus, Package, ArrowUpRight, ArrowDownRight, RefreshCw, AlertTriangle, History, DollarSign } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

export default function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', sku: '', category: '', quantity: 0, minQuantity: 0, location: '', purchaseCost: 0 });
  
  const [transModal, setTransModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [transData, setTransData] = useState({ type: 'OUT', quantity: 1, notes: '' });
  const [transError, setTransError] = useState('');

  const [historyModal, setHistoryModal] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/inventory', formData);
      setIsModalOpen(false);
      setFormData({ name: '', sku: '', category: '', quantity: 0, minQuantity: 0, location: '', purchaseCost: 0 });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransError('');
    try {
      await api.post(`/inventory/${selectedItem.id}/transactions`, transData);
      setTransModal(false);
      setTransData({ type: 'OUT', quantity: 1, notes: '' });
      fetchData();
    } catch (err: any) {
      setTransError(err.response?.data?.message || 'Transaction failed');
    }
  };

  const viewHistory = async (item: any) => {
    setSelectedItem(item);
    setHistoryModal(true);
    setLoadingHistory(true);
    try {
      const res = await api.get(`/inventory/${item.id}/transactions`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const totalItems = items.length;
  const lowStockCount = items.filter(i => i.quantity <= i.minQuantity).length;
  const totalValue = items.reduce((sum, i) => sum + (i.quantity * (i.purchaseCost || 0)), 0);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Inventory Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4"><Package className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalItems}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg mr-4"><AlertTriangle className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 dark:text-gray-400">Low Stock Alerts</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{lowStockCount}</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg mr-4"><DollarSign className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500 dark:text-gray-400">Inventory Value</p><p className="text-2xl font-bold text-gray-800 dark:text-gray-100">₦{totalValue.toLocaleString()}</p></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Item Name</th>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Stock Level</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
            ) : items.map(item => {
              const isLow = item.quantity <= item.minQuantity;
              return (
                <tr key={item.id} className={`hover:bg-gray-50 dark:bg-gray-950 ${isLow ? 'bg-red-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                      {isLow && <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />}
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.sku}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {item.quantity} in stock
                    </span>
                    <div className="text-[10px] text-gray-400 mt-1">Min: {item.minQuantity}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{item.location || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedItem(item); setTransModal(true); setTransError(''); setTransData({ type: 'OUT', quantity: 1, notes: '' }); }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition border border-blue-100" title="Record Transaction"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => viewHistory(item)}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 rounded transition border border-gray-200 dark:border-gray-700" title="View Audit Log"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
              <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / Aisle</label>
              <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Quantity</label>
              <input required type="number" min="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Low Stock Threshold</label>
              <input required type="number" min="0" value={formData.minQuantity} onChange={e => setFormData({...formData, minQuantity: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Cost (₦) per unit</label>
              <input type="number" min="0" step="0.01" value={formData.purchaseCost} onChange={e => setFormData({...formData, purchaseCost: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700">Save Item</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={transModal} onClose={() => setTransModal(false)} title={`Log Transaction: ${selectedItem?.name}`}>
        <form onSubmit={handleTransaction} className="space-y-4">
          {transError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{transError}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction Type</label>
              <select value={transData.type} onChange={e => setTransData({...transData, type: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
                <option value="OUT">Usage / Sent Out</option>
                <option value="IN">Restock / Received</option>
                <option value="ADJUSTMENT">Audit Adjustment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {transData.type === 'ADJUSTMENT' ? 'New Total Quantity' : 'Quantity to Move'}
              </label>
              <input required type="number" min="1" value={transData.quantity} onChange={e => setTransData({...transData, quantity: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason / Notes</label>
            <input required type="text" value={transData.notes} onChange={e => setTransData({...transData, notes: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Issued to Marketing Dept" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setTransModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Log</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={historyModal} onClose={() => setHistoryModal(false)} title={`Audit Log: ${selectedItem?.name}`}>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {loadingHistory ? (
             <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading history...</div>
          ) : history.length === 0 ? (
             <div className="text-center py-8 text-gray-400">No transactions recorded yet.</div>
          ) : history.map(log => (
            <div key={log.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 dark:bg-gray-950">
              <div className="flex items-center">
                {log.type === 'IN' ? <ArrowUpRight className="w-5 h-5 text-green-500 mr-3" /> : 
                 log.type === 'OUT' ? <ArrowDownRight className="w-5 h-5 text-red-500 mr-3" /> : 
                 <RefreshCw className="w-5 h-5 text-blue-500 mr-3" />}
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {log.type === 'IN' ? 'Restocked' : log.type === 'OUT' ? 'Used/Sent Out' : 'Adjusted'} 
                    <span className="ml-1 px-2 py-0.5 bg-white dark:bg-gray-900 border rounded text-xs">{log.quantity} units</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{log.notes}</div>
                </div>
              </div>
              <div className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
