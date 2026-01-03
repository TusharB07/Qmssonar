import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { IQuoteSlip, liabiltyAddOnCovers, liabiltyProductDeductibles, SubjectivityAndMajorExclusions, uploadAttachmentDetails, WCRatesData } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-sub-template-workmenpolicy',
  templateUrl: './sub-template-workmenpolicy.component.html',
  styleUrls: ['./sub-template-workmenpolicy.component.scss']
})
export class SubTemplateWorkmenpolicyComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteId: string = "";
  isNamed: boolean = true;
  wcTemplateModel: any
  wcRatesInfo: WCRatesData[] = []
  safetyMeasuresInfo: any[] = []
  wccoverageTypesFree: IWCCoverageType[] = [];
  wcStandardcoverageType: IWCCoverageType[] = [];
  wccoverageTypesAll: IWCCoverageType[] = [];
  wcMedicalBenifitsYesLstME: any[] = [];
  wcMedicalBenifitsYesLstMEAggregate: any[] = [];
  prvPolicyInfo: any[] = [];
  premiumLst: any[] = [];
  role: IRole
  AllowedRoles = AllowedRoles
  showExclusionAndSubjectivity: boolean = false
  majorExclusions: SubjectivityAndMajorExclusions[] = []
  subjectivities: SubjectivityAndMajorExclusions[] = []
  deductiblesInfo: liabiltyProductDeductibles[] = [];
  private currentSelectedTemplate: Subscription;
  fileDetails: uploadAttachmentDetails[] = [];
  liabiltyCovers: liabiltyAddOnCovers[] = [];



  constructor(private datepipe: DatePipe, private wcTemplateService: QuoteWcTemplateService,
    private accountService: AccountService, private quoteService: QuoteService, private appService: AppService, private wcCoverageTypeService: WCCoverageTypeService) {

    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_UNDERWRITER != role?.name) {
          this.showExclusionAndSubjectivity = false;
        }
        else {
          this.showExclusionAndSubjectivity = true;
        }
      }
    });

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.wcTemplateService.getTemplateById(template._id, template.quoteId).subscribe({
          next: quoteWc => {
            if (quoteWc) {
              this.wcTemplateModel = quoteWc.data.entity;
              if (this.wcTemplateModel) {
                this.liabiltyCovers = this.wcTemplateModel.liabiltyCovers
                this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected)
                this.liabiltyCovers.forEach(element => {
                  if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                    element.optionSelected = 'N/A'
                  }

                  if (element.description == '' || element.description == null || element.description == undefined) {
                    element.description = 'N/A'
                  }
                });
                this.fileDetails = this.wcTemplateModel.basicDetailsAttchments;
                if (this.wcTemplateModel.safetyMeasures) {
                  this.safetyMeasuresInfo = [];
                  this.safetyMeasuresInfo.push(this.wcTemplateModel.safetyMeasures);
                }
                else {
                  this.safetyMeasuresInfo = [];
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
                  addonCoversAmount: this.wcTemplateModel.addonCoversAmount
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
                  this.isNamed = this.wcTemplateModel.tableType  !== 'Unnamed';
                }
                this.deductiblesInfo = this.wcTemplateModel.liabiltyDeductibles
              }
              this.majorExclusions = this.wcTemplateModel.majorExclusions
              this.subjectivities = this.wcTemplateModel.subjectivity
            }
            this.loadWCCoverageType();
          }
        });

      }
    })
  }


  getTotalSalary() {
    let totalSalary = this.wcRatesInfo.reduce((partialSum, a) => partialSum + +a.salaryPerMonth, 0);
    return totalSalary;
  }

  getTotalEmployee() {
    let totalEmployee = this.wcRatesInfo.reduce((partialSum, a) => partialSum + +a.noOfEmployees, 0);
    return totalEmployee
  }


  loadWCCoverageType() {

    this.wcCoverageTypeService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        this.wccoverageTypesAll = records.data.entities;
        this.wccoverageTypesFree = records.data.entities.filter(c => c.isFree && (c.isStandard == undefined || c.isStandard == false));
        this.wcStandardcoverageType = records.data.entities.filter(c => c.isFree && c.isStandard);
      },
      error: e => {
        console.log(e);
      }
    });
  }

  ngOnInit(): void {
    console.log(this.quote)
    // this.currentQuote = this.quoteService.currentQuote$.subscribe({
    //   next: (quote) => {
    //this.quote = quote
    this.quoteId = this.quote._id;
    if (!this.showExclusionAndSubjectivity && !this.quote.insurerProcessedQuotes) {
      if (this.quote.quoteState == 'QCR From Underwritter' || this.quote.quoteState == 'Under Writter Review') {
        this.showExclusionAndSubjectivity = true;
      }
    }
    // this.wcTemplateService.getTemplateById(this.quote?.wcTemplateDataId["_id"], this.quote?.wcTemplateDataId["quoteId"]).subscribe({
    //   next: quoteWc => {
    //     this.wcTemplateModel = quoteWc.data.entity;
    //     if (this.wcTemplateModel) {
    //       this.liabiltyCovers = this.wcTemplateModel.liabiltyCovers
    //       this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected)
    //       this.liabiltyCovers.forEach(element => {
    //         if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
    //           element.optionSelected = 'N/A'
    //         }
    //         if (element.description == '' || element.description == null || element.description == undefined) {
    //           element.description = 'N/A'
    //         }
    //       });
    //       ;
    //       if (this.wcTemplateModel.tableType === 'Unnamed') {
    //         this.isNamed = false;
    //       }
    //       this.fileDetails = this.wcTemplateModel.basicDetailsAttchments;
    //       if (this.wcTemplateModel.safetyMeasures) {
    //         this.safetyMeasuresInfo = [];
    //         this.safetyMeasuresInfo.push(this.wcTemplateModel.safetyMeasures);
    //       }
    //       else {
    //         this.safetyMeasuresInfo = [];
    //       }

    //       if (this.wcTemplateModel.allmedicalBenifitsYesNo) {
    //         if (!this.wcTemplateModel.isActual && this.wcTemplateModel.medicalBenifitsOption == 'ME') {
    //           var data = {
    //             medicalBenifitsOption: this.wcTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
    //             medicalBenifitsAmount: this.wcTemplateModel.medicalBenifitsAmount
    //           };
    //           this.wcMedicalBenifitsYesLstME = []
    //           this.wcMedicalBenifitsYesLstME.push(data);
    //         }
    //         else {
    //           var _data = {
    //             medicalBenifitsOption: this.wcTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
    //             isActual: this.wcTemplateModel.isActual ? "YES" : "NO",
    //             medicalBenifitsAmount: this.wcTemplateModel.medicalBenifitsAmount
    //           };
    //           this.wcMedicalBenifitsYesLstMEAggregate = []
    //           this.wcMedicalBenifitsYesLstMEAggregate.push(_data);
    //         }
    //       }

    //       //Premium
    //       var premiumInfo = {
    //         targetPremium: this.wcTemplateModel.targetPremium,
    //         indicativePremium: this.wcTemplateModel.indicativePremium,
    //         discountbasedonPremium: this.wcTemplateModel.discountbasedonPremium,
    //         addonCoversAmount: this.wcTemplateModel.addonCoversAmount
    //       }
    //       this.premiumLst = []
    //       this.premiumLst.push(premiumInfo);

    //       if (this.quote.quoteType == "rollover") {
    //         //policy info
    //         var prvpolicydata = {
    //           previousCompany: this.wcTemplateModel.previousCompany,
    //           previousPolicyno: this.wcTemplateModel.previousPolicyno,
    //           previousStartdate: this.datepipe.transform(this.wcTemplateModel.previousStartdate, 'MM/dd/yyyy'),
    //           previousEnddate: this.datepipe.transform(this.wcTemplateModel.previousEnddate, 'MM/dd/yyyy')
    //         }
    //         this.prvPolicyInfo = []
    //         this.prvPolicyInfo.push(prvpolicydata);
    //       }
    //       if (this.wcTemplateModel.wcDetails.length == 0) {
    //         this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
    //         this.wcRatesInfo = this.wcTemplateModel.wcDetails
    //       }
    //       else {
    //         this.wcRatesInfo = this.wcTemplateModel.wcDetails
    //       }

    //       this.deductiblesInfo = this.wcTemplateModel.deductibles

    //     }
    //     this.majorExclusions = this.wcTemplateModel.majorExclusions
    //     this.subjectivities = this.wcTemplateModel.subjectivity
    //     this.loadWCCoverageType();

    //   }
    // });


    //   }
    // })
  }

}
