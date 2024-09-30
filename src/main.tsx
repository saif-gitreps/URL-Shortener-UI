import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home, Login, Signup, UrlAnalytics, _404 } from "./pages";
import { AuthLayout } from "./components/index.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            path: "/",
            element: <Home />,
         },
         {
            path: "/login",
            element: (
               <AuthLayout authentication={false}>
                  <Login />
               </AuthLayout>
            ),
         },
         {
            path: "/signup",
            element: (
               <AuthLayout authentication={false}>
                  <Signup />
               </AuthLayout>
            ),
         },
         {
            path: "/:shortId/analytics",
            element: (
               <AuthLayout authentication>
                  <UrlAnalytics />
               </AuthLayout>
            ),
         },
         {
            path: "*",
            element: <_404 />,
         },
      ],
   },
]);

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <RouterProvider router={router} />
      </QueryClientProvider>
   </StrictMode>
);
