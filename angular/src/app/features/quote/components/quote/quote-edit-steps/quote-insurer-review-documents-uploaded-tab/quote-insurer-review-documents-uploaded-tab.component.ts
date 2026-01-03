import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { IManyResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-quote-insurer-review-documents-uploaded-tab',
    templateUrl: './quote-insurer-review-documents-uploaded-tab.component.html',
    styleUrls: ['./quote-insurer-review-documents-uploaded-tab.component.scss']
})
export class QuoteInsurerReviewDocumentsUploadedTabComponent implements OnInit {

    quote: IQuoteSlip;
    quoteLocationOccupancies: IQuoteLocationOccupancy[]

    currentUser$: Observable<IUser>;
    uploadedDocument = []

    private currentPropertyQuoteOption: Subscription;               // New_Quote_option
    quoteOptionData: IQuoteOption                                     // New_Quote_option

    private currentQuote: Subscription;

    constructor(
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private accountService: AccountService,
        private quoteOptionService: QuoteOptionService,


    ) {

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote;

                // this.loadData(quote)
            }
        })

        this.currentUser$ = this.accountService.currentUser$

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto

                this.loadData(dto)

            }
        });
    }

    documents = []

    ngOnInit(): void {
    }

    loadData(quoteOption: IQuoteOption) {
        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 20,
        //     sortField: null,
        //     sortOrder: 1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: quote._id,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }
        //         ]
        //     },
        //     globalFilter: null,
        //     multiSortMeta: null
        // };

        // New_Quote_Option
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: quoteOption?._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };


        this.quoteLocationOccupancyService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
                this.documents = []

                dto.data.entities.map((quoteLocationOccupancy) => {
                    this.uploadedDocument = dto.data.entities
                    if (quoteLocationOccupancy.riskInspectionReportDocumentPath) {

                        this.documents.push({
                            name: `Risk Inspection Report of ${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,
                            quoteLocationOccupancyId: quoteLocationOccupancy._id,
                            src: quoteLocationOccupancy.riskInspectionReportDocumentPath,

                        })
                    }
                    quoteLocationOccupancy.locationPhotographs?.map((photograph) => {
                        if (photograph.imagePath) {
                            this.documents.push({
                                name: `Location Photograph of ${quoteLocationOccupancy.clientLocationId['locationName']} - ${quoteLocationOccupancy.pincodeId['name']}`,
                                quoteLocationOccupancyId: quoteLocationOccupancy._id,
                                desciption: photograph.description,
                                src: photograph.imagePath
                            })
                        }
                    })
                })
            }
        })
    }

    openUploadedPdfDocument(quoteLocationOccupancyId, path) {

        // Old_Quote
        // if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id) {

        // New_Quote_Option
        if (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id) {

            this.quoteLocationOccupancyService.riskInspectionReportDownload(quoteLocationOccupancyId).subscribe({
                next: (response: any) => {
                    let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Risk Inspection Report';
                    const a = document.createElement('a')
                    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                    const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                    const objectUrl = window.URL.createObjectURL(file);
                    window.open(objectUrl, '_blank');
                    URL.revokeObjectURL(objectUrl);
                }
            })
        }
    }

    openUploadedPhotoGrephDocument(quoteLocationOccupancyId, path) {
        // Old_Quote
        // if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id) {

        // New_Quote_Option
        if (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id) {

            this.quoteLocationOccupancyService.locationPhotoGraphDownload(quoteLocationOccupancyId, path).subscribe({
                next: (response: any) => {
                    let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Location Photograph';
                    const a = document.createElement('a')
                    const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                    const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                    const objectUrl = window.URL.createObjectURL(file);
                    window.open(objectUrl, '_blank');
                    URL.revokeObjectURL(objectUrl);

                }
            })
        }
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

}
