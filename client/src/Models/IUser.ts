export interface IUser {
    email: string;
    _id: string;
    role: string;
}

export interface IUserState {
    user: IUser | null;
    token: string | null;
    loading: string;
    error: string;
}

export interface IAuthResponse {
    user: IUser;
    token: string;
}

export interface IUserProfile {
    _id: string,
    role: string,
    email: string,
    created_date: string,
    imgUrl: string
}

export interface IUserRegister {
    email: string;
    password: string;
    role: string;
}

export interface IUserLogin {
    email: string;
    password: string;
}
