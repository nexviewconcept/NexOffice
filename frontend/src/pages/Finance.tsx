import { useState, useEffect } from 'react';
import { Plus, ArrowUpRight, ArrowDownRight, Activity, Trash2 } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

export default function Finance() {
  const [report, setReport] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [expenseModal, setExpenseModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);

  const [expenseData, setExpenseData] = useState({ categoryId: '', amount: '', description: '', paymentMethod: 'BANK_TRANSFER', reference: '', expenseDate: new Date().toISOString().split('T')[0] });
  const [categoryData, setCategoryData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [repRes, expRes, catRes] = await Promise.all([
        api.get('/finance/report'),
        api.get('/finance/expenses'),
        api.get('/finance/categories')
      ]);
      setReport(repRes.data);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/finance/categories', categoryData);
      setCategoryModal(false);
      setCategoryData({ name: '', description: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/finance/expenses', expenseData);
      setExpenseModal(false);
      setExpenseData({ categoryId: '', amount: '', description: '', paymentMethod: 'BANK_TRANSFER', reference: '', expenseDate: new Date().toISOString().split('T')[0] });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense log?')) return;
    try {
      await api.delete(`/finance/expenses/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Finance & Reports</h2>
        <div className="flex gap-2">
          <button onClick={() => setCategoryModal(true)} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:bg-gray-950 transition">
            Manage Categories
          </button>
          <button onClick={() => setExpenseModal(true)} className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center">
            <Plus className="w-4 h-4 mr-2" /> Log Expense
          </button>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ArrowUpRight className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">₦{report.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</h3>
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><ArrowDownRight className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">₦{report.totalExpenses.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Net Balance</h3>
              <div className="p-2 bg-gray-700 text-white rounded-lg"><Activity className="w-5 h-5" /></div>
            </div>
            <p className={`text-3xl font-bold ${report.netBalance < 0 ? 'text-red-400' : 'text-green-400'}`}>
              ₦{report.netBalance.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Expense History</h3>
        </div>
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Payment Method</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No expenses recorded yet.</td></tr>
            ) : expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-gray-50 dark:bg-gray-950">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{exp.description}</div>
                  {exp.reference && <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ref: {exp.reference}</div>}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">{exp.category.name}</span>
                </td>
                <td className="px-6 py-4 font-bold text-red-600">₦{exp.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{exp.paymentMethod.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDeleteExpense(exp.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={expenseModal} onClose={() => setExpenseModal(false)} title="Log New Expense">
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (₦)</label>
              <input required type="number" min="0" step="0.01" value={expenseData.amount} onChange={e => setExpenseData({...expenseData, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-lg font-bold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input required type="date" value={expenseData.expenseDate} onChange={e => setExpenseData({...expenseData, expenseDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <input required type="text" value={expenseData.description} onChange={e => setExpenseData({...expenseData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="What was this expense for?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select required value={expenseData.categoryId} onChange={e => setExpenseData({...expenseData, categoryId: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
              <select required value={expenseData.paymentMethod} onChange={e => setExpenseData({...expenseData, paymentMethod: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900">
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reference (Optional)</label>
              <input type="text" value={expenseData.reference} onChange={e => setExpenseData({...expenseData, reference: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Transaction ID, Receipt No..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setExpenseModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700">Save Expense</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={categoryModal} onClose={() => setCategoryModal(false)} title="Expense Categories">
        <div className="space-y-4">
          <form onSubmit={handleCreateCategory} className="flex gap-2">
            <input required type="text" placeholder="New category name" value={categoryData.name} onChange={e => setCategoryData({...categoryData, name: e.target.value})} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
            <button type="submit" className="px-4 py-2 bg-[#E50914] text-white rounded-lg text-sm hover:bg-red-700">Add</button>
          </form>
          <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2">
            {categories.length === 0 ? <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No categories yet</p> : null}
            {categories.map(c => (
              <div key={c.id} className="p-2 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
}
