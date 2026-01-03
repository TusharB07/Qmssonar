import { Component, OnInit } from '@angular/core';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { GmcMasterService } from '../../gmc-master/gmc-master.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IThirdPartyAdministrators } from '../../thirdPartyAdministrators/thirdPartyAdministrators.model';
import { IGMCTemplate } from '../../gmc-master/gmc-master-model';

@Component({
  selector: 'app-gmctabmaster-form',
  templateUrl: './gmctabmaster-form.component.html',
  styleUrls: ['./gmctabmaster-form.component.scss']
})
export class GmctabmasterFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "GMC MASTER TAB";
  recordPluralName = "GMC MASTER TABs";
  modulePath: string = "/backend/admin/gmctabmaster";


  constructor(
    private thirdPartyAdministratorsService: GmcMasterService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder

  ) {


  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.thirdPartyAdministratorsService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IGMCTemplate>) => {

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

  createForm(item?: IGMCTemplate) {

    this.recordForm = this.formBuilder.group({

      parentTabName: [item?.parentTabName, [Validators.required]],

    });
  }

  saveRecord() {


    if (this.recordForm.valid) {

      const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
        this.thirdPartyAdministratorsService.update(this.id, updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.thirdPartyAdministratorsService.create(updatePayload).subscribe({
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

  onCancel() {
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
