const pdf = require("pdf-parse");
const fs = require("fs");
const tesseract = require("tesseract.js");
const WordExtractor = require("word-extractor");
const mammoth = require("mammoth");

const processPDF = async (filePath, res, outputPath) => {
  try {
    // Read the PDF content
    const pdfBuffer = fs.readFileSync(filePath);

    // Parse the PDF content
    const data = await pdf(pdfBuffer);

    // Save the extracted text to a file
    saveTextToFile(data.text, outputPath);

    if (data.text.length < 50) {
      // Handle the case where the text length is less than 50
      // For example, you might want to send a response or log a message
      console.log("Text length is less than 50 characters.");
      // res.status(400).json({ error: "Text length is less than 50 characters." });
    } else {
    }
    return "";
  } catch (error) {
    console.log("Error processing the file:", error);
    res.status(500).json({ error: "Failed to process the file" });
  }
};

const prosesImgToText = async (filePath, outputPath) => {
  try {
    const result = await tesseract.recognize(filePath, "eng", {
      logger: (e) => console.log(e.status, e.progress),
    });
    console.log(result.data.text);
    saveTextToFile(result.data.text, outputPath);
  } catch (error) {
    console.error("Error processing image to text:", error);
  }
};

const saveTextToFile = (text, outputPath) => {
  const route = `${outputPath}.txt`;
  fs.appendFile(route, text, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    } else {
      console.log("Text successfully written as", outputPath);
    }
  });
};

// Function to read and save text from a .txt file
const parseTxtFile = (filePath, outputPath) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading TXT file:", err);
      return;
    }
    saveTextToFile(data, outputPath);
  });
};

// Function to parse DOC file
const parseDocFile = async (filePath, outputPath) => {
  const extractor = new WordExtractor();

  try {
    const doc = await extractor.extract(filePath);
    console.log(doc.getBody());
    saveTextToFile(doc.getBody(), outputPath);
  } catch (error) {
    console.error("Error extracting document:", error);
  }
};

const parseFile = async (
  filePath,
  fileExtension,
  outputPath,
  fileName,
  res
) => {
  // Check if the file is already in PDF format
  if (fileExtension === "application/pdf") {
    // Process the PDF directly
    return await processPDF(filePath, res, outputPath);
  } else if (
    // parsing DOCX file
    fileExtension ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    try {
      const result = mammoth.extractRawText({ path: filePath });
      saveTextToFile(result.value, outputPath);
    } catch (error) {
      console.error("Error parsing DOCX file:", err);
    }
  } else if (
    //.txt
    fileExtension === "text/plain"
  ) {
    return  parseTxtFile(filePath, outputPath);
  } else if (
    //.doc
    fileExtension === "application/msword"
  ) {
    return await parseDocFile(filePath, outputPath);
  } else if (fileExtension === "image/jpeg" || fileExtension === "image/png") {
    // .jpg .jpeg .png
    return await prosesImgToText(filePath, outputPath);
  }
};

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log(`File deleted successfully: ${filePath}`);
    }
  });
};

module.exports = {
  processPDF,
  prosesImgToText,
  saveTextToFile,
  parseTxtFile,
  parseDocFile,
  parseFile,
  deleteFile,
};
