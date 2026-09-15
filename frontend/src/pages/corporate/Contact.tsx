import { useState } from 'react';
import api from '../../lib/api';
import { Mail, Phone, MapPin, Loader2, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/corporate/contact', { ...formData, idempotencyKey: Date.now().toString() });
      setSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">We're here to help and answer any question you might have.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        
        <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-900 border-r border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex items-center">
              <Mail className="h-6 w-6 text-[#E50914] mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">support@nexviewconcept.com.ng</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="h-6 w-6 text-[#E50914] mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">+234 (0) 800 NEXVIEW</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-6 w-6 text-[#E50914] mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Headquarters</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">Abuja, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Message Sent!</h3>
              <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. Our support team will get back to you shortly.</p>
              <button onClick={() => setSuccess(false)} className="text-[#E50914] font-medium mt-4 hover:underline">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input type="text" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input type="email" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input type="tel" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input type="text" required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea required rows={4} className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#E50914] text-white py-3 rounded-lg font-bold hover:bg-red-700 transition flex justify-center items-center">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
