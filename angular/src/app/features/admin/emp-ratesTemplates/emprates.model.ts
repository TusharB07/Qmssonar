import { IProduct } from "../product/product.model";

export interface IEmpRates {
    _id?: string;
    countFrom:number;
    countTo:number;
    employeesCount: string;
    productId: string | IProduct;
    //effectiveStartDate: Date;
    status:boolean; 
    employeesCountId:string;
    SIRatesData:ICountSIRates[];
}
export interface ICountSIRates
{
sumInsured:number;
sumInsuredId:string;
siRates:IRates[];
}

export interface IRates
{
relation: string;
ageFrom:number;
ageTo:number;
ageband: string;
agebandId:string;
premium:number;
}