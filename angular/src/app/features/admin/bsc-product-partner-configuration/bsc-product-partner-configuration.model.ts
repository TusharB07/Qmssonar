import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IBscProductPartnerConfiguration {

    _id?: string;

    productId: string | IProduct;
    partnerId: string | IPartner;

    bscAccompaniedBaggageCover: Boolean;
    bscBurglaryHousebreakingCover: Boolean;
    bscElectronicEquipmentsCover: Boolean;
    bscFidelityGuaranteeCover: Boolean;
    bscFireLossOfProfitCover: Boolean;
    bscFixedPlateGlassCover: Boolean;
    bscLiabilitySectionCover: Boolean;
    bscMoneySafeTillCover: Boolean;
    bscMoneyTransitCover: Boolean;
    bscPortableEquipmentsCover: Boolean;
    bscSignageCover: Boolean;

    floaterCoverAddOn: Boolean;
    declarationPolicy: Boolean;
    loseOfRent: Boolean;
    rentForAlternativeAccomodation: Boolean;
    personalAccidentCover: Boolean;
    valuableContentsOnAgreedValueBasis: Boolean;

    active: boolean
}
