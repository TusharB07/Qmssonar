import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, IOneResponseDto } from "src/app/app.model";
import { ISector } from "../sector.model";
import { SectorService } from "../sector.service";

@Component({
  selector: "app-sector-form",
  templateUrl: "./sector-form.component.html",
  styleUrls: ["./sector-form.component.scss"]
})
export class SectorFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Sector";
  recordPluralName = "Sectors";
  modulePath: string = "/backend/admin/sectors";

  constructor(
    private recordService: SectorService,
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
        next: (dto: IOneResponseDto<ISector>) => {
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

  createForm(sector?: ISector) {
    this.recordForm = this.formBuilder.group({
      _id: [sector?._id],
      name: [sector?.name,],
      isActive : [sector?.isActive ? sector?.isActive : false],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);
    this.recordService.setFilterValueExist(true);

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
