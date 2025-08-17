import React from "react";
import UserLoginForm from "@/components/user-login-form";
import Link from "next/link";
import { ROUTES } from "@/const/routes";

const Login = () => {
  return (
    <div>
      <UserLoginForm />
      <div className="text-center">
        <Link
          href={ROUTES.HOME}
          className="hover:text-brand text-center text-sm text-muted-foreground mt-20 underline underline-offset-4"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default Login;
