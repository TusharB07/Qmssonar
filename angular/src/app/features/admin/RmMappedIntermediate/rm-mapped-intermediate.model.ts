import { IPartner } from "../partner/partner.model";
import { IUser } from "../user/user.model";

export interface RmMappedIntermediate{
    _id?: string;
    intermediatePartnerId:  | IPartner;
    partnerId: string | IPartner;
    rmUserId: string | IUser;
    rmEmail: string;
    active: boolean;
}