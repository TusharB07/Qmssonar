import { ITaskQueue } from "../task-queue/task-queue.model";

export interface ITask {
    _id?: string;
    retryCount: Number;
    retryInterval: Number;
    state: string;
    price: Number;
    taskQueueId?: string | ITaskQueue;
    startTime: Date;
    createdAt: Date;
    endTime: Date;
    elapsedMillis: Number;
    inputBody: string;
    outputBody: string;
    errorBody: string;
    parentDocumentId?: string | ITask;
    parentDocumentModel?: string;
}
export const AllowedTaskStates = [

    "pending",
    "scheduled", 
    "started", 
    "retry", 
    "retrying",
    "failed",
    "succeeded",
] 