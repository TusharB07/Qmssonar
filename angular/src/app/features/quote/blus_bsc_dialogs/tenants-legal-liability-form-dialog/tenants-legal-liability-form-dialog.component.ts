import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { PermissionType, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';
import { TenantsLegalLiablityCoverService } from './tenants-legal-liablity-cover.service';

export interface ITenantLegalLiabilityCover {
  _id : string
  description : string
  sumInsured : number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc? : boolean
}

@Component({
  selector: 'app-tenants-legal-liability-form-dialog',
  templateUrl: './tenants-legal-liability-form-dialog.component.html',
  styleUrls: ['./tenants-legal-liability-form-dialog.component.scss']
})

export class TenantsLegalLiabilityFormDialogComponent implements OnInit {
  TenantLegalLiabilityForm: FormGroup;

  toWords = new ToWords;

  tenatLegalLiabilityCover: ITenantLegalLiabilityCover;

  submitted: boolean = false;

  quote: IQuoteSlip;
  currentUser$: Observable<IUser>;
  permissions: PermissionType[] = [];
  // @Input() permissions: PermissionType[] = []

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
      private formBuilder: FormBuilder,
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
      private tenantsLegalLiablityCoverService: TenantsLegalLiablityCoverService,
      private accountService: AccountService,
      private bscCoverService : BscCoverService
  ) {
      this.tenatLegalLiabilityCover = this.config.data.tenatLegalLiabilityCover;
      this.quote = this.config.data.quote;
      this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
      this.createForm(this.tenatLegalLiabilityCover);

      this.currentUser$.subscribe({
          next: user => {
              let role: IRole = user?.roleId as IRole;
              if (role?.name === AllowedRoles.INSURER_RM || this.quote?.quoteState == AllowedQuoteStates.REJECTED) {

                  this.permissions = ['read'];
              } else {

                  this.permissions = ['read', 'update'];
              }
          }
      })
  }


  deletefile(e){

      if(this.tenatLegalLiabilityCover._id){
          let payload = {}
          payload['filePath']= this.tenatLegalLiabilityCover.filePath
          payload['_id'] = this.tenatLegalLiabilityCover._id
          console.log(payload)
          this.tenantsLegalLiablityCoverService.deleteFilePath(payload).subscribe(res => {
              // @ts-ignore
              if(res?.data.success){
                  this.ref.close(this.tenatLegalLiabilityCover)
              }
          })
      }

      // if(this.fileUpload!){
      //     this.fileUpload!.remove(e,0)
      //     this.fileUpload!.clear()
      //     this.TenantLegalLiabilityForm.value['fileInput'] = null
      //     console.log(this.fileUpload!)
      // }else{
      //     let payload = {}
      //     payload['filePath']= this.tenatLegalLiabilityCover.filePath
      //     payload['_id'] = this.tenatLegalLiabilityCover._id
      //     console.log(payload)
      //     this.tenantsLegalLiablityCoverService.deleteFilePath(payload).subscribe(res => {
      //         // @ts-ignore
      //         if(res?.data.success){
      //             this.ref.close(this.tenatLegalLiabilityCover)
      //         }
      //     })
      // }
  }

  createForm(item?: ITenantLegalLiabilityCover) {

      this.TenantLegalLiabilityForm = this.formBuilder.group({
          _id : [item?._id],
          description: [item?.description, [Validators.required, Validators.min(1)]],
          sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],          
          fileInput: [item?.filePath]   
      })
  }

  submitTenantLegalLiability() {
      if (this.TenantLegalLiabilityForm.valid) {

          const payload = { ...this.TenantLegalLiabilityForm.value }
          let bscFormData = new FormData();
          bscFormData.append("description", payload['description']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
          bscFormData.append("file", payload['fileInput']);

          // this.tenantsLegalLiablityCoverService.create(bscFormData).subscribe({
          //     next: (response: IOneResponseDto<ITenantLegalLiabilityCover>) => {

          //         this.tenatLegalLiabilityCover = response.data.entity
          //         this.ref.close(this.tenatLegalLiabilityCover);
          //     },
          //     error: error => {
          //         console.log(error);
          //     }
          // });

          if (this.tenatLegalLiabilityCover?._id) {
              // console.log(this.tenatLegalLiabilityCover)
              console.log('Updated')
              const payload = { ...this.TenantLegalLiabilityForm.value }

              this.tenantsLegalLiablityCoverService.update(payload._id, bscFormData).subscribe({
                  next: (response: IOneResponseDto<ITenantLegalLiabilityCover>) => {
  
                      this.tenatLegalLiabilityCover = response.data.entity
                      this.ref.close(this.tenatLegalLiabilityCover);
                  },
                  error: error => {
                      console.log(error);
                  }
              });


          } else {
              const payload = { ...this.TenantLegalLiabilityForm.value }

              payload['quoteId'] = this.config.data.quoteId;

              console.log('Created');
              this.tenantsLegalLiablityCoverService.create(bscFormData).subscribe({
                  next: (response: IOneResponseDto<ITenantLegalLiabilityCover>) => {

                      this.tenatLegalLiabilityCover = response.data.entity
                      this.ref.close(this.tenatLegalLiabilityCover);
                  },
                  error: error => {
                      console.log(error);
                  }
              });
          } 
      }
  }

  cancel() {
      this.ref.close();
  }

  isFile(val): boolean {
      // console.log(typeof val);
      return typeof val === 'object';
  }

  onBasicUpload(e) {
      this.TenantLegalLiabilityForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile(){
      this.bscCoverService.downloadExcel(this.tenatLegalLiabilityCover?.filePath).subscribe(res => {
  
          let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'uploadedFile';
    
          const a = document.createElement('a')
          const blob = new Blob([res.body], { type: res.headers.get('content-type') });
          const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
          const objectUrl = window.URL.createObjectURL(file);
    
          a.href = objectUrl
          a.download = fileName;
          a.click();
    
          // window.open(objectUrl, '_blank');
          URL.revokeObjectURL(objectUrl);
    
        })
  }
}
