import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { ITransitType } from '../transitType.model';
import { TransitTypeService } from '../transitType.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transitType-form',
  templateUrl: './transitType-form.component.html',
  styleUrls: ['./transitType-form.component.scss']
})
export class TransitTypeFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Transit Type";
  recordPluralName = "Transit Types";
  modulePath: string = "/backend/admin/transitType";

  constructor(
    private transitTypeService: TransitTypeService,
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
      this.transitTypeService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<ITransitType>) => {
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

  createForm(item?: ITransitType) {
   
    this.recordForm = this.formBuilder.group({
      
      transitType: [item?.transitType?item.transitType:null,  [Validators.required]],
      isActive: [item?.isActive]
    });
  }



  saveRecord() {
    this.transitTypeService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
      
        this.transitTypeService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
       
        this.transitTypeService.create(updatePayload).subscribe({
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
    this.transitTypeService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
