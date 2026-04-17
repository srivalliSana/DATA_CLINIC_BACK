import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default:null },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
