import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import VisitorForm from "./receptionist/VisitorForm";
import FeedbackForm from "./receptionist/FeedbackForm";
import Reports from "./receptionist/Reports";

function ReceptionistHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-red-600 mb-4">Receptionist Dashboard</h1>
      <p>Use the sidebar to register visitors, submit feedback, or view reports.</p>
    </div>
  );
}

export default function ReceptionistDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="receptionist" />
      <div className="flex-1 flex flex-col">
        <Navbar role="receptionist" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route index element={<ReceptionistHome />} />
            <Route path="register-visitor" element={<VisitorForm />} />
            <Route path="feedback" element={<FeedbackForm />} />
            <Route path="reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/receptionist" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
