
const API_URL = "http://localhost:3000/api"

export async function getUserById(id: string) {
    try {
        const res = await fetch(`${API_URL}/users/${id}`)
        if (!res.ok) throw new Error(`Failed to fetch user ${id}`)
        const json = await res.json()
        return json
    } catch (err) {
        console.error(err)
        return null
    }
}

export async function getLocalUser() {
    try {
        const res = await fetch(`${API_URL}/users/me`, { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch local user')
        const json = await res.json()
        console.log("2", json)
        return json
    } catch (err) {
        console.error(err)
        return null
    }
}
