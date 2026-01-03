import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AllowedGMCPARENTabsTypes } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { BasicDetailsAttachments, IQuoteSlip, liabiltyAddOnCovers, WCRatesData } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
import { QcrHeaders, QCRQuestionAnswer, QcrAnswers } from 'src/app/features/quote/pages/quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import { GmcDescriptionDialogComponent } from '../../../gmc-description-dialog/gmc-description-dialog.component';
import { DatePipe } from '@angular/common';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/features/account/account.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { FileUpload } from 'primeng/fileupload';
import { LiabilityWorkmenAdOnCoverComponent } from '../../add-on-covers-dialogs/liability-workmen-addoncovers-dialog/liability-workmen-addoncovers-dialog.component';
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
  selector: 'app-wc-employee-details',
  templateUrl: './wc-employee-details.component.html',
  styleUrls: ['./wc-employee-details.component.scss']
})
export class WcEmployeeDetailsComponent implements OnInit {
  xpanded = false;

  private currentQuote: Subscription;
  quoteId: string = "";
  wcTemplateModel: any
  wcRatesInfo: WCRatesData[] = []
  safetyMeasuresInfo: any[] = []
  optionAttachmentTypes: any[] = [];

  showEditOption = false;
  @Input() permissions: PermissionType[] = []

  quote: IQuoteSlip;

  products: any[]
  private currentSelectedTemplate: Subscription;
  uploadHttpHeaders: HttpHeaders;
  isNamed: boolean = true;
  liabiltyCovers: liabiltyAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  basicDetailsattachment: BasicDetailsAttachments[] = []
  attachemntTypeOther: string = "";
  uploadbasicDetailsAttachmentUrl: string;
  selectedAttachmentType: string = "";
  selectedAttachment: string = "";
  savedBasicDetailsAttachment: any[] = []
  isAttachmentUpload: boolean = false
  constructor(private quoteService: QuoteService, private dialogService: DialogService, private appService: AppService, private accountService: AccountService, private quoteWcTemplateService: QuoteWcTemplateService) {

    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.optionAttachmentTypes = [
      { label: 'Expiring Policy Copy', value: 'Expiring Policy Copy' },
      { label: 'Proposal Form', value: 'Proposal Form' },
      { label: 'Others', value: 'Others' },
    ];
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        this.showEditOption = role?.name !== AllowedRoles.INSURER_RM;
      }
    });

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
        this.quote = quote
        this.quoteId = this.quote._id;
        this.wcTemplateModel = this.quote?.wcTemplateDataId;
        if (this.wcTemplateModel) {
          this.liabiltyCovers = this.wcTemplateModel.liabiltyCovers
          this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected);
          this.basicDetailsattachment = this.wcTemplateModel.basicDetailsAttchments;
          if (this.wcTemplateModel.tableType === 'Unnamed') {
            this.isNamed = false;
          }
          if (this.wcTemplateModel.safetyMeasures) {
            this.safetyMeasuresInfo = [];

            this.safetyMeasuresInfo.push(this.wcTemplateModel.safetyMeasures);
          }
          else {
            this.safetyMeasuresInfo = [];
          }

          if (this.wcTemplateModel.wcDetails.length == 0) {
            this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
            this.wcRatesInfo = this.wcTemplateModel.wcDetails
          }
          else {
            this.wcRatesInfo = this.wcTemplateModel.wcDetails
          }
        }

      }
    });

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.WORKMENSCOMPENSATION].includes(this.quote?.productId['productTemplate'])) {
          this.quoteWcTemplateService.getTemplateById(template._id, template.quoteId).subscribe({
            next: quoteLiablitity => {
              if (quoteLiablitity) {
                this.wcTemplateModel = quoteLiablitity.data.entity
                if (this.wcTemplateModel) {
                  this.liabiltyCovers = this.wcTemplateModel.liabiltyCovers
                  this.liabiltyCovers = this.liabiltyCovers.filter(x => x.isSelected);
                  this.basicDetailsattachment = this.wcTemplateModel.basicDetailsAttchments;
                  if (this.wcTemplateModel.safetyMeasures) {
                    this.safetyMeasuresInfo = [];
                    this.safetyMeasuresInfo.push(this.wcTemplateModel.safetyMeasures);
                  }
                  else {
                    this.safetyMeasuresInfo = [];
                  }
                  if (this.wcTemplateModel.wcDetails.length == 0) {
                    this.wcTemplateModel.wcDetails = quoteLiablitity["wcRatesData"]
                    this.isNamed = quoteLiablitity['tableType'] !== 'Unnamed';
                    // this.wcDetails = this.wcTemplateModel.wcDetails
                  }
                  else {
                    this.wcRatesInfo = this.wcTemplateModel.wcDetails
                    this.isNamed = this.wcTemplateModel['tableType'] !== 'Unnamed';
                  }
                }
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

  openFlexaCoversDialog() {
    const ref = this.dialogService.open(LiabilityWorkmenAdOnCoverComponent, {
      header: "Add-on Covers",
      width: '70%',
      styleClass: 'customPopup',
      closable: false,
      closeOnEscape: false,
      data: {
        quote: this.quote,
        covers: this.wcTemplateModel.liabiltyCovers,
        quoteWCoption: this.wcTemplateModel
      }
    }).onClose.subscribe((selectedCovers) => {
      //this.loadquoteDetails()
      this.quoteService.refresh()
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // this.currentQuoteLocationOccupancyId.unsubscribe();
    this.currentQuote.unsubscribe();
  }


  getTotalSalary() {
    let totalSalary = this.wcRatesInfo.reduce((partialSum, a) => partialSum + +a.salaryPerMonth, 0);
    return totalSalary;
  }

  getTotalEmployee() {
    let totalEmployee = this.wcRatesInfo.reduce((partialSum, a) => partialSum + +a.noOfEmployees, 0);
    return totalEmployee
  }


  save() {


    if (this.isAttachmentUpload) {
      this.wcTemplateModel.basicDetailsAttchments = this.savedBasicDetailsAttachment
    }
    this.isAttachmentUpload = false
    this.quoteWcTemplateService.updateArray(this.wcTemplateModel._id, this.wcTemplateModel).subscribe({
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

  downloadBasicDetailsAttachmentsDetails(fileId: string) {
    this.quoteWcTemplateService.BasicDetailsWCAttachmentsDownload(this.wcTemplateModel._id, fileId).subscribe({
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
    this.quoteWcTemplateService.BasicDetailsWCAttachmentsDownload(this.wcTemplateModel._id, fileId).subscribe({
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

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.quoteWcTemplateService.BasicDetailsWCAttachmentsUploadUrl(this.wcTemplateModel?._id, this.attachemntTypeOther);
  }

  deleteBasicDetailsAttachmentsDetails(fileId: string) {
    this.quoteWcTemplateService.BasicDetailsWCAttachmentsDelete(this.wcTemplateModel._id, fileId).subscribe({
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


  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    // const result = this.searchItemInArray(this.selectedAttachment);
    // this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.quoteWcTemplateService.BasicDetailsWCAttachmentsUploadUrl(this.wcTemplateModel?._id, this.selectedAttachment);
  }

  onUploadBasicDetailsAttachmentUpload() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.savedBasicDetailsAttachment = dto.data.entity?.wcTemplateDataId['basicDetailsAttchments']
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
