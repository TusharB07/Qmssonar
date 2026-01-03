import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IRiskManagementFeatures } from '../risk-management-features.model';
import { RiskManagementFeaturesService } from '../risk-management-features.service';
import { AllowedProductTemplate, IProduct } from '../../product/product.model';
import { LazyLoadEvent } from 'primeng/api';
import { ProductService } from '../../product/product.service';
import { WC_OPTIONS_LIST_OF_VALUES } from '../../list-of-value-master/list-of-value-master.model';

@Component({
  selector: 'app-category-product-master-form',
  templateUrl: './risk-management-features-form.component.html',
  styleUrls: ['./risk-management-features-form.component.scss']
})
export class RiskManagementFeaturesFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionITypeOfProduct: ILov[] = [];
  optionsProductsList: IProduct[] = []
  optionsProducts: ILov[] = [];
  productTemplate: string = ""
  optionsLovTypes: ILov[] = []
  optionsLovReference: ILov[] = []
  hideLimit: any
  recordSingularName = "Risk Management Feature";
  recordPluralName = "Risk Management Features";
  modulePath: string = "/backend/admin/risk-management-features";

  constructor(
    private riskManagementFeaturesService: RiskManagementFeaturesService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.riskManagementFeaturesService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IRiskManagementFeatures>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
                label: `${dto.data.entity.name}`,
                routerLink: [`${this.modulePath}/new`],
            },
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

  createForm(riskManagement?: IRiskManagementFeatures) {
    const product = riskManagement?.productId as IProduct
    this.recordForm = this.formBuilder.group({
      _id: [riskManagement?._id],
      name: [riskManagement?.name],
      productId: [product ? { label: product.type, value: product._id } : null, []],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      if (this.mode === "edit") {
        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
        this.riskManagementFeaturesService.update(this.id, updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
        this.riskManagementFeaturesService.create(updatePayload).subscribe({
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
            //this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id, shortName:entity.shortName, isBuildingAndContent:entity.isBuildingAndContentWiseRate }));
            //Liability
            this.optionsProductsList = data.data.entities;
            this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
            this.hideLimit = this.optionsProducts.filter((ele) => {
                // if (ele.label == "Contractors All Risk") {
                //     this.hide = true;
                // } else {
                //     this.hide = false;
                // }
            })
        },
        error: e => { }
    });
}

handleOnproductChange(event: any) {
  const selectedProduct = event;
  const selectedProductId = selectedProduct ? selectedProduct.value : null;
  if (selectedProductId) {
      this.optionsLovTypes = WC_OPTIONS_LIST_OF_VALUES;
      const selectedProductTempalte = this.optionsProductsList.find(product => product._id === selectedProductId).productTemplate;
      if (selectedProductTempalte) {
          this.productTemplate = selectedProductTempalte;


          switch (this.productTemplate) {
              case AllowedProductTemplate.LIABILITY:
                  // Filter logic for LIABILITY
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('D&O_') );
                  break;
          
              case AllowedProductTemplate.LIABILITY_EANDO:
                  // Filter logic for LIABILITY_EANDO (D&O or E&O)
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('E&O_'));
                  break;
          
              case AllowedProductTemplate.LIABILITY_CGL:
                  // Filter logic for LIABILITY_CGL
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CGL_'));
                  break;
          
              case AllowedProductTemplate.LIABILITY_PRODUCT:
                  // Filter logic for LIABILITY_PRODUCT
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('PRODUCT_'));
                  break;
          
              case AllowedProductTemplate.LIABILITY_PUBLIC:
                  // Filter logic for LIABILITY_PUBLIC
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('PUBLIC_'));
                  break;
          
              case AllowedProductTemplate.LIABILITY_CYBER:
                  // Filter logic for LIABILITY_CYBER
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CYBER_'));
                  break;
          
              case AllowedProductTemplate.LIABILITY_CRIME:
                  // Filter logic for LIABILITY_CRIME
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('CRIME_'));
                  break;
          
              case AllowedProductTemplate.WORKMENSCOMPENSATION:
                  // Filter logic for WORKMENSCOMPENSATION (WC)
                  this.optionsLovTypes = this.optionsLovTypes.filter(item => item.label.includes('WC_'));
                  break;
          
              default:
                  // Default or fallback logic if no specific case is matched
                  break;
          }
          
          
      }
    
  }
}



}
