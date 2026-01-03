export enum AllowedStates {
    OPEN = "Open",
    CLOSED = "Closed",
}
export enum AllowedQueryType {
    INTERNAL = "Internal",
    EXTERNAL = "External",
}

export interface IQueryManagement {
  _id?: string;
  quoteId: string;
  state: AllowedStates;
  assignedTo: string
  comment: string;
  attachment?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
  repliedUserId?: string;
  queryHeader: String;
  queryType: AllowedQueryType;
  readFlage: boolean
}