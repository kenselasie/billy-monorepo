"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/data/use-login.mutation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { LoaderIcon } from "lucide-react";
import { ROUTES } from "@/const/routes";

const AuthCredentialsValidator = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),
});

type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>;

const UserLoginForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate, isPending } = useLoginMutation();
  const authData = useAuthStore();

  const onSubmit = async ({ email, password }: TAuthCredentialsValidator) => {
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Success");
          authData.setIsLoggedIn(true);
          authData.setAccessToken(data.data.accessToken);
          authData.setUserDataOnAuth(data.data.user);
          router.push(ROUTES.DASHBOARD);
        },
        onError: (err) => {
          const error = err as any;
          console.log(error);
          toast.error("Something bad happened");
        },
      }
    );
  };

  return (
    <div className="grid gap-6 md:p-36 sm:p-0">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Log In</h2>
        </div>
        <div className="grid gap-2 mt-10">
          <div className="grid gap-1 py-2">
            <Label htmlFor="email" className="mb-1">
              Email
            </Label>
            <Input
              {...register("email")}
              className={cn({
                "placeholder:text-slate-400": true,
                "focus-visible:ring-red-400": errors.email,
              })}
              placeholder="Enter your login"
            />
            <small className="text-red-400">{errors.email?.message}</small>
          </div>

          <div className="grid gap-1 py-2">
            <Label htmlFor="password" className="mb-1">
              Password
            </Label>
            <Input
              {...register("password")}
              type="password"
              className={cn({
                "placeholder:text-slate-400": true,
                "focus-visible:ring-red-400": errors.password,
              })}
              placeholder="Enter your password"
            />
            <small className="text-red-400">{errors.password?.message}</small>
          </div>
          <div className="flex justify-between items-center gap-10 mt-5">
            <p className="text-sm text-muted-foreground">
              <Link
                href={ROUTES.RESET}
                className="hover:text-brand underline underline-offset-4"
              >
                Reset password
              </Link>
            </p>
            <div>
              <Button
                variant={"default"}
                disabled={isPending}
                className="w-[160px] h-[48px] py-[12px] px-[16px] space-x-3"
              >
                Log In {isPending && <LoaderIcon className="animate-spin" />}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserLoginForm;
