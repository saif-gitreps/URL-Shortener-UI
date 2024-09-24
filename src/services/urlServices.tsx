import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import config from "../config/config";

interface ApiError {
   message: string;
}

interface Url {
   url: string;
   shortId?: string;
}

class UrlServices {
   private api: AxiosInstance;
   constructor() {
      this.api = axios.create({
         baseURL: config.apiBaseUrl,
         withCredentials: true,
      });
   }

   private handleApiError(error: AxiosError<ApiError>): Error {
      if (error.response?.data) {
         console.log("API Error response:", error.response.data);
         return new Error(error.response.data.message);
      }
      return new Error("An unexpected error occurred");
   }

   async generateRandomShortId(url: Url): Promise<string> {
      try {
         const response: AxiosResponse<{ shortId: string }> = await this.api.post(
            "/shorten",
            url
         );
         return response.data.shortId;
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async generateCustomShortId(url: Url): Promise<string> {
      try {
         const response: AxiosResponse<{ shortId: string }> = await this.api.post(
            "/custom-shorten",
            url
         );
         return response.data.shortId;
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async redirectToOriginalUrl(shortId: string): Promise<void> {
      try {
         await this.api.get(`/${shortId}`);
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   async deleteUrl(shortId: string): Promise<void> {
      try {
         await this.api.delete(`/${shortId}`);
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }

   // Todo add analyitcs api for each shortId.
}

export default new UrlServices();
