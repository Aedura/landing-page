import mongoose from "mongoose";

const advisorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  expertise: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.advisor ||
  mongoose.model("advisor", advisorSchema);
