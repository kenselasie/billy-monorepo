import { uploadAudioMedia } from "@/services/upload";
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
