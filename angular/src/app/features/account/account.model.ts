import { IUser } from "../admin/user/user.model";

export interface IAuthResponse {
  status: string;
  token: string;
  expires: number;
  data: {
    entity: IUser;
  };
}
