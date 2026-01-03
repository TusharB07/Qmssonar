import { Input } from "@angular/core";

export interface RsmD {
    label: any;
    value: string;
}
export interface ILov<V = string> {
    label: string;
    value: V;
    partnerType?: string;
    sumMin?: number;
    sumMax?: number;
    empMin?: number;
    empMax?: number;
    min? : number;
    max? : number;
    email? : string;
}

export interface ILovSI<V = string> {
    label: string;
    value: V;
    partnerType?: string
    siAmount:number;
}

export interface ILovSIDDL<V = string> {
    label: string;
    value: V;
    partnerType?: string
    siAmount:string;
}

export interface IManyResponseDto<T> {
    status: string;
    results?: number;
    data: {
        entities: T[];
    };
}

export interface IOneResponseDto<T> {
    status: string;
    data: {
        entities: any;
        entity: T;
    };
}



export interface IAppErrorEnvelope {
    status: string;
    message: string;
    stack: string;
    error: IAppError;
    data: any // For Sheet as Strucuted changed a bit
}

export interface IAppError {
    errors: string[];
    statusCode: number;
    status: string;
    name: string;
    message: string;
}

export type FormMode = "new" | "edit";

export const OPTIONS_REGEX = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneNumber: /^((\\+91-?)|0)?[0-9]{10}$/,
}

export type PermissionType = "create" | "read" | "update" | "delete";


export interface PFileUploadGetterProps {
    name: string,
    url: string,
    accept: "image/*" | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx' | "application/pdf",
    maxFileSize: number,
    method: 'post' | 'patch',
    mode?: 'basic',
    headers?: any,
    onUpload?: ($event) => void
    uploadLabel?: string,
    chooseLabel?: string,
    auto?: boolean,
}


export interface IBulkImportResponseDto {
    errorMessage?: string;
    downloadablePath: string;
}

// Implement permission Start --------------------------------------------------------------------
// Implement permission End --------------------------------------------------------------------


export interface ITatResponse {
    timestamp: number,
    diffMin: number,
    diffHour: number,
    diffDays: number,
}

