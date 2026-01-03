import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { PermissionType, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';
import { EsclationCoverService } from './esclation-cover.service';

export interface IEscalationCover {
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
  selector: 'app-escalation-form-dialog',
  templateUrl: './escalation-form-dialog.component.html',
  styleUrls: ['./escalation-form-dialog.component.scss']
})


export class EscalationFormDialogComponent implements OnInit {
  EscalationForm: FormGroup;

  toWords = new ToWords;

  escalationCover: IEscalationCover;

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
      private esclationCoverService: EsclationCoverService,
      private accountService: AccountService,
      private bscCoverService : BscCoverService
  ) {
      this.escalationCover = this.config.data.escalationCover;
      this.quote = this.config.data.quote;
      this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
      this.createForm(this.escalationCover);
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
                    if(ele.bscType == 'escalation'){
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

      if(this.escalationCover._id){
          let payload = {}
          payload['filePath']= this.escalationCover.filePath
          payload['_id'] = this.escalationCover._id
          console.log(payload)
          this.esclationCoverService.deleteFilePath(payload).subscribe(res => {
              // @ts-ignore
              if(res?.data.success){
                  this.ref.close(this.escalationCover)
              }
          })
      }

      // if(this.fileUpload!){
      //     this.fileUpload!.remove(e,0)
      //     this.fileUpload!.clear()
      //     this.EscalationForm.value['fileInput'] = null
      //     console.log(this.fileUpload!)
      // }else{
      //     let payload = {}
      //     payload['filePath']= this.escalationCover.filePath
      //     payload['_id'] = this.escalationCover._id
      //     console.log(payload)
      //     this.esclationCoverService.deleteFilePath(payload).subscribe(res => {
      //         // @ts-ignore
      //         if(res?.data.success){
      //             this.ref.close(this.escalationCover)
      //         }
      //     })
      // }
  }

  createForm(item?: IEscalationCover) {

      this.EscalationForm = this.formBuilder.group({
          _id : [item?._id],
          description: [item?.description, [Validators.required, Validators.min(1)]],
          sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],          
          fileInput: [item?.filePath]
         
      })
  }

  submitEscalation() {
      if (this.EscalationForm.valid) {

          const payload = { ...this.EscalationForm.value }
          let bscFormData = new FormData();
          bscFormData.append("description", payload['description']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
          bscFormData.append("file", payload['fileInput']);

          // this.esclationCoverService.create(bscFormData).subscribe({
          //     next: (response: IOneResponseDto<IEscalationCover>) => {

          //         this.escalationCover = response.data.entity
          //         this.ref.close(this.escalationCover);
          //     },
          //     error: error => {
          //         console.log(error);
          //     }
          // });

          if (this.escalationCover?._id) {
              // console.log(this.escalationCover)
              console.log('Updated')
              const payload = { ...this.EscalationForm.value }

              this.esclationCoverService.update(payload._id, bscFormData).subscribe({
                  next: (response: IOneResponseDto<IEscalationCover>) => {
  
                      this.escalationCover = response.data.entity
                      this.ref.close(this.escalationCover);
                  },
                  error: error => {
                      console.log(error);
                  }
              });


          } else {
              const payload = { ...this.EscalationForm.value }

              payload['quoteId'] = this.config.data.quoteId;

              console.log('Created');
              this.esclationCoverService.create(bscFormData).subscribe({
                  next: (response: IOneResponseDto<IEscalationCover>) => {

                      this.escalationCover = response.data.entity
                      this.ref.close(this.escalationCover);
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
      this.EscalationForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile(){
      this.bscCoverService.downloadExcel(this.escalationCover?.filePath).subscribe(res => {
  
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


