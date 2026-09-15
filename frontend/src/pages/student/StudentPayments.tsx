import { CreditCard } from 'lucide-react';

export default function StudentPayments() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Payments</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
        <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment History</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Your payment history and receipts will appear here. 
          Contact your administrator for payment queries.
        </p>
        <div className="mt-6 inline-block bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 px-4 py-2 rounded-lg">
          <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">NOT IMPLEMENTED — Wallet integration pending</p>
        </div>
      </div>
    </div>
  );
}
