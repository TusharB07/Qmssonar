import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IWarranty } from '../warranty.model';
import { WarrantyService } from '../warranty.service';

@Component({
  selector: 'app-warranty-form',
  templateUrl: './warranty-form.component.html',
  styleUrls: ['./warranty-form.component.scss']
})
export class WarrantyFormComponent implements OnInit{
  
  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Warranty";
  recordPluralName = "Warranties";
  modulePath: string = "/backend/admin/warranty";

  constructor(
     private warrantyService: WarrantyService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    ) { 
  
    
    }
  
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.warrantyService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IWarranty>) => {
          
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

  createForm(item?: IWarranty) {

    this.recordForm = this.formBuilder.group({
      name: [item?.name,  [Validators.required]]
        });
  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };

      if (this.mode === "edit") {
        this.warrantyService.update(this.id , updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.warrantyService.create(updatePayload).subscribe({
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
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}