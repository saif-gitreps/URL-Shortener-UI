import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { UrlTable } from "../components";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import urlServices from "../services/urlServices";
import config from "../config/config";

type FormData = {
   url: string;
   shortId?: string;
};

function Home() {
   const isAuthenticated: boolean = useAuthStore((state) => state.isAuthenticated);
   const user = useAuthStore((state) => state.user);
   const [randomShortId, setRandomShortId] = useState<string | null>(null);
   const [customShortId, setCustomShortId] = useState<string | null>(null);
   const queryClient = useQueryClient();

   const {
      register: registerRandomShortId,
      handleSubmit: handleRandomShortId,
      formState: { errors: randomErrors },
      reset: resetRandom,
   } = useForm<FormData>();
   const {
      register: registerCustomShortId,
      handleSubmit: handleSubmitCustomShortId,
      formState: { errors: customErrors },
      reset: resetCustom,
   } = useForm<FormData>();

   const {
      mutate: generateRandomShortId,
      error: randomError,
      isError: isRandomError,
      isPending: isRandomPending,
   } = useMutation({
      mutationFn: async (data: FormData) => await urlServices.generateRandomShortId(data),
      onSuccess: (data) => {
         setRandomShortId(config.apiBaseUrl + "/" + data);
         if (user !== null && user?._id)
            queryClient.invalidateQueries({ queryKey: ["urls", user?._id] });
         resetRandom();
      },
      onError: (error) => {
         console.error("Random short URL error: ", error);
      },
   });

   const {
      mutate: generateCustomShortId,
      error: customError,
      isError: isCustomError,
      isPending: isCustomPending,
   } = useMutation({
      mutationFn: async (data: FormData) => await urlServices.generateCustomShortId(data),
      onSuccess: (data) => {
         setCustomShortId(config.apiBaseUrl + "/" + data);
         if (user !== null && user?._id)
            queryClient.invalidateQueries({ queryKey: ["urls", user?._id] });
         resetCustom();
      },
      onError: (error) => {
         console.error("Custom short URL error: ", error);
      },
   });

   const onRandomShortIdSubmit = (data: FormData) => {
      setRandomShortId(null);
      generateRandomShortId(data);
   };

   const onCustomShortIdSubmit = (data: FormData) => {
      setCustomShortId(null);
      generateCustomShortId(data);
   };

   return (
      <div className="flex flex-col justify-center mt-5 space-y-8">
         <div className="max-w-md mx-auto space-y-4 bg-gray-100 p-12 shadow-md rounded-lg">
            <form
               onSubmit={handleRandomShortId(onRandomShortIdSubmit)}
               className="space-y-2 border p-1 rounded"
            >
               <input
                  type="text"
                  placeholder="Ex: https://example.com"
                  className="border w-full px-2"
                  {...registerRandomShortId("url", { required: "URL is required" })}
               />

               {randomErrors.url && (
                  <p className="text-red-500">{randomErrors.url.message}</p>
               )}

               <button
                  disabled={isRandomPending}
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded py-1"
               >
                  {isRandomPending
                     ? "Generating. Please wait server is loading"
                     : "Generate a random short URL"}
               </button>

               {isRandomError && <p className="text-red-500">{randomError.message}</p>}

               {randomShortId && (
                  <div className="px-2 py-2 flex justify-evenly items-center bg-white rounded">
                     <Link
                        to={randomShortId}
                        className="text-blue-700 font-semibold hover:underline"
                        target="_blank"
                     >
                        {randomShortId}
                     </Link>
                     <img
                        src="copy.png"
                        alt="cpy"
                        className="w-5 h-5 hover:cursor-pointer hover:opacity-30"
                        onClick={() => navigator.clipboard.writeText(randomShortId)}
                     />
                  </div>
               )}
            </form>

            {isAuthenticated && (
               <form
                  onSubmit={handleSubmitCustomShortId(onCustomShortIdSubmit)}
                  className="space-y-2 border p-1 rounded"
               >
                  <div className="w-full">
                     <input
                        placeholder="Ex: abc123"
                        type="text"
                        className="border w-1/3 px-2"
                        {...registerCustomShortId("shortId", {
                           required: "Short ID is required",
                        })}
                     />
                     <input
                        placeholder="Ex: https://example.com"
                        type="text"
                        className="border w-2/3 px-2"
                        {...registerCustomShortId("url", { required: "URL is required" })}
                     />
                  </div>

                  {customErrors.shortId && (
                     <p className="text-red-500">{customErrors.shortId.message}</p>
                  )}
                  {customErrors.url && (
                     <p className="text-red-500">{customErrors.url.message}</p>
                  )}

                  <button
                     type="submit"
                     className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded py-1"
                     disabled={isCustomPending}
                  >
                     {isCustomPending
                        ? "Generating. Please wait server is loading"
                        : "Generate a custom short URL"}
                  </button>

                  {isCustomError && <p className="text-red-500">{customError.message}</p>}

                  {customShortId && (
                     <div className="px-2 py-2 flex justify-evenly items-center bg-white rounded">
                        <Link
                           to={customShortId}
                           className="text-blue-700 font-semibold hover:underline"
                           target="_blank"
                        >
                           {customShortId}
                        </Link>
                        <img
                           src="copy.png"
                           alt="cpy"
                           className="w-5 h-5 hover:cursor-pointer hover:opacity-30"
                           onClick={() => navigator.clipboard.writeText(customShortId)}
                        />
                     </div>
                  )}
               </form>
            )}

            {!isAuthenticated && (
               <div className="text-center">
                  <Link to={"/login"} className="text-blue-700 font-semibold">
                     Login
                  </Link>{" "}
                  to create custom URLs, check URL analytics, delete URLs, and keep track
                  of your URLs.
               </div>
            )}
         </div>

         {isAuthenticated && <UrlTable />}
      </div>
   );
}

export default Home;
