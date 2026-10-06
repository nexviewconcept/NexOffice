import { Link } from 'react-router-dom';
import { FileText, Copy, FileImage, PenTool, ArrowRight } from 'lucide-react';

export default function DocumentsEditor() {
  const tools = [
    {
      name: 'JPG to PDF Converter',
      description: 'Convert multiple JPG/PNG images into a single PDF document.',
      icon: FileText,
      href: '/admin/converter',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      name: 'Merge PDF & Images',
      description: 'Combine multiple PDF files and append images into one single document.',
      icon: Copy,
      href: '/admin/merge-pdf',
      color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      name: 'PDF to Image Converter',
      description: 'Extract all pages from a PDF and download them as high-quality JPG images.',
      icon: FileImage,
      href: '/admin/pdf-to-image',
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      name: 'Official Letter Creator',
      description: 'Draft and generate official letters and Board Resolutions on the company letterhead.',
      icon: PenTool,
      href: '/admin/letter-creator',
      color: 'bg-[#E50914]/10 text-[#E50914] dark:bg-red-900/20 dark:text-red-400'
    },
    {
      name: 'PDF Compressor',
      description: 'Reduce the file size of your PDF documents quickly.',
      icon: FileText,
      href: '/admin/pdf-compressor',
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-[#E50914]" />
          Documents Editor Suite
        </h1>
        <p className="text-gray-500 mt-1">Access all your document management and editing tools in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <Link 
              key={idx} 
              to={tool.href}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${tool.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{tool.description}</p>
              </div>
              <div className="mt-6 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#E50914] transition-colors">
                Open Tool <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
