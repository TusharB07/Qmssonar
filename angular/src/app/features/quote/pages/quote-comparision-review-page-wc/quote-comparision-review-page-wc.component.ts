import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AllowedQuoteStates, AllowedQuoteTypes, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip, liabiltyAddOnCovers, WCRatesData } from 'src/app/features/admin/quote/quote.model';
import { ComparasionwithBrokerModel, QCRQuestionAnswer, QcrHeaders } from '../quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { IOneResponseDto, IManyResponseDto, ILovSIDDL, ILov, IBulkImportResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { AllowedGMCPARENTabsTypes } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { IProduct, AllowedProductTemplate, AllowedPushbacks } from 'src/app/features/admin/product/product.model';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
import { IWCListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { DatePipe } from '@angular/common';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AccountService } from 'src/app/features/account/account.service';
import { CoInsuranceFormDialogComponent } from '../../components/other-details-crud-card/co-insurance-form-dialog/co-insurance-form-dialog.component';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { QuoteSentForPlacementMakerComponent } from '../../status_dialogs/quote-sent-for-placement-maker/quote-sent-for-placement-maker.component';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-quote-comparision-review-page-wc',
  templateUrl: './quote-comparision-review-page-wc.component.html',
  styleUrls: ['./quote-comparision-review-page-wc.component.scss']
})
export class QuoteComparisionReviewPageWcComponent implements OnInit {
  private currentQuote: Subscription;
  quoteId: string = "";
  wcTemplateModel: any
  wcInsurerTemplateModel: any
  wcRatesInfo: WCRatesData[] = []
  safetyMeasuresInfo: any[] = []
  wccoverageTypesFree: IWCCoverageType[] = [];
  wcStandardcoverageType: IWCCoverageType[] = [];
  wccoverageTypesAll: IWCCoverageType[] = [];
  wcMedicalBenifitsYesLst: any[] = [];
  medicalExpensesAmountLst: ILovSIDDL[] = []
  medicalExpensesAmountDataList: IWCListOfValueMaster[] = []
  premiumLstBroker: any[] = [];
  premiumLst: any[] = [];

  deductiblesInsurer: any[] = [];

  id: string;
  quote: IQuoteSlip;
  selectedTabId: any;


  brokerQuote: IQuoteSlip;
  //Intergation-EB [Start]
  comparasionwithBrokerModel: ComparasionwithBrokerModel = new ComparasionwithBrokerModel()
  //Intergation-EB [End]
  tabs: MenuItem[] = [];
  // openDropDownClaimExpireance:object = { 'display': 'none' };
  openDropDownClaimExpireance: boolean = false;
  isCloseErrow: boolean = false;
  isOpenErrow: boolean = true;
  colSpan: number = 0
  qcrHeaderBasicDetailsLst: QcrHeaders[] = []
  qcrHeaderBasicDetailsTwoLst: QcrHeaders[] = []
  questionAnswerListToBind: any[] = []

  wcMedicalBenifitsYesLstME: any[] = [];
  wcMedicalBenifitsYesLstMEAggregate: any[] = [];
  wcMedicalBenifitsYesLstMEUE: any[] = [];
  wcMedicalBenifitsYesLstMEAggregateUW: any[] = [];
  prvPolicyInfo: any[] = [];
  isNamed: boolean = true;
  selectedQuoteOption: any
  underWriterEditData: any[] = []
  visibleSidebar = false;
  displayBasic = false;
  quickView = false;
  message: any;
  optionsQuoteOptions: any
  liabiltyCoversBroker: liabiltyAddOnCovers[] = [];
  liabiltyCoversUW: any[] = [];
  versionOptions: { label: string, value: number }[] = [];
  selectedVersion: number = 1;
  insurerProcessedQuotes: IQuoteSlip[] = []
  private currentUser: Subscription;
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: any;
  private currentQuoteOptions: Subscription;
  allQuoteOptions: any
  selectedOptionName = '';
  quoteOptionsLst: any[];
  selectedInsurer: string = ""
  dropdownName = []
  allQuoteOptionDropdown: ILov[]
  user: IUser;
  selectedIcOptionTemplate: any
  isInsurerSelected: boolean = true;
  selectedQuoteOptionOfProperty: string
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,
    private dialogService: DialogService,
    private appService: AppService,
    private wcCoverageTypeService: WCCoverageTypeService,
    private datepipe: DatePipe,
    private accountService: AccountService,
    private messageService: MessageService,
    private templateService: liabilityTemplateService,
    private quoteOptionService: QuoteOptionService,

  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

    this.selectedTabId = this.activatedRoute.snapshot.queryParams.tab


    this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        console.log(dto.data.entity)
        this.quoteService.setQuote(dto.data.entity)


        this.quote = dto.data.entity

        this.quoteId = this.quote._id;

        this.loadWCCoverageType();


        this.loadData(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });



    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        // Dynamically generate the version options based on qcrversion
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

    this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.allQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion);
        this.optionsQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion).map(entity => ({ label: entity.optionName, value: entity._id }));
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: template => {
        this.selectedQuoteTemplate = template;
        this.selectedQuoteOption = template._id;
        this.selectedOptionName = template.optionName
      }
    });

    this.currentUser = this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
        console.log(user);
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
        this.router.navigateByUrl(`/backend/quotes/${icId}/comparision-review-detailed-wc`)
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


  downloadExcel(): void {
    this.templateService.downloadQCRExcelLiability(this.wcTemplateModel._id, this.quote.quoteNo,this.quote.productId["_id"]).subscribe({
      next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
        console.log(dto)
        if (dto.status == 'success') {
          this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)
        }
      }
    })
  }


  handleQuoteOptionChangeLiability(event) {
    let payloadQuote = { ...this.quote };
    this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<any[]>) => {
        this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
        this.optionsQuoteOptions = this.quoteOptionsLst.map(entity => ({ label: entity.optionName, value: entity._id }));
        let quoteOption = this.quoteOptionsLst.filter(x => x._id == event.value)[0]
        switch (this.quote.productId?.['productTemplate']) {
          case AllowedProductTemplate.WORKMENSCOMPENSATION:
            payloadQuote.wcTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY:
          case AllowedProductTemplate.LIABILITY_CRIME:
            payloadQuote.liabilityTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY_EANDO:
            payloadQuote.liabilityEandOTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY_CGL:
          case AllowedProductTemplate.LIABILITY_PUBLIC:
            payloadQuote.liabilityCGLTemplateDataId = quoteOption._id;
            break;
          case AllowedProductTemplate.LIABILITY_PRODUCT:
          case AllowedProductTemplate.LIABILITY_CYBER:
            payloadQuote.liabilityProductTemplateDataId = quoteOption._id;
            break;
        }
        //let payloadQuote = this.quote;
        this.quoteService.updateUWSlip(payloadQuote).subscribe({
          next: (quote: any) => {
            //this.quoteService.refresh();
            const template = this.quoteOptionsLst.filter(x => x._id == event.value)[0]
            this.loadSelectedOption(template);
            this.loadOptionsData(this.quoteOptionsLst);
            this.selectedQuoteTemplate = template
            this.selectedOptionName = template.optionName
            this.selectedIcOptionTemplate = this.selectedInsurerQuote()
            this.wcInsurerTemplateModel = this.selectedIcOptionTemplate
            var underwiterInfo = {
              template: this.wcInsurerTemplateModel,
              premiumUnderwriter: this.premiumLst,
              MEAggregateInfo: this.wcMedicalBenifitsYesLstMEAggregateUW,
              MeInfo: this.wcMedicalBenifitsYesLstMEUE,
              deductiblesInsurer: this.deductiblesInsurer,
              PartnerName: this.selectedIcOptionTemplate.partnerId['name'],
              covers: this.liabiltyCoversUW
            };
            this.underWriterEditData.push(underwiterInfo)
            this.selectTab()
            this.mappingQCR = [];
            this.mappingQCRArr = [];
            this.QuickViewFunciton()
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

  //#region 
  selectedInsurerQuote(): any {
    let selectedICquote: any = this.insurerProcessedQuotes.find(x => x.partnerId['name'] == this.selectedInsurer['name'] && x.qcrVersion == this.selectedVersion);
    return selectedICquote.allCoversArray.liabilityTemplateWCCovers.find(x => x.optionName == this.selectedOptionName)
  }


  loadOptionsData(quoteOption: any[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }

  loadSelectedOption(quoteOption: any) {
    this.quoteService.setSelectedOptions(quoteOption)
  }

  getTotalSalary() {
    let totalSalary = this.wcRatesInfo.reduce((partialSum, a) => partialSum + +a.salaryPerMonth, 0);
    return totalSalary;
  }

  getTotalEmployee() {
    let totalEmployee = this.wcRatesInfo.reduce((partialSum, a) => partialSum + +a.noOfEmployees, 0);
    return totalEmployee
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

  visible() {
    this.visibleSidebar = true
  }
  toggleQuickView(): any {
    this.quickView = !this.quickView
  }

  mappingQCR = []
  mappingQCRArr = []

  onVersionChange(event: any) {
    const selectedValue = event.value;
    console.log('Selected version:', selectedValue);
    this.mappingQCR = [];
    this.mappingQCRArr = [];
    this.mapping = [];
    this.cols = [];
    this.loadData(this.quote)
    // You can now execute additional logic here based on the selected version
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

  createQuoteOptionQCRVersioning(insurerQuoteOptionId, brokerQuoteId) {
    this.quoteService.createOptionQCRVersioningLiability(insurerQuoteOptionId, brokerQuoteId).subscribe({
        next: response => {
            this.router.navigateByUrl(`/backend/quotes`)
        }
    });
}

  loadData(brokerQuote: IQuoteSlip) {
    this.brokerQuote = brokerQuote;
    this.tabs = this.loadTabs(brokerQuote.productId as IProduct)
    this.insurerProcessedQuotes = brokerQuote.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion);
    this.selectTab(this.tabs.find(tab => tab.id == this.selectedTabId))
    this.cols.push({ id: 'labels', style: "width:200px" })
    this.cols.push({ id: brokerQuote._id, label: brokerQuote.originalIntermediateName, style: "width:200px" })
    if (brokerQuote.partnerId["brokerModeStatus"] == true) {
      for (const insurerQuote of this.insurerProcessedQuotes) {
        if (insurerQuote.parentQuoteId) {
          insurerQuote.partnerId['name'] = "Expired Term"
        }
        this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
      }
    } else {
      for (const insurerQuote of this.insurerProcessedQuotes) {
        this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
      }
    }


    this.mapping = []



    this.mapping.push(
      Object.assign(
        {
          labels: { type: 'string', value: '' },
          [this.quote?._id]: {
            type: 'button',
            buttonClassName: 'btn btn-primary p-0 px-2',
            onClick: () => this.openQuoteSlip(),
            value: 'View Quote',
          },
        },
        ...this.quote?.insurerProcessedQuotes.map((quote) => {
          return {
            [quote._id]: {
              type: 'buttons',
              buttons: [
                {
                  onClick: () => this.openQuoteSlip(quote._id),
                  buttonClassName: 'btn btn-primary p-0 px-2',
                  value: 'View Quote',
                },
                ...(this.quote.qcrApprovedRequested && this.quote.qcrApproved
                  ? [
                    {
                      onClick: () => this.generatePlacementSlip(quote._id),
                      buttonClassName: 'btn btn-success p-0 px-2 ml-2',
                      value: 'Generate Placement Slip',
                    }
                  ]
                  : []),
                  { onClick: () => this.createQuoteOptionQCRVersioning(this.selectedIcOptionTemplate._id, this.quote._id), buttonClassName: this.quote.pushedBackToId != null || this.quote.qcrApproved != null ? "btn btn-dark p-0 px-2 mr-2" : "hidden", value: 'Quote Version' },
              ],
            },
          };
        })
      )
    );




    this.wcTemplateModel = brokerQuote?.wcTemplateDataId;
    this.liabiltyCoversBroker = this.wcTemplateModel.liabiltyCovers
    this.liabiltyCoversBroker = this.liabiltyCoversBroker.filter(x => x.isSelected)
    this.liabiltyCoversBroker.forEach(element => {
      if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
        element.optionSelected = 'N/A'
      }

      if (element.description == '' || element.description == null || element.description == undefined) {
        element.description = 'N/A'
      }
    });
    if (!this.wcTemplateModel.liabiltyDeductibles) {
      this.wcTemplateModel.liabiltyDeductibles = [];
    }
    if (this.wcTemplateModel) {

      if (this.wcTemplateModel.safetyMeasures) {
        this.safetyMeasuresInfo = []
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

      var premiumInfo = {
        targetPremium: this.wcTemplateModel.targetPremium,
        indicativePremium: this.wcTemplateModel.indicativePremium,
        discountbasedonPremium: this.wcTemplateModel.discountbasedonPremium,
        addonCoversAmount: this.wcTemplateModel.addonCoversAmount,
      }
      this.premiumLstBroker = []
      this.premiumLstBroker.push(premiumInfo);




      //ic
      this.underWriterEditData = [];
      this.wcInsurerTemplateModel = this.selectedIcOptionTemplate
      if (!this.wcInsurerTemplateModel.isActual && this.wcInsurerTemplateModel.medicalBenifitsOption == 'ME') {
        var data = {
          medicalBenifitsOption: this.wcInsurerTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
          medicalBenifitsAmount: this.wcInsurerTemplateModel.medicalBenifitsAmount
        };
        this.wcMedicalBenifitsYesLstMEUE = []
        this.wcMedicalBenifitsYesLstMEUE.push(data);
      }
      else {
        var _data = {
          medicalBenifitsOption: this.wcInsurerTemplateModel.medicalBenifitsOption == "ME" ? "Medical Extension" : "Medical Extension AGGREGATE",
          isActual: this.wcInsurerTemplateModel.isActual ? "YES" : "NO",
          medicalBenifitsAmount: this.wcInsurerTemplateModel.medicalBenifitsAmount
        };
        this.wcMedicalBenifitsYesLstMEAggregateUW = []
        this.wcMedicalBenifitsYesLstMEAggregateUW.push(_data);
      }


      //Premium
      var premiumInfo = {
        targetPremium: this.wcInsurerTemplateModel.targetPremium,
        indicativePremium: this.wcInsurerTemplateModel.indicativePremium,
        discountbasedonPremium: this.wcInsurerTemplateModel.discountbasedonPremium,
        addonCoversAmount: this.wcInsurerTemplateModel.addonCoversAmount,
      }
      this.premiumLst = []
      this.premiumLst.push(premiumInfo);


      //deductibles
      this.deductiblesInsurer = []

      const liabiltyDeductibles = this.compareDeductibles(this.wcTemplateModel.liabiltyDeductibles, this.wcInsurerTemplateModel.liabiltyDeductibles);
      this.deductiblesInsurer.push(...liabiltyDeductibles);

      this.liabiltyCoversUW = []
      const Addons = this.compareDeductibles(this.wcTemplateModel.liabiltyCovers, this.wcInsurerTemplateModel.liabiltyCovers);
      this.liabiltyCoversUW.push(...Addons);
      this.liabiltyCoversUW = this.liabiltyCoversUW.filter(x => x.isSelected)

      var underwiterInfo = {
        template: this.wcInsurerTemplateModel,
        premiumUnderwriter: this.premiumLst,
        MEAggregateInfo: this.wcMedicalBenifitsYesLstMEAggregateUW,
        MeInfo: this.wcMedicalBenifitsYesLstMEUE,
        deductiblesInsurer: this.deductiblesInsurer,
        PartnerName: this.selectedIcOptionTemplate.partnerId['name'],
        covers: this.liabiltyCoversUW
      };
      this.underWriterEditData.push(underwiterInfo)


      //ic end


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

    this.QuickViewFunciton();
  }



  QuickViewFunciton() {
    //to store words
    let clientDetailsString = {}
    let medicalExtensionsString = {}
    //let deductiblesString = {}
    let premiumString = {}
    let addOnsCoverString = {}
    let otherDetailsString = {}


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

    let mappingQCRMedicalExtensions = filterFun(this.medicalExtensionsDetailsFunc())

    if (mappingQCRMedicalExtensions.length > 0) {
      medicalExtensionsString = {
        "labels": {
          "type": "header",
          "value": "Medical Extension Benefits"
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

    let mappingPremiumDetails = filterFun(this.premiumDetailsFunc())

    if (mappingPremiumDetails.length > 0) {
      premiumString = {
        "labels": {
          "type": "header",
          "value": "Premium"
        }
      }
    }

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
    this.mappingQCR = [clientDetailsString, ...mappingQCRClient, addOnsCoverString, ...mappingAddOnsDetails, medicalExtensionsString, ...mappingQCRMedicalExtensions, premiumString, ...mappingPremiumDetails, otherDetailsString, ...mappingAddOnsDetails]
    let count = 0
    this.mappingQCRArr = this.mappingQCR.filter(item => {
      if (Object.keys(item).length > 0) {
        return item;
      }
    })
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

  medicalExtensionsDetailsFunc() {
    const tempArr = []


    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Medical Extension Benefits" },
      [this.quote._id]: { type: 'string', value: this.quote.wcTemplateDataId["medicalBenifitsOption"] === "ME" ? "Medical Extension" : "Medical Extension AGGREGATE" },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      const quoteValue = quote.wcTemplateDataId["medicalBenifitsOption"] === "ME" ? "Medical Extension" : "Medical Extension AGGREGATE";
      const baseValue = this.quote.wcTemplateDataId["medicalBenifitsOption"] === "ME" ? "Medical Extension" : "Medical Extension AGGREGATE";

      return {
        [quote._id]: {
          type: 'string',
          value: quoteValue,
          styleaddon: quoteValue !== baseValue ? 'red' : ''
        }
      };
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Is Actual ?" },
      [this.quote._id]: { type: 'string', value: this.quote.wcTemplateDataId["isActual"] ? "YES" : "NO" },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      const quoteValue = quote.wcTemplateDataId["isActual"] ? "YES" : "NO";
      const baseValue = this.quote.wcTemplateDataId["isActual"] ? "YES" : "NO";

      return {
        [quote._id]: {
          type: 'string',
          value: quoteValue,
          styleaddon: quoteValue !== baseValue ? 'red' : ''
        }
      };
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Amount(₹)" },
      [this.quote._id]: { type: 'currency', value: this.quote.wcTemplateDataId["medicalBenifitsAmount"] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      const quoteValue = quote.wcTemplateDataId["medicalBenifitsAmount"];
      const baseValue = this.quote.wcTemplateDataId["medicalBenifitsAmount"];

      return {
        [quote._id]: {
          type: 'currency',
          value: quoteValue,
          styleaddon: quoteValue !== baseValue ? 'red' : ''
        }
      };
    })));

    return tempArr;

  }

  premiumDetailsFunc() {
    const tempArr = []


    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Discount based on Premium (%)" },
      [this.quote._id]: { type: 'string', value: this.quote.wcTemplateDataId["discountbasedonPremium"].toString() },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      const quoteValue = quote.wcTemplateDataId["discountbasedonPremium"].toString();
      const baseValue = this.quote.wcTemplateDataId["discountbasedonPremium"].toString();

      return {
        [quote._id]: {
          type: 'string',
          value: quoteValue,
          styleaddon: quoteValue !== baseValue ? 'red' : ''
        }
      };
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Addons Covers(₹)" },
      [this.quote._id]: { type: 'currency', value: this.quote.wcTemplateDataId["addonCoversAmount"] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      const quoteValue = quote.wcTemplateDataId["addonCoversAmount"];
      const baseValue = this.quote.wcTemplateDataId["addonCoversAmount"];

      return {
        [quote._id]: {
          type: 'currency',
          value: quoteValue,
          styleaddon: quoteValue !== baseValue ? 'red' : ''
        }
      };
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: "Target Premium(₹)" },
      [this.quote._id]: { type: 'currency', value: this.quote.wcTemplateDataId["targetPremium"] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      const quoteValue = quote.wcTemplateDataId["targetPremium"];
      const baseValue = this.quote.wcTemplateDataId["targetPremium"];

      return {
        [quote._id]: {
          type: 'currency',
          value: quoteValue,
          styleaddon: quoteValue !== baseValue ? 'red' : ''
        }
      };
    })));

    tempArr.push(Object.assign({
      'labels': { type: 'string', value: " Total Premium(₹)" },
      [this.quote._id]: { type: 'currency', value: this.quote.wcTemplateDataId["indicativePremium"] },
    }, ...this.insurerProcessedQuotes.map((quote) => {
      const quoteValue = quote.wcTemplateDataId["indicativePremium"];
      const baseValue = this.quote.wcTemplateDataId["indicativePremium"];

      return {
        [quote._id]: {
          type: 'currency',
          value: quoteValue,
          styleaddon: quoteValue !== baseValue ? 'red' : ''
        }
      };
    })));

    return tempArr;

  }

  deductiblesFunc() {
    const tempArr = []

    // Loaded Add on Covers Dynamically
    // First, add deductibles from this.quote?.wcTemplateDataId["deductibles"]
    for (let d of this.quote?.wcTemplateDataId["deductibles"]) {
      let tempObj: Record<string, { type: string; value: any }> = {
        'labels': { type: 'string', value: `${d.description}` },
        [this.quote._id]: { type: 'currency', value: d.amount }
      };

      this.insurerProcessedQuotes.forEach((quote) => {
        const foundDeductible = quote.wcTemplateDataId["deductibles"].find(s =>
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

    // Now, check for any additional deductibles in insurerProcessedQuotes that are not in this.quote?.wcTemplateDataId["deductibles"]
    this.insurerProcessedQuotes.forEach((quote) => {
      quote.wcTemplateDataId["deductibles"].forEach((s) => {
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
              const foundDeductible = innerQuote.wcTemplateDataId["deductibles"].find(deductible =>
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

  addOnsDetailsFunc() {

    const tempArr = [];

    // First, add covers from this.quote?.wcTemplateDataId["liabiltyCovers"]
    Object.entries(this.quote?.wcTemplateDataId["liabiltyCovers"] as Record<string, any>).forEach(([breakUpkey, breakup]) => {
      let tempObj: Record<string, { type: string; value: any, isAlignmentRequired?: boolean, styleaddon?: string }> = {
        'labels': { type: 'string', value: `${breakup.name}` },
        [this.quote._id]: { type: 'string', value: breakup.optionSelected === "" ? "N/A" : breakup.optionSelected, isAlignmentRequired: false }
      };

      this.insurerProcessedQuotes.forEach((quote) => {
        const insurerBreakup = Object.entries(quote.wcTemplateDataId["liabiltyCovers"] as Record<string, any>)
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

    // Now, check for any additional covers in insurerProcessedQuotes that are not in this.quote?.wcTemplateDataId["liabiltyCovers"]
    this.insurerProcessedQuotes.forEach((quote) => {
      Object.entries(quote.wcTemplateDataId["liabiltyCovers"] as Record<string, any>).forEach(([insurerBreakUpkey, insurerBreakup]) => {
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
              const innerInsurerBreakup = Object.entries(innerQuote.wcTemplateDataId["liabiltyCovers"] as Record<string, any>)
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

  compareDeductibles(list1: any[], list2: any[]): any[] {
    const mergedList: any[] = [];

    // Process list1 items
    list1.forEach(item1 => {
      const matchedItem = list2.find(item2 => item2.description === item1.description);
      if (matchedItem) {
        item1.changed = item1.amount !== matchedItem.amount;
      } else {
        item1.changed = true;
      }
      mergedList.push(item1);
    });

    // Process list2 items that are not in list1
    list2.forEach(item2 => {
      const matchedItem = list1.find(item1 => item1.description === item2.description);
      if (!matchedItem) {
        item2.changed = true; // Mark as changed since it only exists in list2
        mergedList.push(item2);
      }
    });

    return mergedList;
  }


  compareAddOnCovers(list1: any[], list2: any[]): any[] {
    const mergedList: any[] = [];

    // Process list1 items
    list1.forEach(item1 => {
      const matchedItem = list2.find(item2 => item2.name === item1.name);
      if (matchedItem) {
        item1.changed = item1.optionSelected !== matchedItem.optionSelected;
      } else {
        item1.changed = true;
      }
      mergedList.push(item1);
    });

    // Process list2 items that are not in list1
    list2.forEach(item2 => {
      const matchedItem = list1.find(item1 => item1.name === item2.name);
      if (!matchedItem) {
        item2.changed = true; // Mark as changed since it only exists in list2
        mergedList.push(item2);
      }
    });

    return mergedList;
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




  generatePlacementSlip(quoteId) {
    const quote = this.insurerProcessedQuotes.find((quote) => quote._id == quoteId)
    const current_url = window.location.pathname;
    if (quote) {
      if (this.quote.qcrApproved && this.quote.placementApproved) {
        let templateData: any = quote.wcTemplateDataId
        // if (templateData.coInsurers.length > 0 && templateData.chequeNo) {
        this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}?prev=${current_url}`)
        // } else {
        //   this.messageService.add({ key: "error", severity: 'warn', detail: 'Please Enter Payment Details and Co-Insurer Details' })
        // }
      } else {
        this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}?prev=${current_url}`)
      }
    }
  }


  openQuoteSlip(quoteId?) {
    console.log(quoteId)
    const quote = quoteId ? this.insurerProcessedQuotes.find((quote) => quote._id == quoteId) : this.quote

    if (quote) {
      const ref = this.dialogService.open(QuoteSlipDialogComponent, {
        header: quote.quoteNo,
        width: '1200px',
        styleClass: 'customPopup-dark',
        data: {
          quote: quote,
        }
      })
    }
  }




  loadWCCoverageType() {

    this.wcCoverageTypeService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        //this.wccoverageTypesAll = records.data.entities;
        this.wccoverageTypesFree = records.data.entities.filter(c => c.isFree && (c.isStandard == undefined || c.isStandard == false));
        this.wcStandardcoverageType = records.data.entities.filter(c => c.isFree && c.isStandard);
      },
      error: e => {
        console.log(e);
      }
    });
  }


  ngOnInit(): void {

    if (this.wcTemplateModel.tableType === 'Unnamed') {
      this.isNamed = false;
    }
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 5,
      sortField: '_id',
      sortOrder: -1,
      filters: {
        // @ts-ignore
        quoteId: [
          {
            value: this.quote?._id,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };


  }

  ngOnDestroy(): void {
    // this.currentQuoteLocationOccupancyId.unsubscribe();
    this.currentQuote.unsubscribe();
  }

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
  mainCols: MenuItem[] = []
  // ---------------------------------------------------------------


  // ----------------------------------------------------------

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
          { label: "Other Details", id: "other_details" }]
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
          { label: "Revenue Details", id: "revenue_details" },
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

    // console.log(tab)
    this.selectedIcOptionTemplate = this.selectedInsurerQuote()
    if (!tab) tab = this.tabs.find(tab => tab.id == this.selectedTabId) ?? this.tabs[0]
    this.router.navigate([], { queryParams: { tab: tab?.id } });
    this.selectedTabId = tab?.id
    // this.mapping = []

    switch (tab?.id) {
      case 'wm_details':
        this.mapping = [];
        this.mapping.push(
          Object.assign(
            {
              labels: { type: 'string', value: '' },
              [this.quote?._id]: {
                type: 'button',
                buttonClassName: 'btn btn-primary p-0 px-2',
                onClick: () => this.openQuoteSlip(),
                value: 'View Quote',
              },
            },
            ...this.quote?.insurerProcessedQuotes.map((quote) => {
              return {
                [quote._id]: {
                  type: 'buttons',
                  buttons: [
                    {
                      onClick: () => this.openQuoteSlip(quote._id),
                      buttonClassName: 'btn btn-primary p-0 px-2',
                      value: 'View Quote',
                    },
                    ...(this.quote.qcrApprovedRequested && this.quote.qcrApproved
                      ? [
                        {
                          onClick: () => this.generatePlacementSlip(quote._id),
                          buttonClassName: 'btn btn-success p-0 px-2 ml-2',
                          value: 'Generate Placement Slip',
                        },
                      ]
                      : []),

                  ],
                },
              };
            })
          )
        );
        break;
      case 'other_details':
        this.mapping = [];
        this.mapping.push(Object.assign({
          'labels': { type: 'string', value: "" },
          [this.quote?._id]: { type: 'button', buttonClassName: "btn btn-primary p-0 px-2", onClick: () => this.openQuoteSlip(), value: 'View Quote' },

        }, ...this.insurerProcessedQuotes.map((quote) => {
          return ({
            [quote._id]: {
              type: 'buttons', buttons: [
                { onClick: () => this.openQuoteSlip(quote._id), buttonClassName: "btn btn-primary p-0 px-2", value: 'View Quote' },
                { onClick: () => this.generatePlacementSlip(quote._id), buttonClassName: "btn btn-success p-0 px-2 ml-2", value: 'Generate Placement Slip' },
              ]
            }
          })
        })));
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
        if (this.quote.placementApproved) {
          this.mapping.push(Object.assign({
            'labels': { type: 'string', value: "Submit Bank Details" },
            [this.quote._id]: {
              type: 'button',
              value: "Submit Payment Details",
              buttonClassName: 'btn btn-primary',
              onClick: () => { this.submitBankDetails() }
            }
          }, ...this.insurerProcessedQuotes.map((quote) => {
            return ({
              [quote["_id"]]: {
                type: 'button',
                value: "Submit Payment Details",
                buttonClassName: 'btn btn-primary',
                onClick: () => { this.submitBankDetails(quote["_id"]) }
              }
            });
          })));
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

  submitBankDetails(quoteId?) {
    console.log(quoteId)

    const quote = quoteId ? this.insurerProcessedQuotes.find((quote) => quote._id == quoteId) : this.quote
    console.log("Submitting Bank Details:", this.quote);

    if (quote) {
      const ref = this.dialogService.open(PaymentDetailComponent, {
        header: "Payment Details",
        width: '1200px',
        styleClass: 'customPopup-dark',
        data: {
          quote: quote
        }
      })
    }
  }

  openQuoteSlipBroker() {


    if (this.quote) {
      const ref = this.dialogService.open(QuoteSlipDialogComponent, {
        header: this.quote.quoteNo,
        width: '1200px',
        styleClass: 'customPopup-dark',
        data: {
          quote: this.quote,
        }
      })
    }
  }





}
