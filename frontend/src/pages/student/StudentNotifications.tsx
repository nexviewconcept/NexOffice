import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Bell, Loader2 } from 'lucide-react';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifications(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-[#E50914]" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Notifications</h3>
          <p className="text-gray-500 dark:text-gray-400">You have no notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif: any) => (
            <div key={notif.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-start gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg flex-shrink-0">
                <Bell className="w-5 h-5 text-[#E50914]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">{notif.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notif.message}</p>
                {notif.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
