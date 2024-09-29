import axios, { AxiosResponse, AxiosError } from "axios";
import config from "../config/config";
import { BaseService } from "./baseServices";
import useAuthStore from "../store/authStore";

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

export class AuthService extends BaseService {
   constructor() {
      super(config.apiBaseUrl + "/api/auth");
   }

   protected handleApiError(error: AxiosError<ApiError>): Error {
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

   async login(credentials: LoginCredentials): Promise<void> {
      try {
         await this.api.post("/login", credentials);
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
            useAuthStore.getState().logout();
            return null;
         }
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async updateUser(updateData: UpdateUserData): Promise<User> {
      try {
         const response: AxiosResponse<{ user: User }> = await this.api.put(
            "/update",
            updateData
         );

         return response.data.user;
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
