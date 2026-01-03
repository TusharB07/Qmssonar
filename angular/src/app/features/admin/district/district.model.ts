import { IState } from "../state/state.model";

export interface IDistrict {
  _id?: string;
  name: string;
  stateId: string | IState;
}
