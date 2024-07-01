export interface UserInterface {
    id?: number,
    username: string,
    name: string,
    email?: string,
    avatar_url?: string,
    status?: UserStatus,
    password: string,
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date
}

export enum UserStatus {
    OFFLINE = -1,
    AWAY = 0,
    ONLINE = 1
}