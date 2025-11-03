import { useEffect, useState } from "react"

export default function HomePage()
{
    const[user, setUser] = useState<{name: string}>();

    useEffect(() => {
        fetch(`http://localhost:3000/api/users/me`, {credentials: 'include'}).then((data) => {
            data.json().then((json) => {
                setUser(json)
            });

        })
    }, [])
    

    return(<div>
        {user?.name}
    </div>)
}