import axios, { AxiosResponse, AxiosError, AxiosInstance } from "axios";
import config from "../config/config";
import { BaseService } from "./baseServices";

interface ApiError {
   message: string;
}

interface Url {
   url: string;
   shortId?: string;
}

interface UrlAnalytic {
   url: string;
   createdAt: Date;
   redirectURL: string;
   shortId: string;
   browser?: string;
   os?: string;
   device: string;
   country?: string;
   region?: string;
   city?: string;
   referrer?: string;
}

class UrlServices extends BaseService {
   private baseApiUrl: AxiosInstance;

   constructor() {
      super(config.apiBaseUrl + "/api/url");

      this.baseApiUrl = axios.create({
         baseURL: config.apiBaseUrl,
      });
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
         await this.baseApiUrl.get(`/${shortId}`);
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

   async getAnalytics(shortId: string): Promise<UrlAnalytic[]> {
      try {
         const response: AxiosResponse<{ analytics: UrlAnalytic[] }> = await this.api.get(
            `/${shortId}/analytics`
         );

         return response.data.analytics;
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }
}

export default new UrlServices();
