import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from "./pages/AdminDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import SystemAdminDashboard from "./pages/SystemAdminDashboard";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Receptionist */}
      <Route
        path="/receptionist/*"
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <ReceptionistDashboard />
          </ProtectedRoute>
        }
      />

      {/* System Admin */}
      <Route
        path="/system-admin/*"
        element={
          <ProtectedRoute allowedRoles={["system_admin"]}>
            <SystemAdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
