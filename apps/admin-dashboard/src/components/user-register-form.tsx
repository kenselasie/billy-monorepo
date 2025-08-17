"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/const/routes";
import { Checkbox } from "./ui/checkbox";
import { LoaderIcon } from "lucide-react";
import { useRegisterUserMutation } from "@/data/use-register.mutation";
import { useAuthStore } from "@/store/authStore";

const RegisterDataCredentialsValidator = z.object({
  firstName: z.string().min(1).max(250),
  lastName: z.string().min(1).max(250),
  otherNames: z.string().optional(),
  password: z.string().min(1).max(10),
  email: z.string().email(),
  agreeToTerms: z.boolean().optional(),
});

type TRegisterDataCredentialsValidator = z.infer<
  typeof RegisterDataCredentialsValidator
>;

const UserRegisterForm = () => {
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TRegisterDataCredentialsValidator>({
    resolver: zodResolver(RegisterDataCredentialsValidator),
    defaultValues: {
      agreeToTerms: false,
    },
  });
  const { mutate, isPending } = useRegisterUserMutation();
  const onSubmit = async ({
    firstName,
    lastName,
    otherNames,
    email,
    password,
  }: TRegisterDataCredentialsValidator) => {
    console.log({ firstName, lastName });
    mutate(
      {
        firstName,
        lastName,
        email,
        otherNames,
        password,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Success");
          useAuthStore.getState().setIsLoggedIn(true);
          useAuthStore.getState().setAccessToken(data.data.accessToken);
          useAuthStore.getState().setUserDataOnAuth(data.data.user);
          router.push(ROUTES.DASHBOARD);
        },
        onError: (err) => {
          const error = err as any;
          console.log(error);
          toast.error(
            error?.response?.data?.message ||
              error?.data?.message ||
              error?.message ||
              "Something bad happened"
          );
        },
        // onSettled,
      }
    );
  };

  return (
    <div className="grid gap-6 md:p-36 sm:p-0">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Register</h2>
          <p className="text-sm text-muted-foreground">
            Please enter your details to be registered.
          </p>
        </div>
        <div className="grid gap-2 mt-9">
          <div className="grid grid-cols-2 gap-5 mb-1">
            <div>
              <Label htmlFor="firstName" className="mb-1">
                First name
              </Label>
              <Input
                {...register("firstName")}
                type="text"
                className={cn({
                  "placeholder:text-slate-300": true,
                  "focus-visible:ring-red-400": errors.firstName,
                })}
                placeholder="Enter first name"
              />
              <small className="text-red-400">
                {errors.firstName?.message}
              </small>
            </div>
            <div>
              <Label htmlFor="lastName" className="mb-1">
                Last name
              </Label>
              <Input
                {...register("lastName")}
                type="text"
                className={cn({
                  "placeholder:text-slate-300": true,
                  "focus-visible:ring-red-400": errors.lastName,
                })}
                placeholder="Enter last name"
              />
              <small className="text-red-400">{errors.lastName?.message}</small>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-1">
            <div>
              <Label htmlFor="otherNames" className="mb-1">
                Other names
              </Label>
              <Input
                {...register("otherNames")}
                type="text"
                className={cn({
                  "placeholder:text-slate-300": true,
                  "focus-visible:ring-red-400": errors.otherNames,
                })}
                placeholder="Enter last name"
              />
              <small className="text-red-400">
                {errors.otherNames?.message}
              </small>
            </div>
            <div>
              <Label htmlFor="email" className="mb-1">
                E-mail
              </Label>
              <Input
                {...register("email")}
                type="email"
                className={cn({
                  "placeholder:text-slate-300": true,
                  "focus-visible:ring-red-400": errors.email,
                })}
                placeholder="Enter your email"
              />
              <small className="text-red-400">{errors.email?.message}</small>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-1">
            <div>
              <Label htmlFor="state" className="mb-1">
                Password
              </Label>
              <Input
                {...register("password")}
                type="password"
                className={cn({
                  "placeholder:text-slate-300": true,
                  "focus-visible:ring-red-400": errors.password,
                })}
                placeholder="Enter your password"
              />
              <small className="text-red-400">{errors.password?.message}</small>
            </div>
          </div>

          <div className="flex justify-between items-center mt-5 gap-10">
            <div className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(checked: boolean) => {
                  setValue("agreeToTerms", checked);
                  return checked;
                }}
                defaultChecked={getValues("agreeToTerms")}
                {...register("agreeToTerms")}
                id="agreeToTerms"
              />
              <label
                htmlFor="agreeToTerms"
                className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <p className="text-xs text-muted-foreground">
                  Agree to{" "}
                  <Link
                    href={ROUTES.TERMS_AND_CONDITIONS}
                    className="hover:text-brand underline underline-offset-4"
                  >
                    Terms And Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href={ROUTES.PRIVACY_POLICY}
                    className="hover:text-brand underline underline-offset-4"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </label>
            </div>
            <div>
              <Button
                variant={"default"}
                disabled={!watch("agreeToTerms")}
                type="submit"
                className="w-[160px] h-[48px] py-[12px] px-[16px]"
              >
                Register {isPending && <LoaderIcon className="animate-spin" />}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserRegisterForm;
