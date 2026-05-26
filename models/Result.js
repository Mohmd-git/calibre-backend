const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true, // e.g., "Class 10 | CBSE"
    },
    score: {
      type: String,
      required: true, // e.g., "95.5%"
    },
    year: {
      type: Number,
      required: true, // This MUST match the 'year' we send from frontend
    },
    showOnHome: {
       type: Boolean,
        default: false 
  },
    topperRank: {
      type: String,
      default: "",    // Optional: "1", "2", "3", or empty
    },
    image: {
      type: String,
      required: true, // Base64 string or Cloudinary URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);