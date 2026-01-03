import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { IExclusion } from '../exclusion.model';
import { ExclusionService } from '../exclusion.service';
import { CustomValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-exclusion-form',
  templateUrl: './exclusion-form.component.html',
  styleUrls: ['./exclusion-form.component.scss']
})
export class ExclusionFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;
  recordSingularName = "Exclusion";
  recordPluralName = "Exclusions";
  modulePath: string = "/backend/admin/exclusion";


  // product : IProductPartnerConfiguration;
  constructor(
    // private productPartnerConfigurationService: ProductPartnerConfigurationService,
     private exclusionService: ExclusionService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder,
    // private productService: ProductService,
    // private partnerService:PartnerService

  ) { 
  
    
  }
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.exclusionService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IExclusion>) => {
          
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

  createForm(item?: IExclusion) {
   
    // const productId = item?.productId as IProduct;
    // const partnerId = item?.partnerId as IPartner;


    this.recordForm = this.formBuilder.group({
      
      name: [item?.name,  [Validators.required, CustomValidator.industryName]]
      // partnerId: [partnerId ? { label: partnerId.name, value: partnerId._id } : null, [Validators.required]],
    });
  }

  saveRecord() {
    

    if (this.recordForm.valid) {

        const updatePayload = { ...this.recordForm.value };
        // updatePayload["productId"] = this.recordForm.value["productId"].value;
        // updatePayload["partnerId"] = this.recordForm.value["partnerId"].value;

      if (this.mode === "edit") {
        this.exclusionService.update(this.id , updatePayload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);

          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.exclusionService.create(updatePayload).subscribe({
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
