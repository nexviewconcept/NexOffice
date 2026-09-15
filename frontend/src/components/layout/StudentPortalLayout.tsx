import { useState } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  LayoutDashboard, BookOpen, User, Bell, LogOut, Menu, X, Sun, Moon, CreditCard
} from 'lucide-react';

export default function StudentPortalLayout() {
  const { token, logout, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const navClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center py-2.5 px-4 font-medium rounded-lg mb-2 cursor-pointer transition-colors ${
      isActive ? 'bg-red-50 text-[#E50914] dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
    }`;

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'dark' : ''}`}>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-md flex-col border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center h-16">
          <img src={theme === 'dark' ? "/light-logo.png" : "/logo.png"} alt="Student Portal" className="h-8 object-contain" />
          <button className="md:hidden text-gray-500" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          <NavLink to="." className={navClass} end>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </NavLink>
          <NavLink to="profile" className={navClass}>
            <User className="w-5 h-5 mr-3" /> My Profile
          </NavLink>
          <NavLink to="courses" className={navClass}>
            <BookOpen className="w-5 h-5 mr-3" /> My Courses
          </NavLink>
          <NavLink to="payments" className={navClass}>
            <CreditCard className="w-5 h-5 mr-3" /> Payments
          </NavLink>
          <NavLink to="notifications" className={navClass}>
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950">
        <header className="h-16 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-4 md:px-6 z-10 border-b border-gray-100 dark:border-gray-800 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-gray-600 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">Student Portal</h1>
          </div>
          <div className="flex items-center gap-4 relative">
            <button 
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold shadow-sm focus:outline-none"
            >
              {user?.email?.charAt(0).toUpperCase() || 'S'}
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-100 dark:border-gray-700 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
