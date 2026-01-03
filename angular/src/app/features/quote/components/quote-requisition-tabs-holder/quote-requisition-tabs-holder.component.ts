import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { AppService } from 'src/app/app.service';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { AllowedOtcTypes, IProductPartnerIcConfigration } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { AllowedProductTemplate, AllowedProductBscCover, IProduct, LocationBasedBscCover, Cateagory, AllowedPushbacks } from 'src/app/features/admin/product/product.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, AllowedQuoteTypes, IDANDOTemplate, IEmployeeData, IEmployeesDemoSummary, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip, IWCTemplate } from 'src/app/features/admin/quote/quote.model';
import { OtcProductLimitExceededConfirmationDialogComponent } from '../../confirmation_dialogs/otc-product-limit-exceeded-confirmation-dialog/otc-product-limit-exceeded-confirmation-dialog.component';
import { OtcQuotePlacementSlipGeneratedDialogComponent } from '../../status_dialogs/otc-quote-placement-slip-generated-dialog/otc-quote-placement-slip-generated-dialog.component';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Subscription } from 'rxjs';
import { GmcCoveragesOptionsDialogComponent } from '../gmc-coverages-options-dialog/gmc-coverages-options-dialog.component';
import { GmcQuoteOnscreenCompareDialogComponent } from '../gmc-quote-onscreen-compare-dialog/gmc-quote-onscreen-compare-dialog.component';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { EditQuoteLocationSumInsuredDialogComponent } from '../edit-quote-location-sum-insured-dialog/edit-quote-location-sum-insured-dialog.component';
import { EditSumSiConfimationDialogComponent } from '../edit-sum-si-confimation-dialog/edit-sum-si-confimation-dialog.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ChartModule } from 'primeng/chart';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { LiabilityCurrencyDialogComponent } from '../quote/liability-currency-dialog/liability-currency-dialog.component';
import { EditOptionsConfimationDialogComponent } from '../edit-options-confirmation-dialog/edit-options-confirmation-dialog.component';
import { ICoverageType } from 'src/app/features/admin/coverageTypes/coveragetypes.model';
import { EmpRatesService } from 'src/app/features/admin/emp-ratesTemplates/emprates.service';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { BasicDetailsCGLTabComponent } from '../quote/quote-requisition-tabs/liabilityCGLProductsTabs/basic-details-cgl-tab/basic-details-cgl-tab.component';
import { EmployeeDemographicTabComponent } from '../quote/quote-requisition-tabs/employee-demographic-tab/employee-demographic-tab.component';
import { CostContainmentTabComponent } from '../quote/quote-requisition-tabs/cost-containment-tab/cost-containment-tab.component';
import { FamilyCompositionTabComponent } from '../quote/quote-requisition-tabs/family-composition-tab/family-composition-tab.component';
import { GmcCoveregesTabComponent } from '../quote/quote-requisition-tabs/gmc-covereges-tab/gmc-covereges-tab.component';
import { GmcOtherdetailsTabComponent } from '../quote/quote-requisition-tabs/gmc-otherdetails-tab/gmc-otherdetails-tab.component';
import { FinalRaterTabComponent } from '../quote/quote-requisition-tabs/final-rater-tab/final-rater-tab.component';
import { MaternityBenifitsTabComponent } from '../quote/quote-requisition-tabs/maternity-benifits-tab/maternity-benifits-tab.component';
import { LiabilityOptionsDialogComponent } from '../liability-options-dialog/liability-options-dialog.component';
import { IndicativePremiumCalcService } from '../quote/quote-requisition-tabs/workmen-coverages-tab/indicativepremiumcalc.service';
import { QuoteOptionListDialogComponent } from '../../pages/quote-insurer-review-page/quote-option-list-dialog/quote-option-list-dialog.component';
import { LiabilityQuoteOnscreenCompareDialogComponent } from '../liability-quote-onscreen-compare-dialog/liability-quote-onscreen-compare-dialog.component';
export enum AllowedQuoteCurrency {
  RUPEE = '₹ Rupee',
  DOLLAR = '$ Dollar',
}
@Component({
  selector: "app-quote-requisition-tabs-holder",
  templateUrl: "./quote-requisition-tabs-holder.component.html",
  styleUrls: ["./quote-requisition-tabs-holder.component.scss"]
})
export class QuoteRequisitionTabsHolderComponent implements OnInit, OnDestroy {

  //GMC
  @ViewChild(EmployeeDemographicTabComponent) employeeDemographicTabComponent: EmployeeDemographicTabComponent;
  @ViewChild(CostContainmentTabComponent) costContainmentTabComponent: CostContainmentTabComponent;
  @ViewChild(FamilyCompositionTabComponent) familyCompositionTabComponent: FamilyCompositionTabComponent;
  @ViewChild(GmcCoveregesTabComponent) gmcCoveregesTabComponent: GmcCoveregesTabComponent;
  @ViewChild(GmcOtherdetailsTabComponent) gmcOtherdetailsTabComponent: GmcOtherdetailsTabComponent;
  @ViewChild(MaternityBenifitsTabComponent) maternityBenifitsTabComponent: MaternityBenifitsTabComponent;
  @ViewChild(FinalRaterTabComponent) finalRaterTabComponent: FinalRaterTabComponent;

  @Input() quote: IQuoteSlip;
  private currentQuoteOptions: Subscription;
  private currentSelectedTemplate: Subscription;
  id: string;
  data: any;

  options: any;

  selectedQuoteTemplate: IQuoteGmcTemplate;
  selectedQuoteTemplateForCompare: IQuoteGmcTemplate[];
  optionsQuoteOptions: ILov[] = [];
  quoteGmcOptionsLst: IQuoteGmcTemplate[];
  AllowedProductTemplate = AllowedProductTemplate;
  AllowedPushbacks = AllowedPushbacks;
  selectedOptions: ILov[] = [];
  showCompareOption: boolean = false;
  showWCDiv: boolean = false;
  showOtherLiabilityDiv: boolean = false;
  wcQuoteTemplate: IWCTemplate;
  isMobile: boolean = false;
  //quoteDandOOptions: any
  quoteCLOptions: any
  quoteEandOOptions: any
  //quoteCGLOptions: any
  // quotePLOptions: any
  selectedQuoteOption: any
  formCompletionPercentage: number = 0
  //quotePublicLiabilityOptions: any
  selectedView = "₹ Rupee"
  selectedOptionName = '';
  optionsViewTypes = [
    { label: '₹ Rupee', code: AllowedQuoteCurrency.RUPEE, icon: 'pi pi-list' },
    { label: '$ Dollar', code: AllowedQuoteCurrency.DOLLAR, icon: 'pi pi-table' },
  ];
  quoteLocationOccupancies: IQuoteLocationOccupancy[];

  showBackToDraft: boolean = false;
  coverageTypeLst: ICoverageType[];
  employeeInfo: IEmployeesDemoSummary[] = [];
  calculatedPremium: number = 0;
  private currentQuote: Subscription;

  ratesInfo: any;
  empDatawithGrades: IEmployeeData[] = []
  earthquakeRiskScore = null;
  earthquakeLossCosts = null;
  FloodRiskScore = null;
  FloodLossCosts = null;
  indicativePremiumLiability: number = 0;
  isOccuranceFormSelected: boolean = false;
  progressValue: number = 10
  private currentUser: Subscription;
  user: IUser;
  routToDraft: boolean = false;

  onLoadQuoteOption: string
  @Input() quoteOptionData: IQuoteOption
  selectedQuoteOptionOfProperty: string
  private currentPropertyQuoteOption: Subscription;
  allQuoteOptionDropdown: ILov[]
  visibleSidebar: boolean;

  quoteOptionsLst: any[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private router: Router,
    private appService: AppService,
    private dialogService: DialogService,
    private quoteService: QuoteService,
    private messageService: MessageService,
    private deviceService: DeviceDetectorService,
    private empRateService: EmpRatesService,
    private wclistofmasterservice: WCListOfValueMasterService,
    private qoutegmctemplateserviceService: QoutegmctemplateserviceService,
    private accountService: AccountService,
    private quoteOptionService: QuoteOptionService,
    private liabilityTemplateService: liabilityTemplateService
  ) {

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: template => {
        this.selectedQuoteTemplate = template;
        this.selectedQuoteOption = template._id;
        this.selectedOptionName = template.optionName
        if (this.quote != null) {
          if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
            this.progressValue = this.calculateProgressValue(this.selectedQuoteTemplate);
          }
        }
        // if (this.selectedQuoteTemplate.calculatedPremium == 0) {
        //   this.getEmployeesDemographySummary()
        // }
      }
    });

    //GET Observable quote gmc options
    this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
      next: (quoteOptions: any[]) => {
        //Get LOV for DDL
        if (quoteOptions != null) {
          if (this.quote != null) {
            this.selectedQuoteTemplateForCompare = quoteOptions.filter(x => x.version == this.quote.qcrVersion);
            this.optionsQuoteOptions = quoteOptions.filter(x => x.version == this.quote.qcrVersion).map(entity => ({ label: entity.optionName, value: entity._id })); // Set the Id to this component
            const templateOption = this.selectedQuoteTemplateForCompare.filter(x => x._id == this.selectedQuoteTemplate._id && x.version == this.quote.qcrVersion)[0];
            this.loadSelectedOption(templateOption);
          }
        }
      }
    });

    this.currentUser = this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
        if (this.user.roleId["name"] == 'sales_creator_and_approver') this.routToDraft = true;
      }
    });

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto
        this.onLoadQuoteOption = this?.quoteOptionData?._id
        this.selectedQuoteOptionOfProperty = this.onLoadQuoteOption
      }
    });
  }

  getEmployeesDemographySummary() {
    let payload = {};
    payload['quoteId'] = this.quote._id;
    payload['fileType'] = this.selectedQuoteTemplate.fileUploadType;
    this.quoteService.viewEmployeesSummary(payload).subscribe({
      next: summary => {
        if (summary.status == "success") {
          this.employeeInfo = summary.data.entities;
          this.calculatePremium();
        } else {
          this.messageService.add({
            severity: 'fail',
            summary: "Failed to Show",
            detail: `${summary.status}`, //"error" TODO: Check
          })
        }
      }
    })
  }

  calculateProgressValue(template: IQuoteGmcTemplate): number {
    let totalQuestions = 0;
    let answeredQuestions = 0;

    // Iterate through all the GMC templates
    template.gmcTemplateData.forEach((gmcTemplate) => {
      gmcTemplate.gmcSubTab.forEach((subTab) => {
        subTab.gmcLabelForSubTab.forEach((label) => {
          label.gmcQuestionAnswers.forEach((question) => {
            totalQuestions++;
            if (question.selectedAnswer !== "" || question.freeTextValue.trim() !== "") {
              answeredQuestions++;
            }

          });
        });
      });
    });

    // Calculate the percentage of questions answered
    return totalQuestions === 0 ? 0 : (answeredQuestions / totalQuestions) * 100;
  }
  calculatePremium() {
    //ratesInfo
    let totalEMpCount = 0
    let totalSpouseCount = 0
    let totalCount = 0
    this.calculatedPremium = 0
    const CoverageType = this.selectedQuoteTemplate.coverageTypeName;
    let substrCoverageTypeEmployee = 'E'
    let substrCoverageTypeSpouse = 'S'
    let substrCoverageTypeChild = 'C'
    let substrCoverageTypeSibling = 'L'
    let substrCoverageTypeParent = 'P'
    if (CoverageType.includes(substrCoverageTypeEmployee)) {
      const sum = this.employeeInfo.reduce((sum, current) => sum + current.selfCount, 0);
      totalEMpCount = totalEMpCount + sum;
    }
    if (CoverageType.includes(substrCoverageTypeSpouse)) {
      const sum = this.employeeInfo.reduce((sum, current) => sum + current.spouseCount, 0);
      totalEMpCount = totalEMpCount + sum;
    }
    if (CoverageType.includes(substrCoverageTypeChild)) {
      const sum = this.employeeInfo.reduce((sum, current) => sum + current.childCount, 0);
      totalEMpCount = totalEMpCount + sum;
    }
    if (CoverageType.includes(substrCoverageTypeSibling)) {
      const sum = this.employeeInfo.reduce((sum, current) => sum + current.siblingsCount, 0);
      totalEMpCount = totalEMpCount + sum;
    }
    if (CoverageType.includes(substrCoverageTypeParent)) {
      const sum = this.employeeInfo.reduce((sum, current) => sum + current.parentCount, 0);
      totalEMpCount = totalEMpCount + sum;
    }
    if (this.selectedQuoteTemplate.planType == "Floater") {
      if (this.selectedQuoteTemplate.siType == "Flat") {
        this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
          next: (dto: IManyResponseDto<any>) => {
            this.ratesInfo = dto.data.entities
            if (this.ratesInfo != undefined || this.ratesInfo != null) {
              const SIAmount = this.selectedQuoteTemplate.siFlat
              const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == SIAmount);
              if (ratesASPerSI != undefined) {
                //Calculate Premium
                const siRates = ratesASPerSI[0].siRates;
                this.calculateRateWisePremium(CoverageType, siRates);
              }
            }
            else {
              //this.calculatedPremium = 0
            }
            this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
            const updatePayload = this.selectedQuoteTemplate;
            this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
              next: partner => {
              },
              error: error => {
                console.log(error);
              }
            });
          },
          error: e => {
            console.log(e)
          }
        });
      }
      else {
        this.quoteService.empGradewiseDataByQuoteId(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<any>) => {
            this.empDatawithGrades = dto.data.entity.employeeData;
            this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
              next: (dto: IManyResponseDto<any>) => {
                this.ratesInfo = dto.data.entities
                if (this.ratesInfo != undefined || this.ratesInfo != null) {
                  this.selectedQuoteTemplate.gmcGradedSILst.forEach(elementGraded => {
                    let empWithGrades = this.empDatawithGrades.filter(x => x.designation == elementGraded.grade)
                    const SIAmount = +elementGraded.siAmount.label
                    const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == SIAmount);
                    if (ratesASPerSI != undefined) {
                      const siRates = ratesASPerSI[0].siRates;
                      //this.calculatedPremium = 0
                      this.calculateRateWisePremiumGraded(CoverageType, siRates, empWithGrades);
                    }
                  });
                }
                else {
                  this.calculatedPremium = 0
                }
                this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
                const updatePayload = this.selectedQuoteTemplate;
                this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                  next: partner => {
                  },
                  error: error => {
                    console.log(error);
                  }
                });
              },
              error: e => {
                console.log(e)
              }
            });
          },
          error: e => {
            console.log(e)
          }
        });

      }
    }
    else {
      //Individual
      this.quoteService.empGradewiseDataByQuoteId(this.quote._id).subscribe({
        next: (dto: IOneResponseDto<any>) => {
          this.empDatawithGrades = dto.data.entity.employeeData;
          this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
            next: (dto: IManyResponseDto<any>) => {
              this.ratesInfo = dto.data.entities
              if (this.ratesInfo != undefined || this.ratesInfo != null) {
                this.calculateIndividualPremiumGraded(CoverageType, this.ratesInfo, this.empDatawithGrades);
              }
              else {
                this.calculatedPremium = 0
              }
              this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
              const updatePayload = this.selectedQuoteTemplate;
              this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                next: partner => {
                },
                error: error => {
                  console.log(error);
                }
              });
            },
            error: e => {
              console.log(e)
            }
          });
        },
        error: e => {
          console.log(e)
        }
      });
    }


    const updatePayload = this.selectedQuoteTemplate

    this.qoutegmctemplateserviceService.updateArray(updatePayload._id, updatePayload).subscribe({
      next: partner => {
      },
      error: error => {
        console.log(error);
      }
    });

  }

  calculateRateWisePremium(CoverageType: string, siRates: any) {
    this.calculatedPremium = 0
    let substrCoverageTypeEmployee = 'E'
    let substrCoverageTypeSpouse = 'S'
    let substrCoverageTypeChild = 'C'
    let substrCoverageTypeSibling = 'L'
    let substrCoverageTypeParent = 'P'
    this.employeeInfo.forEach(element => {
      let ageBandWiseRate = []
      if (CoverageType.includes(substrCoverageTypeEmployee)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Self'))
      }
      if (CoverageType.includes(substrCoverageTypeSpouse)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Spouse'))
      }
      if (CoverageType.includes(substrCoverageTypeChild)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Child'))
      }
      if (CoverageType.includes(substrCoverageTypeSibling)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Siblings'))
      }
      if (CoverageType.includes(substrCoverageTypeParent)) {
        ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Parent'))
      }
      ageBandWiseRate.forEach(elementAge => {
        switch (elementAge.relation) {
          case 'Self': {
            //statements; 
            if (element.selfCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.selfCount * elementAge.premium);
            }
            break;
          }
          case 'Spouse': {
            //statements; 
            if (element.spouseCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.spouseCount * elementAge.premium);
            }
            break;
          }
          case 'Child': {
            //statements; 
            if (element.childCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.childCount * elementAge.premium);
            }
            break;
          }
          case 'Parent': {
            //statements; 
            if (element.parentCount > 0) {
              let totalParentCount = element.parentCount
              this.calculatedPremium = this.calculatedPremium + (totalParentCount * elementAge.premium);
            }
            break;
          }
          case 'Siblings': {
            //statements; 
            if (element.siblingsCount > 0) {
              this.calculatedPremium = this.calculatedPremium + (element.siblingsCount * elementAge.premium);
            }
            break;
          }
          default: {
            //statements; 
            break;
          }
        }
      });
    });
  }

  calculateIndividualPremiumGraded(CoverageType: string, siRates: any, empWithGrades: any) {
    let substrCoverageTypeEmployee = 'E'
    let substrCoverageTypeSpouse = 'S'
    let substrCoverageTypeChild = 'C'
    let substrCoverageTypeSibling = 'L'
    let substrCoverageTypeParent = 'P'
    let ageBandWiseRate = []

    if (CoverageType.includes(substrCoverageTypeEmployee)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Self');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo && x.relation == 'Self'))
        }
      });
    }

    if (CoverageType.includes(substrCoverageTypeSpouse)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Spouse');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo && x.relation == 'Spouse'))
        }
      });
    }

    if (CoverageType.includes(substrCoverageTypeChild)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Child');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Child'))
        }
      });
    }

    if (CoverageType.includes(substrCoverageTypeSibling)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Siblings');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Siblings'))
        }
      });
    }

    if (CoverageType.includes(substrCoverageTypeParent)) {
      let allEmp = empWithGrades.filter(x => x.relationShip == 'Parent');
      allEmp.forEach(elementE => {
        const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
        if (ratesASPerSI != undefined) {
          const siRates = ratesASPerSI[0].siRates;
          ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
            x.relation == 'Parent'))
        }
      });
    }

    this.calculatedPremium = 0
    ageBandWiseRate.forEach(elementAge => {
      switch (elementAge.relation) {
        case 'Self': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
          break;
        }
        case 'Spouse': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
          break;
        }
        case 'Child': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
          break;
        }
        case 'Parent': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
          break;
        }
        case 'Siblings': {
          //statements; 
          this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
          break;
        }
        default: {
          //statements; 
          break;
        }
      }
    });
  }

  calculateRateWisePremiumGraded(CoverageType: string, siRates: any, empWithGrades: any) {
    let substrCoverageTypeEmployee = 'E'
    let substrCoverageTypeSpouse = 'S'
    let substrCoverageTypeChild = 'C'
    let substrCoverageTypeSibling = 'L'
    let substrCoverageTypeParent = 'P'

    let selfCount = 0;
    let spouseCount = 0;
    let childCount = 0;
    let parentCount = 0;
    let siblingCount = 0;

    if (CoverageType.includes(substrCoverageTypeEmployee)) {
      selfCount = empWithGrades.filter(x => x.relationShip == 'Self').length;
    }
    if (CoverageType.includes(substrCoverageTypeSpouse)) {
      spouseCount = empWithGrades.filter(x => x.relationShip == 'Spouse').length;
    }
    if (CoverageType.includes(substrCoverageTypeChild)) {
      childCount = empWithGrades.filter(x => x.relationShip == 'Child').length;
    }
    if (CoverageType.includes(substrCoverageTypeSibling)) {
      siblingCount = empWithGrades.filter(x => x.relationShip == 'Siblings').length;
    }
    if (CoverageType.includes(substrCoverageTypeParent)) {
      parentCount = empWithGrades.filter(x => x.relationShip == 'Parent').length;
    }


    empWithGrades.forEach(element => {
      let ageBandWiseRate = []
      if (element.relationShip == 'Self') {
        if (CoverageType.includes(substrCoverageTypeEmployee)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo && x.relation == 'Self'))
        }
      }
      if (element.relationShip == 'Spouse') {
        if (CoverageType.includes(substrCoverageTypeSpouse)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo && x.relation == 'Spouse'))
        }
      }
      if (element.relationShip == 'Child') {
        if (CoverageType.includes(substrCoverageTypeChild)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo && x.relation == 'Child'))
        }
      }
      if (element.relationShip == 'Siblings') {
        if (CoverageType.includes(substrCoverageTypeSibling)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo && x.relation == 'Siblings'))
        }
      }
      if (element.relationShip == 'Parent') {
        if (CoverageType.includes(substrCoverageTypeParent)) {
          ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo && x.relation == 'Parent'))
        }
      }
      ageBandWiseRate.forEach(elementAge => {
        switch (elementAge.relation) {
          case 'Self': {
            //statements; 
            if (selfCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Spouse': {
            //statements; 
            if (spouseCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Child': {
            //statements; 
            if (childCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Parent': {
            //statements; 
            if (parentCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          case 'Siblings': {
            //statements; 
            if (siblingCount != undefined) {
              this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
            }
            break;
          }
          default: {
            //statements; 
            break;
          }
        }
      });
    });

  }

  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['A'],
      datasets: [
        {
          data: [100],
          backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500')],
          hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400')]
        }
      ]
    };


    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };

    this.isMobile = this.deviceService.isMobile();

    if (this.quote.productId['categoryId'] &&
      (this.quote.productId['categoryId']['name'] == 'Property'
        || (this.quote.productId['categoryId']['name'] == 'People Solutions'
          || this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_CGL
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_CRIME
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_CYBER
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_EANDO
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_PRODUCT
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_PUBLIC
          || this.quote.productId['productTemplate'] != AllowedProductTemplate.WORKMENSCOMPENSATION)

      ) &&
      (this.user.roleId["name"] != AllowedRoles.SALES_APPROVER &&
        this.user.roleId["name"] != AllowedRoles.PLACEMENT_APPROVER)) {
      this.showBackToDraft = true
    }

    // this condition is work only if quote category is "PROPERTY" and to avoid get error if category is not "PROPERTY" 
    if (this.activatedRoute.snapshot.queryParams?.quoteOptionId) {
      this.getQuoteOptions()
    }
    this.loadQuoteLocationOccupancies();
    this.loadTabs();
    //this.getOptionsLiability()
  }

  changeView($event) {
    this.selectedView = $event
    if (this.selectedView == '$ Dollar') {
      this.dialogService.open(LiabilityCurrencyDialogComponent, {
        data: {
          quote: this.quote,
        },
        width: '650px',
        styleClass: "flatPopup"
      }).onClose.subscribe((action: boolean) => {
        this.quoteService.get(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<IQuoteSlip>) => {
            this.quoteService.setQuote(dto.data.entity)
          },
          error: e => {
            console.log(e);
          }
        });
      })
    }
    else {
      this.quoteService.update(this.quote._id, { dollarRate: 1, selectedCurrency: '₹ Rupee' }).subscribe({
        next: (dto: IOneResponseDto<IQuoteSlip>) => {

          this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
              this.quote = dto.data.entity;
              this.selectedView = this.quote.selectedCurrency;
              this.quoteService.refresh();
              this.loadTabs()
            },
            error: e => {
              console.log(e);
            }
          });
        },
        error: e => {
          console.log(e);
        }
      });
    }
  }

  // Handle Quote Location Occupancy
  optionsQuoteLocationOccupancies: ILov[];
  selectedQuoteLocationOccupancy: ILov;
  loadQuoteLocationOccupancies() {
    // Old_Quote
    // let lazyLoadEvent: LazyLoadEvent = {
    //   first: 0,
    //   rows: 20,
    //   sortField: null,
    //   sortOrder: 1,
    //   filters: {
    //     // @ts-ignore
    //     quoteId: [
    //       {
    //         value: this.quote._id,
    //         matchMode: "equals",
    //         operator: "and"
    //       }
    //     ]
    //   },
    //   globalFilter: null,
    //   multiSortMeta: null
    // };

    // New_Quote_Option
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        quoteOptionId: [
          {
            value: this.onLoadQuoteOption,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };


    this.quoteLocationOccupancyService.getMany(lazyLoadEvent).subscribe({
      next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
        this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IQuoteLocationOccupancy) => {
          let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation;
          let pincode: IPincode = entity.pincodeId as IPincode;
          return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id };
        });

        this.selectedQuoteLocationOccupancy = this.activatedRoute.snapshot.queryParams.location;

        this.optionsQuoteLocationOccupancies = this.optionsQuoteLocationOccupancies.map((lov: ILov) =>
          lov.value == this.quoteOptionData?.locationBasedCovers?.higherSumAssuredLocation?._id ? { value: lov.value, label: `* ${lov.label.replace("*", "")}` } : lov
        );
      },
      error: e => { }
    });
  }

  onChangeQuoteLocationOccupancy(quoteLocationOccupancyId) {
    this.router.navigateByUrl(
      this.appService.routes.quotes.requisition(this.quote._id, {
        params: {
          ...this.activatedRoute.snapshot.queryParams,
          ...{
            location: quoteLocationOccupancyId,
          }
        }
      })
    );
  }

  // Handle Tabs
  tabs: MenuItem[] = [];
  tabIndex: number;

  loadTabs() {
    const product: IProduct = this.quote.productId as IProduct;

    switch (product?.productTemplate) {
      case AllowedProductTemplate.BLUS:
        this.tabs.push({ label: "Sections & Deductibles", fragment: "app-sum-insured-details-tab" });
        // this.tabs.push({ label: "Business Suraksha Covers", fragment: "app-business-suraksha-covers-tab" });
        this.tabs.push({ label: "Risk Management Features", fragment: "app-risk-management-feature-tab" });
        if (this.user.partnerId['isRiskInspection'] == true) {
          this.tabs.push({ label: "Risk Inspection Status & Claim Experience", fragment: "app-risk-inspection-status-and-claim-experience-tab" });
        }
        this.tabs.push({ label: "Claim Experience & Other Details", fragment: "app-other-details-tab" });
        this.tabs.push({ label: "Gap Analysis", fragment: "app-gap-analysis-tab" });
        break;
      case AllowedProductTemplate.FIRE:
        this.tabs = [];
        this.tabs.push({ label: "Indicative Quote", fragment: "app-indicative-quote-tab" });
        this.tabs.push({ label: "Sections & Deductibles", fragment: "app-sum-insured-details-tab" });
        // this.tabs.push({ label: "Risk Management Features", fragment: "app-risk-management-feature-tab" });
        // if (this.quote.quoteType == AllowedQuoteTypes.EXISTING) {
        if (this.user.partnerId['isRiskInspection'] == true) {
          this.tabs.push({ label: "Risk Inspection Status & Claim Experience", fragment: "app-risk-inspection-status-and-claim-experience-tab" });
        }
        // }
        // this.tabs.push({ label: "Standard Addons ", fragment: 'app-standard-addons-tab' });
        this.tabs.push({ label: "Claim Experience & Other Details", fragment: "app-other-details-tab" });
        this.tabs.push({ label: "Gap Analysis Report", fragment: "app-gap-analysis-tab" });
        break;
      case AllowedProductTemplate.IAR:
        this.tabs = [];
        this.tabs.push({ label: "Indicative Quote", fragment: "app-indicative-quote-tab" });
        this.tabs.push({ label: "Sections & Deductibles", fragment: "app-sum-insured-details-tab" });
        if (product.shortName == "EAR" || product.shortName == "CAR") {
          this.tabs.push({ label: "Installment", fragment: "app-installment-tab" });
        }
        // this.tabs.push({ label: "Risk Management Features", fragment: "app-risk-management-feature-tab" });
        // if (this.quote.quoteType == AllowedQuoteTypes.EXISTING) {
        if (this.user.partnerId['isRiskInspection']) {
          this.tabs.push({ label: "Risk Inspection Status & Claim Experience", fragment: "app-risk-inspection-status-and-claim-experience-tab" });// }
        }
        // this.tabs.push({ label: "Standard Addons ", fragment: 'app-standard-addons-tab' });
        this.tabs.push({ label: "Claim Experience & Other Details", fragment: "app-other-details-tab" });
        this.tabs.push({ label: "Gap Analysis Report", fragment: "app-gap-analysis-tab" });
        break;
      case AllowedProductTemplate.GMC:
        this.showCompareOption = true;
        if (this.quote.quoteType != "new") {
          if (product.type.toLowerCase() != "group health policy" && product.type.toLowerCase() != "group health policy top up") {
            this.tabs = [
              { label: "Basic Details", fragment: "app-employee-demographic-tab" },
              { label: "Family Composition", fragment: "app-family-composition-tab" },
              { label: "Standard Coverages", fragment: "app-gmc-covereges-tab" },
              { label: "Enhanced Covers", fragment: "app-gmc-enhanced-covers-tab" },
              { label: "Other Details", fragment: "app-gmc-otherdetails-tab" },
            ];
          }
          else {
            //renewal
            this.tabs = [
              { label: "Basic Details", fragment: "app-employee-demographic-tab" },
              { label: "Family Composition", fragment: "app-family-composition-tab" },
              { label: "Standard Coverages", fragment: "app-gmc-covereges-tab" },
              { label: "Maternity Benifits", fragment: "app-maternity-benifits-tab" },
              { label: "Enhanced Covers", fragment: "app-gmc-enhanced-covers-tab" },
              { label: "Other Restrictions", fragment: "app-cost-containment-tab" },
              { label: "Other Details", fragment: "app-gmc-otherdetails-tab" },
            ];
          }
        } else {
          //new
          // if (product.type == "Group Personal Accident Policy") {

          // }
          if (product.type.toLowerCase() != "group health policy" && product.type.toLowerCase() != "group health policy top up") {
            this.tabs = [
              { label: "Basic Details", fragment: "app-employee-demographic-tab" },
              { label: "Family Composition", fragment: "app-family-composition-tab" },
              { label: "Standard Coverages", fragment: "app-gmc-covereges-tab" },
              { label: "Enhanced Covers", fragment: "app-gmc-enhanced-covers-tab" },
              { label: "Other Details", fragment: "app-gmc-otherdetails-tab" },
            ];
          }
          else {

            if (product.type.toLowerCase() == "group health policy top up") {
              this.tabs = [
                { label: "Basic Details", fragment: "app-employee-demographic-tab" },
                { label: "Family Composition", fragment: "app-family-composition-tab" },
                { label: "Standard Coverages", fragment: "app-gmc-covereges-tab" },
                { label: "Other Restrictions", fragment: "app-cost-containment-tab" },
                { label: "Other Details", fragment: "app-gmc-otherdetails-tab" },
              ];
            } else {
              this.tabs = [
                { label: "Basic Details", fragment: "app-employee-demographic-tab" },
                { label: "Family Composition", fragment: "app-family-composition-tab" },
                { label: "Standard Coverages", fragment: "app-gmc-covereges-tab" },
                { label: "Maternity Benifits", fragment: "app-maternity-benifits-tab" },
                { label: "Enhanced Covers", fragment: "app-gmc-enhanced-covers-tab" },
                { label: "Other Restrictions", fragment: "app-cost-containment-tab" },
                { label: "Other Details", fragment: "app-gmc-otherdetails-tab" },
              ];
            }

            // this.tabs = [
            //   { label: "Basic Details", fragment: "app-employee-demographic-tab" },
            //   { label: "Family Composition", fragment: "app-family-composition-tab" },
            //   { label: "Standard Coverages", fragment: "app-gmc-covereges-tab" },
            //   { label: "Maternity Benifits", fragment: "app-maternity-benifits-tab" },
            //   { label: "Enhanced Covers", fragment: "app-gmc-enhanced-covers-tab" },
            //   { label: "Other Restrictions", fragment: "app-cost-containment-tab" },
            //   { label: "Other Details", fragment: "app-gmc-otherdetails-tab" },

            // ];
          }

        }

        break;
      case AllowedProductTemplate.MARINE:
        this.tabs = [];
        this.tabs.push({ label: "Sections & Deductibles", fragment: "app-marine-suminsured-details-tab" });
        this.tabs.push({ label: "Coverages & Caluses", fragment: "app-marine-coverages-tab" });
        // this.tabs.push({ label: "Other Details", fragment: 'app-marine-otherdetails-tab' });
        break;
      case AllowedProductTemplate.WORKMENSCOMPENSATION:
        this.showWCDiv = true;
        if (this.quote.wcTemplateDataId) this.indicativePremiumLiability = this.quote.wcTemplateDataId['indicativePremium'];
        this.tabs = [];
        this.tabs.push({ label: "Employee Details", fragment: "app-workmen-details-tab" });
        this.tabs.push({ label: "Additional Covers", fragment: "app-workmen-coverages-tab" });
        this.tabs.push({ label: "Territory Details", fragment: 'app-workmen-teritory-tab' });
        this.tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-workmen-deductibles-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      case AllowedProductTemplate.LIABILITY:
        this.showWCDiv = false;
        this.showOtherLiabilityDiv = true;
        if (this.quote.liabilityTemplateDataId) this.indicativePremiumLiability = this.quote.liabilityTemplateDataId['totalPremiumAmt'];
        this.selectedView = null
        this.selectedView = this.quote.selectedCurrency;
        this.tabs = []
        this.tabs.push({ label: "Basic Details", fragment: 'app-basic-details-tab' });
        this.tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-teritory-subsidary-details-tab' });
        this.tabs.push({ label: "Breakup Details", fragment: 'app-revenue-details-tab' });
        //this.tabs.push({ label: "Exclusions", fragment: 'app-exclusion-details' })
        // this.tabs.push({ label: "Exclusion & Subjectivity", fragment: 'app-exclusion-subjectivity-details-tab' });
        this.tabs.push({ label: " Deductibles and Claim Experience", fragment: 'app-deductibles-details-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      case AllowedProductTemplate.LIABILITY_EANDO:
        this.showWCDiv = false;
        this.showOtherLiabilityDiv = true;
        if (this.quote.liabilityEandOTemplateDataId) this.indicativePremiumLiability = this.quote.liabilityEandOTemplateDataId['totalPremiumAmt'];
        this.selectedView = null
        this.selectedView = this.quote.selectedCurrency;
        this.tabs = []
        this.tabs.push({ label: "Basic Details", fragment: 'app-basic-details-eando-tab' });
        this.tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-teritory-subsidary-details-eando-tab' });
        //this.tabs.push({ label: "Breakup Details", fragment: 'app-revenue-details-eando-tab' });
        //this.tabs.push({ label: "Exclusions", fragment: 'app-exclusion-eando-details' })
        this.tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-deductibles-eando-details-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      case AllowedProductTemplate.LIABILITY_CGL:
        this.showWCDiv = false;
        this.showOtherLiabilityDiv = true;
        if (this.quote.liabilityCGLTemplateDataId) this.indicativePremiumLiability = this.quote.liabilityCGLTemplateDataId['totalPremiumAmt'];
        this.selectedView = null
        this.selectedView = this.quote.selectedCurrency;
        this.tabs = []
        this.tabs.push({ label: "Basic Details", fragment: 'app-basic-details-cgl-tab' });
        this.tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-teritory-subsidary-details-cgl-tab' });
        this.tabs.push({ label: "Breakup Details", fragment: 'app-revenue-details-cgl-tab' });
        //.tabs.push({ label: "Exclusions", fragment: 'app-cgl-exclusion-details' })
        this.tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-deductibles-cgl-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      case AllowedProductTemplate.LIABILITY_PRODUCT:
        this.showWCDiv = false;
        this.showOtherLiabilityDiv = true;
        if (this.quote.liabilityCGLTemplateDataId) this.indicativePremiumLiability = this.quote.liabilityProductTemplateDataId['totalPremiumAmt'];
        this.selectedView = null
        this.selectedView = this.quote.selectedCurrency;
        this.tabs = []
        this.tabs.push({ label: "Basic Details", fragment: 'app-basic-details-pl-tab' });
        this.tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-teritory-subsidary-details-pl-tab' });
        this.tabs.push({ label: "Breakup Details", fragment: 'app-revenue-details-pl-tab' });
        //this.tabs.push({ label: "Exclusions", fragment: 'app-pl-exclusion-details' });
        this.tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-deductibles-pl-details-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      case AllowedProductTemplate.LIABILITY_CYBER:
        this.showWCDiv = false;
        this.showOtherLiabilityDiv = true;
        if (this.quote.liabilityProductTemplateDataId) this.indicativePremiumLiability = this.quote.liabilityProductTemplateDataId['totalPremiumAmt'];
        this.selectedView = null
        this.selectedView = this.quote.selectedCurrency;
        this.tabs = []
        this.tabs.push({ label: "Basic Details", fragment: 'app-basic-details-pl-tab' });
        this.tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-teritory-subsidary-details-pl-tab' });
        //this.tabs.push({ label: "Breakup Details", fragment: 'app-revenue-details-pl-tab' });
        //this.tabs.push({ label: "Exclusions", fragment: 'app-pl-exclusion-details' });
        this.tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-deductibles-pl-details-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      case AllowedProductTemplate.LIABILITY_PUBLIC:
        this.showWCDiv = false;
        this.showOtherLiabilityDiv = true;
        if (this.quote.liabilityCGLTemplateDataId) this.indicativePremiumLiability = this.quote.liabilityCGLTemplateDataId['totalPremiumAmt'];
        this.selectedView = null
        this.selectedView = this.quote.selectedCurrency;
        this.tabs = []
        this.tabs.push({ label: "Basic Details", fragment: 'app-basic-details-cgl-tab' });
        this.tabs.push({ label: "Territory Details", fragment: 'app-teritory-subsidary-details-cgl-tab' });
        //this.tabs.push({ label: "Exclusions", fragment: 'app-cgl-exclusion-details' });
        this.tabs.push({ label: "Breakup Details", fragment: 'app-revenue-details-cgl-tab' });
        this.tabs.push({ label: "Claim Experience", fragment: 'app-deductibles-cgl-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      case AllowedProductTemplate.LIABILITY_CRIME:
        this.showWCDiv = false;
        this.showOtherLiabilityDiv = true;
        if (this.quote.liabilityTemplateDataId) this.indicativePremiumLiability = this.quote.liabilityTemplateDataId['totalPremiumAmt'];
        this.selectedView = null
        this.selectedView = this.quote.selectedCurrency;
        this.tabs = []
        this.tabs.push({ label: "Basic Details", fragment: 'app-basic-details-tab' });
        this.tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-teritory-subsidary-details-tab' });
        this.tabs.push({ label: "Breakup Details", fragment: 'app-revenue-details-tab' });
        //this.tabs.push({ label: "Exclusions", fragment: 'app-exclusion-details' });
        this.tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-deductibles-details-tab' });
        //this.tabs.push({ label: "Other Details", fragment: "app-other-details-liability-tab" });
        break;
      default:
        this.tabs = [{ label: "Indicative Quote", fragment: "app-indicative-quote-tab" }];
    }
    if (this.activatedRoute.snapshot.queryParams.tab < 1 || this.activatedRoute.snapshot.queryParams.tab > this.tabs?.length) {
      this.router.navigate([], { queryParams: {} });
    }
    this.tabIndex = (this.activatedRoute.snapshot.queryParams.tab ?? 1) - 1;
  }

  parentFun() {
    //this.loadTabs();
    window.location.reload()
    // this.quoteService.refresh(() => {
    // })
    //   this.quoteService.get(this.quote._id).subscribe({
    //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //         this.quoteService.setQuote(dto.data.entity)
    //         this.getOptions()
    //     },
    //     error: e => {
    //         console.log(e);
    //     }
    // })
  }

  handleChange($event) {
    localStorage.setItem('tabsLength', this.tabs?.length.toString() || "0")

    this.employeeDemographicTabComponent?.saveEmpDemographic(true);
    this.costContainmentTabComponent?.saveTabs();
    this.familyCompositionTabComponent?.saveTabs(true);
    this.gmcCoveregesTabComponent?.saveTabs();
    this.gmcOtherdetailsTabComponent?.saveTabs();
    if (this.quote.quoteType != 'new') {
      this.finalRaterTabComponent?.saveTabs();
    }
    this.maternityBenifitsTabComponent?.saveTabs()

    this.router.navigate([], {
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        ...{ tab: $event.index + 1 }
      }
    });
    // this.tabIndex = $event.index;
  }
  compareGmcQuoteOptionsDialog() {
    if (this.selectedOptions.length == 0) {
      this.messageService.add({
        severity: "error",
        summary: "Fail",
        detail: "Select option for editing",
        life: 3000
      });
      return;
    }
    const ref = this.dialogService
      .open(GmcQuoteOnscreenCompareDialogComponent, {
        header: "Quote Option Comparasion",
        data: {
          selectedQuoteTemplate: this.selectedQuoteTemplateForCompare,
          selectedOptions: this.selectedOptions,
          quote: this.quote
        },
        width: "60vw",
        styleClass: "customPopup"
      })
      .onClose.subscribe(() => {
        //  this.loadQuoteDetails(this.id);
      });
  }

  compareLiabilityQuoteOptionsDialog() {
    // if (this.selectedOptions.length == 0) {
    //   this.messageService.add({
    //     severity: "error",
    //     summary: "Fail",
    //     detail: "Select option for editing",
    //     life: 3000
    //   });
    //   return;
    // }
    if (this.optionsQuoteOptions.length > 1) {
      const ref = this.dialogService
        .open(LiabilityQuoteOnscreenCompareDialogComponent, {
          header: "Quote Option Comparasion",
          data: {
            // selectedQuoteTemplate: this.selectedQuoteTemplateForCompare,
            // selectedOptions: this.selectedOptions,
            quote: this.quote
          },
          width: "60vw",
          styleClass: "customPopup"
        })
        .onClose.subscribe(() => {
          //  this.loadQuoteDetails(this.id);
        });
    } else {
      this.messageService.add({
        summary: 'Error',
        detail: `There must be at least 2 options ready for comparision`,
        severity: 'error'
      })
    }
  }

  calculateFormCompletionPercentage(): void {
    const totalFields = Object.keys(this.selectedQuoteTemplate).length;
    // const filledFields = Object.values(this.myForm.controls).filter(control => control.value).length;

    //  this.formCompletionPercentage = (filledFields / totalFields) * 100;
  }

  async getQuoteLocationBreakup() {
    // Old_Quote
    // let event: LazyLoadEvent = {
    //   first: 0,
    //   rows: 5000,
    //   sortField: null,
    //   sortOrder: 1,
    //   filters: {
    //     // @ts-ignore
    //     quoteId: [
    //       {
    //         value: this.quote._id,
    //         matchMode: "equals",
    //         operator: "and"
    //       }
    //     ]
    //   }
    // };

    // New_Quote_Option
    let event: LazyLoadEvent = {
      first: 0,
      rows: 5000,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        quoteOptionId: [
          {
            value: this.onLoadQuoteOption,
            matchMode: "equals",
            operator: "and"
          }
        ]
      }
    };

    let response = await this.quoteLocationBreakupService.getMany(event).toPromise();

    return response.data.entities;
  }

  async getQuoteLocationOccupancies() {
    // Old_Quote
    // let event: LazyLoadEvent = {
    //   first: 0,
    //   rows: 4,
    //   sortField: null,
    //   sortOrder: 1,
    //   filters: {
    //     // @ts-ignore
    //     quoteId: [
    //       {
    //         value: this.quote._id,
    //         matchMode: "equals",
    //         operator: "and"
    //       }
    //     ]
    //   }
    // };

    // New_Quote_Option
    let event: LazyLoadEvent = {
      first: 0,
      rows: 5000,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        quoteOptionId: [
          {
            value: this.onLoadQuoteOption,
            matchMode: "equals",
            operator: "and"
          }
        ]
      }
    };

    let response = await this.quoteLocationOccupancyService.getMany(event).toPromise();

    return response.data.entities;
  }

  // checkCoverInput(covers, locationBasedCovers) {
  //     for (let cover of covers) {
  //         //transform the cover name 
  //         let nameAsInLocationBasedCovers = cover.split("_").map((word, index) => (index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join('')
  //         //check if cover's arr is empty or null
  //         if (Array.isArray(locationBasedCovers[nameAsInLocationBasedCovers]) && locationBasedCovers[nameAsInLocationBasedCovers].length === 0) {
  //             this.messageService.add({
  //                 summary: 'Error',
  //                 detail: `Please fill required details of selected cover.`,
  //                 severity: 'error'
  //             })
  //             break

  //         } else if (locationBasedCovers[nameAsInLocationBasedCovers] === null) {
  //             this.messageService.add({
  //                 summary: 'Error',
  //                 detail: `Please fill required details of selected cover.`,
  //                 severity: 'error'
  //             })
  //             break
  //         }
  //     }
  // }

  liabilityGenerateDialog() {
    this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
      header: `Confirmation Dialog`,
      data: {
        quote: this.quote,
      },
      width: '650px',
      styleClass: "customPopup"
    }).onClose.subscribe((action: boolean) => {
      if (action) {
        this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
      }
    })
  }

  productValidation(quoteLocationBreakups, isOtcBreached, category) {
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.BLUS) {
      if (quoteLocationBreakups.length > 0 || category !== Cateagory.PROPERTY) {
        this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
          header: `Confirmation Dialog`,
          data: {
            quote: this.quote,
          },
          width: '650px',
          styleClass: "customPopup"
        }).onClose.subscribe((action: boolean) => {
          if (action) {
            this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
          }
        })
      }
      else {
        //Getting this alert for WC
        this.messageService.add({
          summary: 'Error',
          detail: `Sum Insured Is Required For All Locations`,
          severity: 'error'
        })
      }
    } else {
      // if (isOtcBreached) {
      this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
        header: `Confirmation Dialog`,
        data: {
          quote: this.quote,
        },
        width: '650px',
        styleClass: "customPopup"
      }).onClose.subscribe((action: boolean) => {
        if (action) {
          this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
        }
      })
      // } else {
      //   this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
      // }
    }
  }

  checkCoverInput(): boolean {
    // Old_Quote
    // const locationBasedCovers = this.quote.locationBasedCovers
    // let isError = false;
    // const checkIfEmptyArrOrNull = (nameAsInLocationBasedCovers: string): void => {
    //   const coverDetails = locationBasedCovers[nameAsInLocationBasedCovers];
    //   if (Array.isArray(coverDetails) && coverDetails.length === 0 || coverDetails === null) {
    //     isError = true;
    //   }
    // }

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_MONEY_TRANSIT_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_MONEY_SAFE_TILL_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_FIDELITY_GUARANTEE_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_FIXED_PLATE_GLASS_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_SIGNAGE_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.PERSONAL_ACCIDENT_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_WORKMEN_COMPENSATION_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_LIABILITY_SECTION_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_PEDAL_CYCLE_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_ALL_RISK_COVER)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.FLOATER_COVER_ADD_ON)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.DECLARATION_POLICY)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.LOSE_OF_RENT)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)

    // if (this.quote.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS))
    //   checkIfEmptyArrOrNull(LocationBasedBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)

    // New_Quote_Option
    const locationBasedCovers = this.quoteOptionData.locationBasedCovers
    let isError = false;
    const checkIfEmptyArrOrNull = (nameAsInLocationBasedCovers: string): void => {
      const coverDetails = locationBasedCovers[nameAsInLocationBasedCovers];
      if (Array.isArray(coverDetails) && coverDetails.length === 0 || coverDetails === null) {
        isError = true;
      }
    }

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_FIRE_LOSS_OF_PROFIT_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_BURGLARY_HOUSEBREAKING_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PORTABLE_EQUIPMENTS_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_PORTABLE_EQUIPMENTS_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_ELECTRONIC_EQUIPMENTS_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_TRANSIT_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_MONEY_TRANSIT_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_MONEY_SAFE_TILL_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_MONEY_SAFE_TILL_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIDELITY_GUARANTEE_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_FIDELITY_GUARANTEE_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_FIXED_PLATE_GLASS_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_FIXED_PLATE_GLASS_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_SIGNAGE_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_SIGNAGE_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.PERSONAL_ACCIDENT_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.PERSONAL_ACCIDENT_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_WORKMEN_COMPENSATION_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_WORKMEN_COMPENSATION_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_LIABILITY_SECTION_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_LIABILITY_SECTION_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_PEDAL_CYCLE_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_PEDAL_CYCLE_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_ACCOMPANIED_BAGGAGE_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.BSC_ALL_RISK_COVER))
      checkIfEmptyArrOrNull(LocationBasedBscCover.BSC_ALL_RISK_COVER)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.FLOATER_COVER_ADD_ON))
      checkIfEmptyArrOrNull(LocationBasedBscCover.FLOATER_COVER_ADD_ON)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.DECLARATION_POLICY))
      checkIfEmptyArrOrNull(LocationBasedBscCover.DECLARATION_POLICY)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.LOSE_OF_RENT))
      checkIfEmptyArrOrNull(LocationBasedBscCover.LOSE_OF_RENT)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION))
      checkIfEmptyArrOrNull(LocationBasedBscCover.RENT_FOR_ALTERNATIVE_ACCOMODATION)

    if (this.quoteOptionData.selectedAllowedProductBscCover.includes(AllowedProductBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS))
      checkIfEmptyArrOrNull(LocationBasedBscCover.VALUABLE_CONTENTS_ON_AGREED_VALUE_BASIS)

    return isError
  }

  checkMandatoryCover(): boolean {
    const manCovers = this.quote?.productId["mandatoryCovers"]
    // Old_Quote
    // const selectedCovers = this.quote?.selectedAllowedProductBscCover

    // New_Quote_option
    const selectedCovers = this.quoteOptionData?.selectedAllowedProductBscCover
    if (manCovers) {
      for (let manCover of manCovers) {
        if (!selectedCovers.includes(manCover)) {
          return false
        }
      }
    }
    return true
  }

  getNotAddMandatoryCover(): any[] {
    const manCovers = this.quote?.productId["mandatoryCovers"]
    // Old_Quote
    // const selectedCovers = this.quote?.selectedAllowedProductBscCover

    // New_Quote_option
    const selectedCovers = this.quoteOptionData?.selectedAllowedProductBscCover
    const notSelectedManCovr = []
    for (let manCover of manCovers) {
      if (!selectedCovers.includes(manCover)) {
        notSelectedManCovr.push(manCover)
      }
    }
    return notSelectedManCovr
  }

  // checkInsuranceDetail():boolean{
  //   let checkLength = false
  //   if(this.quote.insurerDetails.length == 0){
  //     checkLength = true
  //   }else{
  //     checkLength = false;
  //   }
  //   return checkLength;
  // }
  checkInsuranceDetail(): boolean {
    let checkLength = false
    if (this.quote.insurerDetails.length == 0) {
      checkLength = true
    } else {
      checkLength = false;
    }
    return checkLength;
  }

  removeLastComma(str: string): string {
    if (str.trim().endsWith(',')) {
      return str.slice(0, -1);
    }
    return str;
  }

  // Generate Quote Slip
  async generateQuoteSlip() {
    console.log(this.quoteOptionData);
    // console.log(this.quote.productId['shortName'] = "IAR" && "MEGA");


    const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
    console.log(productPartnerIcConfigurations);

    const configurationOtcTypes = productPartnerIcConfigurations.map((item: { productPartnerIcConfigurationId: IProductPartnerIcConfigration }) => item.productPartnerIcConfigurationId?.otcType)

    const isAnyConfigurationOfTypeBoth = configurationOtcTypes.includes(AllowedOtcTypes.BOTH)

    let isOtcBreached = isAnyConfigurationOfTypeBoth && this.quote.otcType == AllowedOtcTypes.NONOTC;
    if (this.isAllowedProductLiability()) {
      isOtcBreached = true;
    }
    if (!this.isAllowedProductLiability()) {
      const quoteLocationBreakups = await this.getQuoteLocationBreakup()
      console.log(quoteLocationBreakups);
    }
    // const NoOfCover = quoteLocationBreakups[0]?.quoteId["selectedAllowedProductBscCover"].length             // Old_Quote
    // const NoOfCover = quoteLocationBreakups[0]?.quoteOptionId["selectedAllowedProductBscCover"]?.length          // New_Quote_Option
    // const minCover = this.quote.productPartnerConfiguration["minCover"]
    // const isFlexa = this.quote.locationBasedCovers ? this.quote.locationBasedCovers.quoteLocationOccupancy.isFlexa : false;                      // Old_Quote
    // const isFlexa = this.quoteOptionData?.locationBasedCovers ? this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.isFlexa : false;     // New_Quote_Option
    // const isCoverEmpty = this.checkCoverInput()
    // const category = this.quote.productId["categoryId"]['name'].toLowerCase().trim()           // Old_Quote
    // const category = this.quoteOptionData?.quoteId["productId"]["categoryId"]['name'].toLowerCase().trim()

    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.WORKMENSCOMPENSATION) {
      this.quoteService.get(this.quote._id).subscribe({
        next: (dto: IOneResponseDto<IQuoteSlip>) => {
          var wcquote = dto.data.entity;
          this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
            next: (dtooption: IOneResponseDto<any[]>) => {
              var cglOptions = dtooption.data.entity.filter(x => x.version == this.quote.qcrVersion)
              let isValidationCheckPass = true;
              for (const option of cglOptions) {
                const wcEmployeeWorkDeatils = option['wcDetails'];
                const discountbasedonPremium = +option["discountbasedonPremium"];
                if (wcEmployeeWorkDeatils.length > 0) {
                  const wcTemplateModel = option as IWCTemplate
                  if (!wcTemplateModel.medicalBenifitsOption || wcTemplateModel.medicalBenifitsOption === "") {
                    this.displayErrorMessage("Please select Medical Extension Benefit");
                    isValidationCheckPass = false;
                  } else {
                    if (wcTemplateModel.medicalBenifitsOption === "ME" || wcTemplateModel.medicalBenifitsOption === "ME_AGGREGATE") {
                      if (wcTemplateModel.medicalBenifitsOption === "ME" && (!wcTemplateModel.medicalBenifitsAmountId || wcTemplateModel.medicalBenifitsAmountId == '' || wcTemplateModel.medicalBenifitsAmountId == undefined)) {
                        this.displayErrorMessage("Please select amount Medical Extension");
                        isValidationCheckPass = false;
                      } else if (wcTemplateModel.medicalBenifitsOption === "ME_AGGREGATE" && !wcTemplateModel.isActual && (!wcTemplateModel.medicalBenifitsAmountId || wcTemplateModel.medicalBenifitsAmountId == '' || wcTemplateModel.medicalBenifitsAmountId == undefined)) {
                        this.displayErrorMessage("Please select amount for Medical Extension AGGREGATE");
                        isValidationCheckPass = false;
                      } else {
                        isValidationCheckPass = true;
                      }
                    } else {
                      this.displayErrorMessage("Please select Medical Extension Benefit");
                      isValidationCheckPass = false;
                    }
                  }
                  if (wcquote.quoteType == "rollover" && isValidationCheckPass) {
                    isValidationCheckPass = this.validateRolloverPolicy(wcTemplateModel)
                  }
                }
              }
              if (isValidationCheckPass) {
                this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
                  header: `Confirmation Dialog`,
                  data: {
                    quote: this.quote,
                  },
                  width: '650px',
                  styleClass: "customPopup"
                }).onClose.subscribe((action: boolean) => {
                  if (action) {
                    this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
                  }
                })
              }
            },
            error: e => {
              console.log(e);
            }
          });
        },
        error: e => {
          console.log(e);
        }
      });
    }
    else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME) {
      this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
        next: (dtooption: IOneResponseDto<any[]>) => {
          var crimeOptions = dtooption.data.entity.filter(x => x.version == this.quote.qcrVersion)
          let allOptionsValid = true;
          for (const option of crimeOptions) {
            if (!this.allValidatedCRIMELiability(option)) {
              allOptionsValid = false;
              break;
            }
          }
          if (allOptionsValid) {
            this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
              header: `Confirmation Dialog`,
              data: {
                quote: this.quote,
              },
              width: '650px',
              styleClass: "customPopup"
            }).onClose.subscribe((action: boolean) => {
              if (action) {
                this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
              }
            })
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
    else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
      this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
        next: (dtooption: IOneResponseDto<any[]>) => {
          var dnoOptions = dtooption.data.entity.filter(x => x.version == this.quote.qcrVersion)
          let allOptionsValid = true;
          for (const option of dnoOptions) {
            if (!this.allValidated(option)) {
              allOptionsValid = false;
              break;
            }
          }
          if (allOptionsValid) {
            // for (const option of dnoOptions) {
            //   if (isOtcBreached) {
            //     this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_INSURED_BUSINESS_ACTIVITY).subscribe({
            //       next: activities => {
            //         this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_TYPE_OF_POLICY).subscribe({
            //           next: policies => {
            //             this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_SUBSIDIARY_LOCATION).subscribe({
            //               next: subsideries => {
            //                 const optionsInsuredBusinessActivity = activities.data.entities.map(entity => ({
            //                   label: entity.lovKey.toString(),
            //                   value: entity._id,
            //                   otcType: entity.otcType
            //                 }));
            //                 const selectedOptionsInsuredBusinessActivity = optionsInsuredBusinessActivity.find(
            //                   x => x.value === liabiltyquote.insuredBusinessActivityId["_id"]
            //                 );
            //                 const optionSubsideryLocation = subsideries.data.entities.map(entity => ({
            //                   label: entity.lovKey.toString(),
            //                   value: entity._id,
            //                   otcType: entity.otcType
            //                 }));
            //                 const selectedCountryIds = option.subsidaryDetails.map(item => item.countryId);
            //                 const selectedSubsideryLocations = optionSubsideryLocation.filter(item =>
            //                   selectedCountryIds.includes(item.value)
            //                 );
            //                 let isBreach = false;
            //                 this.quote.nonOtcBreachedValue = '';
            //                 if (selectedOptionsInsuredBusinessActivity.otcType == AllowedOtcTypes.NONOTC) {
            //                   this.quote.nonOtcBreachedValue = `The selected insured business activity is ${selectedOptionsInsuredBusinessActivity.label} which refers to NON-OTC,`
            //                   isBreach = true;
            //                 }
            //                 if (liabiltyquote.turnOverThresholdOrAssetSizeOfCompany > 10000000000) {
            //                   this.quote.nonOtcBreachedValue += `Turnover Threshhold amount is more than 10000000000 which refers to NON-OTC,`
            //                   isBreach = true;
            //                 }
            //                 if (selectedSubsideryLocations.some((item) => item.otcType === AllowedOtcTypes.NONOTC)) {
            //                   this.quote.nonOtcBreachedValue += `You have selected Subsidery locations which refers to NON-OTC,`
            //                   isBreach = true;
            //                 }
            //                 if (isBreach) {
            //                   this.quote.nonOtcBreachedValue = this.removeLastComma(this.quote.nonOtcBreachedValue);
            //                   let updatePayloadQuote = this.quote;
            //                   this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
            //                     next: quote => {
            //                       this.liabilityTemplateService.updateArray(option._id, option).subscribe({
            //                         next: quote => {
            //                           this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
            //                             header: `Confirmation Dialog`,
            //                             data: {
            //                               quote: this.quote,
            //                             },
            //                             width: '650px',
            //                             styleClass: "customPopup"
            //                           }).onClose.subscribe((action: boolean) => {
            //                             if (action) {
            //                               this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
            //                             }
            //                           })
            //                           return
            //                         },
            //                         error: error => {
            //                           console.log(error);
            //                         }
            //                       });
            //                     },
            //                     error: error => {
            //                       console.log(error);
            //                     }
            //                   });
            //                 }
            //                 else {
            //                   this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
            //                 }
            //               },
            //               error: e => {
            //                 console.log(e);
            //               }
            //             });
            //           },
            //           error: e => {
            //             console.log(e);
            //           }
            //         });
            //       },
            //       error: e => {
            //         console.log(e);
            //       }
            //     });
            //   }
            //   else {
            //     this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
            //   }
            // }
            this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
              header: `Confirmation Dialog`,
              data: {
                quote: this.quote,
              },
              width: '650px',
              styleClass: "customPopup"
            }).onClose.subscribe((action: boolean) => {
              if (action) {
                this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
              }
            })
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
    else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_EANDO) {
      this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
        next: (dtooption: IOneResponseDto<any[]>) => {
          var dnoOptions = dtooption.data.entity.filter(x => x.version == this.quote.qcrVersion)
          let allOptionsValid = true;
          for (const option of dnoOptions) {
            if (!this.allValidatedEandO(option)) {
              allOptionsValid = false;
              break;
            }
          }
          if (allOptionsValid) {
            this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
              header: `Confirmation Dialog`,
              data: {
                quote: this.quote,
              },
              width: '650px',
              styleClass: "customPopup"
            }).onClose.subscribe((action: boolean) => {
              if (action) {
                this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
              }
            })
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
    else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
      this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
        next: async (dtooption: IOneResponseDto<any[]>) => {
          try {
            const cglOptions = dtooption.data.entity.filter(x => x.version == this.quote.qcrVersion);
            let allOptionsValid = true;
            for (const option of cglOptions) {
              const isValid = await this.allValidatedCGL(option);
              if (!isValid) {
                allOptionsValid = false;
                break;
              }
            }
            if (allOptionsValid) {
              this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
                header: 'Confirmation Dialog',
                data: { quote: this.quote },
                width: '650px',
                styleClass: "customPopup"
              }).onClose.subscribe((action: boolean) => {
                if (action) {
                  this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
                }
              });
            }
          } catch (error) {
            console.error(error);
          }
        },
        error: e => console.error(e)
      });
    }
    else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC) {
      this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
        next: (dtooption: IOneResponseDto<any[]>) => {
          var publicOptions = dtooption.data.entity.filter(x => x.version == this.quote.qcrVersion)
          let allOptionsValid = true
          for (const option of publicOptions) {
            if (!this.allValidatedPublicLiability(option)) {
              allOptionsValid = false;
              break;
            }
          }
          if (allOptionsValid) {
            this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
              header: `Confirmation Dialog`,
              data: {
                quote: this.quote,
              },
              width: '650px',
              styleClass: "customPopup"
            }).onClose.subscribe((action: boolean) => {
              if (action) {
                this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
              }
            })
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
    else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CYBER) {
      this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
        next: (dtooption: IOneResponseDto<any[]>) => {
          var cglOptions = dtooption.data.entity.filter(x => x.version == this.quote.qcrVersion)
          let allOptionsValid = true
          for (const option of cglOptions) {
            if (!this.allValidatedPL(option)) {
              allOptionsValid = false;
              break;
            }
          }
          if (allOptionsValid) {
            this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
              header: `Confirmation Dialog`,
              data: {
                quote: this.quote,
              },
              width: '650px',
              styleClass: "customPopup"
            }).onClose.subscribe((action: boolean) => {
              if (action) {
                this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
              }
            })
          }
        },
        error: e => {
          console.log(e);
        }
      });
    }
    else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
      this.quoteService.get(this.quote._id).subscribe({
        next: (dto: IOneResponseDto<IQuoteSlip>) => {
          var quote = dto.data.entity;
          //> 50 NOn otct underwrite jouer
          this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
            header: `Confirmation Dialog`,
            data: {
              quote: this.quote,
            },
            width: '650px',
            styleClass: "customPopup"
          }).onClose.subscribe((action: boolean) => {
            if (action) {
              this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
            }
          })
        },
        error: e => {
          console.log(e);
        }
      });


    }
    else {
      const quoteLocationBreakups = await this.getQuoteLocationBreakup()
      // const NoOfCover = quoteLocationBreakups[0]?.quoteId["selectedAllowedProductBscCover"].length             // Old_Quote
      const NoOfCover = quoteLocationBreakups[0]?.quoteOptionId["selectedAllowedProductBscCover"].length          // New_Quote_Option
      const minCover = this.quote.productPartnerConfiguration["minCover"]
      // const isFlexa = this.quote.locationBasedCovers ? this.quote.locationBasedCovers.quoteLocationOccupancy.isFlexa : false;                      // Old_Quote
      const isFlexa = this.quoteOptionData.locationBasedCovers ? this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.isFlexa : false;     // New_Quote_Option
      const isCoverEmpty = this.checkCoverInput()
      // const category = this.quote.productId["categoryId"]['name'].toLowerCase().trim()                            // Old_Quote
      const category = this.quoteOptionData.quoteId["productId"]["categoryId"]['name']?.toLowerCase().trim()       // New_Quote_Option
      // const isInsuranceDetailsEmpty = this.checkInsuranceDetail();
      console.log(this.quoteOptionData.locationBasedCovers);
      console.log(quoteLocationBreakups);
      // this.quoteOptionData.locationBasedCovers.machineryLossOfProfitCover
      // bscFireLossOfProfitCover
      // if (this.quote.productId['shortName'].includes("IAR")) {
      //   if(this.quoteOptionData.locationBasedCovers.bscFireLossOfProfitCover === null){
      //     this.messageService.add({
      //       key: 'error',
      //       summary: 'Error',
      //       detail: `Add Fire Loss Profit(Flop)`,
      //       severity: 'error'
      //     })
      //   }
      // }
      if (!minCover) {
        if (quoteLocationBreakups.length === 0 && category === Cateagory.PROPERTY) {
          if (this.quote.productId['shortName'].includes("IAR")) {
            if (this.quoteOptionData.locationBasedCovers.bscFireLossOfProfitCover === null) {
              this.messageService.add({
                key: 'error',
                summary: 'Error',
                detail: `Add Fire Loss Profit(Flop)`,
                severity: 'error'
              })
            }
          }
          this.messageService.clear("error");
          if (this.quoteOptionData)
            this.messageService.add({
              key: 'error',
              summary: 'Error',
              detail: `Sum Insured Is Required For All Locations`,
              severity: 'error'
            })

        } else if (isCoverEmpty === true) {
          this.messageService.clear("error");
          this.messageService.add({
            key: 'error',
            summary: 'Error',
            detail: `Please fill required details of selected cover.`,
            severity: 'error'
          })
          // }else if (isInsuranceDetailsEmpty === true) {
          //   this.messageService.clear("error");
          //   this.messageService.add({
          //   key:'error',
          //   summary: 'Error',
          //   detail: `Please fill required details of Insurance details`,
          //   severity: 'error'
          // })
        } else if (!this.checkMandatoryCover()) {
          this.messageService.clear("error");
          this.messageService.add({
            key: 'error',
            summary: 'Error',
            detail: `Please Add Mandatory covers : ${this.getNotAddMandatoryCover().map(key => { return ` ${key.replaceAll("_", " ").toLowerCase()}\n` })}`,
            // sticky: true,
            severity: 'error'
          })
        }
        // else if (!this.quoteOptionData.brokerage) {
        //   this.messageService.add({
        //     summary: 'Error',
        //     detail: `Fill brokerage.`,
        //     severity: 'error'
        // })} 
        else {
          this.productValidation(quoteLocationBreakups, isOtcBreached, category)
        }
      } else if (quoteLocationBreakups.length === 0 && category === Cateagory.PROPERTY) {
        if (this.quote.productId['shortName'].includes("IAR")) {
          if (this.quoteOptionData.locationBasedCovers.bscFireLossOfProfitCover === null) {
            this.messageService.add({
              key: 'error',
              summary: 'Error',
              detail: `Add Fire Loss Profit(Flop)`,
              severity: 'error'
            })
          }
        }
        this.messageService.clear("error");
        this.messageService.add({
          key: 'error',
          summary: 'Error',
          detail: `Sum Insured Is Required For All Locations`,
          severity: 'error'
        })
        // }else if (isInsuranceDetailsEmpty === true) {
        //   this.messageService.clear("error");
        //   this.messageService.add({
        //   key:'error',
        //   summary: 'Error',
        //   detail: `Please fill required details of Insurance details`,
        //   severity: 'error'
        // })
      } else if (isCoverEmpty === true) {
        this.messageService.add({
          summary: 'Error',
          detail: `Please fill required details of selected cover.`,
          severity: 'error'
        })
      } else if (!this.checkMandatoryCover()) {
        this.messageService.clear("error");
        this.messageService.add({
          key: 'error',
          summary: 'Error',
          detail: `Please Add Mandatory covers : ${this.getNotAddMandatoryCover().map(key => { return ` ${key.replaceAll("_", " ").toLowerCase()}\n` })}`,
          // sticky: true,
          severity: 'error'
        })
      } else if (isFlexa === false || NoOfCover < minCover) {
        this.messageService.add({
          summary: 'Error',
          detail: `Flexa and a minimum of ${minCover} covers are required.`,
          severity: 'error'
        })
      }
      // else if (!this.quoteOptionData.brokerage) {
      //   this.messageService.add({
      //     summary: 'Error',
      //     detail: `Fill brokerage.`,
      //     severity: 'error'
      //   })
      // }
      else {
        if (
          this.quote.productId["productTemplate"] == AllowedProductTemplate.BLUS ||
          this.quote.productId["productTemplate"] == AllowedProductTemplate.FIRE ||
          this.quote.productId["productTemplate"] == AllowedProductTemplate.IAR
        ) {
          if (quoteLocationBreakups.length > 0 || category !== Cateagory.PROPERTY) {
            if (this.quote.productId['shortName'].includes("IAR")) {
              if (this.quoteOptionData.locationBasedCovers.bscFireLossOfProfitCover === null) {
                this.messageService.add({
                  key: 'error',
                  summary: 'Error',
                  detail: `Add Fire Loss Profit(Flop)`,
                  severity: 'error'
                })
              }
            }
            /* if (isOtcBreached) {
              this.dialogService
                .open(OtcProductLimitExceededConfirmationDialogComponent, {
                  data: {
                    quote: this.quote
                  },
                  width: "650px",
                  styleClass: "flatPopup"
                })
                .onClose.subscribe((action: boolean) => {
                  if (action) {
                    this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
                  }
                });
            } else {
              console.log(this.quote);
              this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
            } */
          } else {
            if (this.quote.productId['shortName'].includes("IAR")) {
              if (this.quoteOptionData.locationBasedCovers.bscFireLossOfProfitCover === null) {
                this.messageService.add({
                  key: 'error',
                  summary: 'Error',
                  detail: `Add Fire Loss Profit(Flop)`,
                  severity: 'error'
                })
              }
            }
            this.messageService.add({
              summary: "Error",
              detail: `Sum Insured Is Required For All Locations`,
              severity: "error"
            });
          }
        }
        else if (this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY
          || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_EANDO
          || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CGL
          || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_PRODUCT
          || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CYBER
          || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_PUBLIC
          || this.quote.productId["productTemplate"] == AllowedProductTemplate.LIABILITY_CRIME
        ) {
          this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
              var quote = dto.data.entity;
              //> 50 NOn otct underwrite jouer
              this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
            },
            error: e => {
              console.log(e);
            }
          });
        }
        else {
          // if (isOtcBreached) {
          this.dialogService
            .open(OtcProductLimitExceededConfirmationDialogComponent, {
              data: {
                quote: this.quote
              },
              width: "650px",
              styleClass: "flatPopup"
            })
            .onClose.subscribe((action: boolean) => {
              if (action) {
                this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
              }
            });
          // } else {
          //   console.log(this.quote);
          //   this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
          // }
        }
        this.productValidation(quoteLocationBreakups, isOtcBreached, category)
      }
    }
  }

  openMoodysAPI() {
    localStorage.setItem('quoteData', JSON.stringify(this.quoteOptionData));
    const url = `/backend/quotes/${this.quote._id}/moodysPDF`;
    window.open(url, '_blank');
  }


  allValidatedCRIMELiability(liabiltyquote: any) {
    const requiredFields = {
      retroactiveCoverId: "Retroactive Cover",
      detailsOfBusinessActivity: "Details of Business Activity"
    };
    const missingFields = [];
    for (const [field, displayName] of Object.entries(requiredFields)) {
      const value = liabiltyquote[field];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        missingFields.push(displayName);
      }
    }
    if (missingFields.length > 0) {
      const missingFieldsList = missingFields.join(", ");
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Validation Error in ${liabiltyquote.optionName}`,
        detail: `The following fields are missing: ${missingFieldsList}`
      });
      return false;
    }
    return true;
  }


  allValidated(liabiltyquote) {
    const requiredFields = {
      retroactiveCoverId: "Retroactive Details",
      detailsOfBusinessActivity: "Details of Business Activity",
    };
    const missingFields = [];
    for (const [field, displayName] of Object.entries(requiredFields)) {
      if (!liabiltyquote[field] ||
        (typeof liabiltyquote[field] === "string" && liabiltyquote[field].trim() === "") ||
        (Array.isArray(liabiltyquote[field]) && liabiltyquote[field].length === 0)) {
        missingFields.push(displayName);
      }
    }
    if (missingFields.length > 0) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Validation Error in ${liabiltyquote.optionName}`,
        detail: `The following fields are missing: ${missingFields.join(", ")}`
      });
      return false;
    }
    return true;
  }

  allValidatedEandO(liabiltyquote) {
    const requiredFields = {
      retroactiveCoverId: "Retroactive Cover",
      detailsOfBusinessActivity: "Details of Business Activity"
    };
    const missingFields = [];
    for (const [field, displayName] of Object.entries(requiredFields)) {
      const value = liabiltyquote[field];
      if (!value || (typeof value === "string" && value.trim() === "") || (Array.isArray(value) && value.length === 0)) {
        missingFields.push(displayName);
      }
    }
    if (missingFields.length > 0) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Validation Error in ${liabiltyquote.optionName}`,
        detail: `The following fields are missing: ${missingFields.join(", ")}`
      });
      return false;
    }
    return true;
  }


  async allValidatedCGL(option: any): Promise<boolean> {
    try {
      const records = await this.wclistofmasterservice
        .current(WCAllowedListOfValuesMasters.CGL_TYPE_OF_POLICY)
        .toPromise();
      const optionsTypeOfPolicy = records.data.entities.map((entity: any) => ({
        label: entity.lovKey.toString(),
        value: entity._id,
      }));

      let isOccuranceFormSelected = false;
      if (option.typeOfPolicyId) {
        const selectedPolicyType = optionsTypeOfPolicy.find(
          (a: any) => a.value === option.typeOfPolicyId
        )?.label;
        if (selectedPolicyType?.includes('Commercial General Liability - Occurrence FORM')) {
          isOccuranceFormSelected = true;
        }
      }

      const missingFields: string[] = [];

      if (isOccuranceFormSelected) {
        if (!option.typeOfPolicyId) missingFields.push("Type of Policy");
        if (!option.detailsOfProductAndUsage) missingFields.push("Details of Product and Usage");
        if (!option.detailsOfBusinessActivity) missingFields.push("Details of Business Activity");
      } else {
        if (!option.retroactiveCoverId) missingFields.push("Retroactive Cover");
        if (!option.typeOfPolicyId) missingFields.push("Type of Policy");
        if (!option.detailsOfBusinessActivity) missingFields.push("Details of Business Activity");
      }

      if (missingFields.length > 0) {
        this.messageService.add({
          key: "error",
          severity: "error",
          summary: `Validation Error in ${option.optionName}`,
          detail: `The following fields are missing: ${missingFields.join(", ")}`
        });
      }

      return missingFields.length === 0;
    } catch (error) {
      console.error(error);
      return false;
    }
  }



  allValidatedPublicLiability(liabiltyquote) {
    const validationRules = [
      { field: "detailsOfHazardousChemical", displayName: "Details of Hazardous Chemical" },
      { field: "retroactiveCoverId", displayName: "Retroactive Details" },
      { field: "retroactiveDate", displayName: "Retroactive Cover" }
    ];
    const missingFields = [];
    for (const rule of validationRules) {
      const fieldValue = liabiltyquote[rule.field];
      if (!fieldValue || (typeof fieldValue === "string" && fieldValue.trim() === "")) {
        missingFields.push(rule.displayName);
      }
    }
    if (missingFields.length > 0) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Validation Error in ${liabiltyquote.optionName}`,
        detail: `The following fields are missing: ${missingFields.join(", ")}`
      });
      return false;
    }
    return true;
  }



  allValidatedPL(liabiltyquote: any) {
    const validationRules = [
      { field: "retroactiveCoverId", displayName: "Retroactive Cover", condition: () => true },
      {
        field: "typeOfPolicyId",
        displayName: "Type of Policy",
        condition: () => this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_PRODUCT
      },
      {
        field: "detailsOfProductAndUsage",
        displayName: "Details of Product and Usage",
        condition: () => this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_PRODUCT
      },
      { field: "detailsOfBusinessActivity", displayName: "Details of Business Activity", condition: () => true }
    ];

    const missingFields = [];
    for (const rule of validationRules) {
      if (rule.condition()) {
        const fieldValue = liabiltyquote[rule.field];
        if (!fieldValue || (typeof fieldValue === "string" && fieldValue.trim() === "")) {
          missingFields.push(rule.displayName);
        }
      }
    }
    if (missingFields.length > 0) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Validation Error in ${liabiltyquote.optionName}`,
        detail: `The following fields are missing: ${missingFields.join(", ")}`
      });
      return false;
    }
    return true;
  }


  allfieldsareFilled(rowObj: Record<string, any>): boolean {
    // Check if all values in rowObj are truthy (not undefined, null, or false)
    return Object.values(rowObj).every(value => value !== null && value !== "" && value !== undefined && value !== 0);
  }

  backToDraftPage() {
    if (this.quote.productId['productTemplate'] != AllowedProductTemplate.GMC
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_CGL
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_CRIME
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_CYBER
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_EANDO
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_PRODUCT
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.LIABILITY_PUBLIC
      && this.quote.productId['productTemplate'] != AllowedProductTemplate.WORKMENSCOMPENSATION) {
      const ref = this.dialogService.open(EditSumSiConfimationDialogComponent, {
        header: "Are you sure you want to back to draft.",
        data: {
          quote: this.quote,
        },
        width: '45%',
        styleClass: 'flatPopup'
      })
      // this.routerService.navigateByUrl(`/backend/quotes/${this.quote._id}`)
    }
    else {
      const ref = this.dialogService.open(EditOptionsConfimationDialogComponent, {
        header: "Are you sure you want to edit Options.",
        data: {
          quote: this.quote,
          optionName: this.selectedOptionName,
          selectedTemplateId: this.selectedQuoteTemplate._id
        },
        width: '45%',
        styleClass: 'flatPopup'
      })
    }
  }

  //Intergation-EB [Start]
  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteGmcOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)   //.map(entity => ({ label: entity.optionName, value: entity._id }));;
        this.loadOptionsData(this.quoteGmcOptionsLst);
        this.loadSelectedOption(this.quoteGmcOptionsLst.filter(x => x.optionName == 'Option 1')[0]);
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadOptionsData(quoteOption: any[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }

  loadSelectedOption(quoteOption: any) {
    this.quoteService.setSelectedOptions(quoteOption)
  }

  createGmcQuoteOptionsDialog() {
    const ref = this.dialogService.open(GmcCoveragesOptionsDialogComponent, {
      header: "Create Options",
      data: {
        quote_id: this.id,
        clientId: this.quote.clientId,
        quote: this.quote,
      },
      width: "50vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {
      this.loadQuoteDetails(this.quote._id);
      this.getOptions()
    })
  }

  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
        //this.getEmployeesDemographySummary()
      },
      error: e => {
        console.log(e);
      }
    });
  }

  handleQuoteOptionChange(event) {
    console.log('Selected option:', event.value);
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteGmcOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion) //.map(entity => ({ label: entity.optionName, value: entity._id }));;
        const template = this.quoteGmcOptionsLst.filter(x => x._id == event.value)[0]
        this.loadSelectedOption(template)
        this.loadOptionsData(this.quoteGmcOptionsLst)
      },
      error: e => {
        console.log(e);
      }
    });
  }

  handleQuoteOptionChangeLiability(event) {
    this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<any[]>) => {
        this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
        this.optionsQuoteOptions = this.quoteOptionsLst.map(entity => ({ label: entity.optionName, value: entity._id }));
        let quoteOption = this.quoteOptionsLst.filter(x => x._id == event.value)[0]
        switch (this.quote.productId?.['productTemplate']) {
          case AllowedProductTemplate.WORKMENSCOMPENSATION:
            this.quote.wcTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY:
          case AllowedProductTemplate.LIABILITY_CRIME:
            this.quote.liabilityTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY_EANDO:
            this.quote.liabilityEandOTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY_CGL:
          case AllowedProductTemplate.LIABILITY_PUBLIC:
            this.quote.liabilityCGLTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY_PRODUCT:
          case AllowedProductTemplate.LIABILITY_CYBER:
            this.quote.liabilityProductTemplateDataId = quoteOption._id;
            break;
        }
        let payloadQuote = this.quote;
        this.quoteService.updateUWSlip(payloadQuote).subscribe({
          next: (quote: any) => {
            //this.quoteService.refresh();
            const template = this.quoteOptionsLst.filter(x => x._id == event.value)[0]
            this.loadSelectedOption(template);
            this.loadOptionsData(this.quoteOptionsLst);
            this.selectedQuoteTemplate = template
            this.selectedOptionName = template.optionName
          },
          error: error => {
            console.log(error);
          }
        });





      },
      error: e => {
        console.log(e);
      }
    });
  }


  //Intergation-EB [Start]
  displayErrorMessage(message) {
    this.messageService.add({
      severity: "error", summary: "Missing Information",
      detail: message, life: 3000
    });
  }

  validateRolloverPolicy(model: any): boolean {
    if (model.previousStartdate > model.previousEnddate) {
      this.showMessage("error", "Date Error", "Previous policy Start Date should not be greater than End date");
      return false;
    }
    // if (!this.checkAndShowError(model.previousPolicyDetails, "Please enter previous policy details.")) {
    //   return false;
    // }
    if (!this.checkAndShowError(model.previousCompany, "Please enter previous company name.")) {
      return false;
    }

    if (!this.checkAndShowError(model.previousPolicyno, "Please enter previous policy number.")) {
      return false;
    }

    return true;
  }

  private checkAndShowError(value: any, message: string): boolean {
    if (value === undefined || value === "") {
      this.displayErrorMessage(message);
      return false;
    }
    return true;
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }

  createQuoteOption() {
    const ref1 = this.dialogService.open(QuoteOptionListDialogComponent, {
      header: "Select Quote Option",
      width: "60vw",
      styleClass: "customPopup",
      data: {
        quoteId: this.quote._id,
        isIcOptionList: false,
      }
    }).onClose.subscribe((res) => {
      this.getQuoteOptions()
    })
  }


  getQuoteOptions() {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        quoteId: [
          {
            value: this.activatedRoute.snapshot.params.quote_id,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };

    this.quoteOptionService.getMany(lazyLoadEvent).subscribe({
      next: (dto: IManyResponseDto<IQuoteOption>) => {
        this.selectedQuoteOptionOfProperty = this.activatedRoute.snapshot.queryParams.quoteOptionId
        const quoteOptionVersionData = dto.data.entities.filter(val => val.qcrVersion)
        this.allQuoteOptionDropdown = quoteOptionVersionData.length ?
          [{ label: quoteOptionVersionData[quoteOptionVersionData.length - 1].quoteOption, value: quoteOptionVersionData[quoteOptionVersionData.length - 1]._id }] :
          dto.data.entities.map(entity => ({ label: entity.expiredQuoteOption == true ? entity.quoteOption = "Expired Option" : entity.quoteOption, value: entity._id }))
      },
      error: e => {
        console.log(e);
      }
    });
  }

  onChangeQuoteOption(quoteOptionId) {
    this.router.navigate([`/backend/quotes/${this.quote._id}/requisition`], {
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        quoteOptionId: quoteOptionId
      }
    });
    this.onLoadQuoteOption = quoteOptionId
    this.loadQuoteLocationOccupancies()
  }

  isAllowedProduct(): boolean {
    const isTemplateAllowed = [
      AllowedProductTemplate.BLUS,
      AllowedProductTemplate.FIRE,
      AllowedProductTemplate.IAR].includes(this.quote.productId['productTemplate'])
    // checking if quote option have qcr version object
    const quoteOptionVersionData = !this.quoteOptionData?.hasOwnProperty("qcrVersion")

    return isTemplateAllowed && quoteOptionVersionData;
  }


  isAllowedProductLiability() {
    const isTemplateAllowed = [
      AllowedProductTemplate.LIABILITY_CGL,
      AllowedProductTemplate.LIABILITY_PUBLIC,
      AllowedProductTemplate.LIABILITY,
      AllowedProductTemplate.LIABILITY_EANDO,
      AllowedProductTemplate.LIABILITY_CRIME,
      AllowedProductTemplate.LIABILITY_PRODUCT,
      AllowedProductTemplate.WORKMENSCOMPENSATION,
      AllowedProductTemplate.LIABILITY_CYBER
    ].includes(this.quote.productId['productTemplate'])
    return isTemplateAllowed;
  }

  pushBackTo() {
    const payload = {};
    payload["pushBackFrom"] = AllowedPushbacks.RFQ;
    payload["pushBackToState"] = AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE;
    this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
      this.router.navigateByUrl('/backend/quotes')
    })
  }
  visible() {
    this.visibleSidebar = true;
  }

  ngOnDestroy(): void {
    this.currentPropertyQuoteOption.unsubscribe()
  }


  createQuoteOptionsDialog() {
    const ref = this.dialogService.open(LiabilityOptionsDialogComponent, {
      header: "Create Options",
      data: {
        routeToDraft: this.routToDraft,
        quote_id: this.quote._id,
        clientId: this.quote.clientId,
        quote: this.quote,
      },
      width: "60vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {
      this.getOptionsLiability()
      this.loadQuoteDetails(this.quote._id);
    })
  }

  getOptionsLiability() {
    this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<any[]>) => {
        this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
        this.optionsQuoteOptions = this.quoteOptionsLst.map(entity => ({ label: entity.optionName, value: entity._id }));
        this.loadSelectedOption(this.quoteOptionsLst[0]);
        this.loadOptionsData(this.quoteOptionsLst);
      },
      error: e => {
        console.log(e);
      }
    });
  }
}
