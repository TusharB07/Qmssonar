import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { CoInsurersService } from '../co-insurers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
// import { IcoInsurers } from '../../quote/quote.model';

export interface IcoInsurers {
  _id?: string;
  companyName: string;
  // share: number;
  cityOfIssuingOffice: string;
  // isLead: boolean;
  divisionOffice: string;
}

@Component({
  selector: 'app-co-insurers-form',
  templateUrl: './co-insurers-form.component.html',
  styleUrls: ['./co-insurers-form.component.scss']
})
export class CoInsurersFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Co Insurer";
  recordPluralName = "Co Insurers";
  modulePath: string = "/backend/admin/Co-Insurers";

  constructor(
    private coInsurersService: CoInsurersService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.coInsurersService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IcoInsurers>) => {
          
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

  createForm(item?: IcoInsurers) {
    this.recordForm = this.formBuilder.group({
      _id: [item?._id],
      companyName: [item?.companyName,],
      // share: [item?.share,],
      cityOfIssueOffice: [item?.cityOfIssuingOffice,],
      // isLead: [item?.isLead],
      divisionOfficeCode: [item?.divisionOffice]
    });
  }

  saveRecord() {
    
console.log(this.recordForm);

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
        this.coInsurersService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.coInsurersService.create(updatePayload).subscribe({
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
