import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscAccompaniedBaggage } from 'src/app/features/admin/bsc-accompanied-baggage/bsc-accompanied-baggage.model';
import { BscAccompaniedBaggageService } from 'src/app/features/admin/bsc-accompanied-baggage/bsc-accompanied-baggage.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-bsc-accompanied-baggage-form-dialog',
  templateUrl: './bsc-accompanied-baggage-form-dialog.component.html',
  styleUrls: ['./bsc-accompanied-baggage-form-dialog.component.scss']
})
export class BscAccompaniedBaggageFormDialogComponent implements OnInit {
  accompaniedBaggageForm: FormGroup;
  optionsbaggageType: ILov[];
  submitted: boolean = false;
  bscAccompaniedBaggageCovers: IBscAccompaniedBaggage[];
  currentUser$: Observable<IUser>;
  quote: IQuoteSlip
  minNSTP: any = 0;

  quoteOption: IQuoteOption                           // New_Quote_option

  permissions: PermissionType[] = [];
  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private bscAccompaniedBaggageService: BscAccompaniedBaggageService,
    private listOfValueService: ListOfValueMasterService,
    private accountService: AccountService,
    private messageService: MessageService,
    private bscCoverService: BscCoverService

  ) {
    this.bscAccompaniedBaggageCovers = this.config.data.bscAccompaniedBaggageCover;

    this.currentUser$ = this.accountService.currentUser$

    this.quote = this.config.data.quote

    this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    console.log(this.quoteOption, "kkjhgfdfffff")
  }

  ngOnInit(): void {
    this.createFormGroup(this.bscAccompaniedBaggageCovers);

    this.currentUser$.subscribe({
      next: user => {
        let role: IRole = user?.roleId as IRole;
        if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

          this.permissions = ['read'];
        } else {

          this.permissions = ['read', 'update'];
        }
      }
    })
  }

  searchOptionsEquipmentTypes(event) {
    this.listOfValueService.current(AllowedListOfValuesMasters.BSC_ACCOMPANIED_BAGGAGE_TYPE, this.quote?.productId['_id']).subscribe({
      next: data => {
        this.optionsbaggageType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, sumMin: entity.fromSI, sumMax: entity.toSI, maxNSTP: entity.perEmployeeLimit ?? 0 }));
        // this.selectedEquipmentType = this.optionsEquipmentType[0];
      },
      error: e => { }
    })
  }

  createFormGroup(items: IBscAccompaniedBaggage[]) {
    this.accompaniedBaggageForm = this.fb.group({
      // If has item creates form for each either just creates one blank form
      formArray: this.fb.array(items.length > 0 ? items.map((item: IBscAccompaniedBaggage) => this.createForm(item)) : [this.createForm()]),
    });
  }

  createForm(item?: IBscAccompaniedBaggage): FormGroup {
    const accompaniedBaggageType = item?.baggageTypeId as IListOfValueMaster;
    return this.fb.group({
      _id: [item?._id],
      baggageTypeId: [accompaniedBaggageType ? { label: accompaniedBaggageType.lovKey, value: accompaniedBaggageType._id, sumMin: accompaniedBaggageType.fromSI, sumMax: accompaniedBaggageType.toSI, maxNSTP: accompaniedBaggageType.perEmployeeLimit ?? 0 } : null, [Validators.required]],
      baggageDescription: [item?.baggageDescription, [Validators.required, Validators.maxLength(255)]],
      sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
      fileInput: [item?.filePath]
    });
  }

  get formArray(): FormArray {
    return this.accompaniedBaggageForm.get("formArray") as FormArray;
  }

  addFormToArray(): void {
    this.formArray.push(this.createForm());
  }

  deleteFormBasedOnIndex(rowIndex: number): void {

    if (this.bscAccompaniedBaggageCovers[rowIndex]?._id) {
      this.bscAccompaniedBaggageService.delete(this.bscAccompaniedBaggageCovers[rowIndex]._id).subscribe({
        next: res => {
          this.bscAccompaniedBaggageCovers = this.bscAccompaniedBaggageCovers.filter((item: IBscAccompaniedBaggage) => item._id != this.bscAccompaniedBaggageCovers[rowIndex]._id)

          this.ref.close(this.bscAccompaniedBaggageCovers);
        },
        error: e => {
          console.log(e.error.message);
        }
      });
    } else {
      this.formArray.removeAt(rowIndex);
    }
  }

  submitAccompaniedBaggageForm() {
    if (this.accompaniedBaggageForm.valid) {

      const formGroupData = { ...this.accompaniedBaggageForm.value };

      const formArray = formGroupData["formArray"];

      const checkDulicateArray = formArray.map(item => item.baggageTypeId.value)
      const isDuplicate = checkDulicateArray.filter((item, index) => checkDulicateArray.indexOf(item) !== index).length != 0

      if (isDuplicate) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Duplicate values are not allowed', icon: 'pi-times', closable: false });
      }
      else {
        const createContactDetailObservables$ = [];

        for (let i = 0; i < formArray.length; i++) {
          const formData = formArray[i];

          let bscFormData = new FormData();
          bscFormData.append("baggageTypeId", formData['baggageTypeId']['value']);
          bscFormData.append("baggageDescription", formData['baggageDescription']);
          bscFormData.append("sumInsured", formData['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
          bscFormData.append("_id", formData['_id'] ? formData['_id'] : '')
          bscFormData.append("file", formData['fileInput']);

          //createContactDetailObservables$.push(this.bscAccompaniedBaggageService.create(bscFormData));
          const payload = { ...formData };
          payload['baggageTypeId'] = payload.baggageTypeId.value;

          if (payload._id) {
            // this.bscAccompaniedBaggageCovers = this.bscAccompaniedBaggageCovers.map((bscAccompaniedBaggageCover: IBscAccompaniedBaggage) => bscAccompaniedBaggageCover._id != payload._id ? bscAccompaniedBaggageCover : payload)

            createContactDetailObservables$.push(this.bscAccompaniedBaggageService.update(payload._id, bscFormData));
          } else {
            payload['quoteId'] = this.config.data.quoteId;
            payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
            createContactDetailObservables$.push(this.bscAccompaniedBaggageService.create(bscFormData));
          }


        }

        forkJoin(createContactDetailObservables$).subscribe({
          next: (items: IBscAccompaniedBaggage[]) => {
            this.bscAccompaniedBaggageCovers = [];
            items.map((response: any) => {
              this.bscAccompaniedBaggageCovers.push(response.data.entity)
              if (response.data.entity._id) {
                this.bscAccompaniedBaggageCovers = this.bscAccompaniedBaggageCovers.map((item: IBscAccompaniedBaggage) => item._id != response.data.entity._id ? item : response.data.entity)
              } else {
                this.bscAccompaniedBaggageCovers.push(response.data.entity)
              }

            })

            this.ref.close(this.bscAccompaniedBaggageCovers);

          },
          error: err => {
            console.log(err);
          }
        });
      }

    }
  }

  downloadFile(i) {
    this.bscCoverService.downloadExcel(this.bscAccompaniedBaggageCovers[i]?.filePath).subscribe(res => {

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

  deletefile(rowIndex) {

    if (this.bscAccompaniedBaggageCovers[rowIndex]?._id) {
      let payload = {}
      payload['filePath'] = this.bscAccompaniedBaggageCovers[rowIndex]?.filePath
      payload['_id'] = this.bscAccompaniedBaggageCovers[rowIndex]?._id
      this.bscAccompaniedBaggageService.deleteFilePath(payload).subscribe(res => {
        // @ts-ignore
        if (res?.data.success) {
          this.ref.close(this.bscAccompaniedBaggageCovers[rowIndex])
        }
      })
    }

  }

  cancel() {
    this.ref.close();
  }

  isFile(val): boolean {
    return typeof val === 'object';
  }

  onBasicUpload(e, index) {
    this.formArray.value[index].fileInput = e.currentFiles[0]
  }
}
