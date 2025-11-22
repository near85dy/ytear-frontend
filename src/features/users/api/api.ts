import { API_URL } from "../../../app/env";
import type { UserProfile } from "../../../entity/user/model/types";

export async function uploadUserAvatar(avatar: File)
{
    if(!avatar) return;
    const formData = new FormData();
    formData.append("file", avatar);

    const response = await fetch(`${API_URL}/storage/avatar/upload`, {method: "POST", credentials: 'include', body: formData})

    return await response.json()
}

export async function updateUserProfileData(userProfile: UserProfile)
{
    const response = await fetch(`${API_URL}/users/me`, {headers: {"Content-Type": "application/json"}, method: "PUT", credentials: 'include', body: JSON.stringify(userProfile)})
    return response
}