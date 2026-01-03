import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { IProduct } from "../../product/product.model";
import { ProductService } from "../../product/product.service";
import { IBscDiscount } from "../bsc-discount.model";
import { BscDiscountService } from "../bsc-discount.service";
import { BSC_TYPE_OPTIONS } from "../bsc-discount.model";
import { LazyLoadEvent } from "primeng/api";
@Component({
  selector: "app-bsc-discount-form",
  templateUrl: "./bsc-discount-form.component.html",
  styleUrls: ["./bsc-discount-form.component.scss"]
})
export class BscDiscountFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "BSC Discount";
  recordPluralName = "BSC Discounts";
  modulePath: string = "/backend/admin/bsc-discount";
  optionsTypes: ILov[] = [];

  optionsProducts: ILov[] = [];
  date3: Date;



  constructor(
    private productService: ProductService,
    private recordService: BscDiscountService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.optionsTypes = BSC_TYPE_OPTIONS;

  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IBscDiscount>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.bscType}`,
              routerLink: [`${this.modulePath}/new`]
            }
          ]);

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

  createForm(bscDiscount?: IBscDiscount) {
    const product: IProduct = bscDiscount?.productId as IProduct;

    console.log(bscDiscount)

    this.recordForm = this.formBuilder.group({
      _id: [bscDiscount?._id],
      // bscType: [bscDiscount?.bscType, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      bscType: [bscDiscount?.bscType, [Validators.required, Validators.min(0)]],
      fromSI: [bscDiscount?.fromSI, [Validators.required]],
      toSI: [bscDiscount?.toSI, [Validators.required, ]],
      ratePerMile: [bscDiscount?.ratePerMile, [Validators.required, Validators.min(0)]],
      productId: [product ? { label: product.type, value: product._id } : null, [Validators.required]],
      // applicable_from: [bscDiscount?.applicable_from, [Validators.required]],
      // applicable_to: [bscDiscount?.applicable_to, [Validators.required]]
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      updatePayload["bscType"] = this.recordForm.value["bscType"].value;

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
  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  }
}
