import { IState } from "../state/state.model";

export interface ICity {
  _id?: string;
  name: string;
  stateId: string | IState;
}
