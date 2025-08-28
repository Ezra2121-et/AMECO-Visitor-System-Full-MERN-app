// src/pages/Receptionist/FeedbackForm.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

export default function FeedbackForm() {
  const [visitors, setVisitors] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/visitors${query ? `?q=${encodeURIComponent(query)}` : ""}`);
        setVisitors(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [query]);

  const selectedVisitor = useMemo(
    () => visitors.find((v) => v._id === selectedId) || null,
    [selectedId, visitors]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedId || !rating) {
      setMsg("Select a visitor and rating.");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      await api.put(`/visitors/${selectedId}`, { rating, feedback });
      setMsg("Saved ✔");
      setRating(0);
      setFeedback("");
      // refresh selected visitor data
      const { data } = await api.get(`/visitors${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      setVisitors(data);
    } catch (e) {
      console.error(e);
      setMsg(e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-600 mb-4">Feedback</h1>

      <div className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search visitor by name or purpose"
          className="border rounded-lg p-3 flex-1"
        />
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="border rounded-lg p-3 min-w-[260px]"
        >
          <option value="">Select visitor…</option>
          {visitors.map((v) => (
            <option key={v._id} value={v._id}>
              {v.fullName} — {new Date(v.createdAt).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {selectedVisitor && (
        <div className="mb-4 text-sm text-gray-600">
          <div>Name: {selectedVisitor.fullName}</div>
          <div>Purpose: {selectedVisitor.purpose}</div>
          <div>Whom to visit: {selectedVisitor.whomToVisit}</div>
        </div>
      )}

      {msg && (
        <div className="mb-3 text-sm {msg.includes('✔') ? 'text-green-700' : 'text-red-700'}">
          {msg}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3 bg-white rounded-2xl shadow p-6 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Rating *</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={`px-3 py-2 rounded border ${rating >= n ? 'bg-yellow-400' : 'bg-gray-100'}`}
              >
                {n}★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border rounded-lg p-3"
            rows={4}
            placeholder="Write feedback…"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
