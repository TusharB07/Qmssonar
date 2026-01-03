import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { BasicDetailsEandOAttachments, IQuoteSlip, SubsidiaryEandODetails, liabiltyEandOAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { LiabilityEandOAddoncoversDialogComponent } from '../../add-on-covers-dialogs/liability-eando-addoncovers-dialog/liability-eando-addoncovers-dialog.component';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { HttpHeaders } from '@angular/common/http';
import { IUser } from 'src/app/features/admin/user/user.model';
import { FileUpload } from 'primeng/fileupload';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';

@Component({
  selector: 'app-eando-liability-basic-details',
  templateUrl: './eando-liability-basic-details.component.html',
  styleUrls: ['./eando-liability-basic-details.component.scss']
})
export class LiabilityEandOBasicDetailsComponent implements OnInit {
  @Input() templateId: string;
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteId: string = "";
  quoteEandOOptions: any
  role: IRole
  AllowedRoles = AllowedRoles
  subsidaryDetails: SubsidiaryEandODetails[] = [];
  liabiltyCovers: liabiltyEandOAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  claimExperiences: IClaimExperience[] = []
  basicDetailsattachment: BasicDetailsEandOAttachments[] = []
  showEditOption = false;
  optionsNumberOfExperience: ILov[] = []
  optionsRetroactiveCover: ILov[] = []
  selectedAttachment: string = "";
  selectedAttachmentType: string = "";
  attachemntTypeOther: string = "";
  optionAttachmentTypes: any[] = [];
  uploadbasicDetailsAttachmentUrl: string;
  uploadHttpHeaders: HttpHeaders;
  deductibilitiesCount: number = 0
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false;
  private currentSelectedTemplate: Subscription;
  AllowedProductTemplate = AllowedProductTemplate;

  constructor(private dialogService: DialogService, private wclistofmasterservice: WCListOfValueMasterService, private accountService: AccountService, private quoteService: QuoteService, private claimExperienceService: ClaimExperienceService, private appService: AppService, private liabilityEandOTemplateService: liabilityEandOTemplateService) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.optionAttachmentTypes = [
      { label: 'Expiring Policy Copy', value: 'Expiring Policy Copy' },
      { label: 'Proposal Form', value: 'Proposal Form' },
      { label: 'Others', value: 'Others' },
    ];

    // * DO NOT TOUCH
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_RM == role?.name) {
          this.showEditOption = false;
        }
        else {
          this.showEditOption = true;
        }
      }
    });
    // this.loadNumberOfExperience()
    // this.loadRetroactiveCover()

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        if (this.quote?.liabilityEandOTemplateDataId != null && this.quote?.liabilityEandOTemplateDataId["_id"] != undefined) {
          this.liabilityEandOTemplateService.getTemplateById(this.quote?.liabilityEandOTemplateDataId["_id"], this.quote?.liabilityEandOTemplateDataId["quoteId"]).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.quoteEandOOptions = quoteLiablitity.data.entity;
                this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers;
                this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected);
                this.basicDetailsattachment = this.quoteEandOOptions.basicDetailsAttchments;
                if (this.quote.otcType == AllowedOtcTypes.NONOTC) //remove praposal attachment if not otc
                {
                  let removedPraposalForm = this.basicDetailsattachment.filter(item => item.attachmentSubType !== "Proposal Form");
                  this.basicDetailsattachment = removedPraposalForm
                }
                this.liabiltyCovers.forEach(element => {
                  if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                    element.optionSelected = 'N/A'
                  }
                  if (element.description == '' || element.description == null || element.description == undefined) {
                    element.description = 'N/A'
                  }
                });
              }
            },
            error: error => {
              console.log(error);
            }
          });
        }
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.LIABILITY_EANDO].includes(this.quote?.productId['productTemplate'])) {
          this.liabilityEandOTemplateService.get(template._id).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.quoteEandOOptions = quoteLiablitity.data.entity
                this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers;
                this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected);
                this.basicDetailsattachment = this.quoteEandOOptions.basicDetailsAttchments;
                if (this.quote.otcType == AllowedOtcTypes.NONOTC) //remove praposal attachment if not otc
                {
                  let removedPraposalForm = this.basicDetailsattachment.filter(item => item.attachmentSubType !== "Proposal Form");
                  this.basicDetailsattachment = removedPraposalForm
                }
                this.liabiltyCovers.forEach(element => {
                  if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                    element.optionSelected = 'N/A'
                  }
                  if (element.description == '' || element.description == null || element.description == undefined) {
                    element.description = 'N/A'
                  }
                });
              }
            },
            error: error => {
              console.log(error);
            }
          });
        }
      }
    })
  }

  // async loadQuoteOption(templateId: string) {
  //   this.liabilityEandOTemplateService.get(templateId).subscribe({
  //     next: quoteLiablitity => {
  //       this.quoteEandOOptions = quoteLiablitity.data.entity
  //       this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers;
  //       this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected);
  //       this.basicDetailsattachment = this.quoteEandOOptions.basicDetailsAttchments;
  //       if (this.quote.otcType == AllowedOtcTypes.NONOTC) //remove praposal attachment if not otc
  //       {
  //         let removedPraposalForm = this.basicDetailsattachment.filter(item => item.attachmentSubType !== "Proposal Form");
  //         this.basicDetailsattachment = removedPraposalForm
  //       }
  //       this.liabiltyCovers.forEach(element => {
  //         if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
  //           element.optionSelected = 'N/A'
  //         }
  //         if (element.description == '' || element.description == null || element.description == undefined) {
  //           element.description = 'N/A'
  //         }

  //       });

  //     },

  //     error: error => {
  //       console.log(error);
  //     }
  //   });
  // }

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

  openFlexaCoversDialog() {
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
      this.quoteService.refresh();
    })


  }

  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
        console.log(this.quote)
        this.quoteEandOOptions = this.quote?.liabilityTemplateDataId;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEandOOptions?._id, this.selectedAttachment);
  }

  ngOnInit(): void {

    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEandOOptions?._id, this.selectedAttachment);
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
    // let totalIndictiveQuoteAmtWithGst = Number(this.quoteEandOOptions.totalPremiumAmt * 0.18)
    // this.quoteService.update(this.quote._id, { totalIndictiveQuoteAmtWithGst: +totalIndictiveQuoteAmtWithGst }).subscribe({
    //   next: (dto: IOneResponseDto<IQuoteSlip>) => {
    if (this.isAttachmentUpload) {
      this.quoteEandOOptions.basicDetailsAttchments = this.savedBasicDetailsAttachment
    }
    this.isAttachmentUpload = false
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
    // console.log(this.quote)
    // },
    // error: e => {
    //   console.log(e);
    // }
    //});
  }
  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    // const result = this.searchItemInArray(this.selectedAttachment);
    // this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEandOOptions?._id, this.selectedAttachment);
  }

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsUploadUrl(this.quoteEandOOptions?._id, this.attachemntTypeOther);
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
    this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsDelete(this.quoteEandOOptions._id, fileId).subscribe({
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
    this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsDownload(this.quoteEandOOptions._id, fileId).subscribe({
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
    this.liabilityEandOTemplateService.BasicDetailsEandOAttachmentsDownload(this.quoteEandOOptions._id, fileId).subscribe({
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
