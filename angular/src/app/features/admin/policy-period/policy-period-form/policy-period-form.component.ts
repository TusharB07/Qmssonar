import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { PolicyPeriodService } from '../policy-period.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ProductService } from '../../product/product.service';
import { IPolicyPeriod } from '../policy-period.model';
import { IProduct } from '../../product/product.model';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { PartnerService } from '../../partner/partner.service';

@Component({
  selector: 'app-policy-period-form',
  templateUrl: './policy-period-form.component.html',
  styleUrls: ['./policy-period-form.component.scss']
})
export class PolicyPeriodFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[] = [];
  recordSingularName = "Policy Period";
  recordPluralName = "Policy Periods";
  modulePath: string = "/backend/admin/policy-period";
  optionsPratnerId: ILov[] = [];

  constructor(
    private policyPeriodService: PolicyPeriodService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
    private partnerService: PartnerService,
  ) {


  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.policyPeriodService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IPolicyPeriod>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {

              label: `${dto.data.entity._id}`,
              routerLink: [`${this.modulePath}`]
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



    this.createForm();
  }

  createForm(item?: IPolicyPeriod) {

    const productId = item?.productId as IProduct;
    const partnerId = item?.partnerId as IPartner;

    this.recordForm = this.formBuilder.group({
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]],
      partnerId: [partnerId ? { label: partnerId.name, value: partnerId._id } : null, [Validators.required]],
      name: [item?.name, [Validators.required]],
      active: [item?.active]
    });
  }

  saveRecord() {


    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      if (this.mode === "edit") {
        this.policyPeriodService.update(this.id, updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        if (this.recordForm.value.fromAge >= this.recordForm.value.toAge) {
          this.showMessages('error', 'Error', 'From age must be smaller than To age.');
          this.submitted = false;
          return;
        }
        this.policyPeriodService.create(updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
    }

  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
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

  searchOptionsPartnerId(event) {
    event = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        // name: [
        //     {
        //         value: event.query,
        //         matchMode: "startsWith",
        //         operator: "and"
        //     }
        // ],
      },
      globalFilter: null,
      multiSortMeta: null
    }

    this.partnerService.getMany(event).subscribe({
      next: data => {
        this.optionsPratnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
        this.optionsPratnerId = this.optionsPratnerId.filter(item => item.partnerType == AllowedPartnerTypes.self)
      },
      error: e => { }
    });
  }
}
