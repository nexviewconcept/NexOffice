import { useState, useEffect } from 'react';
import { Plus, Search, Download, Loader2, Award, Eye } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

interface Certificate {
  id: string;
  recipientName: string;
  courseName: string;
  certificateNumber: string;
  issueDate: string;
  status: string;
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    recipientName: '', 
    courseName: '',
    startDate: '',
    endDate: '',
    skillsLearned: '',
    issueDate: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates');
      setCertificates(res.data);
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
      await api.post('/certificates', {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        issueDate: new Date(formData.issueDate).toISOString()
      });
      setIsModalOpen(false);
      setFormData({ 
        recipientName: '', 
        courseName: '',
        startDate: '',
        endDate: '',
        skillsLearned: '',
        issueDate: new Date().toISOString().split('T')[0]
      });
      fetchCertificates();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (id: string, action: 'download' | 'preview' = 'download') => {
    try {
      if (action === 'preview') {
        setPreviewLoading(true);
        setIsPreviewOpen(true);
      } else {
        setDownloading(id);
      }
      
      const res = await api.get(`/certificates/${id}/pdf`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      if (action === 'preview') {
        setPreviewUrl(url);
        setPreviewLoading(false);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Certificate_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        setDownloading(null);
      }
    } catch (err) {
      console.error('Download failed', err);
      setDownloading(null);
      if (action === 'preview') {
        setPreviewLoading(false);
        setIsPreviewOpen(false);
        alert('Failed to load certificate preview');
      }
    }
  };

  const filtered = certificates.filter(c => 
    c.recipientName.toLowerCase().includes(search.toLowerCase()) || 
    c.certificateNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Certificates</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Certificate
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Generate New Certificate">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Name</label>
            <input required type="text" value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course / Program Name</label>
            <input required type="text" value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="Web Development Bootcamp" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date (From)</label>
              <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date (To) <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Things Learned <span className="text-gray-400 font-normal">(Optional)</span></label>
            <textarea value={formData.skillsLearned} onChange={e => setFormData({...formData, skillsLearned: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none min-h-[80px]" placeholder="e.g. React, Node.js, Frontend Architecture..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
            <input required type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-[#E50914] hover:bg-red-700 rounded-lg transition-colors flex items-center disabled:opacity-70">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Generate
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
              placeholder="Search by name or ID..." 
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
                <th className="px-6 py-4 font-medium">Recipient</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Cert Number</th>
                <th className="px-6 py-4 font-medium">Date Issued</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading certificates...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No certificates generated yet.</td>
                </tr>
              ) : (
                filtered.map(cert => (
                  <tr key={cert.id} className="hover:bg-gray-50 dark:bg-gray-950/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-gray-400 mr-2" />
                        {cert.recipientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{cert.courseName}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">{cert.certificateNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(cert.issueDate || Date.now()).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDownload(cert.id, 'preview')}
                          disabled={downloading === cert.id}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 p-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                          title="Preview PDF"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDownload(cert.id, 'download')}
                          disabled={downloading === cert.id}
                          className="text-[#E50914] hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                        >
                          {downloading === cert.id ? (
                            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 mr-1.5" />
                          )}
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    
      <Modal 
        isOpen={isPreviewOpen} 
        onClose={() => { setIsPreviewOpen(false); if (previewUrl) window.URL.revokeObjectURL(previewUrl); setPreviewUrl(''); }} 
        title="Certificate Preview"
        maxWidth="max-w-5xl"
      >
        <div className="w-full">
          {previewLoading ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-[60vh]">
              <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin mb-4"></div>
              Generating Certificate Preview...
            </div>
          ) : previewUrl ? (
            <div className="flex flex-col gap-3">
              <iframe 
                src={`${previewUrl}#toolbar=1`} 
                className="w-full h-[70vh] border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-950 shadow-inner" 
                title="Certificate PDF Preview" 
              />
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition"
                >
                  Open in Full Window
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}