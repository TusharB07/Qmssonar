import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, IOneResponseDto } from "src/app/app.model";
import { IHazardCategory } from "../hazard-category.model";
import { HazardCategoryService } from "../hazard-category.service";

@Component({
  selector: "app-hazard-category-form",
  templateUrl: "./hazard-category-form.component.html",
  styleUrls: ["./hazard-category-form.component.scss"]
})
export class HazardCategoryFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Hazard Category";
  recordPluralName = "Hazard Categories";
  modulePath: string = "/backend/admin/hazard-categories";

  constructor(
    private recordService: HazardCategoryService,
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
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IHazardCategory>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.category}`,
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

  createForm(hazardCategory?: IHazardCategory) {
    this.recordForm = this.formBuilder.group({
      _id: [hazardCategory?._id],
      category: [hazardCategory?.category, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      score: [hazardCategory?.score, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: [hazardCategory?.status]
    });
  }

  saveRecord() {
    this.recordService.setFilterValueExist(true);
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      if (this.mode === "edit") {
        this.recordService.update(this.id, this.recordForm.value).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.recordService.create(this.recordForm.value).subscribe({
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
}
