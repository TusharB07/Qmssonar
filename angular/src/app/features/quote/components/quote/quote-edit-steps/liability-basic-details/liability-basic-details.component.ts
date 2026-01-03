import { Component, OnInit } from '@angular/core';
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
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { BasicDetailsAttachments, EmployeesDetails, IDANDOTemplate, IQuoteSlip, SubsidiaryDetails, liabiltyAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { BasicDetailsTabComponent } from '../../quote-requisition-tabs/liabilityproducttabs/basic-details-tab/basic-details-tab.component';
import { LiabilityAddoncoversDialogComponent } from '../../add-on-covers-dialogs/liability-addoncovers-dialog/liability-addoncovers-dialog.component';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { HttpHeaders } from '@angular/common/http';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-liability-basic-details',
  templateUrl: './liability-basic-details.component.html',
  styleUrls: ['./liability-basic-details.component.scss']
})
export class LiabilityBasicDetailsComponent implements OnInit {
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteId: string = "";
  quoteDandOOptions: any
  role: IRole
  AllowedRoles = AllowedRoles
  optionsTypeOfPolicy: ILov[] = []
  //optionsNatureOfBusiness: ILov[] = []
  optionsAgeOfCompany: ILov[] = []
  optionAttachmentTypes: any[] = [];
  cgloptionAttachmentTypes: any[] = [];
  optionsRetroactiveCover: ILov[] = []
  optionsAoaAoy: ILov[] = []
  attachemntTypeOther: string = "";
  uploadbasicDetailsAttachmentUrl: string;
  selectedAttachmentType: string = "";
  selectedAttachment: string = "";
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false
  subsidaryDetails: SubsidiaryDetails[] = [];
  liabiltyCovers: liabiltyAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  uploadHttpHeaders: HttpHeaders;
  claimExperiences: IClaimExperience[] = []
  basicDetailsattachment: BasicDetailsAttachments[] = []
  limitOfLiabilityAOAAOY: number = 0
  inTheAggregateAOAAOY: number = 0
  anyOneAccidentAOAAOY: number = 0
  showEditOption = false;
  AllowedProductTemplate = AllowedProductTemplate;
  employeesDetails: EmployeesDetails[] = []
  private currentSelectedTemplate: Subscription;
  constructor(private wclistofmasterservice: WCListOfValueMasterService, private dialogService: DialogService, private accountService: AccountService, private quoteService: QuoteService, private claimExperienceService: ClaimExperienceService, private appService: AppService, private liabilityTemplateService: liabilityTemplateService) {
    // * DO NOT TOUCH
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.cgloptionAttachmentTypes = [
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



    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
      }
    })


    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.LIABILITY].includes(this.quote?.productId['productTemplate']) || [AllowedProductTemplate.LIABILITY_CRIME].includes(this.quote?.productId['productTemplate'])) {
          this.liabilityTemplateService.getTemplateById(template._id,template.quoteId).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.quoteDandOOptions = quoteLiablitity.data.entity
                this.liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
                this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected);
                this.basicDetailsattachment = this.quoteDandOOptions.basicDetailsAttchments;
                if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME) {
                  this.employeesDetails = this.quoteDandOOptions.employeesDetails
                }
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


  async getTemplate() {
    this.liabilityTemplateService.get(this.quote?.liabilityTemplateDataId["_id"]).subscribe({
      next: quoteLiablitity => {
        this.quoteDandOOptions = quoteLiablitity.data.entity
        this.liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
        this.basicDetailsattachment = this.quoteDandOOptions.basicDetailsAttchments;
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
      },
      error: error => {
        console.log(error);
      }

    });
  }


  loadAgeOfCompany() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_AGE_OF_COMPANY).subscribe({
      next: records => {

        this.optionsAgeOfCompany = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        //this.loadRetroactiveCover()
      },
      error: e => {
        console.log(e);
      }
    });
  }
  loadTypeOfPolicy() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_TYPE_OF_POLICY).subscribe({
      next: records => {

        this.optionsTypeOfPolicy = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        //this.loadAgeOfCompany()

      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadRetroactiveCover() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_RETROACTIVE_COVER).subscribe({
      next: records => {

        this.optionsRetroactiveCover = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        //this.loadAoaAoy()
      },
      error: e => {
        console.log(e);
      }
    });
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
      this.quoteService.refresh()
    })


  }

  loadAoaAoy() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_AOA_AOY).subscribe({
      next: records => {
        this.loadQuote(this.quote._id);
        this.optionsAoaAoy = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        var aoi = this.optionsAoaAoy.filter(x => x.value == this.quoteDandOOptions.aoaAoyId)[0]
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
      },
      error: e => {
        console.log(e);
      }
    });
  }

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.liabilityTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteDandOOptions?._id, this.attachemntTypeOther);
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

  editQuoteDialog() {
    this.loadQuote(this.quote._id)
    const ref1 = this.dialogService.open(BasicDetailsTabComponent, {
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
        this.quoteDandOOptions = this.quote?.liabilityTemplateDataId;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  async ngOnInit() {
    this.loadTypeOfPolicy()
    this.loadAgeOfCompany()
    this.loadRetroactiveCover()
    this.loadAoaAoy()
    //await this.getTemplate()
  }

  save() {

    let totalIndictiveQuoteAmtWithGst = Number(this.quoteDandOOptions.totalPremiumAmt * 0.18)
    this.quoteService.update(this.quote._id, { totalIndictiveQuoteAmtWithGst: totalIndictiveQuoteAmtWithGst }).subscribe({
      next: quote => {
        if (this.isAttachmentUpload) {
          this.quoteDandOOptions.basicDetailsAttchments = this.savedBasicDetailsAttachment
        }
        this.isAttachmentUpload = false
        this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
          next: quote => {
            console.log("Added Successfully");
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
    });
  }

  //Edit File Upload
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

  deleteBasicDetailsAttachmentsDetails(fileId: string) {
    this.liabilityTemplateService.BasicDetailsAttachmentsDelete(this.quoteDandOOptions._id, fileId).subscribe({
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

  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    // const result = this.searchItemInArray(this.selectedAttachment);
    // this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.liabilityTemplateService.BasicDetailsAttachmentsUploadUrl(this.quoteDandOOptions?._id, this.selectedAttachment);
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

}
