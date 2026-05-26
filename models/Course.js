const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    playlistLink: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: "N/A",
    },
    description: {
      type: String,
      default: "Comprehensive coverage with expert guidance.",
    },

    // ✅ IMAGE URL (Cloudinary)
    image: {
      type: String,
    },

    // ⭐ IMPORTANT (for delete from Cloudinary)
    imagePublicId: {
      type: String,
    },

    badge: {
      type: String,
      default: "New Arrival",
    },

    showOnHome: {
      type: Boolean,
      default: false,
    },

    targetClass: {
      type: String,
      default: "All Classes",
    },

    videoType: {
      type: String,
      default: "Full Chapter",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);