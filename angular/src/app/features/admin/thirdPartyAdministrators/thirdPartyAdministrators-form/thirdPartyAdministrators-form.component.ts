import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IThirdPartyAdministrators } from '../thirdPartyAdministrators.model';
import { ThirdPartyAdministratorsService } from '../thirdPartyAdministrators.service';

@Component({
  selector: 'app-thirdPartyAdministrators-form',
  templateUrl: './thirdPartyAdministrators-form.component.html',
  styleUrls: ['./thirdPartyAdministrators-form.component.scss']
})
export class ThirdPartyAdministratorsFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "TPA";
  recordPluralName = "TPAs";
  modulePath: string = "/backend/admin/thirdPartyAdministrators";


  constructor(
    private thirdPartyAdministratorsService: ThirdPartyAdministratorsService,
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
        next: (dto: IOneResponseDto<IThirdPartyAdministrators>) => {
          
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

  createForm(item?: IThirdPartyAdministrators) {
   
    this.recordForm = this.formBuilder.group({
      
      name: [item?.name,  [Validators.required]],
      status: [item?.status]
    });
  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
        this.thirdPartyAdministratorsService.update(this.id , updatePayload).subscribe({
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
