import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { ITermsConditions } from '../terms-condition.model';
import { IUser } from '../../user/user.model';
import { IRole } from '../../role/role.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { TermsConditionsService } from '../terms-conditions.service';
import { ProductService } from '../../product/product.service';
import { PartnerService } from '../../partner/partner.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IPartner } from '../../partner/partner.model';
import { IProduct } from '../../product/product.model';

@Component({
  selector: 'app-terms-conditions-form',
  templateUrl: './terms-conditions-form.component.html',
  styleUrls: ['./terms-conditions-form.component.scss']
})
export class TermsConditionsFormComponent implements OnInit {

  modulePath: string = "/backend/admin/terms-conditions";

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;

  recordSingularName = "Terms and Conditions";
  recordPluralName = "Terms and Conditions";

  submitted: boolean = false;

  bscClauses: ITermsConditions[]

  optionsProducts: ILov[] = [];
  optionsPartners: ILov[] = [];
  optionsTypes = [];

  user: IUser;
  role: IRole;

  bscLabel: string;
  bscValue: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private termsConditionsService: TermsConditionsService,
    private productService: ProductService,
    private partnerService: PartnerService,
    private accountService: AccountService,
  ) {
    this.optionsTypes = [
      "Excess",
      "Clauses",
      "Exclusions"
    ];
    this.accountService.currentUser$.subscribe({
      next: (user) => {
        this.role = user.roleId as IRole
        this.user = user
      }
    })
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.termsConditionsService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ITermsConditions>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `Edit Bsc Clauses`,
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

  createForm(termsConditions?: ITermsConditions) {

    const partnerId = termsConditions?.partnerId as IPartner
    const productId = termsConditions?.productId as IProduct
    //@ts-ignore
    console.log(termsConditions?.description.replaceAll('&lt;', '<'))

    this.recordForm = this.formBuilder.group({
      _id: [termsConditions?._id],
      type: [termsConditions?.type, [Validators.required]],
      productId: [productId ? { label: productId?.type, value: productId?._id } : null, [Validators.required]],
      partnerId: [partnerId ? { label: partnerId?.name, value: partnerId?._id } : null, [Validators.required]],
      //@ts-ignore
      description: [termsConditions?.description.replaceAll('&lt;', '<'), [Validators.required]],
      section: [termsConditions?.section, []],
      active: [termsConditions?.active ? true : false],
    })
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
    }
    this.productService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
      },
      error: e => { }
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
        this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
      },
      error: e => { }
    });
  }

  saveRecord() {
    this.termsConditionsService.setFilterValueExist(true);
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;

      if (this.mode === "edit") {
        this.termsConditionsService.update(this.id, updatePayload).subscribe({
          next: data => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.termsConditionsService.create(updatePayload).subscribe({
          next: data => {
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
    this.termsConditionsService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
