import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { MessageSquare, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function WhatsappSettings() {
  const { token } = useAuthStore();
  const [status, setStatus] = useState<{ connected: boolean; qrCode: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    // Poll for status every 3 seconds if not connected
    const interval = setInterval(() => {
      fetchStatus();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/whatsapp/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus(res.data);
    } catch (err) {
      console.error('Failed to fetch WhatsApp status', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to disconnect this WhatsApp number?')) {
      try {
        await api.post('/whatsapp/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchStatus();
      } catch (err) {
        alert('Failed to logout');
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-green-500" />
          WhatsApp Cloud Bot
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Connect your company's WhatsApp number to automate free messaging to clients and students.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
        {loading && !status ? (
          <div className="flex justify-center p-12 text-gray-500">Loading connection status...</div>
        ) : status?.connected ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">WhatsApp is Connected</h2>
              <p className="text-gray-500 mt-2 max-w-md">
                NexOffice is actively connected to WhatsApp. System alerts, invoices, and updates can now be sent via WhatsApp automatically.
              </p>
            </div>
            <Button onClick={handleLogout}  className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-4 border-red-200">
              <LogOut className="w-4 h-4 mr-2" /> Disconnect Number
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Link Device</h2>
              <ol className="list-decimal pl-5 space-y-3 text-gray-600 dark:text-gray-300">
                <li>Open WhatsApp on your company phone.</li>
                <li>Tap <strong>Menu</strong> (Android) or <strong>Settings</strong> (iPhone).</li>
                <li>Tap <strong>Linked Devices</strong> and select <strong>Link a Device</strong>.</li>
                <li>Point your phone to this screen to capture the QR code.</li>
              </ol>
              <div className="pt-4">
                <Button onClick={fetchStatus}  className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" /> Check Connection Status
                </Button>
              </div>
            </div>
            
            <div className="w-64 h-64 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden relative">
              {status?.qrCode ? (
                <img src={status.qrCode} alt="WhatsApp QR Code" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
              ) : (
                <div className="text-center p-4">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Generating QR Code...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

