import { Download, Monitor, ShieldCheck, Zap } from 'lucide-react';

export default function NDesk() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <div className="inline-block bg-red-100 dark:bg-red-900/30 text-[#E50914] px-4 py-1.5 rounded-full font-medium text-sm">
            Available Now for Windows
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
            NDesk Desktop Client
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Take NexOffice to the next level with our native desktop client. Experience faster workflows, offline capabilities, and deeper system integration.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <a href="/downloads/ndesk-windows-x64.exe" className="bg-[#E50914] text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center shadow-lg shadow-red-500/30">
              <Download className="mr-3 h-5 w-5" /> Download for Windows
            </a>
            <button disabled className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-8 py-4 rounded-xl font-bold cursor-not-allowed flex items-center justify-center border border-gray-200 dark:border-gray-700">
              Mac (Coming Soon)
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Version 1.2.0 • Windows 10/11 (64-bit) • 45MB
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 rounded-3xl blur-3xl opacity-20 dark:opacity-40 animate-pulse"></div>
          <img src="/ndesk-mockup.png" alt="NDesk Interface" className="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full object-cover bg-white dark:bg-gray-900 min-h-[300px]" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'; }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Zap className="h-10 w-10 text-[#E50914] mb-6" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Lightning Fast</h3>
          <p className="text-gray-600 dark:text-gray-400">Native performance leveraging your hardware directly. Say goodbye to browser memory limits and tab switching.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Monitor className="h-10 w-10 text-[#E50914] mb-6" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">System Integration</h3>
          <p className="text-gray-600 dark:text-gray-400">Direct integration with your local file system, printers, and smart card readers for biometric services.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <ShieldCheck className="h-10 w-10 text-[#E50914] mb-6" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Enhanced Security</h3>
          <p className="text-gray-600 dark:text-gray-400">Encrypted local caching, session locking, and hardware-bound tokens ensure your operations stay secure.</p>
        </div>
      </div>
    </div>
  );
}
