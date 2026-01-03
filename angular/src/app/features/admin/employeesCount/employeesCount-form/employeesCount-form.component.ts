import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IemployeesCount } from '../employeesCount..model';
import { employeesCountService } from '../employeesCount.service';

@Component({
  selector: 'app-employeesCount-form',
  templateUrl: './employeesCount-form.component.html',
  styleUrls: ['./employeesCount-form.component.scss']
})
export class EmployeesCountsFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Employees Count";
  recordPluralName = "Employees Counts";
  modulePath: string = "/backend/admin/employeesCounts";
 c_from:number;
 c_To:number;

  constructor(
    private employeesCountService: employeesCountService,
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
      this.employeesCountService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IemployeesCount>) => {
          
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

  createForm(item?: IemployeesCount) {
   
    this.recordForm = this.formBuilder.group({
      
      countFrom: [item?.countFrom,  [Validators.required]],
      countTo: [item?.countTo,  [Validators.required]],
      formattedString:[item?.formattedString],
      status: [item?.status]
    });
  }



  onFocusOutCountEvent()
  {
    const formValue = this.recordForm.value;
    this.c_from=formValue.countFrom==null?0:formValue.countFrom;
    this.c_To=formValue.countTo==null?0:formValue.countTo;

    //calculate employeecount
    let employeedcount=this.c_from+ "-"+this.c_To;
    this.recordForm.controls.formattedString.setValue(employeedcount);

  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
        this.employeesCountService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.employeesCountService.create(updatePayload).subscribe({
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
