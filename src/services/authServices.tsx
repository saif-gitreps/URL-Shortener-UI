import axios, {
   AxiosInstance,
   AxiosResponse,
   AxiosError,
   InternalAxiosRequestConfig,
} from "axios";
import config from "../config/config";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
   _retry?: boolean;
}

interface SignupData {
   name: string;
   email: string;
   password: string;
}

interface LoginCredentials {
   email: string;
   password: string;
}

interface User {
   _id: string;
   name: string;
   email: string;
}

interface UpdateUserData {
   name?: string;
   email?: string;
   password?: string;
}

interface ApiError {
   message: string;
}

class AuthService {
   private api: AxiosInstance;
   private refreshPromise: Promise<void> | null = null;

   constructor() {
      this.api = axios.create({
         baseURL: config.apiBaseUrl + "/auth",
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

               try {
                  await this.refreshPromise;
                  return this.api(originalRequest);
               } catch (refreshError) {
                  // If refresh token fails, logout the user
                  await this.logout();
                  throw refreshError;
               }
            }
            return Promise.reject(error);
         }
      );
   }

   private handleApiError(error: AxiosError<ApiError>): Error {
      if (error.response?.data) {
         console.log("API Error response:", error.response.data);
         return new Error(error.response.data.message);
      }
      return new Error("An unexpected error occurred");
   }

   async signup(userData: SignupData): Promise<void> {
      try {
         await this.api.post("/signup", userData);
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async login(credentials: LoginCredentials): Promise<User> {
      try {
         const response: AxiosResponse<{ user: User }> = await this.api.post(
            "/login",
            credentials
         );
         return response.data.user;
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async logout(): Promise<void> {
      try {
         await this.api.post("/logout");
      } catch (error) {
         console.error("Logout failed", error);
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async refreshToken(): Promise<void> {
      try {
         await this.api.post("/refresh-token");
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async getCurrentUser(): Promise<User | null> {
      try {
         const response: AxiosResponse<{ user: User }> = await this.api.get(
            "/current-user"
         );
         return response.data.user;
      } catch (error) {
         if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null;
         }
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }
   async updateUser(updateData: UpdateUserData): Promise<void> {
      try {
         await this.api.put("/update-user", updateData);
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async isAuthenticated(): Promise<boolean> {
      try {
         await this.getCurrentUser();
         return true;
      } catch (error) {
         if (error instanceof Error && error.message === "Unauthorized") {
            return false;
         }
         throw error;
      }
   }
}

export default new AuthService();
