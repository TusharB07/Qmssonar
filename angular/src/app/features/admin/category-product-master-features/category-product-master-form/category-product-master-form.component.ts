import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ICategoryProductMaster } from '../category-product-master.model';
import { CategoryProductMasterService } from '../category-product-master.service';

@Component({
  selector: 'app-category-product-master-form',
  templateUrl: './category-product-master-form.component.html',
  styleUrls: ['./category-product-master-form.component.scss']
})
export class CategoryProductMasterFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
    recordForm: FormGroup = this.formBuilder.group({
        name: [''],
    });

    submitted: boolean = false;

  recordSingularName = "Category Product Master";
  recordPluralName = "Category Product Masters";
  modulePath: string = "/backend/admin/category-product-master-features";

  constructor(
    private categoryProductMasterService: CategoryProductMasterService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.categoryProductMasterService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<ICategoryProductMaster>) => {
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

            // mode: New
            this.createForm();
        }
    }



    createForm(categoryProduct?: ICategoryProductMaster) {
        console.log('Category Product Form Data:', categoryProduct);

        // Reset the form
        this.recordForm.reset();

        // Patch the form controls with data
        this.recordForm.patchValue({
            _id: categoryProduct?._id,
            name: categoryProduct?.name,
        });
    }





    saveRecord() {
      this.categoryProductMasterService.setFilterValueExist(true);
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      if (this.mode === "edit") {
        this.categoryProductMasterService.update(this.id, this.recordForm.value).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.categoryProductMasterService.create(this.recordForm.value).subscribe({
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
    this.categoryProductMasterService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }
}
