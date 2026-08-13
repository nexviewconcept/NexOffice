import { useState, useEffect } from 'react';
import { Shield, Activity } from 'lucide-react';
import api from '../lib/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.append('action', actionFilter);
      if (entityFilter) params.append('entity', entityFilter);
      
      const res = await api.get(`/audit?${params.toString()}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter]);

  const getActionColor = (action: string) => {
    if (action.includes('CREATE') || action.includes('UPLOAD')) return 'bg-green-100 text-green-700';
    if (action.includes('UPDATE')) return 'bg-blue-100 text-blue-700';
    if (action.includes('DELETE')) return 'bg-red-100 text-red-700';
    if (action.includes('LOGIN')) return 'bg-purple-100 text-purple-700';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-[#E50914]" />
            Global Audit Logs
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and monitor all system activities.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Filter by Action</label>
          <select 
            value={actionFilter} 
            onChange={e => setActionFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-950 focus:bg-white dark:bg-gray-900 transition"
          >
            <option value="">All Actions</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
            <option value="LOGIN">LOGIN</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Filter by Entity</label>
          <select 
            value={entityFilter} 
            onChange={e => setEntityFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-950 focus:bg-white dark:bg-gray-900 transition"
          >
            <option value="">All Entities</option>
            <option value="Invoice">Invoice</option>
            <option value="Receipt">Receipt</option>
            <option value="Client">Client</option>
            <option value="InventoryItem">Inventory</option>
            <option value="User">User</option>
            <option value="File">File</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            onClick={fetchLogs}
            className="px-4 py-2 bg-[#E50914] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition w-full md:w-auto shadow-sm"
          >
            Refresh Logs
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Action</th>
              <th className="px-6 py-4 font-medium">Entity</th>
              <th className="px-6 py-4 font-medium">Record ID</th>
              <th className="px-6 py-4 font-medium">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading audit trail...</td></tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  No audit logs found for the selected filters.
                </td>
              </tr>
            ) : logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50 dark:bg-gray-950">
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {log.user ? (
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                        {log.user.staffProfile?.firstName?.charAt(0) || 'U'}
                      </div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {log.user.staffProfile ? `${log.user.staffProfile.firstName} ${log.user.staffProfile.lastName}` : log.user.email}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 italic">System</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {log.entity}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono text-xs">
                  {log.entityId ? log.entityId.substring(0, 8) + '...' : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono text-xs">
                  {log.ipAddress || 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
