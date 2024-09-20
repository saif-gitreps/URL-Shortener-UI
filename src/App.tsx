import useAuthStore from "./store/authStore";
import { Outlet } from "react-router-dom";
import { Header } from "./components";

function App() {
   return (
      <div>
         <Header />
         <Outlet />
      </div>
   );
}

export default App;
