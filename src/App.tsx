import { Outlet } from "react-router-dom";
import { Header } from "./components";
import { useGetCurrentUser } from "./hooks/useGetCurrentUser";

function App() {
   const { isLoading, isFetching } = useGetCurrentUser();

   return (
      <div>
         <Header />
         {isLoading && !isFetching && <p className="text-center">Loading...</p>}
         <Outlet />
      </div>
   );
}

export default App;
