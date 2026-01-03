import { IUser } from "src/app/features/admin/user/user.model";

export interface IDiff {
  old?: any;
  new?: any;
}

export interface IDiffHistory {
  _id?: string;
  eventType: string;
  collectionId: string;
  collectionName: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  diff: {
    [s: string]: IDiff;
  };
  user: IUser;
}
