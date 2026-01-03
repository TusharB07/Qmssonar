import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IInterest } from '../interest.model';
import { InterestService } from '../interest.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-interest-form',
  templateUrl: './interest-form.component.html',
  styleUrls: ['./interest-form.component.scss']
})
export class InterestFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Interest";
  recordPluralName = "Interests";
  modulePath: string = "/backend/admin/interest";
  a_from:number;
  a_To:number;

  constructor(
    private interestservice: InterestService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService

  ) { 
  
    
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.interestservice.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IInterest>) => {
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

  createForm(item?: IInterest) {
   
    this.recordForm = this.formBuilder.group({
      
      interest: [item?.interest?item.interest:null,  [Validators.required]],
      isActive: [item?.isActive]
    });
  }



  saveRecord() {
    this.interestservice.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
       
        this.interestservice.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
      
        this.interestservice.create(updatePayload).subscribe({
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

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }
  onCancel() {
    this.interestservice.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
