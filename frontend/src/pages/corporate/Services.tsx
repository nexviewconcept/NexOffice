import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Loader2, CheckCircle, X } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', description: '' });
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    setLoading(true);
    api.get('/corporate/services')
      .then(res => setServices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    setOrderLoading(true);
    try {
      await api.post('/corporate/order', { 
        ...formData, 
        serviceId: selectedService.id,
        idempotencyKey: Date.now().toString() 
      });
      setOrderSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', description: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">Service Catalogue</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-[#E50914]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.length > 0 ? services.map(srv => (
            <div key={srv.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">{srv.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">{srv.description}</p>
              {srv.enabled ? (
                <button 
                  onClick={() => { setSelectedService(srv); setOrderSuccess(false); }}
                  className="w-full bg-[#E50914] text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Order Now
                </button>
              ) : (
                <button disabled className="w-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 py-2.5 rounded-lg font-medium cursor-not-allowed">
                  Currently Unavailable
                </button>
              )}
            </div>
          )) : (
            <div className="col-span-3 text-center text-gray-500 py-12 bg-white dark:bg-gray-800 rounded-xl">No services currently available.</div>
          )}
        </div>
      )}

      {/* Order Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Order: {selectedService.name}</h3>
              <button onClick={() => setSelectedService(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {orderSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Order Submitted!</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Your request has been securely forwarded to our operations team.</p>
                  <button onClick={() => setSelectedService(null)} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input type="text" required className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input type="email" required className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                      <input type="tel" className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Details</label>
                    <textarea required rows={3} className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setSelectedService(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                      Cancel
                    </button>
                    <button type="submit" disabled={orderLoading} className="flex-1 bg-[#E50914] text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition flex justify-center items-center">
                      {orderLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Order'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
