import { useForm } from "react-hook-form";
import useAuthStore from "../store/authStore";
import { useMutation } from "@tanstack/react-query";
import authServices from "../services/authServices";

type ProfileModalProps = {
   closeModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
   name?: string;
   email?: string;
   password?: string;
};

function ProfileModal({ closeModal }: ProfileModalProps) {
   const user = useAuthStore((state) => state.user);
   const login = useAuthStore((state) => state.login);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      defaultValues: {
         name: user?.name,
         email: user?.email,
      },
   });

   // Mutation for updating user profile
   const {
      mutate: updateUser,
      error: updateError,
      isError: isUpdateError,
      isSuccess,
   } = useMutation({
      mutationFn: async (data: FormData) => await authServices.updateUser(data),
      onSuccess: (updatedUserData) => {
         login(updatedUserData);
         closeModal(false);
      },
      onError: (error) => {
         console.error("Update error: ", error);
      },
   });

   // Submit handler
   const onSubmit = (data: FormData) => {
      updateUser(data);
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         <div className="absolute inset-0 bg-black opacity-50"></div>

         <div className="relative w-11/12 max-w-lg p-6 bg-white rounded-lg z-10 space-y-3">
            <h1 className="text-2xl font-bold">Profile</h1>

            {/* Profile form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 rounded-lg">
               <div className="flex flex-col">
                  <label>Name:</label>
                  <input
                     className="border px-1"
                     {...register("name", {
                        required: "Name is required",
                        minLength: {
                           value: 2,
                           message: "Name must be at least 2 characters",
                        },
                     })}
                  />
                  {errors.name && <p className="text-red-600">{errors.name.message}</p>}
               </div>

               <div className="flex flex-col">
                  <label>Email:</label>
                  <input
                     className="border px-1"
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
                     className="border px-1"
                     type="password"
                     {...register("password", {
                        required: "Password is required",
                        minLength: {
                           value: 6,
                           message: "Password must be at least 6 characters",
                        },
                     })}
                  />
                  {errors.password && (
                     <p className="text-red-600">{errors.password.message}</p>
                  )}
               </div>

               {/* Error Handling for API */}
               {isUpdateError && (
                  <p className="text-red-600">
                     {updateError?.message || "Failed to update profile"}
                  </p>
               )}

               {/* Success Feedback */}
               {isSuccess && (
                  <p className="text-green-600">Profile updated successfully!</p>
               )}

               <div className="space-x-1">
                  <button
                     type="submit"
                     className=" bg-blue-700 hover:bg-blue-800 text-white rounded p-2"
                  >
                     Save
                  </button>
                  <button
                     className=" bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                     onClick={() => closeModal(false)}
                  >
                     Close
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default ProfileModal;
