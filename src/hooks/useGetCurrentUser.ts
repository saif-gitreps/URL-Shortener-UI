import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authServices from "../services/authServices";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";

export function useGetCurrentUser() {
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
      refetchOnReconnect: true,
      refetchInterval(query) {
         return query.isStale() ? 1000 * 60 * 50 : false;
      },
      staleTime: 1000 * 60 * 15,
   });

   useEffect(() => {
      if (user === null) {
         useAuthStore.getState().logout();
         navigate("/login");
      } else if (user) {
         useAuthStore.getState().login(user);
      }
   }, [user, navigate]);

   return { user, error, isLoading, isFetching };
}
