import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IConveyance } from '../conveyance.model';
import { ConveyanceService } from '../conveyance.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-conveyance-form',
  templateUrl: './conveyance-form.component.html',
  styleUrls: ['./conveyance-form.component.scss']
})
export class ConveyanceFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Conveyance";
  recordPluralName = "Conveyances";
  modulePath: string = "/backend/admin/conveyance";

  constructor(
    private conveyanceService: ConveyanceService,
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
      this.conveyanceService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IConveyance>) => {
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

  createForm(item?: IConveyance) {
   
    this.recordForm = this.formBuilder.group({
      
      conveyance: [item?.conveyance?item.conveyance:null,  [Validators.required]],
      isActive: [item?.isActive]
    });
  }



  saveRecord() {
    this.conveyanceService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
       
        this.conveyanceService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
       
        this.conveyanceService.create(updatePayload).subscribe({
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
    this.conveyanceService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
