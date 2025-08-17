import z from "zod";
import { API_ENDPOINTS } from "./endpoints";
import { IRegisterUserVariables } from "@/data/use-register.mutation";
import { httpWithoutAuth } from "@/data/base";

const userDataOnAuthValidator = z.object({
  id: z.string(),
  email: z.string(),
  first_name: z.nullable(z.string().optional()),
  last_name: z.nullable(z.string().optional()),
  other_names: z.nullable(z.string().optional()),
  is_active: z.nullable(z.boolean().optional()),
  profile_id: z.nullable(z.string().optional()),
  created_at: z.nullable(z.string().optional()),
  updated_at: z.nullable(z.string().optional()),
});

const authDataValidator = z.object({
  user: userDataOnAuthValidator,
  accessToken: z.string(),
  refreshToken: z.nullable(z.string().optional()),
});
const registerUserValidator = z.object({
  data: authDataValidator,
  success: z.boolean(),
  message: z.string(),
});
const loginValidator = z.object({
  data: authDataValidator,
  success: z.boolean(),
  message: z.string(),
});

export type TUserDataOnAuth = z.infer<typeof userDataOnAuthValidator>;

export const loginService = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const { data } = await httpWithoutAuth.post(API_ENDPOINTS.LOGIN, payload);
    return await Promise.resolve(loginValidator.parse(data));
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const registerUserService = async (payload: IRegisterUserVariables) => {
  try {
    const { data } = await httpWithoutAuth.post(
      API_ENDPOINTS.REGISTER,
      payload
    );
    return await Promise.resolve(registerUserValidator.parse(data));
  } catch (error) {
    console.log(error);
    return await Promise.reject(error);
  }
};
