import { IDeteriorationofStocksinBCover } from './../../quote/blus_bsc_dialogs/deteriorationof-stocksin-b-form-dialog/deteriorationof-stocksin-b-form-dialog.component';
import { ITenantLegalLiabilityCover } from './../../quote/blus_bsc_dialogs/tenants-legal-liability-form-dialog/tenants-legal-liability-form-dialog.component';
import { ILov, ITatResponse } from "src/app/app.model";
import { IQuoteDiscount } from "../../quote/components/configure-discount-dialoge/configure-discount-dialoge.model";
import { IAddOnCover } from "../addon-cover/addon-cover.model";
import { IBscAccompaniedBaggage } from "../bsc-accompanied-baggage/bsc-accompanied-baggage.model";
import { IBscBurglaryHousebreakingCover } from "../bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model";
import { IBscElectronicEquipmentsCover } from "../bsc-electronic-equipment/bsc-electronic-equipment.model";
import { IBscFidelityGuranteeRiskType } from "../bsc-fidelity-gurantee-risk-type/bsc-fidelity-gurantee-risk-type.model";
import { IBSCFidelityGurantee } from "../bsc-fidelity-gurantee/bsc-fidelity-gurantee.model";
import { IBscFireLossOfProfitCover } from "../bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model";
import { IBscFixedPlateGlassCover } from "../bsc-fixed-plate-glass/bsc-fixed-plate-glass.model";
import { IBscLiability } from "../bsc-liability/bsc-liability.model";
import { IBscMoneySafeTillCover } from "../bsc-money-safe-till/bsc-money-safe-till.model";
import { IBscMoneyTransitCover } from "../bsc-money-transit/bsc-money-transit.model";
import { IBscAllRisks, IBscPortableEquipments } from "../bsc-portable-equipments/bsc-portable-equipment.model";
import { IBscPedalCycle, IBscSignage } from "../bsc-signage/bsc-signage.model";
import { IClient } from "../client/client.model";
import { IDeclarationPolicy } from "../declaration-policy-cover/declaration-policy-cover.model";
import { IExclusion } from "../exclusion/exclusion.model";
import { IFireFloaterCoverAddOn } from "../fire-floater-addon-cover/fire-floater-addon-cover.model";
import { IFloaterCoverAddOn } from "../floater-cover-addon/floater-cover-addon.model";
import { AllowedLovReferences, IWCListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { ILossOfRent } from "../loss-of-rent-cover/loss-of-rent-cover.model";
import { IMachineryELectricalBreakDownCover } from "../machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.model";
import { IMachineryLossOfProfitCover } from "../machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.model";
import { IOccupancyRate } from "../occupancy-rate/occupancy-rate.model";
import { IMappedRmEmailICName, IPartner } from "../partner/partner.model";
import { IPersonalAccidentCover } from "../personal-accident-cover/personal-accident-cover.model";
import { IPincode } from "../pincode/pincode.model";
import { AllowedOtcTypes, IProductPartnerIcConfigration, OPTIONS_ALLOWED_TYPES } from "../product-partner-ic-configuration/product-partner-ic-configuration.model";
import { AllowedProductBscCover, IProduct, OPTIONS_PRODUCT_BSC_COVERS } from "../product/product.model";
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IRentForAlternativeAccomodation } from "../rent-for-alternative-accomodation-cover/rent-for-alternative-accomodation-cover.model";
import { IQuoteLocationRiskManagement, IQuoteRiskManagementFeatures, IRiskManagementFeatures } from "../risk-management-features/risk-management-features.model";
import { ISector } from "../sector/sector.model";
import { ISubjectivity } from "../subjectivity/subjectivity.model";
import { IValuableContentsOnAgreedValue } from "../valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.model";
import { IWarranty } from "../warranty/warranty.model";
import { GradedForm, GradedFormMultiple, IGMCTemplate } from "../gmc-master/gmc-master-model";
import { IClauses } from "../Marine/ClausesMaster/clauses.model";
import { IWCCoverageType } from "../wc-coverage-type/wc-coverage-type.model";
import { IBscWorkmenCompensation } from "../bsc-workmen_compensation/bsc-workmen_compensation.model";
import { IThirdPartyLiabilityCover } from "../../quote/blus_bsc_dialogs/third-party-liability-form-dialog/third-party-liability-form-dialog.component";
import { IRemovalOfDebrisCover } from '../../quote/blus_bsc_dialogs/removal-of-debris-form-dialog/removal-of-debris-form-dialog.component';
import { IProtectionAndPreservationOfProperty } from '../../quote/blus_bsc_dialogs/protection-and-preservation-of-property-form-dialog/protection-and-preservation-of-property-form-dialog.component';
import { IAdditionalCustomDutyCover } from '../../quote/blus_bsc_dialogs/additional-custom-duty-form-dialog/additional-custom-duty-form-dialog.component';
import { IAccidentalDamageCover } from '../../quote/blus_bsc_dialogs/accidental-damage-form-dialog/accidental-damage-form-dialog.component';
import { IClaimPreparationCostCover } from '../../quote/blus_bsc_dialogs/claim-preparation-cost-form-dialog/claim-preparation-cost-form-dialog.component';
import { ICoverOfValuableContentsCover } from '../../quote/blus_bsc_dialogs/cover-of-valuable-contents-form-dialog/cover-of-valuable-contents-form-dialog.component';
import { IKeysAndLocksCover } from '../../quote/blus_bsc_dialogs/keys-and-locks-form-dialog/keys-and-locks-form-dialog.component';
import { ILandscapingIncludingLawnsPlantShrubsOrTreesCover } from '../../quote/blus_bsc_dialogs/landscaping-including-lawns-plant-shrubs-or-trees-form-dialog/landscaping-including-lawns-plant-shrubs-or-trees-form-dialog.component';
import { IDeteriorationofStocksinACover } from '../../quote/blus_bsc_dialogs/deteriorationof-stocksin-a-form-dialog/deteriorationof-stocksin-a-form-dialog.component';
import { IEscalationCover } from '../../quote/blus_bsc_dialogs/escalation-form-dialog/escalation-form-dialog.component';
import { IEmiProtectionCover } from '../../quote/blus_bsc_dialogs/emi-protection-cover-form-dialog/emi-protection-cover-form-dialog.component';
import { IInsuranceOfAdditionalExpenseCover } from '../../quote/blus_bsc_dialogs/insurance-of-additional-expense-form-dialog/insurance-of-additional-expense-form-dialog.component';
import { IInvoluntaryBettermentCover } from '../../quote/blus_bsc_dialogs/involuntary-betterment-form-dialog/involuntary-betterment-form-dialog.component';
import { InitEditableRow } from 'primeng/table';
import { IUser } from '../user/user.model';

export enum AllowedQuoteStates {
    DRAFT = 'Draft',
    PENDING_REQUISTION_FOR_QUOTE = 'Pending Requisition For Quote',
    WAITING_FOR_APPROVAL = 'Waiting For Approval',
    SENT_TO_INSURER_RM = 'Sent To Insurance Company RM',
    UNDERWRITTER_REVIEW = 'Under Writter Review',
    QCR_FROM_UNDERWRITTER = 'QCR From Underwritter',
    PENDING_PAYMENT = "Pending Payment", // All
    PLACEMENT = 'Placement',
    POST_PLACED = 'post Quote',
    CANCELLED = 'Cancelled Quote',
    REJECTED = "Rejected",
    LOSS_QUOTE = "Loss Quote",
    POST_PLACEMENT = 'Post Placement'
}

export enum AllowedQuoteTypes {
    NEW = 'new',
    EXISTING = 'existing',
    ROLLOVER = 'rollover'
}


export enum AllowedMarineTypePolicy {
    SPECIFIC = "Specific",
    OPEN = "Open",
    CLOSE = "Close",
}

export const OPTIONS_MARINE_POLICY_TYPE = [
    { label: "Specific", value: AllowedMarineTypePolicy.SPECIFIC },
    { label: "Open", value: AllowedMarineTypePolicy.OPEN },
    { label: "Close", value: AllowedMarineTypePolicy.CLOSE },
];
export enum AllowedEmployeeTypes {
    ONROLEEMPLOYEES = 'On Role Employees',
    CONTRACTOREMPLOYEES = 'Contractors Employees',
}
export const OPTIONS_EMPLOYEETYPES = [
    { label: "On Role Employees", value: AllowedEmployeeTypes.ONROLEEMPLOYEES },
    { label: "Contractors Employees", value: AllowedEmployeeTypes.CONTRACTOREMPLOYEES },
];


export enum AllowedEmployeeDescription {
    SKILLED = 'Skilled',
    UNSKILLED = 'Unskilled',
    PARTIAL = 'Partial',
}
export const OPTIONS_EMPLOYEETDESCRIPTION = [
    { label: "Skilled", value: AllowedEmployeeDescription.SKILLED },
    { label: "Unskilled", value: AllowedEmployeeDescription.UNSKILLED },
    { label: "Partial", value: AllowedEmployeeDescription.PARTIAL },

];


export enum AllowedEBPolicyType {
    BASE = 'Base',
    TOP_UP = 'Top up',
    SUPER_TOP_UP = 'Super Top up',
    OPD = 'OPD',
    CRITICAL_ILLNESS = 'Critical Illness',
    GROUP_OVERSEAS_MEDICLAIM = 'Group Overseas Mediclaim',
    GPA = 'GPA',
    GTL = 'GTL',
}

export enum AllowedEBPlan {
    EMPLOYER_EMPLOYEE = 'Employer Employee',
    NON_EMPLOYER_EMPLOYEE = 'Non Employer Employee',
}

export const OPTIONS_POLICY_TYPE_EB = [
    { label: "Base", value: AllowedEBPolicyType.BASE },
    { label: "Top up", value: AllowedEBPolicyType.TOP_UP },
    { label: "Super Top up", value: AllowedEBPolicyType.SUPER_TOP_UP },
    { label: "OPD", value: AllowedEBPolicyType.OPD },
    { label: "Critical Illness", value: AllowedEBPolicyType.CRITICAL_ILLNESS },
    { label: "Group Overseas Mediclaim", value: AllowedEBPolicyType.GROUP_OVERSEAS_MEDICLAIM },
    { label: "GPA", value: AllowedEBPolicyType.GPA },
    { label: "GTL", value: AllowedEBPolicyType.GTL },
];

export const OPTIONS_PLAN_EB = [
    { label: "Employer Employee", value: AllowedEBPlan.EMPLOYER_EMPLOYEE },
    { label: "Non Employer Employee", value: AllowedEBPlan.NON_EMPLOYER_EMPLOYEE },
];


export interface IFgApiResponse {
    winNumber?: string;
    applicationNumber?: string;
    fgClientId?: string;
    fgReceiptNo?: string;
    policyNumber?: string;
    status?: string;
    failedApiNumber?: number;
}

export interface IQuoteSlip {
    qcrApproved: any;
    qcrApprovalRequested: boolean
    underwriterMappingFlag: IPartner;
    acceptedById: string | IUser;
    _id?: string;
    quoteNo: string;
    yearOfManufacturing?: string;
    articleType?: string;
    invoiceNumber?: string;
    articleContentValue?: string;
    acceptedBy: string;
    buttonVisible: boolean;
    acceptedByUnderwriter: string;
    underWriterLevel?: number;
    clientId: string | IClient; // Required
    quoteType: AllowedQuoteTypes; // Required
    sectorId: string | ISector; // Required
    productId: string | IProduct;
    attachmentURL?: string;
    renewalPolicyPeriod: string;
    insurredBusiness: string;
    quoteState: AllowedQuoteStates,
    pinnedQuoteAt: Date;
    status: string;
    deductiblesExcessPd: string;
    deductiblesExcessFlop: string;
    deductiblesExcessMblop: string;
    brokerage: string;
    rewards: string;
    quoteSubmissionDate: Date | string;
    targetPremium: number;
    preferredInsurer: string;
    existingBrokerCurrentYear: string;
    otherTerms: string;
    additionalInfo: string;
    claim1NoOfClaims: string;
    claim1Nature: string;
    approvedBy: string;
    approvedOn: Date;
    paymentEmailLinkTimestamp: string;
    createdBy: string;
    createdOn: Date;
    clientAddress: string;
    totalIndictiveQuoteAmt: number; // Total Premium
    totalIndictiveQuoteAmtWithGst: number
    claimYear1: number;
    claimToYear1: number;
    claim1PremiumPaid: number;
    claim1ClaimAmount: number;
    revNo: number;
    sameAsPremium: boolean;
    totalSumAssured: number;
    rejectedBy: string;
    rejectReason: string;
    productPartnerConfiguration: object;
    underwriterMappingId: string;
    originalQuoteId: string;
    originalPartnerId: string;
    originalIntermediateName: string;
    createdById: string;
    assignedToRMId: string;
    underWriter1: string;
    underWriter2: string;
    underWriter3: string;
    underWriter4: string;
    underWriter5: string;
    underWriter6: string;
    underWriter7: string;
    underWriter8: string;
    underWriter9: string;
    underWriter10: string;
    underWriter1Stage: String;
    underWriter2Stage: String;
    underWriter3Stage: String;
    underWriter4Stage: String;
    underWriter5Stage: String;
    underWriter6Stage: String;
    underWriter7Stage: String;
    underWriter8Stage: String;
    underWriter9Stage: String;
    underWriter10Stage: String;
    totalFireLossOfProfit: number;
    totalFixedPlateGlass: number;
    totalAccompaniedBaggage: number;
    totalBurglaryHouse: number;
    totalelectronicEquipment: number;
    totalFidelityGuarantee: number;
    totalLiabilitySection: number;
    totalMoneySafeTill: number;
    totalMoneyTransit: number;
    totalPortableEquipment: number;
    totalSignage: number;
    totalWorkmenCompensation: number;
    totalAllRisk: number;
    totalPedalCycle: number;
    totalFlexa: number;
    totalStfi: number;
    totalEarthquake: number;
    totalTerrorism: number;
    totalFloater: number,
    totalInbuiltAddonCover: number;
    totalDeclarationPolicy: number,
    totalLossOfRent: number,
    totalRentForAlternative: number,
    totalPersonalAccident: number,
    totalValuableContent: number,
    totalMachineryElectricalBreakDown: number;
    totalMachineryLossOfProfit: number;
    totalAccidentalDamage: number;
    totalClaimPreparationCost: number;
    totalCoverofValuableContents: number;
    totalKeysandLocks: number;
    totalLandscapingincludinglawnsplantshrubsortrees: number;
    totalProtectionandPreservationofProperty: number;
    totalRemovalOfDebris: number;
    totalTenantslegalLiability: number;
    totalThirdPartyLiability: number;
    totalAdditionalCustomDuty: number;
    totalDeteriorationofStocksinB: number;
    totalDeteriorationofStocksinA: number;
    totalEscalation: number;
    totalEMIProtectionCover: number;
    totalInsuranceofadditionalexpense: number;
    totalInvoluntarybettermen: number;
    totalFireFloater: number;
    totalQuoteLocationAddonCover: number;
    totalPDAddonCover: number;
    totalBIAddonCover: number;
    totalQuoteSI: number;
    totalQuoteSIExceeded: number
    // allBscArray?: IAllBscArray;
    brokerWiseQuotes?: IQuoteSlip[]
    insurerProcessedQuotes?: IQuoteSlip[];
    mappedIcNames: IMappedRmEmailICName[];
    riskStartDate: Date;
    riskValidateDate: Date;
    clientPan: String;
    nextunderWriters: Array<any>;
    lastunderWriters: String;

    hypothications: IHypothication[];

    insurerDetails: IInsurerDetails[];

    allCoversArray: IAllCoversArray;

    locationBasedCovers: ILocationBasedCovers;

    bscProductPartnerConfiguration: IBscProductPartnerConfiguration;
    productPartnerIcConfigurations: [
        {
            productPartnerIcConfigurationId: IProductPartnerIcConfigration
        }
    ];
    crmId: string;

    isOtc: boolean
    discountId: string | IQuoteDiscount;

    otp: Number;
    otpExpiresAt: Date;
    otpVerifiedAt: Date;
    offlineVerificationFormUrl: string

    paymentMode?: 'online' | 'offline';

    paymentOfflineDraweeBank?: string;
    paymentOfflineInstrumentTransferCode?: string;
    paymentOfflineReceivedAt?: Date;

    paymentOnlinePaymentGatewayTransactionId?: string;
    paymentOperationAssignAt: Date;
    instrumentType: string;
    chequeNo: string;
    bankName: string;
    ifscCode: string;
    branchName: string;

    paymentEmailUrlEncryptedData: string;

    paymentStatus: string;

    partnerId: string;

    isIcRates: boolean;
    quoteSlipGenerationRequested: boolean;

    otcType: AllowedOtcTypes;
    nonOtcBreachedValue?: string;

    selectedAllowedProductBscCover: AllowedProductBscCover[];
    createdAt: Date;
    updatedAt: Date;

    placedIcQuoteId: IQuoteSlip

    stageWiseTat: IQuoteStageWiseTat
    brokerCalculatedPremium: number

    approvedById: string
    fgApiResponse: IFgApiResponse;

    //Intergation-EB [Start]
    employeeDataId: string | IQuoteEmployeeData
    gmcTemplateDataId: string | IQuoteGmcTemplate
    wcRatesDataId: string | IQuoteWCRatesFileUploadData
    wcTemplateDataId: string | IWCTemplate
    liabilityTemplateDataId: string | IDANDOTemplate
    liabilityEandOTemplateDataId: string | IEandOTemplate
    liabilityCGLTemplateDataId: string | ICGLTemplate
    liabilityProductTemplateDataId: string | IProductLiabilityTemplate

    //Intergation-EB [End]

    //MARINE
    marinePolicyType: string;
    marineDataId: string | IMarineTemplate

    isCobroker: boolean
    coBrokers: ICoBroker[]

    isCoInsurer: boolean;
    coInsurers: IcoInsurers[]
    //D&O
    dollarRate: number
    selectedCurrency: string

    //Product Liability
    parentQuoteId: string;
    expiredTermPremium: number;
    totalOpt1: number;
    totalOpt2: number;
    totalOpt3: number;
    totalOpt4: number;

    //Quote Option
    allQuoteOption: IQuoteOption

    aiDocument?: string
    qcrVersion: number;
    assignedToPlacementCheckerId: string;
    assignedToPlacementMakerId: string;
    placementCreatedById: string;
    pushedBackToId: string;
    insuredBusiness: string;
    qcrApprovedRequested: boolean;
    quoteSlipApprovalRequested: boolean;
    placementApproved: any;
    // qcrApproved: any

    ebPolicyType: string
    ebPlan: string //Required
    ctcLink: string //Required
    baseQuoteNo: string //Required
    insurersAllowedToEditQCR: IPartner[]
}

export interface IQuoteStageWiseTat {
    startedRequisitionAt?: ITatResponse,
    sentForApproval?: ITatResponse
    sentToInsurer?: ITatResponse
    receivedFromInsurer?: ITatResponse
    procededForPayment?: ITatResponse
    quotePlaced?: ITatResponse
}

export interface ICoBroker {
    companyName: string
    share: number
}

export interface IcoInsurers {
    _id?: string
    companyName: string
    share: number
    cityOfIssuingOffice: string
    isLead: boolean
    divisionOffice: string
}

//Intergation-EB [Start]

export class GmcGradedSI {
    grade: string = ""
    siAmount: ILov;
}

export interface IQuoteEmployeeData {
    _id?: string;
    employeeData: string | IEmployeeData[];
    quoteId: string | IQuoteSlip;
    filePath: string;
    planType: string;
    coverageType: string;
    coverageTypeId: string;
    coverageInfo: string;
}

export interface IQuoteWCRatesFileUploadData {
    _id?: string;
    quoteId: string | IQuoteSlip;
    wcRatesData: string | IWCRatesData[];
    filePath: string;
    tableType: string;
}

export interface IQuoteGmcTemplate {
    _id?: string;
    gmcTemplateData: IGMCTemplate[];
    quoteId: string | IQuoteSlip;
    employeeDemographic: EmployeeDemographic;
    finalRater: FinalRater;
    claimExperience: GmcClaimExperience[]
    siType: string;
    siFlat: number;
    gmcGradedSILst: GmcGradedSI[];
    isOptionSelected: boolean;
    optionName: string;
    selectedFromOptionNo: string;
    options: string[];
    isAccepted: string
    indicativePremium: number
    totalFinalRater: number
    brokarage: number
    otherTerms: string[]
    otherTermText: string
    coverageTypeId: string
    coverageTypeName: string
    coverageInfo:string
    optionIndex: number
    claimsDocument: IFileModel
    isQuoteOptionPlaced: boolean
    calculatedPremium: number
    planType: string
    fileUploadType: string
    dayCareFilePath: string
    dayCareFileName: string
    version: number,
    gmcBasicDetails: IGmcBasicDetails,
    gpaGtlFormDetails: GpaGtlFormDetails[]

    gradedFormData: GradedForm[]
    gradedFormDataMultiple: GradedFormMultiple[]
    otherDetailsInstallment: Installment[]
    basicDeatilsQCRAttachments: IBasicDetailsProductAttachments[]

    referenceNo: string
    chequeNo: string
    bankName: string
    paymentDate: string
    paymentAmount: string
    premiumDetails: any;

    cgst: string
    sgst: string
    igst: string
    totalGST: string
    totalGSTAmount: string
    amountWithGST: string

    isCobroker: boolean;
    isCoInsurer: boolean;
    coInsurers: IcoInsurers[]
    coBrokers: ICoBroker[]

    isExpired: Boolean;
    policyStartDate: string;
    policyEndDate: string;
    projectDate: string;

    rewards: string;
    showClaimHistory: boolean

    deductiblesExcessPd: string;
    quoteSubmissionDate: Date
    additionalInfo: string;
    expiryCopyDocumentPath: string;
    originalPartnerId: any;
    allCoversArray: any[],
    originalQuoteOptionId: string;
    topUpType:string

}

export class QuoteGmcTemplate {
    _id?: string;
    gmcTemplateData: IGMCTemplate[] = [];
    quoteId: string | IQuoteSlip;
    employeeDemographic: EmployeeDemographic;
    claimExperience: GmcClaimExperience[] = [];
    finalRater: FinalRater;
    gmcGradedSILst: GmcGradedSI[] = [];
    siType: string = "Flat";
    siFlat: number;
    isOptionSelected: boolean;
    optionName: string;
    selectedFromOptionNo: string;
    options: string[] = [];
    isAccepted: string
    indicativePremium: number
    totalFinalRater: number
    brokarage: number
    otherTerms: string[] = []
    otherTermText: string = ""
    coverageTypeId: string = ""
    coverageTypeName: string = ""
    coverageInfo:string=""
    optionIndex: number
    claimsDocument: IFileModel
    isQuoteOptionPlaced: boolean = false
    calculatedPremium: number = 0
    planType: string = "Individual"
    fileUploadType: string = "Normal";
    dayCareFilePath: string = ""
    dayCareFileName: string = ""
    version: number = 0
    gmcBasicDetails: IGmcBasicDetails
    gpaGtlFormDetails: GpaGtlFormDetails[] = []

    gradedFormData: GradedForm[] = []
    gradedFormDataMultiple: GradedFormMultiple[] = []
    otherDetailsInstallment: Installment[] = []
    basicDeatilsQCRAttachments: IBasicDetailsProductAttachments[] = []

    referenceNo: string = ""
    chequeNo: string = ""
    bankName: string = ""
    paymentDate: string = ""
    paymentAmount: string = ""
    premiumDetails: any;
    cgst: string = ""
    sgst: string = ""
    igst: string = ""
    totalGST: string = ""
    totalGSTAmount: string = ""
    amountWithGST: string = ""

    isCobroker: boolean = false;
    isCoInsurer: boolean = false;
    coInsurers: IcoInsurers[] = []
    coBrokers: ICoBroker[] = []

    isExpired: Boolean = false;
    policyStartDate: string;
    policyEndDate: string;
    projectDate: string;
    rewards: string;
    showClaimHistory: boolean = false
    deductiblesExcessPd: string = "";
    quoteSubmissionDate: Date = new Date()
    additionalInfo: string = "";
    expiryCopyDocumentPath: string = "";
    originalPartnerId: any = null;
    allCoversArray: any[] = [];
    originalQuoteOptionId: any = null;
    topUpType:string


}
export class IGmcBasicDetails {
    gmcPolicyDetails: GmcPolicyDetails[]
    gmcClaimDetails: GmcClaimDetails[]
    premiumAtInception: number;
    premiumAsOnDate: number;
    earnedPremium: number;
    policyRunDate: string;
    policyRunDays: number;
    annualizedClaimAmount: number;
    averageClaimSize: number;
    claimRatioTotalPremium: number;
    claimRatioPremium: number;
    existingInsurer: string;
    existingTPA: string;
    existingBroker: string;
    coInsureDetails: string;
    coInsurePercentage: number;
    claimAsOnDate: number;
}

export class GmcBasicDetails {
    gmcPolicyDetails: GmcPolicyDetails[] = []
    gmcClaimDetails: GmcClaimDetails[] = []
    premiumAtInception: number = 0;
    premiumAsOnDate: number = 0;
    earnedPremium: number = 0;
    policyRunDate: string = "";
    policyRunDays: number = 0;
    annualizedClaimAmount: number = 0;
    averageClaimSize: number = 0;
    claimRatioTotalPremium: number = 0;
    claimRatioPremium: number = 0;
    existingInsurer: string = "";
    existingTPA: string = "";
    existingBroker: string = "";
    coInsureDetails: string = "";
    coInsurePercentage: number = 0;
    claimAsOnDate: number;
}

export class GmcPolicyDetails {
    name: string = ""
    inception: number = 0
    asOnDate: number = 0
    change: number = 0
    proposed: number = 0
}

export class GmcClaimDetails {
    public name: string = ""
    public count: number = 0
    public amount: number = 0
}

export class GmcOtherDetails {
    public alignment: string = ""
    public sublimit: number = 0
    public description: string = ""
}

// gpa-gtl-details.model.ts
export class GpaGtlDetails {
    year1: string = '';
    year2: string = '';
    year3: string = '';
    year4: string = '';
    year5: string = '';
}

export class GpaGtlFormDetails {
    label: string;
    data: GpaGtlDetails;

    constructor(label: string, data: GpaGtlDetails) {
        this.label = label;
        this.data = data;
    }
}

export class Installment {
    public number: string
    public date: string
    public premium: number
}

export class IFileModel {
    fileName: string
    fileType: string
    fileExtension: string
    documentUrl: string
}
export class FinalRater {
    premiumPaidTillDate: number = 0
    claimAsOnDate: number = 0
    claimsPaidOutStanding: number = 0
    oneTimeClaims: number = 0
    covidClaims: number = 0
    claimsDuetoDeathOfEmployee: number = 0
    adjustmentpercentage: number = 0
    ibnr: number = 0
    medicalInflation: number = 0
    tpaLoading: number = 0
    brokerage: number = 0
    insurerMargin: number = 0
    investmentIncome: number = 0
    overAllLoadingDiscount: number = 0
    netClaimAmount: number = 0
    netToatlAmount: number = 0
    netGrossTotalAmount: number = 0
    insurrerIncomeAmount: number = 0
    grandTotalAmount: number = 0;
}

export class EmployeeDemographic {
    annualTurnOver: any = null
    clientDescription: string = ""
    companyDescription: string = ""
    fundingArrangement: string = ""
    empCountInception: number = 0
    empCountProposed: number = 0
    dependentCountInception: number = 0
    dependentCountProposed: number = 0
    isClientDescription: boolean = false;
    isCompanyDescription: boolean = false;
    typeOfInsurer: string = "";
    typeOfInsurerDescription: string = ""
    istypeOfInsurerDescription: boolean = false;
    nameOfLeadInsurer: string = "";
    nameOfLeadInsurerDescription: string = ""
    isnameOfLeadInsurerDescription: boolean = false;
    leadSharePercentage: number = 0;
    coInsurer1: string = "";
    coInsurer1Percentage: number = 0;
    coInsurer2: string = "";
    coInsurer2Percentage: number = 0;
    coInsurerLst: NameOfCoInsurerList[] = []
    currentTpa: string = "";
    currentTpaName: string = ""
    currentTpaDescription: string = ""
    iscurrentTpaDescription: boolean = false;
    otherTPA: string[] = []

    employeeHeadCount: number = 0
    livesCount: number = 0
    averagePremiumPerLife: number = 0;

}
export interface IGmcDataModel {
    _id: string,
    createdBy: string,
    createdDate: string,
    deletedBy: string,
    modifiedBy: string,
    parentTabName: string,
    isDeleted: boolean,
    gmcSubTab: IGmcSubTabs[]
}
export interface IGmcSubTabs {
    _id: number,
    subTabName: string,
    isActive: boolean,
    gmcLabelForSubTab: IGmcLabelForSubTab[]
}

export interface IGmcLabelForSubTab {
    _id: number,
    labelName: string,
    isActive: boolean,
    gmcQuestionAnswers: IGmcQuestionAnswers[]
}

export interface IGmcQuestionAnswers {
    _id: number,
    isActive: boolean,
    weightage: number,
    question: string,
    freeText: boolean,
    freeTextValue: string,
    inputControl: string,
    answer: IGmcAnswers[],
    selectedAnswer: any,
    selectedMultipleAnswer: any;

}

export interface IGmcAnswers {
    _id: number,
    answer: string,
    isActive: boolean,
    isSelected: boolean
}
export class NameOfCoInsurerList {
    nameofcoInsurer: string
    share: number
}

export class GmcClaimExperience {
    startYear: number = 0
    endYear: number = 0
    premiumPaid: number = 0
    paidAmount: number = 0
    outstandingAmount: number = 0
    noOfClaims: number = 0
}

export interface IEmployeeData {
    empId?: String,
    empType?: String,
    memberName?: String,
    designation?: String,
    dob?: String,
    age: number,
    ageBand: number,
    gender?: String,
    relationShip?: String,
    salary: number,
    SI: number
}

export interface IWCRatesData {
    name: string,
    age: number,
    natureOfWork?: string, // Business type ddl
    businessTypeId: string;
    typeOfEmployees?: string, // Normal ddl refer WC-Rates excel
    descriptionOfEmployees?: string,
    classificationNo: number,
    salaryPerMonth: number,
    noOfEmployees: number,
    PeriodCoveredInMonths: number, //1-12 numbers ddl
    totalSalary: number,
    totalSalaryUptoFT: number,
    totalSalaryAboveFT: number,
    rateUptoFT: number,
    rateAboveFT: number,
    netPremium: number
    medicalBenifitsAns: string;
    medicalBenifitsAmount: number;
    totalPremiumAmt: number;
    isFlipped: boolean;
    medicalBenifitsOption: string;
    isActual: boolean;

}

export class WCRatesData implements IWCRatesData {
    name: string = ""
    age: number = 0
    natureOfWork?: string = "" // Business type ddl
    businessTypeId: string = ""
    typeOfEmployees?: string = "" // ddl
    typeOfEmployeeId: string = ""
    descriptionOfEmployees?: string = ""
    descOfEmployeeId: string = ""
    classificationNo: number = 0
    salaryPerMonth: number = 0
    noOfEmployees: number = 0
    PeriodCoveredInMonths: number = 0 //1-12 numbers ddl
    totalSalary: number = 0
    totalSalaryUptoFT: number = 0
    totalSalaryAboveFT: number = 0
    rateUptoFT: number = 0
    rateAboveFT: number = 0
    netPremium: number = 0
    medicalBenifitsAns: string = "Yes";
    medicalBenifitsAmount: number = 0;
    totalPremiumAmt: number = 0;
    isFlipped: boolean = false;
    medicalBenifitsOption: string = "";
    isActual: boolean = false;
}

export interface IEmployeesDemoSummary {
    ageBand: number,
    selfCount: number,
    spouseCount: number,
    childCount: number,
    parentCount: number,
    ParentinLawCount: number,
    siblingsCount: number,
    grandTotal: number
}

//Intergation-EB [End]

export enum AllowedInstrument {
    CHEQUE = "cheque",
    DD = "dd",
    NEFT_RTGS = "neft/rtgs"
}

export const OPTIONS_INSTRUMENT_TYPES = [
    { label: 'CHEQUE', value: AllowedInstrument.CHEQUE },
    { label: 'DD', value: AllowedInstrument.DD },
    { label: 'NEFT/RTGS', value: AllowedInstrument.NEFT_RTGS },
]

export enum AllowedBrokerTat {
    STARTED_REQUISITION = 'Started Requisition',
    SENT_FOR_APPROVAL = 'Sent For Approval',
    SENT_TO_INSURER = 'Sent To Insurer',
    RECEIVED_FROM_INSURER = 'Received From Insurer',
    PROCEED_FOR_PAYMENT = 'Proceed For Payment',
    PLACEMENT = 'Placment',
}

export const OPTIONS_BROKER_TAT = [
    { label: 'Started Requisition', value: AllowedBrokerTat.STARTED_REQUISITION }, // Draft to Requisition Time
    { label: 'Sent For Approval', value: AllowedBrokerTat.SENT_FOR_APPROVAL }, // Requisition to Approval Time
    { label: 'Sent To Insurer', value: AllowedBrokerTat.SENT_TO_INSURER },  // Approval to IC Time
    { label: 'Received From Insurer', value: AllowedBrokerTat.RECEIVED_FROM_INSURER },  // IC to QCR
    { label: 'Proceed For Payment', value: AllowedBrokerTat.PROCEED_FOR_PAYMENT },  // QCR to Pending Payment
    { label: 'Placment', value: AllowedBrokerTat.PLACEMENT },  // Pending Payment Placed
]

export const OPTIONS_QUOTE_TYPES = [
    { label: "Fresh", value: AllowedQuoteTypes.NEW },
    { label: "Renewal", value: AllowedQuoteTypes.EXISTING },
    { label: "Rollover", value: AllowedQuoteTypes.ROLLOVER },
];

export const OPTIONS_QUOTE_AGE_OF_BUILDING = [
    { label: 'Less than 5 years', value: 'Less than 5 years' },
    { label: '5-10 years', value: '5-10 years' },
    { label: '11-20 years', value: '11-20 years' },
    { label: 'above 20 years', value: 'above 20 years' },
]
export const OPTIONS_QUOTE_CONSTRUCTION_TYPE = [
    { value: 'Pucca', label: 'Pucca' },
    { value: 'Kutcha', label: 'Kutcha' },
]

export const OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY = [
    { label: 'Less than 55%', value: '&lt; 55%' },
    { label: 'Greater than or equal to 55% and less than 65%', value: '55%&lt;=LR&lt;65%' },
    { label: 'Greater than or equal to 65% and less than 75%', value: '65%&lt;=LR&lt; 75%' },
    { label: 'Greater than or equal to 75% and less than 85%', value: '75%&lt;=LR&lt;85%' },
    { label: 'Greater than or equal to 85% and less than 95%', value: '85%&lt;=LR&lt;95%' },
    { label: 'Greater than or equal to 95% and less than 105%', value: '95%&lt;=LR&lt;105%' },
    { label: 'Greater than 105%', value: '&rt;= 105%' },
]
export const OPTIONS_QUOTE_FIRE_PROTECTION = [
    { label: 'No fire protection', value: 'No fire protection' },
    { label: '1 protection available', value: '1 protection available' },
    { label: 'At least 2 available', value: 'At least 2 available' },
]
export const OPTIONS_QUOTE_AMC_FOR_FIRE_PROTECTION = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
]
export const OPTIONS_QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE = [
    { value: 'Within 5KM', label: 'Within 5KM' },
    { value: 'Beyond 5KM', label: 'Beyond 5KM' },
]
export const OPTIONS_QUOTE_PREMISES_FLOOR = [
    { value: 'Basement', label: 'Basement' },
    { value: 'Ground Floor', label: 'Ground Floor' },
    { value: 'Above Ground floor or on Hilly terrain', label: 'Above Ground floor or on Hilly terrain' },
]


export interface IAllBscArray {
    higherSumAssuredLocation: IQuoteLocationOccupancy
    bscFireLossOfProfitCover: IBscFireLossOfProfitCover
    bscAccompaniedBaggageCover: IBscAccompaniedBaggage[]
    bscBurglaryHousebreakingCover: IBscBurglaryHousebreakingCover
    bscElectronicEquipmentsCover: IBscElectronicEquipmentsCover
    bscFidelityGuaranteeCover: IBSCFidelityGurantee[]
    bscFixedPlateGlassCover: IBscFixedPlateGlassCover
    bscLiabilitySectionCover: IBscLiability[]
    bscMoneySafeTillCover: IBscMoneySafeTillCover
    bscMoneyTransitCover: IBscMoneyTransitCover
    bscPortableEquipmentsCover: IBscPortableEquipments[]
    bscSignageCover: IBscSignage[]
    quoteLocationAddonCovers: IAddOnCover[]
    quoteLocationOccupancy: IQuoteLocationOccupancy,
    pincode: IPincode,
    Occupancy: IOccupancyRate,
    conditonalBasedAddOn: any[],
}


export interface IHypothication {
    isLeadBank: boolean;
    name: string;
}

export interface IInsurerDetails {
    isLeadInsurance: boolean;
    name: string;
    share: number;
    sumInsured: number
}
export interface ILovReference {
    lovValue: number,
    lovReference: AllowedLovReferences,
    quoteLocationOccupancyId?: string
}

export interface ILocationBasedCovers {
    quoteLocationOccupancy: IQuoteLocationOccupancy;
    higherSumAssuredLocation: IQuoteLocationOccupancy;

    quoteLocationAddonCovers: any[];
    quoteLocationRiskManagement: IQuoteRiskManagementFeatures[];
    conditonalBasedAddOn?: any[];

    bscFireLossOfProfitCover: IBscFireLossOfProfitCover;
    bscBurglaryHousebreakingCover: IBscBurglaryHousebreakingCover;
    bscElectronicEquipmentsCover: IBscElectronicEquipmentsCover;
    bscMoneySafeTillCover: IBscMoneySafeTillCover;
    bscMoneyTransitCover: IBscMoneyTransitCover;
    bscPortableEquipmentsCovers: IBscPortableEquipments[];
    bscFixedPlateGlassCover: IBscFixedPlateGlassCover;
    bscAccompaniedBaggageCovers: IBscAccompaniedBaggage[];
    bscFidelityGuaranteeCovers: IBSCFidelityGurantee[];
    bscSignageCovers: IBscSignage[];
    bscLiabilitySectionCovers: IBscLiability[];
    bscWorkmenCompensationCovers: IBscWorkmenCompensation[];
    bscPedalCycleCovers: IBscPedalCycle[],
    bscAllRiskCovers: IBscAllRisks[]

    machineryLossOfProfitCover: IMachineryLossOfProfitCover;
    machineryELectricalBreakDownCover: IMachineryELectricalBreakDownCover;

    fireFloaterCoverAddOnCover: IFireFloaterCoverAddOn;
    floaterCoverAddOnCovers: IFloaterCoverAddOn[];
    declarationPolicyCover: IDeclarationPolicy;
    loseOfRentCover: ILossOfRent;
    accidentalDamageCover: IAccidentalDamageCover;
    claimPreparationCostCover: IClaimPreparationCostCover;
    coverOfValuableContentsCover: ICoverOfValuableContentsCover;
    keysAndLocksCover: IKeysAndLocksCover;
    landscapingIncludingLawnsPlantShrubsOrTreesCover: ILandscapingIncludingLawnsPlantShrubsOrTreesCover;
    tenatLegalLiabilityCover: ITenantLegalLiabilityCover;
    thirdPartyLiabilityCover: IThirdPartyLiabilityCover;
    removalOfDebrisCover: IRemovalOfDebrisCover;
    protectionAndPreservationOfPropertyCover: IProtectionAndPreservationOfProperty;
    additionalCustomDuty: IAdditionalCustomDutyCover;
    deteriorationofStocksinBCover: IDeteriorationofStocksinBCover
    deteriorationofStocksinACover: IDeteriorationofStocksinACover
    escalationCover: IEscalationCover

    emiProtectionCover: IEmiProtectionCover;
    insuranceOfAdditionalExpenseCover: IInsuranceOfAdditionalExpenseCover;
    involuntaryBettermentCover: IInvoluntaryBettermentCover;

    rentForAlternativeAccomodationCover: IRentForAlternativeAccomodation;
    personalAccidentCoverCover: IPersonalAccidentCover[];
    valuableContentsOnAgreedValueBasisCovers: IValuableContentsOnAgreedValue[];
    warranties: any[];
    exclusions: any[];
    subjectivities: any[];
    riskManagementFeatures: any[];
    // pincodes: any[],
    // Occupanceis: any[],

    lovReferences: ILovReference[]


}


export interface IBscProductPartnerConfiguration {
    productId: string | IProduct;
    bscAccompaniedBaggageCover: boolean;
    bscBurglaryHousebreakingCover: boolean;
    bscElectronicEquipmentsCover: boolean;
    bscFidelityGuaranteeCover: boolean;
    bscFireLossOfProfitCover: boolean;
    bscFixedPlateGlassCover: boolean;
    bscLiabilitySectionCover: boolean;
    bscMoneySafeTillCover: boolean;
    bscMoneyTransitCover: boolean;
    bscPortableEquipmentsCover: boolean;
    bscSignageCover: boolean;
    bscWorkmenCompensationCover: boolean;
    bscPedalCycleCover: boolean;
    bscAllRiskCover: boolean;
    floaterCoverAddOn: boolean;
    declarationPolicy: boolean;
    loseOfRent: boolean;
    rentForAlternativeAccomodation: boolean;
    personalAccidentCover: boolean;
    valuableContentsOnAgreedValueBasis: boolean;
    AccidentalDamage: boolean;
    ClaimPreparationCost: boolean;
    CoverofValuableContents: boolean;
    KeysandLocks: boolean;
    Landscapingincludinglawnsplantshrubsortrees: boolean;
    ProtectionandPreservationofProperty: boolean;
    RemovalOfDebris: boolean;
    TenantslegalLiability: boolean;
    ThirdPartyLiability: boolean;
    AdditionalCustomDuty: boolean;
    DeteriorationofStocksinB: boolean;
    DeteriorationofStocksinA: boolean;
    Escalation: boolean;
    EMIProtectionCover: boolean;
    Insuranceofadditionalexpense: boolean;
    Involuntarybetterment: boolean;
}


interface IAllCoversArray {
    quoteLocationOccupancies: IQuoteLocationOccupancy[];
    higherSumAssuredLocation: IQuoteLocationOccupancy;

    quoteLocationAddonCovers: any[];
    conditonalBasedAddOns?: any[];

    quoteLocationRiskManagement: IQuoteLocationRiskManagement[];
    quoteLocationBreakupMaster: any[];


    lovReferences: any

    bscFireLossOfProfitCover: IBscFireLossOfProfitCover;
    bscBurglaryHousebreakingCovers: IBscBurglaryHousebreakingCover[];
    bscElectronicEquipmentsCovers: IBscElectronicEquipmentsCover[];
    bscMoneySafeTillCovers: IBscMoneySafeTillCover[];
    bscMoneyTransitCover: IBscMoneyTransitCover;
    bscPortableEquipmentsCovers: IBscPortableEquipments[];
    bscFixedPlateGlassCovers: IBscFixedPlateGlassCover[];
    bscAccompaniedBaggageCovers: IBscAccompaniedBaggage[];
    bscFidelityGuaranteeCovers: IBSCFidelityGurantee[];
    bscSignageCovers: IBscSignage[];
    bscLiabilitySectionCovers: IBscLiability[];
    bscWorkmenCompensationCover: IBscWorkmenCompensation[];
    bscPedalCycleCovers: IBscPedalCycle[];
    bscAllRiskCovers: IBscAllRisks[];
    accidentalDamageCover: IAccidentalDamageCover;
    claimPreparationCostCover: IClaimPreparationCostCover;
    coverOfValuableContentsCover: ICoverOfValuableContentsCover;
    keysAndLocksCover: IKeysAndLocksCover;
    landscapingIncludingLawnsPlantShrubsOrTreesCover: ILandscapingIncludingLawnsPlantShrubsOrTreesCover;
    tenatLegalLiabilityCover: ITenantLegalLiabilityCover;
    thirdPartyLiabilityCover: IThirdPartyLiabilityCover;
    removalOfDebrisCover: IRemovalOfDebrisCover;
    protectionAndPreservationOfPropertyCover: IProtectionAndPreservationOfProperty;
    additionalCustomDuty: IAdditionalCustomDutyCover;
    deteriorationofStocksinBCover: IDeteriorationofStocksinBCover
    deteriorationofStocksinACover: IDeteriorationofStocksinACover
    escalationCover: IEscalationCover

    emiProtectionCover: IEmiProtectionCover;
    insuranceOfAdditionalExpenseCover: IInsuranceOfAdditionalExpenseCover;
    involuntaryBettermentCover: IInvoluntaryBettermentCover;

    machineryElectricalBreakdown: IMachineryELectricalBreakDownCover[];
    machineryLossOfProfitCover: IMachineryLossOfProfitCover;


    floaterCoverAddOnCovers: IFloaterCoverAddOn[];
    declarationPolicyCover: IDeclarationPolicy;
    loseOfRentCover: ILossOfRent;
    rentForAlternativeAccomodationCover: IRentForAlternativeAccomodation;
    personalAccidentCoverCover: IPersonalAccidentCover[];
    valuableContentsOnAgreedValueBasisCovers: IValuableContentsOnAgreedValue[];
    quoteLocationPropertyDamageAddonCoversSumInsured: number;
    quoteLocationBusinessInturruptionAddonCoversSumInsured: number;

    warranties: any[];
    exclusions: any[];
    subjectivities: any[];

    fireFloaterCoverAddOnCover: IFireFloaterCoverAddOn;

    gmcOptions: IQuoteGmcTemplate[];

    liabilityTemplateCovers: IDANDOTemplate[];

    liabilityTemplateEandOCovers: IEandOTemplate[]

    liabilityTemplateCGLCovers: ICGLTemplate[]

    liabilityTemplateProductCovers: IProductLiabilityTemplate[]
    liabilityTemplateWCCovers: IWCTemplate[]

}

export interface IMarineTemplate {
    _id?: string;
    quoteId: string | IQuoteSlip;
    marineSIData: IMarineSIData;
    marineCoverAddOnCovers: IClauses[];
    indicativePremium: number
    isQuoteOptionPlaced: boolean
    otherDetails: string[]
    otherDetails1: string
    otherDetails2: string
    otherDetails3: string
    otherDetails4: string
    otherDetails5: string
    //originalQuoteMarineTemplateId: string
}


export interface IWCTemplate {
    _id?: string;
    quoteId: string | IQuoteSlip;
    wcCoverAddOnCovers: IWCCoverageType[];
    medicalBenifits: boolean;
    medicalBenifitsAns: string;
    medicalBenifitsAmount: number;
    medicalBenifitsAmountId: string;
    allmedicalBenifitsYesNo: boolean;
    targetPremium: number;
    adjustedPremium: number;
    indicativePremium: number;
    discountbasedonPremium: number;
    addonCoversAmount: number;
    totalPremiumAmt: number;
    juridiction: string;
    territory: string;
    underWriteradjustedPremium: number;
    underWritertargetPremium: number
    underWriterindicativePremium: number;
    underWriterdiscountbasedonPremium: number;
    underWriteraddonCoversAmount: number;
    underWritertotalPremiumAmt: number;
    underWritermedicalBenifitsAmount: number;
    underWritermedicalBenifitsAmountId: string;
    underWritermedicalBenifitsOption: string
    underWriterisActual: boolean;
    safetyMeasures: string;
    wcDetails: IWCRatesData[]
    medicalBenifitsOption: string
    isActual: boolean;
    //rollover
    //previousPolicyDetails:string;
    previousCompany: string;
    previousPolicyno: string;
    previousStartdate: Date;
    previousEnddate: Date;

    subjectivity: SubjectivityAndMajorExclusions[]
    majorExclusions: SubjectivityAndMajorExclusions[]
    basicDetailsAttchments: IBasicDetailsEandOAttachments[]
    liabiltyDeductibles: liabiltyProductDeductibles[]
    isOptionSelected: boolean,
    optionName: string,
    selectedFromOptionNo: string;
    options: string[];
    optionIndex: number,
    isAccepted: string;
    isQuoteOptionPlaced: false,
    liabiltyCovers: liabiltyAddOnCovers[]
    version: number
    tableType: string;
    referenceNo: string
    chequeNo: string
    bankName: string
    paymentDate: string
    paymentAmount: string
    premiumDetails: any;
    coInsurers: IcoInsurers[]
    isExpired: Boolean;
    policyStartDate: string;
    policyEndDate: string;

    //DRAFT TO TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster;
    insuredBusinessActivityOther: string
    isOfferIndication: boolean;
}



export class WCTemplate {
    _id?: string = "";
    quoteId: string = "";
    wcCoverAddOnCovers: IWCCoverageType[] = [];
    medicalBenifits: boolean = false;
    medicalBenifitsAns: string = "";
    medicalBenifitsAmount: number = 0
    medicalBenifitsAmountId: string = "";
    allmedicalBenifitsYesNo: boolean = false;
    targetPremium: number = 0
    indicativePremium: number = 0;
    discountbasedonPremium: number = 0;
    addonCoversAmount: number = 0;
    totalPremiumAmt: number = 0;

    underWriteradjustedPremium: number = 0;
    underWritertargetPremium: number = 0
    underWriterindicativePremium: number = 0
    underWriterdiscountbasedonPremium: number = 0
    underWriteraddonCoversAmount: number = 0
    underWritertotalPremiumAmt: number = 0

    underWritermedicalBenifitsAmount: number = 0
    underWritermedicalBenifitsAmountId: string = ""
    underWritermedicalBenifitsOption: string = ""
    underWriterisActual: boolean = false

    safetyMeasures: string = ""
    wcDetails: IWCRatesData[] = [];
    medicalBenifitsOption: string = ""
    isActual: boolean = false;
    //rollover
    //previousPolicyDetails:string;
    juridiction: string = ""
    territory: string = ""

    previousCompany: string;
    previousPolicyno: string;
    previousStartdate: Date;
    previousEnddate: Date;
    subjectivity: SubjectivityAndMajorExclusions[] = []
    majorExclusions: SubjectivityAndMajorExclusions[] = []
    basicDetailsAttchments: IBasicDetailsEandOAttachments[] = []
    liabiltyDeductibles: liabiltyProductDeductibles[] = []
    isOptionSelected: boolean = true
    optionName: string = "Option 1"
    selectedFromOptionNo: string = ""
    options: string[] = []
    optionIndex: number = 1
    isAccepted: string = ""
    isQuoteOptionPlaced: false
    liabiltyCovers: liabiltyAddOnCovers[] = []
    version: number = 0
    tableType: string = "Named"
    referenceNo: string = ""
    chequeNo: string = ""
    bankName: string = ""
    paymentDate: string = ""
    paymentAmount: string = ""
    premiumDetails: any;
    coInsurers: IcoInsurers[] = []
    isExpired: Boolean = false;
    policyStartDate: string = "";
    policyEndDate: string = "";

    //DRAFT TOT TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster = "";
    insuredBusinessActivityOther: string = ""
    isOfferIndication: boolean = false;

}

export interface IDANDOTemplate {
    //draft page
    _id?: string;
    quoteId: string | IQuoteSlip;
    //basic details page
    detailsOfBusinessActivity: string;
    typeOfPolicyId: string | IWCListOfValueMaster;
    natureOfBusinessId: string | IWCListOfValueMaster;
    ageOfCompanyId: string | IWCListOfValueMaster;
    retroactiveCoverId: string | IWCListOfValueMaster;
    retroactiveDate: Date;
    dateOfIncorporation: Date;
    auditedReportFilePath?: string;
    proposalFormFilePath?: string;
    anyAdditionalInfoFilePath?: string;
    totalPremiumAmt: number;
    aoaAoyId: string | IWCListOfValueMaster;
    anyOneAccident: number;
    inTheAggregate: number;
    additionalInformation: string;


    juridictionId: string | IWCListOfValueMaster;
    territoryId: string | IWCListOfValueMaster;
    employeesDetails: EmployeesDetails[]
    totalNumberOfEmployees: number;
    //territory & subsidiary details
    juridiction: string;
    territory: string;
    //businessAsPerCompanyId: string | IWCListOfValueMaster;
    subJoinVentureDocsFilePath?: string;
    subJoinVentureDocsFileName?: string;
    subsidaryDetails: SubsidiaryDetails[];
    isBreakupRevenueORTurnover: string;


    liabiltyCovers: liabiltyAddOnCovers[];
    liabiltyDeductibles: liabiltyProductDeductibles[]
    basicDetailsAttchments: IBasicDetailsAttachments[];
    //Revenue Details
    revenueDetails: RevenueDetails
    subjectivity: SubjectivityAndMajorExclusions[]
    majorExclusions: SubjectivityAndMajorExclusions[]

    isOptionSelected: boolean,
    optionName: string,
    selectedFromOptionNo: string;
    options: string[];
    optionIndex: number,
    isAccepted: string;
    isQuoteOptionPlaced: false,
    version: number
    referenceNo: string
    chequeNo: string
    bankName: string
    paymentDate: string
    paymentAmount: string
    premiumDetails: any;
    coInsurers: IcoInsurers[]
    isExpired: Boolean;
    policyStartDate: string;
    policyEndDate: string;
    insuredBusinessActivityId: string | IWCListOfValueMaster;
    insuredBusinessActivityOther: String;
    limitOfLiability: number;
    isOfferIndication: boolean;

}

export class DANDOTemplate {
    //draft page
    _id?: string = ""
    quoteId: string = ""
    //basic details page
    detailsOfBusinessActivity: string = " "
    typeOfPolicyId: string = ""
    natureOfBusinessId: string = ""
    ageOfCompanyId: string = ""
    retroactiveCoverId: string = ""
    retroactiveDate: Date;
    dateOfIncorporation: Date;
    auditedReportFilePath?: string = ""
    proposalFormFilePath?: string = ""
    anyAdditionalInfoFilePath?: string = ""
    totalPremiumAmt: number = 0
    aoaAoyId: string = ""
    anyOneAccident: number = 0
    inTheAggregate: number = 0
    additionalInformation: string = "";

    juridictionId: string = "";
    territoryId: string = "";
    employeesDetails: EmployeesDetails[] = []
    totalNumberOfEmployees: number = 0;
    //territory & subsidiary details
    juridiction: string = ""
    territory: string = ""
    //businessAsPerCompanyId: string = ""
    subJoinVentureDocsFilePath?: string = "";
    subJoinVentureDocsFileName?: string = "";
    subsidaryDetails: SubsidiaryDetails[] = []
    isBreakupRevenueORTurnover: string = "Revenue";


    liabiltyCovers: liabiltyAddOnCovers[] = []
    liabiltyDeductibles: liabiltyProductDeductibles[]
    basicDetailsAttchments: IBasicDetailsAttachments[] = []
    //Revenue Details
    revenueDetails: RevenueDetails = new RevenueDetails()
    subjectivity: SubjectivityAndMajorExclusions[] = []
    majorExclusions: SubjectivityAndMajorExclusions[] = []
    isOptionSelected: boolean = true
    optionName: string = "Option 1"
    selectedFromOptionNo: string = ""
    options: string[] = []
    optionIndex: number = 1
    isAccepted: string = ""
    isQuoteOptionPlaced: false
    version: number = 0
    referenceNo: string = ""
    chequeNo: string = ""
    bankName: string = ""
    paymentDate: string = ""
    paymentAmount: string = ""
    premiumDetails: any;
    coInsurers: IcoInsurers[] = []


    isExpired: Boolean = false;
    policyStartDate: string = "";
    policyEndDate: string = "";
    insuredBusinessActivityId: string = "";
    insuredBusinessActivityOther: String = "";
    limitOfLiability: number = 0;
    isOfferIndication: boolean = false;

}

export const QUOTE_STATUS_FROM_DB_TO_NEW_NAME = {
    'Draft': "Request For Proposal (RFP)",
    'Pending Requisition For Quote': "Request For Proposal (RFP)",
    'Waiting For Approval': "Request For Quote (RFQ)",
    'Sent To Insurance Company RM': "Request For Quote (RFQ)",
    'Under Writter Review': "Request For Quote (RFQ)",
    'QCR From Underwritter': "Quote Comparsion Report (QCR)"
}

export class EandOTemplate {
    _id: string = null
    quoteId: string = ""
    //basic details page
    detailsOfBusinessActivity: string = ""
    typeOfPolicy: string = ""
    numberOfExperienceId: string = ""
    retroactiveCoverId: string = ""
    retroactiveDate: Date;
    totalPremiumAmt: number = 0
    additionalInformation: string = ""
    //territory & subsidiary details
    juridictionId: string = ""
    territoryId: string = ""
    //businessAsPerCompanyId: Schema.Types.ObjectId
    subsidairyAnnualReportFilePath?: string = ""
    subsidaryDetails: SubsidiaryEandODetails[] = []
    isOptionSelected: boolean = true
    optionName: string = "Option 1"
    selectedFromOptionNo: string = ""
    options: string[] = []
    optionIndex: number = 1
    isAccepted: string = ""
    isQuoteOptionPlaced: false
    //Revenue Details
    revenueDetails: RevenueDetails = new RevenueDetails()

    //Deductable
    liabiltyDeductibles: liabiltyEandODeductibles[] = []
    liabiltyCovers: liabiltyEandOAddOnCovers[] = []
    basicDetailsAttchments: IBasicDetailsEandOAttachments[] = []
    subjectivity: SubjectivityAndMajorExclusions[] = []
    majorExclusions: SubjectivityAndMajorExclusions[] = []
    isBreakupRevenueORTurnover: string = "Revenue";
    version: number = 0
    referenceNo: string = ""
    chequeNo: string = ""
    bankName: string = ""
    paymentDate: string = ""
    paymentAmount: string = ""
    premiumDetails: any;
    coInsurers: IcoInsurers[] = []
    isExpired: Boolean = false;
    policyStartDate: string = "";
    policyEndDate: string = "";
    //DRAFT TOT TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster = "";
    insuredBusinessActivityOther: string = ""
    limitOfLiability: number = 0;
    isOfferIndication: boolean = false;

}

export interface IEandOTemplate {
    _id?: string;
    quoteId: string | IQuoteSlip;
    detailsOfBusinessActivity: string;
    typeOfPolicy: string;
    numberOfExperienceId: string | IWCListOfValueMaster;
    retroactiveCoverId: string | IWCListOfValueMaster;
    retroactiveDate: Date;
    totalPremiumAmt: number;
    additionalInformation: string;
    juridictionId: string | IWCListOfValueMaster;
    territoryId: string | IWCListOfValueMaster;
    subsidairyAnnualReportFilePath?: string;
    subsidaryDetails: SubsidiaryEandODetails[];
    isOptionSelected: boolean,
    optionName: string,
    selectedFromOptionNo: string;
    options: string[];
    optionIndex: number,
    isAccepted: string;
    isQuoteOptionPlaced: false,
    revenueDetails: RevenueDetails;
    liabiltyDeductibles: liabiltyEandODeductibles[];
    liabiltyCovers: liabiltyEandOAddOnCovers[]
    basicDetailsAttchments: IBasicDetailsEandOAttachments[]
    subjectivity: SubjectivityAndMajorExclusions[]
    majorExclusions: SubjectivityAndMajorExclusions[]
    isBreakupRevenueORTurnover: string;
    version: number
    referenceNo: string
    chequeNo: string
    bankName: string
    paymentDate: string
    paymentAmount: string
    premiumDetails: any;
    coInsurers: IcoInsurers[]
    isExpired: Boolean;
    policyStartDate: string;
    policyEndDate: string;

    //DRAFT TO TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster;
    insuredBusinessActivityOther: string
    limitOfLiability: number;
    isOfferIndication: boolean;

}

export class RevenueDetails {
    revenueColumn: ILov[] = []
    revenueRows: RevenueRows[] = []
}

export class TurnOverDetails {
    revenueColumn: ILov[] = []
    revenueRows: TurnOverRows[] = []
}

export class RevenueRows {
    label: string;
    name: string;
    firstYear: number;
    secondYear: number;
    thirdYear: number;
    fourthYear: number;
    fifthYear: number;
    estimatedForNextYear: number;
}


export class liabiltyEandOAddOnCovers {
    id: string;
    name: string;
    isExternal: boolean = false;
    isSelected: boolean = false;
    optionSelected: string;
    description: string;
    options: ILov[] = []
    toolTipDescription: string = ""

}

export class liabiltyEandODeductibles {
    description: string;
    amount: number;
}

export class SubsidiaryEandODetails {
    countryId: string
    countryName: string
    isSelected: boolean
    activityName: string
}

export interface IBasicDetailsEandOAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
}

export class BasicDetailsEandOAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
}

//CGL
export class CGLTemplate {
    _id: string = ""
    quoteId: string = ""
    //basic details page
    typeOfPolicyId: string = ""
    typeOfPolicy: string = ""//Public Liability
    detailsOfHazardousChemical: string = ""//Public Liability
    aoaAoyId: string = ""//Public Liability
    anyOneAccident: number = 0//Public Liability
    inTheAggregate: number = 0//Public Liability
    jurasdiction: string = "" //Public Liability
    territory: string = ""//Public Liability
    retroactiveCoverId: string = ""
    detailsOfProductAndUsage: string = ""
    detailsOfBusinessActivity: string = ""
    additionalInformation: string = ""
    retroactiveDate: Date;

    totalPremiumAmt: number = 0
    //territory & subsidiary details
    juridictionId: string = ""
    territoryId: string = ""

    subsidaryDetails: SubsidiaryCGLDetails[] = []

    //Turn Over Details
    turnOverDetails: TurnOverDetails = new TurnOverDetails()

    liabiltyCovers: liabiltyCGLAddOnCovers[] = []
    basicDetailsAttchments: IBasicDetailsCGLAttachments[] = []
    listOfLocations: IBasicDetailsCGLAttachments[] = []

    subjectivity: SubjectivityAndMajorExclusions[] = []
    majorExclusions: SubjectivityAndMajorExclusions[] = []
    liabiltyDeductibles: liabiltyProductDeductibles[] = [];
    isOptionSelected: boolean = true
    optionName: string = "Option 1"
    selectedFromOptionNo: string = ""
    options: string[] = []
    optionIndex: number = 1
    isAccepted: string = ""
    isQuoteOptionPlaced: false
    isBreakupRevenueORTurnover: string = "Revenue";
    version: number = 0
    referenceNo: string = ""
    chequeNo: string = ""
    bankName: string = ""
    paymentDate: string = ""
    paymentAmount: string = ""
    premiumDetails: any;
    coInsurers: IcoInsurers[] = []
    isExpired: Boolean = false;
    policyStartDate: string = "";
    policyEndDate: string = "";

    //DRAFT TOT TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster = "";
    insuredBusinessActivityOther: string = ""
    limitOfLiability: number = 0;
    isOfferIndication: boolean = false;
    typeOfProductId: string | IWCListOfValueMaster = "";
}


export interface ICGLTemplate {
    _id?: string;
    quoteId: string | IQuoteSlip;
    //basic details page
    detailsOfBusinessActivity: string
    typeOfPolicyId: string | IWCListOfValueMaster;
    typeOfPolicy: string; //Public Liability
    detailsOfHazardousChemical: string; //Public Liability
    aoaAoyId: string | IWCListOfValueMaster;//Public Liability
    anyOneAccident: number;//Public Liability
    inTheAggregate: number;//Public Liability
    jurasdiction: string; //Public Liability
    territory: string; //Public Liability
    retroactiveCoverId: string | IWCListOfValueMaster;
    detailsOfProductAndUsage: string;
    retroactiveDate: Date;
    additionalInformation: string;
    totalPremiumAmt: number;
    //territory & subsidiary details
    juridictionId: string | IWCListOfValueMaster;
    territoryId: string | IWCListOfValueMaster;
    subsidaryDetails: SubsidiaryCGLDetails[];
    //Turn Over Details
    turnOverDetails: TurnOverDetails;
    liabiltyCovers: liabiltyCGLAddOnCovers[]
    basicDetailsAttchments: IBasicDetailsCGLAttachments[]
    listOfLocations: IBasicDetailsCGLAttachments[]


    subjectivity: SubjectivityAndMajorExclusions[]
    majorExclusions: SubjectivityAndMajorExclusions[]
    liabiltyDeductibles: liabiltyProductDeductibles[]
    isOptionSelected: boolean,
    optionName: string,
    selectedFromOptionNo: string;
    options: string[];
    optionIndex: number,
    isAccepted: string;
    isQuoteOptionPlaced: false,
    isBreakupRevenueORTurnover: string
    version: number
    referenceNo: string
    chequeNo: string
    bankName: string
    paymentDate: string
    paymentAmount: string
    premiumDetails: any;
    coInsurers: IcoInsurers[]
    isExpired: Boolean;
    policyStartDate: string;
    policyEndDate: string;

    //DRAFT TO TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster;
    insuredBusinessActivityOther: string
    limitOfLiability: number;
    isOfferIndication: boolean;
    typeOfProductId: string | IWCListOfValueMaster;


}

export class ProductLiabilityTemplate {
    _id: string = ""
    quoteId: string = ""
    //basic details page
    detailsOfBusinessActivity: string = ""
    typeOfPolicyId: string = ""
    numberOfExperienceId: string = ""

    retroactiveCoverId: string = ""
    detailsOfProductAndUsage: string = ""
    retroactiveDate: Date;

    totalPremiumAmt: number = 0
    //territory & subsidiary details
    juridictionId: string = ""
    territoryId: string = ""
    juridiction: string = "";
    territory: string = "";
    subsidaryDetails: SubsidiaryProductDetails[] = []

    //Turn Over Details
    turnOverDetails: TurnOverDetails = new TurnOverDetails()

    liabiltyCovers: liabiltyProductAddOnCovers[] = []
    basicDetailsAttchments: IBasicDetailsProductAttachments[] = []



    //deductibles
    liabiltyDeductibles: liabiltyProductDeductibles[] = [];
    additionalInformation: string = ""
    subjectivity: SubjectivityAndMajorExclusions[] = []
    majorExclusions: SubjectivityAndMajorExclusions[] = []
    isBreakupRevenueORTurnover: string = "Revenue"
    isOptionSelected: boolean = true
    optionName: string = "Option 1"
    selectedFromOptionNo: string = ""
    options: string[] = []
    optionIndex: number = 1
    isAccepted: string = ""
    isQuoteOptionPlaced: false
    version: number = 0
    referenceNo: string = ""
    chequeNo: string = ""
    bankName: string = ""
    paymentDate: string = ""
    paymentAmount: string = ""
    premiumDetails: any;
    coInsurers: IcoInsurers[] = []
    isExpired: Boolean = false;
    policyStartDate: string = "";
    policyEndDate: string = "";

    //DRAFT TOT TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster = "";
    insuredBusinessActivityOther: string = ""
    limitOfLiability: number = 0;
    isOfferIndication: boolean = false;
}


export interface IProductLiabilityTemplate {
    _id?: string;
    quoteId: string | IQuoteSlip;
    //basic details page
    detailsOfBusinessActivity: string;
    typeOfPolicyId: string | IWCListOfValueMaster;
    numberOfExperienceId: string | IWCListOfValueMaster;
    retroactiveCoverId: string | IWCListOfValueMaster;
    detailsOfProductAndUsage: string;
    retroactiveDate: Date;

    totalPremiumAmt: number;
    //territory & subsidiary details
    juridictionId: string | IWCListOfValueMaster;
    territoryId: string | IWCListOfValueMaster;
    juridiction: string;
    territory: string;
    subsidaryDetails: SubsidiaryProductDetails[];

    //Turn Over Details
    turnOverDetails: TurnOverDetails;

    liabiltyCovers: liabiltyProductAddOnCovers[]
    basicDetailsAttchments: IBasicDetailsProductAttachments[]


    //deductibles
    liabiltyDeductibles: liabiltyProductDeductibles[];
    additionalInformation: string
    subjectivity: SubjectivityAndMajorExclusions[]
    majorExclusions: SubjectivityAndMajorExclusions[]
    isBreakupRevenueORTurnover: string
    isOptionSelected: boolean,
    optionName: string,
    selectedFromOptionNo: string;
    options: string[];
    optionIndex: number,
    isAccepted: string;
    isQuoteOptionPlaced: false,
    version: number
    referenceNo: string
    chequeNo: string
    bankName: string
    paymentDate: string
    paymentAmount: string
    premiumDetails: any;
    coInsurers: IcoInsurers[]
    isExpired: Boolean;
    policyStartDate: string;
    policyEndDate: string;

    //DRAFT TO TEMP
    insuredBusinessActivityId: string | IWCListOfValueMaster;
    insuredBusinessActivityOther: string
    limitOfLiability: number;
    isOfferIndication: boolean;

}




export class TurnOverRows {
    label: string;
    name: string;
    firstYear: number;
    secondYear: number;
    thirdYear: number;
    fourthYear: number;
    fifthYear: number;
    estimatedForNextYear: number;
}


export class liabiltyCGLAddOnCovers {
    id: string;
    name: string;
    isExternal: boolean = false;
    isSelected: boolean = false;
    optionSelected: string;
    description: string;
    options: ILov[] = []
    toolTipDescription: string = ""
}

export class liabiltyCGLDeductibles {
    description: string;
    amount: number;
}
export class SubsidiaryCGLDetails {
    countryId: string
    countryName: string
    isSelected: boolean
    activityName: string
}

export interface IBasicDetailsCGLAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string,
    listofLocation: string
}

export class BasicDetailsCGLAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
    listofLocation: string

}

export class BasicDetailsProductAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
}

export class liabiltyProductAddOnCovers {
    id: string;
    name: string;
    isExternal: boolean = false;
    isSelected: boolean = false;
    optionSelected: string;
    description: string;
    options: ILov[] = []
    toolTipDescription: string = ""
}
export class liabiltyProductDeductibles {
    description: string;
    amount: number;
}

export class SubsidiaryProductDetails {
    countryId: string
    countryName: string
    isSelected: boolean
    activityName: string
}

export interface IBasicDetailsProductAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
}

export class BasicDetailsProductLiabilityAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
}

//D&O
export interface IBasicDetailsAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
}

export class BasicDetailsAttachments {
    id: string
    quoteId: string
    templateId: string
    fileName: string
    filePath: string
    attachmentType: string
    attachmentSubType: string
    folderPath: string
}

export class EmployeesDetails {
    countryId: string = ""
    countryName: string = ""
    isSelected: boolean = false;
    location: string = ""
    numberOfEmployees: number = 0

}

export class SubsidiaryDetails {
    countryId: string = ""
    countryName: string = ""
    isSelected: boolean = false;
    activityName: string = ""
}

export class liabiltyAddOnCovers {
    id: string
    isExternal: boolean = false;
    name: string = ""
    isSelected: boolean = false
    optionSelected: string = ""
    description: string = ""
    options: ILov[] = []
    toolTipDescription: string = ""
    isApproved: boolean = true
}

export class liabiltyDeductibles {
    name: string;
    amount: number;
    isSelected: boolean;
    otcType: string;

}
// Define the interface for type safety
export class CoverageDetails {
    PreExistingDiseases: string;
    First30DaysExclusion: string;
    FirstYearExclusion: string;
    DomiciliaryHospitalization: string;
    AmbulanceCharges: string;
    AmbulanceAmount: string;
}

export class uploadAttachmentDetails {
    attachmentType: string = ""
    fileName: string = ""
}

export class uploadedListOfLocations {
    listofLocation: string = ""
    fileName: string = ""
}

export interface IMarineSIData {
    transitType: any;
    locationFrom: string;
    locationTo: string;
    selectedCountry: any;
    conveyanveType: ILov[]
    conveyanceList: MarineDescription[]
    interest: ILov
    interestList: MarineDescription[]
    packaging: ILov[]
    packagingList: MarineDescription[]
    policyStartDate: Date
    policyEndDate: Date
    marineSISplit: MarineSISplit
}

export class MarineSIData implements IMarineSIData {
    transitType!: ILov;
    locationFrom: string;
    locationTo: string;
    selectedCountry!: ILov;
    conveyanveType!: ILov[]
    conveyanceList: MarineDescription[] = []
    interest!: ILov
    interestList: MarineDescription[] = []
    packaging!: ILov[]
    packagingList: MarineDescription[] = []
    policyStartDate: Date
    policyEndDate: Date
    marineSISplit: MarineSISplit = new MarineSISplit()
}

export class MarineDescription {
    label: string
    text: string
}

export class MarineSISplit {
    estimatedTurnOver: number = 0
    asPerInvoiceSta: number = 0
    frieght: number = 0
    additionalUplift: boolean = false
    customDuty: number = 0
    gstOtherTaxes: number = 0
    total: number = 0
    description: string[] = []
}

export class SubjectivityAndMajorExclusions {
    id: string = ""
    name: string = ""
    //isSelected: boolean = false
    optionSelected: string = ""
    description: string = ""
    isExternal: boolean = false
}

// New_Quote_Option
export class IQuoteOption {
    _id?: string
    quoteId?: string;
    createdById?: string;
    quoteOption?: string;
    locationBasedCovers: ILocationBasedCovers;
    totalFireLossOfProfit?: number;
    totalFixedPlateGlass?: number;
    totalAccompaniedBaggage?: number;
    totalBurglaryHouse?: number;
    totalelectronicEquipment?: number;
    totalFidelityGuarantee?: number;
    totalLiabilitySection?: number;
    totalMoneySafeTill?: number;
    totalMoneyTransit?: number;
    totalPortableEquipment?: number;
    totalSignage?: number;
    totalWorkmenCompensation?: number;
    totalAllRisk?: number;
    totalPedalCycle?: number;
    totalFlexa?: number;
    totalStfi?: number;
    totalEarthquake?: number;
    totalTerrorism?: number;
    totalFloater?: number;
    totalInbuiltAddonCover?: number;
    totalDeclarationPolicy?: number;
    totalLossOfRent?: number;
    totalRentForAlternative?: number;
    totalPersonalAccident?: number;
    totalValuableContent?: number;
    totalMachineryElectricalBreakDown?: number;
    totalMachineryLossOfProfit?: number;
    totalAccidentalDamage?: number;
    totalClaimPreparationCost?: number;
    totalCoverofValuableContents?: number;
    totalKeysandLocks?: number;
    totalLandscapingincludinglawnsplantshrubsortrees?: number;
    totalProtectionandPreservationofProperty?: number;
    totalRemovalOfDebris?: number;
    totalTenantslegalLiability?: number;
    totalThirdPartyLiability?: number;
    totalAdditionalCustomDuty?: number;
    totalDeteriorationofStocksinB?: number;
    totalDeteriorationofStocksinA?: number;
    totalEscalation?: number;
    totalEMIProtectionCover?: number;
    totalInsuranceofadditionalexpense?: number;
    totalInvoluntarybettermen?: number;
    totalFireFloater?: number;
    totalQuoteLocationAddonCover?: number;
    totalPDAddonCover?: number;
    totalBIAddonCover?: number;
    totalQuoteSI?: number;
    totalQuoteSIExceeded?: number
    totalIndictiveQuoteAmt?: number; // Total Premium
    totalIndictiveQuoteAmtWithGst?: number
    totalSumAssured?: number;
    bscProductPartnerConfiguration?: IBscProductPartnerConfiguration;
    selectedAllowedProductBscCover: AllowedProductBscCover[];
    discountId: string | IQuoteDiscount;
    hypothications: IHypothication[];
    deductiblesExcessPd: string;
    targetPremium: number;
    brokerage: string;
    brokerCalculatedPremium: number
    yearOfManufacturing?: string;
    articleType?: string;
    invoiceNumber?: string;
    articleContentValue?: string;
    insurerProcessedQuotes?: IQuoteOption[];
    partnerId: string;
    parentQuoteId: string;
    allCoversArray: IAllCoversArray;
    existingBrokerCurrentYear: string;
    quoteOptionStatus?: string
    rewards: string;
    quoteSubmissionDate: Date;
    attachmentURL?: string;
    otherTerms: string;
    additionalInfo: string;
    totalOpt1: number;
    totalOpt2: number;
    totalOpt3: number;
    totalOpt4: number;
    isCobroker: boolean;
    isCoInsurer: boolean;
    coInsurers: IcoInsurers[]
    coBrokers: ICoBroker[]
    qcrVersion: string
    dropdownClause: boolean
    declarationDropdown: string
    policyStartDate: string;
    policyEndDate: string;
    policyTenure: string;
    projectDate: string;
    otherBusiness: ILov[];
    premium: number;
    premiumBrokerage: number;
    brokerageAmt: number;
    terrorismPremium: number;
    terrorismBrokerage: number;
    terrorismBrokerageAmt: number;
    totalBrokerage: number;
    brokerageRewards: number;
    brokerageRewardsAmt: number;
    terrorismRewards: number;
    terrorismRewardsAmt: number;
    totalRewards: number;
    totalBrokerageRewards: number
    referenceNo: string
    chequeNo: string
    bankName: string
    paymentDate: string
    paymentAmount: string
    premiumDetails: any;
    expiredQuoteOption: boolean
    additionalInformation: string

}