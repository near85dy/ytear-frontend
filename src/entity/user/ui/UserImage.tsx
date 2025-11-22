import { API_URL } from "../../../app/env";

interface UserImageProps {
    url: string,
}

export default function UserImage({url}: UserImageProps) {
    return (
        <img width={50} className="rounded-full" src={`${API_URL}/storage/avatar/${url}`}/>
    )
}