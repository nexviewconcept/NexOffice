import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import api from './lib/api';
import { useThemeStore } from './store/themeStore';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import StaffProfiles from './pages/StaffProfiles';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import Certificates from './pages/Certificates';
import VerifyStaff from './pages/public/VerifyStaff';
import VerifyReceipt from './pages/public/VerifyReceipt';
import VerifyCert from './pages/public/VerifyCert';
import VerifyInvoice from './pages/public/VerifyInvoice';
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

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    // Load public settings globally for favicon
    api.get('/public/settings').then(res => {
      const { faviconUrl } = res.data;
      if (faviconUrl) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = faviconUrl;
      }
    }).catch(err => {
      console.error('Failed to load public settings', err);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify/staff/:id" element={<VerifyStaff />} />
        <Route path="/verify/receipt/:id" element={<VerifyReceipt />} />
        <Route path="/verify/cert/:id" element={<VerifyCert />} />
        <Route path="/verify/invoice/:id" element={<VerifyInvoice />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="staff" element={<StaffProfiles />} />
          <Route path="clients" element={<Clients />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="finance" element={<Finance />} />
          <Route path="files" element={<FileManager />} />
          <Route path="emails" element={<EmailCenter />} />
          <Route path="settings" element={<Settings />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="backups" element={<Backups />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="backups" element={<Backups />} />
          <Route path="settings" element={<Settings />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="support-tickets" element={<SupportTickets />} />
          <Route path="service-logs" element={<ServiceLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
