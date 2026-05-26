import Result from "../models/Result.js";
import { v2 as cloudinary } from "cloudinary";

// HELPER - Extract public_id from Cloudinary URL
const getPublicId = (url) => {
  try {
    const splitUrl = url.split("/image/upload/");
    if (splitUrl.length < 2) return null;
    const withVersion = splitUrl[1];
    const withoutVersion = withVersion.replace(/^v\d+\//, "");
    return withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

// CREATE
const createResult = async (req, res) => {
  try {
    console.log("======== NEW REQUEST ========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "❌ Image not received" });
    }

    const { studentName, score, course, year, topperRank, showOnHome } = req.body;

    if (!studentName || !score || !course || !year) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const result = new Result({
      studentName, score, course, year, topperRank, showOnHome,
      image: req.file.path,
    });

    const saved = await result.save();
    return res.status(201).json({ message: "✅ Result created successfully", data: saved });
  } catch (err) {
    console.log("❌ ERROR FULL:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET
const getResults = async (req, res) => {
  try {
    const data = await Result.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateResult = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      // ⭐ Delete old image from Cloudinary
      const existing = await Result.findById(req.params.id);
      if (existing?.image) {
        const publicId = getPublicId(existing.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      updateData.image = req.file.path;
    }

    const updated = await Result.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    // ⭐ Delete image from Cloudinary
    if (result?.image) {
      const publicId = getPublicId(result.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Result.findByIdAndDelete(req.params.id);
    res.json({ message: "Result deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createResult, getResults, updateResult, deleteResult };