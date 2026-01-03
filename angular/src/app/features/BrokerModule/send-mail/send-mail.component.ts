import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from '../../admin/quote/quote.service';
import { Quote } from '@angular/compiler';
import { IQuoteOption, IQuoteSlip } from '../../admin/quote/quote.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from '../../account/account.service';
import { Subscription } from 'rxjs';
import { IUser } from '../../admin/user/user.model';
import { QuoteReviewPageComponent } from '../../quote/pages/quote-review-page/quote-review-page.component';
import { environment } from "src/environments/environment";
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss'],
})
export class SendMailComponent implements OnInit {
  // isCCAvailable: boolean = false;
  // isBCCAvailable: boolean = false;
  sendMailForm: FormGroup;
  fileList: File[] = [];
  listOfFiles: any[] = [];
  isToggle: boolean = false;
  @Input() quote: IQuoteSlip;
  private currentUser: Subscription;
  user: IUser;
  userEmail: string[] = [];
  gmcQuoteOption: any
  userEmailFrom: string[] = [];
  userEmailTo: string[] = [];
  selectInsurer: any
  attachement: any;
  quoteOption: IQuoteOption;
  loading: Boolean = false;
  constructor(
    private fb: FormBuilder, private quoteService: QuoteService, private ref: DynamicDialogRef,
    private renderer: Renderer2, private eleRef: ElementRef, private accountService: AccountService,
    private quoteReviewPageComponent: QuoteReviewPageComponent, private config: DynamicDialogConfig, private messageService: MessageService) {
    this.selectInsurer = this.config.data.insureName;
    this.attachement = this.config.data.insureType;
    this.quoteOption = this.config.data.quoteOption;
    this.gmcQuoteOption = this.config.data.gmcQuoteOption;
    this.currentUser = this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
      }
    });

    this.sendMailForm = this.fb.group({
      sendFrom: [''],
      sendTo: ['', Validators.required],
      recieverCC: [''],
      recieverBCC: [''],
      subject: [`Request for Quotation (RFQ) ${this.attachement} ${this.selectInsurer}`, Validators.required],
      mailBody: ['<p>Hi,</p><br><p>Find the attached RFQ file FYA.</p><br><br><span>Best,</span><br><span>Team Alwrite</span>'],
      file: []
    })
  }

  ngOnInit() {
    console.log(this.gmcQuoteOption)
    this.userEmailFrom = [environment.backendEmailFrom];
    this.userEmailTo = [this.user.email];
    this.selectInsurer = this.replaceDashesWithUnderscores(this.selectInsurer);
    this.attachement = this.replaceSpacesWithUnderscores(this.attachement);
    console.log(this.selectInsurer);
  }
  replaceDashesWithUnderscores(input: string): string {
    return input.replace(/-/g, '_');
  }
  replaceSpacesWithUnderscores(input: string): string {
    return input.replace(/ /g, '_');
  }

  // openCC() {
  //   this.isCCAvailable = true
  // }


  // openBCC() {
  //   this.isBCCAvailable = true
  // }
  async onSubmit(val: any) {
    if (this.sendMailForm.invalid) {
      let message = '';
      if (this.sendMailForm.get('subject')?.invalid) {
        message += 'Send this message without a subject or text in the body?';
      }
      if (this.sendMailForm.get('sendTo')?.invalid) {
        message += ('Email Id is required. ')
      }
      if (message) {
        const userConfirmed = confirm(`${message}`);
        if (!userConfirmed) {
          return;
        }
      }
    }
    this.loading = true;
    setTimeout(() => {
      this.performAsyncOperations();
    });
  }
  async performAsyncOperations() {
    const formData = new FormData();
    formData.append('sendTo', this.sendMailForm.get('sendTo').value);
    formData.append('subject', this.sendMailForm.get('subject').value);
    formData.append('body', this.sendMailForm.get('mailBody').value);
    this.fileList.forEach((file) => { formData.append('file', file); });

    const blobVal = await this.quoteReviewPageComponent.generatePDF()
    //const blobValExcel = await this.quoteReviewPageComponent.generateEmployeeExl()
    formData.append('file', blobVal, "'QuoteSlip_' + this.quote.quoteNo + '.pdf'");
    //formData.append('file', blobValExcel, "this.quote.quoteNo + 'Employees.xlxs'");
    this.quoteService.sendMailToInsurer(formData, { quoteOptionId: this.quoteOption?._id == undefined ? this.gmcQuoteOption : this.quoteOption?._id }).subscribe({
      // this.quoteService.sendMailToInsurer(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: `Mail send successfully`,
          life: 3000
        });
        this.loading = false;
        this.ref.close();
        this.sendMailForm.reset()
      }, error: error => {
        console.log(error);
      }
    })
  }


  onFileChanged(event: any) {
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(selectedFile);
        this.listOfFiles.push(selectedFile.name);
      }
    }
  }

  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
  }
}