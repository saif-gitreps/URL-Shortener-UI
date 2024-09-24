import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "./store/authStore";
import authServices from "./services/authServices";
import { Header } from "./components";

function App() {
   const navigate = useNavigate();

   const {
      data: user,
      error,
      isLoading,
      isFetching,
   } = useQuery({
      queryKey: ["currentUser"],
      queryFn: async () => await authServices.getCurrentUser(),
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 14 + 1000 * 50,
   });

   useEffect(() => {
      if (user === null) {
         useAuthStore.getState().logout();
         navigate("/login");
      } else if (user) {
         useAuthStore.getState().login(user);
      }
   }, [user, navigate]);

   useEffect(() => {
      if (error) {
         console.error("Error fetching user:", error.message);
      }
   }, [error]);

   return (
      <div>
         <Header />
         {isLoading && !isFetching && <p className="text-center">Loading...</p>}
         <Outlet />
      </div>
   );
}

export default App;
