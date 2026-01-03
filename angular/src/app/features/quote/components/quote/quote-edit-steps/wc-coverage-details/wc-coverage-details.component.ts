import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILovSIDDL, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { WCRatesData, IQuoteSlip, IWCTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
import { IndicativePremiumCalcService } from '../../quote-requisition-tabs/workmen-coverages-tab/indicativepremiumcalc.service';
import { SalarySlabsService } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.service';
import { IWCRates } from 'src/app/features/admin/wc-rates-master/wc-rate-master.model';
import { ISalarySlabs } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.model';
import { WCRatesService } from 'src/app/features/admin/wc-rates-master/wc-rate-master.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { IRole } from 'src/app/features/admin/role/role.model';
import { AccountService } from 'src/app/features/account/account.service';
import { DatePipe } from '@angular/common';
import { IWCListOfValueMaster, WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { MessageService } from 'primeng/api';
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
  selector: 'app-wc-coverage-details',
  templateUrl: './wc-coverage-details.component.html',
  styleUrls: ['./wc-coverage-details.component.scss']
})



export class WcCoverageDetailsComponent implements OnInit {
  xpanded = false;
  medicalExpensesAmountLst: ILovSIDDL[] = []
  medicalExpensesAmountDataList: IWCListOfValueMaster[] = []
  private currentQuote: Subscription;
  quoteId: string = "";
  wcTemplateModel: any;
  wcRatesInfo: WCRatesData[] = []
  safetyMeasuresInfo: any[] = []
  wccoverageTypesFree: IWCCoverageType[] = [];
  wcStandardcoverageType: IWCCoverageType[] = [];
  wccoverageTypesAll: IWCCoverageType[] = [];
  wcMedicalBenifitsYesLstME: any[] = [];
  wcMedicalBenifitsYesLstMEAggregate: any[] = [];
  prvPolicyInfo: any[] = [];
  premiumLst: any[] = [];
  salarySlaRates: ISalarySlabs[]
  wcRatesMaster: IWCRates[]
  updateDisplayMedicalData: any[] = []
  @Input() permissions: PermissionType[] = [];
  optionsMELOV: any[] = [
    { label: 'Medical Extension', value: 'ME' },
    { label: 'Medical Extension AGGREGATE', value: 'ME_AGGREGATE' }
  ];
  selectedActualCheckbox: boolean = false;

  quote: IQuoteSlip;
  role: IRole

  products: any[]
  private currentSelectedTemplate: Subscription;
  constructor(private messageService: MessageService, private datepipe: DatePipe, private cdr: ChangeDetectorRef, private accountService: AccountService, private wcRatesService: WCRatesService, private quoteWcTemplateService: QuoteWcTemplateService,
    private salarySlabsService: SalarySlabsService, private indicativePremiumCalcService: IndicativePremiumCalcService,
    private quoteService: QuoteService, private appService: AppService, private wcCoverageTypeService: WCCoverageTypeService, private wclistofmasterservice: WCListOfValueMasterService
  ) {
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.role = user.roleId as IRole
        console.log(this.role)
      }
    })


    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
        // this.quoteId = this.quote._id;
        // this.wcTemplateModel = this.quote?.wcTemplateDataId;
        // if (this.wcTemplateModel) {
        //   // const amountId=this.wcTemplateModel.underWritermedicalBenifitsAmountId;
        //   // this.wcTemplateModel.underWritermedicalBenifitsAmountId="";
        //   // this.changeDetectorRef.detectChanges();
        //   // this.wcTemplateModel.underWritermedicalBenifitsAmountId=amountId;
        //   if (this.wcTemplateModel.safetyMeasures) {
        //     this.safetyMeasuresInfo.push(this.wcTemplateModel.safetyMeasures);
        //   }
        //   else {
        //     this.safetyMeasuresInfo = []
        //   }

        //   if (this.wcTemplateModel.allmedicalBenifitsYesNo) {
        //     if (!this.wcTemplateModel.isActual && this.wcTemplateModel.medicalBenifitsOption == 'ME') {
        //       var data = {
        //         medicalBenifitsOption: this.wcTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
        //         medicalBenifitsAmount: this.wcTemplateModel.medicalBenifitsAmount
        //       };
        //       this.wcMedicalBenifitsYesLstME = []
        //       this.wcMedicalBenifitsYesLstME.push(data);
        //     }
        //     else {
        //       var _data = {
        //         medicalBenifitsOption: this.wcTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
        //         isActual: this.wcTemplateModel.isActual ? "YES" : "NO",
        //         medicalBenifitsAmount: this.wcTemplateModel.medicalBenifitsAmount
        //       };
        //       this.wcMedicalBenifitsYesLstMEAggregate = []
        //       this.wcMedicalBenifitsYesLstMEAggregate.push(_data);
        //     }
        //   }

        //   //Premium
        //   var premiumInfo = {
        //     targetPremium: this.wcTemplateModel.targetPremium,
        //     indicativePremium: this.wcTemplateModel.indicativePremium,
        //     discountbasedonPremium: this.wcTemplateModel.discountbasedonPremium,
        //     addonCoversAmount: this.wcTemplateModel.addonCoversAmount,

        //     // underWritertargetPremium: this.wcTemplateModel.underWritertargetPremium,
        //     // underWriterindicativePremium: this.wcTemplateModel.underWriterindicativePremium,
        //     // underWriterdiscountbasedonPremium: this.wcTemplateModel.underWriterdiscountbasedonPremium,
        //     // underWriteraddonCoversAmount: this.wcTemplateModel.underWriteraddonCoversAmount
        //   }
        //   this.premiumLst = []
        //   this.premiumLst.push(premiumInfo);

        //   if (this.quote.quoteType == "rollover") {
        //     //policy info
        //     var prvpolicydata = {
        //       previousCompany: this.wcTemplateModel.previousCompany,
        //       previousPolicyno: this.wcTemplateModel.previousPolicyno,
        //       previousStartdate: this.datepipe.transform(this.wcTemplateModel.previousStartdate, 'MM/dd/yyyy'),
        //       previousEnddate: this.datepipe.transform(this.wcTemplateModel.previousEnddate, 'MM/dd/yyyy')
        //     }
        //     this.prvPolicyInfo = []
        //     this.prvPolicyInfo.push(prvpolicydata);
        //   }

        //   if (this.wcTemplateModel.wcDetails.length == 0) {
        //     this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
        //     this.wcRatesInfo = this.wcTemplateModel.wcDetails
        //   }
        //   else {
        //     this.wcRatesInfo = this.wcTemplateModel.wcDetails
        //   }
        // }
        // this.loadCoverageMedicalExpenses();
        // this.loadWCCoverageType();
      }
    });

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.wcTemplateModel = template
        if (this.wcTemplateModel) {
          if (this.wcTemplateModel.safetyMeasures) {
            this.safetyMeasuresInfo.push(this.wcTemplateModel.safetyMeasures);
          }
          else {
            this.safetyMeasuresInfo = []
          }

          if (this.wcTemplateModel.allmedicalBenifitsYesNo) {
            if (!this.wcTemplateModel.isActual && this.wcTemplateModel.medicalBenifitsOption == 'ME') {
              var data = {
                medicalBenifitsOption: this.wcTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
                medicalBenifitsAmount: this.wcTemplateModel.medicalBenifitsAmount
              };
              this.wcMedicalBenifitsYesLstME = []
              this.wcMedicalBenifitsYesLstME.push(data);
            }
            else {
              var _data = {
                medicalBenifitsOption: this.wcTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
                isActual: this.wcTemplateModel.isActual ? "YES" : "NO",
                medicalBenifitsAmount: this.wcTemplateModel.medicalBenifitsAmount
              };
              this.wcMedicalBenifitsYesLstMEAggregate = []
              this.wcMedicalBenifitsYesLstMEAggregate.push(_data);
            }
          }

          //Premium
          var premiumInfo = {
            targetPremium: this.wcTemplateModel.targetPremium,
            indicativePremium: this.wcTemplateModel.indicativePremium,
            discountbasedonPremium: this.wcTemplateModel.discountbasedonPremium,
            addonCoversAmount: this.wcTemplateModel.addonCoversAmount,
          }
          this.premiumLst = []
          this.premiumLst.push(premiumInfo);

          if (this.quote.quoteType == "rollover") {
            //policy info
            var prvpolicydata = {
              previousCompany: this.wcTemplateModel.previousCompany,
              previousPolicyno: this.wcTemplateModel.previousPolicyno,
              previousStartdate: this.datepipe.transform(this.wcTemplateModel.previousStartdate, 'MM/dd/yyyy'),
              previousEnddate: this.datepipe.transform(this.wcTemplateModel.previousEnddate, 'MM/dd/yyyy')
            }
            this.prvPolicyInfo = []
            this.prvPolicyInfo.push(prvpolicydata);
          }

          if (this.wcTemplateModel.wcDetails.length == 0) {
            this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
            this.wcRatesInfo = this.wcTemplateModel.wcDetails
          }
          else {
            this.wcRatesInfo = this.wcTemplateModel.wcDetails
          }
        }
        this.loadCoverageMedicalExpenses();
        this.loadWCCoverageType();
      }
    })
  }



  loadWCCoverageType() {

    this.wcCoverageTypeService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        this.wccoverageTypesAll = records.data.entities;
        this.wccoverageTypesFree = records.data.entities.filter(c => c.isFree && (c.isStandard == undefined || c.isStandard == false));
        this.wcStandardcoverageType = records.data.entities.filter(c => c.isFree && c.isStandard);
        this.getSalarySlabs()
        this.getWcRatesMaster();
      },
      error: e => {
        console.log(e);
      }
    });
  }

  setunderWritermedicalBenifitsOption() {
    //console.log(this.wcTemplateModel.medicalBenifitsOption)
    this.wcTemplateModel.medicalBenifitsAmountId = '';
    this.wcTemplateModel.medicalBenifitsAmount = 0;
    this.wcTemplateModel.isActual = false
    this.wcTemplateModel.addonCoversAmount = 0;

  }
  disableSIDropdown() {

  }
  enableSIDropdown() {

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
        //this.recalPremium("ME")
      }
    }
  }

  async ngOnInit() {
    // this.quoteService.get(this.quote._id).subscribe({
    //   next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //       var wcquote = dto.data.entity;
    //       this.quote=wcquote
    //       this.wcTemplateModel = this.quote?.wcTemplateDataId;
    //       if (this.wcTemplateModel) {
    //         // const amountId=this.wcTemplateModel.underWritermedicalBenifitsAmountId;
    //         // this.wcTemplateModel.underWritermedicalBenifitsAmountId="";
    //         // this.changeDetectorRef.detectChanges();
    //         // this.wcTemplateModel.underWritermedicalBenifitsAmountId=amountId;
    //         if (this.wcTemplateModel.safetyMeasures) {
    //           this.safetyMeasuresInfo.push(this.wcTemplateModel.safetyMeasures);
    //         }
    //         else {
    //           this.safetyMeasuresInfo=[]
    //         }

    //         if(this.wcTemplateModel.allmedicalBenifitsYesNo)
    //         {
    //           if(!this.wcTemplateModel.isActual && this.wcTemplateModel.medicalBenifitsOption=='ME')
    //           {
    //           var data={
    //             medicalBenifitsOption:this.wcTemplateModel.medicalBenifitsOption=="ME"?"Medical Extension" : "Medical Extension AGGREGATE",
    //             medicalBenifitsAmount:this.wcTemplateModel.medicalBenifitsAmount
    //           };
    //           this.wcMedicalBenifitsYesLstME=[]
    //           this.wcMedicalBenifitsYesLstME.push(data);
    //           }
    //           else
    //           {
    //             var _data={
    //               medicalBenifitsOption:this.wcTemplateModel.medicalBenifitsOption=="ME"?"Medical Extension" : "Medical Extension AGGREGATE",
    //               isActual:this.wcTemplateModel.isActual?"YES":"NO",
    //               medicalBenifitsAmount:this.wcTemplateModel.medicalBenifitsAmount
    //             };
    //             this.wcMedicalBenifitsYesLstMEAggregate=[]
    //             this.wcMedicalBenifitsYesLstMEAggregate.push(_data);
    //           }
    //         }

    //         //Premium
    //         var premiumInfo = {
    //           targetPremium: this.wcTemplateModel.targetPremium,
    //           indicativePremium: this.wcTemplateModel.indicativePremium,
    //           discountbasedonPremium: this.wcTemplateModel.discountbasedonPremium,
    //           addonCoversAmount: this.wcTemplateModel.addonCoversAmount,

    //           underWritertargetPremium: this.wcTemplateModel.underWritertargetPremium,
    //           underWriterindicativePremium: this.wcTemplateModel.underWriterindicativePremium,
    //           underWriterdiscountbasedonPremium: this.wcTemplateModel.underWriterdiscountbasedonPremium,
    //           underWriteraddonCoversAmount: this.wcTemplateModel.underWriteraddonCoversAmount
    //         }
    //         this.premiumLst = []
    //         this.premiumLst.push(premiumInfo);

    //         if(this.quote.quoteType=="rollover")
    //         {
    //            //policy info
    //             var prvpolicydata={
    //               previousCompany:this.wcTemplateModel.previousCompany,
    //               previousPolicyno: this.wcTemplateModel.previousPolicyno,
    //               previousStartdate:this.datepipe.transform(this.wcTemplateModel.previousStartdate, 'MM/dd/yyyy'),
    //               previousEnddate: this.datepipe.transform(this.wcTemplateModel.previousEnddate, 'MM/dd/yyyy')
    //             }
    //           this.prvPolicyInfo = []
    //           this.prvPolicyInfo.push(prvpolicydata);
    //           }

    //         if (this.wcTemplateModel.wcDetails.length == 0) {
    //           this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
    //           this.wcRatesInfo = this.wcTemplateModel.wcDetails
    //         }
    //         else {
    //           this.wcRatesInfo = this.wcTemplateModel.wcDetails
    //         }
    //       }
    //     },
    //     error: e => {
    //         console.log(e);
    //     }
    // });
    //this.loadCoverageMedicalExpenses();
  }

  getWcRatesMaster() {
    this.wcRatesService.getRatesMastersByProductId(this.quote?.productId["_id"]).subscribe({
      next: records => {
        this.wcRatesMaster = records.data.entities;
        this.recalPremium('ME')
        this.save(false);
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

  // loadCoverageMedicalExpenses() {
  //   this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.WC_COVERAGE_FOR_MEDICAL_EXPENSES).subscribe({
  //     next: records => {
  //       if(records.data.entities.length>0)
  //         {
  //           records.data.entities = records.data.entities.sort((a, b) => (+a.lovKey < +b.lovKey ? -1 : 1));

  //         }
  //       this.medicalExpensesAmountLst = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id, siAmount: Intl.NumberFormat('en-IN').format(+entity.lovKey).toString() }));
  //       this.medicalExpensesAmountDataList = records.data.entities;
  //     },
  //     error: e => {
  //       console.log(e);
  //     }
  //   });


  // }

  async loadCoverageMedicalExpenses(): Promise<any> {
    return new Promise<void>((resolve, reject) => {

      this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.WC_COVERAGE_FOR_MEDICAL_EXPENSES).subscribe({
        next: (records) => {
          if (records.data.entities.length > 0) {
            records.data.entities = records.data.entities.sort((a, b) => (+a.lovKey < +b.lovKey ? -1 : 1));

          }
          this.medicalExpensesAmountLst = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id, siAmount: Intl.NumberFormat('en-IN').format(+entity.lovKey).toString() }));
          // var local=this.medicalExpensesAmountLst;
          // var id=local.find(x=>x.value=='').value
          this.medicalExpensesAmountDataList = records.data.entities;
          resolve();
        },
        error: e => {
          console.log(e);
          reject();
        }
      });
    });
  }
  recalPremium(data: any) {

    let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
    this.wcTemplateModel.indicativePremium = wcDetails.reduce((sum, current) => sum + current.netPremium, 0);
    this.wcTemplateModel.adjustedPremium = this.wcTemplateModel.indicativePremium * 0.0950796
    this.wcTemplateModel.indicativePremium = this.wcTemplateModel.adjustedPremium + this.wcTemplateModel.addonCoversAmount;
    this.wcTemplateModel.targetPremium = this.wcTemplateModel.indicativePremium;
    let targetpr = +this.wcTemplateModel.indicativePremium * ((100 - +this.wcTemplateModel.discountbasedonPremium) / 100)
    this.wcTemplateModel.targetPremium = targetpr;

    //this.save();
  }

  ngOnDestroy(): void {

    this.currentQuote.unsubscribe();
  }

  save(isFromButton: boolean) {
    let isValid = true;

    if (!this.wcTemplateModel.medicalBenifitsOption || this.wcTemplateModel.medicalBenifitsOption === "") {
      this.displayErrorMessage("Please select Medical Extension Benefit");
      isValid = false;
    } else {
      if (this.wcTemplateModel.medicalBenifitsOption === "ME" || this.wcTemplateModel.medicalBenifitsOption === "ME_AGGREGATE") {
        if (this.wcTemplateModel.medicalBenifitsOption === "ME" && (!this.wcTemplateModel.medicalBenifitsAmountId || this.wcTemplateModel.medicalBenifitsAmountId == '' || this.wcTemplateModel.medicalBenifitsAmountId == undefined)) {
          this.displayErrorMessage("Please select amount for Medical Extension");
          isValid = false;
        } else if (this.wcTemplateModel.medicalBenifitsOption === "ME_AGGREGATE" && !this.wcTemplateModel.isActual && (!this.wcTemplateModel.medicalBenifitsAmountId || this.wcTemplateModel.medicalBenifitsAmountId == '' || this.wcTemplateModel.medicalBenifitsAmountId == undefined)) {
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
      this.setAmount()
      let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
      this.recalPremium('ME')
      //let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
      const updatePayload = this.wcTemplateModel;
      updatePayload.wcDetails = wcDetails
      let updatePayloadQuote = this.quote;
      let totalIndictiveQuoteAmtWithGst = Number(updatePayload.indicativePremium * 0.18)
      updatePayloadQuote.totalIndictiveQuoteAmtWithGst = totalIndictiveQuoteAmtWithGst;
      // this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      //   next: quote => {
      //     console.log("success");
      this.quoteWcTemplateService.updateWCTemplateForUnderWriter(updatePayload).subscribe({
        next: quote => {
          //console.log("WC Updated Successfully");
          if (isFromButton) {
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: `Saved`,
              life: 3000
            });
          }
        },
        error: error => {
          console.log(error);
        }
      });
      //   }, error: error => {
      //     console.log(error);
      //   }
      // });
    }

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

  // saveME() {

  //   let isValid=true;

  //   if (!this.wcTemplateModel.underWritermedicalBenifitsOption || this.wcTemplateModel.underWritermedicalBenifitsOption === "") {
  //     this.displayErrorMessage("Please select Medical Extension Benefit");
  //     isValid = false;
  //   } else {
  //     if (this.wcTemplateModel.underWritermedicalBenifitsOption === "ME" || this.wcTemplateModel.underWritermedicalBenifitsOption === "ME_AGGREGATE") {
  //       if (this.wcTemplateModel.underWritermedicalBenifitsOption === "ME" && (!this.wcTemplateModel.underWritermedicalBenifitsAmount || this.wcTemplateModel.underWritermedicalBenifitsAmount === 0)) {
  //         this.displayErrorMessage("Please select amount for Medical Extension");
  //         isValid = false;
  //       } else if (this.wcTemplateModel.underWritermedicalBenifitsOption === "ME_AGGREGATE" && !this.wcTemplateModel.underWriterisActual && (!this.wcTemplateModel.underWritermedicalBenifitsAmount || this.wcTemplateModel.underWritermedicalBenifitsAmount === 0)) {
  //         this.displayErrorMessage("Please select amount for Medical Extension AGGREGATE");
  //         isValid = false;
  //       } else {
  //         isValid = true;
  //       }
  //     } else {
  //       this.displayErrorMessage("Please select Medical Extension Benefit");
  //       isValid = false;
  //     }
  //   }
  //   if (isValid) {

  //   let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
  //   const updatePayload = this.wcTemplateModel;
  //   updatePayload.wcDetails = wcDetails
  //   // let updatePayloadQuote = this.quote;
  //   // this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
  //   //   next: quote => {
  //   //     console.log("success");
  //   this.quoteWcTemplateService.updateWCTemplateForUnderWriter(updatePayload).subscribe({
  //     next: quote => {
  //       console.log("WC Updated Successfully");
  //     },
  //     error: error => {
  //       console.log(error);
  //     }
  //   });
  //   // },
  //   // error: error => {
  //   //   console.log(error);
  //   // }
  //   // });
  // }

  // }

}

