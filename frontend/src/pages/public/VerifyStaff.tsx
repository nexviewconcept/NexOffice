import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../lib/api';

interface VerificationData {
  staffIdNumber: string;
  firstName: string;
  lastName: string;
  designation: string;
  photoUrl: string | null;
  status: string;
}

export default function VerifyStaff() {
  const { id } = useParams();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/verify/staff/${id}`);
        setData(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#E50914] mb-4" />
        <p className="text-gray-600 dark:text-gray-400 font-medium">Verifying Staff ID...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Invalid ID</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">This Staff ID could not be found in our official records.</p>
          <div className="text-sm text-gray-400 font-mono">Scanned ID: {id}</div>
        </div>
      </div>
    );
  }

  const isActive = data.status === 'ACTIVE';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Branding */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Nexview Concept" className="h-10 object-contain" />
        </div>

        {/* Verification Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
          
          <div className={`h-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
          
          <div className="p-8 text-center">
            {isActive ? (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold text-sm mb-6 border border-green-100">
                <CheckCircle className="w-5 h-5" />
                VERIFIED ACTIVE STAFF
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full font-bold text-sm mb-6 border border-red-100">
                <XCircle className="w-5 h-5" />
                INACTIVE ACCOUNT
              </div>
            )}

            {data.photoUrl ? (
              <img 
                src={`http://localhost:3000${data.photoUrl}`} 
                alt="Profile" 
                className={`w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 ${isActive ? 'border-green-100' : 'border-red-100'}`}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4 flex items-center justify-center text-gray-400 text-sm">
                No Photo
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{data.firstName} {data.lastName}</h2>
            <p className="text-[#E50914] font-medium mt-1">{data.designation}</p>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Staff ID Number</span>
                <span className="font-mono font-medium text-gray-800 dark:text-gray-100">{data.staffIdNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400">Organization</span>
                <span className="font-medium text-gray-800 dark:text-gray-100">Nexview Concept Ltd.</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          This is an official digital verification page of Nexview Concept Limited. 
          If you suspect this page is fraudulent, please contact info@nexviewconcept.com.ng.
        </p>
      </div>
    </div>
  );
}
