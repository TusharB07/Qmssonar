import { ICity } from "../city/city.model";
import { IPincode } from "../pincode/pincode.model";
import { IState } from "../state/state.model";
import { IClient } from "../client/client.model";

export interface IClientContact {
  _id?: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
//   mobile: string;
  address: string;
  stateId: string | IState;
  cityId: string | ICity;
  pincodeId: string | IPincode;
  visitingCard: string;
  clientId: string | IClient;
}
