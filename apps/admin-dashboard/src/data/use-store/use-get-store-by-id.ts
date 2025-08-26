import http from "../base";
import { API_ENDPOINTS } from "../../services/endpoints";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const singleStoreResponseValidator = z.object({
  data: z.object({
    id: z.string(),
    address: z.any().optional(),
    addressId: z.string().optional().nullable(),
    attachment: z.array(z.any()).optional(),
    description: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
    name: z.string().optional(),
    orders_count: z.number().optional(),
    owner: z
      .object({
        id: z.string(),
        email: z.string().email(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      })
      .optional(),
    ownerId: z.string(),
    product_count: z.number().optional(),
    slug: z.string(),
    logo: z.string().optional(),
    cover_image: z.string().optional(),
    images: z.array(z.any()).optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  }),
  success: z.boolean(),
  message: z.string(),
});

export const getStoreByIdService = async (id: string) => {
  try {
    const { data } = await http.get(`${API_ENDPOINTS.GET_STORE}/${id}`);
    return singleStoreResponseValidator.parse(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useGetStoreByIdQuery = (id: string) => {
  return useQuery({
    queryKey: ["store", id],
    queryFn: () => getStoreByIdService(id),
  });
};
