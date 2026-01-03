import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppBreadcrumbService } from 'src/app/components/app-breadcrumb/app.breadcrumb.service';
import { FormMode, IOneResponseDto } from 'src/app/app.model';
import { IClientKyc } from '../client-kyc.model';
import { ClientKycService } from '../client-kyc.service';
import { Encryption } from 'src/app/shared/encryption';
import { CustomValidator } from 'src/app/shared/validators';

@Component({
  selector: 'app-client-kyc-form',
  templateUrl: './client-kyc-form.component.html',
  styleUrls: ['./client-kyc-form.component.scss']
})
export class ClientKycFormComponent implements OnInit {

  id: string;
  mode: FormMode = "new";
  recordForm: FormGroup;
  submitted: boolean = false;

  recordSingularName = "Client KYC";
  recordPluralName = "Client KYCs";
  modulePath: string = "/backend/admin/client-kyc-masters";

  constructor(
    private recordService: ClientKycService,
    private activatedRoute: ActivatedRoute,
    private breadcrumbService: AppBreadcrumbService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");

    // mode: Edit
    if (this.id !== "new") {
      this.mode = "edit";
      this.recordService.get(this.id).subscribe({
        next: (dto: IOneResponseDto<IClientKyc>) => {
          this.breadcrumbService.setItems([
            { label: "Pages" },
            {
              label: `${dto.data.entity.clientName}`,
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

    // mode: New
    this.createForm();
  }

  createForm(clientKyc?: IClientKyc) {
    let pan
    let gst
    if(clientKyc?.pan) pan = Encryption.decryptData(clientKyc?.pan)
    if(clientKyc?.gst) gst = Encryption.decryptData(clientKyc?.gst)
    this.recordForm = this.formBuilder.group({
      _id: [clientKyc?._id],
      clientGroupName: [clientKyc?.clientGroupName, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
      clientName: [clientKyc?.clientName, [Validators.required]],
      pan: [pan ?? clientKyc?.pan, [Validators.required, CustomValidator.panValidator ]],
      gst: [gst ?? clientKyc?.gst, [Validators.required, , CustomValidator.gstValidator]],
    });
  }

  saveRecord() {
    // console.log(this.userForm.value);
    this.recordService.setFilterValueExist(true);

    if (this.recordForm.valid) {
      let payload = {...this.recordForm.value}
      payload['pan'] = Encryption.encryptData(payload['pan'])
      payload['gst'] = Encryption.encryptData(payload['gst'])

      if (this.mode === "edit") {
        this.recordService.update(this.id, payload).subscribe({
          next: partner => {
            this.router.navigateByUrl(`${this.modulePath}`);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      if (this.mode === "new") {
        this.recordService.create(payload).subscribe({
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
    this.recordService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }

}
