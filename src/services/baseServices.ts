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
   private csrfToken: string | null = null;

   constructor(baseURL: string) {
      this.api = axios.create({
         baseURL,
         withCredentials: true,
      });

      this.api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
         if (config.method !== "get") {
            const token = await this.getCsrfToken();
            config.headers["X-XSRF-TOKEN"] = token;
         }

         return config;
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
         return new Error(error.response.data.message);
      }
      return new Error("An unexpected error occurred");
   }

   async getCsrfToken(): Promise<string | null> {
      try {
         if (!this.csrfToken) {
            const response = await axios.get(config.apiBaseUrl + "/api/auth/csrf-token", {
               withCredentials: true,
            });
            this.csrfToken = response.data.csrfToken;
         }

         return this.csrfToken;
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   private async refreshCsrfToken(): Promise<void> {
      this.csrfToken = null;
      await this.getCsrfToken();
   }

   async refreshToken(): Promise<void> {
      try {
         await axios.post(
            config.apiBaseUrl + "/api/auth/refresh-token",
            {},
            {
               withCredentials: true,
            }
         );
         // Refresh CSRF token after refreshing the auth token
         await this.refreshCsrfToken();
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async logout(): Promise<void> {
      try {
         await axios.post(
            config.apiBaseUrl + "/api/auth/logout",
            {},
            {
               headers: {
                  "X-XSRF-TOKEN": await this.getCsrfToken(),
               },
               withCredentials: true,
            }
         );
         this.csrfToken = null;
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }
}
