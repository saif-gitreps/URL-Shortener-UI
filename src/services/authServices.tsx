import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

interface UserData {
   name: string;
   email: string;
   password: string;
}

interface Credentials {
   email: string;
   password: string;
}

interface User {
   _id: string;
   email: string;
   name: string;
}

class AuthService {
   private api: AxiosInstance;

   constructor() {
      this.api = axios.create({
         baseURL: "http://localhost:3000/api/auth", // adjust this to match your backend URL
         withCredentials: true, // Crucial for sending and receiving HTTP cookies
      });

      this.api.interceptors.response.use(
         (response) => response,
         async (error: AxiosError) => {
            const originalRequest = error.config;
            if (
               error.response?.status === 401 &&
               originalRequest &&
               !originalRequest._retry
            ) {
               originalRequest._retry = true;
               try {
                  await this.refreshToken();
                  return this.api(originalRequest);
               } catch (refreshError) {
                  await this.logout();
                  throw refreshError;
               }
            }
            return Promise.reject(error);
         }
      );
   }

   async signup(userData: UserData): Promise<bool> {
      const response: AxiosResponse<User> = await this.api.post("/signup", userData);
      return response.status === 200;
   }

   async login(credentials: Credentials): Promise<User> {
      const response: AxiosResponse<User> = await this.api.post("/login", credentials);
      return response.data;
   }

   async logout(): Promise<void> {
      try {
         await this.api.post("/logout");
      } catch (error) {
         console.error("Logout failed", error);
         throw error;
      }
   }

   async refreshToken(): Promise<void> {
      await this.api.post("/refresh-token");
   }

   async getCurrentUser(): Promise<User> {
      const response: AxiosResponse<User> = await this.api.get("/current-user");
      return response.data;
   }
}

export default new AuthService();
