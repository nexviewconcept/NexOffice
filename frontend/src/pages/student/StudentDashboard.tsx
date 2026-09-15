import { useAuthStore } from '../../store/authStore';
import { BookOpen, CreditCard, Award, User, Bell } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-red-600 to-[#E50914] rounded-2xl p-8 text-white shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.staffProfile?.firstName || 'Student'}!</h2>
          <p className="text-red-100">Here is what's happening with your academic progress today.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition">
            <Bell className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mr-4">
            <BookOpen className="w-8 h-8 text-[#E50914]" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Courses</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">2</h3>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mr-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Pending Payments</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">₦0.00</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mr-4">
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Certificates</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">1</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl mr-4">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Profile Status</p>
            <h3 className="text-xl font-bold text-green-500">Verified</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">My Courses</h3>
          <div className="space-y-4">
            <div className="border border-gray-100 dark:border-gray-700 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">Full Stack Web Development</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">In Progress</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div className="bg-[#E50914] h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">45% Completed</p>
            </div>
            
            <div className="border border-gray-100 dark:border-gray-700 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">Cybersecurity Fundamentals</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Starting Soon</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-1">
                <div className="bg-[#E50914] h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right">0% Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            <div className="flex p-4 border-l-4 border-[#E50914] bg-gray-50 dark:bg-gray-900 rounded-r-xl">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Upcoming Assessment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Please prepare for the mid-term assessment scheduled for next Friday.</p>
                <p className="text-xs text-gray-400 mt-2">2 days ago</p>
              </div>
            </div>
            <div className="flex p-4 border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 rounded-r-xl">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white">Portal Maintenance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">The student portal will undergo scheduled maintenance this Sunday.</p>
                <p className="text-xs text-gray-400 mt-2">5 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
