import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { BookOpen, Loader2, CheckCircle, Clock } from 'lucide-react';

export default function StudentCourses() {
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/students')
      .then(res => {
        const myProfile = res.data.find((s: any) => s.userId === user?.id);
        if (myProfile?.enrollments) {
          setEnrollments(myProfile.enrollments);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const statusIcon = (status: string) => {
    if (status === 'COMPLETED') return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <Clock className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Courses</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-[#E50914]" />
        </div>
      ) : enrollments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Courses Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">You are not enrolled in any courses. Contact your administrator.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enr: any) => (
            <div key={enr.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mr-4">
                  <BookOpen className="w-6 h-6 text-[#E50914]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{enr.course?.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration: {enr.course?.duration || 'N/A'} 
                    {enr.startDate && ` • Started: ${new Date(enr.startDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statusIcon(enr.status)}
                <span className={`text-sm font-medium ${enr.status === 'COMPLETED' ? 'text-green-600' : 'text-blue-600'}`}>
                  {enr.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
