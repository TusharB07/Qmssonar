import { ICity } from "../city/city.model";
import { IPincode } from "../pincode/pincode.model";

export interface IClientGroup {
    _id?: string;
    vin: string;
    clientGroupName: string;
    clientGroupContactName: string;
    address: string;
    cityId: string | ICity;
    pincodeId: string | IPincode;
    email: string;
    active: boolean;
  }
  