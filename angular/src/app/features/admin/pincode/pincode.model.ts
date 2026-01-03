import { ICity } from "../city/city.model";
import { ICountry } from "../country/country.model";
import { IDistrict } from "../district/district.model";
import { IState } from "../state/state.model";

export interface IPincode {
  _id?: string;
  name: string;
  districtId: string | IDistrict;
  cityId: string | ICity;
  stateId: string | IState;
  countryId: string | ICountry;
  earthquakeZone: string;
  active: boolean
}

export const OPTIONS_EARTHQUAKE_ZONES = [
  { label: "I", value: "I" },
  { label: "II", value: "II" },
  { label: "III", value: "III" },
  { label: "IV", value: "IV" },
];