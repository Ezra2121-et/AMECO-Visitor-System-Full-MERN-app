import Source from "../models/Source.js";

export const listSources = async (req, res) => {
  const sources = await Source.find().sort({ name: 1 });
  res.json(sources);
};

export const createSource = async (req, res) => {
  const s = await Source.create(req.body);
  res.status(201).json(s);
};

export const updateSource = async (req, res) => {
  const { id } = req.params;
  const s = await Source.findByIdAndUpdate(id, req.body, { new: true });
  if (!s) return res.status(404).json({ message: "Not found" });
  res.json(s);
};

export const deleteSource = async (req, res) => {
  const { id } = req.params;
  await Source.findByIdAndDelete(id);
  res.json({ success: true });
};
