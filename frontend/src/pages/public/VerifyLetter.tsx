import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, ArrowLeft, Loader2, Building, User, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/api';

export default function VerifyLetter() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [letter, setLetter] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const res = await api.get(`/acceptance-letters/${id}`);
        setLetter(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Invalid or non-existent acceptance letter record.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLetter();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8 text-center">
        <img src="/logo.png" alt="Nexview Concept" className="h-12 mx-auto dark:hidden" />
        <img src="/light-logo.png" alt="Nexview Concept" className="h-12 mx-auto hidden dark:block" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Document Verification</h2>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-12 h-12 animate-spin text-[#E50914] mb-4" />
              <p className="font-medium">Verifying Document Record...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                <XCircle className="h-10 w-10 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h3>
              <p className="text-gray-500 dark:text-gray-400">{error}</p>
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Valid Acceptance Letter</h3>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1 flex items-center justify-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified by Nexview Systems
                </p>
              </div>

              <div className="space-y-5 bg-gray-50 dark:bg-gray-950 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Student Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{letter.studentName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center text-gray-400 mt-0.5 font-bold text-sm">#</div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Matric Number</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{letter.matricNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Course & Dept</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{letter.course}</p>
                    <p className="text-sm text-gray-500">{letter.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Recipient / Institution</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-pre-line">{letter.recipientAddress}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Issued on: {format(new Date(letter.dateIssued), 'MMMM d, yyyy')}
                </p>
                <p className="text-xs text-gray-400 mt-1">Ref: {letter.id}</p>
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-950 px-8 py-4 border-t border-gray-100 dark:border-gray-800">
          <Link to="/" className="text-sm font-medium text-[#E50914] hover:text-red-700 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go to Homepage
          </Link>
        </div>
      </div>
      
      <div className="mt-12 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Nexview Concept Limited. All rights reserved.
      </div>
    </div>
  );
}
