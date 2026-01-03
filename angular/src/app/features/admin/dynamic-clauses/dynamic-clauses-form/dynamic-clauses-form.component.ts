import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { IBscClauses } from '../dynamic-clauses.model';
import { DynamicClausesService } from '../dynamic-clauses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { AllowedPartnerTypes, IPartner } from '../../partner/partner.model';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { PartnerService } from '../../partner/partner.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IRole } from '../../role/role.model';
import { IUser } from '../../user/user.model';
import { OPTIONS_BSC_TYPES } from '../../bsc-cover/bsc-cover.model';

@Component({
  selector: 'app-dynamic-clauses-form',
  templateUrl: './dynamic-clauses-form.component.html',
  styleUrls: ['./dynamic-clauses-form.component.scss']
})
export class DynamicClausesFormComponent implements OnInit {

  modulePath: string = "/backend/admin/dynamic-clauses";

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;

  recordSingularName = "BSC Clause";
  recordPluralName = "BSC Clauses";

  submitted: boolean = false;

  bscClauses: IBscClauses[]

  optionsProducts: ILov[] = [];
  optionsPartners: ILov[] = [];
  optionsBscTypes: ILov[] = [];

  user: IUser;
  role : IRole;

  bscLabel : string;
  bscValue : string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private messageService: MessageService,
    private dynamicClausesService: DynamicClausesService,
    private productService: ProductService,
    private partnerService: PartnerService,
    private accountService: AccountService,
  ) { 
    this.optionsBscTypes = OPTIONS_BSC_TYPES;
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
            this.dynamicClausesService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<any>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {
                            label: `Edit Bsc Clauses`,
                            routerLink: [`${this.modulePath}/new`]
                        }
                    ]);
                    let item = dto.data.entity
                    for (let i = 0; i < this.optionsBscTypes.length; i++) {
                      if (this.optionsBscTypes[i].value === item?.bscType) {
                        this.bscLabel = this.optionsBscTypes[i].label
                        this.bscValue = this.optionsBscTypes[i].value
                      }
                    }
                    delete item['bscType']
                    item['bscType']={label: this.bscLabel,value:this.bscValue}
                    this.createForm(item);
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

  createForm(DynamicClauses?: IBscClauses) {

    const partnerId = DynamicClauses?.partnerId as IPartner
    const productId = DynamicClauses?.productId as IProduct

    console.log(DynamicClauses)
   
    this.recordForm = this.formBuilder.group({
      _id: [DynamicClauses?._id],
      bscType: [DynamicClauses?.bscType ? {label: DynamicClauses.bscType['label'],value : DynamicClauses.bscType['value']} : null, [Validators.required]],
      productId: [productId ? {label : productId?.type, value : productId?._id} : null, [Validators.required]],
      partnerId: [partnerId ? { label: partnerId?.name, value: partnerId?._id} : null, [Validators.required]],
      description: [DynamicClauses?.description, [Validators.required]],
      active: [DynamicClauses?.active ? true : false],
    })
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

searchOptionsPartners(event) {
  if (this.user.partnerId['partnerType'] == AllowedPartnerTypes.insurer) {
    console.log("In")
    event = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        //@ts-ignore  
        name: [
          {
            value: this.user.partnerId['name'],
            matchMode: "equals",
            operator: "or"
          }
        ],
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

    this.partnerService.getMany(event).subscribe({
      next: data => {
        this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
        this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.insurer)
      },
      error: e => { }
    });
  } else {
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

    this.partnerService.getMany(event).subscribe({
      next: data => {
        this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
        this.optionsPartners = this.optionsPartners.filter(item => item.partnerType == AllowedPartnerTypes.insurer)
      },
      error: e => { }
    });
  }
}

saveRecord() {
  // console.log(this.userForm.value);

  if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      updatePayload["bscType"] = this.recordForm.value["bscType"].value
      updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
      updatePayload["productId"] = this.recordForm.value["productId"].value;

      if (this.mode === "edit") {
          this.dynamicClausesService.update(this.id, updatePayload).subscribe({
              next: data => {
                  this.router.navigateByUrl(`${this.modulePath}`);
              },
              error: error => {
                  console.log(error);
              }
          });
      }
      if (this.mode === "new") {
          this.dynamicClausesService.create(updatePayload).subscribe({
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

searchOptionsBscTypes(event){
  console.log(event)
  this.optionsBscTypes = []
  this.optionsBscTypes = [...OPTIONS_BSC_TYPES];
}

onCancel() {
  this.router.navigateByUrl(`${this.modulePath}`);
}

}
