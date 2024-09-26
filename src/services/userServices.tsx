import { AxiosResponse, AxiosError } from "axios";
import config from "../config/config";
import { AuthService } from "./authServices";

interface ApiError {
   message: string;
}

interface Url {
   shortId: string;
   redirectURL: string;
   createdBy: string;
   createdAt: Date;
   visitCount: number;
}

class UserServices extends AuthService {
   constructor() {
      super();
      this.api.defaults.baseURL = config.apiBaseUrl + "/user";
   }

   async getAllUrls(): Promise<Url[] | []> {
      try {
         const response: AxiosResponse<{ urls: Url[] }> = await this.api.get("/urls");

         return response.data.urls;
      } catch (error) {
         throw this.handleApiError(error as AxiosError<ApiError>);
      }
   }
}

export default new UserServices();
