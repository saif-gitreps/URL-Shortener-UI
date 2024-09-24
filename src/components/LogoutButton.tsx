import useAuthStore from "../store/authStore";
import authServices from "../services/authServices";

function LogoutButton() {
   const logoutFromStore = useAuthStore((state) => state.logout);

   return (
      <button
         className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
         onClick={async () => {
            try {
               await authServices.logout();
               logoutFromStore();
            } catch (error) {
               console.error("Logout failed:", error);
            }
         }}
      >
         Logout
      </button>
   );
}

export default LogoutButton;
