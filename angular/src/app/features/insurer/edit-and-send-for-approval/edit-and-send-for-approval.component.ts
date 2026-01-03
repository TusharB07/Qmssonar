// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { MenuItem } from 'primeng/api';

// @Component({
//   selector: 'app-edit-and-send-for-approval',
//   templateUrl: './edit-and-send-for-approval.component.html',
//   styleUrls: ['./edit-and-send-for-approval.component.scss']
// })
// export class EditAndSendForApprovalComponent implements OnInit {

//   id: string  = 'Q_FIRE_DWELL_22219';
//   productName: string = 'Fire Insurance Policy - Retail'
//   items: MenuItem[];
//   quoteId: string = '';

//   constructor(
//     private router: Router,
//     private activatedRoute: ActivatedRoute,
//   ) {
//     this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("id");
//   }

//   ngOnInit() {
//     this.items = [
//         {label: 'Basic Details',routerLink: 'basic-details'},
//         {label: 'Sum Insured Details',routerLink: 'sum-insured-details'},
//         {label: 'Multilocation Annexure',routerLink: 'multilocation-annexure'},
//         {label: "Add On's",routerLink: 'add-on'},
//         {label: 'Business Suraksha Covers',routerLink: 'bsc'},
//         {label: 'Risk Inspection Status & Claim Experience',routerLink: 'risk-inspection'},
//         {label: 'Warranties, Exclusions & Subjectives',routerLink: 'warrenties'},
//         {label: 'Decision Matrix',routerLink: 'decision-matrix'},
//         {label: 'Preview & Download',routerLink: 'preview'},
//     ];
// }

// }
