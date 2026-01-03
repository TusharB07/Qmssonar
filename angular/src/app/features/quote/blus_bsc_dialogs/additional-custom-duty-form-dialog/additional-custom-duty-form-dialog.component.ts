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
import { AdditionalCustomDutyCoverService } from './additional-custom-duty-cover.service';


export interface IAdditionalCustomDutyCover {
  _id : string
  description : string
  sumInsured : number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc? : boolean
  nstp:number;
}

@Component({
  selector: 'app-additional-custom-duty-form-dialog',
  templateUrl: './additional-custom-duty-form-dialog.component.html',
  styleUrls: ['./additional-custom-duty-form-dialog.component.scss']
})
export class AdditionalCustomDutyFormDialogComponent implements OnInit {
  AdditionalCustomDutyForm: FormGroup;

  toWords = new ToWords;

  additionalCustomDutyCover: IAdditionalCustomDutyCover;

  submitted: boolean = false;
  optionsEquipmentType:any;
  max:any = 0;
  min:any = 0;
  maxNSTP:any = 0;
  minNSTP:any = 0;
  quote: IQuoteSlip;
  currentUser$: Observable<IUser>;
  permissions: PermissionType[] = [];
  // @Input() permissions: PermissionType[] = []

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
      private formBuilder: FormBuilder,
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
      private additionalCustomDutyCoverService: AdditionalCustomDutyCoverService,
      private accountService: AccountService,
      private bscCoverService : BscCoverService
  ) {
      this.additionalCustomDutyCover = this.config.data.additionalCustomDutyCover;
      this.quote = this.config.data.quote;
      this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
      this.createForm(this.additionalCustomDutyCover);
      this.searchOptionsEquipmentTypes();  
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

  searchOptionsEquipmentTypes() {
    this.bscCoverService.getAllCover().subscribe({
        next: data => {
            data.data.entities.map((ele)=>{  
                if(ele.productId == this.quote.productId['_id']){
                    if(ele.bscType == 'additional_custom_duty'){
                    this.max = ele.toSI
                    this.min = ele.fromSI
                    this.maxNSTP = ele.maxNstp
                    }
                }
            })
        },
        error: e => {
            console.log(e);
        }
    });
}


  deletefile(e){

      if(this.additionalCustomDutyCover._id){
          let payload = {}
          payload['filePath']= this.additionalCustomDutyCover.filePath
          payload['_id'] = this.additionalCustomDutyCover._id
          console.log(payload)
          this.additionalCustomDutyCoverService.deleteFilePath(payload).subscribe(res => {
              // @ts-ignore
              if(res?.data.success){
                  this.ref.close(this.additionalCustomDutyCover)
              }
          })
      }

      // if(this.fileUpload!){
      //     this.fileUpload!.remove(e,0)
      //     this.fileUpload!.clear()
      //     this.AdditionalCustomDutyForm.value['fileInput'] = null
      //     console.log(this.fileUpload!)
      // }else{
      //     let payload = {}
      //     payload['filePath']= this.additionalCustomDutyCover.filePath
      //     payload['_id'] = this.additionalCustomDutyCover._id
      //     console.log(payload)
      //     this.additionalCustomDutyCoverService.deleteFilePath(payload).subscribe(res => {
      //         // @ts-ignore
      //         if(res?.data.success){
      //             this.ref.close(this.additionalCustomDutyCover)
      //         }
      //     })
      // }
  }

  createForm(item?: IAdditionalCustomDutyCover) {

      this.AdditionalCustomDutyForm = this.formBuilder.group({
          _id : [item?._id],
          description: [item?.description, [Validators.required, Validators.min(1)]],
          sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],          
          fileInput: [item?.filePath]
         
      })
  }

  submitAdditionalCustomDuty() {
      if (this.AdditionalCustomDutyForm.valid) {

          const payload = { ...this.AdditionalCustomDutyForm.value }
          let bscFormData = new FormData();
          bscFormData.append("description", payload['description']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
          bscFormData.append("file", payload['fileInput']);

          // this.additionalCustomDutyCoverService.create(bscFormData).subscribe({
          //     next: (response: IOneResponseDto<IAdditionalCustomDutyCover>) => {

          //         this.additionalCustomDutyCover = response.data.entity
          //         this.ref.close(this.additionalCustomDutyCover);
          //     },
          //     error: error => {
          //         console.log(error);
          //     }
          // });

          if (this.additionalCustomDutyCover?._id) {
              // console.log(this.additionalCustomDutyCover)
              console.log('Updated')
              const payload = { ...this.AdditionalCustomDutyForm.value }

              this.additionalCustomDutyCoverService.update(payload._id, bscFormData).subscribe({
                  next: (response: IOneResponseDto<IAdditionalCustomDutyCover>) => {
  
                      this.additionalCustomDutyCover = response.data.entity
                      this.ref.close(this.additionalCustomDutyCover);
                  },
                  error: error => {
                      console.log(error);
                  }
              });


          } else {
              const payload = { ...this.AdditionalCustomDutyForm.value }

              payload['quoteId'] = this.config.data.quoteId;

              console.log('Created');
              this.additionalCustomDutyCoverService.create(bscFormData).subscribe({
                  next: (response: IOneResponseDto<IAdditionalCustomDutyCover>) => {

                      this.additionalCustomDutyCover = response.data.entity
                      this.ref.close(this.additionalCustomDutyCover);
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
      this.AdditionalCustomDutyForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile(){
      this.bscCoverService.downloadExcel(this.additionalCustomDutyCover?.filePath).subscribe(res => {
  
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