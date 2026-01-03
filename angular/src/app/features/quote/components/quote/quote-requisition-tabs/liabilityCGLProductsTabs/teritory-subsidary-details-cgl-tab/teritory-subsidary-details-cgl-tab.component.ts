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
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { AllowedQuoteStates, IQuoteSlip, SubsidiaryDetails } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { LiabilityCGLAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-cgl-addoncovers-dialog/liability-cgl-addoncovers-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
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
  selector: 'app-teritory-subsidary-details-cgl-tab',
  templateUrl: './teritory-subsidary-details-cgl-tab.component.html',
  styleUrls: ['./teritory-subsidary-details-cgl-tab.component.scss']
})
export class TeritorySubsidaryDetailsCGLTabComponent implements OnInit {

  quoteCGLOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  @Input() permissions: PermissionType[] = ['create', 'read', 'update', 'delete']
  countryList: ILov[] = [];
  currentUser$: Observable<IUser>;
  deductibilitiesCount: number = 0
  selectedCoversCount: number = 0
  OptionTerritoryAndJurasdiction: ILov[] = []
  templateName: string = ""
  private currentSelectedOption: Subscription;
    private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private quoteService: QuoteService, private indicativePremiumCalcService: IndicativePremiumCalcService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityCGLTemplateService: liabilityCGLTemplateService,
    private accountService: AccountService, private countryService: CountryService, private messageService: MessageService
  ) {
    this.currentUser$ = this.accountService.currentUser$
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
      //   this.quoteCGLOptions = this.quote?.liabilityCGLTemplateDataId;
      //   let liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
      //   this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length

      //   if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
      //     this.searchOptionsCountries()
      //     this.deductibilitiesCount = 0;
      //     this.deductibilitiesCount = this.quoteCGLOptions.deductibles.length;
      //     this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
      //   }
      //   else {
      //     this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculatePublicLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
      //   }
      }
    })


    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
          const temp = template;
          this.quoteCGLOptions = temp
          let liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
          this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
          if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
            this.searchOptionsCountries()
            this.deductibilitiesCount = 0;
            this.deductibilitiesCount = this.quoteCGLOptions.liabiltyDeductibles.length;
            this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
          }
          else {
            this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculatePublicLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
          }
        
        }
      })
  }


  openAddOnCoversDialog() {
    const ref = this.dialogService.open(LiabilityCGLAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quoteCGLOptions.liabiltyCovers,
        quoteCGLOptions: this.quoteCGLOptions
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
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
      this.searchOptionsCountries()
      this.loadTerritoryAndJurasdiction()
    }

  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_TERRITORY_AND_JURISDICTION).subscribe({
      next: records => {

        this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  searchOptionsCountries() {

    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_SUBSIDIARY_LOCATION).subscribe({
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
    this.quoteCGLOptions.subsidaryDetails.splice(index, 1);
  }

  addSubsidary() {
    let subDetails = new SubsidiaryDetails()
    this.quoteCGLOptions.subsidaryDetails.push(subDetails)
  }

  save() {

    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {

    const subsidiaryDetails = this.quoteCGLOptions.subsidaryDetails;

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
  }
    let breachedValue = "";
    const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
    const configurationOtcType = productPartnerIcConfigurations[0].productPartnerIcConfigurationId?.otcType;
    const isConfigurationOfTypeBoth = configurationOtcType.includes(AllowedOtcTypes.BOTH)
    if (isConfigurationOfTypeBoth && this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL){
      if (this.quoteCGLOptions.subsidaryDetails.some(x => x.countryName != "India")) {

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
    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
      
        this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
          next: quote => {
            console.log("CGL Added Successfully");
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
  handleBusinessActivityCheckboxChange(event: any, item: any, index: number) {
    if (item.isSelected && !item.countryId) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please select a location`
      });
      this.quoteCGLOptions.subsidaryDetails.splice(index, 1);
      let subDetails = new SubsidiaryDetails()
      this.quoteCGLOptions.subsidaryDetails.push(subDetails)

    }
    else {
      if (!item.isSelected) {
        this.quoteCGLOptions.subsidaryDetails[index].activityName = ""
      }
    }
  }
  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }
}
