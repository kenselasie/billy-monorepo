import { UploadMediaType } from "@/data/use-upload";
import http from "./base";
import { API_ENDPOINTS } from "./endpoints";

export const uploadAudioMedia = async (payload: UploadMediaType) => {
  console.log(payload);
  try {
    const formData = new FormData();
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const { data } = await http.post(
      API_ENDPOINTS.UPLOAD_AUDIO,
      formData,
      options,
    );
    return await Promise.resolve(data);
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
};
