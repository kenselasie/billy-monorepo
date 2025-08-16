import http from "../base";
import { API_ENDPOINTS } from "../../services/endpoints";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

const storeSchema = z.object({
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
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});
const multipleDataResponseValidator = z.object({
  data: z.array(storeSchema),
  success: z.boolean(),
  message: z.string(),
  meta: z.object({
    limit: z.union([z.string(), z.number()]),
    page: z.union([z.string(), z.number()]),
    total: z.union([z.string(), z.number()]),
  }),
});
export type StoreFetchFiltersType = {
  search?: string;
  is_active?: string;
  page?: string;
  limit?: string;
};

export const getStoresService = async (filters: StoreFetchFiltersType) => {
  const params = new URLSearchParams(filters);
  try {
    const { data } = await http.get(API_ENDPOINTS.GET_STORE, { params });
    return await Promise.resolve(multipleDataResponseValidator.parse(data));
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
};

export const useGetStoresQuery = (filters: StoreFetchFiltersType) => {
  return useQuery({
    queryKey: ["getStores", filters],
    queryFn: () => getStoresService(filters),
  });
};
