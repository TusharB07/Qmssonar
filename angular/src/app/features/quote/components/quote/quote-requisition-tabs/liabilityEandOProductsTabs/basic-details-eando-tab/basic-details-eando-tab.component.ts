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
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
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
  selector: 'app-basic-details-eando-tab',
  templateUrl: './basic-details-eando-tab.component.html',
  styleUrls: ['./basic-details-eando-tab.component.scss']
})
export class BasicDetailsEandOTabComponent implements OnInit, OnChanges {
  optionsNumberOfExperience: ILov[] = []
  optionsRetroactiveCover: ILov[] = []
  quoteEndOOptions: any;
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
  deductibilitiesCount: number = 0
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false;
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  constructor(private dialogService: DialogService, private indicativePremiumCalcService: IndicativePremiumCalcService, private accountService: AccountService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityEandOTemplateService: liabilityEandOTemplateService,
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
        //this.quoteEndOOptions = this.quote?.liabilityEandOTemplateDataId;
        // if (this.quoteEndOOptions) {
        //   this.quoteEndOOptions.retroactiveDate = new Date(this.quote.riskStartDate)
        //   let liabiltyCovers = this.quoteEndOOptions.liabiltyCovers
        //   this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
        //   if (!this.quoteEndOOptions.deductibles) {
        //     this.quoteEndOOptions.deductibles = [];
        //   }
        //   this.deductibilitiesCount = this.quoteEndOOptions.deductibles.length;
        //   //deductibles Count
        //   this.quoteEndOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateEandOPremium(this.quoteEandOOptions.limitOfLiability)
        // }
      }
    })

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quoteEndOOptions = temp
        if (this.quoteEndOOptions) {
          this.quoteEndOOptions.retroactiveDate = new Date(this.quote.riskStartDate)
          let liabiltyCovers = this.quoteEndOOptions.liabiltyCovers
          this.selectedCoversCount = liabiltyCovers.filter(x => x.isSelected == true).length
          if (!this.quoteEndOOptions.liabiltyDeductibles) {
            this.quoteEndOOptions.liabiltyDeductibles = [];
          }
          this.deductibilitiesCount = this.quoteEndOOptions.liabiltyDeductibles.length;
          //deductibles Count
          this.quoteEndOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateEandOPremium(this.quoteEndOOptions.limitOfLiability)
        }
      }
    })
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEndOOptions?._id, this.selectedAttachment);
  }

  ngOnInit(): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEndOOptions?._id, this.selectedAttachment);
    this.loadNumberOfExperience()
    this.loadRetroactiveCover()
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
    let totalIndictiveQuoteAmtWithGst = Number(this.quoteEndOOptions.totalPremiumAmt * 0.18)
    this.quote.totalIndictiveQuoteAmtWithGst = totalIndictiveQuoteAmtWithGst;

    let updatePayloadQuote = this.quote;
    this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
      next: quote => {
        this.quoteEndOOptions.typeOfPolicy = 'Claims Made Basis'
        if (this.isAttachmentUpload) {
          this.quoteEndOOptions.basicDetailsAttchments = this.savedBasicDetailsAttachment
        }
        this.isAttachmentUpload = false
        this.liabilityEandOTemplateService.updateArray(this.quoteEndOOptions._id, this.quoteEndOOptions).subscribe({
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
    const ref = this.dialogService.open(LiabilityEandOAddoncoversDialogComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.quoteEndOOptions.liabiltyCovers,
        quoteEandOOptions: this.quoteEndOOptions
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.selectedCoversCount = selectedCovers
    })


  }

  loadNumberOfExperience() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_NUMBER_OF_EXPERIENCE).subscribe({
      next: records => {

        this.optionsNumberOfExperience = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadRetroactiveCover() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_RETROACTIVE_COVER).subscribe({
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
    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEndOOptions?._id, this.selectedAttachment);
  }

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEndOOptions?._id, this.attachemntTypeOther);
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
    this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsDelete(this.quoteEndOOptions._id, fileId).subscribe({
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

  downloadBasicDetailsAttachmentsDetails(fileId: string) {
    this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsDownload(this.quoteEndOOptions._id, fileId).subscribe({
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
    this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsDownload(this.quoteEndOOptions._id, fileId).subscribe({
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
        this.savedBasicDetailsAttachment = dto.data.entity?.liabilityEandOTemplateDataId['basicDetailsAttchments']
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

