import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { IHazardCategory } from "../../hazard-category/hazard-category.model";
import { HazardCategoryService } from "../../hazard-category/hazard-category.service";
import { IProduct } from "../../product/product.model";
import { ProductService } from "../../product/product.service";
import { IOccupancyRate } from "../occupancy-rate.model";
import { OccupancyRateService } from "../occupancy-rate.service";
import { LazyLoadEvent } from "primeng/api";
import { PartnerService } from "../../partner/partner.service";
import { AllowedRoles, IRole } from "../../role/role.model";
import { AllowedPartnerTypes, IPartner } from "../../partner/partner.model";
import { IndustryTypeService } from "../../industry-type/industry-type.service";
import { IIndustryType } from "../../industry-type/industry-type.model";
import { AccountService } from "src/app/features/account/account.service";
import { IUser } from "../../user/user.model";
import { SectorService } from "../../sector/sector.service";
import { ISector } from "../../sector/sector.model";

@Component({
  selector: "app-occupancy-rate-form",
  templateUrl: "./occupancy-rate-form.component.html",
  styleUrls: ["./occupancy-rate-form.component.scss"]
})
export class OccupancyRateFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  isHide:boolean = true;
  isHideBulidingandContent:boolean = false;
  recordSingularName = "Occupancy Rate";
  recordPluralName = "Occupancy Rates";
  modulePath: string = "/backend/admin/occupancy-rates";

  hazardCategoryOptions: ILov[] = []
  optionsProducts: ILov[] = [];

  role: IRole
  AllowedRoles = AllowedRoles


  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners: any

  optionsIndustry : any[]
  optionsSectors: ILov[] = [];
  user: IUser;

  minSelectableDate: Date;
  isHideOption:boolean;

  constructor(
    private recordService: OccupancyRateService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private hazardCategoryService: HazardCategoryService,
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder,
    public partnerService: PartnerService,
    private industryService: IndustryTypeService,
    private accountService: AccountService,
    private sectorService: SectorService,
  ) { 
    this.accountService.currentUser$.subscribe({
      next: (user) => {
          this.role = user.roleId as IRole
          this.user = user
      }
  })
  }

  ngOnInit(): void {

    this.minSelectableDate = new Date();

    this.searchOptionsPartners = ($event) => this.partnerService.searchOptionsPartners($event).then((records) => {
      this.optionsPartners = records
      this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.self)
    })
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IOccupancyRate>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" }
            // {
            //     label: `${dto.data.entity.name}`,
            //     routerLink: [`${this.modulePath}/new`],
            // },
          ]);

          this.createForm(dto.data.entity);
          // This is only for Griha Lite Start
          const product = dto.data.entity?.productId as IProduct
          this.hideRate({ label: product.type, value: product._id,shortName:product.shortName,isBuildingAndContent:product.isBuildingAndContentWiseRate });
          // This is only for Griha Lite End
        },
        error: e => {
          console.log(e);
        }
      });
    } else {
      this.breadcrumbService.setItems([
        { label: "Pages" },
        {
          label: `Add new ${this.recordSingularName}`,
          routerLink: [`${this.modulePath}/new`]
        }
      ]);
    }

    // mode: New
    this.createForm();
  }

  createForm(occupancyRate?: IOccupancyRate) {

    const hazardCategory: IHazardCategory = occupancyRate?.hazardCategoryId as IHazardCategory;
    const product: IProduct = occupancyRate?.productId as IProduct;
    const partner = occupancyRate?.partnerId as IPartner
    const industry = occupancyRate?.industryTypeId as IIndustryType
    const sector = occupancyRate?.sectorId as ISector
    console.log(occupancyRate)


    this.recordForm = this.formBuilder.group({
      _id: [occupancyRate?._id],
      occupancyType: [ {value :occupancyRate?.occupancyType , disabled : this.mode == 'edit'}],
      hazardCategoryId: [hazardCategory ? { label: hazardCategory.category, value: hazardCategory._id } : null],
      gradedRetention: [occupancyRate?.gradedRetention],
      tacCode: [{value : occupancyRate?.tacCode, disabled : this.mode == 'edit'}],
      flexaiib: [occupancyRate?.flexaiib,[Validators.required]],
      stfiRate: [occupancyRate?.stfiRate,[Validators.required]],
      sectorId: [sector ? { label: sector.name, value: sector._id } : null],
      section: [{value :occupancyRate?.section, disabled : this.mode == 'edit'}],
      riskCode: [{value : occupancyRate?.riskCode,  disabled : this.mode == 'edit'}],
      rateCode: [{value : occupancyRate?.rateCode, disabled : this.mode == 'edit'}],
      policyType: [{value : occupancyRate?.policyType, disabled : this.mode == 'edit'}],
      specialRemark: [{value :occupancyRate?.specialRemark, disabled : this.mode == 'edit'}],
      specialExcessGIC: [{value : occupancyRate?.specialExcessGIC, disabled : this.mode == 'edit'}],
      iibOccupancyCode: [{value : occupancyRate?.iibOccupancyCode ,  disabled : this.mode == 'edit'}],
      effectiveFrom: [occupancyRate?.effectiveFrom ? String(occupancyRate?.effectiveFrom).split('T')[0] : null],
      effectiveTo: [occupancyRate?.effectiveTo ? String(occupancyRate?.effectiveTo).split('T')[0] : null],
      applicableFrom: [occupancyRate?.applicableFrom ? String(occupancyRate?.applicableFrom).split('T')[0] : new Date],
      applicableTo: [occupancyRate?.applicableTo ? String(occupancyRate?.applicableTo).split('T')[0] : null],
      productId: [product ? { label: product.type, value: product._id ,max : product?.numberOfYears} : null],
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      taskStatus : [{value : occupancyRate?.taskStatus,disabled : true}] ,
      failedMessage : [{value : occupancyRate?.failedMessage,disabled : true}],
      flexaiibc: [occupancyRate?.flexaiibc],
      maxnumberOfYears:[occupancyRate?.maxnumberOfYears ?? 1, product ? [Validators.max(Number(product?.numberOfYears))] :  []],
      minnumberOfYears:[occupancyRate?.minnumberOfYears ?? 1,occupancyRate?.maxnumberOfYears ? [Validators.max(occupancyRate?.maxnumberOfYears)] : []],
      maxStockSI:[occupancyRate?.maxStockSI ?? 0],
      active: [occupancyRate?.active || false],
      tenurewisestfiRate: [occupancyRate?.tenurewisestfiRate],
      tenurewiseflexaiibc: [occupancyRate?.tenurewiseflexaiibc],
      tenurewiseflexaiib: [occupancyRate?.tenurewiseflexaiib],
      buildingFlexaiib:[occupancyRate?.buildingFlexaiib,[Validators.required]],
      buildingStfiRate:[occupancyRate?.buildingStfiRate,[Validators.required]],
      buildingFlexaiibc:[occupancyRate?.buildingFlexaiibc],
      buildingTenurewiseflexaiib:[occupancyRate?.buildingTenurewiseflexaiib],
      buildingTenurewisestfiRate:[occupancyRate?.buildingTenurewisestfiRate],
      buildingTenurewiseflexaiibc:[occupancyRate?.buildingTenurewiseflexaiibc],
      contentFlexaiib:[occupancyRate?.contentFlexaiib,[Validators.required]],
      contentStfiRate:[occupancyRate?.contentStfiRate,[Validators.required]],
      contentFlexaiibc:[occupancyRate?.contentFlexaiibc],
      contentTenurewiseFlexaiib:[occupancyRate?.contentTenurewiseFlexaiib],
      contentTenurewiseStfiRate:[occupancyRate?.contentTenurewiseStfiRate],
      contentTenurewiseFlexaiibc:[occupancyRate?.contentTenurewiseFlexaiibc],
      opt1Rate:[occupancyRate?.opt1Rate],
      opt2Rate:[occupancyRate?.opt2Rate],
      opt3Rate:[occupancyRate?.opt3Rate],
      opt4Rate:[occupancyRate?.opt4Rate],
    });
    this.recordForm.controls['productId'].valueChanges.subscribe(record => {
      // return min
      console.log(record)
      // if(record.label == 'Erection All Risk'){
      //   this.isHideOption =  true;
      // }else{
      //   this.isHideOption = false;
      // }
      this.recordForm.get('numberOfYears')?.clearValidators()
      this.recordForm.controls['numberOfYears']?.addValidators(Validators.max(record.max));
      this.recordForm.controls['numberOfYears']?.updateValueAndValidity();
      

      // ! Removed as client dont wants it
      // if (form.value['sumInsured'] < min) form.controls['sumInsured'].setValue(min)

  })

  this.recordForm.controls['maxnumberOfYears'].valueChanges.subscribe(record => {
    // return min
    console.log(record)
    this.recordForm.get('minnumberOfYears')?.clearValidators()
    this.recordForm.controls['minnumberOfYears']?.addValidators(Validators.max(record));
    this.recordForm.controls['minnumberOfYears']?.updateValueAndValidity();
    

    // ! Removed as client dont wants it
    // if (form.value['sumInsured'] < min) form.controls['sumInsured'].setValue(min)

})

  }

  saveRecord() {
    // console.log(this.userForm.value);
    this.recordService.setFilterValueExist(true);
    console.log(this.recordForm);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["hazardCategoryId"] = this.recordForm.value["hazardCategoryId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      updatePayload["sectorId"] = this.recordForm.value["sectorId"].value;

      if (this.mode === "edit") {
        this.recordService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.recordService.create(updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }
  }

  onCancel() {
    this.recordService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

  searchHazardCategoryOptions(event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 200,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        category: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "or"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.hazardCategoryService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.hazardCategoryOptions = data.data.entities.map(entity => ({ label: entity.category, value: entity._id }));
      },
      error: e => { }
    });
  }

 searchOptionsProducts (event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 200,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        type: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "or"
          }
        ],
        // @ts-ignore
        status: [
          {
              value: true,
              matchMode: "equals",
              operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.productService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id, shortName:entity.shortName,isBuildingAndContent:entity.isBuildingAndContentWiseRate, max: entity?.numberOfYears ? Number(entity?.numberOfYears) : 10 }));
      },
      error: e => { }
    });
  }


  searchOptionsIndustry (event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 200,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        type: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "or"
          }
        ],
        // @ts-ignore
        active: [
          {
              value: true,
              matchMode: "equals",
              operator: "and"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.industryService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        console.log(data)
        this.optionsIndustry = data.data.entities.map(type => ({label : type.industryTypeName,value: type._id}))
      },
      error: e => { }
    });
  }

  searchOptionsSector(event) {
    let lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
            // @ts-ignore
            name: [
                {
                    value: event.query,
                    matchMode: "startsWith",
                    operator: "or"
                }
            ]
        },
        globalFilter: null,
        multiSortMeta: null
    }
    this.sectorService.getMany(lazyLoadEvent).subscribe({
        next: data => {
            this.optionsSectors = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
        },
        error: e => { }
    });
}
  // <!--This is for only for Griha Lite Start-->
  hideRate(val:any){
    if(val.isBuildingAndContent == true){
        this.isHide = false;
        this.isHideBulidingandContent = true;
        this.recordForm.get(['flexaiib']).clearValidators();
        this.recordForm.get(['stfiRate']).clearValidators();
        // this.recordForm.get(['tenurewisestfiRate']).clearValidators();
        // this.recordForm.get(['tenurewiseflexaiib']).clearValidators();
        this.recordForm.get(['buildingFlexaiib']).setValidators([Validators.required]);
        this.recordForm.get(['buildingStfiRate']).setValidators([Validators.required]);
        // this.recordForm.get(['buildingTenurewiseflexaiib']).setValidators([Validators.required]);
        // this.recordForm.get(['buildingTenurewisestfiRate']).setValidators([Validators.required]);
        this.recordForm.get(['contentFlexaiib']).setValidators([Validators.required]);
        this.recordForm.get(['contentStfiRate']).setValidators([Validators.required]);
        // this.recordForm.get(['contentTenurewiseFlexaiib']).setValidators([Validators.required]);
        // this.recordForm.get(['contentTenurewiseStfiRate']).setValidators([Validators.required]);
    }else{
            this.isHide = true;
            this.isHideBulidingandContent = false;
            this.recordForm.get(['flexaiib']).setValidators([Validators.required]);
            this.recordForm.get(['stfiRate']).setValidators([Validators.required]);
            // this.recordForm.get(['tenurewisestfiRate']).setValidators([Validators.required]);
            // this.recordForm.get(['tenurewiseflexaiib']).setValidators([Validators.required]);
            this.recordForm.get(['buildingFlexaiib']).clearValidators();
            this.recordForm.get(['buildingStfiRate']).clearValidators();
            // this.recordForm.get(['buildingTenurewiseflexaiib']).clearValidators();
            // this.recordForm.get(['buildingTenurewisestfiRate']).clearValidators();
            this.recordForm.get(['contentFlexaiib']).clearValidators();
            this.recordForm.get(['contentStfiRate']).clearValidators();
            // this.recordForm.get(['contentTenurewiseFlexaiib']).clearValidators();
            // this.recordForm.get(['contentTenurewiseStfiRate']).clearValidators();
        }   
        if(val.label == 'Erection All Risk'){
          this.isHideOption =  true;
        }else{
          this.isHideOption = false;
        } 
        this.recordForm.get(['flexaiib']).updateValueAndValidity();
        this.recordForm.get(['stfiRate']).updateValueAndValidity();
        // this.recordForm.get(['tenurewisestfiRate']).updateValueAndValidity();
        // this.recordForm.get(['tenurewiseflexaiib']).updateValueAndValidity();
        this.recordForm.get(['buildingFlexaiib']).updateValueAndValidity();
        this.recordForm.get(['buildingStfiRate']).updateValueAndValidity();
        // this.recordForm.get(['buildingTenurewiseflexaiib']).updateValueAndValidity();
        // this.recordForm.get(['buildingTenurewisestfiRate']).updateValueAndValidity();
        this.recordForm.get(['contentFlexaiib']).updateValueAndValidity();
        this.recordForm.get(['contentStfiRate']).updateValueAndValidity();
        // this.recordForm.get(['contentTenurewiseFlexaiib']).updateValueAndValidity();
        // this.recordForm.get(['contentTenurewiseStfiRate']).updateValueAndValidity();
}

get flexaiib(){
  return this.recordForm.get('flexaiib');
}
get stfiRate(){
  return this.recordForm.get('stfiRate');
}
// get tenurewisestfiRate(){
//   return this.recordForm.get('tenurewisestfiRate');
// }
// get tenurewiseflexaiib(){
//   return this.recordForm.get('tenurewiseflexaiib');
// }
// get buildingTenurewiseflexaiib(){
//   return this.recordForm.get('buildingTenurewiseflexaiib');
// }
// get buildingTenurewisestfiRate(){
//   return this.recordForm.get('buildingTenurewisestfiRate');
// }
get contentFlexaiib(){
  return this.recordForm.get('contentFlexaiib');
}
get contentStfiRate(){
  return this.recordForm.get('contentStfiRate');
}
// get contentTenurewiseFlexaiib(){
//   return this.recordForm.get('contentTenurewiseFlexaiib');
// }
// get contentTenurewiseStfiRate(){
//   return this.recordForm.get('contentTenurewiseStfiRate');
// }
get buildingFlexaiib(){
  return this.recordForm.get('buildingFlexaiib');
}
get buildingStfiRate(){
  return this.recordForm.get('buildingStfiRate');
}
// <!--This is for only for Griha Lite End-->
}
