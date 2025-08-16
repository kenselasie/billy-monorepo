import { useMutation } from "@tanstack/react-query";
import http from "../base";
import { API_ENDPOINTS } from "@/services/endpoints";
import { z } from "zod";

export interface AddCategoryData {
  image?: File;
  name: string;
  slug: string;
  details?: string;
  parent_id?: string;
}
const addCategoryValidator = z.object({
  data: z.any(),
  success: z.boolean(),
  message: z.string(),
});

export const addCategoryService = async (newCategory: AddCategoryData) => {
  try {
    // const formData = new FormData();
    // if (newCategory.image) formData.append("image", newCategory.image);
    // Object.entries(newCategory).forEach(([key, value]) => {
    //   if (key !== "image" && value) {
    //     formData.append(key, value);
    //   }
    // });
    const { data } = await http.post(API_ENDPOINTS.ADD_STORE, newCategory);
    return await Promise.resolve(addCategoryValidator.parse(data));
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
};

export const useAddCategoryMutation = () => {
  return useMutation({
    mutationKey: ["addCategory"],
    mutationFn: (data: AddCategoryData) => addCategoryService(data),
  });
};
