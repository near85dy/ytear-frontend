import { create } from "zustand";
import type { UserProfile } from "./types";
import { persist } from "zustand/middleware";

interface UserState {
    user: UserProfile | null
    setUser: (user: UserProfile) => void
    updateUser: (data: Partial<UserProfile>) => void,
    clearUser: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            updateUser: (data) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...data } : null
                })),
            clearUser: () => set({user: null}),
        }),
        {
            name: 'user-storage',
        }
    )
)