import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { IState } from "../../state/state.model";
import { StateService } from "../../state/state.service";
import { IDistrict } from "../district.model";
import { DistrictService } from "../district.service";

@Component({
  selector: "app-district-form",
  templateUrl: "./district-form.component.html",
  styleUrls: ["./district-form.component.scss"]
})
export class DistrictFormComponent implements OnInit {
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  optionsStates: ILov[] = [];

  recordSingularName = "District";
  recordPluralName = "Districts";
  modulePath: string = "/backend/admin/districts";

  constructor(
    private recordService: DistrictService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private stateService: StateService,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IDistrict>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.name}`,
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

  createForm(district?: IDistrict) {
    const state: IState = district?.stateId as IState;

    this.recordForm = this.formBuilder.group({
      _id: [district?._id],
      name: [district?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
    });
  }

  saveRecord() {
    this.recordService.setFilterValueExist(true);
    // console.log(this.userForm.value);

    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      updatePayload["stateId"] = this.recordForm.value["stateId"].value;

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

  searchOptionsStates(event) {
    this.stateService.getManyAsLovs(event).subscribe({
      next: data => {
        this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
      },
      error: e => { }
    });
  }
}
