// backend/controllers/visitorsController.js
import Visitor from "../models/Visitor.js";

const normalizeEthiopianPhone = (p = "") => {
  const digits = p.replace(/\D/g, "");
  let d = digits;
  if (d.startsWith("0") && d.length === 10) d = "251" + d.slice(1);
  if (d.startsWith("9") && d.length === 9) d = "251" + d;
  if (!d.startsWith("251")) return "+" + digits; // fallback
  return "+" + d;
};

export const listVisitors = async (req, res) => {
  const { q, from, to, range, page, limit, sortBy = "createdAt", sortDir = "desc" } = req.query;
  const filter = {};
  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { purpose: { $regex: q, $options: "i" } },
      { whomToVisit: { $regex: q, $options: "i" } },
    ];
  }
  // Date range handling
  const createdAt = {};
  const now = new Date();
  let start = null;
  if (from) start = new Date(from);
  if (range && !from) {
    const d = new Date(now);
    if (range === "daily") {
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    } else if (range === "weekly") {
      const day = d.getDay(); // 0-6 (Sun-Sat)
      const diff = (day + 6) % 7; // make Monday start
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
      start.setHours(0,0,0,0);
    } else if (range === "monthly") {
      start = new Date(d.getFullYear(), d.getMonth(), 1);
    } else if (range === "quarterly") {
      const qStartMonth = Math.floor(d.getMonth() / 3) * 3;
      start = new Date(d.getFullYear(), qStartMonth, 1);
    } else if (range === "yearly") {
      start = new Date(d.getFullYear(), 0, 1);
    }
  }
  if (start) createdAt.$gte = start;
  if (to) createdAt.$lte = new Date(to);
  if (Object.keys(createdAt).length) filter.createdAt = createdAt;

  const sort = { [sortBy]: sortDir === "asc" ? 1 : -1 };

  // Optional pagination; defaults to returning all as before
  const hasPagination = Number.isFinite(Number(page)) && Number.isFinite(Number(limit));
  if (hasPagination) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const [items, total] = await Promise.all([
      Visitor.find(filter).sort(sort).skip((pageNum - 1) * pageSize).limit(pageSize),
      Visitor.countDocuments(filter),
    ]);
    res.setHeader("X-Total-Count", String(total));
    return res.json(items);
  }

  const visitors = await Visitor.find(filter).sort(sort);
  res.json(visitors);
};

export const createVisitor = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.phone) {
      payload.phone = normalizeEthiopianPhone(payload.phone);
      if (!/^\+2519\d{8}$/.test(payload.phone)) {
        return res.status(400).json({ message: "Phone must be Ethiopian mobile (+2519XXXXXXXX)" });
      }
    }
    const v = await Visitor.create(payload);
    res.status(201).json(v);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateVisitor = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };
  if (data.phone) data.phone = normalizeEthiopianPhone(data.phone);
  const v = await Visitor.findByIdAndUpdate(id, data, { new: true });
  if (!v) return res.status(404).json({ message: "Not found" });
  res.json(v);
};

export const deleteVisitor = async (req, res) => {
  const { id } = req.params;
  await Visitor.findByIdAndDelete(id);
  res.json({ success: true });
};

export const visitorStats = async (req, res) => {
  const { range } = req.query;
  const match = {};
  if (range) {
    const now = new Date();
    let start = null;
    if (range === "daily") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (range === "weekly") {
      const d = new Date(now);
      const day = d.getDay();
      const diff = (day + 6) % 7;
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
      start.setHours(0, 0, 0, 0);
    } else if (range === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "quarterly") {
      const m = Math.floor(now.getMonth() / 3) * 3;
      start = new Date(now.getFullYear(), m, 1);
    } else if (range === "yearly") {
      start = new Date(now.getFullYear(), 0, 1);
    }
    if (start) match.createdAt = { $gte: start };
  }

  const [byDay, byOffice] = await Promise.all([
    Visitor.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Visitor.aggregate([
      { $match: match },
      { $group: { _id: "$whomToVisit", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    daily: byDay.map((d) => ({ date: d._id, count: d.count })),
    offices: byOffice.map((o) => ({ office: o._id, count: o.count })),
  });
};

export const updateVisitorFeedback = async (req, res) => {
  const { id } = req.params;
  const { rating, feedback } = req.body;
  const v = await Visitor.findByIdAndUpdate(
    id,
    { rating, feedback },
    { new: true }
  );
  if (!v) return res.status(404).json({ message: "Not found" });
  res.json(v);
};
