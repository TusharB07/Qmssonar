import { IProduct } from "../product/product.model";

export interface IRiskManagementFeatures {
    _id?: string;
    name: string;
    productId: string | IProduct;
}

export interface IQuoteRiskManagementFeatures {
    quoteId: string,
    quoteLocationOccupancyId: string,
    riskManagementFeatureId: string | IRiskManagementFeatures,
    originalQuoteLocationRiskManagementId: string,
}


export interface IQuoteLocationRiskManagement {
    checkbox: boolean,  // True for Riskmangement is selected|False
    riskManagementId: string | IRiskManagementFeatures,
    name: string,
    quoteLocationOccupancyId: string
  }
