import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import api from './lib/api';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import CorporateLayout from './components/layout/CorporateLayout';
import StudentPortalLayout from './components/layout/StudentPortalLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Corporate Pages
import Landing from './pages/corporate/Landing';
import Services from './pages/corporate/Services';
import NDesk from './pages/corporate/NDesk';
import VerifyGateway from './pages/corporate/VerifyGateway';
import Contact from './pages/corporate/Contact';
import About from './pages/corporate/About';

// Public Verification Pages
import VerifyStaff from './pages/public/VerifyStaff';
import VerifyReceipt from './pages/public/VerifyReceipt';
import VerifyCert from './pages/public/VerifyCert';
import VerifyInvoice from './pages/public/VerifyInvoice';

// Auth
import Login from './pages/Login';

// Student Portal Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentCourses from './pages/student/StudentCourses';
import StudentPayments from './pages/student/StudentPayments';
import StudentNotifications from './pages/student/StudentNotifications';

// NexOffice/Admin Pages
import Dashboard from './pages/Dashboard';
import StaffProfiles from './pages/StaffProfiles';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import Certificates from './pages/Certificates';
import Notifications from './pages/Notifications';
import Receipts from './pages/Receipts';
import Finance from './pages/Finance';
import FileManager from './pages/FileManager';
import EmailCenter from './pages/EmailCenter';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';
import Users from './pages/Users';
import Backups from './pages/Backups';
import Permissions from './pages/Permissions';
import SupportTickets from './pages/SupportTickets';
import ServiceLogs from './pages/ServiceLogs';
import Students from './pages/Students';
import Courses from './pages/Courses';

export default function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Corporate Routes */}
        <Route path="/" element={<CorporateLayout />}>
          <Route index element={<Landing />} />
          <Route path="services" element={<Services />} />
          <Route path="verify" element={<VerifyGateway />} />
          <Route path="ndesk" element={<NDesk />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="/login" element={<Login />} />
        
        {/* NVerify Public Endpoints */}
        <Route path="/verify/staff/:id" element={<VerifyStaff />} />
        <Route path="/verify/receipt/:id" element={<VerifyReceipt />} />
        <Route path="/verify/cert/:id" element={<VerifyCert />} />
        <Route path="/verify/invoice/:id" element={<VerifyInvoice />} />
        
        {/* Student Portal (Protected) */}
        <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
          <Route path="/student" element={<StudentPortalLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="payments" element={<StudentPayments />} />
            <Route path="notifications" element={<StudentNotifications />} />
          </Route>
        </Route>

        {/* NexOffice Staff Portal (Protected) */}
        <Route element={<ProtectedRoute allowedRoles={['OPERATOR', 'DIRECTOR', 'MANAGER', 'HR']} />}>
          <Route path="/nexoffice" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="staff" element={<StaffProfiles />} />
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="clients" element={<Clients />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="finance" element={<Finance />} />
            <Route path="files" element={<FileManager />} />
            <Route path="emails" element={<EmailCenter />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support-tickets" element={<SupportTickets />} />
            <Route path="service-logs" element={<ServiceLogs />} />
          </Route>
        </Route>

        {/* Admin Portal (Protected) */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="audit" element={<AuditLogs />} />
            <Route path="backups" element={<Backups />} />
            <Route path="permissions" element={<Permissions />} />
            {/* Admins also get access to all operational routes below */}
            <Route path="staff" element={<StaffProfiles />} />
            <Route path="students" element={<Students />} />
            <Route path="courses" element={<Courses />} />
            <Route path="clients" element={<Clients />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="receipts" element={<Receipts />} />
            <Route path="finance" element={<Finance />} />
            <Route path="files" element={<FileManager />} />
            <Route path="emails" element={<EmailCenter />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="support-tickets" element={<SupportTickets />} />
            <Route path="service-logs" element={<ServiceLogs />} />
          </Route>
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-center px-4">
            <h1 className="text-8xl font-extrabold text-[#E50914] mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Page Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
            <a href="/" className="bg-[#E50914] text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition">Go Home</a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
