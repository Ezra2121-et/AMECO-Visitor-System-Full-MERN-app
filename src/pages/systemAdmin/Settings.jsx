// src/pages/SystemAdmin/Settings.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Settings() {
  const [form, setForm] = useState({ siteName: "", allowRegistration: true, contactEmail: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/settings");
        setForm({
          siteName: data.siteName || "",
          allowRegistration: Boolean(data.allowRegistration),
          contactEmail: data.contactEmail || "",
        });
      } catch (e) {
        console.error(e);
        setMsg("Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await api.put("/settings", form);
      setMsg("Saved ✔");
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-600 mb-4">System Settings</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <form onSubmit={save} className="bg-white rounded-2xl shadow p-6 max-w-xl space-y-4">
          {msg && (
            <div className={`text-sm ${msg.includes("✔") ? "text-green-700" : "text-red-700"}`}>{msg}</div>
          )}
          <div>
            <label className="block text-sm mb-1">Site Name</label>
            <input
              name="siteName"
              value={form.siteName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="Ameco Visitor System"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              placeholder="admin@example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="allowRegistration"
              type="checkbox"
              name="allowRegistration"
              checked={form.allowRegistration}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label htmlFor="allowRegistration" className="text-sm">Allow new user registration</label>
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
