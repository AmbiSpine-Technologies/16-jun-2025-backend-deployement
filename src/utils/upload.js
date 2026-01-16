import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, "../../uploads");
const imageDir = path.join(uploadsDir, "images");
const videoDir = path.join(uploadsDir, "videos");
const documentDir = path.join(uploadsDir, "documents");

[uploadsDir, imageDir, videoDir, documentDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let uploadPath = uploadsDir;

//     if (file.fieldname === "image" || file.mimetype.startsWith("image/")) {
//       uploadPath = imageDir;
//     } else if (file.fieldname === "video" || file.mimetype.startsWith("video/")) {
//       uploadPath = videoDir;
//     } else if (file.fieldname === "document" || file.mimetype.includes("pdf") || file.mimetype.includes("document")) {
//       uploadPath = documentDir;
//     }

//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     // Generate unique filename: timestamp-randomnumber-originalname
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     const name = path.basename(file.originalname, ext);
//     cb(null, `${name}-${uniqueSuffix}${ext}`);
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "spreadnext/others";

    if (file.mimetype.startsWith("image/")) {
      folder = "spreadnext/images";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "spreadnext/videos";
    } else {
      folder = "spreadnext/documents";
    }

    return {
      folder,
      resource_type: "auto",
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});


// File filter
const fileFilter = (req, file, cb) => {
  // Images
  if (file.mimetype.startsWith("image/")) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed."), false);
    }
  }
  // Videos
  else if (file.mimetype.startsWith("video/")) {
    const allowedTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid video type. Only MP4, MPEG, MOV, AVI, and WebM are allowed."), false);
    }
  }
  // Documents
  else {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid document type. Only PDF and Word documents are allowed."), false);
    }
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: fileFilter,
});

// Get file URL
export const getFileUrl = (req, filename, type = "image") => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  let folder = "images";
  if (type === "video") folder = "videos";
  if (type === "document") folder = "documents";
  return `${baseUrl}/uploads/${folder}/${filename}`;
};

// Delete file
export const deleteFile = (filepath) => {
  try {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

