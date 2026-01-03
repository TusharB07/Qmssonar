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
import { DeteriorationOfStocksInBCoverService } from './deterioration-of-stocks-in-bcover.service';


export interface IDeteriorationofStocksinBCover {
  _id : string
  description : string
  sumInsured : number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc? : boolean
}

@Component({
  selector: 'app-deteriorationof-stocksin-b-form-dialog',
  templateUrl: './deteriorationof-stocksin-b-form-dialog.component.html',
  styleUrls: ['./deteriorationof-stocksin-b-form-dialog.component.scss']
})

export class DeteriorationofStocksinBFormDialogComponent implements OnInit {
  DeteriorationofStocksinBForm: FormGroup;

  toWords = new ToWords;

  deteriorationofStocksinBCover: IDeteriorationofStocksinBCover;

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
      private deteriorationOfStocksInBCoverService: DeteriorationOfStocksInBCoverService,
      private accountService: AccountService,
      private bscCoverService : BscCoverService
  ) {
      this.deteriorationofStocksinBCover = this.config.data.deteriorationofStocksinBCover;
      this.quote = this.config.data.quote;
      this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
      this.createForm(this.deteriorationofStocksinBCover);
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
                    if(ele.bscType == 'deterioration_of_stocks_in_b'){
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

      if(this.deteriorationofStocksinBCover._id){
          let payload = {}
          payload['filePath']= this.deteriorationofStocksinBCover.filePath
          payload['_id'] = this.deteriorationofStocksinBCover._id
          console.log(payload)
          this.deteriorationOfStocksInBCoverService.deleteFilePath(payload).subscribe(res => {
              // @ts-ignore
              if(res?.data.success){
                  this.ref.close(this.deteriorationofStocksinBCover)
              }
          })
      }

      // if(this.fileUpload!){
      //     this.fileUpload!.remove(e,0)
      //     this.fileUpload!.clear()
      //     this.DeteriorationofStocksinBForm.value['fileInput'] = null
      //     console.log(this.fileUpload!)
      // }else{
      //     let payload = {}
      //     payload['filePath']= this.deteriorationofStocksinBCover.filePath
      //     payload['_id'] = this.deteriorationofStocksinBCover._id
      //     console.log(payload)
      //     this.deteriorationOfStocksInBCoverService.deleteFilePath(payload).subscribe(res => {
      //         // @ts-ignore
      //         if(res?.data.success){
      //             this.ref.close(this.deteriorationofStocksinBCover)
      //         }
      //     })
      // }
  }

  createForm(item?: IDeteriorationofStocksinBCover) {

      this.DeteriorationofStocksinBForm = this.formBuilder.group({
          _id : [item?._id],
          description: [item?.description, [Validators.required, Validators.min(1)]],
          sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],          
          fileInput: [item?.filePath]
         
      })
  }

  submitDeteriorationofstocksinB() {
      if (this.DeteriorationofStocksinBForm.valid) {

          const payload = { ...this.DeteriorationofStocksinBForm.value }
          let bscFormData = new FormData();
          bscFormData.append("description", payload['description']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
          bscFormData.append("file", payload['fileInput']);

          // this.deteriorationOfStocksInBCoverService.create(bscFormData).subscribe({
          //     next: (response: IOneResponseDto<IDeteriorationofStocksinBCover>) => {

          //         this.deteriorationofStocksinBCover = response.data.entity
          //         this.ref.close(this.deteriorationofStocksinBCover);
          //     },
          //     error: error => {
          //         console.log(error);
          //     }
          // });

          if (this.deteriorationofStocksinBCover?._id) {
              // console.log(this.deteriorationofStocksinBCover)
              console.log('Updated')
              const payload = { ...this.DeteriorationofStocksinBForm.value }

              this.deteriorationOfStocksInBCoverService.update(payload._id, bscFormData).subscribe({
                  next: (response: IOneResponseDto<IDeteriorationofStocksinBCover>) => {
  
                      this.deteriorationofStocksinBCover = response.data.entity
                      this.ref.close(this.deteriorationofStocksinBCover);
                  },
                  error: error => {
                      console.log(error);
                  }
              });


          } else {
              const payload = { ...this.DeteriorationofStocksinBForm.value }

              payload['quoteId'] = this.config.data.quoteId;

              console.log('Created');
              this.deteriorationOfStocksInBCoverService.create(bscFormData).subscribe({
                  next: (response: IOneResponseDto<IDeteriorationofStocksinBCover>) => {

                      this.deteriorationofStocksinBCover = response.data.entity
                      this.ref.close(this.deteriorationofStocksinBCover);
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
      this.DeteriorationofStocksinBForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile(){
      this.bscCoverService.downloadExcel(this.deteriorationofStocksinBCover?.filePath).subscribe(res => {
  
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