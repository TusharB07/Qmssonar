import { IPartner } from "../partner/partner.model";

export interface IICRMContact {
    _id?: string;
    icPartnerId: string | IPartner
    rmName: string;
    rmEmail: string;
    active: boolean;
    mobileNo: Number;
}
