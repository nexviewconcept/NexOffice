import { useState, useEffect } from 'react';
import { Download, Trash2, Mail, RefreshCw, HardDrive, Play } from 'lucide-react';
import api from '../lib/api';

export default function Backups() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      const res = await api.get('/backups');
      setBackups(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateBackup = async () => {
    if (!window.confirm('Are you sure you want to trigger a manual backup now?')) return;
    setGenerating(true);
    try {
      await api.post('/backups/create');
      alert('Backup generated successfully!');
      fetchBackups();
    } catch (err) {
      console.error(err);
      alert('Failed to generate backup. Ensure pg_dump is installed and PostgreSQL is running.');
    } finally {
      setGenerating(false);
    }
  };

  const deleteBackup = async (filename: string) => {
    if (!window.confirm('Are you sure you want to delete this backup permanently?')) return;
    try {
      await api.delete(`/backups/${filename}`);
      fetchBackups();
    } catch (err) {
      console.error(err);
      alert('Failed to delete backup.');
    }
  };

  const sendToEmail = async (filename: string) => {
    if (!window.confirm('Send this backup to the admin email?')) return;
    try {
      await api.post(`/backups/${filename}/email`);
      alert('Backup sent to email successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send backup to email. Ensure SMTP is configured correctly.');
    }
  };

  const downloadBackup = (filename: string) => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/backups/${filename}/download?token=${localStorage.getItem('token')}`;
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Database Backups</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and schedule daily autonomous backups</p>
        </div>
        <button 
          onClick={generateBackup}
          disabled={generating || loading}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center disabled:opacity-50 shadow-sm"
        >
          {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          Generate Backup Now
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center">
          <HardDrive className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Available Backups</h3>
        </div>
        
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Filename</th>
              <th className="px-6 py-4 font-medium">Date Created</th>
              <th className="px-6 py-4 font-medium">Size</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">Loading backups...</td></tr>
            ) : backups.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">No backups found.</td></tr>
            ) : backups.map((b, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:bg-gray-950">
                <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{b.filename}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(b.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{(b.size / 1024 / 1024).toFixed(2)} MB</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => downloadBackup(b.filename)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => sendToEmail(b.filename)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Send to Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteBackup(b.filename)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
        <strong>Information:</strong> The system is configured to autonomously generate a backup every day at midnight and send it to the administrator email address.
      </div>
    </div>
  );
}
