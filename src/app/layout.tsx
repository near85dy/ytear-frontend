import { useEffect, useState, type ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import type { UserProfile } from '../entity/user/model/types';
import { getLocalUser } from '../entity/user/api/api';
import { useUserStore } from '../entity/user/model/store';
import { BaseModal } from '../shared/BaseModal';
import PostForm from '../features/posts/ui/PostFormModal';
import { CiChat1, CiCirclePlus, CiHome, CiSettings, CiUser } from 'react-icons/ci';
import UserImage from '../entity/user/ui/UserImage';

interface NavigationButton {
    name: string,
    path: string,
    action?: () => void,
    element?: ReactNode
}

export default function Layout() 
{
    const navigate = useNavigate();
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);
    const removeUser = useUserStore((r) => r.clearUser)

    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [postFormModal, setPostFormModal] = useState<boolean>(false);

    useEffect(() => {
        console.log("layout loaded")
        if(!user)
        {
            getLocalUser().then((response) => {
                if(!response)
                {
                    navigate("/login")
                    removeUser();
                    return;
                }
                setUser(response)
            })
        }
        else
        {
            setUserData(user);
        }
    }, [user])

    const onCreatePost = () => {
        setPostFormModal(true);
    }

    const iconsSize = 40;
    const iconsStyles = "px-1"
    
    const navButtons: NavigationButton[] = [
        {name: "Home", path: "/", element: <CiHome size={iconsSize} className={iconsStyles}/>},
        {name: "Messages", path: "/messages", element: <CiChat1 size={iconsSize} className={iconsStyles}/>},
        {name: "Create post", path: "", action: onCreatePost, element: <CiCirclePlus size={iconsSize} className={iconsStyles}/>},
        {name: "Profile", path: "/profile", element: <CiUser size={iconsSize} className={iconsStyles}/>},
        {name: "Settings", path: "/settings", element: <CiSettings size={iconsSize} className={iconsStyles}/>},
    ]

    const trending: {topic: string, tag: string, tweets: number}[] = [{topic: "Technology x Trending", tag: "React 19", tweets: 128000}]

    return (
    <div>
        <div className='flex flex-col md:flex-row'>
            <div className='hidden sticky flex-col h-screen left-0 top-0 md:block'>
                <div className='flex flex-col h-screen justify-between'>
                    <nav className='flex flex-col'>
                        {navButtons.map((item) => (
                            !item.action && <button key={item.name} onClick={() => navigate(item.path)} className='flex items-center p-2 my-2 border-none hover:bg-red-100 text-black no-underline text-lg '>{item.element}{item.name}</button>
                        ))}
                    </nav>
                    <div className='flex flex-col justify-end gap-8 p-5'>
                        <div className=''>
                            <button onClick={() => {setPostFormModal(true)}} className='flex my-4 p-3 px-12 bg-purple-600 border-none rounded-lg text-white hover:bg-purple-700'>Tweet</button>
                        </div>
                        <div className='flex'>
                            {userData?.image && <UserImage url={userData?.image!}/>}
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
            <div className='flex w-screen md:w-[50vw]'>
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
                {navButtons.map((item) => (
                    <button key={item.name} className='flex-1' onClick={() => {
                        if (item.action) {
                        item.action();
                        }
                        if (item.path) {
                            navigate(item.path);
                        }
                    }}>{item.element}</button>
                ))}
        </div>
        <BaseModal isOpen={postFormModal} onClose={() => {setPostFormModal(false)}}>
            <PostForm></PostForm>
        </BaseModal>
    </div>)
}