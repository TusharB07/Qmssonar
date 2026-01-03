import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IPackaging } from '../packaging.model';
import { PackagingService } from '../packaging.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-packaging-form',
  templateUrl: './packaging-form.component.html',
  styleUrls: ['./packaging-form.component.scss']
})
export class PackagingFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Packaging";
  recordPluralName = "Packagings";
  modulePath: string = "/backend/admin/packaging";

  constructor(
    private packagingService: PackagingService,
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
      this.packagingService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IPackaging>) => {
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

  createForm(item?: IPackaging) {
   
    this.recordForm = this.formBuilder.group({
      
      packaging: [item?.packaging?item.packaging:null,  [Validators.required]],
      isActive: [item?.isActive]
    });
  }



  saveRecord() {
    this.packagingService.setFilterValueExist(true);
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
       
        this.packagingService.update(this.id , updatePayload).subscribe({
          next: si => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
     
        this.packagingService.create(updatePayload).subscribe({
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
    this.packagingService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
