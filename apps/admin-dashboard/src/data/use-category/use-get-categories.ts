import http from "../base";
import { API_ENDPOINTS } from "../../services/endpoints";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  details: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  products_count: z.number(),
  image: z.array(z.any()).nullable().optional(),
  parent_id: z.string().nullable().optional(),
  parent: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable()
    .optional(),
  children: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

const multipleDataResponseValidator = z.object({
  data: z.array(categorySchema),
  success: z.boolean(),
  message: z.string(),
  meta: z.object({
    limit: z.union([z.string(), z.number()]),
    page: z.union([z.string(), z.number()]),
    total: z.union([z.string(), z.number()]),
  }),
});

export type CategoryFetchFiltersType = {
  search?: string;
  page?: string;
  limit?: string;
  root_only?: string;
};

export const getCategoriesService = async (
  filters: CategoryFetchFiltersType
) => {
  const params = new URLSearchParams(filters);
  try {
    const { data } = await http.get(API_ENDPOINTS.GET_CATEGORIES, { params });
    return multipleDataResponseValidator.parse(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const useGetCategoriesQuery = (filters: CategoryFetchFiltersType) => {
  return useQuery({
    queryKey: ["categories", filters],
    queryFn: () => getCategoriesService(filters),
  });
};
