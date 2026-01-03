import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ConfigureDiscountDialogeComponent } from '../../../configure-discount-dialoge/configure-discount-dialoge.component';
import { LossOfRentDialogComponent } from '../../standerd-addons-dialog/loss-of-rent-dialog/loss-of-rent-dialog.component';
import { PersonalAccidentCoverDialogComponent } from '../../standerd-addons-dialog/personal-accident-cover-dialog/personal-accident-cover-dialog.component';
import { RentForAlternativeAccomodationDialogComponent } from '../../standerd-addons-dialog/rent-for-alternative-accomodation-dialog/rent-for-alternative-accomodation-dialog.component';
import { ValuebleContentAgreedValueBasisDialogComponent } from '../../standerd-addons-dialog/valueble-content-agreed-value-basis-dialog/valueble-content-agreed-value-basis-dialog.component';

@Component({
    selector: 'app-standard-addons-tab',
    templateUrl: './standard-addons-tab.component.html',
    styleUrls: ['./standard-addons-tab.component.scss']
})
export class StandardAddonsTabComponent implements OnInit {

    quote: IQuoteSlip
    uploadHttpHeaders: HttpHeaders;
    quoteLocationOccupancyId: string
    private currentQuote: Subscription;

    constructor(private quoteService: QuoteService,
        private dialogService: DialogService,
        private accountService: AccountService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    ) {
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })
        
    }

    ngOnInit(): void {
    }



    openLossofRentDialog() {
        const ref = this.dialogService.open(LossOfRentDialogComponent, {
            header: "Loss of Rent",
            data: {
                quote: this.quote,
            },
            width: '500px',
            // height: "250px",
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe(() => {

            if (this.quoteLocationOccupancyId) {

                this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quoteService.setQuote(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        });
    }


    openPersonalAccidentCoverDialog() {
        const ref = this.dialogService.open(PersonalAccidentCoverDialogComponent, {
            header: "Personal Accident Covers",
            data: {
                quote: this.quote,
            },
            width: '500px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe(() => {

            if (this.quoteLocationOccupancyId) {

                this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quoteService.setQuote(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        });
    }


    openValuebleContentonAgreedDialog() {
        const ref = this.dialogService.open(ValuebleContentAgreedValueBasisDialogComponent, {
            header: "Valuable Content Agreed Value",
            data: {
                quote: this.quote,
            },
            width: '700px',
            styleClass: 'customPopup'
        })

        ref.onClose.subscribe(() => {

            if (this.quoteLocationOccupancyId) {

                this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        this.quoteService.setQuote(dto.data.entity)
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        });
    }

    opneConfigureDiscountDialoge() {

        const ref = this.dialogService.open(ConfigureDiscountDialogeComponent, {
            header: "Configure Discount",
            data: {
                quoteId: this.quote._id,
            },
            width: '30%',
            height: '60%',
            styleClass: "customPopup"
        })
    }

    //   openRentForAlternativeAccomodationDialog() {
    //     const ref = this.dialogService.open(RentForAlternativeAccomodationDialogComponent, {
    //         header: "Edit Sum Insured Split",
    //         data: {
    //             quote: this.quote,
    //         },
    //         width: '700px',
    //         styleClass: 'customPopup'
    //     })

    //     ref.onClose.subscribe(() => {

    //         if (this.quoteLocationOccupancyId) {

    //             this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
    //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //                     this.quoteService.setQuote(dto.data.entity)
    //                 },
    //                 error: e => {
    //                     console.log(e);
    //                 }
    //             });
    //         }
    //     });
    // }
    // openBharthGrihaRakshaPolicyDialog() {
    //     const ref = this.dialogService.open(SidSumInsuredSplitDialogComponent, {
    //         header: "Edit Sum Insured Split",
    //         data: {
    //             quote: this.quote,
    //         },
    //         width: '700px',
    //         styleClass: 'customPopup'
    //     })

    //     ref.onClose.subscribe(() => {

    //         if (this.quoteLocationOccupancyId) {

    //             this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
    //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //                     this.quoteService.setQuote(dto.data.entity)
    //                 },
    //                 error: e => {
    //                     console.log(e);
    //                 }
    //             });
    //         }
    //     });
    // }
    // openIndicativeppremiumDialog() {
    //     const ref = this.dialogService.open(SidSumInsuredSplitDialogComponent, {
    //         header: "Edit Sum Insured Split",
    //         data: {
    //             quote: this.quote,
    //         },
    //         width: '700px',
    //         styleClass: 'customPopup'
    //     })

    //     ref.onClose.subscribe(() => {

    //         if (this.quoteLocationOccupancyId) {

    //             this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
    //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //                     this.quoteService.setQuote(dto.data.entity)
    //                 },
    //                 error: e => {
    //                     console.log(e);
    //                 }
    //             });
    //         }
    //     });
    // }
    // openBharatLaghuUdyamSurakshaDialog() {
    //     const ref = this.dialogService.open(SidSumInsuredSplitDialogComponent, {
    //         header: "Edit Sum Insured Split",
    //         data: {
    //             quote: this.quote,
    //         },
    //         width: '700px',
    //         styleClass: 'customPopup'
    //     })

    //     ref.onClose.subscribe(() => {

    //         if (this.quoteLocationOccupancyId) {

    //             this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
    //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //                     this.quoteService.setQuote(dto.data.entity)
    //                 },
    //                 error: e => {
    //                     console.log(e);
    //                 }
    //             });
    //         }
    //     });
    // }
    // openCGSTDialog() {
    //     const ref = this.dialogService.open(SidSumInsuredSplitDialogComponent, {
    //         header: "Edit Sum Insured Split",
    //         data: {
    //             quote: this.quote,
    //         },
    //         width: '700px',
    //         styleClass: 'customPopup'
    //     })

    //     ref.onClose.subscribe(() => {

    //         if (this.quoteLocationOccupancyId) {

    //             this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
    //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //                     this.quoteService.setQuote(dto.data.entity)
    //                 },
    //                 error: e => {
    //                     console.log(e);
    //                 }
    //             });
    //         }
    //     });
    // }
    // openSGSTDialog() {
    //     const ref = this.dialogService.open(SidSumInsuredSplitDialogComponent, {
    //         header: "Edit Sum Insured Split",
    //         data: {
    //             quote: this.quote,
    //         },
    //         width: '700px',
    //         styleClass: 'customPopup'
    //     })

    //     ref.onClose.subscribe(() => {

    //         if (this.quoteLocationOccupancyId) {

    //             this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quoteLocationOccupancyId }).subscribe({
    //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
    //                     this.quoteService.setQuote(dto.data.entity)
    //                 },
    //                 error: e => {
    //                     console.log(e);
    //                 }
    //             });
    //         }
    //     });
    // }
}
