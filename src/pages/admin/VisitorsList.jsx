// src/pages/Admin/VisitorsList.jsx
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

export default function VisitorsList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      params.set("page", String(page));
      params.set("limit", String(limit));
      const res = await api.get(`/visitors?${params.toString()}`);
      setItems(res.data);
      const tc = Number(res.headers["x-total-count"]) || res.data.length;
      setTotal(tc);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page, limit]);

  const exportCsv = () => {
    const rows = items.map((r) => ({
      fullName: r.fullName,
      gender: r.gender,
      phone: r.phone,
      email: r.email,
      purpose: r.purpose,
      whomToVisit: r.whomToVisit,
      source: r.source,
      rating: r.rating,
      feedback: r.feedback,
      createdAt: new Date(r.createdAt).toISOString(),
    }));
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visitors_page${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const remove = async (id) => {
    if (!confirm("Delete this visitor?")) return;
    try {
      await api.delete(`/visitors/${id}`);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-red-600">Visitors</h1>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
            placeholder="Search name, purpose, office"
            className="border rounded-lg p-3"
          />
          <button onClick={exportCsv} className="px-3 py-2 border rounded">Export CSV</button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Office</th>
              <th className="px-4 py-2">Purpose</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-3" colSpan={7}>Loading…</td></tr>
            ) : (
              items.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{r.fullName}</td>
                  <td className="px-4 py-2">{r.phone}</td>
                  <td className="px-4 py-2">{r.whomToVisit}</td>
                  <td className="px-4 py-2">{r.purpose}</td>
                  <td className="px-4 py-2">{r.rating ? `${r.rating}★` : "-"}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button onClick={() => setModal(r)} className="px-3 py-1 border rounded">View</button>
                      <button onClick={() => remove(r._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          <select value={limit} onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value, 10)); }} className="px-2 py-1 border rounded">
            {[10,20,50].map((n) => <option key={n} value={n}>{n}/page</option>)}
          </select>
        </div>
      </div>

      {modal && (
        <VisitorModal data={modal} onClose={() => setModal(null)} />)
      }
    </div>
  );
}

function VisitorModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow w-full max-w-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-semibold">Visitor Details</h3>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>
        <div className="p-5 grid md:grid-cols-2 gap-4 text-sm">
          <div><div className="text-gray-500">Full Name</div><div className="font-medium">{data.fullName}</div></div>
          <div><div className="text-gray-500">Gender</div><div className="font-medium">{data.gender}</div></div>
          <div><div className="text-gray-500">Phone</div><div className="font-medium">{data.phone}</div></div>
          <div><div className="text-gray-500">Email</div><div className="font-medium">{data.email || '-'}</div></div>
          <div><div className="text-gray-500">Purpose</div><div className="font-medium">{data.purpose}</div></div>
          <div><div className="text-gray-500">Whom to Visit</div><div className="font-medium">{data.whomToVisit}</div></div>
          <div><div className="text-gray-500">Source</div><div className="font-medium">{data.source || '-'}</div></div>
          <div><div className="text-gray-500">Rating</div><div className="font-medium">{data.rating ? `${data.rating}★` : '-'}</div></div>
          <div className="md:col-span-2"><div className="text-gray-500">Feedback</div><div className="font-medium whitespace-pre-wrap">{data.feedback || '-'}</div></div>
          <div className="md:col-span-2"><div className="text-gray-500">Created</div><div className="font-medium">{new Date(data.createdAt).toLocaleString()}</div></div>
        </div>
      </div>
    </div>
  );
}
