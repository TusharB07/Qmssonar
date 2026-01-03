import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { AllowedQuoteStates, DANDOTemplate, EmployeesDetails, IDANDOTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { LiabilityAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-addoncovers-dialog/liability-addoncovers-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { IUser } from 'src/app/features/admin/user/user.model';
import { HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
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
  selector: 'app-basic-details-tab',
  templateUrl: './basic-details-tab.component.html',
  styleUrls: ['./basic-details-tab.component.scss']
})
export class BasicDetailsTabComponent implements OnInit, OnChanges {
  optionsTypeOfPolicy: ILov[] = []
  //optionsNatureOfBusiness: ILov[] = []
  optionsAgeOfCompany: ILov[] = []
  optionsRetroactiveCover: ILov[] = []
  optionsAoaAoy: ILov[] = []
  quoteDandOOptions: any;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedCoversCount: number = 0
  selectedAttachment: string = "";
  selectedAttachmentType: string = "";
  attachemntTypeOther: string = "";
  cloptionAttachmentTypes: any[] = [];
  optionAttachmentTypes: any[] = [];
  uploadbasicDetailsAttachmentUrl: string;
  uploadHttpHeaders: HttpHeaders;
  currentUser$: Observable<IUser>;
  deductibilitiesCount: number = 0
  //limitOfLiabilityAOAAOY:string="$ "
  limitOfLiabilityAOAAOY: number = 0
  inTheAggregateAOAAOY: number = 0
  anyOneAccidentAOAAOY: number = 0
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false
  customOrderTypeOfPolicy: string[] = [
    'Primary DNO',
    'XS Layer Follow Form',
    'Umbrella Policy',
    'Side A XS Layer Follow Form'
  ];
  templateName: string = ""
  countryList: ILov[] = [];
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private messageService: MessageService, private dialogService: DialogService, private accountService: AccountService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityTemplateService: liabilityTemplateService,
    private indicativePremiumCalcService: IndicativePremiumCalcService) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.currentUser$ = this.accountService.currentUser$


    this.cloptionAttachmentTypes = [

      { label: 'Expiring Policy Copy', value: 'Expiring Policy Copy' },
      { label: 'Proposal Form', value: 'Proposal Form' },
      { label: 'Others', value: 'Others' },
    ];
    this.optionAttachmentTypes = [
      { label: 'Audited Report (Last 2 years)', value: 'Audited Report (Last 2 years)' },
      { label: 'Expiring Policy Copy', value: 'Expiring Policy Copy' },
      { label: 'Proposal Form', value: 'Proposal Form' },
      { label: 'Others', value: 'Others' },
    ];


    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
      }
    })

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteDandOOptions = template;
        this.savedBasicDetailsAttachment = this.quoteDandOOptions.basicDetailsAttchments
        if (this.quoteDandOOptions) {
          if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME) {
            this.searchOptionsCountries();
          }
          this.quoteDandOOptions.dateOfIncorporation = new Date(this.quote.riskStartDate)
          let liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
          this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
          this.deductibilitiesCount = 0
          if (!this.quoteDandOOptions.liabiltyDeductibles) {
            this.quoteDandOOptions.liabiltyDeductibles = [];
          }
          this.deductibilitiesCount = this.quoteDandOOptions.liabiltyDeductibles.filter(x => x.isSelected == true).length;
          //$ Conversion
          if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
            if (this.quoteDandOOptions?.aoaAoyId) {
              if (this.quoteDandOOptions?.aoaAoyId['lovKey'] == "1:1") {
                if (this.quote?.selectedCurrency == '$ Dollar') {
                  this.limitOfLiabilityAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
                  this.inTheAggregateAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
                  this.anyOneAccidentAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
                  this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
                  this.quoteDandOOptions.anyOneAccident = this.quoteDandOOptions.limitOfLiability
                }
                else {
                  this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
                  this.quoteDandOOptions.anyOneAccident = this.quoteDandOOptions.limitOfLiability
                }
              }
              else {
                if (this.quote?.selectedCurrency == '$ Dollar') {
                  this.limitOfLiabilityAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
                  this.inTheAggregateAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
                  this.anyOneAccidentAOAAOY = (+this.quoteDandOOptions.limitOfLiability / 2) / this.quote.dollarRate;
                  this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
                  this.quoteDandOOptions.anyOneAccident = +this.quoteDandOOptions.limitOfLiability / 2
                }
                else {
                  this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
                  this.quoteDandOOptions.anyOneAccident = +this.quoteDandOOptions.limitOfLiability / 2
                }
              }
            }
          }
          if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
            this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateDandOPremium(this.quoteDandOOptions.limitOfLiability)
          }
          else {
            this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCrimeInsurancePremium(this.quoteDandOOptions.limitOfLiability)
          }
        }
      }
    })
  }

  searchOptionsCountries() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CRIME_LIABILITY_SUBSIDIARY_LOCATION).subscribe({
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
    {
      item.isSelected = true;
      item.countryName = this.countryList.filter(x => x.value == item.countryId)[0].label;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteDandOOptions?._id, this.selectedAttachment);
  }

  ngOnInit(): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteDandOOptions?._id, this.selectedAttachment);

    this.loadTypeOfPolicy()
    this.loadRetroactiveCover()
    //this.loadNatureOfBusiness()
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
      this.loadAgeOfCompany()
    }
    else {
      this.searchOptionsCountries();
    }

  }


  handleEmployeesDetailsLocationChange(event: any, item: any, index: number) {
    if (item.isSelected && !item.countryId) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please select a country.`
      });
      this.quoteDandOOptions.employeesDetails.splice(index, 1);
      let details = new EmployeesDetails()
      this.quoteDandOOptions.employeesDetails.push(details)

    }
    else if (item.location == "" || item.location == null) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please enter the location for the country: ` + item.countryName
      });
    }
    else {
      if (!item.isSelected) {
        this.quoteDandOOptions.employeesDetails[index].location = ""
        this.quoteDandOOptions.employeesDetails[index].numberOfEmployees = 0
      }
    }
  }

  handleEmployeesDetailsNoOfEmployeesChange(event: any, item: any, index: number) {
    if (item.isSelected && !item.countryId) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please select a country.`
      });
      this.quoteDandOOptions.employeesDetails.splice(index, 1);
      let details = new EmployeesDetails()
      this.quoteDandOOptions.employeesDetails.push(details)

    }
    else if (item.numberOfEmployees == 0) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please enter the number of employees for the country: ` + item.countryName
      });
    }
    else {
      if (!item.isSelected) {
        this.quoteDandOOptions.employeesDetails[index].location = ""
        this.quoteDandOOptions.employeesDetails[index].numberOfEmployees = 0
      }
    }
  }


  checkIfFileUploadVisible(): boolean {
    if (this.selectedAttachment != undefined && this.selectedAttachment != null && this.selectedAttachment != '') {
      if (this.selectedAttachment == 'Others') {
        if (this.attachemntTypeOther != '') {
          return true;

        }
        else {
          return false;

        }
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  removeRow(index: any) {
    this.quoteDandOOptions.employeesDetails.splice(index, 1);
  }

  addEmployyeeDetails() {
    if (this.quoteDandOOptions.totalNumberOfEmployees > 0) {
      let details = new EmployeesDetails()
      this.quoteDandOOptions.employeesDetails.push(details)
    }
    else {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please enter the total number of employees first.`
      });
    }
  }

  saveForEmployee() {
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME) {

      if (this.quoteDandOOptions.totalNumberOfEmployees > 0) {

        if (this.quoteDandOOptions.employeesDetails.length > 0) {

          if (this.quoteDandOOptions.employeesDetails.some(x => x.countryId == "" || x.countryName == "" || x.numberOfEmployees == 0
          )) {
            this.messageService.add({
              key: "error",
              severity: "error",
              summary: `Missing Information`,
              detail: `Select or enter all options for each Employee Details`
            });
            return;
          }

          let totalNoOfEmployees = 0;
          this.quoteDandOOptions.employeesDetails.forEach(element => {
            totalNoOfEmployees += element.numberOfEmployees
          });

          if (totalNoOfEmployees != this.quoteDandOOptions.totalNumberOfEmployees) {
            this.messageService.add({
              key: "error",
              severity: "error",
              summary: `Missing Information`,
              detail: `The total number of employees does not match the number of employee details provided. Please ensure they match.`
            });
            return;
          }
          let updatePayloadQuote = this.quote;
          this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
            next: quote => {
              this.liabilityTemplateService.update(this.quoteDandOOptions._id, { totalNumberOfEmployees: this.quoteDandOOptions.totalNumberOfEmployees, employeesDetails: this.quoteDandOOptions.employeesDetails }).subscribe({
                next: quote => {
                  console.log("DANDO Added Successfully");
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
        else {
          this.messageService.add({
            key: "error",
            severity: "error",
            summary: `Missing Information`,
            detail: `Please add the employees details`
          });
          return;
        }

      }
      else {
        this.messageService.add({
          key: "error",
          severity: "error",
          summary: `Missing Information`,
          detail: `Please enter the total number of employees`
        });
        return;
      }

    }

  }


  save() {
    const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
    const configurationOtcType = productPartnerIcConfigurations[0].productPartnerIcConfigurationId?.otcType;
    const isConfigurationOfTypeBoth = configurationOtcType.includes(AllowedOtcTypes.BOTH);
    const updateQuote = () => {
      let totalIndictiveQuoteAmtWithGst = Number(this.quoteDandOOptions.totalPremiumAmt + this.quoteDandOOptions.totalPremiumAmt * 0.18);
      this.quote.totalIndictiveQuoteAmtWithGst = totalIndictiveQuoteAmtWithGst;
      let updatePayloadQuote = this.quote;
      this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
        next: quote => {
          if (this.isAttachmentUpload) {
            this.quoteDandOOptions.basicDetailsAttchments = this.savedBasicDetailsAttachment;
          }
          this.isAttachmentUpload = false;
          this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
            next: quote => {
              console.log("DANDO Added Successfully");
              this.quoteService.refresh(() => { });
            },
            error: error => {
              console.log(error);
            }
          });
          this.quoteService.refresh(() => { });
        },
        error: error => {
          console.log(error);
        }
      });
    };

    if (isConfigurationOfTypeBoth && this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY) {
      this.indicativePremiumCalcService.isOtcCheckLiability(this.quote, this.quoteDandOOptions)
        .then(isBreach => {
          this.quote.otcType = isBreach ? AllowedOtcTypes.NONOTC : AllowedOtcTypes.OTC;
          updateQuote();
        })
        .catch(error => {
          console.error('Error checking OTC liability:', error);
          this.quote.otcType = AllowedOtcTypes.OTC;
          updateQuote();
        });
    } else {
      updateQuote();
    }
  }

  removeLastComma(str: string): string {
    if (str.trim().endsWith(',')) {
      return str.slice(0, -1);
    }
    return str;
  }

  loadquoteDetails() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteService.setQuote(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });

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

  onDropdownAOAChange(event: any) {

    var aoi = this.optionsAoaAoy.filter(x => x.value == event.value)[0]
    if (aoi.label == "1:1") {
      if (this.quote?.selectedCurrency == '$ Dollar') {
        // this.limitOfLiabilityAOAAOY = "$ " + Intl.NumberFormat('en-IN').format(this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate).toString();
        this.limitOfLiabilityAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
        this.inTheAggregateAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
        this.anyOneAccidentAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
        this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
        this.quoteDandOOptions.anyOneAccident = this.quoteDandOOptions.limitOfLiability
      }
      else {
        this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
        this.quoteDandOOptions.anyOneAccident = this.quoteDandOOptions.limitOfLiability
      }
    }
    else {
      if (this.quote?.selectedCurrency == '$ Dollar') {
        // this.limitOfLiabilityAOAAOY = "$ " + Intl.NumberFormat('en-IN').format(this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate);
        this.limitOfLiabilityAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
        this.inTheAggregateAOAAOY = this.quoteDandOOptions.limitOfLiability / this.quote.dollarRate;
        this.anyOneAccidentAOAAOY = (+this.quoteDandOOptions.limitOfLiability / 2) / this.quote.dollarRate;
        this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
        this.quoteDandOOptions.anyOneAccident = +this.quoteDandOOptions.limitOfLiability / 2
      }
      else {
        this.quoteDandOOptions.inTheAggregate = this.quoteDandOOptions.limitOfLiability
        this.quoteDandOOptions.anyOneAccident = +this.quoteDandOOptions.limitOfLiability / 2
      }
    }
  }

  loadTypeOfPolicy() {
    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY)
      ? WCAllowedListOfValuesMasters.LIABILITY_TYPE_OF_POLICY
      : WCAllowedListOfValuesMasters.CRIME_LIABILITY_TYPE_OF_POLICY).subscribe({
        next: records => {

          this.optionsTypeOfPolicy = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
          if (this.optionsTypeOfPolicy.length > 0) {
            this.optionsTypeOfPolicy = this.sortStrings(this.optionsTypeOfPolicy, this.customOrderTypeOfPolicy);
          }
        },
        error: e => {
          console.log(e);
        }
      });
  }

  // loadNatureOfBusiness() {
  //   this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_NATURE_OF_BUSINESS).subscribe({
  //     next: records => {

  //       this.optionsNatureOfBusiness = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
  //     },
  //     error: e => {
  //       console.log(e);
  //     }
  //   });
  // }

  loadAgeOfCompany() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_AGE_OF_COMPANY).subscribe({
      next: records => {

        this.optionsAgeOfCompany = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadRetroactiveCover() {
    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY)
      ? WCAllowedListOfValuesMasters.LIABILITY_RETROACTIVE_COVER
      : WCAllowedListOfValuesMasters.CRIME_LIABILITY_RETROACTIVE_COVER).subscribe({
        next: records => {

          this.optionsRetroactiveCover = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        },
        error: e => {
          console.log(e);
        }
      });
  }


  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    // const result = this.searchItemInArray(this.selectedAttachment);
    // this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.liabilityTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteDandOOptions?._id, this.selectedAttachment);
  }

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteDandOOptions?._id, this.attachemntTypeOther);
  }

  searchItemInArray(searchTerm: string) {
    for (let parentItem of this.optionAttachmentTypes) {
      for (let item of parentItem.items) {
        if (item.label === searchTerm || item.value === searchTerm) {
          return parentItem.label;
        }
      }
    }
    return null;
  }


  deleteBasicDetailsAttachmentsDetails(fileId: string) {
    this.liabilityTemplateService.BasicDetailsAttachmentsDelete(this.quoteDandOOptions._id, fileId).subscribe({
      next: (response : any) => {
        this.savedBasicDetailsAttachment = response.data.entity['basicDetailsAttchments']
      },
      error: e => {
        console.log(e);
      }
    });
  }

  downloadBasicDetailsAttachmentsDetails(fileId: string) {
    this.liabilityTemplateService.BasicDetailsAttachmentsDownload(this.quoteDandOOptions._id, fileId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'basic_details_attachment';

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

  downloadBasicDetailsAttachmentsDetailsfile(fileId: string) {
    this.liabilityTemplateService.BasicDetailsAttachmentsDownload(this.quoteDandOOptions._id, fileId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'basic_details_attachment';
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

  onUploadBasicDetailsAttachmentUpload() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.savedBasicDetailsAttachment = dto.data.entity?.liabilityTemplateDataId['basicDetailsAttchments']
        this.isAttachmentUpload = true
        this.save()
        //this.quoteService.setQuote(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });

  }


  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }


  sortStrings(strings: { label: string, value: string }[], order: string[]): { label: string, value: string }[] {
    const orderMap = new Map(order.map((item, index) => [item, index]));
    return strings.sort((a, b) => {
      const indexA = orderMap.get(a.label);
      const indexB = orderMap.get(b.label);

      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      } else if (indexA !== undefined) {
        return -1;
      } else if (indexB !== undefined) {
        return 1;
      } else {
        return a.label.localeCompare(b.label);
      }
    });
  }
}

