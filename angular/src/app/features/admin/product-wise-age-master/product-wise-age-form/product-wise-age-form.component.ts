import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IProductWiseAge } from '../product-wise-age.model';
import { ProductWiseAgeService } from '../product-wise-age.service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IProduct } from '../../product/product.model';
import { ProductService } from '../../product/product.service';

@Component({
  selector: 'app-product-wise-age-form',
  templateUrl: './product-wise-age-form.component.html',
  styleUrls: ['./product-wise-age-form.component.scss']
})
export class ProductWiseAgeFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  optionsProducts: ILov[]=[];
  recordSingularName = "Product wise Age";
  recordPluralName = "Product wise Age";
  modulePath: string = "/backend/admin/productWiseAge";
  a_from:number;
  a_To:number;

  constructor(
    private productWiseAgeService: ProductWiseAgeService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
  ) { 
  
    
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.productWiseAgeService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IProductWiseAge>) => {
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

  createForm(item?: IProductWiseAge) {
   
    const productId = item?.productId as IProduct;
    
    this.recordForm = this.formBuilder.group({
      productId: [productId ? { label: productId.type, value: productId._id } : null, [Validators.required]], 
      fromAge: [item?.fromAge,  [Validators.required]],
      toAge: [item?.toAge,  [Validators.required]],
      age: [item?.age?item.age:null,  [Validators.required]],
      active: [item?.active]
    });
  }


  onFocusOutAgeEvent()
  {
    const formValue = this.recordForm.value;
    this.a_from=formValue.fromAge==null?0:formValue.fromAge;
    this.a_To=formValue.toAge==null?0:formValue.toAge;

    //calculate age
    let ageband=this.a_from+ "-"+this.a_To;
    this.recordForm.controls.age?.setValue(ageband);
  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        updatePayload["productId"] = this.recordForm.value["productId"].value;
      if (this.mode === "edit") {
        if(this.recordForm.value.fromAge >= this.recordForm.value.toAge )
        {
          this.showMessages('error', 'Error','From age must be smaller than To age.');
          this.submitted=false;
          return;
        }
        this.productWiseAgeService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        if(this.recordForm.value.fromAge >= this.recordForm.value.toAge )
        {
          this.showMessages('error', 'Error','From age must be smaller than To age.');
          this.submitted=false;
          return;
        }
        this.productWiseAgeService.create(updatePayload).subscribe({
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

}
