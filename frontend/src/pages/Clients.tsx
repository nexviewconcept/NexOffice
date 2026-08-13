import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/clients', formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '', company: '' });
      fetchClients();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Clients</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Client">
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="+234 800 000 0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
            <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="Nexview Concept Ltd" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-[#E50914] hover:bg-red-700 rounded-lg transition-colors flex items-center disabled:opacity-70">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Client
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg w-full text-sm focus:ring-[#E50914] focus:border-[#E50914] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No clients found.</td>
                </tr>
              ) : (
                filtered.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:bg-gray-950/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{client.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{client.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{client.company || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-500 mx-2 transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
