import { useState, useEffect } from 'react';
import { Upload, File, FileText, Image as ImageIcon, Folder, Download, Trash2, Search } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';

export default function FileManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [search, setSearch] = useState('');

  // Upload Modal
  const [uploadModal, setUploadModal] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [folderDest, setFolderDest] = useState('General');
  const [description, setDescription] = useState('');
  const [sharedWithOption, setSharedWithOption] = useState('ALL'); // 'ALL', 'SELF', or specific email
  const [shouldCompress, setShouldCompress] = useState(false);
  const [uploading, setUploading] = useState(false);

  const folders = ['All', 'CAC Documents', 'Legal', 'Financial', 'HR', 'Technical', 'Projects', 'General'];

  useEffect(() => {
    fetchFiles();
    fetchUsers();
  }, [selectedFolder]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsersList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const folderParam = selectedFolder !== 'All' ? `?folder=${encodeURIComponent(selectedFolder)}` : '';
      const res = await api.get(`/files${folderParam}`);
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('folder', folderDest);
    formData.append('sharedWith', sharedWithOption);
    formData.append('compress', shouldCompress ? 'true' : 'false');
    if (description) formData.append('description', description);

    try {
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadModal(false);
      setFileToUpload(null);
      setDescription('');
      setShouldCompress(false);
      setSharedWithOption('ALL');
      fetchFiles();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return;
    try {
      await api.delete(`/files/${id}`);
      fetchFiles();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (id: string, originalName: string, mimeType: string) => {
    try {
      const res = await api.get(`/files/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: mimeType }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('image')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return <File className="w-8 h-8 text-yellow-500" />;
    return <File className="w-8 h-8 text-gray-500 dark:text-gray-400" />;
  };

  const filteredFiles = files.filter(f => f.originalName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">File Manager</h2>
        <button 
          onClick={() => setUploadModal(true)}
          className="bg-[#E50914] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload File
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        
        {/* Folders Sidebar */}
        <div className="w-full md:w-64 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex flex-col gap-1 overflow-y-auto shrink-0">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Folders</h3>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedFolder === folder 
                  ? 'bg-red-50 text-[#E50914] font-semibold border border-red-100' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-950'
              }`}
            >
              <Folder className={`w-4 h-4 mr-3 ${selectedFolder === folder ? 'text-[#E50914]' : 'text-gray-400'}`} />
              {folder}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col min-h-0">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">{selectedFolder} Files</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search files..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:border-gray-400 w-64"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-950/30">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Loading files...</div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Folder className="w-16 h-16 mb-4 opacity-20" />
                <p>No files found in {selectedFolder}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
                {filteredFiles.map(file => (
                  <div key={file.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-red-200 transition-all group flex flex-col h-[180px]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg group-hover:bg-red-50 transition-colors">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDownload(file.id, file.originalName, file.mimeType)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(file.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate" title={file.originalName}>
                        {file.originalName}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatSize(file.size)}</span>
                        <span className="text-xs text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                      {file.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-1" title={file.description}>
                          {file.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      <Modal isOpen={uploadModal} onClose={() => setUploadModal(false)} title="Upload & Share File">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select File</label>
            <input required type="file" onChange={e => setFileToUpload(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination Folder</label>
            <select required value={folderDest} onChange={e => setFolderDest(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
              {folders.filter(f => f !== 'All').map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Share With (Target Recipient)</label>
            <select value={sharedWithOption} onChange={e => setSharedWithOption(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm">
              <option value="ALL">🌐 Share with Everyone in Organization</option>
              <option value="SELF">🔒 Send to Myself (Private Personal File)</option>
              <optgroup label="Direct Staff Share">
                {usersList.map(u => (
                  <option key={u.id} value={u.email}>
                    👤 {u.staffProfile ? `${u.staffProfile.firstName} ${u.staffProfile.lastName}` : u.email} ({u.email})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-950 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
            <input 
              type="checkbox" 
              id="compressOpt"
              checked={shouldCompress}
              onChange={e => setShouldCompress(e.target.checked)}
              className="w-4 h-4 text-[#E50914] rounded focus:ring-red-500"
            />
            <label htmlFor="compressOpt" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              ⚡ Compress file size before saving (gzip compression)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description / Notes (Optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} placeholder="Add optional details..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setUploadModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:bg-gray-950 text-sm">Cancel</button>
            <button type="submit" disabled={uploading || !fileToUpload} className="px-4 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium">
              {uploading ? 'Uploading...' : 'Upload & Share'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
