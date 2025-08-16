import { registerUserService } from "@/services/auth";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface IRegisterUserVariables {
  firstName: string;
  lastName: string;
  otherNames?: string;
  password: string;
  email: string;
}

export const useRegisterUserMutation = () => {
  return useMutation({
    mutationKey: ["registerUser"],
    mutationFn: (variables: IRegisterUserVariables) =>
      registerUserService(variables),
  });
};
