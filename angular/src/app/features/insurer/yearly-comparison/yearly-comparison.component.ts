// import { Component, OnInit } from '@angular/core';
// import { DialogService } from 'primeng/dynamicdialog';
// import { AddYearsComponent } from '../add-years/add-years.component';

// @Component({
//   selector: 'app-yearly-comparison',
//   templateUrl: './yearly-comparison.component.html',
//   styleUrls: ['./yearly-comparison.component.scss']
// })
// export class YearlyComparisonComponent implements OnInit {
//   activeState: boolean[] = [true, false, false, false, false, false, false];
//   selectedBrokers: any[] = [];
//   broker: any =
//     {
//       'brokerName': 'Broker A',
//       'year': '2022',
//       'clientDetails': {
//         'policyType': 'Standard fire & Special Perils Policy',
//         'InsuredName': 'Birla Cellulosic - Unit of Grasim industries',
//         'proposalType': 'Renewal',
//         'InsurerName': 'The New India Assurance Co LTD',
//         'city': '121200 - New India Center',
//         'DO': '121200 - New India Center',
//         'expirirngPeriod': 'From 00 Hrs. of 05/01/2020 12:00:00AM till Midnight of 04/30/2021 12:00:00AM',
//         'policyPeriod': 'Annual',
//         'policyRange': '',
//         'renewalPeriod': 'From 00 Hrs. of 05/01/2020 till Midnight of 04/30/2021 1year',
//         'insuredBusiness': 'MAnufacturing',
//         'riskLocations': 'As per Annexure attached',
//         'riskDescription': 'Fire, Lightning, Explosion/Implosion Aircraft Damage, Riot, Strike, Malicious and Damage (RSMD)'
//       },
//       'sumInsuredDetails': {
//         'amount': '20000',
//         'something': 'will come'
//       }
//     };
//   brokers: any[] = [
//     {
//       'brokerName': 'Broker B',
//       'year': '2021',
//       'clientDetails': {
//         'policyType': 'Standard fire & Special Perils Policy',
//         'InsuredName': 'Birla Cellulosic - Unit of Grasim industries',
//         'proposalType': 'Renewal',
//         'InsurerName': 'The New India Assurance Co LTD',
//         'city': '121200 - New India Center',
//         'DO': '121200 - New India Center',
//         'expirirngPeriod': 'From 00 Hrs. of 05/01/2020 12:00:00AM till Midnight of 04/30/2021 12:00:00AM',
//         'policyPeriod': 'Annual',
//         'policyRange': '',
//         'renewalPeriod': 'From 00 Hrs. of 05/01/2020 till Midnight of 04/30/2021 1year',
//         'insuredBusiness': 'MAnufacturing',
//         'riskLocations': 'As per Annexure attached',
//         'riskDescription': 'Fire, Lightning, Explosion/Implosion Aircraft Damage, Riot, Strike, Malicious and Damage (RSMD)'
//       },
//       'sumInsuredDetails': {
//         'amount': '20000',
//         'something': 'will come'
//       }
//     },
//     {
//       'brokerName': 'Broker C',
//       'year': '2020',
//       'clientDetails': {
//         'policyType': 'Standard fire & Special Perils Policy',
//         'InsuredName': 'Birla Cellulosic - Unit of Grasim industries',
//         'proposalType': 'Renewal',
//         'InsurerName': 'The New India Assurance Co LTD',
//         'city': '121200 - New India Center',
//         'DO': '121200 - New India Center',
//         'expirirngPeriod': 'From 00 Hrs. of 05/01/2020 12:00:00AM till Midnight of 04/30/2021 12:00:00AM',
//         'policyPeriod': 'Annual',
//         'policyRange': '',
//         'renewalPeriod': 'From 00 Hrs. of 05/01/2020 till Midnight of 04/30/2021 1year',
//         'insuredBusiness': 'MAnufacturing',
//         'riskLocations': 'As per Annexure attached',
//         'riskDescription': 'Fire, Lightning, Explosion/Implosion Aircraft Damage, Riot, Strike, Malicious and Damage (RSMD)'
//       },
//       'sumInsuredDetails': {
//         'amount': '20000',
//         'something': 'will come'
//       }
//     },
//     {
//       'brokerName': 'Broker D',
//       'year': '2019',
//       'clientDetails': {
//         'policyType': 'Standard fire & Special Perils Policy',
//         'InsuredName': 'Birla Cellulosic - Unit of Grasim industries',
//         'proposalType': 'Renewal',
//         'InsurerName': 'The New India Assurance Co LTD',
//         'city': '121200 - New India Center',
//         'DO': '121200 - New India Center',
//         'expirirngPeriod': 'From 00 Hrs. of 05/01/2020 12:00:00AM till Midnight of 04/30/2021 12:00:00AM',
//         'policyPeriod': 'Annual',
//         'policyRange': '',
//         'renewalPeriod': 'From 00 Hrs. of 05/01/2020 till Midnight of 04/30/2021 1year',
//         'insuredBusiness': 'MAnufacturing',
//         'riskLocations': 'As per Annexure attached',
//         'riskDescription': 'Fire, Lightning, Explosion/Implosion Aircraft Damage, Riot, Strike, Malicious and Damage (RSMD)'
//       },
//       'sumInsuredDetails': {
//         'amount': '20000',
//         'something': 'will come'
//       }
//     }
//   ];

//   experienceData = [
//     { 'header': 'Premium Paid', '2018-19': 50, '2019-20': 50, '2020-21': 50 },
//     { 'header': 'Claim Amount', '2018-19': 50, '2019-20': 50, '2020-21': 50 },
//     { 'header': 'No. of Claims', '2018-19': 50, '2019-20': 50, '2020-21': 50 },
//     { 'header': 'Nature of Claims', '2018-19': 50, '2019-20': 50, '2020-21': 50 },
//   ];

//   constructor(
//     private dialogService: DialogService,
//   ) { }

//   ngOnInit(): void {
//     this.selectedBrokers.push(this.brokers[0])
//   }

//   onTabClose(e) {
//     if (e.index === 0) {
//       this.selectedBrokers = [];
//     }
//   }
//   onTabOpen(e) {
//     if (e.index !== 0) {
//       this.selectedBrokers = [];
//     }
//   }

//   addBroker() {
//     const ref = this.dialogService.open(AddYearsComponent, {
//       width: '25%',
//       data: {
//         selectedBrokers: this.selectedBrokers,
//         brokers: this.brokers
//       }
//     });

//     ref.onClose.subscribe((data) => {
//       if (data) {
//         this.selectedBrokers = this.brokers.filter(item => data.some(name => name === item.year));
//         this.activeState[0] = true;
//       }
//     });
//   }

//   applyClass() {
//     if (this.selectedBrokers?.length > 0 && this.activeState[0] === true) {
//       return 'placeBetween';
//     }
//     else {
//       return 'placeBelow';
//     }
//     // return 'placeAbove';
//   }

//   removedChip(e) {
//     this.selectedBrokers = this.selectedBrokers.filter(item => item.brokerName != e);
//   }
// }
