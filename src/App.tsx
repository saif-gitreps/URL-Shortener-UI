import useAuthStore from "./store/authStore";
import { Outlet } from "react-router-dom";

function App() {
   return (
      <div>
         <Outlet />
      </div>
   );
}

export default App;
