import mongoose from "mongoose";

const subSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.models.sub || mongoose.model("sub", subSchema);
