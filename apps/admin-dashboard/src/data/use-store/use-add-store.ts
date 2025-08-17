import { useMutation } from "@tanstack/react-query";
import http from "../base";
import { API_ENDPOINTS } from "../../services/endpoints";
import { z } from "zod";

export interface IAddStoreVariables {
  name: string;
  slug: string;
  description?: string;
}

const addStoreValidator = z.object({
  data: z.any(),
  success: z.boolean(),
  message: z.string(),
});

export const useAddStoreMutation = () => {
  return useMutation({
    mutationKey: ["addStore"],
    mutationFn: (variables: IAddStoreVariables) => addStoreService(variables),
  });
};

export const addStoreService = async (payload: IAddStoreVariables) => {
  try {
    const { data } = await http.post(API_ENDPOINTS.ADD_STORE, payload);
    return await Promise.resolve(addStoreValidator.parse(data));
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
};
