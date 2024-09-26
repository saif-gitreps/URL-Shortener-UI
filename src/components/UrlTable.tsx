import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import userServices from "../services/userServices";
import urlServices from "../services/urlServices";
import useAuthStore from "../store/authStore";
import config from "../config/config";

type SortCriteria = "date-asc" | "date-desc" | "clicks-asc" | "clicks-desc";

function UrlTable() {
   const user = useAuthStore((state) => state.user);
   const queryClient = useQueryClient();

   const { data: urls } = useQuery({
      queryKey: user ? ["urls", user._id] : [],
      queryFn: async () => await userServices.getAllUrls(),
      staleTime: 1000 * 60 * 3,
      enabled: !!user,
   });

   const deleteUrlMutation = useMutation({
      mutationFn: async (shortId: string) => await urlServices.deleteUrl(shortId),
      onSuccess: () => {
         if (user !== null && user?._id) {
            queryClient.invalidateQueries({ queryKey: ["urls", user._id] });
         }
      },
   });

   const [sortCriteria, setSortCriteria] = useState<SortCriteria>("date-asc");

   const sortedUrls = urls?.slice().sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      const clicksA = a.visitCount;
      const clicksB = b.visitCount;

      switch (sortCriteria) {
         case "date-asc":
            return dateA - dateB;
         case "date-desc":
            return dateB - dateA;
         case "clicks-asc":
            return clicksA - clicksB;
         case "clicks-desc":
            return clicksB - clicksA;
         default:
            return 0;
      }
   });

   return (
      <div className="max-w-4xl mx-auto">
         {deleteUrlMutation.isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
               {deleteUrlMutation.error?.message}
            </div>
         )}

         {/* Sorting buttons */}
         <div className="flex justify-between mb-4">
            <select
               id="selectUrl"
               onChange={(e) => setSortCriteria(e.target.value as SortCriteria)}
            >
               <option value="date-asc">Sort by Date (Asc)</option>
               <option value="date-desc">Sort by Date (Desc)</option>
               <option value="clicks-asc">Sort by Clicks (Asc)</option>
               <option value="clicks-desc">Sort by Clicks (Desc)</option>
            </select>
         </div>

         <table className="w-full border-collapse bg-white shadow-md mb-20">
            <thead>
               <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2 border">Sr. No</th>
                  <th className="px-4 py-2 border">ShortId</th>
                  <th className="px-4 py-2 border">Redirect URL</th>
                  <th className="px-4 py-2 border">Clicks</th>
                  <th className="px-4 py-2 border">Created At</th>
                  <th className="px-4 py-2 border"></th>
                  <th className="px-4 py-2 border"></th>
               </tr>
            </thead>
            <tbody>
               {sortedUrls?.map((url, index) => (
                  <tr key={index} className="">
                     <td className="px-4 py-2 border">{index + 1}</td>

                     <td className="py-4 px-4 space-x-1 border-t-2 flex items-center">
                        <Link
                           to={config.apiBaseUrl + "/" + url.shortId}
                           target="_blank"
                           className="text-blue-700 font-semibold hover:underline"
                        >
                           {url.shortId}
                        </Link>
                        <img
                           src="copy.png"
                           alt="cpy"
                           className="w-4 h-4 hover:cursor-pointer hover:opacity-30"
                           onClick={() => navigator.clipboard.writeText(url.shortId)}
                        />
                     </td>

                     <td className="px-4 py-2 border">{url.redirectURL}</td>

                     <td className="px-4 py-2 border">{url.visitCount}</td>

                     <td className="px-4 py-2 border">
                        {new Date(url.createdAt).toDateString()}
                     </td>

                     <td className="px-4 py-2 border">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                           <Link to={`/${url.shortId}/analytics`}>Analytics</Link>
                        </button>
                     </td>

                     <td className="px-4 py-2 border">
                        <button
                           className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                           onClick={() => deleteUrlMutation.mutate(url.shortId)}
                        >
                           Delete
                        </button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>
   );
}

export default UrlTable;
