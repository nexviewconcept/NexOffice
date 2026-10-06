import { useState, useRef, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { FileImage, FileUp, Download, Loader2 } from 'lucide-react';

export default function PdfToImage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Setup worker for pdf.js in Vite
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }, []);

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

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const zip = new JSZip();

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2.0 scale for better quality
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // @ts-ignore
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = imgData.split(',')[1];
        
        // Pad page number with zeros, e.g., Page_001.jpg
        const paddedIndex = i.toString().padStart(3, '0');
        zip.file(`Page_${paddedIndex}.jpg`, base64Data, { base64: true });

        setProgress(Math.round((i / numPages) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(zipBlob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}_Images.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert('An error occurred while converting the PDF.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <FileImage className="w-8 h-8 mr-3 text-[#E50914]" />
          PDF to Image Converter
        </h1>
        <p className="text-gray-500 mt-1">Extract all pages from a PDF and download them as high-quality JPG images.</p>
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
        <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Click to select a PDF file</p>
        <p className="text-sm text-gray-500 mt-1">Selected: {file ? file.name : 'None'}</p>
      </div>

      {file && (
        <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="mb-6 text-center">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{file.name}</h3>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          {isProcessing && (
            <div className="w-full max-w-md mb-6">
              <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-400">
                <span>Extracting pages...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-[#E50914] h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          <button 
            onClick={handleConvert} 
            disabled={isProcessing}
            className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center font-medium"
          >
            {isProcessing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
            {isProcessing ? 'Processing...' : 'Extract & Download ZIP'}
          </button>
        </div>
      )}
    </div>
  );
}
