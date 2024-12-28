import apiRequest from "./apiRequest.ts";
import { IP_ADDRESS } from "../../constants/constants.ts";

export const uploadImages = async (imageFiles: File[]): Promise<string[]> => {
  const formData = new FormData();
  imageFiles.forEach((file) => {
    formData.append("imageFiles", file);
  });
  return await apiRequest(
    `https://${IP_ADDRESS}/api/image-upload`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    },
    (data) => data.imageUrlList || []
  );
};
