const multer = require("multer");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const config = require("../config/config");

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
});

// Image processing and upload to S3
const processAndUploadImage = async (file, folder = "general") => {
  try {
    // Process image with sharp
    const processedImage = await sharp(file.buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Generate unique filename
    const filename = `${folder}/${uuidv4()}.jpg`;

    // Upload to S3
    const uploaded = await s3
      .upload({
        Bucket: config.aws.bucketName,
        Key: filename,
        Body: processedImage,
        ContentType: "image/jpeg",
        ACL: "public-read",
      })
      .promise();

    return uploaded.Location;
  } catch (error) {
    console.error("Error processing/uploading image:", error);
    throw error;
  }
};

// Middleware for handling multiple image uploads
const handleImageUploads = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploadPromises = req.files.map((file) =>
      processAndUploadImage(file, req.body.folder || "general"),
    );

    req.fileUrls = await Promise.all(uploadPromises);
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  upload,
  processAndUploadImage,
  handleImageUploads,
};
