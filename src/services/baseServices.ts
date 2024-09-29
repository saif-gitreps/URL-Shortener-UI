import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import config from "../config/config";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
   _retry?: boolean;
}

interface ApiError {
   message: string;
}

export class BaseService {
   protected api: AxiosInstance;
   private refreshPromise: Promise<void> | null = null;

   constructor(baseURL: string) {
      this.api = axios.create({
         baseURL,
         withCredentials: true,
      });

      this.api.interceptors.response.use(
         (response) => response,
         async (error: AxiosError<ApiError>) => {
            const originalRequest = error.config as CustomAxiosRequestConfig;

            if (error.response?.status === 401 && !originalRequest._retry) {
               originalRequest._retry = true;

               if (!this.refreshPromise) {
                  this.refreshPromise = this.refreshToken().finally(() => {
                     this.refreshPromise = null;
                  });
               }

               await this.refreshPromise;
               return this.api(originalRequest);
            }
            return Promise.reject(error);
         }
      );
   }

   protected handleApiError(error: AxiosError<ApiError>): Error {
      if (error.response?.data) {
         console.log("API Error response:", error.response.data.message);
         return new Error(error.response.data.message);
      }
      return new Error("An unexpected error occurred");
   }

   async refreshToken(): Promise<void> {
      try {
         await axios.post(
            config.apiBaseUrl + "/api/auth/refresh-token",
            {},
            { withCredentials: true }
         );
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async logout(): Promise<void> {
      try {
         await axios.post(
            config.apiBaseUrl + "/api/auth/logout",
            {},
            { withCredentials: true }
         );
      } catch (error) {
         console.error("Logout failed", error);
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }
}
