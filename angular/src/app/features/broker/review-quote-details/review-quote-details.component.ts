// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { LazyLoadEvent } from 'primeng/api';
// import { DialogService } from 'primeng/dynamicdialog';
// import { ILov, IOneResponseDto } from 'src/app/app.model';
// import { AccountService } from '../../account/account.service';
// import { IQuoteSlip } from '../../admin/quote/quote.model';
// import { QuoteService } from '../../admin/quote/quote.service';
// import { BscMoneyInSafeViewQuoteBreakupDialogComponent } from '../bsc-money-in-safe-view-quote-breakup-dialog/bsc-money-in-safe-view-quote-breakup-dialog.component';

// @Component({
//     selector: 'app-review-quote-details',
//     templateUrl: './review-quote-details.component.html',
//     styleUrls: ['./review-quote-details.component.scss']
// })
// export class ReviewQuoteDetailsComponent implements OnInit {

//     quote: IQuoteSlip;
//     value: number = 90;
//     searchText: string;
//     quoteId: string = '';
//     selectedInsurer: any[] = [];
//     selectedRMEmails: any[] = [];
//     optionsCategories: ILov[];
//     customers: any[];
//     categories: any[] = [
//         {
//             "name": "HDFC Ergo Co. Ltd",
//             "mappedRmEmails": [
//                 {
//                     "email": "john@email.com"
//                 },
//                 {
//                     "email": "mary@email.com"
//                 },
//                 {
//                     "email": "kevin@email.com"
//                 }
//             ]
//         },
//         {
//             "name": "TATA AIA Co. Ltd",
//             "mappedRmEmails": [
//                 {
//                     "email": "Ricky@email.com"
//                 },
//                 {
//                     "email": "Jack@email.com"
//                 },
//                 {
//                     "email": "Root@email.com"
//                 }
//             ]
//         }
//     ];
//     dataBLUS = [
//         {
//             address: 'Delhi',
//             occupancy: 'Schools/college',
//             sum: 98200
//         },
//         {
//             address: 'Mumbai',
//             occupancy: 'Schools/college',
//             sum: 535200
//         },
//         {
//             address: 'Banglore',
//             occupancy: 'Schools/college',
//             sum: 13200
//         },
//         {
//             address: 'Hyderabad',
//             occupancy: 'Schools/college',
//             sum: 20090
//         },
//         {
//             address: 'Pune',
//             occupancy: 'Schools/college',
//             sum: 2100
//         },
//         {
//             address: 'Kolkata',
//             occupancy: 'Schools/college',
//             sum: 250
//         }
//     ];
//     loading: boolean;
//     totalRecords: number;
//     currentUser$: any;



//     constructor(
//         private router: Router,
//         private quoteService: QuoteService,
//         private accountService: AccountService,
//         private activatedRoute: ActivatedRoute,
//         private dialogService: DialogService

//     ) {
//         this.quoteId = this.activatedRoute.snapshot.paramMap.get("id");
//         console.log(this.quoteId);


//         this.accountService.currentUser$.subscribe({
//             next: user => {
//                 this.currentUser$ = user;
//             }
//         });
//     }

//     ngOnInit(): void {
//         this.getInsurerList(this.quoteId);
//         this.quoteService.get(this.quoteId).subscribe({
//             next: (dto: IOneResponseDto<IQuoteSlip>) => {
//                 this.quote = dto.data.entity;
//                 console.log(this.quote)
//             },
//             error: e => {
//                 console.log(e);
//             }
//         });
//     }

//     getInsurerList(id) {
//         if (id) {
//             // this.quoteService.generateQuoteSlip(id).subscribe({
//             //     next: quote => {
//             //         this.categories = quote?.data['entity'];
//             //         this.optionsCategories = this.categories;
//             //         // console.log(quote,'data');

//             //     },
//             //     error: error => {
//             //         console.log(error);
//             //     }
//             // });
//         }
//     }

//     parentChange(e, index) {
//         if (this.selectedInsurer.indexOf(index) == -1) {
//             index.mappedRmEmails.forEach(id => {
//                 this.selectedRMEmails = this.selectedRMEmails.filter(item => item.email !== id.email);
//             })
//         }
//     }

//     childChange(e, name, index) {
//         if (this.selectedRMEmails.indexOf(index) != -1) {
//             let managers = this.selectedInsurer.filter(insurer => insurer.name === name).map(item => item.mappedRmEmails);
//             managers = managers[0].filter(id => id.email !== index.email)
//             managers.forEach(id => {
//                 this.selectedRMEmails = this.selectedRMEmails.filter(item => item.email !== id.email);
//             })
//         }
//         if (this.selectedInsurer.length > 0) {
//             this.selectedInsurer.map(insurer => {
//                 let found = insurer.mappedRmEmails.some(r => this.selectedRMEmails.includes(r))
//                 if (!found && !(this.selectedRMEmails.indexOf(index) != -1)) {
//                     this.selectedInsurer = this.selectedInsurer.filter(insurer => insurer.name !== name);
//                 }
//             })
//         }
//     }

//     disable(name) {
//         if (this.selectedInsurer.length == 0) {
//             return true;
//         } else {
//             const enable = this.selectedInsurer.filter(insurer => insurer.name === name);
//             if (enable.length > 0) {
//                 return false;
//             } else {
//                 return true;
//             }
//         }
//     }

//     searchInsurer(e) {
//         if (e) {
//             this.optionsCategories = this.categories.filter(options => {
//                 if (options.name.toLowerCase().includes(e.toLowerCase())) {
//                     return true;
//                 }
//                 else {
//                     let emailSearch = false;
//                     options.mappedRmEmails.forEach(managers => {
//                         if (managers.email.toLowerCase().includes(e.toLowerCase())) {
//                             emailSearch = true
//                         }
//                     })
//                     return emailSearch;
//                 }
//             })
//         } else {
//             this.optionsCategories = this.categories;
//         }
//     }

//     requestApproval(){
//           if (this.selectedRMEmails.length > 0) {
//             let payload = {}
//             payload['insurerMapping'] = this.selectedInsurer.map(insurer => {
//                 let temp = insurer.mappedRmEmails.filter(item => this.selectedRMEmails.some(i => i.email === item.email))
//                 if (temp?.length > 0) {
//                     return { name: insurer.name, mappedRmEmails: temp };
//                 } else {
//                     return 0;
//                 }
//             }).filter(item => item != 0);
//             payload['user'] = this.currentUser$._id;
//             payload['quoteId'] = this.quoteId;
//             console.log(payload);



//            /*  this.quoteService.copyToInsurer(payload).subscribe({
//                 next: dto => {
//                     console.log(dto)
//                     // @ts-ignore
//                     if (dto?.data?.entities?.status == 'fail')
//                         alert('Failed to Fetch RM')
//                     else
//                         alert('Thank You')
//                 }
//             }) */
//         }

//         if(this.quote.quoteState == 'Waiting For Approval'){
//             // this.quoteService.sendQuoteToInsuranceCompanyRm(this.quoteId).subscribe({
//             //     next: quote => {
//             //         this.quoteService.get(quote.data.entity._id).subscribe({
//             //             next: (dto: IOneResponseDto<IQuoteSlip>) => {
//             //                 this.quote = dto.data.entity;
//             //                 if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/insurer/compare-analyse/${this.quoteId}/request-approval`);
//             //             },
//             //             error: e => {
//             //                 console.log(e);
//             //             }
//             //         });
//             //     },
//             //     error: error => {
//             //         console.log(error);
//             //     }
//             // });
//         }else if(this.quote.quoteState == 'Under Writter Review'){
//             console.log('else if');

//             this.quoteService.sendQuoteForComparisonReview(this.quoteId).subscribe({
//                 next: quote => {
//                     this.quoteService.get(quote.data.entity._id).subscribe({
//                         next: (dto: IOneResponseDto<IQuoteSlip>) => {
//                             this.quote = dto.data.entity;
//                             if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/insurer/compare-analyse/${this.quoteId}`);
//                         },
//                         error: e => {
//                             console.log(e);
//                         }
//                     });
//                 },
//                 error: error => {
//                     console.log(error);
//                 }
//             });
//         }
//     }

// }


