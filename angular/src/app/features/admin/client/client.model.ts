import { IDistrict } from './../district/district.model';
import { ICity } from "../city/city.model";
import { IPincode } from "../pincode/pincode.model";
import { IClientGroup } from "../client-group/client-group.model"
import { IClientKyc } from "../client-kyc/client-kyc.model";
import { IState } from "../state/state.model";
import { IClientLocation } from "../client-location/client-location.model";

export enum AllowedClientTypes {
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export enum AllowedKycTypes {
  PAN = 'PAN',
  AADHARCARD = 'aadharcard',
  VOTER = 'voter',
  DL = 'driving license',
  PASSPORT = 'passportno',
  CIN = 'CIN'
}

export enum AllowedGSTPercentage{
  GSTPERCENTAGE = 0.18
}

export interface IClient {
  _id?: string;
  clientType: AllowedClientTypes;
  name: string;
  shortName: string;
  active: Boolean;

  // Business Details
  clientGroupId: string | IClientGroup;
  pan: string;
  gst: string;
  copyOfPan: string;
  vin: string;
  leadGenerator: string;
  natureOfBusiness: string;
  creationDate: Date;
  claimsManager: string;
  referralRM: string;
  referredCompany: string;

  // Client Details
  employeeStrength: string;
  sameAddressVerification: Boolean;

//   contactPerson: string;
//   designation: string;
//   phone: string;
//   email: string;
//   mobile: string;
//   address: string;
//   stateId: string |IState;
//   cityId: string | ICity;
//   pincodeId: string | IPincode;
//   visitingCard: string;
  narration: string;
  clientKycMasterId: string | IClientKyc; // clientKycMasterId needs to be added in schema .
  headOfficeLocationId: string | IClientLocation
  salutation: string;
  // firstName: string;
  lastName: string;
  gender: string;
  contactNo: string;
  email: string;
  street: string;
  street2: string;
  street3: string;
  pincode: string | IPincode;
  cityId: string | ICity;
  districtId: string | IDistrict;
  stateId: string | IState;
  dateOfIncorporation: Date;
  kycType: string;
  kycNumber: string;
  apiDetails?: IApiDetails[];
  fgiClientId?: string;
  fgiCreateClient?: Boolean,
  varifiedKycNumber : string
}

export interface IApiDetails {
  isCKYC:Boolean;
  partnerId: {
    _id: string,
    name: string
  },
  quoteNo:string,
  proposalId:string,

}

export const OPTIONS_CLIENT_TYPES = [
    { label: 'Company', value: AllowedClientTypes.COMPANY },
    { label: 'Group', value: AllowedClientTypes.GROUP },
    { label: 'Individual', value: AllowedClientTypes.INDIVIDUAL },
]

export const OPTIONS_KYC_TYPES = [
  { label : 'Pan No' ,value : AllowedKycTypes.PAN},
  /* { label : 'Aadhar No' ,value : AllowedKycTypes.AADHARCARD},
  { label : 'Voter Id' ,value : AllowedKycTypes.VOTER},
  { label : 'Driving License' ,value : AllowedKycTypes.DL},
  { label : 'Passport No' ,value : AllowedKycTypes.PASSPORT}, */
]

export const OPTIONS_KYC_TYPES_FOR_COMPANY_AND_GROUP = [
  { label : 'Pan No' ,value : AllowedKycTypes.PAN},
  // { label : 'CIN' ,value : AllowedKycTypes.CIN}
]

export const OPTION_GENDER_LIST = [
  {label : 'Male', value : 'Male'},
  {label : 'Female' , value : 'Female'}
]

export interface  partnerId {
  _id: string,
  name: string
}

export interface  SectorId {
  _id: string,
  name: string
}

export interface  partproductPartnerIcConfigurationsnerId {
  productPartnerIcConfigurationId: {
    _id: string,
    name: string
  },
  _id: string,
  name: string
}

export interface  productId {
  categoryId:{
    _id: string,
    name: string
  }
  _id: string,
  name: string
}

