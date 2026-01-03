import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedQuoteStates, EandOTemplate, IEandOTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { LiabilityEandOAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-eando-addoncovers-dialog/liability-eando-addoncovers-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { IUser } from 'src/app/features/admin/user/user.model';
import { HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { LiabilityCGLAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-cgl-addoncovers-dialog/liability-cgl-addoncovers-dialog.component';
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
  selector: 'app-basic-details-cgl-tab',
  templateUrl: './basic-details-cgl-tab.component.html',
  styleUrls: ['./basic-details-cgl-tab.component.scss']
})
export class BasicDetailsCGLTabComponent implements OnInit, OnChanges {
  optionsTypeOfPolicy: ILov[] = []
  optionsRetroactiveCover: ILov[] = []
  optionsDetailsOfProductAndUsage: ILov[] = []
  quoteCGLOptions: any;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedCoversCount: number = 0
  selectedAttachment: string = "";
  listOfLocationsInput: string = ""
  selectedAttachmentType: string = "";
  attachemntTypeOther: string = "";
  optionAttachmentTypes: any[] = [];
  uploadbasicDetailsAttachmentUrl: string;
  uploadHttpHeaders: HttpHeaders;
  currentUser$: Observable<IUser>;
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false;
  isOccuranceFormSelected: boolean = true;
  templateName: string = ""
  optionsAoaAoy: ILov[] = []
  limitOfLiabilityAOAAOY: number = 0
  inTheAggregateAOAAOY: number = 0
  anyOneAccidentAOAAOY: number = 0
  deductibilitiesCount: number = 0;

  uploadListOfLocationsAttachmentUrl: string;
  savedListOfLocationsAttachment: any[] = []
  isAttachmentListOfLocationsUpload: boolean = false;
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private accountService: AccountService, private indicativePremiumCalcService: IndicativePremiumCalcService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityCGLTemplateService: liabilityCGLTemplateService,
  ) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.currentUser$ = this.accountService.currentUser$
    this.optionAttachmentTypes = [
      { label: 'Expiring Policy Copy', value: 'Expiring Policy Copy' },
      { label: 'Proposal Form', value: 'Proposal Form' },
      { label: 'Others', value: 'Others' },
    ];
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
        // this.quoteCGLOptions = this.quote?.liabilityCGLTemplateDataId;
        // if (this.quoteCGLOptions) {
        //   this.quoteCGLOptions.retroactiveDate = new Date(this.quote.riskStartDate)
        //   let liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
        //   this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        //   this.liabilityCGLTemplateService.get(this.quote?.liabilityCGLTemplateDataId["_id"]).subscribe({
        //     next: quoteLiablitity => {
        //       if (this.quoteCGLOptions?.aoaAoyId) {
        //         if (quoteLiablitity.data.entity?.aoaAoyId['lovKey'] == "1:3") {
        //           if (this.quote?.selectedCurrency == '$ Dollar') {
        //             this.limitOfLiabilityAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
        //             this.inTheAggregateAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
        //             this.anyOneAccidentAOAAOY = (this.quoteCGLOptions.limitOfLiability / 3) / this.quote.dollarRate;
        //             this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
        //             this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
        //           }
        //           else {
        //             this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
        //             this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
        //           }
        //         }
        //         else {
        //           if (this.quote?.selectedCurrency == '$ Dollar') {
        //             this.limitOfLiabilityAOAAOY = 0;
        //             this.inTheAggregateAOAAOY = 0;
        //             this.anyOneAccidentAOAAOY = 0;
        //             this.quoteCGLOptions.inTheAggregate = 0
        //             this.quoteCGLOptions.anyOneAccident = 0
        //           }
        //           else {
        //             this.quoteCGLOptions.inTheAggregate = 0
        //             this.quoteCGLOptions.anyOneAccident = 0
        //           }
        //         }
        //       }
        //     }
        //   });
        //   this.deductibilitiesCount = 0;
        //   if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
        //     this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.quoteCGLOptions.limitOfLiability)
        //     this.deductibilitiesCount = this.quoteCGLOptions.deductibles.length;
        //   }
        //   else {
        //     this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculatePublicLiabilityPremium(this.quoteCGLOptions.limitOfLiability)
        //   }
        // }
      }
    })

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quoteCGLOptions = template;
        if (this.quoteCGLOptions) {
          this.savedBasicDetailsAttachment = this.quoteCGLOptions.basicDetailsAttchments
          this.quoteCGLOptions.retroactiveDate = new Date(this.quote.riskStartDate)
          let liabiltyCovers = this.quoteCGLOptions.liabiltyCovers
          this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
          // this.liabilityCGLTemplateService.get(template._id).subscribe({
          //   next: quoteLiablitity => {
          //     if (this.quoteCGLOptions?.aoaAoyId) {
          //       if (quoteLiablitity.data.entity?.aoaAoyId['lovKey'] == "1:3") {
          //         if (this.quote?.selectedCurrency == '$ Dollar') {
          //           this.limitOfLiabilityAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
          //           this.inTheAggregateAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
          //           this.anyOneAccidentAOAAOY = (this.quoteCGLOptions.limitOfLiability / 3) / this.quote.dollarRate;
          //           this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
          //           this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
          //         }
          //         else {
          //           this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
          //           this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
          //         }
          //       }
          //       else {
          //         if (this.quote?.selectedCurrency == '$ Dollar') {
          //           this.limitOfLiabilityAOAAOY = 0;
          //           this.inTheAggregateAOAAOY = 0;
          //           this.anyOneAccidentAOAAOY = 0;
          //           this.quoteCGLOptions.inTheAggregate = 0
          //           this.quoteCGLOptions.anyOneAccident = 0
          //         }
          //         else {
          //           this.quoteCGLOptions.inTheAggregate = 0
          //           this.quoteCGLOptions.anyOneAccident = 0
          //         }
          //       }
          //     }
          //   }
          // });
          this.deductibilitiesCount = 0;
          if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
            this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.quoteCGLOptions.limitOfLiability)
            this.deductibilitiesCount = this.quoteCGLOptions.liabiltyDeductibles.length;
          }
          else {
            this.quoteCGLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculatePublicLiabilityPremium(this.quoteCGLOptions.limitOfLiability)
          }
        }
      }
    })

  }


  ngOnChanges(changes: SimpleChanges): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityCGLTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteCGLOptions?._id, this.selectedAttachment);
    this.uploadListOfLocationsAttachmentUrl = this.liabilityCGLTemplateService.ListOfLocationsAttachmentsUploadUrl(this.quoteCGLOptions?._id, this.listOfLocationsInput);
  }

  ngOnInit(): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityCGLTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteCGLOptions?._id, this.selectedAttachment);
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL) {
      this.loadPolicyTypes()
    }
    else {
      this.loadAoaAoy()
    }
    this.loadRetroactiveCover()
  }

  loadAoaAoy() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.PUBLIC_LIABILITY_AOA_AOY).subscribe({
      next: records => {

        this.optionsAoaAoy = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        var aoi = this.optionsAoaAoy.filter(x => x.value == this.quoteCGLOptions.aoaAoyId)[0]
        if (aoi.label == "1:3") {
          if (this.quote?.selectedCurrency == '$ Dollar') {
            this.limitOfLiabilityAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
            this.inTheAggregateAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
            this.anyOneAccidentAOAAOY = (this.quoteCGLOptions.limitOfLiability / 3) / this.quote.dollarRate;
            this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
            this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
          }
          else {
            this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
            this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
          }
        }
        else {
          if (this.quote?.selectedCurrency == '$ Dollar') {
            this.limitOfLiabilityAOAAOY = 0;
            this.inTheAggregateAOAAOY = 0;
            this.anyOneAccidentAOAAOY = 0;
            this.quoteCGLOptions.inTheAggregate = 0
            this.quoteCGLOptions.anyOneAccident = 0
          }
          else {
            this.quoteCGLOptions.inTheAggregate = 0
            this.quoteCGLOptions.anyOneAccident = 0
          }
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

  onDropdownAOAChange(event: any) {
    var aoi = this.optionsAoaAoy.filter(x => x.value == event.value)[0]
    if (aoi.label == "1:3") {
      if (this.quote?.selectedCurrency == '$ Dollar') {
        this.limitOfLiabilityAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
        this.inTheAggregateAOAAOY = this.quoteCGLOptions.limitOfLiability / this.quote.dollarRate;
        this.anyOneAccidentAOAAOY = (this.quoteCGLOptions.limitOfLiability / 3) / this.quote.dollarRate;
        this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
        this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
      }
      else {
        this.quoteCGLOptions.inTheAggregate = this.quoteCGLOptions.limitOfLiability
        this.quoteCGLOptions.anyOneAccident = this.quoteCGLOptions.limitOfLiability / 3
      }
    }
    else {
      if (this.quote?.selectedCurrency == '$ Dollar') {
        this.limitOfLiabilityAOAAOY = 0;
        this.inTheAggregateAOAAOY = 0;
        this.anyOneAccidentAOAAOY = 0;
        this.quoteCGLOptions.inTheAggregate = 0
        this.quoteCGLOptions.anyOneAccident = 0
      }
      else {
        this.quoteCGLOptions.inTheAggregate = 0
        this.quoteCGLOptions.anyOneAccident = 0
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




  checkIfListOfLocationsFileUploadVisible(): boolean {
    if (this.listOfLocationsInput != undefined && this.listOfLocationsInput != null && this.listOfLocationsInput != '') {
      return true;
    }
    else {
      return false;
    }
  }

  onTypeOfPolicyChange() {
    if (this.quoteCGLOptions.typeOfPolicyId != null || this.quoteCGLOptions.typeOfPolicyId != "") {
      var selectedPolicyType = this.optionsTypeOfPolicy.find(a => a.value == this.quoteCGLOptions.typeOfPolicyId).label;
      if (selectedPolicyType != null || selectedPolicyType != "") {
        if (selectedPolicyType.includes('Commercial General Liability - Occurrence FORM')) {
          this.isOccuranceFormSelected = false;
        }
        else {
          this.isOccuranceFormSelected = true;
        }

      }
      else {
        this.isOccuranceFormSelected = true;
      }
    }
    else {
      this.isOccuranceFormSelected = true;
    }
  }





  save() {

    //Public
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC) {
      this.quoteCGLOptions.typeOfPolicy = "Occurrence form only";
      this.quoteCGLOptions.jurasdiction = 'India only'
      this.quoteCGLOptions.territory = 'India only'
    }
    if (!this.isOccuranceFormSelected) {
      this.quoteCGLOptions.retroactiveCoverId = null;
    }
    //this.quote.quoteState = AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE

    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
        if (this.isAttachmentUpload) {
          this.quoteCGLOptions.basicDetailsAttchments = this.savedBasicDetailsAttachment

        }
        if (this.isAttachmentListOfLocationsUpload) {
          this.quoteCGLOptions.listOfLocations = this.savedListOfLocationsAttachment
        }
        this.isAttachmentUpload = false
        this.isAttachmentListOfLocationsUpload = false
        this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
          next: quote => {
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



  loadPolicyTypes() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_TYPE_OF_POLICY).subscribe({
      next: records => {

        this.optionsTypeOfPolicy = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        if (this.quoteCGLOptions.typeOfPolicyId != null || this.quoteCGLOptions.typeOfPolicyId != "") {
          var selectedPolicyType = this.optionsTypeOfPolicy.find(a => a.value == this.quoteCGLOptions.typeOfPolicyId).label;
          if (selectedPolicyType != null || selectedPolicyType != "") {
            if (selectedPolicyType.includes('Commercial General Liability - Occurrence FORM')) {
              this.isOccuranceFormSelected = false;
            }
            else {
              this.isOccuranceFormSelected = true;
            }

          }
          else {
            this.isOccuranceFormSelected = true;
          }
        }
        else {
          this.isOccuranceFormSelected = true;
        }

      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadRetroactiveCover() {
    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_CGL || this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_PUBLIC)
      ? WCAllowedListOfValuesMasters.CGL_RETROACTIVE_COVER
      : WCAllowedListOfValuesMasters.PUBLIC_RETROACTIVE_COVER).subscribe({
        next: records => {

          this.optionsRetroactiveCover = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        },
        error: e => {
          console.log(e);
        }
      });
  }
  // loadDetailsOfProduct() {
  //   this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_DETAILS_OF_PRODUCT_AND_USAGE).subscribe({
  //     next: records => {

  //       this.optionsDetailsOfProductAndUsage = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
  //     },
  //     error: e => {
  //       console.log(e);
  //     }
  //   });
  // }

  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    // const result = this.searchItemInArray(this.selectedAttachment);
    // this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.liabilityCGLTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteCGLOptions?._id, this.selectedAttachment);
  }

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityCGLTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteCGLOptions?._id, this.attachemntTypeOther);
  }

  onListOfLocationsFocusOut() {
    this.uploadListOfLocationsAttachmentUrl = this.liabilityCGLTemplateService.ListOfLocationsAttachmentsUploadUrl(this.quoteCGLOptions?._id, this.listOfLocationsInput);
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
    this.liabilityCGLTemplateService.BasicDetailsAttachmentsDelete(this.quoteCGLOptions._id, fileId).subscribe({
      next: () => {
        this.quoteService.get(this.quote._id).subscribe({
          next: (dto: IOneResponseDto<IQuoteSlip>) => {
            // console.log(dto.data.entity)
            this.quoteService.setQuote(dto.data.entity)
            this.savedBasicDetailsAttachment = dto.data.entity?.liabilityCGLTemplateDataId['basicDetailsAttchments']
          },
          error: e => {
            console.log(e);
          }
        });
      }
    })
  }

  downloadBasicDetailsAttachmentsDetails(fileId: string) {
    this.liabilityCGLTemplateService.BasicDetailsAttachmentsDownload(this.quoteCGLOptions._id, fileId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Basic Details';
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
    this.liabilityCGLTemplateService.BasicDetailsAttachmentsDownload(this.quoteCGLOptions._id, fileId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Basic Details';

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
        this.savedBasicDetailsAttachment = dto.data.entity?.liabilityCGLTemplateDataId['basicDetailsAttchments']
        this.isAttachmentUpload = true

        this.save()
        //this.quoteService.setQuote(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });
  }


  onUploadListOfLocationsAttachmentUpload() {

    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quoteCGLOptions = dto.data.entity?.liabilityCGLTemplateDataId
        this.isAttachmentListOfLocationsUpload = true
        this.save()
      },
      error: e => {
        console.log(e);
      }
    });
  }


  downloadListOfLocationsAttachmentsDetailsfile(fileId: string) {
    this.liabilityCGLTemplateService.ListOfLocationsAttachmentsDownload(this.quoteCGLOptions._id, fileId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Basic Details';

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


  deleteListOfLocationAttachmentsDetails(fileId: string) {
    this.liabilityCGLTemplateService.ListOfLocationsAttachmentsDelete(this.quoteCGLOptions._id, fileId).subscribe({
      next: (response: any) => {
        this.quoteCGLOptions = response.data.entity
      },
      error: e => {
        console.log(e);
      }
    });

  }

  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }

}

