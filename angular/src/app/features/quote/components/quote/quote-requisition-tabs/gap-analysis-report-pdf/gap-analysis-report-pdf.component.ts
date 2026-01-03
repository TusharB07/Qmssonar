import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs/internal/Subscription';
import { IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedAddonCoverCategory, IAddOnCover } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { IClient, SectorId, partnerId, productId } from 'src/app/features/admin/client/client.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';

@Component({
  selector: 'app-gap-analysis-report-pdf',
  templateUrl: './gap-analysis-report-pdf.component.html',
  styleUrls: ['./gap-analysis-report-pdf.component.scss']

})


export class GapAnalysisReportPdfComponent implements OnInit {
  private currentQuote: Subscription;
  private currentUser: Subscription;
  isQuoteslipAllowedUser: boolean = false;
  quote: IQuoteSlip;
  user: any
  role: any;
  coverages: any[];
  preparedFor: any[];
  nameOfInsured: string;
  correspondenceAddress: string;
  insurerName: string;
  sector: string;
  totalPermimum: any;
  covers: any[] = [];

  selectedConditionalFreeCovers: any[] = [];
  conditionalFreeCovers: any[] = [];
  coditionalCoversGoodToHave: any[] = [];
  coditionalCoversCouldHave: any[] = [];
  coditionalCoversMustHave: any[] = [];

  selectedSectorAvgPaidCovers: any[] = [];
  sectorAvgPaidCovers = [];

  sectorAvgCovers: any[] = []

  flexaCovers: any[] = [];
  FreeCovers: any;
  quoteId:any;

  // New_Quote_option
  quoteOptionData: IQuoteOption
  private currentPropertyQuoteOption: Subscription;


  constructor(
    private accountService: AccountService,
    private quoteService: QuoteService,
    private deviceService: DeviceDetectorService,
    private quoteOptionService: QuoteOptionService,
    private router:Router,
    private activateRoute:ActivatedRoute
  ) {
    this.currentUser = this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
        this.role = user.roleId['name'];
        if ([
          AllowedRoles.BROKER_CREATOR,
          AllowedRoles.BROKER_CREATOR_AND_APPROVER,
          AllowedRoles.BROKER_APPROVER,
          AllowedRoles.AGENT_CREATOR,
          AllowedRoles.AGENT_CREATOR_AND_APPROVER,
          AllowedRoles.BANCA_APPROVER,
          AllowedRoles.BANCA_CREATOR,
          AllowedRoles.BANCA_CREATOR_AND_APPROVER,
          AllowedRoles.SALES_CREATOR,
          AllowedRoles.SALES_APPROVER,
          AllowedRoles.SALES_CREATOR_AND_APPROVER,
          AllowedRoles.PLACEMENT_CREATOR,
          AllowedRoles.PLACEMENT_APPROVER,
          AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER,
        ].includes(this.role)) {
          this.isQuoteslipAllowedUser = true;
        }
        else {
          this.isQuoteslipAllowedUser = false;
        }
      }
    });

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote
        this.nameOfInsured = (this.quote.clientId as IClient).name;
        this.correspondenceAddress = this.quote.clientAddress;
        this.insurerName = (this.quote.partnerId as unknown as partnerId).name;
        this.sector = (this.quote.sectorId as SectorId).name
        // Old_Quote
        // this.totalPermimum = (this.quote["locationBasedCovers"].quoteLocationOccupancy["totalPremium"]); 
        // this.applyFilterOnAddonCovers(this.quote, AllowedAddonCoverCategory.PROPERTY_DAMAGE)
        // this.preparedFor = [];
        // this.preparedFor.push(
        //   { particulars: 'Name of Insured', description: (this.quote.clientId as IClient).name },
        //   { particulars: 'Correspondence Address', description: this.quote.clientAddress },
        //   { particulars: 'Rick Location', description: 'PLOT NO. 102, YASHWANT GHADGE NAGAR, GANESH KHIND ROAD, RANGE HILL CORNER, PUNE, MAHARASHTRA-411007' },
        //   { particulars: 'Policy Renewal From', description: '27 May 2018' },
        //   { particulars: 'Policy Renewal To', description: '26 May 2019' },
        //   { particulars: "Insurer's Name", description: (this.quote.partnerId as unknown as partnerId).name },
        //   { particulars: 'Occupancy', description: 'Places of worships, Libraries, Museums, Schools, Colleges, Hospitals including X-ray and other, Diagnostic clinics, Office premises, Meeting Rooms, Auditoriums, Planetarium, Mess Houses, Clubs, Marriage Halls, Showrooms and display centres where goods are kept for display and no sales are carried out, Educational and Research Institutes imparting training in various crafts, Lodging/Boarding Houses, Cycle Shed and Dish Antenna, Indoor stadiums' },
        //   { particulars: 'Policy Number', description: '1001/131803120/00/000' },
        //   { particulars: 'Sum Insured', description: (this.quote.totalSumAssured).toLocaleString() },
        //   { particulars: 'Premium', description: Math.round(this.quote.locationBasedCovers.quoteLocationOccupancy.totalPremium).toLocaleString() },
        //   { particulars: 'Product', description: (this.quote.productId as unknown as productId).categoryId.name },
        //   { particulars: 'Sector', description: (this.quote.sectorId as SectorId).name },
        //   { particulars: 'Sector Average', description: 'Derived from the database available with based on the nature of business akin to yours' },
        //   { particulars: 'Market Average', description: 'Derived from the database available with based on the type of insurance product across all industries/sectors.' },
        // );
      }
    })

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto
        this.totalPermimum = (this.quoteOptionData["locationBasedCovers"].quoteLocationOccupancy["totalPremium"]);
        this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, AllowedAddonCoverCategory.PROPERTY_DAMAGE)
        this.preparedFor = [];
        this.preparedFor.push(
          { particulars: 'Name of Insured', description: (this.quote.clientId as IClient).name },
          { particulars: 'Correspondence Address', description: this.quote.clientAddress },
          { particulars: 'Rick Location', description: 'PLOT NO. 102, YASHWANT GHADGE NAGAR, GANESH KHIND ROAD, RANGE HILL CORNER, PUNE, MAHARASHTRA-411007' },
          { particulars: 'Policy Renewal From', description: '27 May 2018' },
          { particulars: 'Policy Renewal To', description: '26 May 2019' },
          { particulars: "Insurer's Name", description: (this.quote.partnerId as unknown as partnerId).name },
          { particulars: 'Occupancy', description: 'Places of worships, Libraries, Museums, Schools, Colleges, Hospitals including X-ray and other, Diagnostic clinics, Office premises, Meeting Rooms, Auditoriums, Planetarium, Mess Houses, Clubs, Marriage Halls, Showrooms and display centres where goods are kept for display and no sales are carried out, Educational and Research Institutes imparting training in various crafts, Lodging/Boarding Houses, Cycle Shed and Dish Antenna, Indoor stadiums' },
          { particulars: 'Policy Number', description: '1001/131803120/00/000' },
          { particulars: 'Sum Insured', description: (this.quoteOptionData.totalSumAssured).toLocaleString() },
          { particulars: 'Premium', description: Math.round(this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.totalPremium).toLocaleString() },
          { particulars: 'Product', description: (this.quote.productId as unknown as productId).categoryId.name },
          { particulars: 'Sector', description: (this.quote.sectorId as SectorId).name },
          { particulars: 'Sector Average', description: 'Derived from the database available with based on the nature of business akin to yours' },
          { particulars: 'Market Average', description: 'Derived from the database available with based on the type of insurance product across all industries/sectors.' },
        );
      }
    });

  }

  ngOnInit(): void {
    const parentParamMap = this.activateRoute.snapshot.params['quote_id'];
    this.quoteId = parentParamMap;
    console.log(this.quote);
    // this.getAllCovers()
  }

  // Old_Quote
  // printpdf() {
  //   if (this.quote) setTimeout(() => {
  //     (window).print();
  //   }, 1000)
  // }

  // New_Quote_Option
  printpdf() {
    if (this.quoteOptionData) setTimeout(() => {
      (window).print();
    }, 1000)
  }

  getAllCovers() {
    let temp = {
      quoteLocationAddonCoverId: '',
      sumInsured: ''
    }
    // temp.quoteLocationAddonCoverId = data._id;
    // temp.sumInsured = data.sumInsured;

    this.quoteService.getComputeAddons(temp).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.covers.forEach(item => {
          if (item._id == dto.data.entity._id) {
            item.calculatedIndicativePremium = dto.data.entity.calculatedIndicativePremium;
          }
        })
      },
      error: e => {
        console.log(e);
      }
    });
  }
  selectedAddonCoverType;
  // Old_Quote
  // applyFilterOnAddonCovers(quote: IQuoteSlip, type: AllowedAddonCoverCategory) {

  //   if (quote?._id && quote.locationBasedCovers?.quoteLocationOccupancy?._id) {

  //     this.selectedAddonCoverType = type;

  //     localStorage.setItem(`${quote._id}.${quote.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`, type)

  //     this.flexaCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free');

  //     this.FreeCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid');
  //     this.selectedConditionalFreeCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && (item.addOnCoverId.addonTypeFlag == 'Condition Fix Paid' || item.addOnCoverId.addonTypeFlag == 'Condition Perc Paid')).map(item => item.addOnCoverId.name);
  //     console.log(this.sector);
  //     this.conditionalFreeCovers = this.FreeCovers.filter(item => item.addOnCoverId?.sectorId.name == this.sector)
  //     console.log(this.FreeCovers);
  //     console.log(this.conditionalFreeCovers);


  //     this.coditionalCoversGoodToHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Good to Have");
  //     this.coditionalCoversCouldHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Could Have");
  //     this.coditionalCoversMustHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Must Have");

  //     this.sectorAvgPaidCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item?.addOnCoverId?.addonTypeFlag == 'Paid');
  //     this.selectedSectorAvgPaidCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);
  //   }

  // }

  // New_Quote_option
  applyFilterOnAddonCoversForQuoteOption(quoteOption: IQuoteOption, type: AllowedAddonCoverCategory) {

    if (quoteOption?._id && quoteOption.locationBasedCovers?.quoteLocationOccupancy?._id) {

      this.selectedAddonCoverType = type;

      localStorage.setItem(`${quoteOption._id}.${quoteOption.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`, type)

      this.flexaCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free');

      this.FreeCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid');
      this.selectedConditionalFreeCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && (item.addOnCoverId.addonTypeFlag == 'Condition Fix Paid' || item.addOnCoverId.addonTypeFlag == 'Condition Perc Paid')).map(item => item.addOnCoverId.name);
      this.conditionalFreeCovers = this.FreeCovers.filter(item => item.addOnCoverId?.sectorId.name == this.sector)
      this.coditionalCoversGoodToHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Good to Have");
      this.coditionalCoversCouldHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Could Have");
      this.coditionalCoversMustHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Must Have");

      this.sectorAvgPaidCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item?.addOnCoverId?.addonTypeFlag == 'Paid');
      this.selectedSectorAvgPaidCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);

          // this.coditionalCoversGoodToHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Good to Have");
          // this.coditionalCoversCouldHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Could Have");
          // this.coditionalCoversMustHave = this.conditionalFreeCovers.filter(obj => obj.addOnCoverId.categoryOfImportance === "Must Have");
          function removeDuplicates(array, keyExtractor) {
            let seen = new Set();
            return array.filter(item => {
                let key = keyExtractor(item);
                return seen.has(key) ? false : seen.add(key);
            });
        }
        
        function keyExtractor(item) {
            return item.addOnCoverId.name;
        }
        this.coditionalCoversMustHave = removeDuplicates(this.coditionalCoversMustHave, keyExtractor);
        this.coditionalCoversCouldHave = removeDuplicates(this.coditionalCoversCouldHave, keyExtractor)
        this.coditionalCoversGoodToHave = removeDuplicates(this.coditionalCoversGoodToHave, keyExtractor)

    }

  }
  navigateBack($event){
    // this.router.navigate([`backend/quotes/${this.quoteId}/requisition`]);
    let totaltabsLength : number = +localStorage.getItem("tabsLength") || 4;
    
    this.router.navigate([`backend/quotes/${this.quoteId}/requisition`], {
      queryParams: {
        ...this.activateRoute.snapshot.queryParams,
        ...{ tab: totaltabsLength}
      }
    });
  }

}
