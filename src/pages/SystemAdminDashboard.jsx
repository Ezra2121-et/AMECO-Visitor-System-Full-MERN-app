import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import UserManagement from "./SystemAdmin/UserManagement";
import Reports from "./SystemAdmin/Reports";
import Logs from "./SystemAdmin/Logs";
import Settings from "./SystemAdmin/Settings";

const SystemAdminHome = () => (
  <div>
    <h1 className="text-2xl font-bold text-red-600 mb-4">System Admin Dashboard</h1>
    <p>Placeholder for System Admin features (Manage Users, Sources, Logs, Settings)</p>
  </div>
);

const SystemAdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="system_admin" />
      <div className="flex-1 flex flex-col">
        <Navbar role="system_admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index element={<SystemAdminHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reports" element={<Reports />} />
            <Route path="logs" element={<Logs />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/system-admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;