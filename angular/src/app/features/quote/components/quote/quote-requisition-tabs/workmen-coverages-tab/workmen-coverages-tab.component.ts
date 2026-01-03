import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IWCCoverageType } from '../../../../../admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from '../../../../../admin/wc-coverage-type/wc-coverage-type.service';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { Subscription } from 'rxjs';
import { ILov, ILovSIDDL } from 'src/app/app.model';
import { IQuoteSlip, WCRatesData } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { BusinessTypeService } from 'src/app/features/admin/wc-business-type/wc-business-type.service';
import { SalarySlabsService } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.service';
import { ISalarySlabs } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.model';
import { WCRatesService } from 'src/app/features/admin/wc-rates-master/wc-rate-master.service';
import { IWCRates } from 'src/app/features/admin/wc-rates-master/wc-rate-master.model';
import { IndicativePremiumCalcService } from './indicativepremiumcalc.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { DialogService } from 'primeng/dynamicdialog';
//import { wcQuoteCoverageExtensionsDialogComponent } from '../../wc-quote-coverage-extensions-dialog/wc-quote-coverage-extensions-dialog.component';
//import { WCCoverageForMedicalExpensesService } from 'src/app/features/admin/wc-coverage-for-mefical-expenses/wc-coverage-for-mefical-expenses.service';
//import { IWCCoverageForMedicalExpenses } from 'src/app/features/admin/wc-coverage-for-mefical-expenses/wc-coverage-for-mefical-expenses.model';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { IWCListOfValueMaster, WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-workmen-coverages-tab',
  templateUrl: './workmen-coverages-tab.component.html',
  styleUrls: ['./workmen-coverages-tab.component.scss']
})

export class WorkmenCoveragesTabComponent implements OnInit {
  wccoverageTypesFree: IWCCoverageType[] = [];
  wcStandardcoverageType: IWCCoverageType[] = [];
  wccoverageTypesAll: IWCCoverageType[] = [];
  medicalExpensesAmountLst: ILovSIDDL[] = []
  medicalExpensesAmountDataList: IWCListOfValueMaster[] = []
  totalPremiumAmt: number = 0
  salarySlaRates: ISalarySlabs[]
  wcRatesMaster: IWCRates[]
  quote: IQuoteSlip;
  wcTemplateModel: any = {
    previousStartdate: new Date,
    previousEnddate: null
  };
  wcDetails: WCRatesData[]
  yesNoDDL: ILov[] = []
  medicalAmountDdl: ILov[] = []
  private currentQuote: Subscription;
  natureofEmployee: ILov[] = [];
  descriptionEmployee: ILov[] = [];
  selectedsalaryId: any[];
  isDisabledyesNoDDL: boolean = false;
  // ME/AGGREGATE Dropdown options
  quotePolicyType: string = "";
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  optionsMELOV: any[] = [
    { label: 'Medical Extension', value: 'ME' },
    { label: 'Medical Extension AGGREGATE', value: 'ME_AGGREGATE' }
  ];
  selectedActualCheckbox: boolean = false;
  constructor(private quoteWcTemplateService: QuoteWcTemplateService, private indicativePremiumCalcService: IndicativePremiumCalcService, private salarySlabsService: SalarySlabsService, private router: Router, private wcRatesService: WCRatesService,
    private wcCoverageTypeService: WCCoverageTypeService, private dialogService: DialogService,
    private breadcrumbService: AppBreadcrumbService, private wclistofmasterservice: WCListOfValueMasterService, private quoteService: QuoteService, private businessTypeService: BusinessTypeService, private messageService: MessageService) {
    this.yesNoDDL.push({ label: "Yes", value: "Yes" }, { label: "No", value: "No" })
    this.medicalAmountDdl.push({ label: "0", value: "0" }, { label: "2500", value: "2500" }, { label: "50000", value: "50000" }, { label: "100000", value: "100000" }, { label: "150000", value: "150000" }, { label: "200000", value: "200000" }, { label: "500000", value: "500000" }, { label: "1000000", value: "1000000" })
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quotePolicyType = this.quote?.quoteType;
        // this.wcTemplateModel = this.quote?.wcTemplateDataId;
        // if (this.quote?.wcTemplateDataId != undefined) {
        //   if (this.wcTemplateModel.previousStartdate != "1970-01-01T00:00:00.000Z") {
        //     this.wcTemplateModel.previousStartdate = new Date(this.wcTemplateModel.previousStartdate)
        //   }
        //   if (this.wcTemplateModel.previousEnddate != "1970-01-01T00:00:00.000Z") {
        //     this.wcTemplateModel.previousEnddate = new Date(this.wcTemplateModel.previousEnddate)
        //   }
        // }
        // // else {
        // //   this.wcTemplateModel.previousStartdate = new Date()
        // //   this.wcTemplateModel.previousEnddate = new Date();
        // // }
        // if (this.wcTemplateModel.wcCoverAddOnCovers.length == 0) {
        //   this.loadWCCoverageType();
        // }
        // this.getSalarySlabs()
        // if (this.wcTemplateModel.wcDetails.length == 0 && this.quote.wcRatesDataId) {
        //   this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
        //   this.wcDetails = this.wcTemplateModel.wcDetails
        // }
        // else {
        //   this.wcDetails = this.wcTemplateModel.wcDetails
        // }
        // this.loadCoverageMedicalExpenses();
      }
    })

    
    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.wcTemplateModel = template
        if (this.quote?.wcTemplateDataId != undefined) {
          if (this.wcTemplateModel.previousStartdate != "1970-01-01T00:00:00.000Z") {
            this.wcTemplateModel.previousStartdate = new Date(this.wcTemplateModel.previousStartdate)
          }
          if (this.wcTemplateModel.previousEnddate != "1970-01-01T00:00:00.000Z") {
            this.wcTemplateModel.previousEnddate = new Date(this.wcTemplateModel.previousEnddate)
          }
        }
        if (this.wcTemplateModel.wcCoverAddOnCovers.length == 0) {
          this.loadWCCoverageType();
        }
        this.getSalarySlabs()
        if (this.wcTemplateModel.wcDetails.length == 0 && this.quote.wcRatesDataId) {
          this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
          this.wcDetails = this.wcTemplateModel.wcDetails
        }
        else {
          this.wcDetails = this.wcTemplateModel.wcDetails
        }
        this.loadCoverageMedicalExpenses();
      }
    })

  }
  records: ILov[]
  // OnallmedicalBenifitsYesNoChange() {
  //   if (!this.wcTemplateModel.allmedicalBenifitsYesNo) {
  //     this.wcTemplateModel.medicalBenifitsAns = 'No'
  //     this.wcTemplateModel.medicalBenifitsAmount = 0
  //     this.wcTemplateModel.medicalBenifitsAmountId = ''
  //   }
  //   // if (!this.wcTemplateModel.allmedicalBenifitsYesNo) {
  //   //   if (this.wcDetails.length > 0) {
  //   //     this.wcDetails.forEach(element => {
  //   //       element.medicalBenifitsAns = '';
  //   //     });
  //   //   }
  //   //   this.wcTemplateModel.medicalBenifitsAns = "";
  //   //   this.isDisabledyesNoDDL = false;
  //   // }
  //   // else {
  //   //   this.wcTemplateModel.medicalBenifitsAns = "Yes"; // and amount is required 
  //   //   this.isDisabledyesNoDDL = true;
  //   // }
  // }

  ngOnInit(): void {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        "productId": this.quote.productId["_id"]
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadRecords(lazyLoadEvent);
    //this.wcTemplateModel = this.quote?.wcTemplateDataId;


    //this.wcDetails = this.wcTemplateModel.wcDetails

    if (this.wcTemplateModel.wcCoverAddOnCovers.length == 0) {
      this.loadWCCoverageType();
      this.getSalarySlabs()
    }
    this.getWcRatesMaster();
  }

  // loadCoverageMedicalExpenses(event: LazyLoadEvent) {
  //   this.wcCoverageMedicalExpensesService.getMany(event).subscribe({
  //     next: records => {
  //       if(records.data.entities.length>0)
  //         {
  //           records.data.entities = records.data.entities.sort((a, b) => (a.limitPerEmployee < b.limitPerEmployee ? -1 : 1));

  //         }
  //       this.medicalExpensesAmountLst = records.data.entities.map(entity => ({ label: entity.limitPerEmployee.toString(), value: entity._id, siAmount: Intl.NumberFormat('en-IN').format(entity.limitPerEmployee).toString() }));
  //       this.medicalExpensesAmountDataList = records.data.entities;
  //     },
  //     error: e => {
  //       console.log(e);
  //     }
  //   });
  // }

  setmedicalBenifitsOption() {
    //console.log(this.wcTemplateModel.medicalBenifitsOption)
    this.wcTemplateModel.medicalBenifitsAmountId = '';
    this.wcTemplateModel.medicalBenifitsAmount = 0;
    this.wcTemplateModel.isActual = false
    this.wcTemplateModel.addonCoversAmount = 0;
  }

  onCheckboxChange() {
    if (!this.selectedActualCheckbox) {
      // If untick, enable the SI dropdown
      this.enableSIDropdown();
      this.wcTemplateModel.medicalBenifitsAmountId = '';
      this.wcTemplateModel.medicalBenifitsAmount = 0;
      this.wcTemplateModel.addonCoversAmount = 0;

    } else {
      // If ticked, disable the SI dropdown
      this.disableSIDropdown();
      this.wcTemplateModel.medicalBenifitsAmountId = '';
      this.wcTemplateModel.medicalBenifitsAmount = 0;
      this.wcTemplateModel.addonCoversAmount = 0;
    }

  }
  disableSIDropdown() {

  }
  enableSIDropdown() {

  }
  loadCoverageMedicalExpenses() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.WC_COVERAGE_FOR_MEDICAL_EXPENSES).subscribe({
      next: records => {
        if (records.data.entities.length > 0) {
          records.data.entities = records.data.entities.sort((a, b) => (+a.lovKey < +b.lovKey ? -1 : 1));
        }
        this.medicalExpensesAmountLst = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id, siAmount: Intl.NumberFormat('en-IN').format(+entity.lovKey).toString() }));
        this.medicalExpensesAmountDataList = records.data.entities;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadRecords(event: LazyLoadEvent) {

    console.log(event);

    this.businessTypeService.getMany(event).subscribe({
      next: records => {
        console.log(records);

        this.records = records.data.entities.map(entity => ({ label: entity.businessType, value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadWCCoverageType() {

    this.wcCoverageTypeService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        this.wccoverageTypesAll = records.data.entities;
        this.wccoverageTypesFree = records.data.entities.filter(c => c.isFree && (!c.hasOwnProperty('isStandard') || c.isStandard === undefined || c.isStandard === false));
        this.wcStandardcoverageType = records.data.entities.filter(c => c.isFree && c.isStandard);

      },
      error: e => {
        console.log(e);
      }
    });
  }

  getSalarySlabs() {
    this.salarySlabsService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        this.salarySlaRates = records.data.entities;

      },
      error: e => {
        console.log(e);
      }
    });
  }

  // getBusinessTypeName(businessTypeId) {
  //   if (this.records != undefined) {
  //     return this.records.filter(x => x.value == businessTypeId)[0].label
  //   }
  //   else {
  //     return ""
  //   }

  // }

  getWcRatesMaster() {
    this.wcRatesService.getRatesMastersByProductId(this.quote?.productId["_id"]).subscribe({
      next: records => {
        this.wcRatesMaster = records.data.entities;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  // openCoverageExtension() {
  //   //   const ref = this.dialogService.open(wcQuoteCoverageExtensionsDialogComponent, {
  //   //   header: 'Coverage Extension',
  //   //   width: '700px',
  //   //   styleClass: 'flatPopup task-dialog',
  //   //   })


  //   const ref = this.dialogService.open(wcQuoteCoverageExtensionsDialogComponent, {
  //     header: "Medical Extension Benifits",
  //     width: "50vw",
  //     styleClass: "customPopup",
  //   }).onClose.subscribe(() => {
  //     //load quote
  //   })

  // }
  setAmountandId() {
    if (this.wcTemplateModel.medicalBenifitsAns == "No") {
      this.wcTemplateModel.medicalBenifitsAmount = 0
      this.wcTemplateModel.medicalBenifitsAmountId = ""
      this.wcTemplateModel.addonCoversAmount = 0;
      this.wcTemplateModel.totalPremiumAmt = this.wcTemplateModel.indicativePremium;
      this.wcTemplateModel.totalPremiumAmt = this.wcTemplateModel.indicativePremium + this.wcTemplateModel.addonCoversAmount;
    }
    this.recalPremium();
    this.save()
  }
  setAmount() {

    if (this.wcTemplateModel &&
      this.wcTemplateModel.medicalBenifitsAmountId !== null &&
      this.wcTemplateModel.medicalBenifitsAmountId !== undefined &&
      this.wcTemplateModel.medicalBenifitsAmountId !== "") {
      this.wcTemplateModel.medicalBenifitsAmount = +this.medicalExpensesAmountLst.filter(x => x.value == this.wcTemplateModel.medicalBenifitsAmountId)[0].label;
      if (this.wcTemplateModel.medicalBenifitsAns != "No") {
        let totalSumOfEmployee = this.wcTemplateModel.wcDetails.reduce((sum, current) => sum + +current.noOfEmployees, 0);
        let rate = this.medicalExpensesAmountDataList.filter(x => x._id == this.wcTemplateModel.medicalBenifitsAmountId)[0].lovValue
        this.wcTemplateModel.addonCoversAmount = 0
        this.wcTemplateModel.addonCoversAmount = +totalSumOfEmployee * +rate * 0.086436
        this.recalPremium()
      }
    }
  }
  recalPremium() {
    let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
    this.wcTemplateModel.indicativePremium = wcDetails.reduce((sum, current) => sum + current.netPremium, 0);
    this.wcTemplateModel.adjustedPremium = this.wcTemplateModel.indicativePremium * 0.0950796
    this.wcTemplateModel.indicativePremium = this.wcTemplateModel.adjustedPremium + this.wcTemplateModel.addonCoversAmount;
    this.wcTemplateModel.targetPremium = this.wcTemplateModel.indicativePremium;
    let targetpr = +this.wcTemplateModel.indicativePremium * ((100 - +this.wcTemplateModel.discountbasedonPremium) / 100)
    this.wcTemplateModel.targetPremium = targetpr;

  }


  displayErrorMessage(message) {
    this.messageService.add({
      severity: "error", summary: "Missing Information",
      detail: message, life: 3000
    });
  }

  checkAndShowError(property, message) {
    if (this.wcTemplateModel[property] === undefined || this.wcTemplateModel[property] === "") {
      this.displayErrorMessage(message);
      return;
    }
  }

  showMessage(severity, summary, detail) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  removeLastComma(inputString: string): string {
    if (inputString.endsWith(',')) {
      return inputString.slice(0, -1);
    }
    return inputString;
  }

  save() {
    let isValid = true;

    //#region 
    // if (this.wcTemplateModel.allmedicalBenifitsYesNo || this.wcTemplateModel.allmedicalBenifitsYesNo == 1) {
    //   if (this.wcTemplateModel.medicalBenifitsAns == 'Yes') {
    //     if (!this.wcTemplateModel.medicalBenifitsAmount || this.wcTemplateModel.medicalBenifitsAmount === 0) {
    //       this.messageService.add({
    //         severity: "error", summary: "Missing Information",
    //         detail: "Amount is required if Medical Extension Benifits is allowed (Yes) ", life: 3000
    //       });
    //       isValid = false;
    //     }
    //   }
    //   else {
    //     isValid = true
    //   }
    // }
    // else {
    //   isValid = true
    // }
    //#endregion

    if (!this.wcTemplateModel.medicalBenifitsOption || this.wcTemplateModel.medicalBenifitsOption === "") {
      this.displayErrorMessage("Please select Medical Extension Benefit");
      isValid = false;
    } else {
      if (this.wcTemplateModel.medicalBenifitsOption === "ME" || this.wcTemplateModel.medicalBenifitsOption === "ME_AGGREGATE") {
        if (this.wcTemplateModel.medicalBenifitsOption === "ME" && (!this.wcTemplateModel.medicalBenifitsAmountId || this.wcTemplateModel.medicalBenifitsAmountId =='' || this.wcTemplateModel.medicalBenifitsAmountId ==undefined )) {
          this.displayErrorMessage("Please select amount for Medical Extension");
          isValid = false;
        } else if (this.wcTemplateModel.medicalBenifitsOption === "ME_AGGREGATE" && !this.wcTemplateModel.isActual && (!this.wcTemplateModel.medicalBenifitsAmountId || this.wcTemplateModel.medicalBenifitsAmountId =='' || this.wcTemplateModel.medicalBenifitsAmountId ==undefined)) {
          this.displayErrorMessage("Please select amount for Medical Extension AGGREGATE");
          isValid = false;
        } else {
          isValid = true;
        }
      } else {
        this.displayErrorMessage("Please select Medical Extension Benefit");
        isValid = false;
      }
    }
    if (isValid) {

      if (this.quotePolicyType === "rollover") {
        const model = this.wcTemplateModel;

        if (model.previousStartdate > model.previousEnddate) {
          this.showMessage("error", "Date Error", "Previous policy Start Date should not be greater than End date");
          return;
        }

        //this.checkAndShowError("previousPolicyDetails", "Please enter previous policy details.");
        this.checkAndShowError("previousCompany", "Please enter previous company name.");
        this.checkAndShowError("previousPolicyno", "Please enter previous policy number.");
      }
      this.setAmount()
      let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
      this.recalPremium()
      this.wcTemplateModel.underWriteraddonCoversAmount = this.wcTemplateModel.addonCoversAmount;
      this.wcTemplateModel.underWriterdiscountbasedonPremium = this.wcTemplateModel.discountbasedonPremium;
      this.wcTemplateModel.underWriterindicativePremium = this.wcTemplateModel.indicativePremium;
      this.wcTemplateModel.underWritertargetPremium = this.wcTemplateModel.targetPremium;
      this.wcTemplateModel.underWritertotalPremiumAmt = this.wcTemplateModel.totalPremiumAmt;

      this.wcTemplateModel.underWritermedicalBenifitsAmount = this.wcTemplateModel.medicalBenifitsAmount;
      this.wcTemplateModel.underWritermedicalBenifitsAmountId = this.wcTemplateModel.medicalBenifitsAmountId;
      this.wcTemplateModel.underWritermedicalBenifitsOption = this.wcTemplateModel.medicalBenifitsOption;
      this.wcTemplateModel.underWriterisActual = this.wcTemplateModel.isActual;


      if (this.quotePolicyType == "rollover") {
        //this.wcTemplateModel.previousPolicyDetails = this.wcTemplateModel.previousPolicyDetails;
        this.wcTemplateModel.previousCompany = this.wcTemplateModel.previousCompany;
        this.wcTemplateModel.previousPolicyno = this.wcTemplateModel.previousPolicyno;
        this.wcTemplateModel.previousStartdate = this.wcTemplateModel.previousStartdate;
        this.wcTemplateModel.previousEnddate = this.wcTemplateModel.previousEnddate;
      }
      const updatePayload = this.wcTemplateModel;
      updatePayload.wcDetails = wcDetails

      const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
      const discountbasedonPremium = +this.wcTemplateModel.discountbasedonPremium;
      const totalEmployee = this.wcDetails.reduce((partialSum, a) => partialSum + +a.noOfEmployees, 0);
      const isMEActual = this.wcTemplateModel.isActual;
      const configurationOtcType = productPartnerIcConfigurations[0].productPartnerIcConfigurationId?.otcType;

      const isConfigurationOfTypeBoth = configurationOtcType.includes(AllowedOtcTypes.BOTH)

      if (isConfigurationOfTypeBoth) {
        if (productPartnerIcConfigurations[0].productPartnerIcConfigurationId.wcConfigurationDiscount < discountbasedonPremium || (totalEmployee >= 1000) || isMEActual) {

          let breachedValue = "";
          this.quote.otcType = AllowedOtcTypes.NONOTC;
          this.quote.isOtc = false;
          if (productPartnerIcConfigurations[0].productPartnerIcConfigurationId.wcConfigurationDiscount < discountbasedonPremium) {
            breachedValue = `Discount is more than  ${productPartnerIcConfigurations[0].productPartnerIcConfigurationId.wcConfigurationDiscount},`
          }
          if (isMEActual) {
            breachedValue += `Actual Referral Medical Extension,`
          }
          if (totalEmployee >= 1000) {
            breachedValue += totalEmployee == 1000 ? `Total number of employees: 1000` : `Total number of employees are more than 1000`
          }
          if (breachedValue != '') {
            breachedValue = this.removeLastComma(breachedValue)
          }
          this.quote.nonOtcBreachedValue = breachedValue;

        }
        else {
          this.quote.nonOtcBreachedValue = null;
          this.quote.otcType = AllowedOtcTypes.OTC;
          this.quote.isOtc = true;
        }
      }
      let totalIndictiveQuoteAmtWithGst = Number(this.wcTemplateModel.totalPremiumAmt + this.wcTemplateModel.totalPremiumAmt * 0.18)
      this.quote.totalIndictiveQuoteAmtWithGst = totalIndictiveQuoteAmtWithGst;
      let updatePayloadQuote = this.quote;

      this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
        next: quote => {
          console.log("success");
          this.quoteWcTemplateService.updateArray(this.wcTemplateModel._id, updatePayload).subscribe({
            next: quote => {
              console.log("WC Updated Successfully");
            },
            error: error => {
              console.log(error);
            }
          });
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }

}
