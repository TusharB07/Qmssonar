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
import { KeysAndLocksCoverService } from './keys-and-locks-cover.service';

export interface IKeysAndLocksCover {
  _id: string
  description: string
  sumInsured: number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc?: boolean
}

@Component({
  selector: 'app-keys-and-locks-form-dialog',
  templateUrl: './keys-and-locks-form-dialog.component.html',
  styleUrls: ['./keys-and-locks-form-dialog.component.scss']
})
export class KeysAndLocksFormDialogComponent implements OnInit {

  keysAndLocksForm: FormGroup;
  toWords = new ToWords;
  keysAndLocksCover: IKeysAndLocksCover;
  submitted: boolean = false;

  quote: IQuoteSlip;
  currentUser$: Observable<IUser>;
  permissions: PermissionType[] = [];

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private keysAndLocksCoverService: KeysAndLocksCoverService,
    private accountService: AccountService,
    private bscCoverService: BscCoverService
  ) {
    this.keysAndLocksCover = this.config.data.keysAndLocksCover;
    this.quote = this.config.data.quote;
    this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
    this.createForm(this.keysAndLocksCover);

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


  deletefile(e) {
    if (this.keysAndLocksCover._id) {
      let payload = {}
      payload['filePath'] = this.keysAndLocksCover.filePath
      payload['_id'] = this.keysAndLocksCover._id
      console.log(payload)
      this.keysAndLocksCoverService.deleteFilePath(payload).subscribe(res => {
        // @ts-ignore
        if (res?.data.success) {
          this.ref.close(this.keysAndLocksCover)
        }
      })
    }
  }

  createForm(item?: IKeysAndLocksCover) {
    this.keysAndLocksForm = this.formBuilder.group({
      _id: [item?._id],
      description: [item?.description, [Validators.required, Validators.min(1)]],
      sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
      fileInput: [item?.filePath]
    })
  }

  submitKeysAndLocks() {
    if (this.keysAndLocksForm.valid) {

      const payload = { ...this.keysAndLocksForm.value }
      let bscFormData = new FormData();
      bscFormData.append("description", payload['description']);
      bscFormData.append("sumInsured", payload['sumInsured']);
      bscFormData.append("quoteId", this.config.data.quoteId)
      bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
      bscFormData.append("file", payload['fileInput']);

      if (this.keysAndLocksCover?._id) {
        console.log('Updated')
        const payload = { ...this.keysAndLocksForm.value }

        this.keysAndLocksCoverService.update(payload._id, bscFormData).subscribe({
          next: (response: IOneResponseDto<IKeysAndLocksCover>) => {
            this.keysAndLocksCover = response.data.entity
            this.ref.close(this.keysAndLocksCover);
          },
          error: error => {
            console.log(error);
          }
        });


      } else {
        const payload = { ...this.keysAndLocksForm.value }
        payload['quoteId'] = this.config.data.quoteId;

        console.log('Created');
        this.keysAndLocksCoverService.create(bscFormData).subscribe({
          next: (response: IOneResponseDto<IKeysAndLocksCover>) => {
            this.keysAndLocksCover = response.data.entity
            this.ref.close(this.keysAndLocksCover);
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
    this.keysAndLocksForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile() {
    this.bscCoverService.downloadExcel(this.keysAndLocksCover?.filePath).subscribe(res => {

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
