import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

type UrlData = {
   shortId: string;
   redirectUrl: string;
   clicks: number;
};

function Home() {
   const isAuthenticated: boolean = useAuthStore((state) => state.isAuthenticated);
   const [randomUrl, setRandomUrl] = useState<string>("");
   const [customUrl, setCustomUrl] = useState<string>("");
   const [customShortId, setCustomShortId] = useState<string>("");
   const [urls, setUrls] = useState<UrlData[]>([
      { shortId: "abc123", redirectUrl: "https://example.com", clicks: 10 },
      { shortId: "xyz456", redirectUrl: "https://google.com", clicks: 25 },
      { shortId: "abc123", redirectUrl: "https://example.com", clicks: 10 },
      { shortId: "xyz456", redirectUrl: "https://google.com", clicks: 25 },
      { shortId: "abc123", redirectUrl: "https://example.com", clicks: 10 },
      { shortId: "xyz456", redirectUrl: "https://google.com", clicks: 25 },
      { shortId: "abc123", redirectUrl: "https://example.com", clicks: 10 },
      {
         shortId: "xyz456",
         redirectUrl:
            "https://goooooooooooooooooooooooogggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggle.com",
         clicks: 25,
      },
      { shortId: "abc123", redirectUrl: "https://example.com", clicks: 10 },
      { shortId: "xyz456", redirectUrl: "https://google.com", clicks: 25 },
      { shortId: "abc123", redirectUrl: "https://example.com", clicks: 10 },
      { shortId: "xyz456", redirectUrl: "https://google.com", clicks: 25 },
   ]);

   const handleDelete = (shortId: string) => {
      setUrls(urls.filter((url: UrlData) => url.shortId !== shortId));
   };

   return (
      <div className="flex flex-col justify-center mt-20 space-y-8">
         <div className="max-w-md mx-auto space-y-4 bg-gray-100 p-12 shadow-md rounded-lg">
            <input
               type="text"
               placeholder="Ex: https://example.com"
               className="border w-full px-2"
               onChange={(e) => setRandomUrl(e.target.value)}
               value={randomUrl}
            />
            <button
               type="button"
               className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-1"
            >
               Generate a random short URL
            </button>

            {isAuthenticated && (
               <>
                  <div className="w-full">
                     <input
                        placeholder="Ex: abc123"
                        type="text"
                        value={customShortId}
                        className="border w-1/3 px-2"
                        onChange={(e) => setCustomShortId(e.target.value)}
                     />
                     <input
                        placeholder="Ex: https://example.com"
                        type="text"
                        value={customUrl}
                        className="border w-2/3 px-2"
                        onChange={(e) => setCustomUrl(e.target.value)}
                     />
                  </div>
                  <button
                     type="button"
                     className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-1"
                  >
                     Generate a custom short URL
                  </button>
               </>
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
                     <tr key={url.shortId} className="">
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
      </div>
   );
}

export default Home;
