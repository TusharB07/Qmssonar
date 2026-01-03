import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { IBscLiability } from 'src/app/features/admin/bsc-liability/bsc-liability.model';
import { BscLiabilityService } from 'src/app/features/admin/bsc-liability/bsc-liability.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-bsc-liability-section-form-dialog',
  templateUrl: './bsc-liability-section-form-dialog.component.html',
  styleUrls: ['./bsc-liability-section-form-dialog.component.scss']
})
export class BscLiabilitySectionFormDialogComponent implements OnInit {
  liabilitySectionForm: FormGroup;
  optionsRiskType: ILov[];
  submitted: boolean = false;
  bscLiabilitySectionCovers: IBscLiability[];
  currentUser$: Observable<IUser>;

  quote: IQuoteSlip
  submitflag = false

  permissions: PermissionType[] = [];

  optionDropDownForEmpSum = []
  optionDropDownForAvgSal = []
  minNSTP: any = 0;

  quoteOption: IQuoteOption                           // New_Quote_option

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private bscLiabilityService: BscLiabilityService,
    private listOfValueService: ListOfValueMasterService,
    private accountService: AccountService,
    private messageService: MessageService,
    private bscCoverService: BscCoverService

  ) {
    this.bscLiabilitySectionCovers = config.data.bscLiabilitySectionCover;

    this.currentUser$ = this.accountService.currentUser$

    this.quote = this.config.data.quote

    this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
  }
  ngOnInit(): void {
    this.createFormGroup(this.bscLiabilitySectionCovers);

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
    this.optionDropDownForEmpSum = []
    this.optionDropDownForAvgSal = [
      { label: '₹ 25,000', value: 25000 }
    ]
  }

  calculateSum(e, i) {
    if (this.formArray.controls[i].get('riskTypeId').value.label == 'Workmen Compensation') {
      this.formArray.controls[i].get('averageSalaryOfEmployee').valueChanges.subscribe(val => {
        this.formArray.controls[i].get('sumInsured').setValue(this.formArray.controls[i].value['noOfEmployee'] * val['value'])
      })
      this.formArray.controls[i].get('noOfEmployee').valueChanges.subscribe(val => {
        this.formArray.controls[i].get('sumInsured').setValue(this.formArray.controls[i].value['averageSalaryOfEmployee']['value'] * val)
      })
    }
  }

  createSumInsuredForEmp(e, i) {
    // this.optionDropDownForEmpSum = [{ label: '₹ ' + e.suminsured / 2, value: e.suminsured / 2 }, { label: '₹ ' + e.suminsured, value: e.suminsured }]
    if (e.label == 'Employee' || e.label == 'Workmen Compensation') {
      this.formArray.controls[i].get('sumInsured').setValue(0)
      this.formArray.controls[i].get('riskDescription').clearValidators()
      this.formArray.controls[i].get('riskDescription').updateValueAndValidity();
      this.formArray.controls[i].get('noOfEmployee').clearValidators()
      this.formArray.controls[i].get('noOfEmployee').setValidators([Validators.required, Validators.min(e.empMin), Validators.max(e.empMax)])
      this.formArray.controls[i].get('noOfEmployee').updateValueAndValidity();
      console.log(this.formArray.controls[i].get('noOfEmployee'));
    }

    if (e.label == 'Workmen Compensation') {
      this.formArray.controls[i].get('sumInsured').setValue(0)
      this.formArray.controls[i].get('riskDescription').clearValidators()
      this.formArray.controls[i].get('riskDescription').updateValueAndValidity();
      this.formArray.controls[i].get('averageSalaryOfEmployee').clearValidators()
      this.formArray.controls[i].get('averageSalaryOfEmployee').setValidators([Validators.required, Validators.min(1)])
      this.formArray.controls[i].get('averageSalaryOfEmployee').updateValueAndValidity();
    }

    if (e.label != 'Employee') {
      this.formArray.controls[i].get('sumInsured').setValue(0)
      // @ts-ignore
      if (this.formArray.controls[i].get('sumInsured').value.value) {
        this.formArray.controls[i].get('sumInsured').setValue(this.formArray.controls[i].get('sumInsured').value['value'])
      }
    }

    if (e.label != 'Employee' && e.label != 'Workmen Compensation') {
      this.formArray.controls[i].get('noOfEmployee').clearValidators()
      this.formArray.controls[i].get('noOfEmployee').updateValueAndValidity();
      this.formArray.controls[i].get('averageSalaryOfEmployee').clearValidators()
      this.formArray.controls[i].get('averageSalaryOfEmployee').updateValueAndValidity();
      this.formArray.controls[i].get('riskDescription').clearValidators()
      this.formArray.controls[i].get('riskDescription').setValidators([Validators.required, Validators.maxLength(255)])
      this.formArray.controls[i].get('riskDescription').updateValueAndValidity();
    }
  }

  searchOptionsRiskType(event, i) {
    this.listOfValueService.current(AllowedListOfValuesMasters.BSC_LIABILITY_SECTION_RISK_TYPE, this.quote?.productId['_id']).subscribe({
      next: data => {
        this.optionsRiskType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, empMin: entity.EmployeeMinLimit, empMax: entity.EmployeemaxLimit, sumMin: entity?.fromSI, sumMax: entity?.toSI, maxNSTP: entity.perEmployeeLimit ?? 0 }));
        // let toSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['toSI']
        // let fromSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['fromSI']
        let toSI = 0;
        let fromSI = 0;
        let to = 0;
        let from = 0;
        this.optionDropDownForEmpSum = []
        if (this.formArray.controls[i].value?.riskTypeId?.label == 'Employee') {
          toSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['toSI']
          fromSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['fromSI']

          to = Math.ceil(toSI / 50000)
          from = Math.ceil(fromSI / 50000)

          for (let index = from; index <= to; index++) {
            this.optionDropDownForEmpSum.push({ label: '₹ ' + (index * 50000).toLocaleString('en-IN'), value: index * 50000 })
          }
        }
        if (this.formArray.controls[i].value?.riskTypeId?.label == 'Owner') {
          toSI = data.data.entities.filter(item => item.lovKey == 'Owner')[0]['toSI']
          fromSI = data.data.entities.filter(item => item.lovKey == 'Owner')[0]['fromSI']

          to = Math.ceil(toSI / 100000)
          from = Math.ceil(fromSI / 100000)
          for (let index = from; index <= to; index++) {
            this.optionDropDownForEmpSum.push({ label: '₹ ' + (index * 100000).toLocaleString('en-IN'), value: (index * 100000).toLocaleString('en-IN') })
          }
        }

        if (this.optionDropDownForEmpSum[this.optionDropDownForEmpSum.length - 1]?.value > toSI) {
          this.optionDropDownForEmpSum[this.optionDropDownForEmpSum.length - 1] = { label: '₹ ' + toSI.toLocaleString('en-IN'), value: toSI }
        }

        // this.optionDropDownForEmpSum = [{ label: '₹ ' + maxSumInsured / 2, value: maxSumInsured / 2 }, { label: '₹ ' + maxSumInsured, value: maxSumInsured }]
      },
      error: e => { }
    })
  }

  createFormGroup(items: IBscLiability[]) {
    this.liabilitySectionForm = this.fb.group({
      formArray: this.fb.array(items.length > 0 ? items.map((item: IBscLiability) => this.createForm(item)) : [this.createForm()]),
    });
  }

  createForm(item?: IBscLiability): FormGroup {
    const liabilitySectionType = item?.riskTypeId as IListOfValueMaster;
    let si;
    if (liabilitySectionType?.lovKey == 'Employee') {
      si = { label: '₹ ' + item?.perEmployeeSumInsured.toLocaleString('en-IN'), value: item?.perEmployeeSumInsured }
    }
    else if (liabilitySectionType?.lovKey == 'Owner') {
      si = { label: '₹ ' + item?.sumInsured.toLocaleString('en-IN'), value: item?.sumInsured }
    }
    else {
      si = item?.sumInsured
    }

    return this.fb.group({
      _id: [item?._id],
      riskTypeId: [liabilitySectionType ? { label: liabilitySectionType.lovKey, value: liabilitySectionType._id, empMin: liabilitySectionType.EmployeeMinLimit, empMax: liabilitySectionType.EmployeemaxLimit, sumMin: liabilitySectionType?.fromSI, sumMax: liabilitySectionType?.toSI, maxNSTP: liabilitySectionType.perEmployeeLimit ?? 0 } : null, []],
      riskDescription: [item?.riskDescription, (liabilitySectionType?.lovKey != 'Employee' && liabilitySectionType?.lovKey != 'Workmen Compensation') ? [Validators.required, Validators.maxLength(255)] : []],
      sumInsured: [si, [Validators.required, Validators.min(1)]],
      noOfEmployee: [item?.noOfEmployee ?? 0, (liabilitySectionType?.lovKey == 'Employee' || liabilitySectionType?.lovKey == 'Workmen Compensation') ? [Validators.required, Validators.min(liabilitySectionType?.EmployeeMinLimit), Validators.max(liabilitySectionType?.EmployeemaxLimit)] : []],
      averageSalaryOfEmployee: [liabilitySectionType?.lovKey == 'Workmen Compensation' ? { label: '₹ ' + item?.averageSalaryOfEmployee, value: item?.averageSalaryOfEmployee } : item?.averageSalaryOfEmployee ?? 0, (liabilitySectionType?.lovKey == 'Workmen Compensation') ? [Validators.required] : []],
      fileInput: [item?.filePath]
    });
  }

  searchOptionsAvarageSalary() {
    this.optionDropDownForAvgSal = [
      { label: '₹ 25,000', value: 25000 }
    ]
  }


  onfocus(e) {
    console.log(this.formArray)
  }

  get formArray(): FormArray {
    return this.liabilitySectionForm.get("formArray") as FormArray;
  }

  addFormToArray(): void {
    this.formArray.push(this.createForm());
  }

  deleteFormBasedOnIndex(rowIndex: number): void {
    if (this.bscLiabilitySectionCovers[rowIndex]?._id) {

      this.bscLiabilityService.delete(this.bscLiabilitySectionCovers[rowIndex]._id).subscribe({
        next: res => {
          this.bscLiabilitySectionCovers = this.bscLiabilitySectionCovers.filter((item: IBscLiability) => item._id != this.bscLiabilitySectionCovers[rowIndex]._id)
          this.ref.close(this.bscLiabilitySectionCovers);
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

    if (this.bscLiabilitySectionCovers[rowIndex]?._id) {
      let payload = {}
      payload['filePath'] = this.bscLiabilitySectionCovers[rowIndex]?.filePath
      payload['_id'] = this.bscLiabilitySectionCovers[rowIndex]?._id
      this.bscLiabilityService.deleteFilePath(payload).subscribe(res => {
        // @ts-ignore
        if (res?.data.success) {
          this.ref.close(this.bscLiabilitySectionCovers[rowIndex])
        }
      })
    }
  }

  submitLiabilitySectionForm() {

    this.submitflag = true
    if (this.liabilitySectionForm.valid) {
      const formGroupData = { ...this.liabilitySectionForm.value };
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

          if (formData.riskTypeId.label == 'Employee') {
            payload['perEmployeeSumInsured'] = payload.sumInsured.value;
            payload['sumInsured'] = payload['perEmployeeSumInsured'] * payload['noOfEmployee'];
          }
          if (formData.riskTypeId.label == 'Owner') {
            payload['sumInsured'] = payload.sumInsured.value;
          }
          if (formData.riskTypeId.label == 'Workmen Compensation') {
            payload['averageSalaryOfEmployee'] = payload.averageSalaryOfEmployee.value;
          }

          let bscFormData = new FormData();
          bscFormData.append("riskTypeId", payload['riskTypeId']);
          bscFormData.append("riskDescription", payload['riskDescription']);
          bscFormData.append("sumInsured", payload['sumInsured']);
          bscFormData.append("nstp", payload['nstp']);
          bscFormData.append("perEmployeeSumInsured", payload['perEmployeeSumInsured'] ?? 0);
          bscFormData.append("noOfEmployee", payload['noOfEmployee'] ?? 0);
          bscFormData.append("averageSalaryOfEmployee", payload['averageSalaryOfEmployee'] ?? 0);
          bscFormData.append("quoteId", this.config.data.quoteId)
          bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
          bscFormData.append("_id", formData['_id'] ? formData['_id'] : '')
          bscFormData.append("file", formData['fileInput']);

          if (payload._id) {
            // this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != payload._id ? bscFidelityGuranteeCover : payload)

            createContactDetailObservables$.push(this.bscLiabilityService.update(payload._id, bscFormData));
          } else {
            payload['quoteId'] = this.config.data.quoteId;
            payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
            createContactDetailObservables$.push(this.bscLiabilityService.create(bscFormData));
          }
        }

        forkJoin(createContactDetailObservables$).subscribe({
          next: (items: IBscLiability[]) => {
            items.map((response: any) => {
              if (response.data.entity._id) {
                this.bscLiabilitySectionCovers = this.bscLiabilitySectionCovers.map((item: IBscLiability) => item._id != response.data.entity._id ? item : response.data.entity)
              } else {
                this.bscLiabilitySectionCovers.push(response.data.entity)
              }
            })
            this.ref.close(this.bscLiabilitySectionCovers);
          },
          error: err => {
            console.log(err);
          }
        });
      }

    }
  }

  addItem(e) {
    console.log(e)
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

  downloadFile(i) {
    this.bscCoverService.downloadExcel(this.bscLiabilitySectionCovers[i]?.filePath).subscribe(res => {

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
