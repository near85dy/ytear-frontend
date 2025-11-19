import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { UserProfile } from '../entity/user/model/types';
import { useUser } from '../entity/user/model/selectors';
import { getLocalUser } from '../entity/user/api/api';
import { useUserStore } from '../entity/user/model/store';
import { BaseModal } from '../shared/BaseModal';
import PostForm from '../features/posts/ui/PostFormModal';
import { API_URL } from './env';

interface NavigationButton {
    name: string,
    path: string,
    action?: () => void,
}

export default function Layout() 
{
    const navigate = useNavigate();
    const setUser = useUserStore((s) => s.setUser);

    const [userData, setUserData] = useState<UserProfile>();
    const [postFormModal, setPostFormModal] = useState<boolean>(false);

    const data = useUser();

    useEffect(() => {
        getLocalUser().then((response) => {
            if(!response)
            {
                console.log(response)
                navigate("/login")
                return;
            }
            setUser(response)
        })
        setUserData(data);
    }, [])

    const onCreatePost = () => {
        setPostFormModal(true);
    }

    const navButtons: NavigationButton[] = [
        {name: "Home", path: "/"},
        {name: "Messages", path: "/"},
        {name: "Profile", path: "/profile"},
        {name: "Settings", path: "/settings"},
    ]

    const mobileButtons: NavigationButton[] = [        
        {name: "Home", path: "/"},
        {name: "Messages", path: "/"},
        {name: "Create post", path: "", action: onCreatePost},
        {name: "Profile", path: "/profile"},
        {name: "Settings", path: "/settings"},
    ]

    const trending: {topic: string, tag: string, tweets: number}[] = [{topic: "Technology x Trending", tag: "React 19", tweets: 128000}]

    return (
    <div>
        <div className='flex flex-col md:flex-row'>
            <div className='hidden sticky flex-col h-screen left-0 top-0 md:block'>
                <div className='flex flex-col h-screen justify-between'>
                    <nav className='flex flex-col'>
                        {navButtons.map((item) => (
                            <a key={item.name} className='flex p-2 my-2 hover:bg-red-100 text-black no-underline text-lg' href={item.path}>{item.name}</a>
                        ))}
                    </nav>
                    <div className='flex flex-col justify-end p-5'>
                        <div className=''>
                            <button onClick={() => {setPostFormModal(true)}} className='my-4 p-2 px-12 w-full'>Tweet</button>
                        </div>
                        <div className='flex'>
                            <img width={60} height={60} src={API_URL+"/storage/avatar/"+userData?.image}></img>
                            <div className='flex flex-col'>
                                <p className='m-0'>You</p>
                                <p className='m-0'>@{userData?.username}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex'>
                
            </div>
            <div className="hidden h-screen w-px bg-gray-300 w-1 md:block"></div>
            <div className='flex md:min-w-[40vw] w-screen'>
                <Outlet></Outlet>
            </div>
            <div className="hidden h-screen w-px bg-gray-300 w-1 md:block"></div>
            <div className='hidden sticky flex-col h-screen left-0 top-0 p-2 md:block'>
                <div>
                    <input className='rounded-md bg-gray-400 text-white border-none p-1 text-xl my-' placeholder='search'/>
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
        {/*  Mobile menu */}
        <div className='md:hidden fixed bottom-0 left-0 right-0 w-full h-16 flex z-40'>
                {mobileButtons.map((item) => (
                    <button key={item.name} className='flex-1'   onClick={() => {
                        if (item.action) {
                        item.action();
                        }
                        if (item.path) {
                        navigate(item.path);
                        }
                    }}>{item.name}</button>
                ))}
        </div>
        <BaseModal isOpen={postFormModal} onClose={() => {setPostFormModal(false)}}>
            <PostForm></PostForm>
        </BaseModal>
    </div>)
}