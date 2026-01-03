import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ReplaySubject } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { IQuoteLocaitonBreakupMaster } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-quote-slip-template-for-fire',
  templateUrl: './quote-slip-template-for-fire.component.html',
  styleUrls: ['./quote-slip-template-for-fire.component.scss']
})
export class QuoteSlipTemplateForFireComponent implements OnInit {
    rows: ILov[] = [
        { value: 'premiumPaid', label: 'Premium Paid' },
        { value: 'claimAmount', label: 'Claim Amount' },
        { value: 'numberOfClaims', label: 'No. of Claims' },
        { value: 'natureOfClaim', label: 'Nature of Claim' },
    ];
    currentYear: number = new Date().getFullYear();
    claimExperiences: IClaimExperience[] = []
    id: string;

    @Input() quote: IQuoteSlip;

    user: IUser;
    clausesValues:object;
    addressData = [];
    sum: any[] = [];
    cols: any[];
    covers: IQuoteLocaitonBreakupMaster[] = [];
    riskManagementFeatures: any[] = [];
    selectedRiskManagementFeatures: any[] = [];
    quoteLocationBreakupList = new ReplaySubject<IQuoteLocaitonBreakupMaster[]>(null);
    quoteLocationBreakupList$ = this.quoteLocationBreakupList.asObservable();
    quoteLocationBreakupListValue: IQuoteLocaitonBreakupMaster[] = [];
    riskManagements:any;

    constructor(
        // public config: DynamicDialogConfig,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private accountService: AccountService,
        private claimExperienceService: ClaimExperienceService,
  ) {
    //   this.id = this.activatedRoute.snapshot.paramMap.get("quote_id")
    this.accountService.currentUser$.subscribe({
        next: user => {
            this.user = user;
        }
    });

}

ngOnInit(): void {





    // const data = this.quote?.allCoversArray['quoteLocationRiskManagement'];
    //     const result = data.reduce((acc, curr) => {
    //         const objInAcc = acc.find((o) => o.riskManagementFeatureId.name === curr.riskManagementFeatureId.name && o.id === curr.id);
    //         if (objInAcc) objInAcc.total += curr.total;
    //         else acc.push(curr);
    //         return acc;
    //       }, []);
    //       this.riskManagements =result



    if (this.quote) {

        if (this.quote.hypothications.length > 0) {

            this.quote['hypothication'] = this.quote.hypothications.map(item => item.name).join(', ')
        } else {
            this.quote['hypothication'] = 'N/A'
        }
    }
    this.cols = [
              this.currentYear - 2,
              this.currentYear - 1,
              this.currentYear
          ];

          let lazyLoadEvent: LazyLoadEvent = {
              first: 0,
              rows: 5,
              sortField: '_id',
              sortOrder: -1,
              filters: {
                  // @ts-ignore
                  quoteId: [
                      {
                          value: this.quote._id,
                          matchMode: "equals",
                          operator: "and"
                      }
                  ]
              },
              globalFilter: null,
              multiSortMeta: null
          };

          this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
              next: (dto: IManyResponseDto<IClaimExperience>) => {
                 this.claimExperiences = dto.data.entities
                }
          })
  }


}

