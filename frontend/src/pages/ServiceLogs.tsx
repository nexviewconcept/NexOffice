import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, Trash2, Smartphone, UserCheck, DollarSign, Search, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

export default function ServiceLogs() {
  const { user } = useAuthStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // New Service Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: 'NIN Enrollment',
    customServiceType: '',
    customerName: '',
    customerPhone: '',
    amount: '',
    paymentStatus: 'COMPLETE',
    deviceUsed: 'Desktop PC',
    customDevice: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/service-logs');
      setLogs(res.data);
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
      const finalServiceType = formData.serviceType === 'OTHER' ? formData.customServiceType : formData.serviceType;
      const finalDevice = formData.deviceUsed === 'OTHER' ? formData.customDevice : formData.deviceUsed;

      await api.post('/service-logs', {
        serviceType: finalServiceType || 'NIN Enrollment',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        amount: Number(formData.amount) || 0,
        paymentStatus: formData.paymentStatus,
        deviceUsed: finalDevice || 'Desktop PC',
        notes: formData.notes
      });

      setIsModalOpen(false);
      setFormData({
        serviceType: 'NIN Enrollment',
        customServiceType: '',
        customerName: '',
        customerPhone: '',
        amount: '',
        paymentStatus: 'COMPLETE',
        deviceUsed: 'Desktop PC',
        customDevice: '',
        notes: ''
      });
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Failed to log service record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service record?')) return;
    try {
      await api.delete(`/service-logs/${id}`);
      fetchLogs();
    } catch (err) {
      alert('Failed to delete service record');
    }
  };

  const handleTogglePaymentStatus = async (log: any) => {
    const nextStatus = log.paymentStatus === 'COMPLETE' ? 'PENDING' : 'COMPLETE';
    try {
      await api.put(`/service-logs/${log.id}`, { paymentStatus: nextStatus });
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.customerPhone && log.customerPhone.includes(searchTerm)) ||
                          log.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (log.deviceUsed && log.deviceUsed.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'ALL' || log.serviceType === filterType;
    const matchesStatus = filterStatus === 'ALL' || log.paymentStatus === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    totalRevenue: logs.reduce((sum, l) => sum + (l.paymentStatus === 'COMPLETE' ? Number(l.amount) : 0), 0),
    totalCount: logs.length,
    completedCount: logs.filter(l => l.paymentStatus === 'COMPLETE').length,
    pendingCount: logs.filter(l => l.paymentStatus === 'PENDING').length,
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">NIN / BVN & Services Log</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track daily NIN, BVN, CAC, and service transactions with device and operator records.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition flex items-center shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" /> Log New Service
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-[#E50914] rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Collected Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">₦{stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Services</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.totalCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paid / Complete</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.completedCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-orange-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pending Payment</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.pendingCount}</h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search customer, phone, or device..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm border-gray-200 dark:border-gray-700 outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)} 
            className="px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="ALL">All Services</option>
            <option value="NIN Enrollment">NIN Enrollment</option>
            <option value="BVN Verification">BVN Verification</option>
            <option value="CAC Registration">CAC Registration</option>
            <option value="Plastic ID Card">Plastic ID Card</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)} 
            className="px-3 py-2 border rounded-xl bg-gray-50 dark:bg-gray-950 text-sm border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETE">Paid Complete</option>
            <option value="PENDING">Pending Payment</option>
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Service Type</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Payment Status</th>
              <th className="px-6 py-4 font-medium">Device Used</th>
              <th className="px-6 py-4 font-medium">Operator (Staff)</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={8} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading service logs...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan={8} className="p-8 text-center text-gray-400">No service records found.</td></tr>
            ) : filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(log.paymentDate || log.createdAt).toLocaleDateString()}
                  <span className="block text-xs text-gray-400">{new Date(log.paymentDate || log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-50 dark:bg-red-950/40 text-[#E50914] text-xs font-semibold rounded-lg border border-red-100 dark:border-red-900/30">
                    {log.serviceType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-800 dark:text-gray-100">{log.customerName}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{log.customerPhone || 'No Phone'}</div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-100">
                  ₦{Number(log.amount).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleTogglePaymentStatus(log)}
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition ${
                      log.paymentStatus === 'COMPLETE' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300 hover:bg-green-200' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 hover:bg-orange-200'
                    }`}
                    title="Click to toggle payment status"
                  >
                    {log.paymentStatus === 'COMPLETE' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {log.paymentStatus === 'COMPLETE' ? 'Paid Complete' : 'Pending'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-2">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  {log.deviceUsed || 'Desktop PC'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#E50914]" />
                    {log.performedBy?.staffProfile ? `${log.performedBy.staffProfile.firstName} ${log.performedBy.staffProfile.lastName}` : log.performedBy?.email?.split('@')[0] || 'Operator'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  {user?.roles?.includes('SUPER_ADMIN') && (
                    <button 
                      onClick={() => handleDelete(log.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Service Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Service Transaction">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Service Type</label>
              <select 
                value={formData.serviceType} 
                onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm"
              >
                <option value="NIN Enrollment">NIN Enrollment</option>
                <option value="BVN Verification">BVN Verification</option>
                <option value="CAC Registration">CAC Registration</option>
                <option value="Plastic ID Card">Plastic ID Card Printing</option>
                <option value="OTHER">Other Custom Service...</option>
              </select>
            </div>

            {formData.serviceType === 'OTHER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Service Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.customServiceType} 
                  onChange={e => setFormData({ ...formData, customServiceType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-sm" 
                  placeholder="e.g. Passport Photograph" 
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Full Name</label>
              <input 
                required 
                type="text" 
                value={formData.customerName} 
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm" 
                placeholder="e.g. Ibrahim Musa" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Phone (Optional)</label>
              <input 
                type="tel" 
                value={formData.customerPhone} 
                onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm" 
                placeholder="08012345678" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fee Charged (₦)</label>
              <input 
                required 
                type="number" 
                min="0"
                value={formData.amount} 
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm font-bold text-gray-800 dark:text-gray-100" 
                placeholder="e.g. 2500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Status</label>
              <select 
                value={formData.paymentStatus} 
                onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm"
              >
                <option value="COMPLETE">Paid Complete (Ranar da aka yi)</option>
                <option value="PENDING">Pending / Outstanding Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Device Used</label>
              <select 
                value={formData.deviceUsed} 
                onChange={e => setFormData({ ...formData, deviceUsed: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl bg-white dark:bg-gray-900 text-sm"
              >
                <option value="Desktop PC 01">Desktop PC 01</option>
                <option value="Desktop PC 02">Desktop PC 02</option>
                <option value="Laptop Device A">Laptop Device A</option>
                <option value="Biometric Scanner 01">Biometric Scanner 01</option>
                <option value="Android POS/Tablet">Android POS / Tablet</option>
                <option value="OTHER">Other Custom Device...</option>
              </select>
            </div>
          </div>

          {formData.deviceUsed === 'OTHER' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Device Name</label>
              <input 
                required 
                type="text" 
                value={formData.customDevice} 
                onChange={e => setFormData({ ...formData, customDevice: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl text-sm" 
                placeholder="e.g. Enrollment Tab #3" 
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes / Tracking Ref (Optional)</label>
            <textarea 
              rows={2} 
              value={formData.notes} 
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-sm" 
              placeholder="Additional details..." 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-gray-950">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#E50914] text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Service Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
