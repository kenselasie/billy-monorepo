"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/const/routes";

const RequiresAuth = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && !isLoggedIn) {
      router.replace(ROUTES.LOGIN);
    }
  }, [router, isLoggedIn, isMounted]);

  if (!isMounted || !isLoggedIn) {
    <div>Loading....</div>;
  }
  return <div>{children}</div>;
};

export default RequiresAuth;
