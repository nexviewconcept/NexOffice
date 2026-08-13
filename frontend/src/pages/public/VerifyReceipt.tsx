import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../lib/api';

export default function VerifyReceipt() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      try {
        const res = await api.get(`/verify/receipt/${id}`);
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
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full border-t-8 border-[#10B981]">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Nexview Concept" className="h-10 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Receipt Verification</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-12 h-12 text-[#10B981] animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Verifying Official Receipt...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-600 mb-2">Invalid Receipt</h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        ) : data ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Verified Official Receipt</h3>
            
            <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-6 space-y-4 text-left border border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Receipt Number</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{data.receiptNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Amount</p>
                <p className="font-bold text-2xl text-[#10B981]">₦{data.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Payment Date</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(data.paymentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Paid By (Client)</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{data.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">For Invoice</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{data.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-bold mb-1">Payment Method</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{data.paymentMethod}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              This receipt is officially issued by Nexview Concept Limited.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
