const router = require("express").Router();
const registerValidation = require("../../lib/validations").register;
const registerHandler = require("./registerHandler");
const multer = require("multer");

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, ""); // Sanitize file name
    const fileExt = safeFileName.split(".").pop();
    callback(null, `${safeFileName}-${Date.now()}.${fileExt}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, callback) => {
    // Check the file type (PNG, JPEG, JPG)
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("File type not allowed"));
    }
  },
});

// Custom middleware for handling file upload and validation
const fileUpload = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "digitalSignature", maxCount: 1 },
]);

router.post("", fileUpload, registerValidation, (req, res) => {
  // Access the file names from req.files
  const { profilePic, digitalSignature } = req.files;
  const files = {
    profilePic: profilePic ? profilePic[0].filename : null,
    digitalSignature: digitalSignature ? digitalSignature[0].filename : null,
  };
  // Call the registerHandler and pass the file names
  registerHandler(req, res, files);
});

module.exports = exports = router;
