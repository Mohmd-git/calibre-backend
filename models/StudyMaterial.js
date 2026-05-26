import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    classLevel: {
      type: String,
      required: true
    },
    board: {
      type: String,
      required: true
    },
    files: [
      {
        fileName: { type: String },
        fileUrl: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("StudyMaterial", studyMaterialSchema);