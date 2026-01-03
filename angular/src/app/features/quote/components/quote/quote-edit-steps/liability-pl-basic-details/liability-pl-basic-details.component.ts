import { Component, OnInit, SimpleChanges } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { LazyLoadEvent } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedOtcTypes } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { BasicDetailsProductLiabilityAttachments, IProductLiabilityTemplate, IQuoteSlip, SubsidiaryProductDetails, liabiltyProductAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { LiabilityProductliabilityAddoncoversDialogComponent } from '../../add-on-covers-dialogs/liability-productliability-addoncovers-dialog/liability-productliability-addoncovers-dialog.component';
import { BasicDetailsProductliabilityTabComponent } from '../../quote-requisition-tabs/liabilityProductLiabilityTabs/basic-details-pl-tab/basic-details-pl-tab.component';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-liability-pl-basic-details',
  templateUrl: './liability-pl-basic-details.component.html',
  styleUrls: ['./liability-pl-basic-details.component.scss']
})
export class LiabilityProductliabilityBasicDetailsComponent implements OnInit {
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteId: string = "";
  quotePLOptions: any
  role: IRole
  AllowedRoles = AllowedRoles
  optionsTypeOfPolicy: ILov[] = []
  optionsDetailsOfProductAndUsage: ILov[] = []
  optionsRetroactiveCover: ILov[] = []
  subsidaryDetails: SubsidiaryProductDetails[] = [];
  liabiltyCovers: liabiltyProductAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  claimExperiences: IClaimExperience[] = []
  basicDetailsattachment: BasicDetailsProductLiabilityAttachments[] = []
  showEditOption = false;
  AllowedProductTemplate = AllowedProductTemplate;

  //upload and edi doc
  selectedAttachment: string = "";
  selectedAttachmentType: string = "";
  attachemntTypeOther: string = "";
  optionAttachmentTypes: any[] = [];
  uploadbasicDetailsAttachmentUrl: string;
  uploadHttpHeaders: HttpHeaders;
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false;
  private currentSelectedTemplate: Subscription;


  constructor(private wclistofmasterservice: WCListOfValueMasterService, private dialogService: DialogService, private accountService: AccountService, private quoteService: QuoteService, private claimExperienceService: ClaimExperienceService, private appService: AppService, private liabilityProductTemplateService: liabilityProductTemplateService) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
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

    this.optionAttachmentTypes = [
      { label: 'Expiring Policy Copy', value: 'Expiring Policy Copy' },
      { label: 'Proposal Form', value: 'Proposal Form' },
      { label: 'Others', value: 'Others' },
    ];

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote

        if (this.quote?.liabilityProductTemplateDataId != null && this.quote?.liabilityProductTemplateDataId["_id"] != undefined) {
          this.liabilityProductTemplateService.get(this.quote?.liabilityProductTemplateDataId["_id"]).subscribe({
            next: quoteLiablitity => {
              this.quotePLOptions = quoteLiablitity.data.entity
              this.liabiltyCovers = this.quotePLOptions.liabiltyCovers.filter(x => x.isSelected)
              this.basicDetailsattachment = this.quotePLOptions.basicDetailsAttchments;
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
            },
            error: e => {
              console.log(e);
            }
          });
        }
      }
    })


    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.LIABILITY_PRODUCT].includes(this.quote?.productId['productTemplate']) || [AllowedProductTemplate.LIABILITY_CYBER].includes(this.quote?.productId['productTemplate'])) {
          this.liabilityProductTemplateService.getTemplateById(template._id,template.quoteId).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.quotePLOptions = quoteLiablitity.data.entity
                this.liabiltyCovers = this.quotePLOptions.liabiltyCovers.filter(x => x.isSelected)
                this.basicDetailsattachment = this.quotePLOptions.basicDetailsAttchments;
                if (this.quote.otcType == AllowedOtcTypes.NONOTC) {
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






  loadTypeOfPolicy() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_TYPE_OF_POLICY).subscribe({
      next: records => {

        this.optionsTypeOfPolicy = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadRetroactiveCover() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_RETROACTIVE_COVER).subscribe({
      next: records => {

        this.optionsRetroactiveCover = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
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
      this.quoteService.refresh()
    })


  }

  editQuoteDialog() {
    this.loadQuote(this.quote._id)
    const ref1 = this.dialogService.open(BasicDetailsProductliabilityTabComponent, {
      header: "Basic Details",
      width: "50vw",
      styleClass: "customPopup"
    }).onClose.subscribe(() => {
      this.loadQuote(this.quote._id)
    })
  }

  loadQuote(quoteId) {

    this.quoteService.get(quoteId).subscribe({
      next: (dto) => {
        const quote = dto.data.entity
        this.quoteService.setQuote(quote)
      }
    })
  }

  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
        console.log(this.quote)
        this.quotePLOptions = this.quote?.liabilityCGLTemplateDataId;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.selectedAttachment);
  }

  ngOnInit(): void {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.selectedAttachment);
    this.loadTypeOfPolicy()
    //this.loadProductDetailsAndUsage()
    this.loadRetroactiveCover()
  }

  save() {
    if (this.isAttachmentUpload) {
      this.quotePLOptions.basicDetailsAttchments = this.savedBasicDetailsAttachment

    }
    this.isAttachmentUpload = false
    this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
      next: quote => {
        console.log("PL Added Successfully");
        this.quoteService.refresh(() => {
        })
      },
      error: error => {
        console.log(error);
      }
    });
    this.quoteService.refresh(() => {
    })

  }

  //edit ulpload attachment
  downloadBasicDetailsAttachmentsDetailsfile(fileId: string) {
    this.liabilityProductTemplateService.BasicDetailsAttachmentsDownload(this.quotePLOptions._id, fileId).subscribe({
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

  deleteBasicDetailsAttachmentsDetails(fileId: string) {
    this.liabilityProductTemplateService.BasicDetailsAttachmentsDelete(this.quotePLOptions._id, fileId).subscribe({
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


  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.attachemntTypeOther);
  }

  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    const result = this.searchItemInArray(this.selectedAttachment);
    this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.liabilityProductTemplateService.BasicDetailsAttachmentsUploadUrl(this.quotePLOptions?._id, this.selectedAttachment);
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
