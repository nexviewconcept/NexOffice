import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function VerifyInvoice() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      try {
        const res = await api.get(`/verify/invoice/${id}`);
        setData(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Verification Failed');
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full border-t-8 border-blue-500">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Nexview Concept" className="h-10 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Invoice Verification</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Verifying Official Invoice...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Invalid Invoice</h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : data ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Verified Official Invoice</h3>
            
            <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-6 space-y-4 text-left border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Invoice Number</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{data.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Total Amount</p>
                <p className="font-bold text-2xl text-blue-600">₦{data.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Status</p>
                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      data.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                      data.status === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                  {data.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Billed To (Client)</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{data.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Issue Date</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(data.issueDate).toLocaleDateString()}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              This invoice is officially issued by Nexview Concept Limited.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
