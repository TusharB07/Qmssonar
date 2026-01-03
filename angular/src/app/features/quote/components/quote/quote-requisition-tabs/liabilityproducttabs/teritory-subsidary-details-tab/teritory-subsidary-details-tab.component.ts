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
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { AllowedQuoteStates, BasicDetailsAttachments, DANDOTemplate, IQuoteSlip, SubsidiaryDetails } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { Country } from 'src/app/features/domain/customer';
import { LiabilityAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-addoncovers-dialog/liability-addoncovers-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-teritory-subsidary-details-tab',
  templateUrl: './teritory-subsidary-details-tab.component.html',
  styleUrls: ['./teritory-subsidary-details-tab.component.scss']
})
export class TeritorySubsidaryDetailsTabComponent implements OnInit {
  //optionsBusinessTypeAsParentCompany: ILov[] = []
  quoteDandOOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  @Input() permissions: PermissionType[] = ['create', 'read', 'update', 'delete']
  uploadSubsidiaryauditedfinancialReportUrl: string;
  countryList: ILov[] = [];
  uploadHttpHeaders: HttpHeaders;
  currentUser$: Observable<IUser>;
  deductibilitiesCount: number = 0;
  selectedCoversCount: number = 0;
  subsidairyAttachment: BasicDetailsAttachments[] = []
  OptionTerritoryAndJurasdiction: ILov[] = []
  templateName: string = ""
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityTemplateService: liabilityTemplateService,
    private accountService: AccountService, private indicativePremiumCalcService: IndicativePremiumCalcService, private countryService: CountryService, private messageService: MessageService, private dialogService: DialogService
  ) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.currentUser$ = this.accountService.currentUser$

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
      }
    })

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteDandOOptions = template;
        this.searchOptionsCountries()
        let liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
        this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        this.deductibilitiesCount = 0
        if (!this.quoteDandOOptions.liabiltyDeductibles) {
          this.quoteDandOOptions.liabiltyDeductibles = [];
        }
        this.deductibilitiesCount = this.quoteDandOOptions.liabiltyDeductibles.filter(x => x.isSelected == true).length;

        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
          this.quoteDandOOptions.juridiction = 'Worldwide';
          this.quoteDandOOptions.territory = 'Worldwide';
          this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateDandOPremium(this.quoteDandOOptions.limitOfLiability)
        }
        else {
          this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCrimeInsurancePremium(this.quoteDandOOptions.limitOfLiability)

        }

        this.subsidairyAttachment = []
        if (this.quoteDandOOptions.subJoinVentureDocsFilePath != null && this.quoteDandOOptions.subJoinVentureDocsFilePath != ''
          && this.quoteDandOOptions.subJoinVentureDocsFileName != null && this.quoteDandOOptions.subJoinVentureDocsFileName != ''
        ) {
          this.subsidairyAttachment = []
          var attachment = new BasicDetailsAttachments();
          attachment.filePath = this.quoteDandOOptions.subJoinVentureDocsFilePath;
          attachment.fileName = this.quoteDandOOptions.subJoinVentureDocsFileName;
          attachment.id = this.quoteDandOOptions._id;
          attachment.quoteId = this.quote._id;
          attachment.templateId = this.quoteDandOOptions._id;
          this.subsidairyAttachment.push(attachment);
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    //this.loadTypeOfPolicy()
    this.uploadSubsidiaryauditedfinancialReportUrl = this.liabilityTemplateService.SubsidiaryauditedfinancialReportUploadUrl(this.quoteDandOOptions?._id);
    this.searchOptionsCountries()
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME) {
      this.loadTerritoryAndJurasdiction()
    }
  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CRIME_TERRITORY_AND_JURISDICTION).subscribe({
      next: records => {

        this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  searchOptionsCountries() {
    // this.countryService.getManyAsLovs(DEFAULT_RECORD_FILTER).subscribe({
    //   next: records => {
    //     this.countryList = records.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
    //     console.log(this.countryList);
    //   },
    //   error: e => {
    //     console.log(e);
    //   }
    // });

    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY)
      ? WCAllowedListOfValuesMasters.LIABILITY_SUBSIDIARY_LOCATION
      : WCAllowedListOfValuesMasters.CRIME_LIABILITY_SUBSIDIARY_LOCATION).subscribe({
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
    // if (this.quoteDandOOptions.subsidaryDetails.some(x => x.countryId == item.countryId)) {
    //   this.messageService.add({
    //     key: "error",
    //     severity: "error",
    //     summary: `Country name is same`,
    //     detail: `Country name is same`
    //   });
    //   item.countryName =""
    //   item.countryId =""
    //   return 
    // } else {
    item.countryName = this.countryList.filter(x => x.value == item.countryId)[0].label;
    //}


  }

  removeRow(index: any) {
    this.quoteDandOOptions.subsidaryDetails.splice(index, 1);
  }

  addSubsidary() {
    let subDetails = new SubsidiaryDetails()
    this.quoteDandOOptions.subsidaryDetails.push(subDetails)
  }

  save() {
    const subsidiaryDetails = this.quoteDandOOptions.subsidaryDetails;
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
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Error: Duplicate subsidiary details found`,
        detail: `Duplicate subsidiary details found`
      });
      return;
    }
    const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
    const configurationOtcType = productPartnerIcConfigurations[0].productPartnerIcConfigurationId?.otcType;
    const isConfigurationOfTypeBoth = configurationOtcType.includes(AllowedOtcTypes.BOTH);
    if (isConfigurationOfTypeBoth) {
      this.indicativePremiumCalcService.isOtcCheckLiability(this.quote, this.quoteDandOOptions).then(isBreach => {
        this.quote.otcType = isBreach ? AllowedOtcTypes.NONOTC : AllowedOtcTypes.OTC;
        this.performUpdate();
      }).catch(error => {
        console.error('Error checking OTC liability:', error);
        this.quote.otcType = AllowedOtcTypes.OTC;
        this.performUpdate();
      });
    } else {
      this.performUpdate();
    }
  }

  performUpdate() {
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
      this.quoteDandOOptions.juridiction = 'Worldwide';
      this.quoteDandOOptions.territory = 'Worldwide';
    }
    this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
      next: quote => {
        console.log("DANDO Added Successfully");
        this.quoteService.refresh(() => {

        });
      },
      error: error => {
        console.log(error);
      }
    });
    this.quoteService.refresh(() => { });

  }


  removeLastComma(str: string): string {
    if (str.trim().endsWith(',')) {
      return str.slice(0, -1);
    }
    return str;
  }
  
  deleteSubsidiaryauditedfinancialReport() {
    this.liabilityTemplateService.SubsidiaryauditedfinancialReportDelete(this.quoteDandOOptions._id).subscribe({
      next: () => {
        this.quoteService.get(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<IQuoteSlip>) => {
            // console.log(dto.data.entity)
            this.quoteService.setQuote(dto.data.entity)
            this.subsidairyAttachment.length = 0;
          },
          error: e => {
            console.log(e);
          }
        });
      }
    })
  }

  downloadSubsidiaryauditedfinancialReport() {
    this.liabilityTemplateService.SubsidiaryauditedfinancialReportDownload(this.quoteDandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

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

  downloadFileSubsidiaryauditedfinancialReport() {
    this.liabilityTemplateService.SubsidiaryauditedfinancialReportDownload(this.quoteDandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

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

  onUploadSubsidiaryauditedfinancialReport() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.setQuote(dto.data.entity)
        this.subsidairyAttachment = []
          var attachment = new BasicDetailsAttachments();
          attachment.filePath = dto.data.entity.liabilityTemplateDataId['subJoinVentureDocsFilePath'];
          attachment.fileName = dto.data.entity.liabilityTemplateDataId['subJoinVentureDocsFileName'];
          attachment.id = dto.data.entity.liabilityTemplateDataId['_id'];
          attachment.quoteId = this.quote._id;
          attachment.templateId = dto.data.entity.liabilityTemplateDataId['_id'];
          this.subsidairyAttachment.push(attachment);
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
      this.quoteDandOOptions.subsidaryDetails.splice(index, 1);
      let subDetails = new SubsidiaryDetails()
      this.quoteDandOOptions.subsidaryDetails.push(subDetails)

    }
    else {
      if (!item.isSelected) {
        this.quoteDandOOptions.subsidaryDetails[index].activityName = ""
      }
    }
  }

  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }

  openFlexaCoversDialog() {
    const ref = this.dialogService.open(LiabilityAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quoteDandOOptions.liabiltyCovers,
        quoteDandOOptions: this.quoteDandOOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
    })


  }

}
