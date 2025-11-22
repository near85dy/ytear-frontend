import type { UserProfile } from "../../user/model/types";

export interface ChatData {
    id: string,
    user1: UserProfile,
    user2: UserProfile,
    createdAt: string,
}