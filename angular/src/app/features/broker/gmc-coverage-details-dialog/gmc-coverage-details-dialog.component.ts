import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ILov, FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { ToWords } from 'to-words';
import { ICity } from '../../admin/city/city.model';
import { CityService } from '../../admin/city/city.service';
import { IClientLocation } from '../../admin/client-location/client-location.model';
import { ClientLocationService } from '../../admin/client-location/client-location.service';
import { ICountry } from '../../admin/country/country.model';
import { ICoverageType } from '../../admin/coverageTypes/coveragetypes.model';
import { CoverageTypesService } from '../../admin/coverageTypes/coveragetypes.service';
import { IGmcCoverages } from '../../admin/gmc-master/gmc-master.model';
import { IOccupancyRate } from '../../admin/occupancy-rate/occupancy-rate.model';
import { OccupancyRateService } from '../../admin/occupancy-rate/occupancy-rate.service';
import { IPincode } from '../../admin/pincode/pincode.model';
import { PincodeService } from '../../admin/pincode/pincode.service';
import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from '../../admin/quote-location-occupancy/quote-location-occupancy.service';
import { IEmployeesDemoSummary, IQuoteSlip } from '../../admin/quote/quote.model';
import { IState } from '../../admin/state/state.model';
import { StateService } from '../../admin/state/state.service';
import { UploadStepWiseExcelForQuoteComponent } from '../../quote/components/upload-step-wise-excel-for-quote/upload-step-wise-excel-for-quote.component';
import { CountryService } from '../../service/countryservice';
import { GmEmloyeesService } from '../quote-gmc-employeeview-dialog/gmc-employess-service';
import { QuoteService } from '../../admin/quote/quote.service';
import { IProductWiseAge } from '../../admin/product-wise-age-master/product-wise-age.model';
import { ProductWiseAgeService } from '../../admin/product-wise-age-master/product-wise-age.service';
import { CoverageTypesFormComponent } from '../../admin/coverageTypes/coveragetypes-form/coveragetypes-form.component';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-gmc-coverage-details-dialog',
  templateUrl: './gmc-coverage-details-dialog.component.html',
  styleUrls: ['./gmc-coverage-details-dialog.component.scss']
})
export class GmcCoverageDetailsDialogComponent implements OnInit {
  quote_id: string;

  optionsClientLocations: ILov[] = [];

  occupancies: IOccupancyRate[];

  selectedClientLocation: ILov
  selectedOccupancyRate: IOccupancyRate;
  mode: FormMode = "new";

  productCarouselArray: ICoverageType[];
  responsiveOptions;
  // toWords = new ToWords();

  isCreateClientLocation: boolean

  totalRecords: number;
  loading: boolean;
  sumInsured: number;

  search: string = '';
  isMaster: boolean;

  toWords = new ToWords();

  public userQuestion: string;
  userQuestionUpdate = new Subject<string>();

  optionsStates: ILov[] = [];
  optionsCities: ILov[] = [];
  optionsPincodes: ILov[] = [];
  optionsCountries: ILov[] = [];
  showCols: boolean = false

  recordForm: FormGroup;
  submitted: boolean = false;
  ageSlabs: IProductWiseAge[];

  employeeInfo: IEmployeesDemoSummary[] = [];
  importOptions: MenuItem[];
  coverageInfo:string=""
  quote: IQuoteSlip;
  selectedCoverageType: ICoverageType;
  totalLivesCount: number = 0;
  load1: boolean = false;
  load2: boolean = false;
  fileUploadType: string = ""

  constructor(

    private clientLocationService: ClientLocationService,
    private occupancyRateService: OccupancyRateService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,

    private stateService: StateService,
    private cityService: CityService,
    private pincodeService: PincodeService,
    private countryService: CountryService,
    private formBuilder: FormBuilder,

    private appService: AppService,

    private dialogService: DialogService,
    private employeeService: GmEmloyeesService,
    private coverageTypesService: CoverageTypesService,
    private quoteService: QuoteService,
    private slabService: ProductWiseAgeService
  ) {
    this.quote_id = this.activatedRoute.snapshot.paramMap.get("id");

    this.quote = this.config.data.quote;
    this.fileUploadType = this.config.data.fileUploadType;
    this.userQuestionUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        //   this.consoleMessages.push(value);
        this.search = value;
        this.loadData();

      });
  }
  getEmployeesDemographySummary() {
    let payload = {};
    payload['quoteId'] = this.config.data.quote?._id;
    payload['fileType'] = this.fileUploadType;
    this.quoteService.viewEmployeesSummary(payload).subscribe({
      next: summary => {
        if (summary.status == "success") {
          this.employeeInfo = summary.data.entities;
          this.calculateTotalCount();
        } else {
          this.messageService.add({
            severity: 'fail',
            summary: "Failed to Show",
            detail: `${summary.status}`, //"error" TODO: Check
          })
        }
      }
    })
  }
  ngOnInit(): void {
    if (this.quote.productId["type"].toLowerCase() === "group health policy" || this.quote.productId["type"].toLowerCase() === "group health policy top up") {
      this.showCols = true;
    }
    this.createForm();
    this.getEmployeesDemographySummary()
    this.getCoveragesTypes();

    // this.productCarouselArray = [{
    //   _id: "1", type: "Employee, Spouse, 2 Kids", status: true
    // }, {
    //   _id: "2", type: "Employee Only", status: true
    // }, {
    //   _id: "3", type: "Employee, Spouse, 2 Kids, 2 Parents", status: true
    // }, {
    //   _id: "4", type: "Employee, Spouse, 2 Kids, 2 Parents/In Laws", status: true
    // }, {
    //   _id: "5", type: "2 Parents In Laws", status: true
    // }, {
    //   _id: "6", type: "Employee, Spouse, 2 Kids/Siblings, 2 Parents/In Laws", status: true
    // }]

  }
  formSubmit() {

  }

  getCoveragesTypes() {
    this.coverageTypesService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        console.log(records);
        let ebPlan = this.quote.ebPlan == 'Non Employer Employee' ? false : true;
        if (this.quote.productId["type"].toLowerCase() === "group health policy" || this.quote.productId["type"].toLowerCase() === "group health policy top up") {

          this.productCarouselArray = records.data.entities.filter(x=>x.isEmployer == ebPlan);
        }
        else {
          this.productCarouselArray = records.data.entities.filter(x => (x.abbreviation == "E" || x.abbreviation == "ES" || x.abbreviation == "S" || x.abbreviation == "SS" ) && x.isEmployer == ebPlan);
        }

        if (this.productCarouselArray.length > 0) {
          console.log(this.quote?.employeeDataId['coverageTypeId'])
          if (this.quote?.employeeDataId['coverageTypeId'] != null && this.quote?.employeeDataId['coverageType'] != null) {
            this.selectedCoverageType = this.productCarouselArray.find(x => x._id == this.quote?.employeeDataId['coverageTypeId'] && x.abbreviation == this.quote?.employeeDataId['coverageType']);
          }
          this.coverageInfo = this.quote?.employeeDataId['coverageInfo']
        }
        this.load1 = true;
        if (this.load1 == true && this.load2 == true) {
          this.calculateTotalCount();
        }
        this.loadProductRecords()
      },
      error: e => {
        console.log(e);
      }
    });
  }


  loadProductRecords() {
    this.slabService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        console.log(records);
        this.ageSlabs = records.data.entities.filter(x => x.productId == this.quote?.productId);
      },
      error: e => {
        console.log(e);
      }
    });
    //this.productCarouselArray[j].push(this.products[i])
  }

  calculateCount(fromage: number, toage: number, relation: string) {
    let count = this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == relation && (x.age > fromage && x.age <= toage)).length;
    return count > 0 ? count : 0
  }


  calculateTotalCount() {

    if (this.selectedCoverageType != null) {
      const fileUploadType = this.quote.employeeDataId?.['fileUploadType'];
      if (fileUploadType == "Aggregate") {
        this.totalLivesCount = this.quote.employeeDataId['aggregateData'].length;
      }
      else {
        this.totalLivesCount = this.quote.employeeDataId['employeeData'].length;
      }
      //Calculate Count
      let substrCoverageTypeEmployee = 'E'
      let substrCoverageTypeSpouse = 'S'
      let substrCoverageTypeChild = 'C'
      let substrCoverageTypeSibling = 'L'
      let substrCoverageTypeParent = 'P'

      this.employeeInfo.forEach(element => {
        this.totalLivesCount = 0;
        if (this.selectedCoverageType.abbreviation.includes(substrCoverageTypeEmployee)) {
          this.totalLivesCount = this.totalLivesCount + element.selfCount;
        }
        if (this.selectedCoverageType.abbreviation.includes(substrCoverageTypeSpouse)) {
          this.totalLivesCount = this.totalLivesCount + element.spouseCount;
        }
        if (this.quote.productId["type"].toLowerCase() === 'group health policy') {
          if (this.selectedCoverageType.abbreviation.includes(substrCoverageTypeChild)) {
            this.totalLivesCount = this.totalLivesCount + element.childCount;
          }
          if (this.selectedCoverageType.abbreviation.includes(substrCoverageTypeSibling)) {
            this.totalLivesCount = this.totalLivesCount + element.siblingsCount;
          }
          if (this.selectedCoverageType.abbreviation.includes(substrCoverageTypeParent)) {
            this.totalLivesCount = this.totalLivesCount + element.parentCount;
          }
        }
      });
    }
    else {
      const fileUploadType = this.quote.employeeDataId?.['fileUploadType'];
      if (fileUploadType == "Aggregate") {
        this.totalLivesCount = this.quote.employeeDataId['aggregateData'].length;
      }
      else {
        this.totalLivesCount = this.quote.employeeDataId['employeeData'].length;
      }
    }
  }

  checkCoverageType(selectedCoverageType: string, employeeInfo: IEmployeesDemoSummary[]) {
    // Calculate the sum of all counts in the employeeInfo array
    let totalSelfCount = 0
    let totalSpouseCount = 0
    let totalChildCount = 0
    let totalParentCount = 0
    let totalSiblingsCount =

      totalSelfCount = employeeInfo.reduce((sum, info) => sum + info.selfCount, 0);
    totalSpouseCount = employeeInfo.reduce((sum, info) => sum + info.spouseCount, 0);
    totalChildCount = employeeInfo.reduce((sum, info) => sum + info.childCount, 0);
    totalParentCount = employeeInfo.reduce((sum, info) => sum + info.parentCount, 0);
    totalSiblingsCount = employeeInfo.reduce((sum, info) => sum + info.siblingsCount, 0);

    if (selectedCoverageType === 'ESCP' && (totalParentCount === 0 || totalSelfCount === 0)) {
      alert('Parent count is 0 or total self count is 0');
      this.messageService.add({
        severity: "fail",
        summary: "Fail",
        detail: "Parent count is 0 or total self count is 0",
        life: 3000
      });
    }
    else if (selectedCoverageType === 'ESC' && (totalChildCount === 0 || totalSpouseCount === 0)) {
      this.messageService.add({
        severity: "fail",
        summary: "Fail",
        detail: "Child count or spouse is 0",
        life: 3000
      });
    }
    else if (selectedCoverageType === 'ES' && totalSpouseCount === 0) {
      this.messageService.add({
        severity: "fail",
        summary: "Fail",
        detail: "Spouse count is 0",
        life: 3000
      });
    }
    else if (selectedCoverageType === 'E' && totalSelfCount === 0) {
      this.messageService.add({
        severity: "fail",
        summary: "Fail",
        detail: "Self count is 0",
        life: 3000
      });
    }
    else if (selectedCoverageType === 'ESCPL' &&
      (totalSelfCount === 0 || totalSpouseCount === 0 || totalChildCount === 0 || totalParentCount === 0 || totalSiblingsCount === 0)) {
      this.messageService.add({
        severity: "fail",
        summary: "Fail",
        detail: "One or more counts (Self, Spouse, Child, Parent, Siblings) are 0",
        life: 3000
      });
    }
  }

  updateEmpCoveraegs(value: ICoverageType) {

    this.selectedCoverageType = value;
    this.checkCoverageType(this.selectedCoverageType.abbreviation, this.employeeInfo);
    const emp_id = this.quote?.employeeDataId['_id'];
    const coverageType = this.productCarouselArray.find(p => p._id == this.selectedCoverageType._id).abbreviation;
    const updatePayload = {
      _id: this.quote?.employeeDataId['_id'],
      employeeData: this.quote?.employeeDataId['employeeData'],
      quoteId: this.quote?.employeeDataId['quoteId'],
      filePath: this.quote?.employeeDataId['filePath'],
      coverageType: coverageType,
      coverageTypeId: this.selectedCoverageType._id,
      coverageInfo:this.coverageInfo
    }

    //updatePayload['coverageType']=coverageType;
    this.employeeService.update(emp_id, updatePayload)
      .subscribe({
        next: res => {
          this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
              this.quote = dto.data.entity;
              this.calculateTotalCount();
              this.load2 = true;
              if (this.load1 == true && this.load2 == true) {
                this.calculateTotalCount();
              }
            },
            error: e => {
              console.log(e);
            }
          });
        },
        error: e => {
          console.log(e.error);
          this.messageService.add({
            severity: "fail",
            summary: "Fail",
            detail: e.error.message,
            life: 3000
          });
        }
      });
  }

  setSearch(value) {
    this.search = value;
    this.loadData();
  }

  setSumInsured(value) {
    this.sumInsured = value;
  }

  selectClientLocation(value) {
    this.selectedClientLocation = value
  }

  selectOccupancyRate(occupancy) {
    console.log(occupancy)
    this.selectedOccupancyRate = occupancy;
    // console.log(this.selectedOccupancyRate)
  }

  getChildCount() {
    let count = this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Child' && (x.age <= 18)).length
    return this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Child' && (x.age <= 18)).length

  }

  get19to35Count() {
    let count = this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Self' && (x.age > 18 && x.age <= 35)).length;
    return count > 0 ? count : 0
  }
  get36to45Count() {
    let count = this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Self' && (x.age > 35 && x.age <= 45)).length
    return count > 0 ? count : 0
  }
  get46to55Count() {
    let count = this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Self' && (x.age > 45 && x.age <= 55)).length
    return count > 0 ? count : 0
  }
  get56to65Count() {
    let count = this.quote.employeeDataId['employeeData'].filter(x => x.relationShip == 'Self' && (x.age > 55 && x.age <= 65)).length
    return count > 0 ? count : 0
  }


  get19to35SpouseCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Spouse' && (x.age > 18 && x.age <= 35)).length
    return count > 0 ? count : 0
  }
  get36to45SpouseCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Spouse' && (x.age > 35 && x.age <= 45)).length
    return count > 0 ? count : 0
  }
  get46to55SpouseCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Spouse' && (x.age > 45 && x.age <= 55)).length
    return count > 0 ? count : 0
  }
  get56to65SpouseCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Spouse' && (x.age > 55 && x.age <= 65)).length
    return count > 0 ? count : 0
  }

  get0to18KidsCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Child' && (x.age > 0 && x.age <= 18)).length
    return count > 0 ? count : 0
  }
  get19to30KidsCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Child' && (x.age > 18 && x.age <= 30)).length
    return count > 0 ? count : 0
  }

  // get19to35ParentCount() {
  //   let count =
  //     this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Parent' && (x.age > 18 && x.age <= 35)).length
  //   return count > 0 ? count : 0
  // }
  // get36to45ParentCount() {
  //   let count =
  //     this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Parent' && (x.age > 35 && x.age <= 45)).length 
  //   return count > 0 ? count : 0
  // }
  get46to55ParentCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Parent' && (x.age > 45 && x.age <= 55)).length
    return count > 0 ? count : 0
  }
  get56to65ParentCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Parent' && (x.age > 55 && x.age <= 65)).length
    return count > 0 ? count : 0
  }

  get66to75ParentCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Parent' && (x.age > 65 && x.age <= 75)).length
    return count > 0 ? count : 0
  }

  get76to85ParentCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Parent' && (x.age > 75 && x.age <= 85)).length
    return count > 0 ? count : 0
  }


  get19to35SiblingsCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Siblings' && (x.age > 18 && x.age <= 35)).length
    return count > 0 ? count : 0
  }
  get36to45SiblingsCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Siblings' && (x.age > 35 && x.age <= 45)).length
    return count > 0 ? count : 0
  }
  get46to55SiblingsCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Siblings' && (x.age > 45 && x.age <= 55)).length
    return count > 0 ? count : 0
  }
  get56to65SiblingsCount() {
    let count =
      this.quote.employeeDataId['employeeData'].filter(x => x.relationShip.trim() == 'Siblings' && (x.age > 55 && x.age <= 65)).length
    return count > 0 ? count : 0
  }

  loadData() {
    console.log("loadUsers:");

    // if (this.search != '') {
    //     event.filters = { global: { value: this.search, matchMode: 'contains' } }
    // }
    console.log(this.config.data)

    if (this.config.data?.quoteLocationOccupancyId) {
      this.mode = "edit";
      this.loadQuoteLocationOccupancy(this.config.data?.quoteLocationOccupancyId)
    }

    this.loading = true;
    this.occupancyRateService.getMatching({
      search: this.search,
      quoteId: this.config.data.quote_id,
      isMaster: this.isMaster,

    }).subscribe({
      next: records => {
        console.log(records);

        this.occupancies = records.data.entities;
        this.totalRecords = records.results;
        this.loading = false;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadQuoteLocationOccupancy(quoteLocationOccupancyId: string) {
    this.quoteLocationOccupancyService.get(quoteLocationOccupancyId).subscribe({
      next: (dto: IOneResponseDto<IQuoteLocationOccupancy>) => {
        //   this.createForm(dto.data.entity);

        let record: IQuoteLocationOccupancy = dto.data.entity as IQuoteLocationOccupancy;
        let clientLocation: IClientLocation = record.clientLocationId as IClientLocation;
        let occupancyRate: IOccupancyRate = record.occupancyId as IOccupancyRate;

        console.log(clientLocation)
        this.selectedOccupancyRate = occupancyRate;

        this.selectedClientLocation = { value: clientLocation._id, label: clientLocation?.locationName };
        this.sumInsured = record.sumAssured;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  createForm(clientLocation?: IClientLocation) {

    this.recordForm = this.formBuilder.group({
      _id: [null],
      locationName: [null, [Validators.pattern("^[a-zA-Z0-9_.-]*$")]],
      address: [null, [Validators.required]],
      pincodeId: [null, [Validators.required]],
      cityId: [{ value: null }, [Validators.required]],
      stateId: [{ value: null }, [Validators.required]],
      countryId: [{ value: null }, [Validators.required]],
      isHeadOffice: [false],
    });

    this.recordForm.controls['pincodeId'].valueChanges.subscribe(pincode => {

      if (pincode) {

        this.pincodeService.get(pincode.value).subscribe({
          next: (dto: IOneResponseDto<IPincode>) => {
            console.log(dto.data.entity);

            const pincode = dto.data.entity as IPincode

            const city = pincode.cityId as ICity;
            const state = pincode.stateId as IState;
            const country = pincode.countryId as ICountry;

            this.recordForm.controls['cityId'].setValue({ value: city._id, label: city.name });
            this.recordForm.controls['stateId'].setValue({ value: state._id, label: state.name });
            this.recordForm.controls['countryId'].setValue({ value: country._id, label: country.name });
          }
        })
      }
    })

  }



  searchOptionsClientLocations(event) {

    event.filters = {
      // @ts-ignore
      locationName: [
        {
          value: event.query,
          matchMode: "contains",
          operator: "and"
        }
      ],
      // @ts-ignore
      clientId: [
        {
          value: this.config.data.clientId._id,
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


  addCoverage() {

    const emp_id = this.quote?.employeeDataId['_id'];
    const updatePayload = {
      _id: this.quote?.employeeDataId['_id'],
      employeeData: this.quote?.employeeDataId['employeeData'],
      quoteId: this.quote?.employeeDataId['quoteId'],   
      coverageInfo:this.coverageInfo
    }

    //updatePayload['coverageType']=coverageType;
    this.employeeService.update(emp_id, updatePayload)
      .subscribe({
        next: res => {
          this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
              this.quote = dto.data.entity;             
            },
            error: e => {
              console.log(e);
            }
          });
        },
        error: e => {
          console.log(e.error);
          this.messageService.add({
            severity: "fail",
            summary: "Fail",
            detail: e.error.message,
            life: 3000
          });
        }
      });
  }

  addCoveraged(): void {
    // const ref = this.dialogService.open(CoverageTypesFormComponent, {
    //   header: "Add Coverage",
    //   data: {
    //     quote_id: this.quote._id,
    //     quote: this.quote,
    //   },
    //   width: "50vw",
    //   styleClass: "customPopup",
    //   contentStyle: { overflow: 'hidden' }
    // }).onClose.subscribe(() => {
    //   this.getCoveragesTypes();
    // })
  }

  submit() {
    console.log(this.selectedClientLocation)
    console.log(this.selectedOccupancyRate)
    console.log(this.sumInsured)
    console.log(this.config.data.quote_id)


    if (this.selectedClientLocation?.value && this.config.data.quote_id && this.selectedOccupancyRate && this.sumInsured) {

      if (this.mode == 'edit') {

        const payload: IQuoteLocationOccupancy = {
          clientLocationId: this.selectedClientLocation.value,
          quoteId: this.config.data.quote_id,
          occupancyId: this.selectedOccupancyRate._id,
          sumAssured: this.sumInsured,
          flexaPremium: 0,
          STFIPremium: 0,
          earthquakePremium: 0,
          terrorismPremium: 0,
          totalPremium: 0,
          isFlexa: true
        };
        console.log(payload)
        this.quoteLocationOccupancyService.update(this.config.data?.quoteLocationOccupancyId, payload).subscribe({
          next: quote => {
            console.log(quote)
            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: `Risk Location Occupancy Updated`,
              life: 3000
            });
            this.ref.close();
          },
          error: error => {
            console.log(error);
          }
        });
      } else {

        const payload: IQuoteLocationOccupancy = {
          clientLocationId: this.selectedClientLocation.value,
          quoteId: this.config.data.quote_id,
          occupancyId: this.selectedOccupancyRate._id,
          sumAssured: this.sumInsured,
          flexaPremium: 0,
          STFIPremium: 0,
          earthquakePremium: 0,
          terrorismPremium: 0,
          totalPremium: 0,
          isFlexa: true
        };
        console.log(payload)
        this.quoteLocationOccupancyService.create(payload).subscribe({
          next: quote => {
            console.log(quote)

            this.messageService.add({
              severity: "success",
              summary: "Successful",
              detail: `Risk Location Occupancy Created`,
              life: 3000
            });
            this.ref.close();
          },
          error: error => {
            console.log(error);
          }
        });
      }
    } else {

      if (!this.selectedClientLocation?.value) {

        this.messageService.add({
          severity: "warn",
          summary: "Validation",
          detail: `Client Location Is Required`,
          life: 3000
        })
      }

      if (!this.selectedOccupancyRate) {

        this.messageService.add({
          severity: "warn",
          summary: "Validation",
          detail: `Occupancy Is Required`,
          life: 3000
        })
      }

      if (!this.sumInsured) {
        this.messageService.add({
          severity: "warn",
          summary: "Validation",
          detail: `Sum Insured is requried`,
          life: 3000
        })

      }
    }

  }
  submitAndAddOther() {
    if (this.selectedClientLocation?.value && this.config.data.quote_id && this.selectedOccupancyRate && this.sumInsured) {

      const payload: IQuoteLocationOccupancy = {
        clientLocationId: this.selectedClientLocation.value,
        quoteId: this.config.data.quote_id,
        occupancyId: this.selectedOccupancyRate._id,
        sumAssured: this.sumInsured,
        flexaPremium: 0,
        STFIPremium: 0,
        earthquakePremium: 0,
        terrorismPremium: 0,
        totalPremium: 0,
        isFlexa: true
      };
      console.log(payload)
      this.quoteLocationOccupancyService.create(payload).subscribe({
        next: quote => {
          console.log(quote)
          // this.ref.close();
          this.selectedClientLocation = null;
          this.selectedOccupancyRate = null;
          this.sumInsured = null;

          this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Risk Location Occupancy Created`,
            life: 3000
          });
        },
        error: error => {
          console.log(error);
        }
      });
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Validation",
        detail: `Missing Required Fields.`,
        life: 3000
      })
    }

  }

  deleteRecord() {
    this.quoteLocationOccupancyService.delete(this.config.data.quoteLocationOccupancyId).subscribe({
      next: res => {
        this.ref.close();

        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: `Risk Location Occupancy Deleted`,
          life: 3000
        });

        // call the api to fetch the data form user tabel after delete
      },
      error: e => {
        console.log(e)
      }
    });
  }

  openCreateClientLocationDialog() {
    this.isCreateClientLocation = !this.isCreateClientLocation
  }

  createClientLocation() {
    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["stateId"] = this.recordForm.value["stateId"].value;
      updatePayload["cityId"] = this.recordForm.value["cityId"].value;
      updatePayload["pincodeId"] = this.recordForm.value["pincodeId"].value;
      updatePayload["countryId"] = this.recordForm.value["countryId"].value;
      updatePayload["clientId"] = this.config.data.clientId._id;

      this.clientLocationService.create(updatePayload).subscribe({
        next: (dto) => {
          this.isCreateClientLocation = false;
          // this.router.navigateByUrl(`${this.modulePath}`);
        },
        error: error => {
          console.log(error);
        }
      })
    }
  }

  searchOptionsStates(event) {
    this.stateService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsCities(event) {
    this.cityService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
  searchOptionsPincodes(event) {
    this.pincodeService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }


  log(event) {
    console.log(event)
  }

}
