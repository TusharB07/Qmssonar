export interface ICategoryProductMaster {
    _id?: string;
    name: string;
}

export interface IQuoteRiskManagementFeatures {
    quoteId: string,
    quoteLocationOccupancyId: string,
    riskManagementFeatureId: string | ICategoryProductMaster,
    originalQuoteLocationRiskManagementId: string,
}


export interface IQuoteLocationRiskManagement {
    checkbox: boolean,  // True for Riskmangement is selected|False
    riskManagementId: string | ICategoryProductMaster,
    name: string,
    quoteLocationOccupancyId: string
  }
