import { useEffect, useState } from "react"
import type { Post } from "../entity/post/model/model";

export default function HomePage()
{
    const[user, setUser] = useState<{name: string}>();

    const [postTape, setPostTape] = useState<Post[]>([]);

    useEffect(() => {
        fetch(`http://localhost:3000/api/users/me`, {credentials: 'include'}).then((data) => {
            data.json().then((json) => {
                setUser(json)
            });
        })
        fetch(`http://localhost:3000/api/users/me/posts`, {credentials: 'include'}).then((data) => {
            data.json().then((json) => {
                setPostTape(json)
            });
        })
    }, [])
    

    return(<div className="flex flex-col">
        <div className="font-bold text-xl">
            Home
        </div>
        <div>
            <div>
                
            </div>
        </div>
        <div>
            {postTape.map((item) => (
                <div>
                    <div>{item.content}</div>
                    <div className="flex flex-row gap-2">
                        <div>Views: {item.views_count}</div>
                        <div>Likes: {item.likes_count}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>)
}