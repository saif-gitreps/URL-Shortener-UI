import { AxiosResponse, AxiosError } from "axios";
import config from "../config/config";
import { AuthService } from "./authServices";

interface ApiError {
   message: string;
}

interface Url {
   url: string;
   shortId?: string;
}

class UrlServices extends AuthService {
   constructor() {
      super();
      this.api.defaults.baseURL = config.apiBaseUrl;
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
