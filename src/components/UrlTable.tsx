import React from "react";
import { Link } from "react-router-dom";

type UrlTableProps = {
   urls: {
      shortId: string;
      redirectUrl: string;
      clicks: number;
   }[];
   handleDelete: (shortId: string) => void;
};

function UrlTable({ urls, handleDelete }: UrlTableProps) {
   return (
      <div className="max-w-4xl mx-auto">
         <table className="  w-full border-collapse bg-white shadow-md">
            <thead>
               <tr className="bg-gray-200 text-left">
                  <th className="px-4 py-2 border">Sr. No</th>
                  <th className="px-4 py-2 border">ShortId</th>
                  <th className="px-4 py-2 border">Redirect URL</th>
                  <th className="px-4 py-2 border">Clicks</th>
                  <th className="px-4 py-2 border"></th>
                  <th className="px-4 py-2 border"></th>
               </tr>
            </thead>
            <tbody>
               {urls.map((url, index) => (
                  <tr key={index} className="">
                     <td className="px-4 py-2 border">{index + 1}</td>
                     <td className="px-2 py-2 flex space-x-1 border-t-2">
                        <Link
                           to={`/${url.shortId}`}
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
                     <td className="px-4 py-2 border max-w-96 break-words">
                        {url.redirectUrl}
                     </td>
                     <td className="px-4 py-2 border">{url.clicks}</td>
                     <td className="px-4 py-2 border">
                        <button
                           className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                           onClick={() => handleDelete(url.shortId)}
                        >
                           <Link to={`/${url.shortId}/analytics`}>Analytics</Link>
                        </button>
                     </td>
                     <td className="px-4 py-2 border">
                        <button
                           className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                           onClick={() => handleDelete(url.shortId)}
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
