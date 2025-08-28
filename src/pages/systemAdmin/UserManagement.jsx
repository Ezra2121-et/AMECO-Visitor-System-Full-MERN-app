// src/pages/SystemAdmin/UserManagement.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const ROLES = [
  { value: "receptionist", label: "Receptionist" },
  { value: "admin", label: "Admin" },
  { value: "system_admin", label: "System Admin" },
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", role: "receptionist", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return users;
    const re = new RegExp(q, "i");
    return users.filter((u) => re.test(u.username) || re.test(u.email) || re.test(u.role));
  }, [users, q]);

  const openCreate = () => {
    setEditing(null);
    setForm({ username: "", email: "", role: "receptionist", password: "" });
    setFormOpen(true);
    setError("");
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ username: u.username || "", email: u.email || "", role: u.role || "receptionist", password: "" });
    setFormOpen(true);
    setError("");
  };

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/users/${editing.id || editing._id}`, form);
      } else {
        await api.post("/users", form);
      }
      setFormOpen(false);
      await loadUsers();
    } catch (e) {
      setError(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-red-600">User Management</h1>
        <button onClick={openCreate} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Add User</button>
      </div>

      <div className="mb-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search username, email, or role"
          className="border rounded-lg p-3 w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={4}>Loading…</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id || u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(u)} className="px-3 py-1 border rounded">Edit</button>
                      <button onClick={() => remove(u.id || u._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{editing ? "Edit User" : "Add User"}</h2>
              <button onClick={() => setFormOpen(false)} className="text-gray-600">✕</button>
            </div>
            {error && <div className="mb-3 text-sm text-red-700">{error}</div>}
            <form onSubmit={submit} className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Username *</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border rounded-lg p-3"
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Password {editing ? "(leave blank to keep)" : "*"}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  placeholder={editing ? "Leave blank to keep current" : "Set an initial password"}
                  {...(editing ? {} : { required: true })}
                />
              </div>
              <div className="pt-2 flex gap-2 justify-end">
                <button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
