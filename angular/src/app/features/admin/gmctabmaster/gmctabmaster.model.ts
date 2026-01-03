import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IGmcSubTabs } from "../quote/quote.model";

export interface IGmcTabMaster {
    _id?: string;
    createdBy: string;
    createdDate: Date;
    deletedBy: string;
    modifiedBy: string;
    parentTabName: string;
    isAllowOverwrite: boolean;
    isDeleted: boolean;
    gmcSubTab: IGmcSubTabs[];
    identity: string;
    taskStatus: AllowedTaskStatus;
    failedMessage: string;
    productId: string;
}