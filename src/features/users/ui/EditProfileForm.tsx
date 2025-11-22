import { useEffect, useState } from "react";
import { useUser } from "../../../entity/user/model/selectors"
import type { UserProfile } from "../../../entity/user/model/types";
import { updateUserProfileData, uploadUserAvatar } from "../api/api";
import { useUserStore } from "../../../entity/user/model/store";
import { getLocalUser } from "../../../entity/user/api/api";

interface EditProfileProps {
  onSave: () => void;
}

export default function EditProfileForm(props: EditProfileProps)
{
    const user = useUser();
    const setUser = useUserStore((s) => s.setUser)

    const [userProfile, setUserProfile] = useState<UserProfile>(user);
    const [avatar, setAvatar] = useState<File | null>(null);

    useEffect(() => {

    }, [])

    const handleChange = (field: keyof UserProfile, value: any) => {
        setUserProfile({...user, [field]: value});
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;
        setAvatar(e.target.files[0])
        setUser({...userProfile, avatar: e.target.files[0]})
    }

    const onSave = async () => {
        if(avatar)
        {
            const response = await uploadUserAvatar(avatar);
            setUserProfile({...userProfile, avatar: response.id})
        } 
        await updateUserProfileData(userProfile)
        const response = await getLocalUser();
        setUser(response)
        console.log(response)
        props.onSave();
    }


    return (<div className="flex flex-col gap-4">
        <input type="file" accept="image/*" onChange={handleAvatarChange}></input>
        {avatar && <img width="90" src={URL.createObjectURL(avatar)}></img>}
        <input value={userProfile.name} onChange={(e) => {handleChange("name", e.target.value)}} className="flex w-52"></input>
        <input value={userProfile.surname} onChange={(e) => {handleChange("surname", e.target.value)}} className="flex w-52"></input>
        <input type="date" value={userProfile.birthday} onChange={(e) => {handleChange("birthday", e.target.value)}} className="fa w-52"></input>
        <button className="flex flex-col" onClick={onSave}>Save</button>
    </div>)
}