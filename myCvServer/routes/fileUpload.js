const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const { parseFile, deleteFile } = require("../functions/functions");
const { aiRequest } = require("../functions/aiRequest");

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/upload", upload.single("file"), async (req, res) => {
  console.log("started");
  try {
    // Check if a file was uploaded
    if (!req.file || Object.keys(req.file).length === 0) {
      console.log("req", req);
      return res.status(400).send("No file were uploaded.");
    }

    // Retrieve the uploaded file from the request body
    const uploadedFile = req.file;

    // Write the file to the upload directory
    const fileName = `${uploadedFile.originalname}`;
    const parseFileName = uploadedFile.originalname.split(".")[0];
    const filePath = `uploads/${fileName}`;
    const fileData = fs.readFileSync(filePath, "utf8");

    // Determine the file type
    const fileExtension = uploadedFile.mimetype ? uploadedFile.mimetype : null;
    const outputPath = `parseFiles/${parseFileName}`;
    const newFileRoute = `parseFiles/${parseFileName}.txt`;
    await parseFile(filePath, fileExtension, outputPath, parseFileName, res);
    const data = await aiRequest(newFileRoute);
    deleteFile(newFileRoute);
    deleteFile(filePath);
    return res.status(200).json(JSON.parse(data));
  } catch (error) {
    console.error("An error occurred while processing the file:", error);
    res.status(500).json({ error: "Failed to process the file" });
  }
});

module.exports = router;
