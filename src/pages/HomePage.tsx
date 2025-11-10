import { useEffect, useState } from "react"
import type { Post } from "../entity/post/model/types";
import PostCard from "../entity/post/ui/PostCard";

const API_URL = "http://77.93.9.99:3000/api"

export default function HomePage()
{
    const [postTape, setPostTape] = useState<Post[]>([]);
 
    useEffect(() => {
        fetch(`${API_URL}/posts/foryou`, {credentials: 'include'}).then((data) => {
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
                <PostCard id={item.id} content={item.content} likes_count={item.likes_count} views_count={item.views_count} createdAt={item.createdAt} user={item.user}></PostCard>
            ))}
        </div>
    </div>)
}