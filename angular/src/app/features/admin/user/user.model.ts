import { ICity } from "../city/city.model";
import { ICountry } from "../country/country.model";
import { IDistrict } from "../district/district.model";
import { IPartner } from "../partner/partner.model";
import { IPincode } from "../pincode/pincode.model";
import { IDiscountRule } from "../product-partner-ic-configuration/product-partner-ic-configuration.model";
import { IRole } from "../role/role.model";
import { IState } from "../state/state.model";

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

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    userEmail?: string;
    mobileNumber?: string;
    role: string;
    roleId: string | IRole;
    userRole?: string;
    photo?: string;
    password: string;
    passwordConfirm: string;
    active: boolean;
    zone?: number;
    age?: number;
    configSidebarIsOpen: boolean;
    configMenuType: string;
    configColorScheme: string;
    configRippleEffect: boolean;
    passwordChangedAt?: Date;
    passwordExpiresAt?: Date;
    partnerId?: string | IPartner;
    underWriterLevel?: number;
    isLocked?: boolean;
    attemptCount?: number
    branchCode?: string;
    branchName?: string;
    staffCode?: number;
    vendorName?: string;
    agentCode?: string
    branchId?: string;

    address: string;
    cityId: string | ICity;
    districtId: string | IDistrict;
    stateId: string | IState;
    pincodeId: string | IPincode;
    countryId: string | ICountry;
    lastLogin?:Date;
    mappedPlacementUsers?:any[];
}

export const OPTIONS_ROLES = [
    { label: "Admin", value: "admin" },
    { label: "Operations", value: "operations" },
    { label: "Insurer Admin", value: "insurer_admin" },
    { label: "Insurer Underwriter", value: "insurer_underwriter" },
    { label: "Insurer Rm", value: "insurer_rm" },
    { label: "Broker Admin", value: "broker_admin" },
    { label: "Broker Rm", value: "broker_rm" },
    { label: "Broker Creator", value: "broker_creator" },
    { label: "Broker Approver", value: "broker_approver" },
    { label: "Agent", value: "agent" },
    { label: "Banca Admin", value: "banca_admin" },
    { label: "Banca Rm", value: "banca_rm" },
    { label: "Banca Creator", value: "banca_creator" },
    { label: "Banca Approver", value: "banca_approver" },
    { label: "Sales Creator", value: "sales_creator" },
    { label: "Sales Approver", value: "sales_approver" },
    { label: "Placement Creator", value: "placement_creator" },
    { label: "Placement Approver", value: "placement_approver" },
];

export const OPTIONS_MENU_TYPES = [
    { label: "Static", value: "static" },
    { label: "Overlay", value: "overlay" },
    { label: "Slim", value: "slim" },
    { label: "Sidebar", value: "sidebar" },
    { label: "Horizontal", value: "horizontal" }
];

export const OPTIONS_COLOR_SCHEMES = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" }
];
