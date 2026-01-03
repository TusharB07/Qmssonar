import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, forkJoin } from 'rxjs';
import { ILov, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscWorkmenCompensation } from 'src/app/features/admin/bsc-workmen_compensation/bsc-workmen_compensation.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { BscWorkmenCompensationService } from './bsc-workmen-compensation.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';

@Component({
  selector: 'app-bsc-workmen-compensation-form-dialog',
  templateUrl: './bsc-workmen-compensation-form-dialog.component.html',
  styleUrls: ['./bsc-workmen-compensation-form-dialog.component.scss']
})
export class BscWorkmenCompensationFormDialogComponent implements OnInit {

  workmenSectionForm: FormGroup;

  optionDropDownForAvgSal = []

  permissions: PermissionType[] = [];

  quote: IQuoteSlip;

  currentUser$: Observable<IUser>;

  bscWorkmenCompensationCover: IBscWorkmenCompensation[];

  optionsRiskType: ILov[]
  minNSTP: any = 0;

  quoteOption: IQuoteOption                           // New_Quote_option

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    private accountService: AccountService,
    private listOfValueService: ListOfValueMasterService,
    private bscWorkmenCompensationService: BscWorkmenCompensationService,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private bscCoverService: BscCoverService
  ) {

    this.bscWorkmenCompensationCover = this.config.data.bscWorkmenCompensationCover

    this.currentUser$ = this.accountService.currentUser$

    this.quote = this.config.data.quote

    this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
  }

  ngOnInit(): void {

    this.createFormGroup(this.bscWorkmenCompensationCover)

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

    /* this.optionDropDownForAvgSal = [
      { label: '₹ 25,000', value: 25000 }
    ] */
  }

  createFormGroup(items: IBscWorkmenCompensation[]) {
    this.workmenSectionForm = this.fb.group({
      formArray: this.fb.array(items.length > 0 ? items.map((item: IBscWorkmenCompensation) => this.createForm(item)) : [this.createForm()])
    })
  }

  createForm(item?: IBscWorkmenCompensation): FormGroup {
    const workmenSectionType = item?.riskTypeId as IListOfValueMaster;
    return this.fb.group({
      _id: [item?._id],
      riskTypeId: [workmenSectionType ? { label: workmenSectionType.lovKey, value: workmenSectionType._id, empMin: workmenSectionType.EmployeeMinLimit, empMax: workmenSectionType.EmployeemaxLimit, sumMin: workmenSectionType?.fromSI, sumMax: workmenSectionType?.toSI, maxNSTP: workmenSectionType?.perEmployeeLimit ?? 0 } : [], [Validators.required]],
      sumInsured: [item?.sumInsured ?? 0, [Validators.required]],
      noOfEmployee: [item?.noOfEmployee ?? 0, [Validators.required, Validators.min(workmenSectionType?.EmployeeMinLimit), Validators.max(workmenSectionType?.EmployeemaxLimit)]],
      averageSalaryOfEmployee: [item?.averageSalaryOfEmployee ?? null, [Validators.required]],
      fileInput: [item?.filePath]
    })
  }

  get formArray(): FormArray {
    return this.workmenSectionForm.get("formArray") as FormArray;
  }

  addFormToArray(): void {
    this.formArray.push(this.createForm());
  }

  deleteFormBasedOnIndex(rowIndex: number): void {
    if (this.bscWorkmenCompensationCover[rowIndex]?._id) {
      this.bscWorkmenCompensationService.delete(this.bscWorkmenCompensationCover[rowIndex]._id).subscribe({
        next: res => {
          this.bscWorkmenCompensationCover = this.bscWorkmenCompensationCover.filter((item: IBscWorkmenCompensation) => item._id != this.bscWorkmenCompensationCover[rowIndex]._id)
          this.ref.close(this.bscWorkmenCompensationCover);
        },
        error: e => {
          console.log(e.error.message);
        }
      });
    } else {
      this.formArray.removeAt(rowIndex);
    }
  }

  searchOptionsAvarageSalary() {
    this.optionDropDownForAvgSal = [
      { label: '₹ 25,000', value: 25000 }
    ]
  }

  calculateSum(e, i) {
    let renewalPolicyMonth = Number(this.quote.renewalPolicyPeriod.split(' ')[0])

    if (this.formArray.controls[i].get('riskTypeId').value.label == 'Workmen Compensation') {
      this.formArray.controls[i].get('averageSalaryOfEmployee').valueChanges.subscribe(val => {
        this.formArray.controls[i].get('sumInsured').setValue(this.formArray.controls[i].value['noOfEmployee'] * val * renewalPolicyMonth)
      })
      this.formArray.controls[i].get('noOfEmployee').valueChanges.subscribe(val => {
        this.formArray.controls[i].get('sumInsured').setValue(this.formArray.controls[i].value['averageSalaryOfEmployee'] * val * renewalPolicyMonth)
      })
    }
  }

  searchOptionsRiskType() {
    this.listOfValueService.current(AllowedListOfValuesMasters.BSC_WORKMEN_COMPENSATION_RISK_TYPE, this.quote?.productId['_id']).subscribe({
      next: data => {
        this.optionsRiskType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, empMin: entity.EmployeeMinLimit, empMax: entity.EmployeemaxLimit, sumMin: entity?.fromSI, sumMax: entity?.toSI, maxNSTP: entity?.perEmployeeLimit ?? 0 }));
        let toSI = data.data.entities.filter(item => item.lovKey == 'Workmen Compensation')[0]['toSI']
        let fromSI = data.data.entities.filter(item => item.lovKey == 'Workmen Compensation')[0]['fromSI']
        // let fromSI = 5000;
        this.optionDropDownForAvgSal = [];
        let to = Math.ceil(toSI / 5000)
        let from = Math.ceil(fromSI / 5000)

        for (let index = from; index <= to; index++) {
          this.optionDropDownForAvgSal.push({ label: '₹ ' + (index * 5000).toLocaleString('en-IN'), value: index * 5000 })
        }

        if (this.optionDropDownForAvgSal[this.optionDropDownForAvgSal.length - 1]?.value > toSI) {
          this.optionDropDownForAvgSal[this.optionDropDownForAvgSal.length - 1] = { label: '₹ ' + toSI.toLocaleString('en-IN'), value: toSI }
        }
      },
      error: e => { }
    })
  }

  setErrorMessage(e, i) {
    this.formArray.controls[i].get('noOfEmployee').clearValidators()
    this.formArray.controls[i].get('noOfEmployee').setValidators([Validators.required, Validators.min(e.empMin), Validators.max(e.empMax)])
    this.formArray.controls[i].get('noOfEmployee').updateValueAndValidity();
  }

  cancel() {
    this.ref.close();
  }

  submitWorkmenCompensationForm() {

    if (this.workmenSectionForm.valid) {
      const formGroupData = { ...this.workmenSectionForm.value };

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

          const payload = { ...formData };
          payload['riskTypeId'] = payload.riskTypeId.value;

          // if (formData.riskTypeId.label == 'Employee') {
          //   payload['perEmployeeSumInsured'] = payload.sumInsured.value;
          //   payload['sumInsured'] = payload['perEmployeeSumInsured'] * payload['noOfEmployee'];
          // }
          // if (formData.riskTypeId.label == 'Owner') {
          //   payload['sumInsured'] = payload.sumInsured.value;
          // }

          payload['averageSalaryOfEmployee'] = payload.averageSalaryOfEmployee;


          let bscFormData = new FormData();
          bscFormData.append("riskTypeId", payload['riskTypeId']);
          // bscFormData.append("riskDescription", payload['riskDescription']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          // bscFormData.append("perEmployeeSumInsured", payload['perEmployeeSumInsured'] ?? 0);
          bscFormData.append("noOfEmployee", payload['noOfEmployee'] ?? 0);
          bscFormData.append("averageSalaryOfEmployee", payload['averageSalaryOfEmployee'] ?? 0);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
          bscFormData.append("_id", formData['_id'] ? formData['_id'] : '')
          bscFormData.append("file", formData['fileInput']);

          // createContactDetailObservables$.push(this.bscWorkmenCompensationService.create(bscFormData));
          if (payload._id) {
            // this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != payload._id ? bscFidelityGuranteeCover : payload)

            createContactDetailObservables$.push(this.bscWorkmenCompensationService.update(payload._id, bscFormData));
          } else {
            payload['quoteId'] = this.config.data.quoteId;
            payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
            createContactDetailObservables$.push(this.bscWorkmenCompensationService.create(bscFormData));
          }
        }

        forkJoin(createContactDetailObservables$).subscribe({
          next: (items: IBscWorkmenCompensation[]) => {
            items.map((response: any) => {
              if (response.data.entity._id) {
                this.bscWorkmenCompensationCover = this.bscWorkmenCompensationCover.map((item: IBscWorkmenCompensation) => item._id != response.data.entity._id ? item : response.data.entity)
              } else {
                this.bscWorkmenCompensationCover.push(response.data.entity)
              }
            })
            this.ref.close(this.bscWorkmenCompensationCover);
          },
          error: err => {
            console.log(err);
          }
        });
      }

    }
  }
  onBasicUpload(e, index) {
    this.formArray.value[index].fileInput = e.currentFiles[0]
  }
  isFile(val): boolean {
    console.log(typeof val);
    return typeof val === 'object';
  }

  deletefile(rowIndex) {

    if (this.bscWorkmenCompensationCover[rowIndex]._id) {
      let payload = {}
      payload['filePath'] = this.bscWorkmenCompensationCover[rowIndex].filePath
      payload['_id'] = this.bscWorkmenCompensationCover[rowIndex]._id
      console.log(payload)
      this.bscWorkmenCompensationService.deleteFilePath(payload).subscribe(res => {
        // @ts-ignore
        if (res?.data.success) {
          this.ref.close(this.bscWorkmenCompensationCover[rowIndex])
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
    this.bscCoverService.downloadExcel(this.bscWorkmenCompensationCover[i]?.filePath).subscribe(res => {

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
