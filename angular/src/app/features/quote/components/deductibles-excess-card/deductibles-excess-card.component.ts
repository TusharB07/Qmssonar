import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteLocationBreakupDialogComponent } from '../quote-location-breakup-dialog/quote-location-breakup-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { LazyLoadEvent } from 'primeng/api';
import { AllowedLovReferences } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { HttpClient } from '@angular/common/http';
import { DeductibleExcessService } from './deductible-excess.service';
import { IDeductible } from './deductibles.model';

@Component({
  selector: 'app-deductibles-excess-card',
  templateUrl: './deductibles-excess-card.component.html',
  styleUrls: ['./deductibles-excess-card.component.scss']
})

export class DeductiblesExcessCardComponent implements OnInit, OnChanges {

  @Input() quote: IQuoteSlip;


  AllowedProductTemplate = AllowedProductTemplate

  @Input() isShowBreakupType: boolean

  totalPremium = 0;
  basePremium = 0;
  sumInsured = 0;

  total = 0;

  toWord = new ToWords();

  @Input() quoteOptionData: IQuoteOption 
  data: IDeductible[];
  claimAmountMin: number;
  claimPercentage: any;
  rowid: string;
  claimPercentage1: string;
  // claimPercentage: IDeductible[];
  // claimAmountHeader:  IDeductible[];
  // claimAmountMin: IDeductible[];
  constructor(
    private dialogService: DialogService,
    private quoteService: QuoteService,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private http: HttpClient,
    private deductibleExcessService: DeductibleExcessService
  ) { 
    
  }
  
  
  ngOnInit(): void {
    this.createdectibleEXcesstablebypolicy();
    // this.getdectibleEXcesstablebypolicy(this.quote?.productId['shortName'])
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createdectibleEXcesstablebypolicy();
  }

  onClaimPercentageChange() {
    if (this.claimPercentage < 0) {
      this.claimPercentage = 0;
    } else if (this.claimPercentage > 100) {
      this.claimPercentage = 100;
    }
    console.log(`Updated claim percentage: ${this.claimPercentage}%`);
    const updatedRow = { claimPercentage: this.claimPercentage ,claimAmountMin: this.claimAmountMin }
    this.deductibleExcessService.update(this.rowid, updatedRow).subscribe({
      next: data => {
      },
      error: error => {
        console.log(error);
      }
    });
  }

  
  validatePropertyDamageBreakdown(row: any) {
    if (row.propertyDamageBreakdown > 1000000) {
      row.propertyDamageBreakdown = 1000000;
    }
  }

  updateRow(row: any) {
    if (row.claimPercentage < 0) {
      row.claimPercentage = 0;
    } else if (row.claimPercentage > 100) {
      row.claimPercentage = 100;
    }
    if (row.propertyDamageBreakdown > 1000000) {
      row.propertyDamageBreakdown = 1000000;
    }
    if (row.claimPercentage1 > 100) {
      row.claimPercentage1 = 100;
    }
  const updatedRow = { ...row ,  claimAmountHeader: this.claimPercentage};
  console.log(updatedRow);
  this.deductibleExcessService.update(row._id, updatedRow).subscribe({
    next: data => {
    },
    error: error => {
      console.log(error);
    }
  });
  }


  getdectibleEXcesstablebypolicy(policyName: string) {
    let lazyLoadEvent: LazyLoadEvent = {
      filters: {
        // @ts-ignore
        policyType: [
          {
            value: [
              {
                value: policyName
              }
            ],
            matchMode: "in",
            operator: "and"
          }
        ],
         // @ts-ignore
        quoteOptionId: [
            {
                value: [
                    {
                        value: this.quoteOptionData._id
                    }
                ],
                matchMode: "in",
                operator: "and"
            },
        ]
      },
      sortField: "_id",
      sortOrder: 1
    };
    
  
    this.deductibleExcessService.getDeductibletable(lazyLoadEvent).subscribe({
      next: (dto: IManyResponseDto<IDeductible>) => {
        this.data = dto.data.entities;
        this.claimPercentage = dto.data.entities[0]['claimPercentage'];
        this.claimPercentage1 = dto.data.entities[0]['claimPercentage1'];
        this.claimAmountMin = dto.data.entities[0]['claimAmountMin'];
        this.rowid = dto.data.entities[0]['_id'];
        this.data = dto.data.entities;
      }
    });
  }
  
  
  validateClaimPercentage(event: any): void {
    const value = event.target.value;
    if (value > 100) {
      event.target.value = 100;
    } else if (value < 0) {
      event.target.value = 0;
    }
  }
  createdectibleEXcesstablebypolicy() {
    console.log(this.quote)
    let payload = {}
    if (this.quote?.productId['shortName'] == 'BSUSP') {
      payload = {
        quoteId: this.quote._id,
        quoteOptionId: this.quoteOptionData._id,
        policyType: "BSUSP",
        policyName: "Sukshma",
        productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
        claimAmountMin: 20000,
        claimPercentage: 5,
        productHeader: "Product Sukshma",
        productValue1: "Fixed",
        claimAmountMin1: 5000
      }
    }
    if (this.quote?.productId['shortName'] == 'BLUSP') {
      payload = {
        quoteId: this.quote._id,
        quoteOptionId: this.quoteOptionData._id,
        policyType: "BLUSP",
        policyName: "Laghu",
        productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
        claimAmountMin: 10000,
        claimPercentage: 5,
        productHeader: "Product Laghu",
        productValue1: "Fixed",
      }
    }
    if (this.quote?.productId['shortName'] == 'FIPR') {
      payload = [
        {
          locationWiseSumInsured: "> Rs. 2500 Crs",
          claimAmountMin: "5000000",
          claimPercentage: 5,
          sfspProduct: "Fixed",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "FIPR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          locationWiseSumInsured: "> Rs. 1500 Crs <= Rs. 2500 Crs",
          claimAmountMin: "2500000",
          claimPercentage: 5,
          sfspProduct: "Fixed",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "FIPR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          locationWiseSumInsured: "> Rs. 100 Crs <= Rs. 1500 Crs",
          claimAmountMin: "500000",
          claimPercentage: 5,
          sfspProduct: "Fixed",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "FIPR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          locationWiseSumInsured: "> Rs. 10 Crs <= Rs. 100 Crs",
          claimAmountMin: "25000",
          claimPercentage: 5,
          sfspProduct: "Fixed",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "FIPR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          locationWiseSumInsured: "<= Rs. 10 Crs",
          claimAmountMin: "10000",
          claimPercentage: 5,
          sfspProduct: "Fixed",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "FIPR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        }
      ]
    }
    if (this.quote?.productId['shortName'] == 'CAR') {
      payload = [
        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR STORAGE & ERECTION CLAIMS.",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "CAR",
          policyName: "CAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },

        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR AOG / MAJOR PERILS.",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "CAR",
          policyName: "CAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },

        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR FIRE /EXPLOSION CLAIMS.",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "CAR",
          policyName: "CAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },

        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR DESIGN DEFECTS COVER DE-3/DE-4.",
          productValue: "5 Times of AOG Excess",
          policyType: "CAR",
          policyName: "CAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        }
      ]
    }
    if (this.quote?.productId['shortName'] == 'EAR') {
      payload = [
        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR STROAGE & ERECTION CLAIMS.",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "EAR",
          policyName: "EAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR TESTING PERIOD CLAIMS./MAINTENANCE PERIOD CLAIM.",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "EAR",
          policyName: "EAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR AOG / MAJOR PERILS",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "EAR",
          policyName: "EAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR FIRE /EXPLOSION CLAIMS",
          productValue: "OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF",
          policyType: "EAR",
          policyName: "EAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          claimAmountMin: 750000,
          claimPercentage: 5,
          productHeader: "FOR DESIGN DEFECTS COVER DE-3/DE-4",
          productValue: "5 Times of AOG Excess",
          policyType: "EAR",
          policyName: "EAR",
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        }
      ]
    }
    if (this.quote?.productId['shortName'] == 'IAR') {
      payload = [
        {
          policyType: "IAR",
          policyName: "IAR",
          locationWiseSumInsured: "> Rs.2500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 50,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 14,
          machineryBreakdownInterruption: 21,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "IAR",
          policyName: "IAR",
          locationWiseSumInsured: "> Rs. 1500 Crs <= Rs. 2500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 25,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "IAR",
          policyName: "IAR",
          locationWiseSumInsured: "> Rs. 100 Crs <= Rs. 1500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 10,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "IAR",
          policyName: "IAR",
          locationWiseSumInsured: "<= Rs. 100 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 5,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        }
      ]
    }

    if (this.quote?.productId['shortName'] == 'PAR') {
      payload = [
        {
          policyType: "PAR",
          policyName: "PAR",
          locationWiseSumInsured: "> Rs.2500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 50,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 14,
          machineryBreakdownInterruption: 21,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "PAR",
          policyName: "PAR",
          locationWiseSumInsured: "> Rs. 1500 Crs <= Rs. 2500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 25,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "PAR",
          policyName: "PAR",
          locationWiseSumInsured: "> Rs. 100 Crs <= Rs. 1500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 10,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "PAR",
          policyName: "PAR",
          locationWiseSumInsured: "<= Rs. 100 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 5,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        }
      ]
    }
    if (this.quote?.productId['shortName'] == 'MEGA') {
      payload = [
        {
          policyType: "MEGA",
          policyName: "MEGA",
          locationWiseSumInsured: "> Rs.2500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 50,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 14,
          machineryBreakdownInterruption: 21,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "MEGA",
          policyName: "MEGA",
          locationWiseSumInsured: "> Rs. 1500 Crs <= Rs. 2500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 25,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "MEGA",
          policyName: "MEGA",
          locationWiseSumInsured: "> Rs. 100 Crs <= Rs. 1500 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 10,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        },
        {
          policyType: "MEGA",
          policyName: "MEGA",
          locationWiseSumInsured: "<= Rs. 100 Crs",
          locationWiseSumInsuredHeader: "Location wise Sum Insured (Property Damage + Business Interruption)",
          propertyDamageHeader: "Property Damage / Machinery Breakdown",
          claimAmountMin: 1000000,
          claimPercentage: 5,
          propertyDamageBreakdown: 5,
          productHeader: "Property Damage Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader1: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          productHeader2: "Machinery Breakdown Business Interruption (Standard Gross Profit of affected production line/unit)",
          propertyDamageBusiness: 7,
          machineryBreakdownInterruption: 14,
          quoteId: this.quote._id,
          quoteOptionId: this.quoteOptionData._id
        }
      ]
    }
    if (this.quote?.productId['shortName'] == 'BGRP') {
      payload = {
        quoteId: this.quote._id,
        quoteOptionId: this.quoteOptionData._id
      }
    }
    console.log(payload);
    if(['BSUSP','BGRP','BLUSP'].includes(this.quote?.productId['shortName'])){
      console.log('callled')
      this.deductibleExcessService.createDeductibletable(payload).subscribe((res) => {
        this.getdectibleEXcesstablebypolicy(this.quote?.productId['shortName'])
      })
    }else{
      this.deductibleExcessService.createManyDeductibletable(payload).subscribe((res) => {
        this.getdectibleEXcesstablebypolicy(this.quote?.productId['shortName'])
      })
    }
  }


}
