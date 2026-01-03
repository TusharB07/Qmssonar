import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IPartner } from '../../partner/partner.model';
import { PartnerService } from '../../partner/partner.service';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';
import { IProductPartnerConfiguration } from '../product-partner-configuration.model';
import { ProductPartnerConfigurationService } from '../product-partner-configuration.service';

@Component({
  selector: 'app-product-partner-configuration-form',
  templateUrl: './product-partner-configuration-form.component.html',
  styleUrls: ['./product-partner-configuration-form.component.scss']
})
export class ProductPartnerConfigurationFormComponent implements OnInit {
  partnerId: string = "";
//   productId: string = "";
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[]=[];
  optionsPartnerId: ILov[]=[];
  selectedProductPartners: ILov;
  recordSingularName = "Product Partner Configuration";
  recordPluralName = "Product Partner Configuration";
  modulePath: string 
  copyPercentage = 0  

  partner : IPartner;
  productPartner: IProductPartnerConfiguration;
  Ipartner = {};
  constructor(
    private productPartnerConfigurationService: ProductPartnerConfigurationService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private partnerService:PartnerService

  ) {


  }
  ngOnInit(): void {
      this.id = this.activatedRoute.snapshot.paramMap.get("id");
      this.partnerId = this.activatedRoute.snapshot.paramMap.get("partnerId");
      this.modulePath = `/backend/admin/partners/${this.partnerId}`
  
    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.productPartnerConfigurationService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IProductPartnerConfiguration>) => {

          this.breadcrumbService.setItems([
            { label: "Pages" },
            // {

            //   label: `${dto.data.entity._id}`,
            //   routerLink: [`${this.modulePath}`]
            // }
          ]);
          this.Ipartner['label']= dto.data.entity.partnerId['name']
          this.Ipartner['value'] = dto.data.entity.partnerId['_id']
          this.createForm(dto.data.entity);

        },
        error: e => {
          console.log(e);
        }
      });
    } else {
        this.partnerService.get(this.partnerId).subscribe({
          next: (dto: IOneResponseDto<IPartner>) => {
            this.partner = dto.data.entity
            this.Ipartner['label']= this.partner?.name
            this.Ipartner['value'] = this.partner?._id
            console.log(this.Ipartner)
            this.createForm();
          }
        });
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `Add new ${this.recordSingularName}`,
              routerLink: [`${this.modulePath}/new`]
            }
          ]);
      }
      this.createForm()
  }

  createForm(item ?: IProductPartnerConfiguration) {

    const productId = item?.productId as IProduct;
    const partnerId = this.Ipartner

    this.copyPercentage = item?.copyPercentage ?? 0

    this.recordForm = this.formBuilder.group({

      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]],
      partnerId: [partnerId ? {label : partnerId['label'],value:partnerId['value']} : null, [Validators.required]],
      locationCount: [item?.locationCount ?? null],
      minCover: [item?.minCover ?? null],
      active: [item?.active == null ? true : item?.active ],
      taskStatus : [{value : item?.taskStatus,disabled : true}] ,
      failedMessage : [{value : item?.failedMessage,disabled : true}]
    });
  }

  saveRecord() {


    if (this.recordForm.valid) {
      console.log(this.recordForm.value)
        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
        updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;
        updatePayload["locationCount"] = this.recordForm.value["locationCount"];
        updatePayload["minCover"] = this.recordForm.value["minCover"];

      if (this.mode === "edit") {
        this.productPartnerConfigurationService.update(this.id , updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.productPartnerConfigurationService.create(updatePayload).subscribe({
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
    console.log(this.modulePath)
    this.router.navigateByUrl(`${this.modulePath}`);
  }
  onCreateAddOnCoverSector() {
    this.selectedProductPartners = this.recordForm.value.partnerId


    this.createForm();

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
  searchOptionsPartnerId(event) {
    this.partnerService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsPartnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
}

