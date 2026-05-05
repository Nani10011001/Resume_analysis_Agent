import FormData from "form-data";
import axios from "axios";
import https from "https";
import { env } from "../../config/ZodValidation.js";

// Allow self-signed certs when connecting to localhost (dev only)
const agent = new https.Agent({ rejectUnauthorized: false });

/**
 * Upload PDF resume to FastAPI backend
 * @param {string} userId
 * @param {Object} file (multer file)
 */
export const FileController = async (userId, file) => {
  try {
    if (!userId) throw new Error("UserId is required");
    if (!file) throw new Error("File is not uploaded");
    if (file.mimetype !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    // prepare form data
    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    formData.append("userId", userId);

    
    const targetUrl = `${process.env.AGENT_URL}/upload-resume`

    console.log("Uploading to:", targetUrl);

    const response = await axios.post(targetUrl, formData, {
      headers: formData.getHeaders(),
      httpsAgent: agent,
      timeout: 120000,
    });

    return response.data;
  } catch (error) {
    console.error("file upload error - details:", {
      message: error.message,
      stack: error.stack,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
    });
    throw new Error(`File upload failed: ${error.message}`);
  }
};
