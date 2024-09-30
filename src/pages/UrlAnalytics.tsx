import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import urlServices from "../services/urlServices";
import config from "../config/config";

function UrlAnalytics() {
   const { shortId } = useParams();

   const { data: urlAnalytics, error } = useQuery({
      queryKey: shortId ? ["urlAnalytic", shortId] : [],
      queryFn: async () => await urlServices.getAnalytics(shortId || ""),
      staleTime: 1000 * 60 * 4,
      enabled: !!shortId,
   });

   return (
      <div className="max-w-4xl mx-auto">
         {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
               {error?.message}
            </div>
         )}
         <h2 className="text-md font-bold my-4">
            <Link to={"/"} className="text-blue-700 hover:underline">
               Back
            </Link>
         </h2>

         <h2 className="text-md font-bold text-gray-800 mb-4 flex space-x-1">
            ShortId:
            <Link
               to={config.apiBaseUrl + "/" + shortId}
               target="_blank"
               className="text-blue-600 hover:underline ml-1"
            >
               {shortId}
            </Link>{" "}
            <img
               src="/copy.png"
               alt="cpy"
               className="w-5 h-5 hover:cursor-pointer hover:opacity-30"
               onClick={() =>
                  navigator.clipboard.writeText(config.apiBaseUrl + "/" + shortId)
               }
            />
         </h2>
         <h2 className="text-md font-bold text-gray-800 mb-4">
            Visit count: {urlAnalytics?.length}
         </h2>
         <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Details of recent visitor's analytics
         </h1>

         {urlAnalytics?.length === 0 ? (
            <h1 className="text-xl font-medium text-gray-500 mb-4 text-center">
               No analytics found for this URL
            </h1>
         ) : (
            <table className="w-full border-collapse bg-white shadow-md mb-20">
               <thead>
                  <tr className="bg-gray-200 text-left">
                     <th className="px-4 py-2 border">broswer</th>
                     <th className="px-4 py-2 border">os</th>
                     <th className="px-4 py-2 border">device</th>
                     <th className="px-4 py-2 border">country</th>
                     <th className="px-4 py-2 border">region</th>
                     <th className="px-4 py-2 border">city</th>
                     <th className="px-4 py-2 border">referrer</th>
                  </tr>
               </thead>
               <tbody>
                  {urlAnalytics?.map((urlAnalytic, index) => (
                     <tr key={index} className="">
                        <td className="px-4 py-2 border">{urlAnalytic.browser}</td>
                        <td className="px-4 py-2 border">{urlAnalytic.os}</td>
                        <td className="px-4 py-2 border">{urlAnalytic.device}</td>
                        <td className="px-4 py-2 border">{urlAnalytic.country}</td>
                        <td className="px-4 py-2 border">{urlAnalytic.region}</td>
                        <td className="px-4 py-2 border">{urlAnalytic.city}</td>
                        <td className="px-4 py-2 border">{urlAnalytic.referrer}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
}

export default UrlAnalytics;
