import { useState } from 'react';
import { FileImage, FileText, Download, Trash2, Plus, ArrowRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function JpgToPdf() {
  const [images, setImages] = useState<{ file: File; url: string }[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setGenerating(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const img = new Image();
        img.src = images[i].url;
        await new Promise((resolve) => { img.onload = resolve; });

        // Calculate aspect ratio
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;

        let renderWidth = pageWidth;
        let renderHeight = pageHeight;

        if (imgRatio > pageRatio) {
          // Image is wider than page
          renderHeight = pageWidth / imgRatio;
        } else {
          // Image is taller than page
          renderWidth = pageHeight * imgRatio;
        }

        // Center the image
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        if (i > 0) doc.addPage();
        
        doc.addImage(img, 'JPEG', x, y, renderWidth, renderHeight);
      }

      doc.save('converted-document.pdf');
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <FileImage className="w-8 h-8 mr-3 text-blue-600" />
          JPG to PDF Converter
        </h1>
        <p className="text-gray-500 mt-1">Easily convert multiple images into a single PDF document.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        
        {/* Upload Area */}
        <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none dark:bg-gray-800 dark:border-gray-700">
            <span className="flex items-center space-x-2">
                <Plus className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-600 dark:text-gray-400">
                    Drop images here, or click to select
                </span>
            </span>
            <input type="file" multiple accept="image/jpeg, image/png, image/jpg" className="hidden" onChange={handleImageUpload} />
        </label>

        {images.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Selected Images ({images.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={img.url} alt={`upload-${index}`} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button onClick={() => removeImage(index)} className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center truncate">
                    {img.file.name}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={generatePDF}
                disabled={generating}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center disabled:opacity-50"
              >
                {generating ? 'Generating PDF...' : (
                  <>
                    Convert to PDF <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
