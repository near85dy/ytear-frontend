import { useUserStore } from "./store";
import type { UserProfile } from "./types";

export const useUser = () => useUserStore((s) => s.user as UserProfile)
export const updateUser = () => useUserStore(state => state.updateUser)