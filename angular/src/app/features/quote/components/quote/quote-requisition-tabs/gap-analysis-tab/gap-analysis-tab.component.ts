import { Component, OnInit } from '@angular/core';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AddonCoverService } from 'src/app/features/admin/addon-cover/addon-cover.service';
import { LazyLoadEvent } from 'primeng/api';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { environment } from 'src/environments/environment';
import { AllowedAddonCoverCategory, IAddOnCover } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IOneResponseDto } from 'src/app/app.model';

@Component({
  selector: 'app-gap-analysis-tab',
  templateUrl: './gap-analysis-tab.component.html',
  styleUrls: ['./gap-analysis-tab.component.scss']
})
export class GapAnalysisTabComponent implements OnInit {

  quote: IQuoteSlip;
  optionsCategoryOfImportance: any;
  coveragesOpted: any;
  coveragesNonOpted: any;
  data: any;
  selectedConditionalFreeCovers: any[] = [];
  conditionalFreeCovers: any[] = [];
  dropDownValue: any[] = [];
  Summarytable: boolean = false;
  summarrydata: {};
  isLockton: boolean = environment.isLokton
  // coverages: any[] = [
  //   { name:'Omission to Insure additions, alterations or extensions',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Escalation Clause',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Architects, Surveyors and Consulting Engineers Fees( in excess of 3 % claim amount)',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Removal of Debris(in excess of 1 % claim amount)',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Impact Damage due to Insured ? s own Rail / Road Vehicles, Fork lifts, Cranes, Stackers and the like and articles dropped therefrom',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Spontaneous Combustion',	coverage:'Covered', sectorAverage:	2, marketAverage: 1 },
  //   { name:'Spoilage Material Damage',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Leakage And Contamination Cover',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Molten Material Spillage',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Temporary Removal of Stocks Clause',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  //   { name:'Start - Up / Shut - Down Cost',	coverage:'Covered', sectorAverage:	2, marketAverage: 0 },
  // ];

  private currentQuote: Subscription;

  // New_Quote_option
  quoteOptionData: IQuoteOption
  private currentPropertyQuoteOption: Subscription;

  constructor(
    private quoteService: QuoteService,
    private router: Router,
    private appService: AppService,
    private recordService: AddonCoverService,
    private quoteOptionService: QuoteOptionService,
    private addonCoverService: AddonCoverService,
  ) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        // Old_Quote
        // this.applyFilterOnAddonCovers(this.quote, AllowedAddonCoverCategory.PROPERTY_DAMAGE)
      }
    })

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto
        // this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

      }
    });
  }

  ngOnInit(): void {
    this.allData();

  }
  allData() {

    // event = {
    //   first: 0,
    //   rows: 2000,
    //   sortField: null,
    //   sortOrder: 1,
    //   filters: {
    //     productId: this.quote.productId['id']
    //   },
    //   gs: null,
    //   multiSortMeta: null
    // }
    // this.addonCoverService.getMany(event).subscribe((res) => {
    //   this.data = res.data.entities;
    //   // console.log(this.data,'iiiiiiiiiiiiiiiiiiii')
    //   this.optionsCategoryOfImportance = [...new Set(res.data.entities.map((val: any) => val = val?.categoryOfImportance).filter((ele) => ele != undefined))];
    //   this.optionsCategoryOfImportance.unshift('All');
    // })

    this.addonCoverService.getAddOnCoversByProductId(this.quote?.productId['_id']).subscribe({
              next: (dto: IOneResponseDto<IAddOnCover>) => {
                this.conditionalFreeCovers =  dto.data.entities
                ?.filter((item) => item?.partnerId == this.quote?.partnerId)
                ?.filter(item => item?.sectorId == this.quote?.sectorId['_id']);
              this.optionsCategoryOfImportance = [...new Set(dto.data.entities.map((val: any) => val = val?.categoryOfImportance).filter((ele) => ele != undefined))];
              this.optionsCategoryOfImportance.unshift('All');
              this.conditionalFreeCovers = this.conditionalFreeCovers.map(item => ({
                ...item,
                categoryOfImportanceAll: 'All'
              }));
              this.dropDownValue = [...this.conditionalFreeCovers];
            }
          })   

  }
  handleChange(val: any) {
    // this.conditionalFreeCovers = []
    if (val == 'All') {
      // this.conditionalFreeCovers = this.dropDownValue.filter((ele) => ele.categoryOfImportanceAll === "All");
      this.coveragesOpted = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers;
      const matchedIds = new Set(this.coveragesOpted.map(item => item.addOnCoverId['_id']));
      this.coveragesNonOpted = this.conditionalFreeCovers.filter(item => !matchedIds.has(item._id));
      // Old_Quote
      // this.applyFilterOnAddonCovers(this.quote, AllowedAddonCoverCategory.PROPERTY_DAMAGE);

      // New_Quote_option
      // this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, AllowedAddonCoverCategory.PROPERTY_DAMAGE);
    } else if (val == 'Good to Have') {
      this.coveragesOpted = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.filter((ele)=> ele.addOnCoverId['categoryOfImportance'] === 'Good to Have');
      const matchedIds = new Set(this.coveragesOpted.map(item => item.addOnCoverId['_id']));
      this.coveragesNonOpted = this.conditionalFreeCovers.filter(item => !matchedIds.has(item._id));
      // this.conditionalFreeCovers = this.dropDownValue.filter((ele) => ele.categoryOfImportance === "Good to Have");
    } else if (val == 'Could Have') {
      this.coveragesOpted = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.filter((ele)=> ele.addOnCoverId['categoryOfImportance'] === 'Could Have');
      const matchedIds = new Set(this.coveragesOpted.map(item => item.addOnCoverId['_id']));
      this.coveragesNonOpted = this.conditionalFreeCovers.filter(item => !matchedIds.has(item._id));
      // this.conditionalFreeCovers = this.dropDownValue.filter((ele) => ele.categoryOfImportance === "Could Have");
    } else if (val == "Must Have") {
      this.coveragesOpted = this.quoteOptionData.locationBasedCovers.quoteLocationAddonCovers.filter((ele)=> ele.addOnCoverId['categoryOfImportance'] === 'Must Have');
      const matchedIds = new Set(this.coveragesOpted.map(item => item.addOnCoverId['_id']));
      this.coveragesNonOpted = this.conditionalFreeCovers.filter(item => !matchedIds.has(item._id));
      // this.conditionalFreeCovers = this.dropDownValue.filter((ele) => ele.categoryOfImportance === "Must Have");
    }
  }

  // Old_Quote
  // applyFilterOnAddonCovers(quote: IQuoteSlip, type: AllowedAddonCoverCategory) {
  //   this.conditionalFreeCovers = quote.locationBasedCovers?.conditonalBasedAddOn
  //     ?.filter((item) => item?.addOnCoverId?.category == type)
  //     ?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid')
  //     ?.filter(item => item?.addOnCoverId?.sectorId?.name == quote?.sectorId['name']);
  //   this.dropDownValue = [...this.conditionalFreeCovers]
  //   this.coveragesOpted = this.conditionalFreeCovers.filter((ele) => ele.isChecked);
  //   this.coveragesNonOpted = this.conditionalFreeCovers.filter((ele) => !ele.isChecked);

  // }

  applyFilterOnAddonCoversForQuoteOption(quoteOption: IQuoteOption, type: AllowedAddonCoverCategory) {
    this.conditionalFreeCovers = quoteOption?.locationBasedCovers?.conditonalBasedAddOn
      ?.filter((item) => item?.addOnCoverId?.category == type)
      ?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid')
      ?.filter(item => item?.addOnCoverId?.sectorId?.name == quoteOption.quoteId["sectorId"]['name']);
    this.dropDownValue = [...this.conditionalFreeCovers]
    this.coveragesOpted = this.conditionalFreeCovers.filter((ele) => ele.isChecked);
    this.coveragesNonOpted = this.conditionalFreeCovers.filter((ele) => !ele.isChecked);

  }

  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

  generatereport() {
    this.router.navigateByUrl(this.appService.routes.quotes.gapReportReview(this.quote._id));
  }

  opendialog() {
    this.addonCoverService.getAddOnCoversCoversFromAI(this.quote._id).subscribe({
      next: (res) => {
        this.summarrydata = res.data.entities;
        this.Summarytable = true;
      },
      error: e => {
        this.summarrydata = [];
        this.Summarytable = false;
        alert('There was a problem fetching the data. Please try again later.')
      }
    });
  }

}
