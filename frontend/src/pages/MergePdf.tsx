import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, File as FileIcon, X, Move, Download, Loader2 } from 'lucide-react';

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const pdfs = selectedFiles.filter(f => f.type === 'application/pdf' || f.type.startsWith('image/'));
      if (pdfs.length !== selectedFiles.length) {
        alert('Some files were ignored because they are not PDFs.');
      }
      setFiles(prev => [...prev, ...pdfs]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        if (file.type === 'application/pdf') {
          const pdf = await PDFDocument.load(fileArrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } else if (file.type.startsWith('image/')) {
          let image;
          if (file.type === 'image/jpeg') {
            image = await mergedPdf.embedJpg(fileArrayBuffer);
          } else if (file.type === 'image/png') {
            image = await mergedPdf.embedPng(fileArrayBuffer);
          }
          
          if (image) {
            const page = mergedPdf.addPage([image.width, image.height]);
            page.drawImage(image, {
              x: 0,
              y: 0,
              width: image.width,
              height: image.height,
            });
          }
        }
      }

      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Merged_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error(err);
      alert('Failed to Merge PDF & Images. One of the files might be corrupted or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <FileIcon className="w-8 h-8 mr-3 text-[#E50914]" />
          Merge PDF & Images
        </h1>
        <p className="text-gray-500 mt-1">Combine multiple PDF documents into one single file.</p>
      </div>

      <div 
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-10 text-center bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          multiple 
          accept="application/pdf,image/jpeg,image/png"
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Click to select PDF or Image files</p>
        <p className="text-sm text-gray-500 mt-1">You can upload multiple files at once</p>
      </div>

      {files.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Files to Merge ({files.length})</h2>
          
          <div className="space-y-2 mb-6">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex flex-col mr-3">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="text-gray-400 hover:text-[#E50914] disabled:opacity-30">
                      <Move className="w-3 h-3 rotate-180" />
                    </button>
                    <button onClick={() => moveDown(index)} disabled={index === files.length - 1} className="text-gray-400 hover:text-[#E50914] disabled:opacity-30">
                      <Move className="w-3 h-3" />
                    </button>
                  </div>
                  <FileIcon className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                </div>
                <button onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-[#E50914] rounded-full hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-gray-100 dark:border-gray-800 pt-4">
            <button 
              onClick={handleMerge} 
              disabled={isProcessing || files.length < 2}
              className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 inline-flex items-center font-medium"
            >
              {isProcessing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Download className="w-5 h-5 mr-2" />}
              {isProcessing ? 'Merging...' : 'Merge & Download'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

