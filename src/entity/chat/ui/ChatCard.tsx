import { useEffect, useState } from "react"
import UserImage from "../../user/ui/UserImage"
import type { ChatData } from "../model/types"
import type { UserProfile } from "../../user/model/types"
import { useUser } from "../../user/model/selectors"

interface ChatCardProps {
    chatData: ChatData
}

export default function ChatCard({ chatData }: ChatCardProps)
{
    const [companion, setCompanion] = useState<UserProfile | null>(null);

    const user = useUser();

    useEffect(() => {
        if(user.id == chatData.user1.id)
        {
            setCompanion(chatData.user1);
        }
        else
        {
            setCompanion(chatData.user2);
        }
    }, [])

    return(
        <>
            {companion && (
            <button className="flex flex-row w-full">
                <UserImage url={"main"}></UserImage>
                <div className="flex flex-col">
                    <div className="flex flex-row gap-1"> 
                        <div>{companion.name}</div>
                        <div>{companion.surname}</div>
                    </div>
                </div>
            </button>)}
        </>
    )
}