import { IBscAllRisks } from './../../../admin/bsc-portable-equipments/bsc-portable-equipment.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, forkJoin } from 'rxjs';
import { ILov, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscAllRiskService } from 'src/app/features/admin/bsc-cover/bsc-all-risks/bsc-all-risk.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-bsc-all-risk-form-dialog',
  templateUrl: './bsc-all-risk-form-dialog.component.html',
  styleUrls: ['./bsc-all-risk-form-dialog.component.scss']
})
export class BscAllRiskFormDialogComponent implements OnInit {

  allRisksForm: FormGroup;

  optionsEquipmentType: ILov[];
  bscAllRiskCover: IBscAllRisks[];
  optionsEquipments: ILov[];

  currentUser$: Observable<IUser>;
  permissions: PermissionType[] = [];

  quote: IQuoteSlip
  minNSTP:any = 0;


  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private bscAllRiskService: BscAllRiskService,
    private listOfValueService: ListOfValueMasterService,
    private accountService: AccountService,
    private messageService: MessageService,
    private bscCoverService: BscCoverService
  ) {

    this.optionsEquipmentType = []

    this.bscAllRiskCover = this.config.data.bscAllRiskCover

    // this.bscAllRiskCover = []

    this.currentUser$ = this.accountService.currentUser$

    this.quote = this.config.data.quote
  }

  ngOnInit(): void {
    this.createFormGroup(this.bscAllRiskCover);

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
    this.listOfValueService.current(AllowedListOfValuesMasters.BSC_RISK_ALL_TYPE, this.quote?.productId['_id']).subscribe({
        next: data => {
            this.optionsEquipmentType = data.data.entities.filter(val => this.config.data.quote.partnerId._id == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, sumMin: entity.fromSI, sumMax: entity.toSI, maxNSTP:entity?.perEmployeeLimit ?? 0 }));
            // this.selectedEquipmentType = this.optionsEquipmentType[0];
        },
        error: e => { }
    })
}

  createFormGroup(items: IBscAllRisks[]) {
    this.allRisksForm = this.fb.group({
      // If has item creates form for each either just creates one blank form
      formArray: this.fb.array(items.length > 0 ? items.map((item: IBscAllRisks) => this.createForm(item)) : [this.createForm()]),
    });
  }

  createForm(item?: IBscAllRisks): FormGroup {
    const portableEquipmentType = item?.riskTypeId as IListOfValueMaster;
    console.log(item)

    return this.fb.group({
      _id: [item?._id],
      riskTypeId: [portableEquipmentType ? { label: portableEquipmentType.lovKey, value: portableEquipmentType._id, sumMin: portableEquipmentType.fromSI, sumMax: portableEquipmentType.toSI, maxNSTP:portableEquipmentType?.perEmployeeLimit ?? 0 } : null, [Validators.required]],
      //   riskTypeId: [],
      riskDescription: [item?.riskDescription, [Validators.required, Validators.maxLength(255)]],
      // geography: [item?.geography, [Validators.required]],
      sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
      fileInput: [item?.filePath]
    });
  }


  get formArray(): FormArray {
    return this.allRisksForm.get("formArray") as FormArray;
  }

  addFormToArray(): void {
    this.formArray.push(this.createForm());
  }

  deleteFormBasedOnIndex(rowIndex: number): void {

    if (this.bscAllRiskCover[rowIndex]?._id) {
      console.log(this.bscAllRiskCover[rowIndex]._id);

      this.bscAllRiskService.delete(this.bscAllRiskCover[rowIndex]._id).subscribe({
        next: res => {
          console.log(res);
          this.bscAllRiskCover = this.bscAllRiskCover.filter((item: IBscAllRisks) => item._id != this.bscAllRiskCover[rowIndex]._id)

          this.ref.close(this.bscAllRiskCover);
        },
        error: e => {
          console.log(e.error.message);
        }
      });
    } else {
      this.formArray.removeAt(rowIndex);
    }
  }

  deletefile(rowIndex) {

    if (this.bscAllRiskCover[rowIndex]._id) {
      let payload = {}
      payload['filePath'] = this.bscAllRiskCover[rowIndex].filePath
      payload['_id'] = this.bscAllRiskCover[rowIndex]._id
      console.log(payload)
      this.bscAllRiskService.deleteFilePath(payload).subscribe(res => {
        // @ts-ignore
        if (res?.data.success) {
          this.ref.close(this.bscAllRiskCover[rowIndex])
        }
      })
    }

    // if(this.fileUpload!){
    //     this.fileUpload!.remove(e,0)
    //     this.fileUpload!.clear()
    //     this.fireLossOfProfitForm.value['fileInput'] = null
    //     console.log(this.fileUpload!)
    // }else{
    //     let payload = {}
    //     payload['filePath']= this.bscFireLossOfProfit.filePath
    //     payload['_id'] = this.bscFireLossOfProfit._id
    //     console.log(payload)
    //     this.bscFireLossOfProfitService.deleteFilePath(payload).subscribe(res => {
    //         // @ts-ignore
    //         if(res?.data.success){
    //             this.ref.close(this.bscFireLossOfProfit)
    //         }
    //     })
    // }
  }

  downloadFile(i) {
    this.bscCoverService.downloadExcel(this.bscAllRiskCover[i]?.filePath).subscribe(res => {

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

  submitAllRiskForm() {
    console.log(this.allRisksForm)
    if (this.allRisksForm.valid) {

      const formGroupData = { ...this.allRisksForm.value };

      const formArray = formGroupData["formArray"];

      const checkDulicateArray = formArray.map(item => item.riskTypeId.value)
      const isDuplicate = checkDulicateArray.filter((item, index) => checkDulicateArray.indexOf(item) !== index).length != 0

      if (isDuplicate) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Duplicate values are not allowed', icon: 'pi-times', closable: false });
      }
      else {
        const createContactDetailObservables$ = [];

        for (let i = 0; i < formArray.length; i++) {
          const formData = formArray[i];

          let bscFormData = new FormData();
          bscFormData.append("riskDescription", formData['riskDescription']);
          bscFormData.append("riskTypeId", formData['riskTypeId']['value']);
          // bscFormData.append("geography", formData['geography']);
          bscFormData.append("sumInsured", formData['sumInsured']);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("_id", formData['_id'] ? formData['_id'] : '')
          bscFormData.append("file", formData['fileInput']);

          const payload = { ...formData };
          delete payload.fileInput;
          payload.riskTypeId = payload.riskTypeId.value

          console.log(payload)
          // createContactDetailObservables$.push(this.bscAllRiskService.create(bscFormData));

          if (payload._id) {
              console.log('update')
              // this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != payload._id ? bscFidelityGuranteeCover : payload)

              createContactDetailObservables$.push(this.bscAllRiskService.update(payload._id, bscFormData));
          } else {
              console.log('create')
              // this.bscFidelityGuranteeCovers.push(payload)
              payload['quoteId'] = this.config.data.quoteId;
              createContactDetailObservables$.push(this.bscAllRiskService.create(bscFormData));
          } 


        }

        forkJoin(createContactDetailObservables$).subscribe({
          next: (items: IBscAllRisks[]) => {
            console.log(items)
            this.bscAllRiskCover = []
            items.map((response: any) => {
              this.bscAllRiskCover.push(response.data.entity)
              console.log(response.data.entity)
               if (response.data.entity._id) {
                  this.bscAllRiskCover = this.bscAllRiskCover.map((item: IBscAllRisks) => item._id != response.data.entity._id ? item : response.data.entity)
                  console.log('update')
              } else {
                  console.log('create')
                  this.bscAllRiskCover.push(response.data.entity)
              } 

            })

            this.ref.close(this.bscAllRiskCover);

          },
          error: err => {
            console.log(err);
          }
        });
      }

    }
  }

  isFile(val): boolean {
    console.log(typeof val);
    return typeof val === 'object';
  }

  cancel() {
    this.ref.close();
  }

  onBasicUpload(e, index) {
    this.formArray.value[index].fileInput = e.currentFiles[0]
  }


}
