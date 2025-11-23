import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.models.contributor ||
  mongoose.model("contributor", contributorSchema);
