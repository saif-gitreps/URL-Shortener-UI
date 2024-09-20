import { useState } from "react";
import ProfileModal from "./ProfileModal";

function Header() {
   const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

   return (
      <div className="shadow-md">
         {isProfileModalOpen && <ProfileModal closeModal={setIsProfileModalOpen} />}
         <nav className="flex justify-between max-w-5xl mx-auto py-4">
            <button
               className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
               onClick={() => setIsProfileModalOpen(true)}
            >
               My Profile
            </button>
            <h1 className="font-bold text-xl">URL Shortener</h1>
            <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
               Logout
            </button>
         </nav>
      </div>
   );
}

export default Header;
