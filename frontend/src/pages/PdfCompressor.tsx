import { useState, useRef } from 'react';
import { 
  FileDown, 
  Download, 
  Loader2, 
  FileText, 
  Minimize2, 
  Sparkles, 
  Zap, 
  Layers, 
  CheckCircle, 
  ArrowRight,
  Flame,
  Info,
  RefreshCw
} from 'lucide-react';
import api from '../lib/api';

type CompressionLevel = 'recommended' | 'extreme' | 'grayscale' | 'extreme_grayscale';

interface CompressionResult {
  blob: Blob;
  downloadUrl: string;
  originalSize: number;
  compressedSize: number;
  fileName: string;
}

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('extreme');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf' && !selected.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a valid PDF file.');
        return;
      }
      setFile(selected);
      setResult(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('level', level);

    try {
      const res = await api.post('/documents/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      });

      const compressedBlob = new Blob([res.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(compressedBlob);
      
      const compSize = compressedBlob.size;
      const origSize = file.size;

      setResult({
        blob: compressedBlob,
        downloadUrl,
        originalSize: origSize,
        compressedSize: compSize,
        fileName: file.name,
      });

      // Auto trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Compressed_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Failed to compress PDF. The file might be encrypted, password-protected, or too large.';
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const calculateSavings = (orig: number, comp: number) => {
    if (orig <= 0) return '0%';
    const pct = ((orig - comp) / orig) * 100;
    if (pct <= 0) return '0%';
    return `-${pct.toFixed(1)}%`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
          <Minimize2 className="w-8 h-8 mr-3 text-[#E50914]" />
          NexView Smart PDF Compressor
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Matse kowane irin PDF zuwa kasa da 4MB koda iLovePDF ya riga ya matse shi, ko rage girman manyan takardun da aka yi scanning.
        </p>
      </div>

      {/* Info Tip */}
      <div className="bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#E50914] shrink-0 mt-0.5" />
        <div className="text-xs text-red-900 dark:text-red-300 space-y-1">
          <p className="font-semibold">Shin fayil dinka ya ki wucewa a 5–6 MB a sauran shafuka?</p>
          <p className="text-red-700 dark:text-red-400">
            Zabi <strong>Extreme Compression (Mafi Ƙarfi)</strong> domin tilasta wa tsarin sake matse hotunan da iLovePDF ya riga ya taba, ko kuma zabi <strong>Grayscale (Baki da Fari)</strong> wanda zai iya sauke kowane PDF mai 6MB zuwa kasa da 2.5MB kai tsaye!
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 sm:p-12 text-center bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept="application/pdf"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100/60 dark:bg-red-950/50 flex items-center justify-center text-[#E50914]">
          <FileDown className="w-8 h-8" />
        </div>
        <p className="text-base text-gray-800 dark:text-gray-200 font-semibold">
          {file ? file.name : 'Click or Drag & Drop PDF File Here'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {file ? `Original Size: ${formatSize(file.size)}` : 'Supports standard PDFs, scanned applications, forms, & multi-page booklets up to 60MB'}
        </p>
      </div>

      {file && (
        <div className="space-y-6">
          {/* File Selected Badge */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#E50914]" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  Original Size: <span className="font-semibold text-gray-700 dark:text-gray-300">{formatSize(file.size)}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="text-xs text-gray-400 hover:text-red-600 transition-colors"
            >
              Change file
            </button>
          </div>

          {/* Compression Level Selector */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Choose Compression Mode
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Select how aggressively you want to reduce the PDF size:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Extreme (Recommended for user's case) */}
              <button
                type="button"
                onClick={() => setLevel('extreme')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  level === 'extreme'
                    ? 'border-[#E50914] bg-red-50/60 dark:bg-red-950/30 ring-2 ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Zap className="w-4 h-4 text-orange-500" />
                      Extreme Compression
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
                      Best for &lt; 4MB
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tilasta wa tsarin sake matse hotunan da iLovePDF ya riga ya taba zuwa 60 DPI tare da rike launi.
                  </p>
                </div>
              </button>

              {/* Option 2: Grayscale */}
              <button
                type="button"
                onClick={() => setLevel('grayscale')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  level === 'grayscale'
                    ? 'border-[#E50914] bg-red-50/60 dark:bg-red-950/30 ring-2 ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Layers className="w-4 h-4 text-blue-500" />
                      Grayscale (Baki da Fari)
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      Rage 50% - 70%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cire dukkan nauyin launi (color). Yana karya girman fayil sosai yayin da rubutu ke zama fes da haske.
                  </p>
                </div>
              </button>

              {/* Option 3: Extreme Grayscale */}
              <button
                type="button"
                onClick={() => setLevel('extreme_grayscale')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  level === 'extreme_grayscale'
                    ? 'border-[#E50914] bg-red-50/60 dark:bg-red-950/30 ring-2 ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Flame className="w-4 h-4 text-red-600" />
                      Ultra Grayscale (Mafi Ƙarfi)
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                      Target &lt; 3MB
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hada Baki da Fari tare da Extreme Downsampling. Maganin manyan takardun da suka ki raguwa.
                  </p>
                </div>
              </button>

              {/* Option 4: Recommended (Standard) */}
              <button
                type="button"
                onClick={() => setLevel('recommended')}
                className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  level === 'recommended'
                    ? 'border-[#E50914] bg-red-50/60 dark:bg-red-950/30 ring-2 ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                      <Sparkles className="w-4 h-4 text-green-500" />
                      Standard Screen
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      Normal Quality
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Daidaiton inganci na asali (~72 DPI) don takardun da ba a taba compressing din su a baya ba.
                  </p>
                </div>
              </button>
            </div>

            {/* Action Button */}
            <div className="pt-2 flex justify-end">
              <button 
                onClick={handleCompress} 
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#E50914] text-white rounded-xl hover:bg-red-700 disabled:opacity-50 inline-flex items-center justify-center font-bold text-sm shadow-md shadow-red-600/10 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2.5 animate-spin" />
                    Compressing with Ghostscript Engine...
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-5 h-5 mr-2.5" />
                    Fara Compressing PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-green-200 dark:border-green-900/50 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <CheckCircle className="w-7 h-7" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Compression Completed Successfully!
              </h3>
              <p className="text-xs text-gray-500">
                An saukar da fayil dinka zuwa sabon nauyi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-950 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Original Size</p>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-0.5">
                {formatSize(result.originalSize)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">New Compressed Size</p>
              <p className="text-xl font-extrabold text-green-600 dark:text-green-400 mt-0.5">
                {formatSize(result.compressedSize)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">Reduction Ratio</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-0.5">
                {calculateSavings(result.originalSize, result.compressedSize)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={result.downloadUrl}
              download={`Compressed_${result.fileName}`}
              className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm inline-flex items-center justify-center shadow-md shadow-green-600/10 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Compressed PDF ({formatSize(result.compressedSize)})
            </a>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                handleCompress();
              }}
              className="py-3 px-5 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm inline-flex items-center justify-center transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Another Mode
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
