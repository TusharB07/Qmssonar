import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IQuoteOption, IQuoteSlip, OPTIONS_QUOTE_TYPES } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Subscription } from 'rxjs';
import { IBscFireLossOfProfitCover } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { ClientLocationService } from 'src/app/features/admin/client-location/client-location.service';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { formatDate } from '@angular/common';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { LazyLoadEvent } from 'primeng/api';
import { IClient } from 'src/app/features/admin/client/client.model';
import { IProduct } from 'src/app/features/admin/product/product.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ICity } from 'src/app/features/admin/city/city.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { MessageService } from 'primeng/api';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { ProjectDetailsDialogComponent } from 'src/app/features/broker/project-details-dialog/project-details-dialog.component';
import { ProjectDetailsService } from 'src/app/features/broker/project-details-dialog/project-details.service';
import { IExpiredDetails } from 'src/app/features/broker/expired-details-dialog-form/expired-details-dialog-form.model';



const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-quote-insurer-review-basic-details-tab',
  templateUrl: './quote-insurer-review-basic-details-tab.component.html',
  styleUrls: ['./quote-insurer-review-basic-details-tab.component.scss']
})
export class QuoteInsurerReviewBasicDetailsTabComponent implements OnInit {

  id: string;
  optionsClientLocations: ILov[] = [];
  selectedClientLocation: ILov
  basicDetailsForm: FormGroup;
  cities: any[];
  selectedCities: string = '';
  selectedTypeofPolicy: string = '';
  optionsrenewalPolicyPeriod: ILov[];
  selectedRenewalPolicyPeriod: string = '';
  optionsQuoteLocationOccupancies: ILov[];

  optionsQuoteType: ILov[] = [];
  selectedOption: string;



  quote: IQuoteSlip;

  mode: FormMode = "new";

  optionsIndmenityPeriod: ILov[];
  optionsEarthquakeZones: ILov[] = [];
  optionsTerrorism: any[];
  bscFireLossOfProfit: IBscFireLossOfProfitCover;

  riskStartDate: Date

  today: string;
  private router: Router;

  selectedQuoteLocationOccpancyId: string;
  private currentQuote: Subscription;

  // basicDetailsForm: FormGroup;
  quoteId: string = ''
  buttonDisabled: boolean = true;

  private currentPropertyQuoteOption: Subscription;       // New_Quote_option
  quoteOptionData: IQuoteOption     // New_Quote_option
  quoteOptionId: any;
  projectTenure: any;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private quoteService: QuoteService,
    private clientLocationService: ClientLocationService,
    private fb: FormBuilder,
    private listOfValueService: ListOfValueMasterService,
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    private messageService: MessageService,
    private quoteOptionService: QuoteOptionService,
    private dialogService: DialogService,
    private projectDetailsService:ProjectDetailsService
  ) {
    this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("quote_id");

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
        this.createForm(this.quote);
      }
    })


    this.optionsQuoteType = OPTIONS_QUOTE_TYPES;

    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    this.cities = [
    ];
    this.optionsIndmenityPeriod = [
      { label: '03 Months', value: '03 Months' },
      { label: '06 Months', value: '06 Months' },
      { label: '09 Months', value: '09 Months' },
      { label: '12 Months', value: '12 Months' },
      { label: '18 Months', value: '18 Months' },
    ];
    this.optionsTerrorism = [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ];

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto
      }
    });
    this.quoteOptionId = this.activatedRoute.snapshot?.queryParams?.quoteOptionId;

  }




  ngOnInit(): void {

    this.createForm(this.quote);

    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        clientId: [
          {
            value: this.quote?.clientId,
            matchMode: "equals",
            operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };

    this.clientLocationService.getMany(lazyLoadEvent).subscribe({
      next: (dto: IManyResponseDto<IClientLocation>) => {

        this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IClientLocation) => {
          return { label: `${entity.locationName}`, value: entity._id }
        });

        const headOffice = dto.data.entities.find(((location: IClientLocation) => location.isHeadOffice))

        if (headOffice) {
          this.basicDetailsForm?.controls['clientLocationId'].setValue({ label: headOffice.locationName, value: headOffice._id })
          this.basicDetailsForm?.controls['clientLocationId'].disable()
        }
      },
      error: e => { }
    });

  }





  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

  // handleRiskLocationOccupancyChange(event) {
  //   this.loadData(event.value)

  // }

  // loadData(quoteLocationOccupancyId: string) {
  //   this.quoteService.setQuoteLocationOccupancyId(quoteLocationOccupancyId)
  // }


  // searchOptionsrenewalPolicyPeriod(event) {
  //   this.listOfValueService.current(AllowedListOfValuesMasters.RENEWAL_POLICY_PERIOD).subscribe({
  //     next: data => {
  //       this.optionsrenewalPolicyPeriod = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
  //       // this.selectedEquipmentType = this.optionsEquipmentType[0];

  //     },
  //     error: e => { }
  //   })
  // }

  createForm(quote: IQuoteSlip) {

    const client = quote?.clientId as IClient;
    const product = quote?.productId as IProduct;
    this.basicDetailsForm = this.fb.group({
      insuredName: [client?.name],
      clientLocationId: [null],
      riskType: [product?.type],
      typeofPolicy: [null],
      sumAssured: [this.quoteOptionData?.totalSumAssured],
      renewalPolicyPeriod: [quote?.renewalPolicyPeriod],
      crmId: [quote?.crmId],
      insuredBusiness: [client?.natureOfBusiness],
      riskStartDate: [formatDate(this.quote?.riskStartDate, 'yyyy-MM-dd', 'en')],
      expiredTermPremium: [quote?.expiredTermPremium],
      projectTenure:[this.projectTenure],

    })

    if (this.quote.parentQuoteId) {
      this.buttonDisabled = false
    } else {
      this.buttonDisabled = true
    }
    this.getProjectDetails();
  }


  submitInsuredDetails() {
    let payload = {
      ...this.basicDetailsForm.value,
      totalSumAssured: this.basicDetailsForm.value.sumAssured
    }
    // Old_Quote
    // this.quoteService.update(this.quote._id, payload).subscribe({

    // New_Quote_option
    this.quoteOptionService.update(this.quoteOptionData._id, payload).subscribe({
      next: (dto: IOneResponseDto<any>) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail:'Saved!',
          life: 3000
        })
      },
      error: (e) => {
        console.log(e)
      }
    })

  }

  // selectClientLocation(value) {
  //   this.selectedClientLocation = value
  // }

  // openCreateClientLocationDialog() {

  // }

  // searchOptionsClientLocations(event) {

  //   event.filters = {
  //     // @ts-ignore
  //     name: [
  //       {
  //         value: event.query,
  //         matchMode: "startsWith",
  //         operator: "or"
  //       }
  //     ],
  //     // @ts-ignore
  //     clientId: [
  //       {
  //         // value: this.config.data.clientId._id,
  //         matchMode: "equals",
  //         operator: "or"
  //       }
  //     ]
  //   };

  //   this.clientLocationService.getMany(event).subscribe({
  //     next: data => {
  //       this.optionsClientLocations = data.data.entities.map(entity => {
  //         console.log(entity)
  //         let city: ICity = entity.cityId as ICity
  //         let pincode: IPincode = entity.pincodeId as IPincode

  //         return { label: `${city.name} - ${pincode.name} - ${entity.locationName}`, value: entity._id }
  //       });
  //     },
  //     error: e => { }
  //   });
  // }

  nextPage() {
    this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/sum-insured-details`)
  }

  projectDetails() {
    const ref = this.dialogService.open(ProjectDetailsDialogComponent, {
        header: "Project Details",
        data: {
            quote: this.quote,
            quoteOptionId: this.quoteOptionId,
        },
        width: "60vw",
        styleClass: "customPopup"
    }).onClose.subscribe(() => {
        // this.loadQuoteDetails(this.id);
      })
}

getProjectDetails() {
  let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
          // @ts-ignore
          quoteOptionId: [
              {
                  value: this.quoteOptionId,
                  matchMode: "equals",
                  operator: "and"
              }
          ]
      },
      globalFilter: null,
      multiSortMeta: null
  }
  this.projectDetailsService.getMany(lazyLoadEvent).subscribe({
      next: (dto: IOneResponseDto<IExpiredDetails>) => {
              // this.projectDetailsData = dto.data?.entities;
              this.projectTenure = dto.data?.entities[0]?.projectTenure;
              console.log(this.projectTenure)
      },
      error: e => {
          console.log(e);
      }
  });
}



}
