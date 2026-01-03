import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';
import { LandscapingCoverService } from './landscaping-cover.service';

export interface ILandscapingIncludingLawnsPlantShrubsOrTreesCover {
  _id : string
  description : string
  sumInsured : number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc? : boolean
}

@Component({
  selector: 'app-landscaping-including-lawns-plant-shrubs-or-trees-form-dialog',
  templateUrl: './landscaping-including-lawns-plant-shrubs-or-trees-form-dialog.component.html',
  styleUrls: ['./landscaping-including-lawns-plant-shrubs-or-trees-form-dialog.component.scss']
})
export class LandscapingIncludingLawnsPlantShrubsOrTreesFormDialogComponent implements OnInit {
  
  landscapingIncludingLawnsPlantShrubsOrTreesForm: FormGroup;
  toWords = new ToWords;
  landscapingIncludingLawnsPlantShrubsOrTreesCover: ILandscapingIncludingLawnsPlantShrubsOrTreesCover;
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
      private landscapingCoverService: LandscapingCoverService,
      private accountService: AccountService,
      private bscCoverService : BscCoverService
  ) {
      this.landscapingIncludingLawnsPlantShrubsOrTreesCover = this.config.data.landscapingIncludingLawnsPlantShrubsOrTreesCover;
      this.quote = this.config.data.quote;
      this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
      this.createForm(this.landscapingIncludingLawnsPlantShrubsOrTreesCover);

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
      if(this.landscapingIncludingLawnsPlantShrubsOrTreesCover._id){
          let payload = {}
          payload['filePath']= this.landscapingIncludingLawnsPlantShrubsOrTreesCover.filePath
          payload['_id'] = this.landscapingIncludingLawnsPlantShrubsOrTreesCover._id
          console.log(payload)
          this.landscapingCoverService.deleteFilePath(payload).subscribe(res => {
              // @ts-ignore
              if(res?.data.success){
                  this.ref.close(this.landscapingIncludingLawnsPlantShrubsOrTreesCover)
              }
          })
      }
  }

  createForm(item?: ILandscapingIncludingLawnsPlantShrubsOrTreesCover) {
      this.landscapingIncludingLawnsPlantShrubsOrTreesForm = this.formBuilder.group({
          _id : [item?._id],
          description: [item?.description, [Validators.required, Validators.min(1)]],
          sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],          
          fileInput: [item?.filePath]
      })
  }

  submitLandscapingIncludingLawnsPlantShrubsOrTrees() {
      if (this.landscapingIncludingLawnsPlantShrubsOrTreesForm.valid) {

          const payload = { ...this.landscapingIncludingLawnsPlantShrubsOrTreesForm.value }
          let bscFormData = new FormData();
          bscFormData.append("description", payload['description']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
          bscFormData.append("file", payload['fileInput']);

          if (this.landscapingIncludingLawnsPlantShrubsOrTreesCover?._id) {
              console.log('Updated')
              const payload = { ...this.landscapingIncludingLawnsPlantShrubsOrTreesForm.value }

              this.landscapingCoverService.update(payload._id, bscFormData).subscribe({
                  next: (response: IOneResponseDto<ILandscapingIncludingLawnsPlantShrubsOrTreesCover>) => {
                      this.landscapingIncludingLawnsPlantShrubsOrTreesCover = response.data.entity
                      this.ref.close(this.landscapingIncludingLawnsPlantShrubsOrTreesCover);
                  },
                  error: error => {
                      console.log(error);
                  }
              });
          } else {
              const payload = { ...this.landscapingIncludingLawnsPlantShrubsOrTreesForm.value }

              payload['quoteId'] = this.config.data.quoteId;

              console.log('Created');
              this.landscapingCoverService.create(bscFormData).subscribe({
                  next: (response: IOneResponseDto<ILandscapingIncludingLawnsPlantShrubsOrTreesCover>) => {
                      this.landscapingIncludingLawnsPlantShrubsOrTreesCover = response.data.entity
                      this.ref.close(this.landscapingIncludingLawnsPlantShrubsOrTreesCover);
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
      return typeof val === 'object';
  }

  onBasicUpload(e) {
      this.landscapingIncludingLawnsPlantShrubsOrTreesForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile(){
      this.bscCoverService.downloadExcel(this.landscapingIncludingLawnsPlantShrubsOrTreesCover?.filePath).subscribe(res => {
  
          let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'uploadedFile';
    
          const a = document.createElement('a')
          const blob = new Blob([res.body], { type: res.headers.get('content-type') });
          const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
          const objectUrl = window.URL.createObjectURL(file);
    
          a.href = objectUrl
          a.download = fileName;
          a.click();
    
          URL.revokeObjectURL(objectUrl);
        })
  }
}
