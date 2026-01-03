import { ICountry } from "../country/country.model";

export interface IState {
  _id?: string;
  name: string;
  stateCode: string;
  countryId: string | ICountry;
}
