import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { throwIfEmpty } from 'rxjs/operators';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { IHypothication, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { DatePipe, formatDate } from '@angular/common';
import { MessageService } from 'primeng/api';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AppService } from 'src/app/app.service';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-other-details-tab',
    templateUrl: './other-details-tab.component.html',
    styleUrls: ['./other-details-tab.component.scss']
})
export class OtherDetailsTabComponent implements OnInit {

    quote: IQuoteSlip

    toWords = new ToWords();

    today: string;

    private currentQuote: Subscription;
    private currentUser: Subscription;
    user: IUser;

    private currentPropertyQuoteOption: Subscription;       // New_Quote_option
    quoteOptionData: IQuoteOption    // New_Quote_Option
    quoteOptionId: any;

    constructor(
        private quoteService: QuoteService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private messageService: MessageService,
        private quoteOptionService: QuoteOptionService,
        private accountService:AccountService,
        private claimExperienceService:ClaimExperienceService,
        private appService: AppService,
        private activatedRoute:ActivatedRoute
    ) {
        this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto
            }
        });
        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
              this.user = user;
            }
          });
        this.quoteOptionId = this.activatedRoute.snapshot.queryParamMap.get('quoteOptionId');
    }

    ngOnInit(): void {


    }

    ngOnDestroy(): void {

    }

    downloadSampleFile(){
        this.claimExperienceService.bulkExportGenerateSample(this.quote._id,{quoteOptionId:this.quoteOptionId}).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }
    get quoteLocationBreakupBulkImportProps(): PFileUploadGetterProps {
        // Old_Quote
        // return this.quoteLocationBreakupService.getBulkImportProps(this.quote['_id'], (dto: IOneResponseDto<IBulkImportResponseDto>) => {

        // New_Quote_Option
        return this.claimExperienceService.getBulkImportProps(this.quote._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                this.messageService?.add({
                    summary: "Success",
                    detail: 'File Uploaded Successfully',
                    severity: 'success'
                })
               
            } else {
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }
        })
    }
    get onUploadClaimExperienceReport() {
        return this.claimExperienceService.claimExperienceReportUpload(this.quote._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            this.quoteService.refresh();
            if (dto.status == 'success') {
                this.messageService?.add({
                    summary: "Success",
                    detail: 'File Uploaded Successfully',
                    severity: 'success'
                })
               
            } else {
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }
        })
    }

}
