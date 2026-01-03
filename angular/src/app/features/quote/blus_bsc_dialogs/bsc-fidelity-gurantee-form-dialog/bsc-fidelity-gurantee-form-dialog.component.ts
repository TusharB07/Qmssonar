import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBSCFidelityGurantee } from 'src/app/features/admin/bsc-fidelity-gurantee/bsc-fidelity-gurantee.model';
import { BscFidelityGuranteeService } from 'src/app/features/admin/bsc-fidelity-gurantee/bsc-fidelity-gurantee.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { FileUpload } from 'primeng/fileupload';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';

@Component({
    selector: 'app-bsc-fidelity-gurantee-form-dialog',
    templateUrl: './bsc-fidelity-gurantee-form-dialog.component.html',
    styleUrls: ['./bsc-fidelity-gurantee-form-dialog.component.scss']
})
export class BscFidelityGuranteeFormDialogComponent implements OnInit {
    fidelityGuranteeForm: FormGroup;
    optionsRiskType: ILov[];
    submitted: boolean = false;
    bscFidelityGuranteeCovers: IBSCFidelityGurantee[];
    currentUser$: Observable<IUser>;

    permissions: PermissionType[] = [];
    quote: IQuoteSlip

    submitflag = false
    optionDropDownForEmpSum = []
    minNSTP: any = 0;

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private fb: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private bscFidelityGuranteeService: BscFidelityGuranteeService,
        private listOfValueService: ListOfValueMasterService,
        private accountService: AccountService,
        private messageService: MessageService,
        private bscCoverService: BscCoverService
    ) {
        // Loads data from dialog
        this.bscFidelityGuranteeCovers = this.config.data.bscFidelityGuaranteeCover;
        this.currentUser$ = this.accountService.currentUser$

        this.quote = this.config.data.quote

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option

    }

    ngOnInit(): void {
        // Create Main Form by sending Array based on the dialog data
        this.createFormGroup(this.bscFidelityGuranteeCovers);


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

    createSumInsuredForEmp(e, i) {
        if (e.label == 'Employee') {
            this.formArray.controls[i].get('sumInsured').setValue(0)
            this.formArray.controls[i].get('riskDescription').clearValidators()
            this.formArray.controls[i].get('riskDescription').updateValueAndValidity();
            this.formArray.controls[i].get('noOfEmployee').clearValidators()
            this.formArray.controls[i].get('noOfEmployee').setValidators([Validators.required, Validators.min(e.empMin), Validators.max(e.empMax)])
            this.formArray.controls[i].get('noOfEmployee').updateValueAndValidity();
        }
        if (e.label != 'Employee') {
            this.formArray.controls[i].get('noOfEmployee').clearValidators()
            this.formArray.controls[i].get('noOfEmployee').updateValueAndValidity();
            this.formArray.controls[i].get('riskDescription').clearValidators()
            this.formArray.controls[i].get('riskDescription').setValidators([Validators.required, Validators.maxLength(255)])
            this.formArray.controls[i].get('riskDescription').updateValueAndValidity();
            this.formArray.controls[i].get('sumInsured').setValue(0)
            if (this.formArray.controls[i].get('sumInsured').value['value']) {
                this.formArray.controls[i].get('sumInsured').setValue(this.formArray.controls[i].get('sumInsured').value['value'])
            }
        }

    }

    searchOptionsRiskType(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.BSC_FIDELITY_GURANTEE_RISK_TYPE, this.quote?.productId['_id']).subscribe({
            next: data => {
                this.optionsRiskType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, empMin: entity.EmployeeMinLimit, empMax: entity.EmployeemaxLimit, sumMin: entity.fromSI, sumMax: entity.toSI, maxNSTP: entity?.perEmployeeLimit ?? 0 }));
                let toSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['toSI']
                let fromSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['fromSI']

                let to = Math.ceil(toSI / 50000)
                let from = Math.ceil(fromSI / 50000)

                this.optionDropDownForEmpSum = []
                for (let index = from; index <= to; index++) {
                    this.optionDropDownForEmpSum.push({ label: '₹ ' + (index * 50000).toLocaleString('en-IN'), value: index * 50000 })
                }

                if (this.optionDropDownForEmpSum[this.optionDropDownForEmpSum.length - 1]?.value > toSI) {
                    this.optionDropDownForEmpSum[this.optionDropDownForEmpSum.length - 1] = { label: '₹ ' + toSI.toLocaleString('en-IN'), value: toSI }
                }

            },
            error: e => { }
        })
    }

    createFormGroup(items: IBSCFidelityGurantee[]) {
        this.fidelityGuranteeForm = this.fb.group({
            // If has item creates form for each either just creates one blank form
            formArray: this.fb.array(items.length > 0 ? items.map((item: IBSCFidelityGurantee) => this.createForm(item)) : [this.createForm()]),
        });
    }


    createForm(item?: IBSCFidelityGurantee): FormGroup {
        const fidelityGuranteeType = item?.riskTypeId as IListOfValueMaster;
        return this.fb.group({
            _id: [item?._id],
            riskTypeId: [fidelityGuranteeType ? { label: fidelityGuranteeType.lovKey, value: fidelityGuranteeType._id, empMin: fidelityGuranteeType?.EmployeeMinLimit, empMax: fidelityGuranteeType?.EmployeemaxLimit, sumMin: fidelityGuranteeType?.fromSI, sumMax: fidelityGuranteeType?.toSI, maxNSTP: fidelityGuranteeType?.perEmployeeLimit ?? 0 } : null, [Validators.required]],
            riskDescription: [item?.riskDescription, (fidelityGuranteeType?.lovKey != 'Employee') ? [Validators.required, Validators.maxLength(255)] : []],
            sumInsured: [fidelityGuranteeType?.lovKey != 'Employee' ? (item?.sumInsured ?? 0) : { label: '₹ ' + item?.perEmployeeSumInsured.toLocaleString('en-IN'), value: item?.perEmployeeSumInsured }, [Validators.required, Validators.min(1)]],
            noOfEmployee: [item?.noOfEmployee ?? 0, (fidelityGuranteeType?.lovKey == 'Employee') ? [Validators.required, Validators.min(fidelityGuranteeType.EmployeeMinLimit), Validators.max(fidelityGuranteeType.EmployeemaxLimit)] : []],
            fileInput: [item?.filePath]
        });
    }

    get formArray(): FormArray {
        return this.fidelityGuranteeForm.get("formArray") as FormArray;
    }

    addFormToArray(): void {
        this.formArray.push(this.createForm());
    }

    deleteFormBasedOnIndex(rowIndex: number): void {

        if (this.bscFidelityGuranteeCovers[rowIndex]?._id) {

            this.bscFidelityGuranteeService.delete(this.bscFidelityGuranteeCovers[rowIndex]._id).subscribe({
                next: res => {
                    this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.filter((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != this.bscFidelityGuranteeCovers[rowIndex]._id)

                    this.ref.close(this.bscFidelityGuranteeCovers);
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

        if (this.bscFidelityGuranteeCovers[rowIndex]?._id) {
            let payload = {}
            payload['filePath'] = this.bscFidelityGuranteeCovers[rowIndex]?.filePath
            payload['_id'] = this.bscFidelityGuranteeCovers[rowIndex]?._id
            this.bscFidelityGuranteeService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscFidelityGuranteeCovers[rowIndex])
                }
            })
        }
    }

    downloadFile(i) {
        this.bscCoverService.downloadExcel(this.bscFidelityGuranteeCovers[i]?.filePath).subscribe(res => {

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

    addItem(e) {
        console.log(e)
    }

    submitFidelityGuranteeForm() {
        this.submitflag = true
        if (this.fidelityGuranteeForm.valid) {

            const formGroupData = { ...this.fidelityGuranteeForm.value };

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

                    let bscFormData = new FormData();
                    bscFormData.append("riskTypeId", payload['riskTypeId']);
                    bscFormData.append("riskDescription", payload['riskDescription']);
                    bscFormData.append("sumInsured", payload['sumInsured']);
                    bscFormData.append("noOfEmployee", payload['noOfEmployee'] ?? 0);
                    bscFormData.append("perEmployeeSumInsured", payload['perEmployeeSumInsured'] ?? 0);
                    bscFormData.append("quoteId", this.config.data.quoteId)
                    bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
                    bscFormData.append("_id", formData['_id'] ? formData['_id'] : '')
                    bscFormData.append("file", formData['fileInput']);

                    if (payload._id) {
                        // this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != payload._id ? bscFidelityGuranteeCover : payload)

                        createContactDetailObservables$.push(this.bscFidelityGuranteeService.update(payload._id, bscFormData));
                    } else {
                        payload['quoteId'] = this.config.data.quoteId;
                        payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
                        createContactDetailObservables$.push(this.bscFidelityGuranteeService.create(bscFormData));
                    }

                }

                forkJoin(createContactDetailObservables$).subscribe({
                    next: (bscFidelityGuranteeCovers: IBSCFidelityGurantee[]) => {
                        bscFidelityGuranteeCovers.map((response: any) => {
                            if (response.data.entity._id) {
                                this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != response.data.entity._id ? bscFidelityGuranteeCover : response.data.entity)
                            } else {

                                this.bscFidelityGuranteeCovers.push(response.data.entity)
                            }

                        })

                        this.ref.close(this.bscFidelityGuranteeCovers);

                    },
                    error: err => {
                        console.log(err);
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

    onBasicUpload(e, index) {
        this.formArray.value[index].fileInput = e.currentFiles[0]
    }
}
