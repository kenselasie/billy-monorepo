import * as React from "react";
import RequiresGuest from "@/components/requires/requiresGuest";

const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <RequiresGuest>
      <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="hidden h-full bg-[url('/assets/images/login_image.png')] lg:block bg-no-repeat bg-cover">
          logo
        </div>
        {children}
      </div>
    </RequiresGuest>
  );
};

export default AuthLayout;
