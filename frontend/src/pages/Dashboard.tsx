import { useState, useEffect } from 'react';
import { Users, FileText, Package, CheckCircle, Loader2, Plus, Receipt, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

interface DashboardStats {
  totalStaff: number;
  pendingInvoices: number;
  lowInventory: number;
  certificatesIssued: number;
  recentActivity: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    pendingInvoices: 0,
    lowInventory: 0,
    certificatesIssued: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/overview');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Staff', value: stats.totalStaff, icon: Users, color: 'bg-blue-500' },
    { label: 'Pending Invoices', value: stats.pendingInvoices, icon: FileText, color: 'bg-orange-500' },
    { label: 'Low Inventory', value: stats.lowInventory, icon: Package, color: 'bg-red-500' },
    { label: 'Certificates Issued', value: stats.certificatesIssued, icon: CheckCircle, color: 'bg-green-500' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-pointer transform hover:-translate-y-1 duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg text-white ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">All Time</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Link to="/invoices" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-blue-100 transition-all text-gray-600 dark:text-gray-400 hover:text-blue-600 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">New Invoice</span>
          </Link>
          <Link to="/receipts" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-green-100 transition-all text-gray-600 dark:text-gray-400 hover:text-green-600 group">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Receipt className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">New Receipt</span>
          </Link>
          <Link to="/staff-profiles" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-purple-100 transition-all text-gray-600 dark:text-gray-400 hover:text-purple-600 group">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Staff Profiles</span>
          </Link>
          <Link to="/support-tickets" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-orange-100 transition-all text-gray-600 dark:text-gray-400 hover:text-orange-600 group">
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Support Tickets</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md hover:border-gray-200 dark:border-gray-700 transition-all text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100 group">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 min-h-[400px]">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity.length === 0 ? (
             <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">No recent activity found.</div>
          ) : (
            stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4"></div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{activity.user}</span> {activity.action.toLowerCase()} {activity.entity.toLowerCase()}
                </p>
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
