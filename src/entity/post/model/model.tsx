
export interface Post {
    id: string,
    userId: string,
    content: string,
    likes_count: number,
    views_count: number,
    comments: number,
    user: {
        id: string,
        name: string,
        surname: string,
        image: string,
        username: string,
    }
    createdAt: string
}