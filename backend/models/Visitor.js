// backend/models/Visitor.js
import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Male", "Female", "Prefer not to say"], required: true },
    phone: { type: String, required: true }, // store normalized E.164 (+2519XXXXXXXX)
    email: { type: String },
    purpose: { type: String, required: true },
    whomToVisit: {
      type: String,
      enum: [
        "HR",
        "President Office",
        "Finance Bureau",
        "IT Bureau",
        "Procurement Bureau",
        "Academic Affairs",
        "Admissions",
      ],
      required: true,
    },
    source: { type: String }, // "Walk-in", "LinkedIn" etc.
    rating: { type: Number, min: 1, max: 5 }, // used by feedback form later
    feedback: { type: String },
    idType: { type: String, enum: ["National ID", "Passport", "Kebele ID", "Driver’s License", "Other", ""] , default: "" },
    idNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);
