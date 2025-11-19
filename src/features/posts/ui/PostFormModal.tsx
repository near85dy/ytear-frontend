import { useState } from "react";
import { useUser } from "../../../entity/user/model/selectors";
import { API_URL } from "../../../app/env";
import { createPost } from "../api/api";
import { useNotify } from "../../../shared/NotificationProvider";


export default function PostForm()
{
    const user = useUser();
    const notify = useNotify();

    const [content, setContent] = useState<string>("");

    useState(() => {
        console.log(user.image)
    })

    const onPost = () => {
        if(!content) return notify("No content found");

        createPost({content}).then((response) => {
            if(response.ok)
            {
                window.location.reload();
            }
            else {
                
            }
        })
    }

    return (
        <div className="flex flex-col bg-gray-100 p-4">
            <div className="flex flex-row">
                <div>
                    <img width={"60"} src={API_URL+"/storage/avatar/"+user.image}></img>
                </div>
                <input value={content} onChange={(e) => setContent(e.target.value)} className="flex justify-start items-start w-full"/>
            </div>
            <div className="flex justify-between">
                <div>
                    <button>Image</button>
                    <button>Emoji</button>
                </div>
                <button onClick={onPost}>Post</button>
            </div>
        </div>
    )
}