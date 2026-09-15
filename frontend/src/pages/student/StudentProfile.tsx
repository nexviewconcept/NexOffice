import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api';
import { User, Loader2, AlertCircle } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/students')
      .then(res => {
        // Find this student's profile linked to their user id
        const myProfile = res.data.find((s: any) => s.userId === user?.id);
        if (myProfile) setProfile(myProfile);
        else setError('No student profile found for this account.');
      })
      .catch(() => setError('Failed to load profile. Please try again.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center h-60">
      <Loader2 className="animate-spin h-8 w-8 text-[#E50914]" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center">
      <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
      <p className="text-red-700 dark:text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Profile</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-[#E50914] h-24"></div>
        <div className="px-8 pb-8">
          <div className="-mt-10 mb-6">
            {profile?.photoUrl ? (
              <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${profile.photoUrl}`} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{profile?.firstName} {profile?.middleName} {profile?.lastName}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Student ID: {profile?.studentIdNumber}</p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-gray-800 dark:text-gray-200">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-800 dark:text-gray-200">{profile?.phone || '—'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-gray-800 dark:text-gray-200">{profile?.address || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${profile?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {profile?.status || 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
