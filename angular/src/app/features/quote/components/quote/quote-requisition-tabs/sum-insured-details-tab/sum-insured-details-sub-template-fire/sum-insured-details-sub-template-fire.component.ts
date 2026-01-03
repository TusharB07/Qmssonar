import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ILov, IManyResponseDto, PermissionType } from 'src/app/app.model';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';

@Component({
  selector: 'app-sum-insured-details-sub-template-fire',
  templateUrl: './sum-insured-details-sub-template-fire.component.html',
  styleUrls: ['./sum-insured-details-sub-template-fire.component.scss']
})
export class SumInsuredDetailsSubTemplateFireComponent implements OnInit {

  @Input() quote: IQuoteSlip;

  @Input() permissions: PermissionType[] = ['read', 'update']

  occupancyCount: number = 0;

  @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

  constructor(
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
  ) { }

  ngOnInit(): void {
    console.log(this.quoteOptionData);
    
    // Old_Quote
    // let lazyLoadEvent: LazyLoadEvent = {
    //   first: 0,
    //   rows: 20,
    //   sortField: null,
    //   sortOrder: 1,
    //   filters: {
    //     // @ts-ignore
    //     quoteId: [
    //       {
    //         value: this.quote._id,
    //         matchMode: "equals",
    //         operator: "and"
    //       }
    //     ]
    //   },
    //   globalFilter: null,
    //   multiSortMeta: null
    // };

    // New_Quote_Option
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        quoteOptionId: [
          {
            value: this.quoteOptionData._id,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };

    // console.log(event)

    this.quoteLocationOccupancyService.getMany(lazyLoadEvent).subscribe({
      next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
        this.occupancyCount = dto.data.entities.length
      },
      error: e => { }
    });
  }

  ngOnChanges(): void {
    this.ngOnInit()
  }
}
