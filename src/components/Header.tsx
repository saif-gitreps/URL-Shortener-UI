import { useState } from "react";
import ProfileModal from "./ProfileModal";

function Header() {
   const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

   return (
      <div className="shadow-md">
         {isProfileModalOpen && <ProfileModal closeModal={setIsProfileModalOpen} />}
         <nav className="flex justify-between max-w-5xl mx-auto py-4 ">
            <div
               onClick={() => setIsProfileModalOpen(true)}
               className="flex justify-center items-center p-2 rounded space-x-2 cursor-pointer hover:bg-gray-50"
            >
               <img src="/user.png" alt="" className="h-6 w-6" />
               <p className="font-semibold">Profile</p>
            </div>
            <h1 className="font-bold text-xl">URL Shortener</h1>
            <button className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
               Logout
            </button>
         </nav>
      </div>
   );
}

export default Header;
