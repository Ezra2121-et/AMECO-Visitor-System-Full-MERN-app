import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

await connectDB();

try {
  const existing = await User.findOne({ username: "admin" });
  if (!existing) {
    await User.create({
      username: "admin",
      email: "admin@ameco.local",
      password: "Admin#123",
      role: "admin",
    });
    console.log("✅ Admin user created: admin / Admin#123");
  } else {
    console.log("ℹ️ Admin already exists");
  }

  const sys = await User.findOne({ username: "sysadmin" });
  if (!sys) {
    await User.create({
      username: "sysadmin",
      email: "sysadmin@ameco.local",
      password: "Sys#12345",
      role: "system_admin",
    });
    console.log("✅ System Admin created: sysadmin / Sys#12345");
  } else {
    console.log("ℹ️ System Admin already exists");
  }

  const rec = await User.findOne({ username: "reception" });
  if (!rec) {
    await User.create({
      username: "reception",
      email: "reception@ameco.local",
      password: "Rec#12345",
      role: "receptionist",
    });
    console.log("✅ Receptionist created: reception / Rec#12345");
  } else {
    console.log("ℹ️ Receptionist already exists");
  }
} catch (e) {
  console.error(e);
} finally {
  await mongoose.disconnect();
  process.exit(0);
}
