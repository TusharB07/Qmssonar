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
import { RemovalOfDebrisCoverService } from './removal-of-debris-cover.service';

export interface IRemovalOfDebrisCover {
  _id : string
  description : string
  sumInsured : number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc? : boolean
}

@Component({
  selector: 'app-removal-of-debris-form-dialog',
  templateUrl: './removal-of-debris-form-dialog.component.html',
  styleUrls: ['./removal-of-debris-form-dialog.component.scss']
})

export class RemovalOfDebrisFormDialogComponent implements OnInit {
  RemovalOfDebrisForm: FormGroup;

  toWords = new ToWords;

  removalOfDebrisCover: IRemovalOfDebrisCover;

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
      private removalOfDebrisCoverService: RemovalOfDebrisCoverService,
      private accountService: AccountService,
      private bscCoverService : BscCoverService
  ) {
      this.removalOfDebrisCover = this.config.data.removalOfDebrisCover;
      this.quote = this.config.data.quote;
      this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
      this.createForm(this.removalOfDebrisCover);

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

      if(this.removalOfDebrisCover._id){
          let payload = {}
          payload['filePath']= this.removalOfDebrisCover.filePath
          payload['_id'] = this.removalOfDebrisCover._id
          console.log(payload)
          this.removalOfDebrisCoverService.deleteFilePath(payload).subscribe(res => {
              // @ts-ignore
              if(res?.data.success){
                  this.ref.close(this.removalOfDebrisCover)
              }
          })
      }

      // if(this.fileUpload!){
      //     this.fileUpload!.remove(e,0)
      //     this.fileUpload!.clear()
      //     this.RemovalOfDebrisForm.value['fileInput'] = null
      //     console.log(this.fileUpload!)
      // }else{
      //     let payload = {}
      //     payload['filePath']= this.removalOfDebrisCover.filePath
      //     payload['_id'] = this.removalOfDebrisCover._id
      //     console.log(payload)
      //     this.removalOfDebrisCoverService.deleteFilePath(payload).subscribe(res => {
      //         // @ts-ignore
      //         if(res?.data.success){
      //             this.ref.close(this.removalOfDebrisCover)
      //         }
      //     })
      // }
  }

  createForm(item?: IRemovalOfDebrisCover) {

      this.RemovalOfDebrisForm = this.formBuilder.group({
          _id : [item?._id],
          description: [item?.description, [Validators.required, Validators.min(1)]],
          sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],          
          fileInput: [item?.filePath]
      })
  }

  submitRemovalOfDebris() {
      if (this.RemovalOfDebrisForm.valid) {

          const payload = { ...this.RemovalOfDebrisForm.value }
          let bscFormData = new FormData();
          bscFormData.append("description", payload['description']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
          bscFormData.append("file", payload['fileInput']);

          // this.removalOfDebrisCoverService.create(bscFormData).subscribe({
          //     next: (response: IOneResponseDto<IRemovalOfDebrisCover>) => {

          //         this.removalOfDebrisCover = response.data.entity
          //         this.ref.close(this.removalOfDebrisCover);
          //     },
          //     error: error => {
          //         console.log(error);
          //     }
          // });

          if (this.removalOfDebrisCover?._id) {
              // console.log(this.removalOfDebrisCover)
              console.log('Updated')
              const payload = { ...this.RemovalOfDebrisForm.value }

              this.removalOfDebrisCoverService.update(payload._id, bscFormData).subscribe({
                  next: (response: IOneResponseDto<IRemovalOfDebrisCover>) => {
  
                      this.removalOfDebrisCover = response.data.entity
                      this.ref.close(this.removalOfDebrisCover);
                  },
                  error: error => {
                      console.log(error);
                  }
              });


          } else {
              const payload = { ...this.RemovalOfDebrisForm.value }

              payload['quoteId'] = this.config.data.quoteId;

              console.log('Created');
              this.removalOfDebrisCoverService.create(bscFormData).subscribe({
                  next: (response: IOneResponseDto<IRemovalOfDebrisCover>) => {

                      this.removalOfDebrisCover = response.data.entity
                      this.ref.close(this.removalOfDebrisCover);
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
      this.RemovalOfDebrisForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile(){
      this.bscCoverService.downloadExcel(this.removalOfDebrisCover?.filePath).subscribe(res => {
  
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
