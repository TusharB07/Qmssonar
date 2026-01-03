import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, forkJoin } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IPersonalAccidentCover, IPersonalAccidentCoverBS, OPTIONS_GENDER, OPTIONS_NOMINEE_RELATION } from 'src/app/features/admin/personal-accident-cover/personal-accident-cover.model';
import { PersonalAccidentCoverService } from 'src/app/features/admin/personal-accident-cover/personal-accident-cover.service';
import { IProduct } from 'src/app/features/admin/product/product.model';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-personal-accident-cover-dialog',
    templateUrl: './personal-accident-cover-dialog.component.html',
    styleUrls: ['./personal-accident-cover-dialog.component.scss']
})
export class PersonalAccidentCoverDialogComponent implements OnInit {

    coverForm: FormGroup;
    personalAccidentForm: FormGroup;

    // selectedCities: string = '';
    // cities: ILov[];
    // optionsFirstLossSumInsured: ILov[];
    // optionsRsmd: ILov[];
    // optionsRsmdDefault: RsmD[];
    // optionsTheft: ILov[];
    // optionsTheftDefault: RsmD[];
    // selectedIndmenityPeriod: string = '';
    // selectedfirstLossSumInsured: string = '';
    // selectedrsmd: string = '';
    // selectedtheft: string = '';
    submitted: boolean = false;
    optionsRiskType: ILov[];
    optionDropDownForEmpSum = []
    bscPersonalAccidentCovers: IPersonalAccidentCoverBS[];
    submitflag = false
    quote: IQuoteSlip;

    // totalPremium: number = 71500
    // selectedQuoteLocationOccpancy;
    // optionsQuoteLocationOccupancies: ILov[];

    // bscBurglaryAndHousebreaking: IBscBurglaryHousebreakingCover;

    // toWords = new ToWords();

    cover: IPersonalAccidentCover;
    pACover: IPersonalAccidentCoverBS[];
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];
    optionsRelation = []
    optionsGender = []

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private formBuilder: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private coverService: PersonalAccidentCoverService,
        private accountService: AccountService,
        private listOfValueService: ListOfValueMasterService,
        private messageService: MessageService,
        private bscCoverService: BscCoverService

        // private bscBurglaryAndHousebreakingService: BscBurglaryAndHousebreakingService,
        // private quoteLocationOccupancyService: QuoteLocationOccupancyService,
    ) {
        this.bscPersonalAccidentCovers = this.config.data.cover;

        // if (this.config.data.quote?.productId?.type == 'Bharat Griha Raksha Policy') {
        //   this.cover = this.config.data.cover[0] ?? null;
        // }
        // else {
        //   this.bscPersonalAccidentCovers = this.config.data.cover ?? [];
        // }
        this.quote = this.config.data.quote;

        // this.bscBurglaryAndHousebreaking = this.config.data.bscBurglaryHousebreakingCover;
        this.currentUser$ = this.accountService.currentUser$

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        // this.createForm(this.bscBurglaryAndHousebreaking);
        // this.searchOptionsQuoteLocationOccpancies();
        this.createFormGroup(this.bscPersonalAccidentCovers);

        this.optionsRelation = OPTIONS_NOMINEE_RELATION
        this.optionsGender = OPTIONS_GENDER
        // if (this.config.data.quote?.productId?.type == 'Bharat Griha Raksha Policy') {
        //   this.createForm(this.cover)
        // }
        // else {
        //   this.createFormGroup(this.bscPersonalAccidentCovers);
        // }

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

    createForm(item?: IPersonalAccidentCover) {
        this.coverForm = this.formBuilder.group({
            //   proposerAge: [item?.stocks ?? 0, [Validators.required, Validators.min(0)]],
            name: [item?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
            proposerAge: [item?.proposerAge, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$'), Validators.max(99)]],
            spouseName: [item?.spouseName, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
            spouseAge: [item?.spouseAge, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$'), Validators.max(99)]],

        })
    }

    submitForm() {


        if (this.coverForm.valid) {
            const payload = { ...this.coverForm.value };
            this.coverService.batchCreate(payload).subscribe(response => { console.log(response) })
            if (this.cover?._id) {
                const payload = { ...this.coverForm.value }

                this.coverService.update(this.cover?._id, payload).subscribe({
                    next: (response: IOneResponseDto<IPersonalAccidentCover>) => {

                        this.cover = response.data.entity
                        this.ref.close(this.cover);
                    },
                    error: error => {
                        console.log(error);
                    }
                });

            } else {
                const payload = { ...this.coverForm.value }

                payload['quoteId'] = this.config.data.quote._id;
                payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option

                this.coverService.create(payload).subscribe({
                    next: (response: IOneResponseDto<IPersonalAccidentCover>) => {

                        this.cover = response.data.entity
                        this.ref.close(this.cover);
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

    createSumInsuredForEmp(e, i) {
        if (e.label == 'Employee') {
            this.formArray.controls[i].get('sumInsured').setValue(0)
            this.formArray.controls[i].get('riskDescription').clearValidators()
            this.formArray.controls[i].get('riskDescription').updateValueAndValidity();
            // this.formArray.controls[i].get('noOfEmployee').clearValidators()
            // this.formArray.controls[i].get('noOfEmployee').setValidators([Validators.required, Validators.min(e.empMin), Validators.max(e.empMax)])
            // this.formArray.controls[i].get('noOfEmployee').updateValueAndValidity();
            // this.formArray.controls[i].get('insuredAge').setValue(null)
            // this.formArray.controls[i].get('insuredAge').clearValidators()
            // this.formArray.controls[i].get('insuredAge').updateValueAndValidity();
            // this.formArray.controls[i].get('nomineeName').setValue(null)
            // this.formArray.controls[i].get('nomineeName').clearValidators()
            // this.formArray.controls[i].get('nomineeName').updateValueAndValidity();
            // this.formArray.controls[i].get('nomineeRelation').setValue(null)
            // this.formArray.controls[i].get('nomineeRelation').clearValidators()
            // this.formArray.controls[i].get('nomineeRelation').updateValueAndValidity();
        }
        if (e.label == 'Owner' || e.label == 'Spouse') {
            this.formArray.controls[i].get('insuredAge').setValidators([Validators.required])
            this.formArray.controls[i].get('insuredAge').updateValueAndValidity();
            this.formArray.controls[i].get('nomineeName').setValidators([Validators.required])
            this.formArray.controls[i].get('nomineeName').updateValueAndValidity();
            this.formArray.controls[i].get('nomineeRelation').setValidators([Validators.required])
            this.formArray.controls[i].get('nomineeRelation').updateValueAndValidity();
        }

        if (e.label != 'Employee') {
            this.formArray.controls[i].get('sumInsured').setValue(0)
            // @ts-ignore
            if (this.formArray.controls[i].get('sumInsured').value.value) {
                this.formArray.controls[i].get('sumInsured').setValue(this.formArray.controls[i].get('sumInsured').value['value'])
            }
        }

        if (e.label != 'Employee') {
            // this.formArray.controls[i].get('noOfEmployee').clearValidators()
            // this.formArray.controls[i].get('noOfEmployee').updateValueAndValidity();
            this.formArray.controls[i].get('riskDescription').clearValidators()
            this.formArray.controls[i].get('riskDescription').setValidators([Validators.required, Validators.maxLength(255)])
            this.formArray.controls[i].get('riskDescription').updateValueAndValidity();
        }
    }

    searchOptionsRiskType(event, i) {
        this.listOfValueService.current(AllowedListOfValuesMasters.BSC_PERSONAL_ACCIDENT_TYPE, this.config.data.quote?.productId['_id']).subscribe({
            next: data => {
                this.optionsRiskType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, empMin: entity.EmployeeMinLimit, empMax: entity.EmployeemaxLimit }));
                let toSI = 0;
                let fromSI = 0;
                let to = 0;
                let from = 0;
                this.optionDropDownForEmpSum = []
                if (this.formArray.controls[i].value?.riskTypeId?.label == 'Employee') {
                    toSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['toSI']
                    fromSI = data.data.entities.filter(item => item.lovKey == 'Employee')[0]['fromSI']

                    to = Math.ceil(toSI / 10000)
                    from = Math.ceil(fromSI / 10000)

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
                        this.optionDropDownForEmpSum.push({ label: '₹ ' + (index * 100000).toLocaleString('en-IN'), value: index * 100000 })
                    }
                }
                if (this.formArray.controls[i].value?.riskTypeId?.label == 'Spouse') {
                    toSI = data.data.entities.filter(item => item.lovKey == 'Spouse')[0]['toSI']
                    fromSI = data.data.entities.filter(item => item.lovKey == 'Spouse')[0]['fromSI']

                    to = Math.ceil(toSI / 100000)
                    from = Math.ceil(fromSI / 100000)

                    for (let index = from; index <= to; index++) {
                        this.optionDropDownForEmpSum.push({ label: '₹ ' + (index * 100000).toLocaleString('en-IN'), value: index * 100000 })
                    }
                }

                if (this.optionDropDownForEmpSum[this.optionDropDownForEmpSum.length - 1]?.value > toSI) {
                    this.optionDropDownForEmpSum[this.optionDropDownForEmpSum.length - 1] = { label: '₹ ' + toSI.toLocaleString('en-IN'), value: toSI }
                }
            },
            error: e => { }
        })
    }

    createFormGroup(items?: IPersonalAccidentCoverBS[]) {
        this.personalAccidentForm = this.formBuilder.group({
            formArray: this.formBuilder.array(items.length > 0 ? items.map((item: IPersonalAccidentCoverBS) => this.createFormBS(item)) : [this.createFormBS()]),
        });
    }

    createFormBS(item?: IPersonalAccidentCoverBS): FormGroup {
        const personalAccidentType = item?.riskTypeId as IListOfValueMaster;
        const productId = this.quote.productId as IProduct
        let si;
        if (personalAccidentType?.lovKey == 'Owner' || personalAccidentType?.lovKey == 'Spouse' || personalAccidentType?.lovKey == 'Employee') {
            si = { label: '₹ ' + item?.sumInsured?.toLocaleString('en-IN'), value: item?.sumInsured }
        }
        else {
            si = item?.sumInsured
        }
        return this.formBuilder.group({
            _id: [item?._id],
            riskTypeId: [personalAccidentType ? { label: personalAccidentType.lovKey, value: personalAccidentType._id, empMin: personalAccidentType.EmployeeMinLimit, empMax: personalAccidentType.EmployeemaxLimit } : null, []],
            riskDescription: [item?.riskDescription, (personalAccidentType?.lovKey != 'Employee') ? [Validators.required, Validators.maxLength(255)] : []],
            sumInsured: [si],
            //noOfEmployee: [item?.noOfEmployee ?? 0, (personalAccidentType?.lovKey == 'Employee') ? [Validators.required, Validators.min(personalAccidentType?.EmployeeMinLimit), Validators.max(personalAccidentType?.EmployeemaxLimit)] : []],
            insuredAge: [item?.insuredAge, (personalAccidentType?.lovKey == 'Owner' || personalAccidentType?.lovKey == 'Spouse') ? [Validators.required, Validators.max(100)] : []],
            nomineeName: [item?.nomineeName, (personalAccidentType?.lovKey == 'Owner' || personalAccidentType?.lovKey == 'Spouse') ? [Validators.required, Validators.maxLength(32)] : []],
            nomineeRelation: [item?.nomineeRelation, (personalAccidentType?.lovKey == 'Owner' || personalAccidentType?.lovKey == 'Spouse') ? [Validators.required] : []],
            name: [item?.name, (personalAccidentType?.lovKey == 'Spouse' && productId?.shortName == 'GLL') ? [Validators.required, Validators.maxLength(32)] : []],
            gender: [item?.gender, ((personalAccidentType?.lovKey == 'Owner' || personalAccidentType?.lovKey == 'Spouse') && productId?.shortName == 'GLL') ? [Validators.required, Validators.maxLength(32)] : []],
            occupation: [item?.occupation, ((personalAccidentType?.lovKey == 'Owner' || personalAccidentType?.lovKey == 'Spouse') && productId?.shortName == 'GLL') ? [Validators.required, Validators.maxLength(32)] : []],
            fileInput: [item?.filePath],
        });
    }


    onfocus(e) {
        console.log(this.formArray)
    }

    get formArray(): FormArray {
        return this.personalAccidentForm.get("formArray") as FormArray;
    }

    addFormToArray(): void {
        this.formArray.push(this.createFormBS());
    }

    onBasicUpload(e, index) {
        this.formArray.value[index].fileInput = e.currentFiles[0]
    }


    downloadExcel(): void {
        // Use this.quote.id instead of this.quoteId
        this.coverService.downloadPersonalAccidentCoversExcel(this.quote._id).subscribe(
            (responseBlob: Blob) => {
                const url = window.URL.createObjectURL(responseBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'PersonalAccidentCovers.xlsx';
                a.click();
            },
            (error) => {
                console.error('Error downloading Excel file', error);
            }
        );
    }

    downloadFile(i) {
        this.bscCoverService.downloadExcel(this.bscPersonalAccidentCovers[i]?.filePath).subscribe(res => {

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

        if (this.bscPersonalAccidentCovers[rowIndex]?._id) {
            let payload = {}
            payload['filePath'] = this.bscPersonalAccidentCovers[rowIndex]?.filePath
            payload['_id'] = this.bscPersonalAccidentCovers[rowIndex]?._id
            this.coverService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscPersonalAccidentCovers[rowIndex])
                }
            })
        }
    }

    deleteFormBasedOnIndex(rowIndex: number): void {
        if (this.bscPersonalAccidentCovers[rowIndex]?._id) {
            this.coverService.delete(this.bscPersonalAccidentCovers[rowIndex]._id).subscribe({
                next: res => {
                    this.bscPersonalAccidentCovers = this.bscPersonalAccidentCovers.filter((item: IPersonalAccidentCoverBS) => item._id != this.bscPersonalAccidentCovers[rowIndex]._id)
                    this.ref.close(this.bscPersonalAccidentCovers);
                },
                error: e => {
                    console.log(e.error.message);
                }
            });
        } else {

            this.formArray.removeAt(rowIndex);
        }
    }

    submitPersonalAccidentForm() {
        this.submitflag = true

        if (this.personalAccidentForm.valid) {
            const formGroupData = { ...this.personalAccidentForm.value };

            const formArray = formGroupData["formArray"];

            const checkDulicateArray = formArray.map(item => item.riskTypeId.value)
            const isDuplicate = checkDulicateArray.filter((item, index) => checkDulicateArray.indexOf(item) !== index).length != 0

            if (isDuplicate) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Duplicate values are not allowed', icon: 'pi-times', closable: false });
            }
            else {
                const createContactDetailObservables$ = [];
                let formData = formArray
                let files = []

                for (let i = 0; i < formData.length; i++) {
                    if (formData[i]['fileInput'] && typeof (formData[i]['fileInput']) == 'string') {
                        formData[i]['filePath'] = formData[i]['fileInput']
                    }
                    if (formData[i]['fileInput'] && typeof (formData[i]['fileInput']) != 'string') {
                        files.push(formData[i]['fileInput']);
                    }
                    else {
                        files.push(null)
                    }
                    delete formData[i]['fileInput'];
                    if (formData[i].riskTypeId.label == 'Employee') {  // error while select employee and upload file
                        formData[i]['perEmployeeSumInsured'] = formData[i].sumInsured.value;
                        formData[i]['sumInsured'] = formData[i]['perEmployeeSumInsured'];
                    }
                    if (formData[i].riskTypeId.label == 'Owner' || formData[i].riskTypeId.label == 'Spouse') {
                        formData[i]['sumInsured'] = formData[i].sumInsured.value;
                    }
                    if (formData[i].riskTypeId.label != 'Owner' && formData[i].riskTypeId.label != 'Spouse') {
                        delete formData[i]['insuredAge']
                        delete formData[i]['nomineeRelation']
                        delete formData[i]['nomineeName']
                    }
                    formData[i]['riskTypeId'] = formData[i].riskTypeId.value;
                    formData[i]['quoteId'] = this.config.data.quoteId
                    formData[i]['quoteOptionId'] = this.config.data.quoteOption._id
                }
                const blob = JSON.stringify(formData)

                let bscFormData = new FormData();
                bscFormData.append("data", blob)

                for (let i = 0; i < files.length; i++) {
                    if (files[i] != null) {
                        bscFormData.append('file', files[i], formData[i].riskTypeId);
                    }
                }

                this.coverService.batchCreate(bscFormData).subscribe(response => {
                    this.bscPersonalAccidentCovers = response.data.entities;
                    this.ref.close(this.bscPersonalAccidentCovers);
                })

            }

        }
    }

    isFile(val): boolean {
        return typeof val === 'object';
    }
}

