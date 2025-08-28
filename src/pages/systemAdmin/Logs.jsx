// src/pages/SystemAdmin/Logs.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) =>
    String(v ?? "").includes(",") || String(v ?? "").includes("\n") ? `"${String(v).replaceAll('"', '""')}"` : v;
  const lines = [headers.join(",")].concat(rows.map((r) => headers.map((h) => escape(r[h])).join(",")));
  return lines.join("\n");
}

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/logs");
        setLogs(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return logs;
    const re = new RegExp(q, "i");
    return logs.filter((l) => re.test(l.action) || re.test(l?.userId?.username || "") || re.test(l?.userId?.role || ""));
  }, [logs, q]);

  const exportCsv = () => {
    const rows = filtered.map((l) => ({
      time: new Date(l.createdAt).toISOString(),
      action: l.action,
      user: l?.userId?.username || "",
      role: l?.userId?.role || "",
    }));
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-red-600">System Logs</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search action, user, role"
            className="border rounded-lg p-3"
          />
          <button onClick={exportCsv} className="px-3 py-2 border rounded">Export CSV</button>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={4}>Loading…</td></tr>
            ) : (
              filtered.map((l) => (
                <tr key={l._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{l?.userId?.username || "-"}</td>
                  <td className="px-4 py-2">{l?.userId?.role || "-"}</td>
                  <td className="px-4 py-2">{l.action}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
