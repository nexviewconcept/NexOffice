import { useState, useEffect } from 'react';
import { Plus, Download, Upload, Loader2, Search, Eye, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

interface StaffProfile {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  department: string | null;
  designation: string | null;
  staffIdNumber: string;
  photoUrl: string | null;
  dateJoined: string;
  user?: { email: string; status: string; }
}

export default function StaffProfiles() {
  const { user } = useAuthStore();
  const [profiles, setProfiles] = useState<StaffProfile[]>([]);

  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', middleName: '', lastName: '', department: '', designation: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  
  const [uploading, setUploading] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await api.get('/staff-profiles');
      setProfiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/staff-profiles', formData);
      setIsModalOpen(false);
      setFormData({ firstName: '', middleName: '', lastName: '', department: '', designation: '', email: '', password: '' });
      fetchProfiles();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoUpload = async (id: string, file: File) => {
    setUploading(id);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      await api.post(`/staff-profiles/${id}/photo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProfiles();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(null);
    }
  };

  const handleDownloadId = async (id: string, name: string, action: 'download' | 'preview' = 'download') => {
    try {
      if (action === 'preview') {
        setPreviewLoading(true);
        setIsPreviewOpen(true);
      } else {
        setDownloading(id);
      }
      
      const res = await api.get(`/staff-profiles/${id}/id-card?action=${action}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      
      if (action === 'preview') {
        setPreviewUrl(url);
        setPreviewLoading(false);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `IDCard_${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        setDownloading(null);
      }
    } catch (err) {
      console.error('Download failed', err);
      if (action === 'preview') {
        setPreviewLoading(false);
        setIsPreviewOpen(false);
        alert('Failed to load preview');
      } else {
        setDownloading(null);
      }
    }
  };

  const deleteProfile = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff profile?')) return;
    try {
      await api.delete(`/staff-profiles/${id}`);
      fetchProfiles();
    } catch (err) {
      alert('Failed to delete profile');
    }
  };

  const filtered = profiles.filter(p => 
    `${p.firstName} ${p.middleName || ''} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) || 
    p.staffIdNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Staff Profiles</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Staff">
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input required type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Middle Name</label>
              <input type="text" value={formData.middleName} onChange={e => setFormData({...formData, middleName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="O." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input required type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="jane.doe@nexviewconcept.com.ng" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Password</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="e.g. IT, Operations" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation / Role</label>
            <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-[#E50914] focus:border-[#E50914] outline-none" placeholder="e.g. Software Engineer" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-medium text-white bg-[#E50914] hover:bg-red-700 rounded-lg transition-colors flex items-center disabled:opacity-70">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Save Staff
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
              placeholder="Search staff or ID..." 
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
                <th className="px-6 py-4 font-medium">Staff ID</th>
                <th className="px-6 py-4 font-medium">Designation</th>
                <th className="px-6 py-4 font-medium">Account</th>
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No staff found.</td>
                </tr>
              ) : (
                filtered.map(profile => (
                  <tr key={profile.id} className="hover:bg-gray-50 dark:bg-gray-950/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {profile.photoUrl ? (
                          <img src={`http://localhost:3000${profile.photoUrl}`} alt="Profile" className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 dark:text-gray-400 font-bold text-xs mr-3">
                            {profile.firstName[0]}{profile.lastName[0]}
                          </div>
                        )}
                        <span className="font-medium text-gray-800 dark:text-gray-100">{profile.firstName} {profile.middleName ? profile.middleName + ' ' : ''}{profile.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">{profile.staffIdNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{profile.designation || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span className="text-gray-800 dark:text-gray-100">{profile.user?.email}</span>
                        <span className={`text-xs font-medium mt-1 w-fit px-2 py-0.5 rounded-full ${
                          profile.user?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>{profile.user?.status || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <div className="relative">
                        <input 
                          type="file" 
                          id={`photo-upload-${profile.id}`} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handlePhotoUpload(profile.id, e.target.files[0]);
                          }}
                        />
                        <label 
                          htmlFor={`photo-upload-${profile.id}`}
                          className="cursor-pointer text-gray-400 hover:text-blue-500 transition-colors inline-flex mr-2"
                          title="Upload Photo"
                        >
                          {uploading === profile.id ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : <Upload className="w-4 h-4" />}
                        </label>
                      </div>

                      {profile.photoUrl ? (
                        <>
                          <button 
                            onClick={() => handleDownloadId(profile.id, profile.firstName, 'preview')}
                            disabled={downloading === profile.id}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:text-gray-100 transition-colors inline-flex"
                            title="Preview ID Card"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownloadId(profile.id, profile.firstName, 'download')}
                            disabled={downloading === profile.id}
                            className="text-[#E50914] hover:text-red-700 transition-colors inline-flex"
                            title="Download ID Card"
                          >
                            {downloading === profile.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          </button>
                        </>
                      ) : (
                        <button onClick={() => alert('A profile photo is required to generate the Staff ID Card. Please upload a photo first.')} className="text-gray-400 hover:text-red-500 transition-colors mr-2" title="Upload a photo to generate ID">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      
                      {user?.roles?.includes('SUPER_ADMIN') && (
                        <button
                          onClick={() => deleteProfile(profile.id)}
                          className="text-red-400 hover:text-red-600 transition-colors inline-flex ml-2"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    
      <Modal isOpen={isPreviewOpen} onClose={() => { setIsPreviewOpen(false); if (previewUrl) window.URL.revokeObjectURL(previewUrl); setPreviewUrl(''); }} title="Preview Document">
        <div className="w-full max-w-4xl">
          {previewLoading ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center h-[70vh]">
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading preview...
            </div>
          ) : previewUrl ? (
            <iframe src={previewUrl} className="w-full h-[75vh] border rounded-lg bg-gray-50 dark:bg-gray-950" title="Document Preview" />
          ) : null}
        </div>
      </Modal>
    </div>
  );
}