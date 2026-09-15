import { useState } from 'react';
import { Search, FileText, UserCheck, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VerifyGateway() {
  const [verifyType, setVerifyType] = useState('staff');
  const [verifyId, setVerifyId] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyId.trim()) return;
    
    // Route to existing NVerify pages which handle the actual secure lookups
    navigate(`/verify/${verifyType}/${encodeURIComponent(verifyId.trim())}`);
  };

  return (
    <div className="w-full">
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full mb-6">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">NVerify Central Gateway</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Securely verify documents, staff identities, certificates, and official records using our cryptographically secured lookup system.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-10 mb-20">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleVerify} className="space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button type="button" onClick={() => setVerifyType('staff')} className={`p-4 rounded-xl border text-center transition ${verifyType === 'staff' ? 'border-[#E50914] bg-red-50 dark:bg-red-900/20 text-[#E50914]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                <UserCheck className="mx-auto h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Staff ID</span>
              </button>
              
              <button type="button" onClick={() => setVerifyType('certificate')} className={`p-4 rounded-xl border text-center transition ${verifyType === 'certificate' ? 'border-[#E50914] bg-red-50 dark:bg-red-900/20 text-[#E50914]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                <Award className="mx-auto h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Certificate</span>
              </button>

              <button type="button" onClick={() => setVerifyType('invoice')} className={`p-4 rounded-xl border text-center transition ${verifyType === 'invoice' ? 'border-[#E50914] bg-red-50 dark:bg-red-900/20 text-[#E50914]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                <FileText className="mx-auto h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Invoice</span>
              </button>

              <button type="button" onClick={() => setVerifyType('receipt')} className={`p-4 rounded-xl border text-center transition ${verifyType === 'receipt' ? 'border-[#E50914] bg-red-50 dark:bg-red-900/20 text-[#E50914]' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                <FileText className="mx-auto h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Receipt</span>
              </button>
            </div>

            <div className="relative">
              <input 
                type="text" 
                placeholder={`Enter ${verifyType} verification ID...`} 
                required
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-[#E50914]"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            </div>

            <button type="submit" className="w-full bg-[#E50914] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition">
              Verify Document
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            For support with verification issues, please <a href="/contact" className="text-[#E50914] hover:underline">contact our helpdesk</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
