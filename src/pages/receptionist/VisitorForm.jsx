// src/pages/Receptionist/VisitorForm.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
 

const WHOM_TO_VISIT_OPTIONS = [
  "HR",
  "President Office",
  "Finance Bureau",
  "IT Bureau",
  "Procurement Bureau",
  "Academic Affairs",
  "Admissions",
];

const GENDERS = ["Male", "Female", "Prefer not to say"];
const ID_TYPES = ["National ID", "Passport", "Kebele ID", "Driver’s License", "Other"];

function normalizeEthiopianPhone(input) {
  // Accepts: 09XXXXXXXX, 9XXXXXXXX, +2519XXXXXXXX, 2519XXXXXXXX
  // Returns E.164: +2519XXXXXXXX
  let p = (input || "").replace(/\D/g, ""); // digits only
  if (p.startsWith("0") && p.length === 10) p = "251" + p.slice(1);
  if (p.startsWith("9") && p.length === 9) p = "251" + p;
  if (p.startsWith("251") && p.length === 12) p = p; // ok
  if (p.startsWith("251") === false && p.startsWith("9") === false && p.startsWith("0") === false) {
    // leave as-is; backend will validate too
  }
  return p.startsWith("251") ? `+${p}` : `+${p}`;
}

export default function VisitorForm() {
  const [form, setForm] = useState({
    fullName: "",
    gender: GENDERS[0],
    phone: "",
    email: "",
    purpose: "",
    whomToVisit: WHOM_TO_VISIT_OPTIONS[0],
    source: "", // dropdown
    idType: "",
    idNumber: "",
  });
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const now = useMemo(() => new Date(), []); // captured when component renders

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/sources"); // requires backend GET access for receptionist
        setSources(data);
        if (data?.length && !form.source) {
          setForm((f) => ({ ...f, source: data[0].name }));
        }
      } catch (e) {
        console.error(e);
        setMsg({ type: "error", text: "Failed to load sources" });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.purpose.trim()) return "Purpose of visit is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    const normalized = normalizeEthiopianPhone(form.phone);
    // +2519XXXXXXXX (13 chars including +)
    if (!/^\+2519\d{8}$/.test(normalized)) {
      return "Phone must be Ethiopian mobile (e.g., 09XXXXXXXX or +2519XXXXXXXX).";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    const err = validate();
    if (err) return setMsg({ type: "error", text: err });

    setLoading(true);
    try {
      const payload = {
        ...form,
        phone: normalizeEthiopianPhone(form.phone),
        // date/time auto-filled by backend timestamps; we also display local now
      };
      const { data } = await api.post("/visitors", payload);
      setMsg({ type: "success", text: `Saved ✅ (ID: ${data._id})` });
      setForm({
        fullName: "",
        gender: GENDERS[0],
        phone: "",
        email: "",
        purpose: "",
        whomToVisit: WHOM_TO_VISIT_OPTIONS[0],
        source: sources[0]?.name || "",
        idType: "",
        idNumber: "",
      });
    } catch (e) {
      console.error(e);
      setMsg({
        type: "error",
        text: e?.response?.data?.message || "Failed to save visitor.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-red-600 mb-1">Visitor Registration</h1>
        <p className="text-sm text-gray-500 mb-6">
          Date/Time: {now.toLocaleDateString()} {now.toLocaleTimeString()}
        </p>

        {msg.text && (
          <div
            className={`mb-4 p-3 rounded ${
              msg.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4">
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Full Name *</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="e.g., Abebe Bekele"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Phone (Ethiopia) *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="09XXXXXXXX or +2519XXXXXXXX"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email (optional)</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Purpose of Visit *</label>
              <input
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                placeholder="Meeting, Submission, Inquiry..."
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Whom to Visit *</label>
              <select
                name="whomToVisit"
                value={form.whomToVisit}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                {WHOM_TO_VISIT_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Where They Came From *</label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                {sources.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              {!sources.length && (
                <p className="text-xs text-gray-500 mt-1">Ask System Admin to add sources.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">ID Type</label>
                <select
                  name="idType"
                  value={form.idType}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="">Select…</option>
                  {ID_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">ID Number</label>
                <input
                  name="idNumber"
                  value={form.idNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Visitor"}
            </button>
          </div>
        </form>
      </div>
  );
}
