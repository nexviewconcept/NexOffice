import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Send, Eye, Download, Trash2, CheckCircle, Search, Mail, MessageSquare } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';
import { format } from 'date-fns';

export default function ITLetters() {
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  
  const [sendEmailModal, setSendEmailModal] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState('');
  
  const [sendWhatsappModal, setSendWhatsappModal] = useState<string | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState('');

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const res = await api.get('/acceptance-letters');
      setLetters(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await api.post('/acceptance-letters', data);
      setIsCreateModalOpen(false);
      reset();
      fetchLetters();
      alert('Acceptance letter generated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to generate letter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (id: string, matric: string) => {
    try {
      const response = await api.get(`/acceptance-letters/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Acceptance_Letter_${matric}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF');
    }
  };

  const handleSendEmail = async (id: string) => {
    try {
      await api.post(`/acceptance-letters/${id}/email`, { email: emailTo });
      setSendEmailModal(null);
      setEmailTo('');
      alert('Letter sent via email successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send email');
    }
  };

  const handleSendWhatsapp = async (id: string) => {
    try {
      await api.post(`/acceptance-letters/${id}/whatsapp`, { phone: whatsappPhone });
      setSendWhatsappModal(null);
      setWhatsappPhone('');
      alert('Letter sent via WhatsApp successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send WhatsApp message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this letter?')) return;
    try {
      await api.delete(`/acceptance-letters/${id}`);
      fetchLetters();
    } catch (err) {
      console.error(err);
      alert('Failed to delete letter');
    }
  };

  const filteredLetters = letters.filter(l => 
    l.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.matricNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-[#E50914]" />
            IT Acceptance Letters
          </h1>
          <p className="text-gray-500 mt-1">Issue and manage SIWES/IT acceptance letters for students.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 font-medium inline-flex items-center shadow-sm transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Issue New Letter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or matric no..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Matric No</th>
                <th className="px-6 py-4 font-medium">Course/Dept</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading letters...</td></tr>
              ) : filteredLetters.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400">No acceptance letters found.</td></tr>
              ) : filteredLetters.map(letter => (
                <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(letter.dateIssued), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{letter.studentName}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{letter.matricNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="truncate max-w-[200px]" title={letter.course}>{letter.course}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{letter.department}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => setSendEmailModal(letter.id)}
                        className="p-1.5 text-gray-400 hover:text-green-600 transition-colors" title="Send via Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSendWhatsappModal(letter.id)}
                        className="p-1.5 text-gray-400 hover:text-green-500 transition-colors" title="Send via WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownload(letter.id, letter.matricNumber)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(letter.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Delete Letter"
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
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Issue IT Acceptance Letter">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Full Name</label>
            <input required {...register('studentName')} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Matric / Registration Number</label>
            <input required {...register('matricNumber')} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm" placeholder="U1/20/CS/0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <input required {...register('department')} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm" placeholder="Department of Computer Science" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course of Study</label>
            <input required {...register('course')} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm" placeholder="B.Sc Computer Science" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Address (To:)</label>
            <textarea required rows={3} {...register('recipientAddress')} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm" placeholder="Ahmadu Bello University,&#10;Zaria, Kaduna State." />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center text-sm font-medium">
              {isSubmitting ? 'Generating...' : 'Generate Letter'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Email Modal */}
      <Modal isOpen={!!sendEmailModal} onClose={() => setSendEmailModal(null)} title="Send Letter via Email">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Email Address</label>
            <input type="email" value={emailTo} onChange={e => setEmailTo(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="student@example.com" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSendEmailModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={() => handleSendEmail(sendEmailModal!)} disabled={!emailTo} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center text-sm font-medium">
              <Mail className="w-4 h-4 mr-2" /> Send Email
            </button>
          </div>
        </div>
      </Modal>

      {/* WhatsApp Modal */}
      <Modal isOpen={!!sendWhatsappModal} onClose={() => setSendWhatsappModal(null)} title="Send Letter via WhatsApp">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp Number (with country code)</label>
            <input type="text" value={whatsappPhone} onChange={e => setWhatsappPhone(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="2348000000000" />
            <p className="text-xs text-gray-500 mt-1">Example: 2348012345678</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSendWhatsappModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={() => handleSendWhatsapp(sendWhatsappModal!)} disabled={!whatsappPhone} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 inline-flex items-center text-sm font-medium">
              <MessageSquare className="w-4 h-4 mr-2" /> Send WhatsApp
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
