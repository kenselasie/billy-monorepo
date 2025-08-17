"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/const/routes";
import { useAuthStore } from "@/store/authStore";

const RequiresGuest = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isMounted && isLoggedIn) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [router, isLoggedIn, isMounted]);

  if (!isMounted || !isLoggedIn) {
    <div>Loading....</div>;
  }
  return <>{children}</>;
};

export default RequiresGuest;
