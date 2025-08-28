import User from "../models/User.js";

export const listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({ username, email, password, role });
    res.status(201).json({ id: user._id, username, email, role });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, role, password } = req.body;

  const update = { username, email, role };
  if (password) update.password = password;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Not found" });

    Object.assign(user, update);
    await user.save(); // triggers pre-save for password hash if changed
    res.json({ id: user._id, username: user.username, email: user.email, role: user.role });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ success: true });
};
