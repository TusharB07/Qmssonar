import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IBulkImportResponseDto, ILov, ILovSIDDL, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { IWCListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { IProduct, AllowedProductTemplate, AllowedProductBscCover, OPTIONS_PRODUCT_BSC_COVERS, AllowedPushbacks } from 'src/app/features/admin/product/product.model';
import { WCRatesData, IQuoteSlip, SubsidiaryDetails, liabiltyAddOnCovers, AllowedQuoteTypes, OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY, AllowedQuoteStates, IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { ComparasionwithBrokerModel, QcrHeaders } from '../quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { MessageService } from 'primeng/api';

import { AllowedAddonCoverCategory, AllowedAddonTypeFlag } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { CoInsuranceFormDialogComponent } from '../../components/other-details-crud-card/co-insurance-form-dialog/co-insurance-form-dialog.component';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { QuoteSentForPlacementMakerComponent } from '../../status_dialogs/quote-sent-for-placement-maker/quote-sent-for-placement-maker.component';
import { QuoteSentForPlacementCheckerMakerComponent } from '../../status_dialogs/quote-sent-for-placement-checker-maker/quote-sent-for-placement-checker-maker.component';
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
  selector: 'app-quote-comparision-review-page-liability-cgl',
  templateUrl: './quote-comparision-review-page-liability-cgl.component.html',
  styleUrls: ['./quote-comparision-review-page-liability-cgl.component.scss']
})
export class QuoteComparisionReviewPageCGLLiabilityComponent implements OnInit {

  selectedIcOptionTemplate: any
  selectedICquote: any
  selectedVersion: number = 1;

  id: string;
  quote: IQuoteSlip;
  private currentQuote: Subscription;

  tabs: MenuItem[] = [];
  openDropDownClaimExpireance: boolean = false;
  isCloseErrow: boolean = false;
  isOpenErrow: boolean = true;
  visibleSidebar = false;
  displayBasic = false;
  quickView = false;
  message: any;
  AllowedProductTemplate = AllowedProductTemplate;
  versionOptions: { label: string, value: number }[] = [];
  insurerProcessedQuotes: IQuoteSlip[] = []

  optionsQuoteOptions: any;
  selectedBrokerOptionTemplate: any;
  selectedOptionName = '';
  currentSelectedIcOptions: any[];
  quoteOptions: any[];
  selectedQuoteOption: any;
  allQuoteOptionDropdown: ILov[];
  dropdownName = [];
  selectedInsurer: string = "";
  allQuoteOptions: any;
  user: IUser;
  isInsurerSelected: boolean = true;
  templateArray: any[]

  subsidaryDetails: SubsidiaryDetails[] = [];
  // openDropDownClaimExpireance:object = { 'display': 'none' };
  private currentUser: Subscription;
  template: string = "";
  templateData: any;
  liabilityService: any;
  isLiabilityProduct: boolean = false;
  selectedQuoteOptionOfProperty: string
  private currentQuoteOptions: Subscription;
  quoteOptionsLst: any[];
  selectedQuoteTemplate: any;
  private currentSelectedTemplate: Subscription;
  selectedOptionIndex = 0

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,
    private dialogService: DialogService,
    private appService: AppService,
    private accountService: AccountService,
    private claimExperienceService: ClaimExperienceService,
    private quoteOptionService: QuoteOptionService,
    private templateService: liabilityTemplateService,
    private messageService: MessageService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
    console.log(this.id)
    this.selectedTabId = this.activatedRoute.snapshot.queryParams.tab
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote
        if (this.quote) {
          this.dropdownName = []
          this.quote.mappedIcNames.map((val: any) => {
            if (!val.brokerAutoFlowStatus) {
              this.dropdownName.push({ name: val.name, id: val._id });
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
        this.selectedBrokerOptionTemplate = template;
        this.selectedQuoteOption = template._id;
        this.selectedOptionName = template.optionName
      }
    });

    this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
      next: (allOptions) => {
        this.quoteOptions = allOptions;
        this.filterVersionOptions(this.selectedOptionName)
        this.optionsQuoteOptions = allOptions?.filter((entity, index, self) => self.findIndex(e => e.optionName === entity.optionName) === index)
          .map(entity => ({ label: entity.optionName, value: entity._id }));
      }
    })
  }

  refreshFilter() {
    this.filterVersionOptions(this.selectedOptionName)
    this.selectedICquote = this.insurerProcessedQuotes.find(x => x.partnerId['name'] == this.selectedInsurer['name'] && x.qcrVersion == this.selectedVersion);
    this.currentSelectedIcOptions = this.selectedICquote.allCoversArray.liabilityTemplateCGLCovers
    this.selectedIcOptionTemplate = this.currentSelectedIcOptions.find(x => x.optionName == this.selectedOptionName)
    this.optionsQuoteOptions = this.quoteOptions?.filter((entity, index, self) => self.findIndex(e => e.optionName === entity.optionName) === index)
      .map(entity => ({ label: entity.optionName, value: entity._id }));
  }

  filterVersionOptions(selectedOptionName) {
    const selectedTemplate = this.quoteOptions.filter(entity => entity.optionName === selectedOptionName);
    const versionsCount = selectedTemplate.length;
    this.selectedVersion = versionsCount > 1 ? this.selectedVersion : 1;
    this.versionOptions = Array.from({ length: versionsCount }, (_, i) => ({
      label: `Version ${i + 1}`,
      value: i + 1
    }));
  }

  claimExperiences: IClaimExperience[] = []
  selectedTabId: string;

  //#region 
  selectedInsurerQuote(): any {
    let selectedICquote: any = this.insurerProcessedQuotes.find(x => x.partnerId['name'] == this.selectedInsurer['name'] && x.qcrVersion == this.selectedVersion);
    return selectedICquote.allCoversArray.liabilityTemplateCGLCovers.find(x => x.optionName == this.selectedOptionName)
  }

  handleQuoteOptionChangeLiability(event) {
    this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<any[]>) => {
        this.selectedBrokerOptionTemplate = this.quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x => x._id == event.value)[0]
        this.selectedOptionName = this.selectedBrokerOptionTemplate.optionName
        this.selectedQuoteOption = this.selectedBrokerOptionTemplate?._id
        this.loadSelectedOption(this.selectedBrokerOptionTemplate);
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

  loadQuote(quoteId) {
    this.quoteService.get(quoteId).subscribe({
      next: (dto) => {
        const quote = dto.data.entity
        this.quoteService.setQuote(quote)
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
  #endregion


  ngOnInit(): void {
    this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        console.log(dto.data.entity)
        this.quoteService.setQuote(dto.data.entity)
        this.selectedBrokerOptionTemplate = this.quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x => x._id == this.selectedQuoteOption)[0]
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

  onQuoteSet(quote: IQuoteSlip) {
    if (quote) {
      this.router.navigate([],
        {
          relativeTo: this.activatedRoute,
          // queryParams: { location: quote?.locationBasedCovers?.quoteLocationOccupancy?._id },
          queryParamsHandling: 'merge'
        })
      // this.loadTabs(quote)
    }
  }

  ngOnDestroy(): void {
    // this.currentQuoteLocationOccupancyId.unsubscribe();
    this.currentQuote.unsubscribe();
  }

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

    // Setting the headers for Insurer
    if (brokerQuote.partnerId["brokerModeStatus"] == true) {
      for (const insurerQuote of this.insurerProcessedQuotes) {
        if (insurerQuote.parentQuoteId) {
          insurerQuote.partnerId['name'] = "Expired Term"
        }
        this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
      }
    } else {
      this.cols.push({ id: this.selectedICquote._id, label: this.selectedInsurer['name'], style: "width:200px" })
    }
    this.QuickViewFunciton();
  }

  sendQuoteForApproval() {
    this.quoteService.sendForQCRApproval(this.quote._id, { qcrApprovalRequested: true, quoteSlipApprovalRequested: false }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        // this.quoteService.refresh((quote) => {
        //   this.router.navigateByUrl(`/`);
        // })
        this.quoteService.refresh((quote) => {

          // OTC QUOTE GENERATE PLACEMENT SLIP (FROM Requsistion)
          const ref = this.dialogService.open(QuoteSentForPlacementCheckerMakerComponent, {
            header: '',
            width: '700px',
            styleClass: 'flatPopup',
            data: {
              quote: quote
            }

          });

          ref.onClose.subscribe((isNavigate = true) => {
            // If nothings comes then go to dashboard
            if (isNavigate) this.router.navigateByUrl(`/`);
          })

        })

      },
      error: error => {
        console.log(error);
      }
    });
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


    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC) {
      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Jurisdiction" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.jurasdiction },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.jurasdiction, styleaddon: this.selectedIcOptionTemplate.jurasdiction != this.selectedBrokerOptionTemplate.jurasdiction ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Territory" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.territory },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.territory, styleaddon: this.selectedIcOptionTemplate.territory != this.selectedBrokerOptionTemplate.territory ? 'red' : '' } })
      })));
    }

    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Jurisdiction" },
        [this.quote._id]: {
          type: 'string', value: this.selectedBrokerOptionTemplate.juridictionId['lovKey']

        },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.juridictionId['lovKey'], styleaddon: this.selectedIcOptionTemplate.juridictionId['lovKey'] != this.selectedBrokerOptionTemplate.juridictionId['lovKey'] ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Territory" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.territoryId['lovKey'] },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.territoryId['lovKey'], styleaddon: this.selectedIcOptionTemplate.territoryId['lovKey'] != this.selectedBrokerOptionTemplate.territoryId['lovKey'] ? 'red' : '' } })
      })));
    }


    return tempArr;

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



  BasicDetailsFunc() {
    const tempArr = []

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Details of Business Activity" },
      [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.detailsOfBusinessActivity },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.detailsOfBusinessActivity, styleaddon: this.selectedIcOptionTemplate.detailsOfBusinessActivity != this.selectedBrokerOptionTemplate.detailsOfBusinessActivity ? 'red' : '' } })
    })));
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Policy" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'], styleaddon: this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'] != this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Details Of Product and Usage" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.detailsOfProductAndUsage },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.detailsOfProductAndUsage, styleaddon: this.selectedIcOptionTemplate.detailsOfProductAndUsage != this.selectedBrokerOptionTemplate.detailsOfProductAndUsage ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Retroactive Details" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.selectedBrokerOptionTemplate.retroactiveCoverId['lovKey'] },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        let retroActiveCover = this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.selectedIcOptionTemplate.retroactiveCoverId['lovKey']
        let retroActiveCoverComparision = this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.selectedBrokerOptionTemplate.retroactiveCoverId['lovKey']
        return ({ [quote._id]: { type: 'string', value: retroActiveCover, styleaddon: retroActiveCover != retroActiveCoverComparision ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Retroactive Date" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? 'N/A' : this.formatDateToMMDDYYYY(this.selectedBrokerOptionTemplate.retroactiveDate) },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        let retroActiveDate = this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.formatDateToMMDDYYYY(this.selectedIcOptionTemplate.retroactiveDate)
        let retroActiveDateComparision = this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.formatDateToMMDDYYYY(this.selectedBrokerOptionTemplate.retroactiveDate)
        return ({ [quote._id]: { type: 'string', value: retroActiveDate, styleaddon: retroActiveDate != retroActiveDateComparision ? 'red' : '' } })
      })));
    }
    else {
      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Type of Policy" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicy },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.typeOfPolicy, styleaddon: this.selectedIcOptionTemplate.typeOfPolicy != this.selectedBrokerOptionTemplate.typeOfPolicy ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Details of Hazardous Chemical" },
        [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.detailsOfHazardousChemical },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.detailsOfHazardousChemical, styleaddon: this.selectedIcOptionTemplate.detailsOfHazardousChemical != this.selectedBrokerOptionTemplate.detailsOfHazardousChemical ? 'red' : '' } })
      })));

      // tempArr.push(Object.assign({
      //   'labels': { type: 'string', value: "AOA:AOY" },
      //   [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'] },
      // }, ...this.insurerProcessedQuotes.map((quote) => {
      //   return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'], styleaddon: quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'] != this.quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'] ? 'red' : '' } })
      // })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Limit of Liability" },
        [this.quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedBrokerOptionTemplate.limitOfLiability },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedIcOptionTemplate.limitOfLiability, styleaddon: this.selectedIcOptionTemplate.limitOfLiability != this.selectedBrokerOptionTemplate.limitOfLiability ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Any one accident" },
        [this.quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedBrokerOptionTemplate.anyOneAccident },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({ [quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedIcOptionTemplate.anyOneAccident, styleaddon: this.selectedIcOptionTemplate.anyOneAccident != this.selectedBrokerOptionTemplate.anyOneAccident ? 'red' : '' } })
      })));

      tempArr.push(Object.assign({
        'labels': { type: 'string', value: "Any one Year" },
        [this.quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedBrokerOptionTemplate.inTheAggregate },
      }, ...this.insurerProcessedQuotes.map((quote) => {
        return ({
          [quote._id]: {
            type: 'currency',
            isAlignmentRequired: true,
            value: this.selectedIcOptionTemplate.inTheAggregate,
            styleaddon: this.selectedIcOptionTemplate.inTheAggregate != this.selectedBrokerOptionTemplate.inTheAggregate ? 'red' : ''
          }
        })
      })));

    }

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Additional Information" },
      [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.additionalInformation },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.additionalInformation, styleaddon: 'red' } })
    })));



    return tempArr;

  }


  addOnsDetailsFunc() {

    const tempArr = [];

    // First, add covers from this.quote?.liabilityCGLTemplateDataId["liabiltyCovers"]
    Object.entries(this.quote?.liabilityCGLTemplateDataId["liabiltyCovers"] as Record<string, any>).forEach(([breakUpkey, breakup]) => {
      let tempObj: Record<string, { type: string; value: any, isAlignmentRequired?: boolean, styleaddon?: string }> = {
        'labels': { type: 'string', value: `${breakup.name}` },
        [this.quote._id]: { type: 'string', value: breakup.optionSelected === "" ? "N/A" : breakup.optionSelected, isAlignmentRequired: false }
      };

      this.insurerProcessedQuotes.forEach((quote) => {
        const insurerBreakup = Object.entries(quote.liabilityCGLTemplateDataId["liabiltyCovers"] as Record<string, any>)
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
    });

    // Now, check for any additional covers in insurerProcessedQuotes that are not in this.quote?.liabilityCGLTemplateDataId["liabiltyCovers"]
    this.insurerProcessedQuotes.forEach((quote) => {
      Object.entries(quote.liabilityCGLTemplateDataId["liabiltyCovers"] as Record<string, any>).forEach(([insurerBreakUpkey, insurerBreakup]) => {
        const alreadyAdded = tempArr.some((item) => item.labels.value === insurerBreakup.name);

        if (!alreadyAdded) {
          let tempObj: Record<string, { type: string; value: any, isAlignmentRequired?: boolean, styleaddon?: string }> = {
            'labels': { type: 'string', value: `${insurerBreakup.name}` },
            [quote._id]: { type: 'string', value: insurerBreakup.optionSelected === "" ? "N/A" : insurerBreakup.optionSelected, styleaddon: "red", isAlignmentRequired: false }
          };

          // Add the current insurer's cover to the object
          tempObj[quote._id] = {
            type: 'string',
            value: insurerBreakup.optionSelected === "" ? "N/A" : insurerBreakup.optionSelected,
            styleaddon: 'red',
            isAlignmentRequired: false
          };

          // Add the current insurer's cover to other insurerProcessedQuotes
          this.insurerProcessedQuotes.forEach((innerQuote) => {
            if (innerQuote._id !== quote._id) {
              const innerInsurerBreakup = Object.entries(innerQuote.liabilityCGLTemplateDataId["liabiltyCovers"] as Record<string, any>)
                .find(([innerBreakUpkey]) => innerBreakUpkey === insurerBreakUpkey);

              const innerInsurerBreakupValue = innerInsurerBreakup ? (innerInsurerBreakup[1].optionSelected === "" ? "N/A" : innerInsurerBreakup[1].optionSelected) : null;

              tempObj[innerQuote._id] = {
                type: 'string',
                value: innerInsurerBreakupValue,
                ...(innerInsurerBreakupValue !== tempObj[quote._id].value && { styleaddon: 'red' }),
                isAlignmentRequired: false
              };
            }
          });

          tempArr.push(tempObj);
        }
      });
    });

    return tempArr;


  }

  deductiblesFunc() {
    const tempArr = []

    // First, add deductibles from this.quote?.liabilityCGLTemplateDataId["deductibles"]
    for (let d of this.quote?.liabilityCGLTemplateDataId["liabiltyDeductibles"]) {
      let tempObj: Record<string, { type: string; value: any }> = {
        'labels': { type: 'string', value: `${d.description}` },
        [this.quote._id]: { type: 'currency', value: d.amount }
      };

      this.insurerProcessedQuotes.forEach((quote) => {
        const foundDeductible = quote.liabilityCGLTemplateDataId["liabiltyDeductibles"].find(s =>
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

    // Now, check for any additional deductibles in insurerProcessedQuotes that are not in this.quote?.liabilityCGLTemplateDataId["deductibles"]
    this.insurerProcessedQuotes.forEach((quote) => {
      quote.liabilityCGLTemplateDataId["liabiltyDeductibles"].forEach((s) => {
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
              const foundDeductible = innerQuote.liabilityCGLTemplateDataId["liabiltyDeductibles"].find(deductible =>
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


  loadTabs(product: IProduct): MenuItem[] {
    switch (product.productTemplate) {
      case AllowedProductTemplate.LIABILITY_CGL:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Claim Experience & Turnover Details", id: "revenue_details" },
          { label: "Other Details", id: "other_details" }
        ]
      case AllowedProductTemplate.LIABILITY_PUBLIC:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory Details", id: "territorysubsidiary" },
          { label: "Turnover Details", id: "revenue_details" },
          { label: "Other Details", id: "other_details" }
        ]
      default:
        return [
          { label: "Basic Details", id: "basic_details" },
          { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
          { label: "Deductibles", id: 'deductibles' },
          { label: "Other Details", id: "other_details" }
        ]
    }
  }

  createQuoteOptionQCRVersioning(insurerQuoteOptionId, brokerQuoteId) {
    this.quoteService.createOptionQCRVersioningLiability(insurerQuoteOptionId, brokerQuoteId).subscribe({
      next: response => {
        this.router.navigateByUrl(`/backend/quotes`)
      }
    });
  }

  selectTab(tab?: MenuItem) {
    this.templateArray = []
    this.refreshFilter()
    this.templateArray.push(
      {
        template: this.selectedBrokerOptionTemplate,
        label: this.quote.originalIntermediateName // Label for Broker Template
      },
      {
        template: this.selectedIcOptionTemplate,
        label: this.selectedInsurer['name'] // Label for IC Template
      }
    );
    this.subsidaryDetails = this.selectedIcOptionTemplate.subsidaryDetails
    this.subsidaryDetails.forEach(element => {
      if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
        element.activityName = 'N/A'
      }
    });
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
            onClick: () => this.openQuoteSlip(this.quote, this.selectedBrokerOptionTemplate),
            value: 'View Slip',
          },
        },
        ...this.quote?.insurerProcessedQuotes.map((quote) => {
          const isBankNameEmpty = this.selectedIcOptionTemplate?.bankName === '';
          return {
            [quote._id]: {
              type: 'buttons',
              buttons: [
                {
                  onClick: () => this.openQuoteSlip(this.selectedICquote, this.selectedIcOptionTemplate),
                  buttonClassName: 'btn btn-primary p-0 px-2',
                  value: 'View Slip',
                },
                ...(this.quote.qcrApprovedRequested && this.quote.qcrApproved
                  ? [
                    {
                      ...(isBankNameEmpty ? { onClick: () => this.paymentRequired() } : { onClick: () => this.generatePlacementSlip(this.selectedICquote, this.selectedIcOptionTemplate._id) }),
                      buttonClassName: `btn p-0 px-2 ml-2 ${isBankNameEmpty ? 'btn-danger' : 'btn-success'}`,
                      value: 'Generate Placement Slip',
                    },
                  ]
                  : []),
                {
                  buttonClassName: this.selectedIcOptionTemplate.isAccepted === 'Accept'
                    ? 'btn p-0 px-2 ml-2 btn-success bg-opacity-10'
                    : 'btn p-0 px-2 ml-2 btn-danger bg-opacity-10',
                  value: this.selectedIcOptionTemplate.isAccepted === 'Accept' ? 'Accepted' : 'Rejected',
                },
                { onClick: () => this.createQuoteOptionQCRVersioning(this.selectedIcOptionTemplate._id, this.quote._id), buttonClassName: this.quote.pushedBackToId != null || this.quote.qcrApproved != null ? "btn btn-dark p-0 px-2 ml-2" : "hidden", value: 'Quote Version' },

              ],
            },
          };
        })
      )
    );


    this.mapping.push(Object.assign({
      'labels': { type: 'string', value: "Premium Without Taxes" },
      [this.quote._id]: { type: 'currency', value: +this.quote.liabilityCGLTemplateDataId['totalPremiumAmt'] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      return ({ [quote._id]: { type: 'currency', value: +quote.liabilityCGLTemplateDataId['totalPremiumAmt'] } })
    })));



    switch (tab?.id) {
      case 'basic_details':
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Type of Policy" },
          [this.quote._id]: { type: 'string', value: this.quote.productId['type'] },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.productId['type'] != quote.productId['type'] ? quote.productId['type'] : null } })
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
            return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
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
          [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.detailsOfBusinessActivity },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.detailsOfBusinessActivity, styleaddon: this.selectedIcOptionTemplate.detailsOfBusinessActivity != this.selectedBrokerOptionTemplate.detailsOfBusinessActivity ? 'red' : '' } })
        })));
        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Policy" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'], styleaddon: this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'] != this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Details Of Product and Usage" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.detailsOfProductAndUsage },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.detailsOfProductAndUsage, styleaddon: this.selectedIcOptionTemplate.detailsOfProductAndUsage != this.selectedBrokerOptionTemplate.detailsOfProductAndUsage ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Retroactive Details" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.selectedBrokerOptionTemplate.retroactiveCoverId['lovKey'] },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            let retroActiveCover = this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.selectedIcOptionTemplate.retroactiveCoverId['lovKey']
            let retroActiveCoverComparision = this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.selectedBrokerOptionTemplate.retroactiveCoverId['lovKey']
            return ({ [quote._id]: { type: 'string', value: retroActiveCover, styleaddon: retroActiveCover != retroActiveCoverComparision ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Retroactive Date" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? 'N/A' : this.formatDateToMMDDYYYY(this.selectedBrokerOptionTemplate.retroactiveDate) },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            let retroActiveDate = this.selectedIcOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.formatDateToMMDDYYYY(this.selectedIcOptionTemplate.retroactiveDate)
            let retroActiveDateComparision = this.selectedBrokerOptionTemplate.typeOfPolicyId['lovKey'] == 'Commercial General Liability - Occurrence FORM' ? "N/A" : this.formatDateToMMDDYYYY(this.selectedBrokerOptionTemplate.retroactiveDate)
            return ({ [quote._id]: { type: 'string', value: retroActiveDate, styleaddon: retroActiveDate != retroActiveDateComparision ? 'red' : '' } })
          })));
        }
        else {
          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Type of Policy" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.typeOfPolicy },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.typeOfPolicy, styleaddon: this.selectedIcOptionTemplate.typeOfPolicy != this.selectedBrokerOptionTemplate.typeOfPolicy ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Details of Hazardous Chemical" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.detailsOfHazardousChemical },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.detailsOfHazardousChemical, styleaddon: this.selectedIcOptionTemplate.detailsOfHazardousChemical != this.selectedBrokerOptionTemplate.detailsOfHazardousChemical ? 'red' : '' } })
          })));

          // this.mapping.push(Object.assign({
          //   'labels': { type: 'string', value: "AOA:AOY" },
          //   [this.quote._id]: { type: 'string', value: this.quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'] },
          // }, ...this.insurerProcessedQuotes.map((quote) => {
          //   return ({ [quote._id]: { type: 'string', value: quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'], styleaddon: quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'] != this.quote?.allCoversArray.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].aoaAoyId['_id'] ? 'red' : '' } })
          // })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Limit of Liability" },
            [this.quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedBrokerOptionTemplate.limitOfLiability },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedIcOptionTemplate.limitOfLiability, styleaddon: this.selectedIcOptionTemplate.limitOfLiability != this.selectedBrokerOptionTemplate.limitOfLiability ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Any one accident" },
            [this.quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedBrokerOptionTemplate.anyOneAccident },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedIcOptionTemplate.anyOneAccident, styleaddon: this.selectedIcOptionTemplate.anyOneAccident != this.selectedBrokerOptionTemplate.anyOneAccident ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Any one Year" },
            [this.quote._id]: { type: 'currency', isAlignmentRequired: true, value: this.selectedBrokerOptionTemplate.inTheAggregate },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({
              [quote._id]: {
                type: 'currency',
                isAlignmentRequired: true,
                value: this.selectedIcOptionTemplate.inTheAggregate,
                styleaddon: this.selectedIcOptionTemplate.inTheAggregate != this.selectedBrokerOptionTemplate.inTheAggregate ? 'red' : ''
              }
            })
          })));

        }

        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "Additional Information" },
          [this.quote._id]: {
            type: 'string',
            value: this.selectedBrokerOptionTemplate.additionalInformation
          },
        }, ...this.insurerProcessedQuotes.map((quote) => {
          const additionalInfo = this.selectedIcOptionTemplate.additionalInformation;
          const styleAddon = additionalInfo !== this.selectedBrokerOptionTemplate.additionalInformation ? 'red' : '';
          return ({
            [quote._id]: {
              type: 'string',
              value: additionalInfo,
              styleaddon: styleAddon
            }
          });
        })));


        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {

          this.mapping.push({
            'labels': { type: 'html', value: '<strong>Covers</strong>' }
          });
          let breakupKeys = []

          // Loop Over entire breakup and pushs the data to mapping

          if (this.quote.allCoversArray) {
            let breakupValue;

            Object.entries(this.quote.allCoversArray?.liabilityTemplateCGLCovers.filter(x => x.optionName == this.selectedOptionName)[0].liabiltyCovers).forEach(([breakUpkey, breakup]) => {
              breakupValue = breakup.optionSelected == "" ? "N/A" : breakup.optionSelected
              this.mapping.push(Object.assign({
                'labels': { type: 'string', value: breakup.name },
                [this.quote._id]: { type: 'string', isAlignmentRequired: false, value: breakup.optionSelected == "" ? "N/A" : breakup.optionSelected },
              }, ...this.insurerProcessedQuotes.map((quote) => {

                let insurerBreakupValue;

                Object.entries(this.selectedIcOptionTemplate.liabiltyCovers).forEach(([insurerBreakUpKey, insurerBreakup]) => {
                  const breakup = insurerBreakup as { optionSelected: string }; // Add the correct type here
                  if (insurerBreakUpKey === breakUpkey) {
                    insurerBreakupValue = breakup.optionSelected === "" ? "N/A" : breakup.optionSelected;
                  }
                });


                return ({ [quote._id]: { type: 'string', isAlignmentRequired: false, value: insurerBreakupValue, styleaddon: insurerBreakupValue != breakupValue ? 'red' : '' } })
              })));
            })
          }
        }

        break;

      case 'territorysubsidiary':

        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Jurisdiction" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.juridictionId['lovKey'] },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.juridictionId['lovKey'], styleaddon: this.selectedIcOptionTemplate.juridictionId['lovKey'] != this.selectedBrokerOptionTemplate.juridictionId['lovKey'] ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Territory" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.territoryId['lovKey'] },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.territoryId['lovKey'], styleaddon: this.selectedIcOptionTemplate.territoryId['lovKey'] != this.selectedBrokerOptionTemplate.territoryId['lovKey'] ? 'red' : '' } })
          })));
        }

        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC) {
          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Jurisdiction" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.jurasdiction },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.jurasdiction, styleaddon: this.selectedIcOptionTemplate.jurasdiction != this.selectedBrokerOptionTemplate.jurasdiction ? 'red' : '' } })
          })));

          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Territory" },
            [this.quote._id]: { type: 'string', value: this.selectedBrokerOptionTemplate.territory },
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({ [quote._id]: { type: 'string', value: this.selectedIcOptionTemplate.territory, styleaddon: this.selectedIcOptionTemplate.territory != this.selectedBrokerOptionTemplate.territory ? 'red' : '' } })
          })));
        }


        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {

        //   this.mapping.push({
        //     'labels': { type: 'html', value: '<strong>Covers</strong>' }
        //   });
        //   let breakupKeys = []

        //   this.mapping.push({
        //     'labels': { type: 'html', value: '' }
        //   });

        //   // Loop Over entire breakup and pushs the data to mapping

        //   if (this.quote.allCoversArray) {
        //     let breakupValue;

        //     Object.entries(this.quote.allCoversArray?.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].liabiltyCovers).forEach(([breakUpkey, breakup]) => {
        //       breakupValue = breakup.optionSelected == "" ? "N/A" : breakup.optionSelected
        //       this.mapping.push(Object.assign({
        //         'labels': { type: 'string', value: breakup.name },
        //         [this.quote._id]: { type: 'string', isAlignmentRequired: false, value: breakup.optionSelected == "" ? "N/A" : breakup.optionSelected },
        //       }, ...this.insurerProcessedQuotes.map((quote) => {

        //         let insurerBreakupValue;

        //         Object.entries(quote.allCoversArray?.liabilityTemplateCGLCovers.filter(x=>x.version == this.selectedVersion)[0].liabiltyCovers).forEach(([insurerBreakUpkey, insurerBreakup]) => {
        //           if (insurerBreakUpkey == breakUpkey) {
        //             insurerBreakupValue = insurerBreakup.optionSelected == "" ? "N/A" : insurerBreakup.optionSelected
        //             // if (Object.entries(insurerBreakup)?.find(([optionSelected, value]) => value == breakup.optionSelected))
        //             //   insurerBreakupValue = Object.entries(insurerBreakup)?.find(([optionSelected, value]) => value == breakup.optionSelected)[1]
        //           }
        //           // insurerBreakupValue = value ?? 0

        //         })
        //         return ({ [quote._id]: { type: 'string', isAlignmentRequired: false, value: insurerBreakupValue, styleaddon: insurerBreakupValue != breakupValue ? 'red' : '' } })
        //       })));
        //     })
        //   }
        // }
        break;

      case 'turnoverDetails':


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
                      this.submitBankDetails(this.selectedICquote._id, this.selectedIcOptionTemplate._id);
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


  openQuoteSlip(quote: any, template: any) {
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

  //IC dropdown
  showInsuranceCompanyDetails(val: any) {
    this.loadData(this.quote)
  }

  pushBackTo() {
    const payload = {};
    payload["pushBackFrom"] = AllowedPushbacks.QCR;
    payload["pushBackToState"] = AllowedQuoteStates.QCR_FROM_UNDERWRITTER;
    this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
      this.router.navigateByUrl('/backend/quotes')
    })
  }

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
      this.quoteService.getAllLiabilityQuoteOptions(quoteId).subscribe({
        next: (dto: IOneResponseDto<any[]>) => {
          this.loadOptionsData(dto.data.entity);
          this.loadSelectedOption(dto.data.entity[0])
        },
        error: e => {
          console.log(e);
        }
      });
    }
  }

  paymentRequired() {
    this.messageService.add({
      severity: "error", summary: "Missing Information",
      detail: 'Payment is Required', life: 3000
    })
  }

  submitBankDetails(quoteId, optionId) {
    console.log("Submitting Bank Details:", optionId);
    if (optionId) {
      const ref = this.dialogService.open(PaymentDetailLiabilityComponent, {
        header: "Payment Details",
        width: '1200px',
        styleClass: 'customPopup-dark',
        data: {
          templateName: this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL ? AllowedProductTemplate.LIABILITY_CGL : AllowedProductTemplate.LIABILITY_PUBLIC,
          optionId: optionId,
          quoteId: quoteId
        }
      })
      ref.onClose.subscribe({
        next: () => {
          this.quoteService.refresh()
        }
      })
    }
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
    this.templateService.downloadQCRExcelLiability(this.selectedBrokerOptionTemplate._id, this.quote.quoteNo,this.quote.productId["_id"]).subscribe({
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
