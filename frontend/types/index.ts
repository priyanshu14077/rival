export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    summary?: string;
    coverImage?: string;
    isPublished: boolean;
    userId: string;
    user: User;
    likesCount?: number;
    commentsCount?: number;
    hasLiked?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Like {
    id: string;
    userId: string;
    blogId: string;
    createdAt: string;
}

export interface Comment {
    id: string;
    content: string;
    userId: string;
    blogId: string;
    user: User;
    createdAt: string;
    updatedAt: string;
}
