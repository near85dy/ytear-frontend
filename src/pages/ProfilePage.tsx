import { useEffect, useState } from "react";
import type { UserProfile } from "../entity/user/model/types";
import type { Post } from "../entity/post/model/types";
import { getLocalUserPosts } from "../entity/post/api/api";
import PostCard from "../entity/post/ui/PostCard";
import { getLocalUser } from "../entity/user/api/api";
import { BaseModal } from "../shared/BaseModal";
import EditProfileForm from "../features/users/ui/EditProfileForm";
import { useNavigate } from "react-router-dom";
import { useUser } from "../entity/user/model/selectors";
import { useUserStore } from "../entity/user/model/store";


export default function ProfilePage() {
    const navigate = useNavigate();

    const user = useUser();
    const setUser = useUserStore((s) => s.setUser)

    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [userPosts, setUserPosts] = useState<Post[]>();
    const [currentButton, setCurrentButton] = useState<number>(0);

    const [editProfileModal, setEditProfileModal] = useState<boolean>(false);

    const bottomButtons = [
        {id: 0, name: "Tweets"},
        {id: 1, name: "Replies"},
        {id: 2, name: "Likes"}
    ]

    useEffect(() => {
        setUserProfile(user) 

        getLocalUserPosts().then((data) => {
            setUserPosts([...data].reverse())
            console.log()
        });
        console.log("Profile page draw")
    }, [user])

    return (<div className="flex flex-col w-screen">
        <div className="flex">
            <button onClick={() => navigate("/")}>{"Back"}</button>
        </div>
        <div className="flex justify-end items-end bg-red-100 min-h-[22vh]">
            <button className="m-3 p-1" onClick={() => {setEditProfileModal(true)}}>Edit profile</button>
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
                    <div className="flex p-3" key={item.id}>
                        <PostCard id={item.id} content={item.content} likes_count={item.likes_count} views_count={item.views_count} createdAt={item.createdAt} user={item.user}></PostCard>
                    </div>
                ))}
            </div>}
        </div>
        <BaseModal isOpen={editProfileModal} onClose={() => {setEditProfileModal(false)}}>
                <EditProfileForm onSave={() => {setEditProfileModal(false)}}></EditProfileForm>
        </BaseModal>
    </div>)
}