import Log from "../models/Log.js";

export const listLogs = async (req, res) => {
  const logs = await Log.find().populate("userId", "username role").sort({ createdAt: -1 }).limit(200);
  res.json(logs);
};
