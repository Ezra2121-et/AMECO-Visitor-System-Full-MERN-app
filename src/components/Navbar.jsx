import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import { Bell, Globe, Moon, Sun, User as UserIcon } from "lucide-react";

export default function Navbar({ role }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [notifications, setNotifications] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const langRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  }, []);

  const t = useMemo(() => {
    const dict = {
      en: {
        titles: { admin: "Admin Dashboard", receptionist: "Receptionist Dashboard", system_admin: "System Admin Dashboard" },
        english: "English", amharic: "Amharic",
        notifications: "Notifications", editProfile: "Edit Profile", logout: "Logout",
        user: "User", toggleTheme: "Toggle theme", language: "Language",
      },
      am: {
        titles: { admin: "የአስተዳዳሪ ዳሽቦርድ", receptionist: "የመቀበያ ዳሽቦርድ", system_admin: "የስርዓት አስተዳዳሪ ዳሽቦርድ" },
        english: "እንግሊዝኛ", amharic: "አማርኛ",
        notifications: "ማስታወቂያዎች", editProfile: "መገለጫ አርትዕ", logout: "ውጣ",
        user: "ተጠቃሚ", toggleTheme: "ገጽታ ቀይር", language: "ቋንቋ",
      },
    };
    return dict[lang] || dict.en;
  }, [lang]);

  const roleTitles = t.titles;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    (async () => {
      try {
        if (role === "admin" || role === "system_admin") {
          const { data } = await api.get("/logs");
          setNotifications(data.slice(0, 8));
        } else if (role === "receptionist") {
          const { data } = await api.get("/visitors?page=1&limit=8");
          setNotifications(data);
        }
      } catch (e) {
        // ignore
      }
    })();
    const id = setInterval(async () => {
      try {
        if (role === "admin" || role === "system_admin") {
          const { data } = await api.get("/logs");
          setNotifications(data.slice(0, 8));
        } else if (role === "receptionist") {
          const { data } = await api.get("/visitors?page=1&limit=8");
          setNotifications(data);
        }
      } catch {}
    }, 60000);
    return () => clearInterval(id);
  }, [role]);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const onClick = (e) => {
      if (langOpen && langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (menuOpen && profileRef.current && !profileRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setLangOpen(false); setNotifOpen(false); setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen, notifOpen, menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <header className="app-chrome flex items-center justify-between bg-white shadow-md px-6 py-3 dark:bg-gray-900 dark:text-gray-100">
      {/* Title */}
      <h1 className="text-xl font-bold text-red-600 dark:text-red-400">{roleTitles[role]}</h1>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
          className="p-2 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button onClick={() => setLangOpen(!langOpen)} className="p-2 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800" title={t.language}>
            <Globe size={16} />
          </button>
          {langOpen && (
            <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border">
              {["en","am"].map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setLangOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${lang===l? 'font-semibold' : ''}`}
                >
                  {l === "en" ? t.english : t.amharic}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-full border hover:bg-gray-50 dark:hover:bg-gray-800" title={t.notifications}>
            <Bell size={16} />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border max-h-96 overflow-y-auto">
              <div className="px-3 py-2 text-sm font-semibold">{t.notifications}</div>
              <ul className="divide-y">
                {notifications.map((n) => (
                  <li key={n._id} className="px-3 py-2 text-sm">
                    {role === "receptionist" ? (
                      <div>
                        <div className="font-medium">{n.fullName}</div>
                        <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()} • {n.whomToVisit}</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{n.action}</div>
                        <div className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()} • {n?.userId?.username || '-'}</div>
                      </div>
                    )}
                  </li>
                ))}
                {!notifications.length && (
                  <li className="px-3 py-6 text-sm text-gray-500">No notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
          >
            <UserIcon size={16} />
            <span>{user?.username || t.user}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border">
              <div className="px-4 py-3 text-sm">
                <div className="font-semibold">{user?.username}</div>
                <div className="text-gray-500">{user?.email}</div>
                <div className="text-gray-500 capitalize">{user?.role?.replace('_',' ')}</div>
              </div>
              {(user?.role === 'admin' || user?.role === 'system_admin') && (
                <button
                  onClick={() => { setProfileOpen(true); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t.editProfile}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t.logout}
              </button>
            </div>
          )}
        </div>
      </div>

      {profileOpen && user && (
        <EditProfileModal user={user} onClose={() => setProfileOpen(false)} />
      )}
    </header>
  );
}

function EditProfileModal({ user, onClose }) {
  const [form, setForm] = useState({ username: user.username || "", email: user.email || "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canEdit = user.role === 'admin' || user.role === 'system_admin';

  const save = async (e) => {
    e.preventDefault();
    if (!canEdit) return onClose();
    setSaving(true);
    setError("");
    try {
      await api.put(`/users/${user.id || user._id}`, form);
      const updated = { ...user, username: form.username, email: form.email };
      localStorage.setItem("user", JSON.stringify(updated));
      onClose();
      window.location.reload();
    } catch (e) {
      setError(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>
        {error && <div className="mb-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password (optional)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border rounded-lg p-3"
              placeholder="Leave blank to keep current"
            />
          </div>
          <div className="pt-2 flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" disabled={saving || !canEdit} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}