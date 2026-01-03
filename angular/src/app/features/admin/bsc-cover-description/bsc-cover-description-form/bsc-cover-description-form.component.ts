import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { BscCoverDescriptionService } from '../bsc-cover-description.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ProductService } from '../../product/product.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscCoverDescription, OPTIONS_BSC_TYPES } from '../bsc-cover-description-model';
import { IProduct } from '../../product/product.model';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-bsc-cover-description-form',
  templateUrl: './bsc-cover-description-form.component.html',
  styleUrls: ['./bsc-cover-description-form.component.scss']
})
export class BscCoverDescriptionFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "BSC Cover Description";
  recordPluralName = "BSC Cover Description";
  modulePath: string = "/backend/admin/bsc-covers-description";

  optionsProducts: ILov[] = [];
  optionsBscTypes: ILov[];

  constructor(
      private recordService: BscCoverDescriptionService,
      private activatedRoute: ActivatedRoute,
      private breadcrumbService: AppBreadcrumbService,
      private router: Router,
      private formBuilder: FormBuilder,
      private productService: ProductService
  ) {
      this.optionsBscTypes = OPTIONS_BSC_TYPES;
  }

  ngOnInit(): void {
      this.id = this.activatedRoute.snapshot.paramMap.get("id");

      // mode: Edit
      if (this.id !== "new") {
          this.mode = "edit";
          this.recordService.get(this.id).subscribe({
              next: (dto: IOneResponseDto<IBscCoverDescription>) => {
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

  createForm(item?: IBscCoverDescription) {
      const product = item?.productId as IProduct;

      this.recordForm = this.formBuilder.group({
          _id: [item?._id],
          bscType: [{value: item?.bscType , disabled : this.mode == 'edit'}, [Validators.required]],
          description: [item?.description, [Validators.required]],
          active: [item?.active, [Validators.required]],
          productId: [product ? { label: product.type, value: product._id } : null, [Validators.required]],
      });
  }

  saveRecord() {
    this.recordService.setFilterValueExist(true);
      // console.log(this.userForm.value);

      if (this.recordForm.valid) {

          const updatePayload = { ...this.recordForm.value };
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
}
