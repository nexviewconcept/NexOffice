import { useState } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { 
  LayoutDashboard, Users, Briefcase, FileText, 
  Settings, LogOut, Menu, X, CheckCircle, DollarSign, Folder, Mail, 
  Shield, Database, Lock, MessageSquare, Package, Award, Bell, Sun, Moon, Cpu
} from 'lucide-react';

export default function DashboardLayout() {
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
      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 shadow-md flex-col border-r border-gray-100 dark:border-gray-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex`}>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center h-16">
          <img src={theme === 'dark' ? "/light-logo.png" : "/logo.png"} alt="Nexview Concept" className="h-8 object-contain" />
          <button className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 flex-1 overflow-y-auto">
          <NavLink to="/" className={navClass} end>
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </NavLink>
          <NavLink to="/users" className={navClass}>
            <Shield className="w-5 h-5 mr-3" /> System Users
          </NavLink>
          <NavLink to="/permissions" className={navClass}>
            <Lock className="w-5 h-5 mr-3" /> Roles & Permissions
          </NavLink>
          <NavLink to="/staff" className={navClass}>
            <Users className="w-5 h-5 mr-3" /> Staff Profiles
          </NavLink>
          <NavLink to="/clients" className={navClass}>
            <Briefcase className="w-5 h-5 mr-3" /> Clients
          </NavLink>
          <NavLink to="/invoices" className={navClass}>
            <FileText className="w-5 h-5 mr-3" /> Invoices
          </NavLink>
          <NavLink to="/receipts" className={navClass}>
            <CheckCircle className="w-5 h-5 mr-3" /> Receipts
          </NavLink>
          <NavLink to="/finance" className={navClass}>
            <DollarSign className="w-5 h-5 mr-3" /> Finance
          </NavLink>
          <NavLink to="/files" className={navClass}>
            <Folder className="w-5 h-5 mr-3" /> File Manager
          </NavLink>
          <NavLink to="/emails" className={navClass}>
            <Mail className="w-5 h-5 mr-3" /> Email Center
          </NavLink>
          <NavLink to="/inventory" className={navClass}>
            <Package className="w-5 h-5 mr-3" /> Inventory
          </NavLink>
          <NavLink to="/certificates" className={navClass}>
            <Award className="w-5 h-5 mr-3" /> Certificates
          </NavLink>
          <NavLink to="/notifications" className={navClass}>
            <Bell className="w-5 h-5 mr-3" /> Notifications
          </NavLink>
          <NavLink to="/support-tickets" className={navClass}>
            <MessageSquare className="w-5 h-5 mr-3" /> Support Tickets
          </NavLink>
          <NavLink to="/service-logs" className={navClass}>
            <Cpu className="w-5 h-5 mr-3" /> NIN & Services Log
          </NavLink>
          <NavLink to="/backups" className={navClass}>
            <Database className="w-5 h-5 mr-3" /> Database Backups
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950">
        <header className="h-16 bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-4 md:px-6 z-10 border-b border-gray-100 dark:border-gray-800 sticky top-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">NexOffice</h1>
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
              className="w-10 h-10 bg-[#E50914] text-white rounded-full flex items-center justify-center font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:opacity-90 transition overflow-hidden"
            >
              {user?.staffProfile?.photoUrl ? (
                <img src={`http://localhost:3000${user.staffProfile.photoUrl}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.email?.charAt(0).toUpperCase() || 'SA'
              )}
            </button>

            {isProfileMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 border border-gray-100 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-700 mb-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{user?.email}</p>
                  </div>
                  <Link 
                    to="/settings" 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <button 
                    onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
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
