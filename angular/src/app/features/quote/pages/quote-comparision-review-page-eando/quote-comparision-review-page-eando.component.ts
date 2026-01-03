import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IBulkImportResponseDto, ILov, ILovSIDDL, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { IWCListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { IProduct, AllowedProductTemplate, AllowedProductBscCover, OPTIONS_PRODUCT_BSC_COVERS, AllowedPushbacks } from 'src/app/features/admin/product/product.model';
import { WCRatesData, IQuoteSlip, SubsidiaryDetails, liabiltyAddOnCovers, AllowedQuoteTypes, OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY, RevenueDetails, RevenueRows, liabiltyEandODeductibles, AllowedQuoteStates, IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { ComparasionwithBrokerModel, QcrHeaders } from '../quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { AllowedAddonCoverCategory, AllowedAddonTypeFlag } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { CoInsuranceFormDialogComponent } from '../../components/other-details-crud-card/co-insurance-form-dialog/co-insurance-form-dialog.component';
import { QuoteSentForPlacementMakerComponent } from '../../status_dialogs/quote-sent-for-placement-maker/quote-sent-for-placement-maker.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { PaymentDetailLiabilityComponent } from '../../components/payment-detail-liability/payment-detail-liability.component';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-quote-comparision-review-page-eando',
  templateUrl: './quote-comparision-review-page-eando.component.html',
  styleUrls: ['./quote-comparision-review-page-eando.component.scss']
})
export class QuoteComparisionReviewPageLiabilityEandOComponent implements OnInit {
  id: string;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  deductiblesInfo: liabiltyEandODeductibles[] = [];
  tabs: MenuItem[] = [];
  // openDropDownClaimExpireance:object = { 'display': 'none' };
  openDropDownClaimExpireance: boolean = false;
  isCloseErrow: boolean = false;
  isOpenErrow: boolean = true;
  subsidaryDetails: SubsidiaryDetails[] = [];
  visibleSidebar = false;
  displayBasic = false;
  quickView = false;
  message: any;
  private currentQuoteOptions: Subscription;
  quoteOptionsLst: any[];
  optionsQuoteOptions: any
  selectedQuoteTemplate: any;
  selectedOptionName = '';
  private currentSelectedTemplate: Subscription;
  selectedQuoteOption: any
  allQuoteOptionDropdown: ILov[]
  dropdownName = []
  selectedInsurer: string = ""
  selectedOptionIndex = 0
  selectedIcOptionTemplate: any
  allQuoteOptions: any
  user: IUser;
  selectedQuoteOptionOfProperty: string
  isInsurerSelected: boolean = true;
  colsRevenue: ILov[] = [
    { value: 'period', label: 'Period/Locations' },
    { value: 'firstYear', label: '' },
    { value: 'secondyear', label: '' },
    { value: 'thirdYear', label: '' },
    { value: 'EstForNextYear', label: 'Est for next year' },
  ];
  rowsRevenue: ILov[] = [
    { value: 'india', label: 'India' },
    { value: 'unitedKingdom', label: 'United Kingdom' },
    { value: 'europe', label: 'Europe' },
    { value: 'usaCanada', label: 'USA/Canada' },
    { value: 'ROW', label: 'ROW (Rest of World)' },
    { value: 'total', label: 'Total' },
  ];
  versionOptions: { label: string, value: number }[] = [];
  selectedVersion: number = 1;
  insurerProcessedQuotes: IQuoteSlip[] = []
  private currentUser: Subscription;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private quoteService: QuoteService,
    private templateService: liabilityTemplateService,
    private dialogService: DialogService,
    private appService: AppService,
    private claimExperienceService: ClaimExperienceService,
    private accountService: AccountService,
    private messageService: MessageService,
    private quoteOptionService: QuoteOptionService,

  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
    console.log(this.id)

    this.selectedTabId = this.activatedRoute.snapshot.queryParams.tab
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote
        if (this.quote) {
          this.versionOptions = []
          for (let i = 1; i <= this.quote.qcrVersion; i++) {
            this.versionOptions.push({ label: `Version ${i}`, value: i });
          }
          this.dropdownName = []
          this.quote.mappedIcNames.map((val) => {
            if (!val.brokerAutoFlowStatus) {
              this.dropdownName.push({ name: val.name });
            }
          });
          if (this.dropdownName.length > 0) {
            this.selectedInsurer = this.dropdownName[0];
          }
        }
      }
    })

    this.currentUser = this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
        console.log(user);
      }
    });

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: template => {
        this.selectedQuoteTemplate = template;
        this.selectedQuoteOption = template._id;
        this.selectedOptionName = template.optionName
      }
    });

    this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.allQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion);
        this.optionsQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion).map(entity => ({ label: entity.optionName, value: entity._id }));
      }
    })

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote
        // Dynamically generate the version options based on qcrversion
        if (this.quote) {
          this.versionOptions = []
          for (let i = 1; i <= this.quote.qcrVersion; i++) {
            this.versionOptions.push({ label: `Version ${i}`, value: i });
          }
        }
      }
    })

    this.currentUser = this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
        console.log(user);
      }
    });
  }

  claimExperiences: IClaimExperience[] = []
  selectedTabId: string;

  ngOnInit(): void {

    this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        console.log(dto.data.entity)
        this.quoteService.setQuote(dto.data.entity)

        this.loadData(dto.data.entity)

        let lazyLoadEvent: LazyLoadEvent = {
          first: 0,
          rows: 5,
          sortField: '_id',
          sortOrder: -1,
          filters: {
            // @ts-ignore
            quoteId: [
              {
                value: this.quote._id,
                matchMode: "equals",
                operator: "and"
              }
            ]
          },
          globalFilter: null,
          multiSortMeta: null
        };

        this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
          next: (dto: IManyResponseDto<IClaimExperience>) => {
            this.claimExperiences = dto.data.entities
            console.log('***', this.claimExperiences)
          }
        })
        // console.log(this.data)
      },
      error: e => {
        console.log(e);
      }
    });
  }

  ngOnDestroy(): void {
    // this.currentQuoteLocationOccupancyId.unsubscribe();
    this.currentQuote.unsubscribe();
  }

  sendQuoteForApproval() {
    this.quoteService.sendForQCRApproval(this.quote._id, { qcrApprovalRequested: true, quoteSlipApprovalRequested: false }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.refresh((quote) => {
          this.router.navigateByUrl(`/`);
        })
      },
      error: error => {
        console.log(error);
      }
    });
  }

  //#region 
  selectedInsurerQuote(): any {
    let selectedICquote: any = this.insurerProcessedQuotes.find(x => x.partnerId['name'] == this.selectedInsurer['name'] && x.qcrVersion == this.selectedVersion);
    return selectedICquote.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName)
  }

  qcrEdit(quoteNo) {
    // const payload = {};
    // payload["pushBackFrom"] = AllowedPushbacks.QCR;
    // payload["pushBackToState"] = AllowedQuoteStates.UNDERWRITTER_REVIEW;
    // this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
    //   this.router.navigateByUrl('/backend/quotes')
    // })
    this.templateService.editLiabilityQCR(quoteNo).subscribe({
      next: response => {
        //this.quoteOptionService.refreshQuoteOption()
        this.router.navigateByUrl(`/backend/quotes`)
      }
    });
  }


  handleQuoteOptionChangeLiability(event) {
    this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<any[]>) => {
        let template = this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x._id == event.value)[0]
        this.selectedOptionName = template.optionName
        this.selectedQuoteOption = template?._id
        this.loadSelectedOption(template);
        this.loadOptionsData(dto.data.entity);
        this.loadData(this.quote)
        this.mappingQCR = [];
        this.mappingQCRArr = [];
        this.QuickViewFunciton()
      },
      error: e => {
        console.log(e);
      }
    });
  }





  #endregion

  visible() {
    this.visibleSidebar = true
  }
  toggleQuickView(): any {
    this.quickView = !this.quickView
  }

  mappingQCR = []
  mappingQCRArr = []
  mapping = []
  // mapping: Array<{
  //     [colId: string]: {
  //         type: 'html' | 'string' | 'button' | 'boolean' | 'currency',
  //         value: string | number,
  //         buttonClassName?: string
  //         buttonOnClick?: any

  //     }
  // }> = []

  cols: MenuItem[] = []

  // ---------------------------------------------------------------
  onVersionChange(event: any) {
    const selectedValue = event.value;
    console.log('Selected version:', selectedValue);
    this.mappingQCR = [];
    this.mappingQCRArr = [];
    this.mapping = [];
    this.cols = [];
    this.loadData(this.quote)
  }

  loadData(brokerQuote: IQuoteSlip) {
    this.cols = [];
    this.tabs = this.loadTabs(brokerQuote.productId as IProduct)
    this.insurerProcessedQuotes = brokerQuote.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion);
    this.selectTab(this.tabs.find(tab => tab.id == this.selectedTabId))

    // Setting the headers
    this.cols.push({ id: 'labels', style: "width:200px" })

    // Setting the headers for Broker
    this.cols.push({ id: brokerQuote._id, label: brokerQuote.originalIntermediateName, style: "width:200px" })

    for (const insurerQuote of this.quote.insurerProcessedQuotes) {
      this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
      // }
    }
    this.QuickViewFunciton();
  }

  QuickViewFunciton() {
    //to store words
    let clientDetailsString = {}
    let addOnsCoverString = {}
    let territoryString = {}
    //let deductiblesString = {}
    let otherDetailsString = {}
    let basicDetailsString = {}


    function filterFun(arr) {
      return arr.filter(item => {
        for (var key in item) {
          if (item[key]['styleaddon'] == 'red') {
            return item;
          }
        }
      })
    }

    let mappingQCRClient = filterFun(this.clientDetailsFunc())

    if (mappingQCRClient.length > 0) {
      clientDetailsString = {
        "labels": {
          "type": "header",
          "value": "Client Details"

        }
      }
    }

    let mappingQCRTerritory = filterFun(this.territoryDetailsFunc())

    if (mappingQCRTerritory.length > 0) {
      territoryString = {
        "labels": {
          "type": "header",
          "value": "Territory Details"
        }
      }
    }

    // let mappingQCRDeductibles = filterFun(this.deductiblesFunc())

    // if (mappingQCRDeductibles.length > 0) {
    //   deductiblesString = {
    //     "labels": {
    //       "type": "header",
    //       "value": "Deductibles"
    //     }
    //   }
    // }

    let mappingAddOnsDetails = filterFun(this.addOnsDetailsFunc())

    if (mappingAddOnsDetails.length > 0) {
      addOnsCoverString = {
        "labels": {
          "type": "header",
          "value": "Add-Ons Covers"
        }
      }
    }

    let mappingOtherDetails = filterFun(this.otherDetailsFunc())

    if (mappingOtherDetails.length > 0) {
      otherDetailsString = {
        "labels": {
          "type": "header",
          "value": "Other Details"
        }
      }
    }

    let mappingBasicDetails = filterFun(this.BasicDetailsFunc())

    if (mappingBasicDetails.length > 0) {
      basicDetailsString = {
        "labels": {
          "type": "header",
          "value": "Basic Details"
        }
      }
    }

    this.mappingQCR = [clientDetailsString, ...mappingQCRClient, basicDetailsString, ...mappingBasicDetails, addOnsCoverString, ...mappingAddOnsDetails, territoryString, ...mappingQCRTerritory, otherDetailsString, ...mappingAddOnsDetails]
    let count = 0
    this.mappingQCRArr = this.mappingQCR.filter(item => {
      if (Object.keys(item).length > 0) {
        return item;
      }
    })
  }


  clientDetailsFunc() {
    const tempArr = []
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Type of Policy" },
      [this.quote._id]: { type: 'string', value: this.quote.productId['type'] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.productId['type'] != quote.productId['type'] ? quote.productId['type'] : null } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Insured Name" },
      [this.quote._id]: { type: 'string', value: this.quote.clientId['name'] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.clientId['name'] } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Type of Proposal" },
      [this.quote._id]: { type: 'string', value: this.quote.quoteType },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.quoteType != quote.quoteType ? this.quote.quoteType : null } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'html', value: "<strong>Details of Existing Insurer</strong>" },
      [this.quote._id]: { type: 'string', value: '' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: '' } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Name of Insurer" },
      [this.quote._id]: { type: 'string', value: '' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: '' } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "City of Insurer Office", },
      [this.quote._id]: { type: 'string', value: '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "DO No." },
      [this.quote._id]: { type: 'string', value: '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'html', value: "<strong>Current Policy Details</strong>" },
      [this.quote._id]: { type: 'string', value: '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
    })));


    if (this.quote.quoteType == AllowedQuoteTypes.EXISTING) {
      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Expiring Policy Period" },
        [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
      })));
    }

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Policy Period" },
      [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Insured's Business" },
      [this.quote._id]: { type: 'string', value: this.quote.clientId['natureOfBusiness'] ?? '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: quote.clientId['natureOfBusiness'] ?? '-' } })
    })));

    return tempArr;
  }

  territoryDetailsFunc() {
    const tempArr = []

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Jurisdiction" },
      [this.quote._id]: {
        type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey']

      },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey'] ? 'red' : '' } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Territory" },
      [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'] ? 'red' : '' } })
    })));



    return tempArr;

  }

  otherDetailsFunc() {
    const tempArr = [];
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Deductibles/Excess" },
      [this.quote._id]: { type: 'currency', value: this.quote.deductiblesExcessPd == undefined || this.quote.deductiblesExcessPd == null ? 0 : Number(this.quote.deductiblesExcessPd) },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({
        [quote._id]: {
          type: 'currency', value: quote.deductiblesExcessPd == undefined || quote.deductiblesExcessPd == null ? 0 : Number(quote.deductiblesExcessPd),
          styleaddon: quote.deductiblesExcessPd != this.quote.deductiblesExcessPd ? 'red' : ''
        }
      })
    })));
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Brokerages" },
      [this.quote._id]: { type: 'string', value: this.quote.brokerage ? this.quote.brokerage : '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.brokerage, styleaddon: quote.brokerage != this.quote.brokerage ? 'red' : '' } })
    })));
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Quote Submission Date" },
      [this.quote._id]: { type: 'string', value: this.quote.quoteSubmissionDate ? new Date(this.quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.quoteSubmissionDate ? new Date(quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ', styleaddon: quote.quoteSubmissionDate != this.quote.quoteSubmissionDate ? 'red' : '' } })
    })));
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Target Premium" },
      [this.quote._id]: { type: this.quote.targetPremium ? 'currency' : 'string', value: this.quote.targetPremium ?? '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: (quote.targetPremium && quote.targetPremium != this.quote.targetPremium) ? 'currency' : 'string', value: quote.targetPremium == this.quote.targetPremium ? '-' : quote.targetPremium } })
    })));
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Existing Broker and Brokers Involved for current year" },
      [this.quote._id]: { type: 'string', value: this.quote.existingBrokerCurrentYear ? this.quote.existingBrokerCurrentYear : '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({
        [quote._id]:
          { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.existingBrokerCurrentYear ? quote.existingBrokerCurrentYear : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'red' : '' }
      })
    })));
    // this.mapping.push(Object.assign({
    //     'labels': { type: 'string', value: "Preferred insurer" },
    //     [this.quote._id]: { type: 'string', value: this.quote.preferredInsurer },
    // }, ...this.insurerProcessedQuotes.map((quote) => {
    //     return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue':'string', value: quote.preferredInsurer } })
    // })));
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Other Terms" },
      [this.quote._id]: { type: 'string', value: this.quote.otherTerms ? this.quote.otherTerms : '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.otherTerms ? quote.otherTerms : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'red' : '' } })
    })));
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Any Additional Information" },
      [this.quote._id]: { type: 'string', value: this.quote.additionalInfo ? this.quote.additionalInfo : '-' },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.additionalInfo ? quote.additionalInfo : '-', styleaddon: quote.additionalInfo != this.quote.additionalInfo ? 'red' : '' } })
    })));

    return tempArr;
  }

  addOnsDetailsFunc() {
    const tempArr: any[] = [];
    const uniqueLabels = new Set(); // To track distinct labels

    // First, add covers from this.quote?.liabilityEandOTemplateDataId["liabiltyCovers"]
    Object.entries(this.quote?.liabilityEandOTemplateDataId["liabiltyCovers"] as Record<string, any>).forEach(([breakUpkey, breakup]) => {
      const label = breakup.name;

      if (!uniqueLabels.has(label)) {
        let tempObj: Record<string, { type: string; value: any; isAlignmentRequired?: boolean; styleaddon?: string }> = {
          labels: { type: 'string', value: label },
          [this.quote._id]: { type: 'string', value: breakup.optionSelected === "" ? "N/A" : breakup.optionSelected, isAlignmentRequired: false }
        };

        this.insurerProcessedQuotes.forEach((quote) => {
          const insurerBreakup = Object.entries(quote.liabilityEandOTemplateDataId["liabiltyCovers"] as Record<string, any>)
            .find(([insurerBreakUpkey]) => insurerBreakUpkey === breakUpkey);

          const insurerBreakupValue = insurerBreakup ? (insurerBreakup[1].optionSelected === "" ? "N/A" : insurerBreakup[1].optionSelected) : null;

          tempObj[quote._id] = {
            type: 'string',
            value: insurerBreakupValue,
            isAlignmentRequired: false,
            ...(insurerBreakupValue !== tempObj[this.quote._id].value && { styleaddon: 'red' })
          };
        });

        tempArr.push(tempObj);
        uniqueLabels.add(label); // Mark this label as added
      }
    });

    // Now, check for any additional covers in insurerProcessedQuotes that are not in this.quote?.liabilityEandOTemplateDataId["liabiltyCovers"]
    this.insurerProcessedQuotes.forEach((quote) => {
      Object.entries(quote.liabilityEandOTemplateDataId["liabiltyCovers"] as Record<string, any>).forEach(([insurerBreakUpkey, insurerBreakup]) => {
        const label = insurerBreakup.name;

        if (!uniqueLabels.has(label)) {
          let tempObj: Record<string, { type: string; value: any; isAlignmentRequired?: boolean; styleaddon?: string }> = {
            labels: { type: 'string', value: label },
            [quote._id]: { type: 'string', value: insurerBreakup.optionSelected === "" ? "N/A" : insurerBreakup.optionSelected, styleaddon: 'red', isAlignmentRequired: false }
          };

          // Add the current insurer's cover to other insurerProcessedQuotes
          this.insurerProcessedQuotes.forEach((innerQuote) => {
            const innerInsurerBreakup = Object.entries(innerQuote.liabilityEandOTemplateDataId["liabiltyCovers"] as Record<string, any>)
              .find(([innerBreakUpkey]) => innerBreakUpkey === insurerBreakUpkey);

            const innerInsurerBreakupValue = innerInsurerBreakup ? (innerInsurerBreakup[1].optionSelected === "" ? "N/A" : innerInsurerBreakup[1].optionSelected) : null;

            tempObj[innerQuote._id] = {
              type: 'string',
              value: innerInsurerBreakupValue,
              ...(innerInsurerBreakupValue !== tempObj[quote._id].value && { styleaddon: 'red' }),
              isAlignmentRequired: false
            };
          });

          tempArr.push(tempObj);
          uniqueLabels.add(label); // Mark this label as added
        }
      });
    });

    return tempArr;
  }


  deductiblesFunc() {
    const tempArr = []

    // First, add deductibles from this.quote?.liabilityEandOTemplateDataId["deductibles"]
    for (let d of this.quote?.liabilityEandOTemplateDataId["deductibles"]) {
      let tempObj: Record<string, { type: string; value: any }> = {
        'labels': { type: 'string', value: `${d.description}` },
        [this.quote._id]: { type: 'currency', value: d.amount }
      };

      this.insurerProcessedQuotes.forEach((quote) => {
        const foundDeductible = quote.liabilityEandOTemplateDataId["deductibles"].find(s =>
          s.description === d.description
        );

        const amountValue = foundDeductible ? foundDeductible['amount'] : null;

        tempObj[quote._id] = {
          type: 'currency',
          value: amountValue,
          ...(amountValue !== d.amount && { styleaddon: 'red' })
        };
      });

      tempArr.push(tempObj);
    }

    // Now, check for any additional deductibles in insurerProcessedQuotes that are not in this.quote?.liabilityEandOTemplateDataId["deductibles"]
    this.insurerProcessedQuotes.forEach((quote) => {
      quote.liabilityEandOTemplateDataId["deductibles"].forEach((s) => {
        const alreadyAdded = tempArr.some((item) => item.labels.value.includes(s.description));
        if (!alreadyAdded) {
          let tempObj: Record<string, { type: string; value: any, styleaddon: any }> = {
            'labels': { type: 'string', value: `${s.description}`, styleaddon: "" },
            [quote._id]: { type: 'currency', value: s.amount, styleaddon: "" }
          };

          // Add this quote's deductible to the object
          tempObj[quote._id] = {
            type: 'currency',
            value: s.amount,
            styleaddon: 'red'
          };

          // Add the current quote to other insurerProcessedQuotes
          this.insurerProcessedQuotes.forEach((innerQuote) => {
            if (innerQuote._id !== quote._id) {
              const foundDeductible = innerQuote.liabilityEandOTemplateDataId["deductibles"].find(deductible =>
                deductible.description === s.description
              );
              const amountValue = foundDeductible ? foundDeductible['amount'] : null;

              tempObj[innerQuote._id] = {
                type: 'currency',
                value: amountValue,
                ...(amountValue !== s.amount && { styleaddon: 'red' })
              };
            }
          });

          tempArr.push(tempObj);
        }
      });
    });
    return tempArr;
  }


  BasicDetailsFunc() {
    const tempArr = []

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Details of Business Activity" },
      [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity, styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity.toString() != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity.toString() ? 'red' : '' } })
    })));
    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Type of Policy" },
      [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].typeOfPolicy },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'tickOrValue', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].typeOfPolicy } })
    })));

    // tempArr.push(Object.assign({
    //   'labels': { type: 'string', value: "Years of Experience" },
    //   [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'] },
    // }, ...this.insurerProcessedQuotes.map((quote) => {
    //   return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'] ? 'red' : '' } })
    // })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Retroactive Details" },
      [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'] ? 'red' : '' } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Retroactive Date" },
      [this.quote._id]: { type: 'string', value: this.formatDateToMMDDYYYY(this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate.toString()) },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: this.formatDateToMMDDYYYY(quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate.toString()), styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate ? 'red' : '' } })
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Additional Information" },
      [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].additionalInformation },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].additionalInformation, styleaddon: 'red' } })
    })));

    return tempArr;

  }
  // ---------------------------------------------------------------

  // ---------------------------------------------------------------

  createQuoteOptionQCRVersioning(insurerQuoteOptionId, brokerQuoteId) {
    this.quoteService.createOptionQCRVersioningLiability(insurerQuoteOptionId, brokerQuoteId).subscribe({
      next: response => {
        this.router.navigateByUrl(`/backend/quotes`)
      }
    });
  }

  loadTabs(product: IProduct): MenuItem[] {
    switch (product.productTemplate) {
      case AllowedProductTemplate.BLUS:
        return [
          { label: "Client Details", id: "client_details" },
          { label: "Sum Insured Details", id: "sum_insured_details" },
          { label: "Coverage and Addons", id: "add_ons" },
          { label: "Business Suraksha Covers", id: "business_suraksha_covers" },
          { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
          { label: "Other Details", id: "other_details" },
        ]

      case AllowedProductTemplate.FIRE:
        return [
          { label: "Client Details", id: "client_details" },
          { label: "Sum Insured Details", id: "sum_insured_details" },
          { label: "Coverage and Addons", id: "add_ons" },
          { label: "Risk Management Features", id: "risk_management_features" },
          { label: "Other Details", id: "other_details" },
        ]
      case AllowedProductTemplate.IAR:
        return [
          { label: "Client Details", id: "client_details" },
          { label: "Sum Insured Details", id: "sum_insured_details" },
          { label: "Coverage and Addons", id: "add_ons" },
          { label: "Risk Management Features", id: "risk_management_features" },
          { label: "Other Details", id: "other_details" },
        ]
      case AllowedProductTemplate.MARINE:
        return [
          { label: "Client Details", id: "client_details" },
          { label: "Sum Insured Details", id: "sum_insured_details" },
          { label: "Risk Management Features", id: "risk_management_features" },
          { label: "Add-ons", id: "add_ons" },
          { label: "Other Details", id: "other_details" },
        ]
      case AllowedProductTemplate.WORKMENSCOMPENSATION:
        return [
          { label: "Workmen Details", id: "wm_details" },
          { label: "Additional Coverages", id: "additional_coverages" },
          { label: "Other Details", id: "other_details" }
        ]
      case AllowedProductTemplate.GMC:
        if (this.quote.quoteType != 'new') {
          return [
            { label: "Client Details", id: "client_details" },
            { label: "Basic Details", id: "basic_details" },
            { label: "Employee Details", id: "employee_features" },
            { label: "Family Composition", id: "family_composition" },
            { label: "Coverages", id: "coverages" },
            { label: "Maternity Benifits", id: "maternity_benifits" },
            { label: "Cost Containment", id: "cost_containment" },
            { label: "Claim Analytics", id: "claim_analytics" },
            { label: "Final Rater", id: "final_rater" },
            { label: "Other Details", id: "other_details" }

          ]
        }
        else {
          return [{ label: "Client Details", id: "client_details" },
          { label: "Basic Details", id: "basic_details" },
          { label: "Employee Details", id: "employee_features" },
          { label: "Family Composition", id: "family_composition" },
          { label: "Coverages", id: "coverages" },
          { label: "Maternity Benifits", id: "maternity_benifits" },
          { label: "Cost Containment", id: "cost_containment" },
          // { label: "Claim Analytics", id: "claim_analytics" },
          // { label: "Final Rater", id: "final_rater" },
          { label: "Other Details", id: "other_details" }
          ]
        }
      case AllowedProductTemplate.LIABILITY:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Deductibles", id: "deductibles" },
          { label: "Other Details", id: "other_details" }
        ]
      case AllowedProductTemplate.LIABILITY_EANDO:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Deductibles", id: "deductibles" },
          { label: "Other Details", id: "other_details" }
        ]

      case AllowedProductTemplate.LIABILITY_CGL:
        return [
          { label: "Basics Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Claim Experience & Tunover Details", id: "revenue_details" },
          { label: "Other Details", id: "other_details" }
        ]
      case AllowedProductTemplate.LIABILITY_PRODUCT:
        return [
          { label: "Basic Details", id: 'basic_details' },
          { label: "Territory & Subsidiary Details", id: 'territorysubsidiary' },
          { label: "Turnover Details", id: 'revenue_details' },
          { label: "Deductibles & Claim Experience", id: 'deductibles' },
          { label: "Other Details", id: "other_details" }
        ]
      case AllowedProductTemplate.LIABILITY_CYBER:
        return [
          { label: "Basic Details", id: 'basic_details' },
          { label: "Territory & Subsidiary Details", id: 'territorysubsidiary' },
          { label: "Breakup Details", id: 'revenue_details' },
          { label: "Deductibles & Claim Experience", id: 'deductibles' },
          { label: "Other Details", id: "other_details" }
        ]
      case AllowedProductTemplate.LIABILITY_PUBLIC:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory Details", id: "territorysubsidiary" },
          { label: "Turnover Details", id: "revenue_details" },
          { label: "Other Details", id: "other_details" }
        ]
      case AllowedProductTemplate.LIABILITY_CRIME:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Breakup Details", id: 'revenue_details' },
          { label: "Deductibles & Claim Experience", id: 'deductibles' },
          { label: "Other Details", id: "other_details" }

        ]

    }
  }

  selectTab(tab?: MenuItem) {
    this.subsidaryDetails = this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].subsidaryDetails
    this.subsidaryDetails.forEach(element => {
      if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
        element.activityName = 'N/A'
      }
    });
    this.updateYears()
    console.log(tab)
    if (!tab) tab = this.tabs.find(tab => tab.id == this.selectedTabId) ?? this.tabs[0]
    this.router.navigate([], { queryParams: { tab: tab?.id } });
    this.selectedTabId = tab?.id
    this.mapping = []
    this.mapping.push(
      Object.assign(
        {
          [this.quote?._id]: {
            type: 'button',
            buttonClassName: 'btn btn-primary p-0 px-2',
            onClick: () => this.openQuoteSlip(this.quote, this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0]),
            value: 'View Slip',
          },
        },
        ...this.quote?.insurerProcessedQuotes.map((quote) => {
          const isBankNameEmpty = quote?.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName)?.bankName === '';
          return {
            [quote._id]: {
              type: 'buttons',
              buttons: [
                {
                  onClick: () => this.openQuoteSlip(quote, quote?.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName)),
                  buttonClassName: 'btn btn-primary p-0 px-2',
                  value: 'View Slip',
                },
                ...(this.quote.qcrApprovedRequested && this.quote.qcrApproved
                  ? [
                    {
                      ...(isBankNameEmpty ? {} : { onClick: () => this.generatePlacementSlip(quote, quote?.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName)._id) }),
                      buttonClassName: `btn p-0 px-2 ml-2 ${isBankNameEmpty ? 'btn-danger' : 'btn-success'}`,
                      value: 'Generate Placement Slip',
                    },
                  ]
                  : []),
                {
                  buttonClassName: quote?.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName).isAccepted === 'Accept'
                    ? 'btn p-0 px-2 ml-2 btn-success bg-opacity-10'
                    : 'btn p-0 px-2 ml-2 btn-danger bg-opacity-10',
                  value: quote?.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName).isAccepted === 'Accept' ? 'Accepted' : 'Rejected',
                },
                { onClick: () => this.createQuoteOptionQCRVersioning(quote?.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName)._id, this.quote._id), buttonClassName: this.quote.pushedBackToId != null || this.quote.qcrApproved != null ? "btn btn-dark p-0 px-2 ml-2" : "hidden", value: 'Quote Version' },

              ],
            },
          };
        })
      )
    );


    this.mapping.push(Object.assign({
      'labels': { type: 'string', value: "Premium Without Taxes" },
      [this.quote._id]: { type: 'currency', value: +this.quote.liabilityEandOTemplateDataId['totalPremiumAmt'] + +this.quote.liabilityEandOTemplateDataId['totalPremiumAmt'] * 0.18 },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'currency', value: +quote.liabilityEandOTemplateDataId['totalPremiumAmt'] + +quote.liabilityEandOTemplateDataId['totalPremiumAmt'] * 0.18 } })
    })));



    switch (tab?.id) {
      case 'basic_details':
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Type of Policy" },
          [this.quote._id]: { type: 'string', value: this.quote.productId['type'] },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'string', value: this.quote.productId['type'] != quote.productId['type'] ? quote.productId['type'] : null } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Insured Name" },
          [this.quote._id]: { type: 'string', value: this.quote.clientId['name'] },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.clientId['name'] } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Type of Proposal" },
          [this.quote._id]: { type: 'string', value: this.quote.quoteType },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.quoteType != quote.quoteType ? this.quote.quoteType : null } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'html', value: "<strong>Details of Existing Insurer</strong>" },
          [this.quote._id]: { type: 'string', value: '' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '' } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Name of Insurer" },
          [this.quote._id]: { type: 'string', value: '' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '' } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "City of Insurer Office", },
          [this.quote._id]: { type: 'string', value: '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "DO No." },
          [this.quote._id]: { type: 'string', value: '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'html', value: "<strong>Current Policy Details</strong>" },
          [this.quote._id]: { type: 'string', value: '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
        })));


        if (this.quote.quoteType == AllowedQuoteTypes.EXISTING) {
          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Expiring Policy Period" },
            [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'tickOrValue', value: quote.renewalPolicyPeriod } })
          })));
        }

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Policy Period" },
          [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'html', value: "<strong>Basic Liability Details</strong>" },
          [this.quote._id]: { type: 'string', value: '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
        })));
        // NOT NEEDED IN QCR
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Details of Business Activity" },
          [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity, styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity.toString() != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].detailsOfBusinessActivity.toString() ? 'red' : '' } })
        })));
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Type of Policy" },
          [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].typeOfPolicy },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].typeOfPolicy } })
        })));

        // this.mapping.push(Object.assign({
        //   'labels': { type: 'string', value: "Years of Experience" },
        //   [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'] },
        // }, ...this.insurerProcessedQuotes.map((quote) => {
        //   return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x=>x.optionName == this.selectedOptionName)[0].numberOfExperienceId['lovKey'] ? 'red' : '' } })
        // })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Retroactive Details" },
          [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'] },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveCoverId['lovKey'] ? 'red' : '' } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Retroactive Date" },
          [this.quote._id]: { type: 'string', value: this.formatDateToMMDDYYYY(this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate.toString()) },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'string', value: this.formatDateToMMDDYYYY(quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate.toString()), styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].retroactiveDate ? 'red' : '' } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Additional Information" },
          [this.quote._id]: {
            type: 'string',
            value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].additionalInformation
          },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          const additionalInfo = quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].additionalInformation;
          const styleAddon = additionalInfo !== this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].additionalInformation ? 'red' : '';

          return ({
            [quote._id]: {
              type: 'string',
              value: additionalInfo,
              styleaddon: styleAddon
            }
          });
        })));



        this.mapping.push({
          'labels': { type: 'html', value: '<strong>Add-Ons Covers</strong>' }
        });
        let breakupKeys = []
        if (this.quote.allCoversArray) {
          let breakupValue;
          Object.entries(this.quote.allCoversArray?.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].liabiltyCovers).forEach(([breakUpkey, breakup]) => {
            breakupValue = breakup.optionSelected == "" ? "N/A" : breakup.optionSelected
            this.mapping.push(Object.assign({
              'labels': { type: 'string', value: breakup.name },
              [this.quote._id]: { type: 'string', isAlignmentRequired: false, value: breakup.optionSelected == "" ? "N/A" : breakup.optionSelected },
            }, ...this.insurerProcessedQuotes.map((quote) => {

              let insurerBreakupValue;

              Object.entries(quote.allCoversArray?.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].liabiltyCovers).forEach(([insurerBreakUpkey, insurerBreakup]) => {
                if (insurerBreakUpkey == breakUpkey) {
                  insurerBreakupValue = insurerBreakup.optionSelected == "" ? "N/A" : insurerBreakup.optionSelected
                  // if (Object.entries(insurerBreakup)?.find(([name, value]) => value == breakup.optionSelected))
                  //   insurerBreakupValue = Object.entries(insurerBreakup)?.find(([name, value]) => value == breakup.optionSelected)[1]
                }
                // insurerBreakupValue = value ?? 0

              })

              return ({ [quote._id]: { type: 'string', isAlignmentRequired: false, value: insurerBreakupValue, styleaddon: insurerBreakupValue != breakupValue ? 'red' : '' } })
            })));


          })
        }

        break;

      case 'territorysubsidiary':


        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Jurisdiction" },
          [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey'] },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].juridictionId['lovKey'] ? 'red' : '' } })
        })));

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Territory" },
          [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'] },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'], styleaddon: quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'] != this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].territoryId['lovKey'] ? 'red' : '' } })
        })));


        break;

      case 'revenue_details':

        this.mapping.push(Object.assign({
          'labels': { type: 'html', value: "<strong>Revenue Breakup Details</strong>" },
          [this.quote._id]: { type: 'string', value: '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
        })));
        if (!this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails) {
          this.quote.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails = new RevenueDetails();
          this.quote.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails.revenueColumn = this.colsRevenue;
          this.rowsRevenue.forEach(element => {
            var data = new RevenueRows();
            data.label = element.label;
            data.name = element.value;
            data.firstYear = 0;
            data.secondYear = 0;
            data.thirdYear = 0;
            data.estimatedForNextYear = 0;
            this.quote.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails.revenueRows.push(data);
          });
        }
        else {

        }
        break;
      case 'deductibles':
        this.deductiblesInfo = []//this.quote?.insurerProcessedQuotes[0].allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].liabiltyDeductibles
        this.mapping.push(Object.assign({
          'labels': { type: 'html', value: "<strong>Deductibles</strong>" },
          [this.quote._id]: { type: 'string', value: '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: '-' } })
        })));

        break;
      case 'other_details':
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Deductibles/Excess" },
          [this.quote._id]: { type: 'currency', value: this.quote.deductiblesExcessPd == undefined || this.quote.deductiblesExcessPd == null ? 0 : Number(this.quote.deductiblesExcessPd) },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({
            [quote._id]: {
              type: 'currency', value: quote.deductiblesExcessPd == undefined || quote.deductiblesExcessPd == null ? 0 : Number(quote.deductiblesExcessPd),
              styleaddon: quote.deductiblesExcessPd != this.quote.deductiblesExcessPd ? 'red' : ''
            }
          })
        })));
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Brokerages" },
          [this.quote._id]: { type: 'string', value: this.quote.brokerage ? this.quote.brokerage : '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.brokerage, styleaddon: quote.brokerage != this.quote.brokerage ? 'red' : '' } })
        })));
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Quote Submission Date" },
          [this.quote._id]: { type: 'string', value: this.quote.quoteSubmissionDate ? new Date(this.quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.quoteSubmissionDate ? new Date(quote.quoteSubmissionDate).toLocaleDateString('en-UK', { day: "numeric", month: "long", year: 'numeric' }) : ' ', styleaddon: quote.quoteSubmissionDate != this.quote.quoteSubmissionDate ? 'red' : '' } })
        })));
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Target Premium" },
          [this.quote._id]: { type: this.quote.targetPremium ? 'currency' : 'string', value: this.quote.targetPremium ?? '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: (quote.targetPremium && quote.targetPremium != this.quote.targetPremium) ? 'currency' : 'string', value: quote.targetPremium == this.quote.targetPremium ? '-' : quote.targetPremium } })
        })));
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Existing Broker and Brokers Involved for current year" },
          [this.quote._id]: { type: 'string', value: this.quote.existingBrokerCurrentYear ? this.quote.existingBrokerCurrentYear : '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({
            [quote._id]:
              { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.existingBrokerCurrentYear ? quote.existingBrokerCurrentYear : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'red' : '' }
          })
        })));
        // this.mapping.push(Object.assign({
        //     'labels': { type: 'string', value: "Preferred insurer" },
        //     [this.quote._id]: { type: 'string', value: this.quote.preferredInsurer },
        // }, ...this.insurerProcessedQuotes.map((quote) => {
        //     return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue':'string', value: quote.preferredInsurer } })
        // })));
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Other Terms" },
          [this.quote._id]: { type: 'string', value: this.quote.otherTerms ? this.quote.otherTerms : '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.otherTerms ? quote.otherTerms : '-', styleaddon: quote.existingBrokerCurrentYear != this.quote.existingBrokerCurrentYear ? 'red' : '' } })
        })));
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Any Additional Information" },
          [this.quote._id]: { type: 'string', value: this.quote.additionalInfo ? this.quote.additionalInfo : '-' },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: this.quote.existingBrokerCurrentYear ? 'tickOrValue' : 'string', value: quote.additionalInfo ? quote.additionalInfo : '-', styleaddon: quote.additionalInfo != this.quote.additionalInfo ? 'red' : '' } })
        })));
        if (this.quote.qcrApprovedRequested && this.quote.qcrApproved) {
          this.mapping.push(
            Object.assign(
              {
                'labels': {
                  type: 'string',
                  value: "Submit Bank Details"
                },
              },
              ...this.insurerProcessedQuotes.map((quote) => {
                return {
                  [quote["_id"]]: {
                    type: 'button',
                    value: "Submit Payment Details",
                    buttonClassName: 'btn btn-primary',
                    onClick: () => {
                      this.submitBankDetails(quote._id, quote?.allCoversArray.liabilityTemplateEandOCovers.find(x => x.optionName == this.selectedOptionName)._id);
                    },
                  },
                };
              })
            )
          );
        }

        if (this.quote.placementApproved) {
          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Submit Co-insurer Details" },
            [this.quote._id]: {
              type: 'button',
              value: "Co-insurer Details",
              buttonClassName: 'btn btn-primary',
              onClick: () => { this.submitCoinsurerDetails() }
            }
          }, ...this.quote?.insurerProcessedQuotes.map((quote) => {
            return ({
              [quote["_id"]]: {
                type: 'button',
                value: "Co-insurer Details",
                buttonClassName: 'btn btn-primary',
                onClick: () => { this.submitCoinsurerDetails(quote["_id"]) }
              }
            });
          })));
        }
        break;


    }



    // console.log(this.mapping)
  }
  // --------------------------------------------------------------
  submitCoinsurerDetails(quoteId?: any) {
    console.log(quoteId)
    const quote = quoteId ? this.insurerProcessedQuotes.find((quote) => quote._id == quoteId) : this.quote
    console.log("Submitting Bank Details:", this.quote);
    if (quote) {
      const ref = this.dialogService.open(CoInsuranceFormDialogComponent, {
        header: "Co-Insurance Details",
        styleClass: 'customPopup',
        width: '1000px',
        data: {
          quote: quote,
          quoteOptionData: this.quote
        }
      })
      ref.onClose.subscribe((data) => {
      });
    }
  }

  submitBankDetails(quoteId, optionId) {
    console.log("Submitting Bank Details:", optionId);
    if (optionId) {
      const ref = this.dialogService.open(PaymentDetailLiabilityComponent, {
        header: "Payment Details",
        width: '1200px',
        styleClass: 'customPopup-dark',
        data: {
          templateName: AllowedProductTemplate.LIABILITY_EANDO,
          optionId: optionId,
          quoteId: quoteId
        }
      })
      ref.onClose.subscribe({
        next: () => {
          this.loadData(this.quote)
        }
      })
    }
  }

  getTotalfirstYear() {
    const firstYear = this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.firstYear;
    }, 0);
    return firstYear;
  }

  getTotalsecondYear() {
    const secondYear = this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.secondYear;
    }, 0);
    return secondYear;
  }

  getTotalthirdYear() {
    const thirdYear = this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.thirdYear;
    }, 0);
    return thirdYear;
  }
  getTotalestimatedForNextYear() {
    const estimatedForNextYear = this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0].revenueDetails.revenueRows.reduce((accumulator, object) => {
      return accumulator + object.estimatedForNextYear;
      ;
    }, 0);
    return estimatedForNextYear;
  }

  sendQuoteForApprovalbymaker() {
    this.quoteService.sendForQCRApproval(this.quote._id, { qcrApprovalRequested: true, quoteSlipApprovalRequested: false }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        // this.quoteService.refresh((quote) => {
        //   this.router.navigateByUrl(`/`);
        // })
        this.quoteService.refresh((quote) => {

          // OTC QUOTE GENERATE PLACEMENT SLIP (FROM Requsistion)
          const ref = this.dialogService.open(QuoteSentForPlacementMakerComponent, {
            header: '',
            width: '700px',
            styleClass: 'flatPopup',
            data: {
              quote: quote
            }

          });

          ref.onClose.subscribe((isNavigate = true) => {
            // If nothings comes then go to dashboard
            if (isNavigate) this.router.navigateByUrl(`/backend/quotes`);
          })

        })
      },
      error: error => {
        console.log(error);
      }
    });
  }

  pushBackTo() {
    const payload = {};
    payload["pushBackFrom"] = AllowedPushbacks.QCR;
    payload["pushBackToState"] = AllowedQuoteStates.QCR_FROM_UNDERWRITTER;
    this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
      this.router.navigateByUrl('/backend/quotes')
    })
  }


  updateYears() {
    const currentYear = new Date().getFullYear();
    this.colsRevenue[3].label = currentYear.toString();
    this.colsRevenue[2].label = (currentYear - 1).toString();
    this.colsRevenue[1].label = (currentYear - 2).toString();
  }

  openQuoteSlip(quote: any, template: any) {
    //this.quoteService.setQuote(quote)
    this.loadSelectedOption(template);
    const ref = this.dialogService.open(QuoteSlipDialogComponent, {
      header: quote.quoteNo,
      width: '1200px',
      styleClass: 'customPopup-dark',
      data: {
        quote: quote,
      }
    });
  }

  showInsuranceCompanyDetails(val: any) {
    this.isInsurerSelected = true
    let name = val.value['name']
    this.quoteService.getQuoteByQuoteNo(this.quote.quoteNo).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        let a: ILov[] = []
        var icId = null
        let quoteOptionId
        Object.keys(dto.data.entity).forEach(function (key, index) {
          if (dto.data.entity[key].partnerId.name == name) {
            icId = dto.data.entity[key]._id;
            quoteOptionId = dto.data.entity[key]?.quoteOption[0]?._id
          }
          if (name == "Expired Term") {
            if (dto.data.entity[key].parentQuoteId) {
              icId = dto.data.entity[key]._id;
              quoteOptionId = dto.data.entity[key]?.quoteOption[0]?._id
            }
          }
        })
        this.router.navigateByUrl(`/backend/quotes/${icId}/comparision-review-detailed-liabilitycgl`)
        this.loadQuote(icId, null)
      }
    })
  }

  loadQuote(quoteId, quoteLocationOccupanyId?) {
    this.quoteService.get(quoteId).subscribe({
      next: (dto) => {
        const quote = dto.data.entity
        this.quoteService.setQuote(quote)
        this.getQuoteOptions()
      }
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
        const quoteOptionVersionData = dto.data.entities.filter(val => val.qcrVersion)
        this.allQuoteOptionDropdown = quoteOptionVersionData.length ?
          [{ label: quoteOptionVersionData[quoteOptionVersionData.length - 1].quoteOption, value: quoteOptionVersionData[quoteOptionVersionData.length - 1]._id }]
          : dto.data.entities
            .map(entity => ({ label: entity.quoteOption, value: entity._id }))
        this.selectedQuoteOptionOfProperty = this.activatedRoute.snapshot.queryParams.quoteOptionId
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

  generatePlacementSlip(icQuote: any, quoteOptionId: any) {
    const current_url = window.location.pathname;
    if (icQuote) {
      if (this.quote.qcrApproved && this.quote.qcrApprovedRequested) {
        this.quoteService.placeLiabilityQuotewithOption(icQuote._id, quoteOptionId).subscribe({
          next: (dto: IOneResponseDto<any[]>) => {
            console.log("ttest");
            this.quoteService.getAllLiabilityQuoteOptions(icQuote._id).subscribe({
              next: (dto: IOneResponseDto<any[]>) => {
             
                switch (this.quote.productId?.['productTemplate']) {
                  case AllowedProductTemplate.WORKMENSCOMPENSATION:
                    icQuote.wcTemplateDataId = quoteOptionId;
                      break;
                  case AllowedProductTemplate.LIABILITY:
                  case AllowedProductTemplate.LIABILITY_CRIME:
                    icQuote.liabilityTemplateDataId = quoteOptionId;
                      break;
                  case AllowedProductTemplate.LIABILITY_EANDO:
                    icQuote.liabilityEandOTemplateDataId = quoteOptionId;
                      break;
                  case AllowedProductTemplate.LIABILITY_CGL:
                  case AllowedProductTemplate.LIABILITY_PUBLIC:
                    icQuote.liabilityCGLTemplateDataId = quoteOptionId;
                      break;
                  case AllowedProductTemplate.LIABILITY_PRODUCT:
                  case AllowedProductTemplate.LIABILITY_CYBER:
                    icQuote.liabilityProductTemplateDataId = quoteOptionId;
                      break;
              }
              let payloadQuote = icQuote;
              this.quoteService.updateUWSlip(payloadQuote).subscribe({
                  next: (quote: any) => {
                    this.quoteOptionsLst = dto.data.entity;
                    this.loadOptionsData(this.quoteOptionsLst);
                    let selectedOption = this.quoteOptionsLst.filter(x => x._id == quoteOptionId)[0]
                    this.loadSelectedOption(selectedOption);
                  },
                  error: error => {
                      console.log(error);
                  }
              });
                this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${icQuote._id}`)
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
      } else {
        this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${icQuote._id}?prev=${current_url}`)
      }
    }
  }

  downloadExcel(): void {
    this.templateService.downloadQCRExcelLiability(this.quote?.allCoversArray.liabilityTemplateEandOCovers.filter(x => x.optionName == this.selectedOptionName)[0]._id, this.quote.quoteNo, this.quote.productId["_id"]).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)
        }
      }
    })
  }




  // openDropDown(){
  //     this.openDropDownClaimExpireance = true;
  //     this.isCloseErrow = true;
  //     this.isOpenErrow= false;
  // }
  // closeDropDown(){
  //     this.openDropDownClaimExpireance = false;
  //     this.isCloseErrow = false;
  //     this.isOpenErrow= true;

  // }

  formatDateToMMDDYYYY(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Check if the date is valid

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
}
