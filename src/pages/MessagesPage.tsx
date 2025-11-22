import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import ChatCard from "../entity/chat/ui/ChatCard";
import { getUserChats } from "../entity/chat/api/api";
import type { ChatData } from "../entity/chat/model/types";

export default function MessagesPage()
{
    const [messages, setMessages] = useState<ChatData[] | null>(null);
    const [chats, setChats] = useState<ChatData[] | null>(null);

    useEffect(() => {
        getUserChats().then((response) => {
            setChats(response as ChatData[] | null)
        })
        setMessages([])
    }, [])

    return (
    <div className="flex flex-row flex-1 h-screen">
        <div className="flex flex-col">
            <div>
                <h1>Messages</h1>
                <div className="flex flex-row p-1 bg-gray-200 rounded-md m-1 px-2">
                    <CiSearch size={20} className="my-1"/>
                    <input placeholder="Search messages" className="mx-1 bg-gray-200 focus:outline-none border-none border"></input>
                </div>
            </div>
            <div className="flex flex-col">
                {chats && chats.map((item) => (
                    <div key={item.id}>
                        <ChatCard chatData={item}></ChatCard>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex">
            {messages && messages.map((item) => (
                <div key={item.id}>
                </div>
            ))}
        </div>
    </div>)
}