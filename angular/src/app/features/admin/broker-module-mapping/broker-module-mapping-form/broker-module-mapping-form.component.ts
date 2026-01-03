import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { LazyLoadEvent } from "primeng/api";
import { ProductService } from "src/app/features/service/productservice";
import { UserService } from "../../user/user.service";
import { AllowedRoles, IRole } from "../../role/role.model";
import { BrokerModuleMappingService } from "../broker-module-mapping.service";
import { IBrokerModuleMapping } from "../broker-module-mapping.model";
import { IProduct } from "../../product/product.model";
import { FormMode, IOneResponseDto } from "src/app/app.model";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { IUser } from "../../user/user.model";

@Component({
  selector: "app-broker-module-mapping-form",
  templateUrl: "./broker-module-mapping-form.component.html",
  styleUrls: ["./broker-module-mapping-form.component.css"]
})
export class BrokerModuleMappingFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  recordSingularName = "Broker Module Mapping";
  optionsProducts: any;
  modulePath: string = "/backend/admin/broker-module-mapping";
  salesCreater: any;
  placementMarker: any;
  placementChecker: any;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private recordService: UserService,
    private brokerModuleMappingService: BrokerModuleMappingService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    if (this.id !== "new") {
      this.mode = "edit";
      this.brokerModuleMappingService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IBrokerModuleMapping>) => {
          console.log(dto);
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

    this.createForm();
  }
  createForm(item?: IBrokerModuleMapping) {
    console.log(item);
    const product: IProduct = item?.productId as IProduct;
    console.log(product);
    const salesCreater: IUser = item?.salesCreaterId as IUser;
    console.log(salesCreater);
    const placementMarker: IUser = item?.placementMakerId as IUser;
    const placementChecker: IUser = item?.placementCheckerId as IUser;
    this.recordForm = this.formBuilder.group({
      productId: [product ? { label: product.type, value: product._id } : null],
      salesCreaterId: [salesCreater ? { label: salesCreater.name, value: salesCreater._id } : null],
      placementMakerId: [placementMarker ? { label: placementMarker.name, value: placementMarker._id } : null],
      placementCheckerId: [placementChecker ? { label: placementChecker.name, value: placementChecker._id } : null],
      fromSI: [item?.fromSI],
      toSI: [item?.toSI]
    });
  }
  saveRecord() {
    const updatePayload = { ...this.recordForm.value };
    console.log(updatePayload);
    updatePayload["productId"] = this.recordForm.value["productId"]?.value ? this.recordForm.value["productId"]?.value : null;
    updatePayload["salesCreaterId"] = this.recordForm.value["salesCreaterId"]?.value ? this.recordForm.value["salesCreaterId"]?.value : null;
    updatePayload["placementCheckerId"] = this.recordForm.value["placementCheckerId"]?.value ? this.recordForm.value["placementCheckerId"]?.value : null;
    updatePayload["placementMakerId"] = this.recordForm.value["placementMakerId"]?.value ? this.recordForm.value["placementMakerId"]?.value : null;

    if (this.mode === "edit") {
      this.brokerModuleMappingService.update(this.id, updatePayload).subscribe({
        next: data => {
          this.router.navigateByUrl(`${this.modulePath}`);
        },
        error: error => {
          console.log(error);
        }
      });
    }
    if (this.mode === "new") {
    this.brokerModuleMappingService.create(updatePayload).subscribe({
      next: data => {
        this.router.navigateByUrl(`${this.modulePath}`);
      },
      error: error => {
        console.log(error);
      }
    });
    }
    console.log(this.recordForm.value);
  }
  onCancel() {
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
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    };

    this.productService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
      },
      error: e => {}
    });
  }

  searchOptionsUsers(event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 200,
      sortField: null,
      sortOrder: 1,
      filters: {},
      globalFilter: null,
      multiSortMeta: null
    };

    this.recordService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        const users = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, roleID: entity.roleId }));
        this.salesCreater = users.filter(item => item.roleID["name"] === AllowedRoles.SALES_CREATOR_AND_APPROVER);
        this.placementMarker = users.filter(item => item.roleID["name"] === AllowedRoles.PLACEMENT_CREATOR);
        this.placementChecker = users.filter(item => item.roleID["name"] === AllowedRoles.PLACEMENT_APPROVER);
      },
      error: e => {}
    });
  }
}

