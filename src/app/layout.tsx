import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import type { UserProfile } from '../entity/user/model/types';
import { useUser } from '../entity/user/model/selectors';

interface NavigationButton {
    name: string,
    path: string,
}

export default function Layout() 
{
    const [userData, setUserData] = useState<UserProfile>();

    const data = useUser();

    useEffect(() => {
        setUserData(data);
    }, [])

    const navButtons: NavigationButton[] = [
        {name: "Home", path: "/"},
        {name: "Messages", path: "/"},
        {name: "Profile", path: "/profile"},
        {name: "Settings", path: "/settings"},
    ]

    const trending: {topic: string, tag: string, tweets: number}[] = [{topic: "Technology x Trending", tag: "React 19", tweets: 128000}]

    return (
    <div>
        <div className='flex'>
            <div className='flex flex-col justify-between'>
                <nav className='flex flex-col'>
                    {navButtons.map((item) => (
                        <a className='flex p-2 my-2 hover:bg-red-100 text-black no-underline text-lg' href={item.path}>{item.name}</a>
                    ))}
                </nav>
                <div className='flex justify-end'>
                    <div className='flex'>
                        <img width={75} height={75} src='data:image/png;base64,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'></img>
                        <div className='flex flex-col'>
                            <p className='m-0'>You</p>
                            <p className='m-0'>@{userData?.username}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-screen w-px bg-gray-300 w-1"></div>
                <Outlet></Outlet>
            <div className="h-screen w-px bg-gray-300 w-1"></div>
            <div>
                <div>
                    <input className='rounded-md bg-gray-400 text-white border-none p-1 text-xl my-4' placeholder='search'/>
                </div>
                <div className='flex flex-col border-solid border rounded-md'>
                    <p className='font-bold m-4 text-xl'>Trending Now</p>
                    <div className='flex flex-col m-2 gap-2'>
                    {trending.map((item) => (
                        <div key={item.tag} className='flex flex-col'>
                            <div>{item.topic}</div>
                            <div>#{item.tag}</div>
                            <div>{item.tweets}</div>
                        </div>
                    ))}
                    </div>
                </div>
                <div>

                </div>
                <div>

                </div>
            </div>
        </div>
    </div>)
}