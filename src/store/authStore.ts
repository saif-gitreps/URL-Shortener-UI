import { create } from "zustand";

type State = {
   user: {
      _id: string;
      name: string;
      email: string;
   } | null;
   isAuthenticated: boolean;
};

type Action = {
   login: (user: State["user"]) => void;
   logout: () => void;
};

const useAuthStore = create<State & Action>((set) => ({
   user: null,
   isAuthenticated: false,
   login: (user: State["user"]) => set({ user: user, isAuthenticated: true }),
   logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;
