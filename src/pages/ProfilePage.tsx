import { useEffect, useState } from "react";
import type { UserProfile } from "../entity/user/model/types";
import type { Post } from "../entity/post/model/types";
import { getLocalUserPosts } from "../entity/post/api/api";
import PostCard from "../entity/post/ui/PostCard";
import { getLocalUser } from "../entity/user/api/api";


export default function ProfilePage() {
    const[userProfile, setUserProfile] = useState<UserProfile>();
    const[userPosts, setUserPosts] = useState<Post[]>();

    const [currentButton, setCurrentButton] = useState<number>(0);

    const bottomButtons = [
        {id: 0, name: "Tweets"},
        {id: 1, name: "Replies"},
        {id: 2, name: "Likes"}
    ]

    useEffect(() => {
        getLocalUser().then((response) => {
            setUserProfile(response)
        })
        
        getLocalUserPosts().then((data) => {
            setUserPosts(data)
        });
    }, [])

    return (<div className="flex flex-col w-[400px] h-[200px]">
        <div>

        </div>
        <div>
            <button>Edit profile</button>
        </div>
        <div>
            <div>You</div>
            <div>@{userProfile?.username}</div>
        </div>
        <div className="flex">
            {bottomButtons.map((item) => (
                <button key={item.id} onClick={() => setCurrentButton(item.id)} className={`py-1 flex w-full justify-center border-0 ${currentButton == item.id ? `border-b-4 border-blue-500` : ``}`}>{item.name}</button>
            ))}
        </div>
        <div>
            {!userPosts ? 
            <div className="flex justify-center">
                <div className="py-8">No posts yet</div>
            </div> :              
            <div className="flex flex-col">
                {userPosts?.map((item) => (
                    <PostCard id={item.id} content={item.content} likes_count={item.likes_count} views_count={item.views_count} createdAt={item.createdAt} user={item.user}></PostCard>
                ))}
            </div>}
        </div>
    </div>)
}