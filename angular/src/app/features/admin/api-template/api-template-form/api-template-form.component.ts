import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { ApiTemplateService } from '../api-template.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ProductService } from '../../product/product.service';
import { PartnerService } from '../../partner/partner.service';
import { IApiTemplate } from '../api-template.model';
import { IProduct } from '../../product/product.model';
import { IPartner } from '../../partner/partner.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-api-template-form',
  templateUrl: './api-template-form.component.html',
  styleUrls: ['./api-template-form.component.scss']
})
export class ApiTemplateFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "API Template";
  recordPluralName = "API Templates";
  modulePath: string = "/backend/admin/api-template";

  optionsProducts: ILov[] = [];
  optionsBscTypes: ILov[];

  optionsPartners: ILov[] = [];
  searchOptionsPartners = ($event) => this.partnerService.searchOptionsPartners($event).then((records) => this.optionsPartners = records)


  constructor(
    private recordService: ApiTemplateService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    public partnerService: PartnerService,
  ) {
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IApiTemplate>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              // label: `${dto.data.entity.bscType}`,
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

  createForm(item?: IApiTemplate) {
    const product = item?.productId as IProduct;
    const partner = item?.partnerId as IPartner
    console.log(partner)

    console.log(item);

    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      url: [item?.url, [Validators.required]],
      partnerId: [partner ? { label: partner.name, value: partner._id } : null],
      productId: [product ? { label: product.type, value: product._id } : null, [Validators.required]],
      jsonString: [item?.jsonString, [Validators.required]],
      sequenceNumber: [item?.sequenceNumber, [Validators.required]],
    });
  }

  saveRecord() {
    this.recordService.setFilterValueExist(true);
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;

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
        this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
      },
      error: e => { }
    });
  }
}
