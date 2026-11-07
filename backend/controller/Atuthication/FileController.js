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

    
    const targetUrl = `${env.FASTAPI_URL}/upload-resume`

    console.log("Uploading to:", targetUrl);

    console.log("Calling FastAPI:", targetUrl);

const response = await axios.post(targetUrl, formData, {
    headers: formData.getHeaders(),
    timeout: 120000,
});

console.log("FastAPI status:", response.status);
console.log("FastAPI response:", response.data);
    return response.data;
  } catch (error) {
    console.error("FastAPI request failed:", {
    message: error.message,
    status: error.response?.status,
    data: typeof error.response?.data === "string"
        ? error.response.data.slice(0, 500)
        : error.response?.data,
    code: error.code
});
    throw new Error(`File upload failed: ${error.message}`);
  }
};
