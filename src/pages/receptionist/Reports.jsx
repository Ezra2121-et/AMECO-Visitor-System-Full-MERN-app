// src/pages/Receptionist/Reports.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) =>
    String(v ?? "").includes(",") || String(v ?? "").includes("\n") ? `"${String(v).replaceAll('"', '""')}"` : v;
  const lines = [headers.join(",")].concat(
    rows.map((r) => headers.map((h) => escape(r[h])).join(","))
  );
  return lines.join("\n");
}

export default function Reports() {
  const [data, setData] = useState([]);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [range, setRange] = useState("daily");
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (q) {
      const re = new RegExp(q, "i");
      rows = rows.filter((r) => re.test(r.fullName) || re.test(r.purpose) || re.test(r.whomToVisit));
    }
    rows.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "createdAt") return (new Date(a.createdAt) - new Date(b.createdAt)) * dir;
      return String(a[sortBy] ?? "").localeCompare(String(b[sortBy] ?? "")) * dir;
    });
    return rows;
  }, [data, q, sortBy, sortDir]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (range) params.set("range", range);
        const { data } = await api.get(`/visitors?${params.toString()}`);
        setData(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [q, range]);

  const exportCsv = () => {
    const rows = filtered.map((r) => ({
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
    link.download = `visitors_${range}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    window.print();
  };

  return (
    <div>
      {/* Print styles */}
      <style>{`
        @page { size: A4 portrait; margin: 12mm; }
        @media print {
          .no-print, .app-chrome { display: none !important; }
          thead { display: table-header-group; }
          tfoot { display: table-row-group; }
          tr { page-break-inside: avoid; }
          .print-break { page-break-after: always; }
        }
      `}</style>
      <h1 className="text-2xl font-bold text-red-600 mb-4">Reports</h1>

      <div className="flex flex-wrap gap-2 mb-4 no-print">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, purpose, or office"
          className="border rounded-lg p-3 flex-1 min-w-[240px]"
        />
        <select value={range} onChange={(e) => setRange(e.target.value)} className="border rounded-lg p-3">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-lg p-3">
          <option value="createdAt">Date</option>
          <option value="fullName">Name</option>
          <option value="whomToVisit">Office</option>
        </select>
        <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} className="border rounded-lg p-3">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button onClick={exportCsv} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Export CSV</button>
        <button onClick={printPdf} className="px-4 py-2 border rounded-lg">Print / Save PDF</button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r._id} className={`border-t hover:bg-gray-50 ${(i + 1) % 20 === 0 ? 'print-break' : ''}`}>
                  <td className="px-4 py-2">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{r.fullName}</td>
                  <td className="px-4 py-2">{r.phone}</td>
                  <td className="px-4 py-2">{r.whomToVisit}</td>
                  <td className="px-4 py-2">{r.purpose}</td>
                  <td className="px-4 py-2">{r.rating ? `${r.rating}★` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
