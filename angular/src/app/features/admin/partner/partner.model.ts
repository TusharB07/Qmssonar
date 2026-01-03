import { ICity } from "../city/city.model";
import { ICountry } from "../country/country.model";
import { IDistrict } from "../district/district.model";
import { IPincode } from "../pincode/pincode.model";
import { IState } from "../state/state.model";
import { IUser } from "../user/user.model";

export interface IMappedRmEmail {
    email: string;
    toShow:boolean
}

export interface IMappedRmEmailICName {
    name: string;
    mappedRmEmails: IMappedRmEmail[]
    isAutoAssignActive:boolean
    brokerAutoFlowStatus:boolean
}

export interface IRmMappedIntermediate {
    _id?: string;
    intermediatePartnerId: string | IPartner;
    rmUserId: string | IUser;
    rmEmail: string;
    active: boolean;
}

export interface IMappedICName {
    icPartnerId: string;
}
export interface IPartner {
    _id?: string;
    partnerType?: AllowedPartnerTypes;
    name: string;
    shortName: string;
    address: string;

    cityId: string | ICity;
    districtId: string | IDistrict;
    stateId: string | IState;
    pincodeId: string | IPincode;
    countryId: string | ICountry;

    pan: string;
    gstin: string;
    cin: string;
    logo: string;
    mappedIcNames: IMappedICName[];

    // SPOC: single point of contact.
    contactPerson: string;
    designation: string;
    mobileNumber: string;
    status: boolean;
    underwriterMappingFlag: boolean;
    vendorName: string;
    vendorCode: string;
    agentCode: string,
    locationCount: number;
    isAutoAssignActive: boolean;
    concurrentSesssion: boolean;
    brokerModeStatus:boolean;
    brokerAutoFlowStatus:boolean;
    isRiskInspection:boolean;
    isRate:boolean;
    isBrokerMappedFromMaster:boolean;
}

export enum AllowedPartnerTypes {
    self = "self",
    insurer = "insurer",
    broker = "broker",
    agent = "agent",
    banca = "banca",
    corporateAgent = "corporate-agent",
}

export const OPTIONS_PARTNER_TYPES = [
    { label: "Self", value: "self" },
    { label: "Insurer", value: "insurer" },
    { label: "Broker", value: "broker" },
    { label: "Agent", value: "agent" },
    { label: "Banca", value: "banca" },
    { label: "Corporate Agent", value: "corporate-agent" }
];

export const OPTIONS_COLOR_SCHEMES = [
    { label: "light", value: "light" },
    { label: "dark", value: "dark" }
];
