import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ISumInsured } from '../suminsured.model';
import { SumInsuredService } from '../suminsured.service';

@Component({
  selector: 'app-suminsured-form',
  templateUrl: './suminsured-form.component.html',
  styleUrls: ['./suminsured-form.component.scss']
})
export class SuminsuredFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Sum Insured";
  recordPluralName = "Sum Insured";
  modulePath: string = "/backend/admin/suminsured";


  constructor(
    private sumInsuredService: SumInsuredService,
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
      this.sumInsuredService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ISumInsured>) => {
          
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

  createForm(item?: ISumInsured) {
   
    this.recordForm = this.formBuilder.group({
      
      sumInsured: [item?.sumInsured,  [Validators.required]]
    });
  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
        this.sumInsuredService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.sumInsuredService.create(updatePayload).subscribe({
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
