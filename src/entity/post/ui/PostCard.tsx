import UserImage from "../../user/ui/UserImage"

interface PostProps {
    id: string,
    content: string,
    createdAt: string,
    likes_count: number,
    views_count: number,
    user: {
        id: string,
        username: string,
        image: string,
        name: string,
        surname: string
    }
}

export default function PostCard(props: PostProps) {
    return (<div className="flex gap-6 w-full" key={props.id}>
        <div className="flex items-center justify-center">
            <UserImage url={props.user.image}></UserImage>
        </div>
        <div className="flex flex-col flex-1">
            <div className="flex gap-3 items-center">
                <div>{props.user.name} {props.user.surname}</div>
                <div className="flex items-center justify-between flex-1">
                    <div className="text-xs">@{props.user.username}</div>
                    <div>{props.createdAt.split("T")[1].split("Z")[0].split(".")[0]}</div>
                </div>
            </div>
            <div>{props.content}</div>
            <div className="flex flex-row gap-2">
                <div>Views: {props.views_count}</div>
                <div>Likes: {props.likes_count}</div>
            </div>
        </div>
    </div>)
}