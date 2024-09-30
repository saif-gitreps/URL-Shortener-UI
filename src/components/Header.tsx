import { useState } from "react";
import ProfileModal from "./ProfileModal";
import useAuthStore from "../store/authStore";
import LogoutButton from "./LogoutButton";
import { useNavigate } from "react-router-dom";

function Header() {
   const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
   const isAuthenticated: boolean = useAuthStore((state) => state.isAuthenticated);
   const navigate = useNavigate();

   return (
      <div className="shadow-md">
         {isAuthenticated && isProfileModalOpen && (
            <ProfileModal closeModal={setIsProfileModalOpen} />
         )}

         <nav
            className={`flex ${isAuthenticated ? "justify-between" : "justify-start"}
             items-center max-w-5xl p-3 mx-auto`}
         >
            <h1
               className="font-bold text-xl text-center flex items-center hover:cursor-pointer hover:opacity-60"
               onClick={() => navigate("/")}
            >
               <img src="/url.png" alt="" className="w-10 h-10" />
               Shortener
            </h1>

            {isAuthenticated && (
               <div className="flex">
                  <div
                     onClick={() => setIsProfileModalOpen(true)}
                     className="flex justify-center items-center p-3 rounded space-x-2 cursor-pointer hover:opacity-60"
                  >
                     <img src="/user.png" alt="" className="h-6 w-6" />
                     <p className="font-bold">Profile</p>
                  </div>
                  <LogoutButton />
               </div>
            )}
         </nav>
      </div>
   );
}

export default Header;
