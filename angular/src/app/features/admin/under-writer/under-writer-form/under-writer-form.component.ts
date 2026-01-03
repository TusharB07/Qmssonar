import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { ISector } from '../../sector/sector.model';
import { SectorService } from '../../sector/sector.service';
import { IUnderWriter } from '../under-writer.model';
import { UnderWriterService } from '../under-writer.service';
import { IUser, OPTIONS_ROLES } from "../../user/user.model";
import { RoleService } from '../../role/role.service';
import { IRole } from '../../role/role.model';
import { IOccupancyRule } from '../../product-partner-ic-configuration/product-partner-ic-configuration.model';
import { OccupancyRateService } from '../../occupancy-rate/occupancy-rate.service';
import { IOccupancyRate } from '../../occupancy-rate/occupancy-rate.model';
import { LazyLoadEvent } from 'primeng/api';
import { OPTIONS_ZONE } from '../../addon-cover/addon-cover.model';

@Component({
  selector: 'app-under-writer-form',
  templateUrl: './under-writer-form.component.html',
  styleUrls: ['./under-writer-form.component.scss']
})

export class UnderWriterFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Under Writer";
  recordPluralName = "Under Writers";
  modulePath: string = "/backend/admin/under-writer";
  optionsSectors: ILov[] = [];
  optionsOccupancies: ILov[] = [];
  optionsProducts: ILov[] = [];
  optionZones : ILov[] = [];
    // optionsRoles: any[] = [];


  constructor(
    private recordService: UnderWriterService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private sectorService: SectorService,
    private productService: ProductService,
    private roleService: RoleService,
    private occupancyService: OccupancyRateService,
    // private underWriterService: UnderWriterService,

  ) {
    this.optionZones = OPTIONS_ZONE
    // this.optionsRoles = OPTIONS_ROLES;
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IUnderWriter>) => {
          /* this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.name}`,
              routerLink: [`${this.modulePath}/new`]
            }
          ]); */

          this.createForm(dto.data.entity);
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

  createForm(item?: IUnderWriter) {
    // const state = city?.stateId as IState;
    const product: IProduct = item?.productId as IProduct;
    const occupancy: IOccupancyRate = item?.occupancyId as IOccupancyRate;

    const sector: ISector = item?.sectorId as ISector;
    console.log(sector)
    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      sectorId: [sector ? { label: sector.name, value: sector._id } : null, []],
      occupancyId: [occupancy ?  { label: occupancy?.occupancyType, value: occupancy._id } : null, []],
      zone: [item?.zone, []],
      productId: [product ? { label: product.type, value: product._id } : null, [Validators.required]],
      fromSI:[item?.fromSI, [Validators.required]],
      toSI:[item?.toSI, [Validators.required]],
      underWriter1:[item?.underWriter1],
      underWriter2:[item?.underWriter2],
      underWriter3:[item?.underWriter3],
      underWriter4:[item?.underWriter4],
      underWriter5:[item?.underWriter5],
      underWriter6:[item?.underWriter6],
      underWriter7:[item?.underWriter7],
      underWriter8:[item?.underWriter8],
      underWriter9:[item?.underWriter9],
      underWriter10:[item?.underWriter10]
    });
  }

  saveRecord() {
    console.log(this.recordForm);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      
      updatePayload["sectorId"] = this.recordForm.value["sectorId"]?.value ? this.recordForm.value["sectorId"]?.value : null;  
      updatePayload["productId"] = this.recordForm.value["productId"]?.value ? this.recordForm.value["productId"]?.value : null;
      updatePayload["occupancyId"] = this.recordForm?.value["occupancyId"]?.value ? this.recordForm?.value["occupancyId"]?.value : null;
      updatePayload["zone"] = this.recordForm?.value["zone"] ? this.recordForm?.value["zone"] : null;
      console.log(updatePayload);

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
    this.router.navigateByUrl(`${this.modulePath}`);
  }

  searchOptionsSectors(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
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


  searchOptionsOccupancies(event) {

    let  lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
          // @ts-ignore
          occupancyType: [
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
    this.occupancyService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsOccupancies = data.data.entities.map(entity => ({ label: entity.occupancyType, value: entity._id }));
      },
      error: e => { }
    });
  }

  searchOptionsProducts(event) {
    let  lazyLoadEvent: LazyLoadEvent = {
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
          ]
        },
        globalFilter: null,
        multiSortMeta: null
      }

    this.productService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
      },
      error: e => { }
    });
  }

  /* searchOptionsRoles(event) {
    this.roleService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsRoles = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  } */


}
