import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { IMerchant } from '../merchant.model';
import { MerchantService } from '../merchant.service';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';

@Component({
  selector: 'app-merchant-form',
  templateUrl: './merchant-form.component.html',
  styleUrls: ['./merchant-form.component.scss']
})
export class MerchantFormComponent implements OnInit {

  modulePath: string = "/backend/admin/merchant";

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;

  recordSingularName = "Merchant";
  recordPluralName = "Merchants";

  submitted: boolean = false;

  constructor(
    private merchantService : MerchantService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    if (this.id !== "new") {
      this.mode = "edit";
      this.merchantService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<any>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.status}`,
              routerLink: [`${this.modulePath}/new`]
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
    this.createForm()
  }

  createForm(merchantDetail?: IMerchant) {
    this.recordForm = this.formBuilder.group({
      _id: [merchantDetail?._id],
      merchantName: [merchantDetail?.merchantName, [Validators.required]],
      merchantUrl: [merchantDetail?.merchantUrl, [Validators.required]],
      merchantNumber: [merchantDetail?.merchantNumber, [Validators.required]],
    })
  }

  loadRecords(){

  }

  saveRecord(){
    console.log(this.recordForm.value)
    if (this.recordForm.valid) {
      const updatePayload = { ...this.recordForm.value };
      if (this.mode === "edit") {
          this.merchantService.update(this.id, updatePayload).subscribe({
              next: merchant => {
                  this.router.navigateByUrl(`${this.modulePath}`);
              },
              error: error => {
                  console.log(error);
              }
          });
      }
      if (this.mode === "new") {
          this.merchantService.create(updatePayload).subscribe({
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
