// import { HttpHeaders } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { LazyLoadEvent, MenuItem, PrimeNGConfig } from 'primeng/api';
// import { DialogService } from 'primeng/dynamicdialog';
// import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
// import { AppService } from 'src/app/app.service';
// import { RiskOccupancyLocationService } from 'src/app/risk-occupancy-location.service';
// import { RiskOccupancy } from 'src/app/riskOccupancyLocation';
// import { ToWords } from 'to-words';
// import { AccountService } from '../../account/account.service';
// import { IProduct } from '../../admin/product/product.model';
// import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
// import { QuoteLocationOccupancyService } from '../../admin/quote-location-occupancy/quote-location-occupancy.service';
// import { IQuoteSlip } from '../../admin/quote/quote.model';
// import { QuoteService } from '../../admin/quote/quote.service';
// import { ProductService } from '../../service/productservice';
// import { CreateRiskLocationOccupancyDialogComponent } from '../create-risk-location-occupancy-dialog/create-risk-location-occupancy-dialog.component';

// const DEFAULT_RECORD_FILTER = {
//     first: 0,
//     rows: 0,
//     sortField: "",
//     sortOrder: 1,
//     multiSortMeta: [],
//     filters: {}
// };

// @Component({
//     selector: 'app-quote-details',
//     templateUrl: './quote-details.component.html',
//     styleUrls: ['./quote-details.component.scss']
// })
// export class QuoteDetailsComponent implements OnInit {
//     id: string;
//     quote: IQuoteSlip;

//     products: IProduct[] = [];

//     location: IQuoteLocationOccupancy[];
//     totalRecords: number;

//     toWords = new ToWords();
//     uploadHttpHeaders: HttpHeaders;
//     uploadUrl: string;

//     importOptions: MenuItem[];

//     constructor(
//         private quoteLocationOccupancyService: QuoteLocationOccupancyService,
//         private primengConfig: PrimeNGConfig,
//         private productService: ProductService,
//         private activatedRoute: ActivatedRoute,
//         private quoteService: QuoteService,
//         private dialogService: DialogService,
//         private router: Router,
//         private appService: AppService,
//         private accountService: AccountService,
//     ) { }


//     ngOnInit(): void {
//         this.id = this.activatedRoute.snapshot.paramMap.get("id");

//         // this.riskOccupancyLocationService.getProducts().then(data => this.location = data);

//         // this.createForm();
//         this.loadProductRecords(DEFAULT_RECORD_FILTER);

//         this.primengConfig.ripple = true;

//         this.loadQuoteDetails(this.id);


//         this.importOptions = [
//             {
//                 label: 'Download Sample File', icon: 'pi pi-download', command: () => {
//                         this.quoteLocationOccupancyService.downloadSampleExcel(this.id).subscribe({
//                             next: (response: any) => this.appService.downloadSampleExcel(response),
//                             error: e => {
//                                 console.log(e)
//                             }
//                         })
//                 }
//             },
//             {
//                 label: 'Upload Excel Sheet', icon: 'pi pi-upload', command: () => null
//             }
//         ];
//     }

//     loadQuoteLocationOccupancyList(event: LazyLoadEvent) {
//         // console.log(event)

//         if (this.id != "") {

//             event['filters'] = {
//                 quoteId: [
//                     {
//                         value: this.id,
//                         matchMode: "equals",
//                         operator: "and"
//                     }
//                 ] as any
//             };

//             // console.log(event)

//             // console.log(event.filters['quoteId'])

//             this.quoteLocationOccupancyService.getMany(event).subscribe({
//                 next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
//                     console.log(dto.data.entities)
//                     this.location = dto.data.entities;
//                     this.totalRecords = dto.results;
//                 },
//                 error: e => {
//                     console.log(e);
//                 }
//             });
//         }
//     }


//     loadQuoteDetails(qoute_id) {
//         this.quoteService.get(qoute_id).subscribe({
//             next: (dto: IOneResponseDto<IQuoteSlip>) => {
//                 this.quote = dto.data.entity;
//                 // console.log(this.quote)


//             },
//             error: e => {
//                 console.log(e);
//             }
//         });
//     }

//     updateQuoteProduct(product_id) {
//         const updatePayload = { ...this.quote }

//         updatePayload['productId'] = product_id;

//         // if (!this.quote?.productId) {


//         this.quoteService.update(this.id, updatePayload).subscribe({
//             next: quote => {
//                 // this.quote = quote.data.entity;
//                 // console.log(this.quote)
//                 this.quoteService.get(quote.data.entity._id).subscribe({
//                     next: (dto: IOneResponseDto<IQuoteSlip>) => {
//                         this.quote = dto.data.entity;
//                         // console.log(this.quote)
//                     },
//                     error: e => {
//                         console.log(e);
//                     }
//                 });
//                 //   this.router.navigateByUrl(`${this.modulePath}`);
//                 // this.quote =
//             },
//             error: error => {
//                 console.log(error);
//             }
//         });
//         // } else {

//         // }
//     }

//     //fetchin all the sector records
//     loadProductRecords(event: LazyLoadEvent) {

//         this.productService.getMany(event).subscribe({
//             next: (dto: IManyResponseDto<IProduct>) => {

//                 this.products = dto.data.entities;
//                 // this.products = JSON.parse(JSON.stringify(records['data']['entities']));
//                 // console.log(">>>>>>>>>>>>", this.products)
//             },
//             error: e => {
//                 console.log(e);
//             }
//         });
//     }


//     openRiskLocationOccupancyDialog(quoteLocationOccupancyId?: string) {
//         const ref = this.dialogService.open(CreateRiskLocationOccupancyDialogComponent, {
//             header: quoteLocationOccupancyId ? "Edit Risk Location Occupancy" : "Add Risk Location Occupancy",
//             data: {
//                 quote_id: this.id,
//                 clientId: this.quote.clientId,
//                 quoteLocationOccupancyId: quoteLocationOccupancyId
//             },
//             width: "50%",
//             styleClass: "customPopup"
//         }).onClose.subscribe(() => {
//             this.loadQuoteDetails(this.id);
//             this.loadQuoteLocationOccupancyList(DEFAULT_RECORD_FILTER);
//         })
//     }

//     getIndicativeQuote() {
//         // if (this.quote.totalSumAssured && this.location?.length != 0 && this.quote?.productId) {
//         // this.router.navigateByUrl(`/backend/broker/quotes/${this.id}/sum-insured-details`);
//         // }

//         this.quoteService.generateQuoteNumber(this.id).subscribe({
//             next: quote => {
//                 // this.quote = quote.data.entity;
//                 // console.log(this.quote)
//                 this.quoteService.get(quote.data.entity._id).subscribe({
//                     next: (dto: IOneResponseDto<IQuoteSlip>) => {
//                         this.quote = dto.data.entity;
//                         if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/broker/quotes/${this.id}/sum-insured-details`);
//                         // console.log(this.quote)
//                     },
//                     error: e => {
//                         console.log(e);
//                     }
//                 });
//                 //   this.router.navigateByUrl(`${this.modulePath}`);
//                 // this.quote =
//             },
//             error: error => {
//                 console.log(error);
//             }
//         });
//     }
// }

