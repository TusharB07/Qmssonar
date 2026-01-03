import { IProduct } from "../product/product.model"
import { IRole } from "../role/role.model"
import { IUser } from "../user/user.model"

export interface IBrokerModuleMapping{
    _id:string,
    productId:string | IProduct,
    salesCreaterId:string | IUser,
    placementMakerId:string | IUser,
    placementCheckerId:string | IUser,
    fromSI:number,
    toSI:number
}