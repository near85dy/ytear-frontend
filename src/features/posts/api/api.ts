import { API_URL } from "../../../app/env";
import type { PostForm } from "../model/model";

export async function createPost(form: PostForm)
{
    const response = await fetch(`${API_URL}/users/me/posts`, {headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify(form), credentials: 'include'});
    return response;
}
