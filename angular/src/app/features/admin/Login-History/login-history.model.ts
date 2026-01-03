import { IUser } from "../user/user.model";


export interface ILoginHistory {
    _id?: string;
    userId: string | IUser;
    loginEmail: String;
    loginPassword: String;
    createdAt: Date;
    updatedAt: Date
    status: String;
}
