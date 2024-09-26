import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authServices";
import useAuthStore from "../store/authStore";
import { useMutation } from "@tanstack/react-query";

type FormData = {
   email: string;
   password: string;
};

function LoginForm() {
   const navigate = useNavigate();
   const login = useAuthStore((state) => state.login);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();

   const loginMutation = useMutation({
      mutationFn: async (data: FormData) => await authService.login(data),
      onSuccess: async () => {
         const user = await authService.getCurrentUser();
         login(user);
         navigate("/");
      },
   });

   const onSubmit = (data: FormData) => {
      loginMutation.mutate(data);
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="bg-gray-100 max-w-96 p-12 shadow-md space-y-2 rounded-lg"
      >
         <h1 className="text-xl font-bold">Login</h1>

         <div>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-700">
               Signup
            </Link>
         </div>

         <div className="flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
               id="email"
               className="border px-2 rounded"
               {...register("email", {
                  required: "Email is required",
                  pattern: {
                     value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                     message: "Invalid email address",
                  },
               })}
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
         </div>

         <div className="flex flex-col">
            <label htmlFor="password">Password:</label>
            <input
               id="password"
               className="border px-2 rounded"
               type="password"
               {...register("password", {
                  required: "Password is required",
                  minLength: {
                     value: 6,
                     message: "Password must be at least 6 characters",
                  },
               })}
            />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
         </div>

         {loginMutation.isError && (
            <p className="text-red-600">{loginMutation.error.message}</p>
         )}

         <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-2 mt-4"
         >
            {loginMutation.isPending ? "Loading..." : "Login"}
         </button>
      </form>
   );
}

export default LoginForm;
