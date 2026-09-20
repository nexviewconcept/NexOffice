import React, { useState, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { X, Download, Barcode } from 'lucide-react';

interface BarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BarcodeModal({ isOpen, onClose }: BarcodeModalProps) {
  const [text, setText] = useState('');
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setText('');
      setBarcodeDataUrl(null);
      setError(null);
    }
  }, [isOpen]);

  const handleGenerate = () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      // Generate Barcode on a canvas
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, text.trim(), {
        format: 'CODE128',
        lineColor: '#000000',
        width: 2,
        height: 100,
        displayValue: true
      });
      
      // Convert to JPG
      // For JPG, canvas needs a white background since transparent becomes black
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Create a new canvas to draw white background
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvas.width;
        finalCanvas.height = canvas.height;
        const finalCtx = finalCanvas.getContext('2d');
        if (finalCtx) {
          finalCtx.fillStyle = '#ffffff';
          finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
          finalCtx.drawImage(canvas, 0, 0);
          setBarcodeDataUrl(finalCanvas.toDataURL('image/jpeg', 0.92));
        } else {
          setBarcodeDataUrl(canvas.toDataURL('image/jpeg', 0.92));
        }
      } else {
        setBarcodeDataUrl(canvas.toDataURL('image/jpeg', 0.92));
      }
    } catch (err: any) {
      console.error('Error generating Barcode', err);
      setError("Invalid format for Barcode. Please check your text.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!barcodeDataUrl) return;
    
    const link = document.createElement('a');
    link.href = barcodeDataUrl;
    link.download = `barcode-${Date.now()}.jpg`;
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
            <Barcode className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            <h3 className="font-semibold">Barcode Generator</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Code Content (Alphanumeric)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. 1234567890"
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!text.trim() || isGenerating}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Barcode'}
          </button>

          {/* Result Area */}
          {barcodeDataUrl && !error && (
            <div className="mt-2 flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 w-full flex justify-center overflow-x-auto">
                <img src={barcodeDataUrl} alt="Generated Barcode" className="max-h-32 object-contain" />
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
