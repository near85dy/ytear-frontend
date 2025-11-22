import { API_URL } from "../../../app/env";

export async function getUserChats()
{
    const response = await fetch(`${API_URL}/chats/me`, {credentials: 'include'});
    return await response.json();
}