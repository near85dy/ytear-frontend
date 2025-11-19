import { API_URL } from "../../../app/env";

export async function uploadUserAvatar(avatar: File)
{
    if(!avatar) return;
    const formData = new FormData();
    formData.append("file", avatar);

    const response = await fetch(`${API_URL}/storage/avatar/upload`, {method: "POST", credentials: 'include', body: formData})
    console.log(await response.json())
}