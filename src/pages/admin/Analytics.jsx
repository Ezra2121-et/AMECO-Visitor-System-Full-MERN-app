// src/pages/Admin/Analytics.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../services/api";

function groupByDay(items) {
  const map = new Map();
  items.forEach((v) => {
    const d = new Date(v.createdAt);
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

function groupByWhom(items) {
  const map = new Map();
  items.forEach((v) => {
    map.set(v.whomToVisit, (map.get(v.whomToVisit) || 0) + 1);
  });
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
}

function drawBar(ctx, labels, values) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
  const padding = 32;
  const max = Math.max(1, ...values);
  const barW = (width - padding * 2) / values.length - 8;
  values.forEach((v, i) => {
    const x = padding + i * (barW + 8);
    const h = ((height - padding * 2) * v) / max;
    const y = height - padding - h;
    ctx.fillStyle = "#dc2626"; // tailwind red-600
    ctx.fillRect(x, y, barW, h);
  });
}

function drawLine(ctx, labels, values) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
  const padding = 32;
  const max = Math.max(1, ...values);
  const stepX = (width - padding * 2) / Math.max(1, values.length - 1);
  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((height - padding * 2) * v) / max;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function drawPie(ctx, labels, values) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
  const total = values.reduce((a, b) => a + b, 0) || 1;
  let start = 0;
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) / 2 - 10;
  const colors = ["#dc2626", "#16a34a", "#2563eb", "#f59e0b", "#9333ea", "#06b6d4", "#f97316", "#84cc16"];
  values.forEach((v, i) => {
    const angle = (v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    start += angle;
  });
}

export default function Analytics() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const daily = useMemo(() => groupByDay(visitors), [visitors]);
  const byOffice = useMemo(() => groupByWhom(visitors), [visitors]);

  const barRef = useRef(null);
  const lineRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/visitors");
        setVisitors(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const [labels, values] = [daily.map((d) => d[0].slice(5)), daily.map((d) => d[1])];
    if (barRef.current) drawBar(barRef.current.getContext("2d"), labels, values);
    if (lineRef.current) drawLine(lineRef.current.getContext("2d"), labels, values);
    if (pieRef.current) drawPie(pieRef.current.getContext("2d"), byOffice.map((x) => x[0]), byOffice.map((x) => x[1]));
  }, [daily, byOffice]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-600 mb-4">Analytics</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">Daily Visitors (Bar)</h2>
            <canvas ref={barRef} width={600} height={280} />
          </div>
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold mb-2">Daily Visitors (Line)</h2>
            <canvas ref={lineRef} width={600} height={280} />
          </div>
          <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
            <h2 className="font-semibold mb-2">Visits by Office (Pie)</h2>
            <div className="flex items-center gap-6">
              <canvas ref={pieRef} width={360} height={360} />
              <ul className="text-sm">
                {byOffice.map(([label, value]) => (
                  <li key={label} className="flex items-center gap-2 py-0.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                    <span className="w-44">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
