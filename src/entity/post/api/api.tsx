
import { API_URL } from "../../../app/env"

export async function getRecomendationPosts()
{

}

// export async function getUserPostsById(id: string)
// {
// }

export async function getLocalUserPosts()
{
    try{
        const response = await fetch(`${API_URL}/users/me/posts`, {credentials: 'include'});
        if (!response.ok) throw new Error('Failed to fetch local user')
        const json = await response.json()
        return json
    } catch (err) {
        console.error(err)
        return null
    }
}