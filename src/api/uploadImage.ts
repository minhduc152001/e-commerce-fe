import { RcFile } from "antd/es/upload";
import { axiosInstance } from "./axios";

export const uploadImageAPI = async (file: RcFile): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.fileUrl; // Return the uploaded file URL
};
