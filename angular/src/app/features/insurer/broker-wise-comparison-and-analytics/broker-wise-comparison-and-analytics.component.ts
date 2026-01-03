// import { AfterContentChecked, AfterViewInit, Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MenuItem } from 'primeng/api';

// @Component({
//   selector: 'app-broker-wise-comparison-and-analytics',
//   templateUrl: './broker-wise-comparison-and-analytics.component.html',
//   styleUrls: ['./broker-wise-comparison-and-analytics.component.scss']
// })
// export class BrokerWiseComparisonAndAnalyticsComponent implements OnInit, AfterContentChecked {

//   comparison:boolean = true;
//   id: string  = 'Q_FIRE_DWELL_22219';
//   productName: string = 'Fire Insurance Policy - Retail';
//   quoteId: string = '';
//   items:any;
//   constructor(
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//   ) {
//     this.quoteId = this.activatedRoute.snapshot.paramMap.get("id");
//   }

//   ngAfterContentChecked(){
//     if(this.router.url.includes('request-approval')){
//       this.comparison =  false;
//     }
//     else{
//       this.comparison = true;
//     }
//   }

//   ngOnInit() {
//     this.items = [
//       {label: 'Comparison and Analytics',routerLink: 'broker-wise'},
//       {label: 'Edit and Send for Approval',routerLink: 'request-approval'},
//     ];
//     // document.getElementById('broker').focus();
// }


// navigateToYearComp(){
//   this.router.navigateByUrl(`backend/insurer/compare-analyse/${this.quoteId}/year-wise`);
// }

// navigateToRequestApproval(){
//   this.router.navigateByUrl(`backend/insurer/compare-analyse/${this.quoteId}/request-approval`);
// }

// navigateToBrokerComp(){
//   this.router.navigateByUrl(`backend/insurer/compare-analyse/${this.quoteId}`);
// }
// }
