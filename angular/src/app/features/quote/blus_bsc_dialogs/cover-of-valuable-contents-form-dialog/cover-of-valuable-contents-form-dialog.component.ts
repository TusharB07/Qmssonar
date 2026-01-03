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
import { CoverOfValuableContentsService } from './cover-of-valuable-contents.service';

export interface ICoverOfValuableContentsCover {
  _id: string
  description: string
  sumInsured: number
  quoteId: string | IQuoteSlip;
  total: number;
  filePath?: string
  isNonOtc?: boolean
}

@Component({
  selector: 'app-cover-of-valuable-contents-form-dialog',
  templateUrl: './cover-of-valuable-contents-form-dialog.component.html',
  styleUrls: ['./cover-of-valuable-contents-form-dialog.component.scss']
})
export class CoverOfValuableContentsFormDialogComponent implements OnInit {

  coverOfValuableContentsForm: FormGroup;
  toWords = new ToWords;
  coverOfValuableContentsCover: ICoverOfValuableContentsCover;
  submitted: boolean = false;

  quote: IQuoteSlip;
  currentUser$: Observable<IUser>;
  permissions: PermissionType[] = [];

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private formBuilder: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private coverOfValuableContentsService: CoverOfValuableContentsService,
    private accountService: AccountService,
    private bscCoverService: BscCoverService
  ) {
    this.coverOfValuableContentsCover = this.config.data.coverOfValuableContentsCover;
    this.quote = this.config.data.quote;
    this.currentUser$ = this.accountService.currentUser$
  }

  ngOnInit(): void {
    this.createForm(this.coverOfValuableContentsCover);

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
    if (this.coverOfValuableContentsCover._id) {
      let payload = {}
      payload['filePath'] = this.coverOfValuableContentsCover.filePath
      payload['_id'] = this.coverOfValuableContentsCover._id
      console.log(payload)
      this.coverOfValuableContentsService.deleteFilePath(payload).subscribe(res => {
        // @ts-ignore
        if (res?.data.success) {
          this.ref.close(this.coverOfValuableContentsCover)
        }
      })
    }
  }

  createForm(item?: ICoverOfValuableContentsCover) {
    this.coverOfValuableContentsForm = this.formBuilder.group({
      _id: [item?._id],
      description: [item?.description, [Validators.required, Validators.min(1)]],
      sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
      // fileInput: [item?.filePath]
    })
  }

  submitCoverOfValuableContents() {
    if (this.coverOfValuableContentsForm.valid) {

      const payload = { ...this.coverOfValuableContentsForm.value }
      let bscFormData = new FormData();
      bscFormData.append("description", payload['description']);
      bscFormData.append("sumInsured", payload['sumInsured']);
      bscFormData.append("quoteId", this.config.data.quoteId)
      bscFormData.append("_id", payload['_id'] ? payload['_id'] : '')
      bscFormData.append("file", payload['fileInput']);

      if (this.coverOfValuableContentsCover?._id) {
        console.log('Updated')
        const payload = { ...this.coverOfValuableContentsForm.value }

        this.coverOfValuableContentsService.update(payload._id, bscFormData).subscribe({
          next: (response: IOneResponseDto<ICoverOfValuableContentsCover>) => {
            this.coverOfValuableContentsCover = response.data.entity
            this.ref.close(this.coverOfValuableContentsCover);
          },
          error: error => {
            console.log(error);
          }
        });


      } else {
        const payload = { ...this.coverOfValuableContentsForm.value }

        payload['quoteId'] = this.config.data.quoteId;

        console.log('Created');
        this.coverOfValuableContentsService.create(bscFormData).subscribe({
          next: (response: IOneResponseDto<ICoverOfValuableContentsCover>) => {
            this.coverOfValuableContentsCover = response.data.entity
            this.ref.close(this.coverOfValuableContentsCover);
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
    this.coverOfValuableContentsForm.value.fileInput = e.currentFiles[0]
  }

  isUrl(val): boolean { return typeof val === 'string'; }

  downloadFile() {
    this.bscCoverService.downloadExcel(this.coverOfValuableContentsCover?.filePath).subscribe(res => {

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
