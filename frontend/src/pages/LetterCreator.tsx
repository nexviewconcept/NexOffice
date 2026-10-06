import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { PenTool, Download, Loader2 } from 'lucide-react';
import api from '../lib/api';

export default function LetterCreator() {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const handleGenerate = async () => {
    if (!recipient || !subject || !content) {
      alert('Please fill in all fields before generating.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.post('/documents/custom-letter', {
        recipient,
        subject,
        content
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Official_Letter_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to generate letter. Make sure letterhead and signature are configured in Settings.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <PenTool className="w-8 h-8 mr-3 text-[#E50914]" />
          Official Letter Creator
        </h1>
        <p className="text-gray-500 mt-1">Draft and generate official letters on the company letterhead.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipient Address (To:)</label>
          <textarea 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            rows={3} 
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#E50914] focus:border-[#E50914]" 
            placeholder="The Managing Director,&#10;XYZ Corporation,&#10;Abuja, Nigeria." 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Letter Subject / Title</label>
          <input 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            type="text" 
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#E50914] focus:border-[#E50914]" 
            placeholder="LETTER OF INVITATION FOR PARTNERSHIP" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Letter Body</label>
          <div className="bg-white dark:bg-gray-800 text-black">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              className="h-64 mb-12"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center font-medium"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
