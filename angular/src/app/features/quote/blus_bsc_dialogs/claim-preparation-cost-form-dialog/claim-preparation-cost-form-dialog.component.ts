import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { PermissionType, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IQuoteSlip, AllowedQuoteStates } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';
import { ClaimPreparationCostCoverService } from './claim-preparation-cost-cover.service';

export interface IClaimPreparationCostCover {
  _id: string
  description: string
  sumInsured: number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc?: boolean;
}

@Component({
  selector: 'app-claim-preparation-cost-form-dialog',
  templateUrl: './claim-preparation-cost-form-dialog.component.html',
  styleUrls: ['./claim-preparation-cost-form-dialog.component.scss']
})
export class ClaimPreparationCostFormDialogComponent implements OnInit {
  
  claimPreparationCostForm: FormGroup;
  toWords = new ToWords;
  claimPreparationCostCover: IClaimPreparationCostCover;
  submitted: boolean = false;
  optionsEquipmentType:any;
  max:any;
  min:any;
  maxNSTP:any = 0;
  minNSTP:any = 0;
  quote: IQuoteSlip;
  currentUser$: Observable<IUser>;
  permissions: PermissionType[] = [];

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private claimPreparationCostCoverService: ClaimPreparationCostCoverService,
    private accountService: AccountService,
    private bscCoverService: BscCoverService
  ) {
    this.claimPreparationCostCover = this.config.data.claimPreparationCostCover;
    this.quote = this.config.data.quote;
    this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
    this.createForm(this.claimPreparationCostCover);
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
                    if(ele.bscType == 'claim_preparation_cost'){
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


  deletefile(e) {
    if (this.claimPreparationCostCover._id) {
      let payload = {}
      payload['filePath'] = this.claimPreparationCostCover.filePath
      payload['_id'] = this.claimPreparationCostCover._id
      console.log(payload)
      this.claimPreparationCostCoverService.deleteFilePath(payload).subscribe(res => {
        // @ts-ignore
        if (res?.data.success) {
          this.ref.close(this.claimPreparationCostCover)
        }
      })
    }
  }

  createForm(item?: IClaimPreparationCostCover) {
    this.claimPreparationCostForm = this.formBuilder.group({
      _id: [item?._id],
      description: [item?.description, [Validators.required, Validators.min(1)]],
      sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
      fileInput: [item?.filePath]
    })
  }

  submitClaimPreparationCost() {
    if (this.claimPreparationCostForm.valid) {

      const payload = { ...this.claimPreparationCostForm.value }
      let bscFormData = new FormData();
      bscFormData.append("description", payload['description']);
      bscFormData.append("sumInsured", payload['sumInsured']);
      bscFormData.append("quoteId", this.config.data.quoteId)
      bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
      bscFormData.append("file", payload['fileInput']);

      if (this.claimPreparationCostCover?._id) {
        console.log('Updated')
        const payload = { ...this.claimPreparationCostForm.value }

        this.claimPreparationCostCoverService.update(payload._id, bscFormData).subscribe({
          next: (response: IOneResponseDto<IClaimPreparationCostCover>) => {
            this.claimPreparationCostCover = response.data.entity
            this.ref.close(this.claimPreparationCostCover);
          },
          error: error => {
            console.log(error);
          }
        });


      } else {
        const payload = { ...this.claimPreparationCostForm.value }

        payload['quoteId'] = this.config.data.quoteId;

        console.log('Created');
        this.claimPreparationCostCoverService.create(bscFormData).subscribe({
          next: (response: IOneResponseDto<IClaimPreparationCostCover>) => {
            this.claimPreparationCostCover = response.data.entity
            this.ref.close(this.claimPreparationCostCover);
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
    this.claimPreparationCostForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile() {
    this.bscCoverService.downloadExcel(this.claimPreparationCostCover?.filePath).subscribe(res => {

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
