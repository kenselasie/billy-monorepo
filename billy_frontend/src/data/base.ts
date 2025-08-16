import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_API;

const getAuthData = () => {
  if (typeof window !== "undefined") {
    if (window.localStorage.getItem("auth-billy-storage")) {
      return JSON.parse(localStorage.getItem("auth-billy-storage") || "");
    }
    return null;
  }
};

const getAuthorizationHeader = () => {
  const authData = getAuthData();
  if (authData && authData?.state && authData?.state?.accessToken) {
    return `Bearer ${authData?.state?.accessToken}`;
  }
  return null;
};

const createHttpInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: serverUrl,
  });

  instance.interceptors.request.use((config) => {
    const token = getAuthorizationHeader();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorResponse = error.response;
      if (
        errorResponse &&
        errorResponse.status === 401 &&
        errorResponse.data.message === "jwt expired"
      ) {
        sessionStorage.clear();
        toast.error("Token expired");
        window.location.replace("/login");
      }
      return Promise.reject(errorResponse);
    }
  );

  return instance;
};

const http = createHttpInstance();

const httpWithoutAuth = axios.create({
  baseURL: serverUrl,
});
httpWithoutAuth.interceptors.request.use((request) => {
  console.log("Starting Request", request);
  return request;
});

httpWithoutAuth.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.log("Error:", error);
    return Promise.reject(error);
  }
);

export default http;
export { httpWithoutAuth };
