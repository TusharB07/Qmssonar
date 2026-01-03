import { IProduct } from "../product/product.model";

export interface IProductWiseAge {
    _id?: string;
    productId: string | IProduct;
    fromAge:number;
    toAge:number;
    age:string;
    active: boolean;
}