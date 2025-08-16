export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/xxx;base64, prefix
      const base64String = reader.result?.toString().split(",")[1];
      resolve(base64String || "");
    };
    reader.onerror = (error) => reject(error);
  });
};
