import { HttpHeaders } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { LiabilityProductliabilityAddoncoversDialogComponent } from '../../../add-on-covers-dialogs/liability-productliability-addoncovers-dialog/liability-productliability-addoncovers-dialog.component';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { FileUpload } from 'primeng/fileupload';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';

@Component({
  selector: 'app-basic-details-pl-tab',
  templateUrl: './basic-details-pl-tab.component.html',
  styleUrls: ['./basic-details-pl-tab.component.scss']
})
export class BasicDetailsProductliabilityTabComponent implements OnInit, OnChanges {

  optionsTypeOfPolicy: ILov[] = []
  optionsRetroactiveCover: ILov[] = []
  optionsDetailsOfProductAndUsage: ILov[] = []
  quotePLOptions: any;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  selectedCoversCount: number = 0
  selectedAttachment: string = "";
  selectedAttachmentType: string = "";
  attachemntTypeOther: string = "";
  optionAttachmentTypes: any[] = [];
  uploadbasicDetailsAttachmentUrl: string;
  uploadHttpHeaders: HttpHeaders;
  currentUser$: Observable<IUser>;
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false;
  deductibilitiesCount: number = 0;
  optionsNumberOfExperience: ILov[] = [] //Cyber
  templateName: string = ""
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private accountService: AccountService, private indicativePremiumCalcService: IndicativePremiumCalcService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityProductTemplateService: liabilityProductTemplateService,
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
        // this.quotePLOptions = this.quote?.liabilityProductTemplateDataId;
        // if (this.quotePLOptions) {
        //   this.quotePLOptions.retroactiveDate = new Date(this.quote.riskStartDate)
        //   let liabiltyCovers = this.quotePLOptions.liabiltyCovers;
        //   this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        //   this.deductibilitiesCount = 0;
        //   this.deductibilitiesCount = this.quotePLOptions.deductibles.length;
        //   if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT) {
        //     this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateProductLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityProduct)
        //   }
        //   else {
        //     //CYBER
        //     this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCyberLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityProduct)
        //   }
        // }
      }

    })


    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quotePLOptions = temp;
        if (this.quotePLOptions) {
          if (this.quote) {
            this.savedBasicDetailsAttachment = this.quotePLOptions.basicDetailsAttchments;
            this.quotePLOptions.retroactiveDate = new Date(this.quote.riskStartDate);
            if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT) {
              this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateProductLiabilityPremium(this.quotePLOptions.limitOfLiability)
            }
            else {
              //CYBER
              this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCyberLiabilityPremium(this.quotePLOptions.limitOfLiability)
            }
          }
          let liabiltyCovers = this.quotePLOptions.liabiltyCovers;
          this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
          this.deductibilitiesCount = 0;
          this.deductibilitiesCount = this.quotePLOptions.liabiltyDeductibles.length;
        }
      }
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.selectedAttachment);
  }

  ngOnInit(): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.selectedAttachment);
    this.loadPolicyTypes()
    this.loadRetroactiveCover()
    if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CYBER) {

      this.loadNumberOfExperience()
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

  save() {
    //this.quote.quoteState = AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE
    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
        if (this.isAttachmentUpload) {
          this.quotePLOptions.basicDetailsAttchments = this.savedBasicDetailsAttachment

        }
        this.isAttachmentUpload = false
        this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
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
    const ref = this.dialogService.open(LiabilityProductliabilityAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quotePLOptions.liabiltyCovers,
        quotePLOptions: this.quotePLOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
      this.quoteService.refresh();
    })


  }

  loadPolicyTypes() {
    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_PRODUCT)
      ? WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_TYPE_OF_POLICY
      : WCAllowedListOfValuesMasters.CYBER_LIABILITY_TYPE_OF_POLICY).subscribe({
        next: records => {

          this.optionsTypeOfPolicy = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        },
        error: e => {
          console.log(e);
        }
      });
  }

  loadRetroactiveCover() {
    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_PRODUCT)
      ? WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_RETROACTIVE_COVER
      : WCAllowedListOfValuesMasters.CYBER_LIABILITY_RETROACTIVE_COVER).subscribe({
        next: records => {

          this.optionsRetroactiveCover = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        },
        error: e => {
          console.log(e);
        }
      });
  }

  //Only for cyber
  loadNumberOfExperience() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CYBER_LIABILITY_NUMBER_OF_EXPERIENCE).subscribe({
      next: records => {

        this.optionsNumberOfExperience = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  //Edit And Upload Attachment
  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    // const result = this.searchItemInArray(this.selectedAttachment);
    // this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.selectedAttachment);
  }

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.attachemntTypeOther);
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
    this.liabilityProductTemplateService.BasicDetailsAttachmentsDelete(this.quotePLOptions._id, fileId).subscribe({
      next: (response: any) => {
        this.savedBasicDetailsAttachment = response.data.entity?.basicDetailsAttchments;
      }
    })
  }

  downloadBasicDetailsAttachmentsDetails(fileId: string) {
    this.liabilityProductTemplateService.BasicDetailsAttachmentsDownload(this.quotePLOptions._id, fileId).subscribe({
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
    this.liabilityProductTemplateService.BasicDetailsAttachmentsDownload(this.quotePLOptions._id, fileId).subscribe({
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
        this.savedBasicDetailsAttachment = dto.data.entity?.liabilityProductTemplateDataId['basicDetailsAttchments']
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

}

