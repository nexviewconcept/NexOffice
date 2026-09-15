import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function CorporateLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = 'text-gray-600 dark:text-gray-300 hover:text-[#E50914] dark:hover:text-[#E50914] font-medium transition-colors';

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <img src={theme === 'dark' ? "/light-logo.png" : "/logo.png"} alt="Nexview Concept" className="h-8 object-contain" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={navLinkClass}>Home</Link>
            <Link to="/services" className={navLinkClass}>Services</Link>
            <Link to="/ndesk" className={navLinkClass}>NDesk</Link>
            <Link to="/verify" className={navLinkClass}>Verify</Link>
            <Link to="/about" className={navLinkClass}>About</Link>
            <Link to="/contact" className={navLinkClass}>Contact</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="hidden sm:inline-flex px-4 py-2 rounded-lg font-bold text-white bg-[#E50914] hover:bg-red-700 shadow transition-colors">
              Login Portal
            </Link>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
              <img src={theme === 'dark' ? "/light-logo.png" : "/logo.png"} alt="Nexview" className="h-7 object-contain" />
              <button onClick={() => setMobileOpen(false)} className="text-gray-500 dark:text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-2 flex-1">
              <NavLink to="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium" end>Home</NavLink>
              <NavLink to="/services" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Services</NavLink>
              <NavLink to="/ndesk" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">NDesk</NavLink>
              <NavLink to="/verify" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Verify</NavLink>
              <NavLink to="/about" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">About</NavLink>
              <NavLink to="/contact" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">Contact</NavLink>
            </nav>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full block text-center px-4 py-3 rounded-lg font-bold text-white bg-[#E50914] hover:bg-red-700 transition-colors">
                Login Portal
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow flex flex-col min-w-0">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Nexview Concept Limited. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Support</Link>
            <Link to="/verify" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Verification</Link>
            <Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
