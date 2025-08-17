import * as React from "react";
import UserRegisterForm from "@/components/user-register-form";
import Link from "next/link";
import { ROUTES } from "@/const/routes";

const Register = () => {
  return (
    <div>
      <UserRegisterForm />
      <div className="text-center mt-[-50px]">
        <Link
          href={ROUTES.HOME}
          className="hover:text-brand text-center text-sm text-muted-foreground underline underline-offset-4"
        >
          Back
        </Link>
      </div>
    </div>
  );
};

export default Register;
