import { ICity } from "../city/city.model";
import { IClient } from "../client/client.model";
import { IPincode } from "../pincode/pincode.model";
import { IState } from "../state/state.model";

export interface IClientLocation {
    _id?: string;
    address: string;
    cityId: string | ICity;
    stateId: string | IState;
    pincodeId: string | IPincode;
    locationName: string;
    clientId: string | IClient;
    isHeadOffice: boolean;
  }
