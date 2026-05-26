import Course from "../models/Course.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// 🔥 HELPER FUNCTION
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "courses" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ===================== CREATE =====================
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      tag,
      targetClass,
      playlistLink,
      duration,
      description,
      badge,
      videoType,
      showOnHome,
    } = req.body;

    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    const course = new Course({
      title,
      tag,
      targetClass,
      playlistLink,
      duration,
      description,
      badge,
      videoType,
      showOnHome,
      image: imageUrl,
      imagePublicId: publicId, // ✅ SAVE THIS
    });

    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ===================== GET =====================
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================== UPDATE =====================
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let updateData = { ...req.body };

    if (req.file) {
      // 🔥 DELETE OLD IMAGE
      if (course.imagePublicId) {
        await cloudinary.uploader.destroy(course.imagePublicId);
      }

      // 🔥 UPLOAD NEW IMAGE
      const uploaded = await uploadToCloudinary(req.file.buffer);

      updateData.image = uploaded.secure_url;
      updateData.imagePublicId = uploaded.public_id;
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================== DELETE =====================
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔥 DELETE IMAGE FROM CLOUDINARY
    if (course.imagePublicId) {
      await cloudinary.uploader.destroy(course.imagePublicId);
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};