import StudyMaterial from "../models/StudyMaterial.js";
import { v2 as cloudinary } from "cloudinary";

// HELPER - Extract public_id from Cloudinary URL
const getPublicId = (url, resourceType = "image") => {
  try {
    const keyword = `/${resourceType}/upload/`;
    const splitUrl = url.split(keyword);
    if (splitUrl.length < 2) return null;
    const withVersion = splitUrl[1];
    const withoutVersion = withVersion.replace(/^v\d+\//, "");
    // For raw files no extension to remove, for images remove extension
    return resourceType === "raw" 
      ? withoutVersion 
      : withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

// CREATE
const createMaterial = async (req, res) => {
  try {
    console.log("📦 BODY:", req.body);
    console.log("📁 FILES:", req.files);

    const { title, subject, classLevel, board } = req.body;

    const files = req.files?.map((file) => ({
      fileName: file.originalname,
      fileUrl: file.path,
    })) || [];

    console.log("✅ MAPPED FILES:", files);

    const material = new StudyMaterial({ title, subject, classLevel, board, files });
    const saved = await material.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET
const getMaterials = async (req, res) => {
  try {
    const data = await StudyMaterial.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateMaterial = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      // ⭐ Delete old files from Cloudinary
      const existing = await StudyMaterial.findById(req.params.id);
      if (existing?.files?.length > 0) {
        for (const file of existing.files) {
          const isPDF = file.fileUrl?.includes("/raw/upload/");
          const resourceType = isPDF ? "raw" : "image";
          const publicId = getPublicId(file.fileUrl, resourceType);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
          }
        }
      }

      updateData.files = req.files.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.path,
      }));
    }

    const updated = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
const deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);

    // ⭐ Delete all files from Cloudinary
    if (material?.files?.length > 0) {
      for (const file of material.files) {
        const isPDF = file.fileUrl?.includes("/raw/upload/");
        const resourceType = isPDF ? "raw" : "image";
        const publicId = getPublicId(file.fileUrl, resourceType);
        console.log("🗑️ Deleting from Cloudinary:", publicId, resourceType);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        }
      }
    }

    await StudyMaterial.findByIdAndDelete(req.params.id);
    res.json({ message: "Material deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createMaterial, getMaterials, updateMaterial, deleteMaterial };