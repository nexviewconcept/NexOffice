import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">About Nexview Concept</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          We are a technology-driven enterprise committed to delivering seamless solutions 
          that bridge the gap between businesses, services, and the people they serve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <img src="/ref-cert.jpg" alt="Our Operations" className="rounded-2xl shadow-xl w-full h-auto object-cover" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            To innovate and provide secure, reliable, and accessible enterprise management and 
            verification systems across sectors. We build ecosystems that empower organizations 
            and their clients.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-[#E50914] mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Enterprise-grade security and data protection.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-[#E50914] mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Reliable operations management through NexOffice.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-[#E50914] mr-3 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">Trusted public document verification via NVerify.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Our Ecosystem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-[#E50914] mb-3">NexOffice</h3>
            <p className="text-gray-600 dark:text-gray-400">Our central nervous system handling HR, finance, invoices, students, and operational audits.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-[#E50914] mb-3">NVerify</h3>
            <p className="text-gray-600 dark:text-gray-400">A public gateway for securely verifying documents, certificates, and staff identities.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-[#E50914] mb-3">NDesk</h3>
            <p className="text-gray-600 dark:text-gray-400">A robust desktop client bringing powerful features directly to local machines securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
