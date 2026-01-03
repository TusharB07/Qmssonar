// import { HttpHeaders } from '@angular/common/http';
// import { Component, Inject, Input, OnInit } from '@angular/core';
// import { LazyLoadEvent, TreeNode } from 'primeng/api';
// import { DynamicDialogConfig } from 'primeng/dynamicdialog';
// import { Observable, ReplaySubject, Subscription } from 'rxjs';
// import { IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
// import { AppService } from 'src/app/app.service';
// import { BurglarylocationService } from 'src/app/burglarylocationservice';
// import { environment } from 'src/environments/environment';
// import { ToWords } from 'to-words';
// import { AccountService } from '../../account/account.service';
// import { IClientLocation } from '../../admin/client-location/client-location.model';
// import { AllowedListOfValuesMasters, IListOfValueMaster } from '../../admin/list-of-value-master/list-of-value-master.model';
// import { ListOfValueMasterService } from '../../admin/list-of-value-master/list-of-value-master.service';
// import { IOccupancyRate } from '../../admin/occupancy-rate/occupancy-rate.model';
// import { IPincode } from '../../admin/pincode/pincode.model';
// import { IProduct } from '../../admin/product/product.model';
// import { IBreakupMap, IQuoteLocaitonBreakupMaster } from '../../admin/quote-location-breakup-master/quote-location-breakup-master.model';
// import { QuoteLocationBreakupMasterService } from '../../admin/quote-location-breakup-master/quote-location-breakup-master.service';
// import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
// import { QuoteLocationOccupancyService } from '../../admin/quote-location-occupancy/quote-location-occupancy.service';
// import { IQuoteSlip } from '../../admin/quote/quote.model';
// import { QuoteService } from '../../admin/quote/quote.service';
// import { AllowedRoles, IRole } from '../../admin/role/role.model';
// import { IUser } from '../../admin/user/user.model';
// import { NodeService } from '../../service/nodeservice';

// @Component({
//     selector: 'app-sid-sum-insured-split-dialog',
//     templateUrl: './sid-sum-insured-split-dialog.component.html',
//     styleUrls: ['./sid-sum-insured-split-dialog.component.scss']
// })
// export class SidSumInsuredSplitDialogComponent implements OnInit {

//     quote: IQuoteSlip;
//     cols: any[];

//     files1: TreeNode[];
//     covers: IQuoteLocaitonBreakupMaster[] = []


//     model: any[] = [];
//     sum: any[] = [];
//     uploadUrl: string;
//     uploadHttpHeaders: HttpHeaders;

//     private currentQuote: Subscription;
//     currentUser$: Observable<IUser>;
//     permissions: PermissionType[] =[];


//     constructor(
//         private burglarylocationservice: BurglarylocationService,
//         private quoteLocationOccupancyService: QuoteLocationOccupancyService,
//         private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
//         // public config: DynamicDialogConfig,
//         private listOfValuesMasterService: ListOfValueMasterService,
//         private appService: AppService,
//         private quoteService: QuoteService,
//         private accountService: AccountService,

//     ) {
//         // this.quote = this.quote || this.config?.data?.quote;
//         this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

//         this.currentQuote = this.quoteService.currentQuote$.subscribe({
//             next: (quote) => {
//                 this.quote = quote
//             }
//         })
//         this.currentUser$ = this.accountService.currentUser$

//     }


//     // quoteLocationOccupanciesList: IQuoteLocationOccupancy[] = [];

//     quoteLocationOccupanciesList = new ReplaySubject<IQuoteLocationOccupancy[]>(null);
//     quoteLocationOccupanciesList$ = this.quoteLocationOccupanciesList.asObservable();
//     quoteLocationOccupanciesListValue: IQuoteLocationOccupancy[] = []

//     quoteLocationBreakupList = new ReplaySubject<IQuoteLocaitonBreakupMaster[]>(null);
//     quoteLocationBreakupList$ = this.quoteLocationBreakupList.asObservable();
//     quoteLocationBreakupListValue: IQuoteLocaitonBreakupMaster[] = [];

//     lovTreeMapping = new ReplaySubject<IListOfValueMaster[]>(null);
//     lovTreeMapping$ = this.lovTreeMapping.asObservable();
//     lovTreeMappingValue: IListOfValueMaster[] = [];


//     ngOnInit(): void {
//         this.uploadUrl = this.quoteLocationBreakupService.uploadQuoteLocationBreakupExcelUrl(this.quote?._id)
//         this.loadQuoteLocationOccupancies();
//         this.loadLovTreeMapping();

//         this.quoteLocationOccupanciesList$.subscribe({
//             next: (quoteLocationOccupancies: IQuoteLocationOccupancy[]) => {
//                 this.quoteLocationOccupanciesListValue = quoteLocationOccupancies;

//                 this.cols = [{ _id: '', clientLocation: '', occupancy: '' },];

//                 quoteLocationOccupancies.map((quoteLocationOccupancy: IQuoteLocationOccupancy) => {
//                     let clientLocation: IClientLocation = quoteLocationOccupancy.clientLocationId as IClientLocation
//                     let occupancy: IOccupancyRate = quoteLocationOccupancy.occupancyId as IOccupancyRate
//                     let pincode: IPincode = quoteLocationOccupancy.pincodeId as IPincode;

//                     this.cols.push({
//                         _id: quoteLocationOccupancy._id,
//                         clientLocation: clientLocation,
//                         occupancy: occupancy,
//                         sumAssured: quoteLocationOccupancy.sumAssured,
//                         pincode: pincode,
//                         calculatedSumAssured: 0
//                     })
//                 })

//             }
//         })

//         this.lovTreeMapping$.subscribe({
//             next: (lovTree) => {
//                 // console.log('lov', dto)
//                 this.lovTreeMappingValue = lovTree;

//                 this.loadQuoteLocationBreakup();

//             }
//         })

//         this.quoteLocationBreakupList$.subscribe({
//             next: (quoteLocationBreakup) => {
//                 this.quoteLocationBreakupListValue = quoteLocationBreakup;

//                 console.log('breakup', quoteLocationBreakup)
//                 console.log(this.lovTreeMappingValue);
//                 //  this.files1 = this.parseTree(this.breakupMap);

//                 this.cols.map((col: any) => {
//                     this.sum[col._id] = [];
//                     this.sum[col._id]['calculatedSumAssured'] = 0
//                     // console.log(el.calculatedSumAssured)
//                 });


//                 this.files1 = this.parseTree(this.lovTreeMappingValue, quoteLocationBreakup);

//                 // console.log(this.files1);

//             }
//         })



//         let lazyLoadEvent: LazyLoadEvent = {
//             first: 0,
//             rows: 20,
//             sortField: null,
//             sortOrder: 1,
//             filters: {
//                 // @ts-ignore
//                 quoteId: [
//                     {
//                         // value: this.config.data.quote._id,
//                         value: this.quote._id,
//                         matchMode: "equals",
//                         operator: "and"
//                     }
//                 ]
//             },
//             globalFilter: null,
//             multiSortMeta: null
//         };


//         this.quoteLocationOccupancyService.getMany(lazyLoadEvent).subscribe({
//             next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {


//             }
//         })

//         this.currentUser$.subscribe({
//             next: user => {
//               let role: IRole = user?.roleId as IRole;
//         if (role?.name === AllowedRoles.INSURER_RM) {

//            this.permissions = ['read'];
//         }else{

//             this.permissions = ['read', 'update'];
//         }
//     }
// })



//     }

//     //work on this
//     calculateTree() {
//         // return breakUpMap.map(item => {

//         //     return item.children ? this.calculateTree(item) : item;
//         // })

//         // console.log(tree)

//         // tree.map((node:any) => console.log(node))
//     }

//     loadLovTreeMapping() {
//         let productId: IProduct = this.quote.productId as IProduct;

//         this.listOfValuesMasterService.current(AllowedListOfValuesMasters.QUOTE_LOCATION_BREAKUP_L1, productId._id).subscribe({
//             next: (dto: IManyResponseDto<IListOfValueMaster>) => {
//                 this.lovTreeMapping.next(dto.data.entities)

//                 // this.breakupMap = dto.data.entities

//                 // dto.data.entities.map((item: IListOfValueMaster) => {
//                 //     console.log(item);
//                 // })

//             },
//             error: e => { }

//         })
//     }

//     loadQuoteLocationBreakup() {
//         this.quoteLocationBreakupService.getMany({
//             first: 0, rows: 200, sortField: null, sortOrder: 1, globalFilter: null, multiSortMeta: null,
//             filters: {
//                 // @ts-ignore
//                 quoteId: [{ value: this.quote._id, matchMode: "equals", operator: "and" }],
//                 // @ts-ignore
//                 // clientLocationId: [{ value: quoteLocationOccupancy._id, matchMode: "equals", operator: "and" }]
//                 // quoteLocationOccupancyId: [{ value: quoteLocationOccupancy._id, matchMode: "equals", operator: "and" }]
//             },
//         }).subscribe({
//             next: (dto: IManyResponseDto<IQuoteLocaitonBreakupMaster>) => {

//                 this.quoteLocationBreakupList.next(dto.data.entities)
//             }
//         });
//     }

//     loadQuoteLocationOccupancies() {
//         this.quoteLocationOccupancyService.getMany({
//             first: 0, rows: 4, sortField: null, sortOrder: 1, globalFilter: null, multiSortMeta: null,
//             filters: { // @ts-ignore
//                 quoteId: [{ value: this.quote._id, matchMode: "equals", operator: "and" }]
//             },
//         }).subscribe({
//             next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
//                 this.quoteLocationOccupanciesList.next(dto.data.entities);
//             }
//         });
//     }

//     parseTree(breakUpMap: IListOfValueMaster[], quoteLocationBreakupListValue: IQuoteLocaitonBreakupMaster[]) {

//         return breakUpMap.map(item => {

//             let res = [];
//             // console.log(item._id)
//             this.model[item._id] = [];

//             this.cols.map(col => {
//                 // console.log(item?.children)

//                 if (col._id && item?.children.length == 0) {


//                     // console.log('dat',quoteLocationBreakupListValue)

//                     // let quoteLocationBreakup = this.quoteLocationOccupancyBreakup.find(el => item._id == el.lovId && col._id == el.clientLocationId);
//                     let quoteLocationBreakup = quoteLocationBreakupListValue.find(el => item._id == el.lovId && col._id == el.quoteLocationOccupancyId);


//                     // console.log(item)
//                     // if (!quoteLocationBreakup?.value) {
//                     //     // console.log(item)
//                     //     console.log('lovItem',item)
//                     //     console.log('quoteLocationBreakup', quoteLocationBreakup)
//                     //     console.log('quoteLocationBreakup?.value', quoteLocationBreakup?.value)

//                     // }
//                     this.model[item._id][col._id] = quoteLocationBreakup?.value ?? 0;

//                     this.sum[col._id]['calculatedSumAssured'] = Number(this.sum[col._id]['calculatedSumAssured'] ?? 0) + Number(quoteLocationBreakup?.value ?? 0);

//                     // console.log(this.sum[col._id]['calculatedSumAssured'])

//                     res[col._id] = {
//                         _id: quoteLocationBreakup?._id,
//                         lovId: item._id,
//                         lovType: item.lovType,
//                         lovKey: item.lovKey,
//                         lovReferences: item.lovReferences,
//                         value: quoteLocationBreakup?.value ?? 0
//                     }
//                     // col['calculatedSumAssured'] = Number(col.calculatedSumAssured ?? 0) + Number(quoteLocationBreakup?.value ?? 0)
//                     // console.log(col)
//                 } else {
//                     res[col._id] = { readonly: true, value: 0 }
//                 }
//             })

//             return {
//                 expanded: true,
//                 data: {
//                     name: item.lovKey,
//                     ...res
//                 },
//                 children: ((item?.children) ? this.parseTree(item?.children, quoteLocationBreakupListValue) : [])
//             }
//         })
//     }

//     valueUpdated(quoteLocationOccupancyId, lovId, lovType, lovKey, lovReferences, id) {


//             const payload: IQuoteLocaitonBreakupMaster = {
//                 quoteId: this.quote._id,
//                         // clientLocationId: clientLocationId,
//                 quoteLocationOccupancyId: quoteLocationOccupancyId,
//                 lovId: lovId,
//                 lovType: lovType,
//                 lovKey: lovKey,
//                 lovReferences: lovReferences,
//                 value: this.model[lovId][quoteLocationOccupancyId],
//             }
//             console.log(payload)

//             console.log(this.model[lovId][quoteLocationOccupancyId])

//             // console.o
//             // if(this.model[lovId][quoteLocationOccupancyId] <= this.quote.locationBasedCovers.quoteLocationOccupancy['sumAssured']){
//             // }
//         if (id) {
//             this.quoteLocationBreakupService.update(id, payload).subscribe({
//                 next: async (dto: IOneResponseDto<IQuoteLocaitonBreakupMaster>) => {
//                     console.log(dto.data.entity)

//                     let newQuoteLocationBreak = dto.data.entity;
//                     // console.log()

//                     let newList = this.quoteLocationBreakupListValue.map((quoteLocationBreak: IQuoteLocaitonBreakupMaster) => quoteLocationBreak._id == newQuoteLocationBreak._id ? newQuoteLocationBreak : quoteLocationBreak);
//                     // this.computeData();
//                     console.log(newList);
//                     this.quoteLocationBreakupList.next(newList)
//                 },
//                 error: error => {
//                     console.log(error);
//                 }
//             });
//         } else {
//             this.quoteLocationBreakupService.create(payload).subscribe({
//                 next: (dto: IOneResponseDto<IQuoteLocaitonBreakupMaster>) => {
//                     console.log(dto.data.entity)
//                     // this.computeData();
//                     let newQuoteLocationBreak = dto.data.entity;

//                     this.quoteLocationBreakupListValue.push(newQuoteLocationBreak)

//                     this.quoteLocationBreakupList.next(this.quoteLocationBreakupListValue)
//                 },
//                 error: error => {
//                     console.log(error);
//                 }
//             });

//     }


//     }


//     downloadSampleFile() {
//         this.quoteLocationBreakupService.downloadQuoteLocationBreakupExcel(this.quote?._id).subscribe({
//             next: (response: any) => this.appService.downloadSampleExcel(response),
//             error: e => {
//                 console.log(e)
//             }
//         })
//     }


//     fileUploaded($event: any) {

//         // let response = $event.originalEvent.body;
//         // this.covers = response.data.entities;

//     }
// }
