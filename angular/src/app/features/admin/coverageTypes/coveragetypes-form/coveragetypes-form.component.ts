import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ICoverageType } from '../coveragetypes.model';
import { CoverageTypesService } from '../coveragetypes.service';

@Component({
  selector: 'app-coveragetypes-form',
  templateUrl: './coveragetypes-form.component.html',
  styleUrls: ['./coveragetypes-form.component.scss']
})
export class CoverageTypesFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Coverage Type";
  recordPluralName = "Coverage Types";
  modulePath: string = "/backend/admin/coveragetypes";


  constructor(
    private coverageTypesService: CoverageTypesService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder

  ) {


  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id == null) {
      this.id = "new"
    }
    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.coverageTypesService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ICoverageType>) => {

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

  createForm(item?: ICoverageType) {

    this.recordForm = this.formBuilder.group({

      coverageType: [item?.coverageType, [Validators.required]],
      abbreviation: [item?.abbreviation, [Validators.required]],
      isEmployer: [item?.isEmployer],
      status: [item?.status]
    });
  }

  saveRecord() {


    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
        this.coverageTypesService.update(this.id, updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.coverageTypesService.create(updatePayload).subscribe({
          next: si => {
           // this.router.navigateByUrl(`${this.modulePath}`);
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

}
