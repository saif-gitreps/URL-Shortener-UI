import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

type FormData = {
   email: string;
   password: string;
};

function LoginForm() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();

   const onSubmit = (data: FormData) => {
      console.log(data);
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="bg-gray-100 max-w-96 p-12 shadow-md space-y-2 rounded-lg"
      >
         <h1 className="text-xl font-bold">Login</h1>
         <div>
            Dont have an account?{" "}
            <Link to={"/signup"} className="text-blue-700">
               Signup
            </Link>
         </div>
         <div className="flex flex-col">
            <label>Email:</label>
            <input
               className="border"
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
            <label>Password:</label>
            <input
               className="border"
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

         <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-1"
         >
            Login
         </button>
      </form>
   );
}

export default LoginForm;
