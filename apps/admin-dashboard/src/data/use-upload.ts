import { uploadAudioMedia, uploadImage } from "@/services/upload";
import { useMutation } from "@tanstack/react-query";

export type UploadMediaType = {
  files: File[];
};

export const useAudioUploadMutation = () => {
  return useMutation({
    mutationKey: ["uploadAudioMedia"],
    mutationFn: (variables: UploadMediaType) => uploadAudioMedia(variables),
  });
};

export const useImageUploadMutation = () => {
  return useMutation({
    mutationKey: ["uploadImage"],
    mutationFn: (file: File) => uploadImage(file),
  });
};
