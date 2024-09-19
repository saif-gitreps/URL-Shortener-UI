import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

type ProtectedProps = {
   children: React.ReactNode;
   authentication?: boolean;
};

export default function Protected({ children, authentication = true }: ProtectedProps) {
   const navigate = useNavigate();
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

   useEffect(() => {
      if (authentication && isAuthenticated !== authentication) {
         navigate("/login");
      } else if (!authentication && isAuthenticated !== authentication) {
         navigate("/");
      }
   }, [isAuthenticated, navigate, authentication]);

   return <>{children}</>;
}
