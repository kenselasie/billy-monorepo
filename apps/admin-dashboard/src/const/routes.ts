export const ROUTES = {
  //dashboard
  DASHBOARD: "/dashboard",

  // auth
  HOME: "/home",
  REGISTER: "/register",
  LOGIN: "/login",
  RESET: "/reset",
  TERMS_AND_CONDITIONS: "/terms-conditions",
  PRIVACY_POLICY: "/privacy-policy",

  // store
  SHOP: "/shop",
  SHOP_ADD: "/add-shop",
  SHOP_VIEW: ({ id }: { id: string }) => `/shop/${id}`,

  // category
  CATEGORY: "/category",
  CATEGORY_ADD: "/add-category",
} as const;
