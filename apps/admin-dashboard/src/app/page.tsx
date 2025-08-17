"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/const/routes";
import { useAuthStore } from "@/store/authStore";

const Page = () => {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  React.useLayoutEffect(() => {
    if (!isLoggedIn) {
      router.replace(ROUTES.HOME);
    } else {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [router]);

  return <></>;
};

export default Page;
