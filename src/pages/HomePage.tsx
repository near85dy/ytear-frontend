import { useEffect, useState } from "react"
import type { Post } from "../entity/post/model/model";
import type { UserProfile } from "../entity/user/model/types";
import { getLocalUser } from "../entity/user/api/api";

export default function HomePage()
{
    const [postTape, setPostTape] = useState<Post[]>([]);
 
    useEffect(() => {
        console.log(getLocalUser())
        
        fetch(`http://localhost:3000/api/posts/foryou`, {credentials: 'include'}).then((data) => {
            data.json().then((json) => {
                setPostTape(json)
            });
        })
    }, [])
    

    return(<div className="flex flex-col">
        <div className="font-bold text-xl p-2">
            Home
        </div>
        <div className="flex">
            <div className="flex w-full border-b border-gray-300">
                
            </div>
        </div>
        <div className="flex flex-col gap-4 p-3">
            {postTape.map((item) => (
                <div className="flex gap-6" key={item.id}>
                    <img width={50} height={50} src={'http://localhost:3000/api/storage/avatar/' + item.user.image}></img>
                    <div className="flex flex-col">
                        <div className="flex gap-3 items-center">
                            <div>{item.user.name} {item.user.surname}</div>
                            <div className="flex items-center justify-between">
                                <div className="text-xs">@{item.user.username}</div>
                                <div>{item.createdAt.split("T")[1].split("Z")[0].split(".")[0]}</div>
                            </div>
                        </div>
                        <div>{item.content}</div>
                        <div className="flex flex-row gap-2">
                            <div>Views: {item.views_count}</div>
                            <div>Likes: {item.likes_count}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>)
}