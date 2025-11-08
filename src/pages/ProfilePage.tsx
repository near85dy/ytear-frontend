import { useEffect, useState } from "react";
import type { UserProfile } from "../entity/user/model/types";


export default function ProfilePage() {

    const[userProfile, setUserProfile] = useState<UserProfile>();
    
    useEffect(() => {
        fetch(`http://localhost:3000/api/users/me`, {credentials: 'include'}).then((data) => {
            data.json().then((json) => {
                setUserProfile(json)
            });
        })
    })

    return (<div className="flex flex-col">
        <div>

        </div>
        <div>
            <button>Edit profile</button>
        </div>
        <div>
            <div>You</div>
            <div>@{userProfile?.username}</div>
        </div>
        <div>
            
        </div>
    </div>)
}