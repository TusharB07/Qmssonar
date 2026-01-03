import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, FormMode, IManyResponseDto } from 'src/app/app.model';
import { IBscFireLossOfProfitCover } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { ICity } from 'src/app/features/admin/city/city.model';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { ClientLocationService } from 'src/app/features/admin/client-location/client-location.service';
import { IClient } from 'src/app/features/admin/client/client.model';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { EmployeeDemographic, IQuoteGmcTemplate, IQuoteSlip, OPTIONS_QUOTE_TYPES } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: 'app-gmc-basic-details',
  templateUrl: './gmc-basic-details.component.html',
  styleUrls: ['./gmc-basic-details.component.scss']
})
export class GmcBasicDetailsComponent implements OnInit {
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
  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate[];
  gmcTemplateData: IGMCTemplate[]
  tabsData: IGMCTemplate[] = []
  employeeDemographic: EmployeeDemographic = new EmployeeDemographic();
  anualTurnOver: string = ""

  quote: IQuoteSlip;

  mode: FormMode = "new";

  optionsIndmenityPeriod: ILov[];
  optionsEarthquakeZones: ILov[] = [];
  optionsTerrorism: any[];
  bscFireLossOfProfit: IBscFireLossOfProfitCover;

  riskStartDate: Date
  basicTable: any
  today: string;
  private router: Router;
  showGPAGTL: boolean = false;
  selectedQuoteLocationOccpancyId: string;
  private currentQuote: Subscription;

  // basicDetailsForm: FormGroup;
  quoteId: string = ''

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    // private config: DynamicDialogConfig,
    private quoteService: QuoteService,

    private clientLocationService: ClientLocationService,
    private fb: FormBuilder,
    //     private config: DynamicDialogConfig,
    private listOfValueService: ListOfValueMasterService,
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    // public ref: DynamicDialogRef,

  ) {
    this.quoteId = this.activatedRoute.parent.snapshot.paramMap.get("quote_id");

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote: IQuoteSlip) => {
        this.quote = quote;
        this.createForm(this.quote);
        if (this.quote?.productId['productTemplate'] != AllowedProductTemplate.GMC) {
          this.showGPAGTL = true
        }
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
      next: (template) => {
        if (template != null) {
          this.selectedQuoteTemplate = template;

          this.basicTable = this.selectedQuoteTemplate[0].gmcBasicDetails.gmcPolicyDetails
          // for (let element of this.selectedQuoteTemplate) {
          //   const dd = element.employeeDemographic
          //   this.employeeDemographic = dd;
          //   if (dd.annualTurnOver != null) {
          //     this.anualTurnOver = dd.annualTurnOver.label
          //   }

          //   this.employeeDemographic = element.employeeDemographic;
          //   const data = this.quote?.employeeDataId["employeeData"];
          //   this.employeeDemographic.livesCount = data.length ?? 0;
          //   if (+this.employeeDemographic.employeeHeadCount > 0) {
          //   }
          //   else {
          //     this.employeeDemographic.employeeHeadCount = data.filter(x => x.relationShip == 'Self').length ?? 0;
          //   }
          //   this.employeeDemographic.empCountProposed = data.filter(x => x.relationShip == 'Self').length ?? 0;
          //   this.employeeDemographic.dependentCountProposed = data.filter(x => x.relationShip != 'Self').length ?? 0;

          //   if (this.quote.quoteType == 'new') {
          //     this.employeeDemographic.employeeHeadCount = data.filter(x => x.relationShip == 'Self').length ?? 0;
          //     this.employeeDemographic.empCountInception = data.filter(x => x.relationShip == 'Self').length ?? 0;
          //     this.employeeDemographic.dependentCountInception = data.filter(x => x.relationShip != 'Self').length ?? 0;                    //this.saveEmpDemographic()
          //   }

          //   const totalLivesDetail = element.gmcBasicDetails.gmcPolicyDetails.find(
          //     (detail) => detail.name === 'Total Lives'
          //   );

          //   const dependantCountDetail = element.gmcBasicDetails.gmcPolicyDetails.find(
          //     (detail) => detail.name === 'Dependant Count'
          //   );

          //   dependantCountDetail.inception = this.employeeDemographic.dependentCountInception

          //   const employeeContDetail = element.gmcBasicDetails.gmcPolicyDetails.find(
          //     (detail) => detail.name === 'Employee Count'
          //   );

          //   employeeContDetail.inception = this.employeeDemographic.empCountInception

          //   if (totalLivesDetail) {
          //     totalLivesDetail.inception = +this.employeeDemographic.empCountInception + +this.employeeDemographic.dependentCountInception;

          //   }

          // }


        }
      }
    })
    this.optionsQuoteType = OPTIONS_QUOTE_TYPES;

    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

    // this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

    // this.quote = this.config.data.quote;

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

    // this.bscFireLossOfProfit = this.config.data.bscFireLossOfProfitCover;

  }




  ngOnInit(): void {
    // this.createForm();

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
        console.log(dto.data.entities)

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



  calculatePremium() {

  }

  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }

  // createForm(item?) {
  //   this.basicDetailsForm = this.formBuilder.group({
  //     insuredName: [item?.clientId?.name],
  //     policyType: [item?.productId?.type],
  //     riskType: [item?.riskType],
  //     policyPeriod: [item?.policyPeriod],
  //   })
  // }

  handleRiskLocationOccupancyChange(event) {
    this.loadData(event.value)


  }

  loadData(quoteLocationOccupancyId: string) {
    this.quoteService.setQuoteLocationOccupancyId(quoteLocationOccupancyId)
  }


  searchOptionsrenewalPolicyPeriod(event) {
    this.listOfValueService.current(AllowedListOfValuesMasters.RENEWAL_POLICY_PERIOD).subscribe({
      next: data => {
        this.optionsrenewalPolicyPeriod = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
        // this.selectedEquipmentType = this.optionsEquipmentType[0];

      },
      error: e => { }
    })
  }

  createForm(quote: IQuoteSlip) {

    console.log(quote)

    const client = quote?.clientId as IClient;
    const product = quote?.productId as IProduct;
    this.basicDetailsForm = this.fb.group({
      insuredName: [client?.name],
      clientLocationId: [null],
      riskType: [product?.type],
      typeofPolicy: [null],
      sumAssured: [quote?.totalSumAssured],
      renewalPolicyPeriod: [quote?.renewalPolicyPeriod],
      crmId: [quote?.crmId],
      insuredBusiness: [client?.natureOfBusiness],
      riskStartDate: [formatDate(this.quote?.riskStartDate, 'yyyy-MM-dd', 'en')],
    })
    console.log("this.basicDetailsForm", this.basicDetailsForm);
  }


  submitInsuredDetails() {


  }

  selectClientLocation(value) {
    this.selectedClientLocation = value
  }

  openCreateClientLocationDialog() {

  }



  searchOptionsClientLocations(event) {

    event.filters = {
      // @ts-ignore
      name: [
        {
          value: event.query,
          matchMode: "startsWith",
          operator: "or"
        }
      ],
      // @ts-ignore
      clientId: [
        {
          // value: this.config.data.clientId._id,
          matchMode: "equals",
          operator: "or"
        }
      ]
    };

    this.clientLocationService.getMany(event).subscribe({
      next: data => {
        this.optionsClientLocations = data.data.entities.map(entity => {
          console.log(entity)
          let city: ICity = entity.cityId as ICity
          let pincode: IPincode = entity.pincodeId as IPincode

          return { label: `${city.name} - ${pincode.name} - ${entity.locationName}`, value: entity._id }
        });
      },
      error: e => { }
    });
  }

  nextPage() {
    this.router.navigateByUrl(`backend/quotes/${this.quoteId}/edit/sum-insured-details`)
  }

}
