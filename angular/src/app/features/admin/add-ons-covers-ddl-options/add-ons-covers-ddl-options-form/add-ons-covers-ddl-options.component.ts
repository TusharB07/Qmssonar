import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, IOneResponseDto } from "src/app/app.model";
import { IAddOnsCoverOptions } from "../add-ons-covers-ddl-options.model";
import { AddOnCoverOptionsService } from "../add-ons-covers-ddl-options.service";
import { ImportDialogComponent } from "src/app/features/quote/components/quote/import-dialog/import-dialog.component";
import { IUser } from "../../user/user.model";
import { AllowedRoles } from "../../role/role.model";
import { ExportDialogComponent } from "src/app/features/quote/components/quote/export-dialog/export-dialog.component";

@Component({
  selector: "app-add-ons-covers-ddl-options-form",
  templateUrl: "./add-ons-covers-ddl-options-form.component.html",
  styleUrls: ["./add-ons-covers-ddl-options-form.component.scss"]
})
export class AddOnCoverOptionsFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Add-Ons Cover Option";
  recordPluralName = "Add-Ons Cover Options";
  modulePath: string = "/backend/admin/add-ons-covers-ddl-options";
  constructor(
    private recordService: AddOnCoverOptionsService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,

  ) {}

  ngOnInit(): void {
  
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IAddOnsCoverOptions>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" }
           
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



  createForm(option?: IAddOnsCoverOptions) {
    this.recordForm = this.formBuilder.group({
      _id: [option?._id],
      optionName: [option?.optionName, []],
      active: [option?.active || false]
    });
  }

  saveRecord() {
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
