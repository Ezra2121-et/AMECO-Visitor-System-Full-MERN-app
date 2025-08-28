import { Link, useLocation } from "react-router-dom";
import { Home, Users, FileText, BarChart, Settings, LogOut } from "lucide-react";

export default function Sidebar({ role }) {
  const location = useLocation();

  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin", icon: <Home size={18} /> },
      { name: "Visitors List", path: "/admin/visitor-list", icon: <Users size={18} /> },
      { name: "Reports", path: "/admin/reports", icon: <FileText size={18} /> },
      { name: "Analytics", path: "/admin/analytics", icon: <BarChart size={18} /> },
    ],
    receptionist: [
      { name: "Dashboard", path: "/receptionist", icon: <Home size={18} /> },
      { name: "Register Visitor", path: "/receptionist/register-visitor", icon: <Users size={18} /> },
      { name: "Feedback", path: "/receptionist/feedback", icon: <FileText size={18} /> },
      { name: "Reports", path: "/receptionist/reports", icon: <BarChart size={18} /> },
    ],
    system_admin: [
      { name: "Dashboard", path: "/system-admin", icon: <Home size={18} /> },
      { name: "User Management", path: "/system-admin/users", icon: <Users size={18} /> },
      { name: "Reports", path: "/system-admin/reports", icon: <FileText size={18} /> },
      { name: "Logs", path: "/system-admin/logs", icon: <BarChart size={18} /> },
      { name: "Settings", path: "/system-admin/settings", icon: <Settings size={18} /> },
    ],
  };

  return (
    <aside className="app-chrome w-64 bg-red-700 border-r min-h-screen">
      <div className="p-4 text-xl font-bold text-white">AMC System</div>
      <nav className="space-y-1">
        {menuItems[role]?.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-gray-900 text-white"
                : "text-white hover:bg-gray-900"
            }`}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-4 border-t">
        <button
          className="flex items-center px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 w-full"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          <LogOut size={18} />
          <span className="ml-2">Logout</span>
        </button>
      </div>
    </aside>
  );
}
