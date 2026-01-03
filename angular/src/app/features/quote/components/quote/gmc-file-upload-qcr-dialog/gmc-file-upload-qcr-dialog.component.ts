import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { LIABILITY_COVERS_OPTIONS } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { IQuoteGmcTemplate, IQuoteSlip, liabiltyProductAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { BscWorkmenCompensationService } from 'src/app/features/quote/blus_bsc_dialogs/bsc-workmen-compensation-form-dialog/bsc-workmen-compensation.service';

@Component({
  selector: 'app-gmc-file-upload-qcr-dialog',
  templateUrl: './gmc-file-upload-qcr-dialog.component.html',
  styleUrls: ['./gmc-file-upload-qcr-dialog.component.scss']
})
export class GMCFileUploadDialogComponent implements OnInit {
  basicDeatilsFileInput: string = ""
  uploadbasicDeatilsAttachmentUrl: string;
  savedbasicDeatilsAttachment: any[] = []
  isAttachmentbasicDeatilsUpload: boolean = false;
  uploadHttpHeaders: HttpHeaders;
  attachmentDetails: any[] = []
  quote: IQuoteSlip;
  selectedQuoteTemplate: IQuoteGmcTemplate[];
  constructor(
    private config: DynamicDialogConfig, private quoteService: QuoteService,
    private ref: DynamicDialogRef, private accountService: AccountService, private templateService: QoutegmctemplateserviceService,

    private wctemplateService: QuoteWcTemplateService, private messageService: MessageService
  ) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

    this.selectedQuoteTemplate = this.config.data?.selectedQuoteTemplate;
    this.quote = this.config.data.quote;
    this.attachmentDetails = this.config.data.attachmentDetails
  }


  ngOnInit(): void {

  }

  closeModal() {
    this.ref.close();
  }

  //File upload

  ngOnChanges(changes: SimpleChanges): void {
    const ids = this.selectedQuoteTemplate.map(template => template._id).join(",");
    this.uploadbasicDeatilsAttachmentUrl = this.templateService.BasicDetailsQCRAttachmentsUploadUrl(ids, this.basicDeatilsFileInput, "QCR");
  }

  onBasicDeatilsFileInputFocusOut() {
    const ids = this.selectedQuoteTemplate.map(template => template._id).join(",");
    this.uploadbasicDeatilsAttachmentUrl = this.templateService.BasicDetailsQCRAttachmentsUploadUrl(ids, this.basicDeatilsFileInput, "QCR");
  }

  checkIfListOfBasicDeatilsFileUploadVisible(): boolean {
    if (this.basicDeatilsFileInput != undefined && this.basicDeatilsFileInput != null && this.basicDeatilsFileInput != '') {
      return true;
    }
    else {
      return false;
    }
  }


  onUploadBasicDetailsAttachmentUpload() {
    this.isAttachmentbasicDeatilsUpload = true
    this.refresh()
  }


  downloadBasicDetailsDetailsfile(fileId: string) {
    const ids = this.selectedQuoteTemplate.map(template => template._id).join(",");
    this.templateService.BasicDetailsQCRAttachmentsDownload(ids, fileId).subscribe({
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


  deleteBasicDetailsAttachmentsDetails(fileId: string) {
    const ids = this.selectedQuoteTemplate.map(template => template._id).join(",");
    this.templateService.BasicDetailsQCRAttachmentsDelete(ids, fileId).subscribe({
      next: () => {
       
            this.refresh()
          
      }
    })

  }

  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }


  cancel() {
    this.ref.close();
  }

  refresh() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.loadOptionsData(dtoOption.data.entity);
        this.loadSelectedOption(dtoOption.data.entity[0])
        this.cancel()
      },
      error: e => {
        console.log(e);
      }
    });
  }


loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
    this.quoteService.setQuoteOptions(quoteOption)
}

loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
    this.quoteService.setSelectedOptions(quoteOption)
}
  //file upload end
}
