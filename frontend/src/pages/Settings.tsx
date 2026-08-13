import { useState, useEffect } from 'react';
import api from '../lib/api';
import { User, Lock, Save, Loader2 } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const [profile, setProfile] = useState({ firstName: '', middleName: '', lastName: '', department: '', designation: '', photoUrl: '' });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await api.get('/staff-profiles/me');
      if (res.data) {
        setProfile({
          firstName: res.data.firstName || '',
          middleName: res.data.middleName || '',
          lastName: res.data.lastName || '',
          department: res.data.department || '',
          designation: res.data.designation || '',
          photoUrl: res.data.photoUrl || ''
        });
      }
    } catch (err: any) {
      // Profile might not exist yet, that's fine
      console.log('Profile not found, starting fresh');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setPhotoUploading(true);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      // Assuming 'me' photo upload route exists or use a generic one if we have their ID
      // But wait, the backend doesn't have /staff-profiles/me/photo. Let's use the one that requires ID.
      // Actually, we can fetch their profile ID from res.data and use it, or create a new route.
      // It's better if we update the backend controller to handle `POST /staff-profiles/me/photo`
      await api.post(`/staff-profiles/me/photo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchMyProfile();
    } catch (err) {
      console.error(err);
      alert('Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      await api.put('/staff-profiles/me', profile);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    try {
      setPasswordSaving(true);
      await api.put('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      alert('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile and security preferences.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'text-[#E50914] border-b-2 border-[#E50914] bg-red-50/50' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950'}`}
          >
            <User className="w-5 h-5" />
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'password' ? 'text-[#E50914] border-b-2 border-[#E50914] bg-red-50/50' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-gray-950'}`}
          >
            <Lock className="w-5 h-5" />
            Security & Password
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'profile' && (
            profileLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#E50914]" />
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    {profile.photoUrl ? (
                      <img src={`http://localhost:3000${profile.photoUrl}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 border-4 border-white shadow-sm">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-[#E50914] text-white p-2 rounded-full cursor-pointer hover:bg-red-700 shadow-sm transition">
                      {photoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                      <input type="file" className="hidden" accept="image/*" onChange={e => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]); }} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Profile Photo</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload a professional photo for your ID card and profile.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                    <input type="text" required value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Middle Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input type="text" value={profile.middleName} onChange={e => setProfile({...profile, middleName: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                    <input type="text" required value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                    <input type="text" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Designation</label>
                    <input type="text" value={profile.designation} onChange={e => setProfile({...profile, designation: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                  <button type="submit" disabled={profileSaving} className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                    {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Profile
                  </button>
                </div>
              </form>
            )
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" required minLength={8} value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" required minLength={8} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#E50914] focus:bg-white dark:bg-gray-900 transition-colors" />
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="submit" disabled={passwordSaving} className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                  {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Change Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
