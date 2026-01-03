import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { CountryService } from 'src/app/features/admin/country/country.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { AllowedQuoteStates, BasicDetailsAttachments, DANDOTemplate, IQuoteSlip, SubsidiaryDetails } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { LiabilityEandOAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-eando-addoncovers-dialog/liability-eando-addoncovers-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
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
  selector: 'app-teritory-subsidary-details-eando-tab',
  templateUrl: './teritory-subsidary-details-eando-tab.component.html',
  styleUrls: ['./teritory-subsidary-details-eando-tab.component.scss']
})
export class TeritorySubsidaryDetailsEandOTabComponent implements OnInit {
  subsidairyAttachment: BasicDetailsAttachments[] = []
  quoteEandOOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  @Input() permissions: PermissionType[] = ['create', 'read', 'update', 'delete']
  uploadSubsidiaryAnnualReportUrl: string;
  countryList: ILov[] = [];
  uploadHttpHeaders: HttpHeaders;
  currentUser$: Observable<IUser>;
  deductibilitiesCount: number = 0
  selectedCoversCount: number = 0
  OptionTerritoryAndJurasdiction: ILov[] = []
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityEandOTemplateService: liabilityEandOTemplateService,
    private accountService: AccountService, private indicativePremiumCalcService: IndicativePremiumCalcService, private countryService: CountryService, private messageService: MessageService
  ) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.currentUser$ = this.accountService.currentUser$
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        //this.quoteEandOOptions = this.quote?.liabilityEandOTemplateDataId;
        // let liabiltyCovers = this.quoteEandOOptions.liabiltyCovers
        // this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        // this.deductibilitiesCount = 0
        // if (!this.quoteEandOOptions.deductibles) {
        //   this.quoteEandOOptions.deductibles = [];
        // }
        // this.deductibilitiesCount = this.quoteEandOOptions.deductibles.length;
        // this.searchOptionsCountries()

        // this.quoteEandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateEandOPremium(this.quoteEandOOptions.limitOfLiability)
        // this.subsidairyAttachment = []
        // if (this.quoteEandOOptions.subsidairyAnnualReportFilePath != null && this.quoteEandOOptions.subsidairyAnnualReportFilePath != ''
        //   && this.quoteEandOOptions.subsidairyAnnualReportFileName != null && this.quoteEandOOptions.subsidairyAnnualReportFileName != ''
        // ) {
        //   this.subsidairyAttachment = []
        //   var attachment = new BasicDetailsAttachments();
        //   attachment.filePath = this.quoteEandOOptions.subsidairyAnnualReportFilePath;
        //   attachment.fileName = this.quoteEandOOptions.subsidairyAnnualReportFileName;
        //   attachment.id = this.quoteEandOOptions._id;
        //   attachment.quoteId = this.quote._id;
        //   attachment.templateId = this.quoteEandOOptions._id;
        //   this.subsidairyAttachment.push(attachment);

        // }
      }
    })

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteEandOOptions = template;
        this.selectedCoversCount = this.quoteEandOOptions.liabiltyCovers.filter(x => x.isSelected == true).length
        this.deductibilitiesCount = 0
        if (!this.quoteEandOOptions.liabiltyDeductibles) {
          this.quoteEandOOptions.liabiltyDeductibles = [];
        }
        this.deductibilitiesCount = this.quoteEandOOptions.liabiltyDeductibles.length;
        this.searchOptionsCountries()

        this.quoteEandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateEandOPremium(this.quoteEandOOptions.limitOfLiability)
        this.subsidairyAttachment = []
        if (this.quoteEandOOptions.subsidairyAnnualReportFilePath != null && this.quoteEandOOptions.subsidairyAnnualReportFilePath != ''
          && this.quoteEandOOptions.subsidairyAnnualReportFileName != null && this.quoteEandOOptions.subsidairyAnnualReportFileName != ''
        ) {
          this.subsidairyAttachment = []
          var attachment = new BasicDetailsAttachments();
          attachment.filePath = this.quoteEandOOptions.subsidairyAnnualReportFilePath;
          attachment.fileName = this.quoteEandOOptions.subsidairyAnnualReportFileName;
          attachment.id = this.quoteEandOOptions._id;
          attachment.quoteId = this.quote._id;
          attachment.templateId = this.quoteEandOOptions._id;
          this.subsidairyAttachment.push(attachment);

        }
      }
    })
  }


  openAddOnCoversDialog() {
    const ref = this.dialogService.open(LiabilityEandOAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quoteEandOOptions.liabiltyCovers,
        quoteEandOOptions: this.quoteEandOOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
    })


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.uploadSubsidiaryAnnualReportUrl = this.liabilityEandOTemplateService.SubsidiaryAnnualReportUploadUrl(this.quoteEandOOptions?._id);
    this.searchOptionsCountries()
    this.loadTerritoryAndJurasdiction()

  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_TERRITORY_AND_JURISDICTION).subscribe({
      next: records => {

        this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  searchOptionsCountries() {

    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_SUBSIDIARY_LOCATION).subscribe({
      next: records => {
        if (records.data.entities.length > 0) {
          records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
        }
        this.countryList = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });

  }
  setCountryName(item: any) {
    item.countryName = this.countryList.filter(x => x.value == item.countryId)[0].label;
  }

  removeRow(index: any) {
    this.quoteEandOOptions.subsidaryDetails.splice(index, 1);
  }

  addSubsidary() {
    let subDetails = new SubsidiaryDetails()
    this.quoteEandOOptions.subsidaryDetails.push(subDetails)
  }

  save() {

    const subsidiaryDetails = this.quoteEandOOptions.subsidaryDetails;

    if (subsidiaryDetails.some(x => (x.activityName == "" || x.activityName == null || x.activityName == undefined) && x.isSelected == true)) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Details of Activity is required, if checkbox of business activity as per parent company is selected.`
      });
      return;
    }

    if (subsidiaryDetails.some(x => (x.countryId == "" || x.countryId == null || x.countryId == undefined) || (x.countryName == "" || x.countryName == null || x.countryName == undefined) && x.isSelected == false)) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Location name is required.`
      });
      return;
    }

    const uniqueSet = new Set();

    const hasDuplicates = subsidiaryDetails.some(detail => {
      const detailString = JSON.stringify(detail);
      if (uniqueSet.has(detailString)) {
        return true;
      }
      uniqueSet.add(detailString);
      return false;
    });

    if (hasDuplicates) {
      // Duplicates found, handle the scenario
      // For example:
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Error: Duplicate subsidiary details found`,
        detail: `Duplicate subsidiary details found`
      });
      return;
    }
    let breachedValue = "";
    const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
    const configurationOtcType = productPartnerIcConfigurations[0].productPartnerIcConfigurationId?.otcType;
    const isConfigurationOfTypeBoth = configurationOtcType.includes(AllowedOtcTypes.BOTH)
    if (isConfigurationOfTypeBoth) {
      if (this.quoteEandOOptions.subsidaryDetails.some(x => x.countryName != "India")) {

        this.quote.otcType = AllowedOtcTypes.NONOTC;
        this.quote.isOtc = false;
        // breachedValue += `As your location is not India this quote will refer to NON-OTC`
        if (this.quote.nonOtcBreachedValue != "" && this.quote.nonOtcBreachedValue != null && this.quote.nonOtcBreachedValue != undefined) {
          if (this.quote.nonOtcBreachedValue != "" && this.quote.nonOtcBreachedValue != undefined) {
            this.quote.nonOtcBreachedValue = this.removeLastComma(this.quote.nonOtcBreachedValue);
          }
          if (!this.quote.nonOtcBreachedValue.includes('As your location is not India this quote will refer to NON-OTC')) {
            breachedValue += `, As your location is not India this quote will refer to NON-OTC,`
          }
        }
        else {
          breachedValue += `As your location is not India this quote will refer to NON-OTC,`
        }

        if (this.quote.nonOtcBreachedValue == null) {
          this.quote.nonOtcBreachedValue = ""
        }
        this.quote.nonOtcBreachedValue += breachedValue;

      }
      else {
        if (this.quote.nonOtcBreachedValue != "" && this.quote.nonOtcBreachedValue != null && this.quote.nonOtcBreachedValue != undefined && this.quote.otcType == AllowedOtcTypes.NONOTC) {
          if (this.quote.nonOtcBreachedValue.includes('As your location is not India this quote will refer to NON-OTC')) {
            this.quote.nonOtcBreachedValue = this.quote.nonOtcBreachedValue.replace('As your location is not India this quote will refer to NON-OTC', '');
          }
        }
        else {
          this.quote.nonOtcBreachedValue = null;
          this.quote.otcType = AllowedOtcTypes.OTC;
          this.quote.isOtc = false;
        }

      }
      //this.quote.nonOtcBreachedValue += breachedValue;
    }
    if (this.quote.nonOtcBreachedValue != "" && this.quote.nonOtcBreachedValue != undefined) {
      this.quote.nonOtcBreachedValue = this.removeLastComma(this.quote.nonOtcBreachedValue);
    }
    //this.quote.quoteState = AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE
    let totalIndictiveQuoteAmtWithGst = Number(this.quoteEandOOptions.totalPremiumAmt + this.quoteEandOOptions.totalPremiumAmt * 0.18)
    this.quote.totalIndictiveQuoteAmtWithGst = totalIndictiveQuoteAmtWithGst;

    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
        this.liabilityEandOTemplateService.updateArray(this.quoteEandOOptions._id, this.quoteEandOOptions).subscribe({
          next: quote => {
            console.log("E&O Added Successfully");
            this.quoteService.refresh(() => {
            })
          },
          error: error => {
            console.log(error);
          }
        });
        this.quoteService.refresh(() => {
        })
      },
      error: error => {
        console.log(error);
      }
    });



  }

  removeLastComma(str: string): string {
    if (str.trim().endsWith(',')) {
      return str.slice(0, -1);
    }
    return str;
  }
  deleteSubsidiaryAnnualReport() {
    this.liabilityEandOTemplateService.SubsidiaryAnnualReportDelete(this.quoteEandOOptions._id).subscribe({
      next: () => {
        this.quoteService.get(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<IQuoteSlip>) => {
            // console.log(dto.data.entity)
            this.quoteService.setQuote(dto.data.entity)
          },
          error: e => {
            console.log(e);
          }
        });
      }
    })
  }

  downloadSubsidiaryAnnualReport() {
    this.liabilityEandOTemplateService.SubsidiaryAnnualReportDownload(this.quoteEandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy Annual Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        // a.href = objectUrl
        // a.download = fileName;
        // a.click();

        window.open(objectUrl, '_blank');

        URL.revokeObjectURL(objectUrl);

      }
    })
  }

  downloadFileSubsidiaryAnnualReport() {
    this.liabilityEandOTemplateService.SubsidiaryAnnualReportDownload(this.quoteEandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy Annual Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        a.href = objectUrl
        a.download = fileName;
        a.click();


      }
    })
  }

  downloadFileSubsidiaryAnnualReportView() {
    this.liabilityEandOTemplateService.SubsidiaryAnnualReportDownload(this.quoteEandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        window.open(objectUrl, '_blank');

        URL.revokeObjectURL(objectUrl);


      }
    })
  }
  onUploadSubsidiaryAnnualReport() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.setQuote(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });
  }

  handleBusinessActivityCheckboxChange(event: any, item: any, index: number) {
    if (item.isSelected && !item.countryId) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please select a location`
      });
      this.quoteEandOOptions.subsidaryDetails.splice(index, 1);
      let subDetails = new SubsidiaryDetails()
      this.quoteEandOOptions.subsidaryDetails.push(subDetails)

    }
    else {
      if (!item.isSelected) {
        this.quoteEandOOptions.subsidaryDetails[index].activityName = ""
      }
    }
  }

  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }


}
