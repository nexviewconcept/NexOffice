import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Download, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<'text' | 'url'>('text');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setText('');
      setUrl('');
      setQrDataUrl(null);
    }
  }, [isOpen]);

  const handleGenerate = async () => {
    const content = mode === 'text' ? text.trim() : url.trim();
    if (!content) return;
    
    // Auto-prepend https:// if they forgot it in url mode
    const finalContent = (mode === 'url' && !/^https?:\/\//i.test(content)) ? `https://${content}` : content;
    
    setIsGenerating(true);
    try {
      const imgUrl = await QRCode.toDataURL(finalContent, {
        type: 'image/jpeg',
        quality: 0.92,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
        width: 400
      });
      setQrDataUrl(imgUrl);
    } catch (err) {
      console.error('Error generating QR code', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <QrCode className="w-5 h-5 text-[#E50914]" />
            <h3 className="font-semibold">QR Code Generator</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => { setMode('text'); setQrDataUrl(null); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'text' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Plain Text
            </button>
            <button
              onClick={() => { setMode('url'); setQrDataUrl(null); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${mode === 'url' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Website Link (URL)
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {mode === 'text' ? 'Enter Text Content' : 'Enter Website URL'}
            </label>
            
            {mode === 'text' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to encode (press Enter for new lines)..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 dark:text-white resize-y"
              />
            ) : (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. www.nexviewconcept.com.ng"
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 dark:text-white"
              />
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || (mode === 'text' ? !text.trim() : !url.trim())}
            className="w-full py-2.5 bg-[#E50914] hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </button>

          {/* Result Area */}
          {qrDataUrl && (
            <div className="mt-2 flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="bg-white p-2 rounded-lg shadow-sm mb-4">
                <img src={qrDataUrl} alt="Generated QR Code" className="w-48 h-48 object-contain" />
              </div>
              
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download JPG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
