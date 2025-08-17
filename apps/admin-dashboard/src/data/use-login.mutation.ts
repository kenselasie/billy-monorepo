import { loginService } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";

export interface ILoginVariables {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["loginUser"],
    mutationFn: (variables: ILoginVariables) => loginService(variables),
  });
};
