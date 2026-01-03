import { IOccupancyRate } from 'src/app/features/admin/occupancy-rate/occupancy-rate.model';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { IIndustryType } from "../../industry-type/industry-type.model";
import { IndustryTypeService } from "../../industry-type/industry-type.service";
import { IProduct } from "../../product/product.model";
import { ProductService } from "../../product/product.service";
import { ITerrorismRate } from "../terrorism-rate.model";
import { TerrorismRateService } from "../terrorism-rate.service";
import { LazyLoadEvent } from "primeng/api";
import { AllowedRoles, IRole } from "../../role/role.model";
import { PartnerService } from "../../partner/partner.service";
import { AllowedPartnerTypes, IPartner } from "../../partner/partner.model";
import { AccountService } from "src/app/features/account/account.service";
import { IUser } from "../../user/user.model";
import { OccupancyRateService } from "../../occupancy-rate/occupancy-rate.service";
import { SectorService } from '../../sector/sector.service';
import { ISector } from '../../sector/sector.model';

@Component({
  selector: "app-terrorism-rate-form",
  templateUrl: "./terrorism-rate-form.component.html",
  styleUrls: ["./terrorism-rate-form.component.scss"]
})
export class TerrorismRateFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  isHide:boolean = true;
  isHideBulidingandContent:boolean = false;
  recordSingularName = "Terrorism Rate";
  recordPluralName = "Terrorism Rates";
  modulePath: string = "/backend/admin/terrorism-rates";

  optionsProducts: ILov[] = [];
  optionsIndustryType: ILov[] = [];
  optionOccupancy: ILov[] = [];

  role: IRole
  AllowedRoles = AllowedRoles


  // To Show Options of partners
  optionsPartners: ILov[] = [];
  searchOptionsPartners: any
  optionsSectors: ILov[] = [];

  user: IUser;

  minSelectableDate: Date;

  constructor(
    private recordService: TerrorismRateService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private breadcrumbService: AppBreadcrumbService,
    private industryTypeService: IndustryTypeService,
    private router: Router,
    private formBuilder: FormBuilder,
    public partnerService: PartnerService,
    private accountService: AccountService,
    private occupancyRateService : OccupancyRateService,
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
        next: (dto: IOneResponseDto<ITerrorismRate>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" }
            // {
            //     label: `${dto.data.entity.name}`,
            //     routerLink: [`${this.modulePath}/new`],
            // },
          ]);

          this.createForm(dto.data.entity);
          // <!--This is for only for Griha Lite Start-->
          const product = dto.data.entity?.productId as IProduct
          this.hideRate({ label: product.type, value: product._id,shortName:product.shortName,isBuildingAndContent:product.isBuildingAndContentWiseRate });
          // <!--This is for only for Griha Lite End-->
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

  createForm(terrorismRate?: ITerrorismRate) {

    const product: IProduct = terrorismRate?.productId as IProduct;
    const industryType = terrorismRate?.industryTypeId as IIndustryType;
    const partner = terrorismRate?.partnerId as IPartner;
    const occupancy = terrorismRate?.occupancyId as IOccupancyRate
    const sector = terrorismRate?.sectorId as ISector

    console.log(partner)

    this.recordForm = this.formBuilder.group({
      _id: [terrorismRate?._id],
      // industryTypeId: [industryType ? { label: industryType.industryTypeName, value: industryType._id } : null, [Validators.required]],
      sectorId: [sector ? { label: sector.name, value: sector._id } : null],
      occupancyId : [occupancy ? { label: occupancy?.occupancyType, value: occupancy?._id } : null],
      fromSI: [{value : terrorismRate?.fromSI,disabled :this.mode == 'edit'}],
      toSI: [{value : terrorismRate?.toSI,disabled :this.mode == 'edit'}, [Validators.min(0)]],
      ratePerMile: [terrorismRate?.ratePerMile, [Validators.min(0)]],      
      addValue: [{value :terrorismRate?.addValue, disabled :this.mode == 'edit' }, [Validators.min(0)]],
      remark: [{value : terrorismRate?.remark, disabled :this.mode == 'edit'}],
      productId: [product ? { label: product.type, value: product._id } : null,[Validators.required]],
      applicableTo: [terrorismRate?.applicableTo ? String(terrorismRate?.applicableTo).split('T')[0] : null],
      applicableFrom: [terrorismRate?.applicableFrom ? String(terrorismRate?.applicableFrom).split('T')[0] : new Date],
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      taskStatus : [{value : terrorismRate?.taskStatus,disabled : true}] ,
      failedMessage : [{value : terrorismRate?.failedMessage,disabled : true}],
      bulidingRatePerMile:[terrorismRate?.bulidingRatePerMile,[Validators.required,Validators.min(0)]],
      contentRatePerMile:[terrorismRate?.contentRatePerMile,[Validators.required ,Validators.min(0)]]
    });
  }
  get fromSI(){
    return this.recordForm.get('fromSI');
  }
  saveRecord() {
    // console.log(this.userForm.value);
    this.recordService.setFilterValueExist(true);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      console.log(updatePayload)
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      updatePayload["industryTypeId"] = this.recordForm.value["industryTypeId"].value;
      // if(this.recordForm.value["occupancyId"]!=null) updatePayload["occupancyId"] = this.recordForm.value["occupancyId"].value;
      updatePayload["occupancyId"] = this.recordForm?.value["occupancyId"]?.value;

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

  searchOptionsProducts(event) {
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
        this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id, isBuildingAndContent:entity.isBuildingAndContentWiseRate }));
      },
      error: e => { }
    });
  }

  searchOptionsIndustryType(event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 200,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        industryTypeName: [
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
    this.industryTypeService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsIndustryType = data.data.entities.map(entity => ({ label: entity.industryTypeName, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsOccupancy(event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        occupancyType: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "or"
          },
        ],
        // @ts-ignore
        partnerId: [
          {
            value: this.recordForm.controls['partnerId'].value?.value,
            matchMode: "equals",
            operator: "and"
          }
        ],
        // @ts-ignore
        productId: [
          {
            value: this.recordForm.controls['productId'].value?.value,
            matchMode: "equals",
            operator: "and"
          }
        ],
        // @ts-ignore
        active: [
          {
            value: true,
            matchMode: "equals",
            operator: "and"
          }
        ],
      },
      globalFilter: null,
      multiSortMeta: null
    }

    this.occupancyRateService.getMany(lazyLoadEvent).subscribe({
        next: data => {
            // this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
            this.optionOccupancy = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));
    
        },
        error: e => { }
    });
}
// <!--This is for only for Griha Lite Start-->
hideRate(val:any){
  if(val.isBuildingAndContent == true){
      this.isHide = false;
      this.isHideBulidingandContent = true;
      this.recordForm.get(['ratePerMile']).clearValidators();
      this.recordForm.get(['bulidingRatePerMile']).setValidators([Validators.required]);
      this.recordForm.get(['contentRatePerMile']).setValidators([Validators.required]);
  }else{
          this.isHide = true;
          this.isHideBulidingandContent = false;
          this.recordForm.get(['ratePerMile']).setValidators([Validators.required]);
          this.recordForm.get(['bulidingRatePerMile']).clearValidators();
          this.recordForm.get(['contentRatePerMile']).clearValidators();
      }   
      this.recordForm.get(['ratePerMile']).updateValueAndValidity();
      this.recordForm.get(['bulidingRatePerMile']).updateValueAndValidity();
      this.recordForm.get(['contentRatePerMile']).updateValueAndValidity();
}

get ratePerMile() {
  return this.recordForm.get('ratePerMile');
}
get bulidingRatePerMile() {
  return this.recordForm.get('bulidingRatePerMile');
} 
get contentRatePerMile() {
  return this.recordForm.get('contentRatePerMile');
}  
// <!--This is for only for Griha Lite End-->

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


}
