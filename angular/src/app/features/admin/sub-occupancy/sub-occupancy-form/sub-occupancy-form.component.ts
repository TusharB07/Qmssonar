import { Component, OnInit } from '@angular/core';
import { SubOccupancyService } from '../sub-occupancy.service';
import { OccupancyRateService } from '../../occupancy-rate/occupancy-rate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductService } from '../../product/product.service';
import { EarthquakeRateService } from '../../earthquake-rate/earthquake-rate.service';
import { IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { ISubOccupancy } from '../sub-occupancy-model';
import { FormMode, ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { LazyLoadEvent } from 'primeng/api';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { IOccupancyRate } from '../../occupancy-rate/occupancy-rate.model';
import { IProduct } from '../../product/product.model';
import { OPTIONS_EARTHQUAKE_ZONES } from '../../pincode/pincode.model';

@Component({
  selector: 'app-sub-occupancy-form',
  templateUrl: './sub-occupancy-form.component.html',
  styleUrls: ['./sub-occupancy-form.component.scss']
})
export class SubOccupancyFormComponent implements OnInit {

  role : IRole;
  user : IUser;

  recordForm: FormGroup;
  earthquakeRates: any;
  recordSingularName = "Sub Occupancy";
  recordPluralName = "Sub Occupancies";
  modulePath: string = "/backend/admin/sub-occupancy";
  mode: FormMode = "new";
  id: string;

  submitted: boolean = false;

  optionsPartners: ILov[] = [];
  optionsProducts: ILov[] = [];
  optionsOccupancy: ILov[] = [];
  optionsEarthquakeZones: ILov[] = [];
  isHideOption:boolean;

  constructor(
    private occupancyRateService: OccupancyRateService,
    private subOccupancyService : SubOccupancyService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private productService: ProductService,
    private earthquakeRateService: EarthquakeRateService,
    private router: Router,
    private formBuilder: FormBuilder,
    public partnerService: PartnerService,
    private accountService: AccountService,
  ) {
    this.optionsEarthquakeZones = OPTIONS_EARTHQUAKE_ZONES; 
    this.accountService.currentUser$.subscribe({
      next: (user) => {
          this.role = user.roleId as IRole
          this.user = user
      }
  })
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    if (this.id !== "new") {
      this.mode = "edit";
      this.subOccupancyService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ISubOccupancy>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" }
            // {
            //     label: `${dto.data.entity.name}`,
            //     routerLink: [`${this.modulePath}/new`],
            // },
          ]);
          this.earthquakeRates = dto.data.entity?.earthquakeRates;
          const product = dto.data.entity?.productId as IProduct
          this.createForm(dto.data.entity);
          this.hideOption({label: product.type})
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

  createForm(subOccupancy? : ISubOccupancy){
    const occupancyId = subOccupancy?.occupancyId as IOccupancyRate
    const productId = subOccupancy?.productId as IProduct
    const partnerId = subOccupancy?.partnerId as IPartner 
    this.recordForm = this.formBuilder.group({
      _id: [subOccupancy?._id],
      shopName: [subOccupancy?.shopName ?? null, [Validators.required]],
      terrorismRate: [subOccupancy?.terrorismRate],
      stfiRate: [subOccupancy?.stfiRate],
      minRateUpTo3Months: [subOccupancy?.minRateUpTo3Months],
      ratePerMonthBeyond3Months: [subOccupancy?.ratePerMonthBeyond3Months],
      occupancyId: [occupancyId ? { label: occupancyId.occupancyType, value: occupancyId._id } : null, [Validators.required]],
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]],
      partnerId: [partnerId ? { label: partnerId.name, value: partnerId._id } : null, [Validators.required]],
      taskStatus: [{ value: subOccupancy?.taskStatus, disabled: true }],
      failedMessage: [{ value: subOccupancy?.failedMessage, disabled: true }],
      opt1Rate:[subOccupancy?.opt1Rate],
      opt2Rate:[subOccupancy?.opt2Rate],
      opt3Rate:[subOccupancy?.opt3Rate],
      opt4Rate:[subOccupancy?.opt4Rate],
    })
  }

  onCancel() {
    this.subOccupancyService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

  saveRecord() {
    // console.log(this.userForm.value);
    this.subOccupancyService.setFilterValueExist(true);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["occupancyId"] = this.recordForm.value["occupancyId"].value;
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      console.log(updatePayload)

      if (this.mode === "edit") {
        this.subOccupancyService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        updatePayload["earthquakeRates"] = this.earthquakeRates?.map((d) => d?._id) || [];
        this.subOccupancyService.create(updatePayload).subscribe({
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
  
  loadEarthquakeRates(selectedProductId:string) {
    let lazyLoadEvent: any = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        productId: [{ value: selectedProductId['value'], matchMode: 'equals', operator: 'and' }],
        partnerId: [{ value: this.user?.partnerId['_id'], matchMode: 'equals', operator: 'and' }]
      },
      globalFilter: null,
      multiSortMeta: null
    };

    this.earthquakeRateService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.earthquakeRates = data.data.entities;
        console.log("Earthquake Rates:", this.earthquakeRates);
      },
      error: e => {
        console.log('Error fetching earthquake rates:', e);
      }
    });
  }

  searchOptionsPartners(event) {

    event = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
          //@ts-ignore
          name: [
              {
                  value: event.query,
                  matchMode: "startsWith",
                  operator: "and"
              }
          ],
      },
      globalFilter: null,
      multiSortMeta: null
  }

  this.partnerService.getMany(event).subscribe({
      next: data => {
          this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id , partnerType : entity.partnerType}));
          this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.self)
      },
      error: e => { }
  });
}


searchOptionsProducts(event) {

  let  lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
          // @ts-ignore
          type: [
              {
                  value: event.query,
                  matchMode: "startsWith",
                  operator: "or"
              },
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
          // this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
          this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));

      },
      error: e => { }
  });
}

searchOptionsOccupancy(event){
  let  lazyLoadEvent: LazyLoadEvent = {
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
      ]
    },
    globalFilter: null,
    multiSortMeta: null
}

this.occupancyRateService.getMany(lazyLoadEvent).subscribe({
    next: data => {
        // this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
        this.optionsOccupancy = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));

    },
    error: e => { }
});
}
 hideOption(val:any){
  if(val.label == 'Erection All Risk'){
    this.isHideOption =  true;
  }else{
    this.isHideOption = false;
  } 
 }
}