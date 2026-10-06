import { useState, useRef } from 'react';
import { FileDown, Download, Loader2, FileText, Minimize2 } from 'lucide-react';
import api from '../lib/api';

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        alert('Please select a valid PDF file.');
        return;
      }
      setFile(selected);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/documents/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Compressed_${file.name}`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert('Failed to compress PDF. The file might be encrypted or too large.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <Minimize2 className="w-8 h-8 mr-3 text-[#E50914]" />
          PDF Compressor
        </h1>
        <p className="text-gray-500 mt-1">Reduce the file size of your PDF documents quickly.</p>
      </div>

      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept="application/pdf"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <FileDown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Click to select a PDF file</p>
        <p className="text-sm text-gray-500 mt-1">{file ? file.name : 'Select a file to compress'}</p>
      </div>

      {file && (
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="mb-6 text-center">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              {file.name}
            </h3>
            <p className="text-sm text-gray-500">Original Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <button 
            onClick={handleCompress} 
            disabled={isProcessing}
            className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center font-medium"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Minimize2 className="w-5 h-5 mr-2" />}
            {isProcessing ? 'Compressing...' : 'Compress PDF'}
          </button>
        </div>
      )}
    </div>
  );
}
