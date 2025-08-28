import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import VisitorsList from "./Admin/VisitorsList";
import Reports from "./Admin/Reports";
import Analytics from "./Admin/Analytics";

const AdminHome = () => (
  <div>
    <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Dashboard</h1>
    <p>Placeholder for Admin features (Users, Reports, Charts)</p>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col">
        <Navbar role="admin" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="visitor-list" element={<VisitorsList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;