import { ILov } from "src/app/app.model";

export interface IGmcCoverages {
    _id?: string;
    type: string;
    status: boolean;
}

export enum AllowedGMCCoverages {
    BLUS = 'BLUS',
    FIRE = 'FIRE',
    IAR = 'IAR',
    GMC = 'GMC',
    MARINE = "MARINE"
}

export const OPTIONS_PRODUCT_TEMPLATES: ILov[] = [
    { label: 'BLUS', value: AllowedGMCCoverages.BLUS },
    { label: 'FIRE', value: AllowedGMCCoverages.FIRE },
    { label: 'IAR', value: AllowedGMCCoverages.IAR },
    { label: 'GMC', value: AllowedGMCCoverages.GMC },
    { label: 'MARINE', value: AllowedGMCCoverages.MARINE },
]

//GMC - Soham Interface
export interface IGMCLableValuev<V = string> {
    label: string;
    value: V;
}