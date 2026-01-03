// import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
// import { MessageService } from 'primeng/api';
// import { DialogService } from 'primeng/dynamicdialog';
// import { IOneResponseDto } from 'src/app/app.model';
// import { ToWords } from 'to-words';
// import { IQuoteSlip } from '../../admin/quote/quote.model';
// import { QuoteService } from '../../admin/quote/quote.service';
// import { QuoteLocationBreakupDialogComponent } from '../../quote/components/quote-location-breakup-dialog/quote-location-breakup-dialog.component';
// import { ConfigureDiscountDialogeComponent } from '../../quote/components/configure-discount-dialoge/configure-discount-dialoge.component';
// import { SidSumInsuredSplitDialogComponent } from '../sid-sum-insured-split-dialog/sid-sum-insured-split-dialog.component';

// @Component({
//     selector: 'app-sum-insured-details-tab',
//     templateUrl: './sum-insured-details-tab.component.html',
//     styleUrls: ['./sum-insured-details-tab.component.scss']
// })
// export class SumInsuredDetailsTabComponent implements OnInit, OnChanges {

//     // @Input() quote_id: string;
//     // @Input() clientLocationId: any;

//     @Input() quote: IQuoteSlip;

//     totalCoverOptedPremium: number = 0;
//     totalFireLossOfProfit: number = 0;
//     totalBurglaryAndHousebreaking: number = 0;
//     totalMoneyInSafeOrTill: number = 0;
//     totalMoneyInTransit: number = 0;
//     totalElectronicEquipment: number = 0;
//     totalPortableEquipment: number = 0;
//     totalAccompaniedBaggage: number = 0;
//     totalFidelityGuarantee: number = 0;
//     totalSignage: number = 0;
//     totalLiabilitySection: number = 0;

//     uploadedFiles: any[] = [];

//     toWord = new ToWords();


//     constructor(
//         private dialogService: DialogService,
//         private messageService: MessageService,
//         private quoteService: QuoteService,
//     ) { }

//     ngOnChanges(changes: SimpleChanges): void {
//         /* if (changes.clientLocationId.currentValue != changes.clientLocationId.previousValue) {
//             console.log('value changed');
//         } */
//     }

//     ngOnInit(): void {
//         // console.log(this.quote_id, 'Quote ID');
//         // console.log(this.clientLocationId.id, 'location ID');

//         // this.quoteService.get(this.quote_id).subscribe({
//         //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
//         //         this.quote = dto.data.entity;
//         //         console.log(this.quote)
//         //     },
//         //     error: e => {
//         //         console.log(e);
//         //     }
//         // });
//     }

//     openSumInsuredSplitDialog() {
//         const ref = this.dialogService.open(SidSumInsuredSplitDialogComponent, {
//             header: "Edit Sum Insured Split",
//             data: {
//                 quote: this.quote,
//             },
//             width: '70%',
//             styleClass: 'customPopup'
//         })

//         ref.onClose.subscribe(() => {
//             // if (bscMoneySafeTillCover) this.bscMoneySafeTillCover = bscMoneySafeTillCover;
//             this.quoteService.recomputePremium(this.quote._id).subscribe({
//                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
//                     // this.quote = dto.data.entity;
//                     // console.log(dto.data.entity)
//                     // this.quote = dto.data.entity
//                     // this.quoteUpdated.emit(dto.data.entity)
//                 },
//                 error: e => {
//                     console.log(e);
//                 }
//             });
//         });
//     }

//     opneConfigureDiscountDialoge() {

//         const ref = this.dialogService.open(ConfigureDiscountDialogeComponent, {
//             header: "Configure Discount",
//             data: {
//                 quoteId: this.quote._id,
//             },
//             width: '30%',
//             height: '50%',
//             styleClass: "customPopup"
//         })
//     }

//     onUpload(event) {
//         for (let file of event.files) {
//             this.uploadedFiles.push(file);
//         }

//         this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
//     }
// }
