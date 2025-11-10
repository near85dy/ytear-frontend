
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
    return (<div className="flex gap-6" key={props.id}>
        <img width={50} height={50} src={`${"http://77.93.9.99:3000"}/api/storage/avatar/` + props.user.image}></img>
        <div className="flex flex-col">
            <div className="flex gap-3 propss-center">
                <div>{props.user.name} {props.user.surname}</div>
                <div className="flex propss-center justify-between">
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