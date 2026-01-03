import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export enum AllowedGMCPARENTabsTypes {
  FAMILYCOMPOSITION = "Family Composition",
  COVERAGES = "Standard Coverages",
  MATERNITY = "Maternity Benifits",
  COSTCONTAINMENT = "Other Restrictions",
  //CLAIMANALYTICS = "Claim Analytics",
  OTHERDETAILS = "Other Details",
  ENHANCEDCOVERS = "Enhanced Covers"
  //   FINALRATER = "finalrater"
}

export const OPTIONS_GMC_PARENT_TABS = [
  { label: "Family Composition", value: AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION },
  { label: "Standard Coverages", value: AllowedGMCPARENTabsTypes.COVERAGES },
  { label: "Enhanced Covers", value: AllowedGMCPARENTabsTypes.ENHANCEDCOVERS },
  { label: "Maternity Benifits", value: AllowedGMCPARENTabsTypes.MATERNITY },
  { label: "Other Restrictions", value: AllowedGMCPARENTabsTypes.COSTCONTAINMENT },
  // { label: "Claim Analytics", value: AllowedGMCPARENTabsTypes.CLAIMANALYTICS },
  { label: "Other Details", value: AllowedGMCPARENTabsTypes.OTHERDETAILS },
  //   { label: "Final Rater", value: AllowedGMCPARENTabsTypes.FINALRATER }
];

export const OPTIONS_GMC_INPUT_CONTROL_SET = [
  { label: "Dropdown", value: "dropdown" },
  { label: "Mutiple Select Dropdown", value: "multiselectdropdown" },
  { label: "Radio Button", value: "radiobutton" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Textbox", value: "textbox" },
  // { label: "Date", value: "date" },
  // { label: "Text Area", value: "textarea" }
];

export const OPTIONS_GMC_DATA_TYPE = [
  { label: "Number", value: "number" },
  { label: "String", value: "text" },
];



export enum AllowedDecisionOptions {
  ACCEPT = "Accept",
  REJECT = "Reject",
}

export const OPTIONS_ACCEPT_REJECT = [
  { label: "Accept", value: AllowedDecisionOptions.ACCEPT },
  { label: "Reject", value: AllowedDecisionOptions.REJECT },
];

export interface IGMCTemplate {
  // Main details
  _id?: string;
  parentTabName: string;
  gmcSubTab: GMCSubTab[];
  isAllowOverwrite: boolean;
  //Business Details
  createdDate: Date;
  createdBy: string;
  modifiedDate: Date;
  modifiedBy: string;
  deletedDate: Date;
  deletedBy: string;
  isDeleted: boolean;
  coverageTypeId: string
  partnerId?: string | IPartner;
  productId?: string | IProduct;
  dayCareFilePath: string
}

export interface IGMCSubTab {
  _id?: number;
  subTabName: string;
  gmcLabelForSubTab: GMCLabelForSubTab[];
  isActive: boolean;
  isChecked: boolean

}

export interface IGMCLabelForSubTab {
  _id?: number;
  labelName: string;
  gmcQuestionAnswers: GMCQuestionAnswers[];
  isActive: boolean;
}

export interface IGMCQuestionAnswers {
  _id?: number;
  weightage: number;
  question: string;
  answer: GMCAnswers[];
  selectedAnswer: any;
  selectedMultipleAnswer: any;
  freeText: boolean;
  freeTextValue: string;
  inputControl: string;
  isActive: boolean;
  parentQuestionId: number;
  parentQuestionText: string;
  isShowInList: boolean;
  isInRenewal: boolean;
  isVisible: boolean;
  isQuestionRequired: boolean;
}

export class GMCTemplate implements IGMCTemplate {
  _id?: string;
  parentTabName: string = "";
  gmcSubTab: GMCSubTab[] = [];
  isAllowOverwrite: boolean = true;
  //Business Details
  createdDate: Date;
  createdBy: string = "";
  modifiedDate: Date;
  modifiedBy: string = "";
  deletedDate: Date;
  deletedBy: string = "";
  isDeleted: boolean = false;
  coverageTypeId: string = ""
  partnerId?: string | IPartner;
  productId?: string | IProduct;
  dayCareFilePath: string
}

export class GMCSubTab implements IGMCSubTab {
  _id?: number;
  subTabName: string;
  gmcLabelForSubTab: GMCLabelForSubTab[];
  isActive: boolean;
  isChecked: boolean
}

export class GMCLabelForSubTab implements IGMCLabelForSubTab {
  _id?: number;
  labelName: string;
  gmcQuestionAnswers: GMCQuestionAnswers[];
  isActive: boolean;
}

export class GMCQuestionAnswers implements IGMCQuestionAnswers {
  _id?: number;
  weightage: number;
  question: string;
  answer: GMCAnswers[];
  selectedAnswer: any;
  selectedMultipleAnswer: any;
  freeText: boolean;
  freeTextValue: string = "";
  inputControl: string;
  isActive: boolean;
  parentQuestionId: number;
  parentQuestionText: string;
  isShowInList: boolean;
  isInRenewal: boolean;
  isVisible: boolean = true;
  isQuestionRequired: boolean = false;


}

export class GradedForm {
  grade: string;
  sumInsured: string;
  additionalColumn: string;
}

export class GradedFormMultiple {
  grade: string;
  sumInsured: string;
  roomEligible: string;
  additionalColumn: string;
}


export class GMCAnswers {
  _id?: number;
  answer: string;
  isSelected: boolean;
  isActive: boolean;
  weightage: number = 1;
  premiumPercentage: number = 0
  isPositive: boolean;
  isDefaultAnswer: boolean;
  showAnsinList: boolean;
  ansDataType: string = ""
  order: number = 1
}
