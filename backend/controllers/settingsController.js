import Setting from "../models/Setting.js";

export const getSettings = async (req, res) => {
  let s = await Setting.findOne();
  if (!s) s = await Setting.create({});
  res.json(s);
};

export const updateSettings = async (req, res) => {
  const { siteName, allowRegistration, contactEmail } = req.body;
  let s = await Setting.findOne();
  if (!s) s = await Setting.create({});
  s.siteName = siteName ?? s.siteName;
  s.allowRegistration = typeof allowRegistration === "boolean" ? allowRegistration : s.allowRegistration;
  s.contactEmail = contactEmail ?? s.contactEmail;
  await s.save();
  res.json(s);
};


