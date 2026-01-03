import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IAnnualTurnover } from '../annual-turnover..model';
import { AnnualTurnoverService } from '../annual-turnover.service';

@Component({
  selector: 'app-annual-turnover-form',
  templateUrl: './annual-turnover-form.component.html',
  styleUrls: ['./annual-turnover-form.component.scss']
})
export class AnnualTurnoverFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Annual Turnover";
  recordPluralName = "Annual Turnover";
  modulePath: string = "/backend/admin/annualturnover";
  a_from:number;
  a_To:number;

  constructor(
    private annualTurnoverService: AnnualTurnoverService,
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
      this.annualTurnoverService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<(IAnnualTurnover)>) => {
          
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

  createForm(item?: IAnnualTurnover) {
   
    this.recordForm = this.formBuilder.group({
      
      turnoverFrom: [item?.turnoverFrom,  [Validators.required]],
      turnoverTo: [item?.turnoverTo,  [Validators.required]],
      formattedString:[item?.formattedString],
      active: [item?.active]
    });
  }



  onFocusOutCountEvent()
  {
    const formValue = this.recordForm.value;
    this.a_from=formValue.turnoverFrom==null?0:formValue.turnoverFrom;
    this.a_To=formValue.turnoverTo==null?0:formValue.turnoverTo;

    //calculate turn Over
    let turnOver='₹ ' + Intl.NumberFormat('en-IN').format(+this.a_from).toString()+ " - "+'₹ ' + Intl.NumberFormat('en-IN').format(+this.a_To).toString();
    this.recordForm.controls.formattedString.setValue(turnOver);

  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
        this.annualTurnoverService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.annualTurnoverService.create(updatePayload).subscribe({
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
