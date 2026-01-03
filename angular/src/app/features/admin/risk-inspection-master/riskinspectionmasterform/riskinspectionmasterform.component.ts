import { RiskinspectionmasterService } from './../riskinspectionmaster.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AccountService } from 'src/app/features/account/account.service';
import { PartnerService } from '../../partner/partner.service';
import { ProductService } from '../../product/product.service';
import { IRiskInspectionMasterModel } from '../riskInspectionMaster.model';
import { IProduct } from '../../product/product.model';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-riskinspectionmasterform',
  templateUrl: './riskinspectionmasterform.component.html',
  styleUrls: ['./riskinspectionmasterform.component.scss']
})
export class RiskinspectionmasterformComponent implements OnInit {

  role: IRole;
  user: IUser;

  recordForm: FormGroup;

  recordSingularName = "Risk Inspection Master";
  recordPluralName = "Risk Inspection Masters";
  modulePath: string = "/backend/admin/risk-inspection-master";
  mode: FormMode = "new";
  id: string;

  submitted: boolean = false;

  optionsPartners: ILov[] = [];
  optionsProducts: ILov[] = [];
  optionsParenId: ILov[] = [];


  constructor(
    private riskinspectionmasterService: RiskinspectionmasterService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder,
    public partnerService: PartnerService,
    private accountService: AccountService,
  ) {
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
      this.riskinspectionmasterService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IRiskInspectionMasterModel>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" }
            // {
            //     label: `${dto.data.entity.name}`,
            //     routerLink: [`${this.modulePath}/new`],
            // },
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

  createForm(riskInspectionrecord?: IRiskInspectionMasterModel) {

    const parentId = riskInspectionrecord?.parentId as IRiskInspectionMasterModel
    const productId = riskInspectionrecord?.productId as IProduct
    const partnerId = riskInspectionrecord?.partnerId as IPartner
    this.recordForm = this.formBuilder.group({
      _id : [riskInspectionrecord?._id],
      productId : [productId ? {label : productId.type ,value:productId._id} : null,[Validators.required]],
      partnerId : [partnerId ? {label : partnerId.name,value: partnerId._id} : null,[Validators.required]],
      parentId : [parentId ? {label : parentId?.riskTypeOrValue,value : parentId._id} : null],
      riskTypeOrValue : [riskInspectionrecord?.riskTypeOrValue ?? null,[Validators.required]],
      isHeading: [riskInspectionrecord?.isHeading ?? false],
      discount : [riskInspectionrecord?.discount ?? null,[]],
      isActive : [riskInspectionrecord?.isActive ?? false],
      parameterCode : [riskInspectionrecord?.parameterCode ?? null],
      taskStatus : [{value : riskInspectionrecord?.taskStatus,disabled : true}] ,
      failedMessage : [{value : riskInspectionrecord?.failedMessage,disabled : true}],
    })
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
        this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.self)
      },
      error: e => { }
    });
  }


  searchOptionsProducts(event) {

    let lazyLoadEvent: LazyLoadEvent = {
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

  searchOptionParentId(event) {
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        isHeading: [
          {
            value: "false",
            matchMode: "equals",
            operator: "and"
          }
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
      },
      globalFilter: null,
      multiSortMeta: null
    }

    this.riskinspectionmasterService.getMany(lazyLoadEvent).subscribe({
      next: data => {
        // this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
        this.optionsParenId = data.data.entities.map(entity => ({ label: entity.riskTypeOrValue, value: entity._id }));

      },
      error: e => { }
    });
  }


  saveRecord() {
    // console.log(this.userForm.value);
    this.riskinspectionmasterService.setFilterValueExist(true);

    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      if (updatePayload['parentId']) {
        updatePayload["parentId"] = this.recordForm.value["parentId"].value;
      }
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;
      console.log(updatePayload)

      if (this.mode === "edit") {
        this.riskinspectionmasterService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.riskinspectionmasterService.create(updatePayload).subscribe({
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
    this.riskinspectionmasterService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }


}
