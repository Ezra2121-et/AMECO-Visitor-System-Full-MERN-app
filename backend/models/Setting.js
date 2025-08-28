import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Ameco Visitor System" },
    allowRegistration: { type: Boolean, default: true },
    contactEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);


