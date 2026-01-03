import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscSignage } from 'src/app/features/admin/bsc-signage/bsc-signage.model';
import { BscSignageService } from 'src/app/features/admin/bsc-signage/bsc-signage.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-bsc-signage-form-dialog',
    templateUrl: './bsc-signage-form-dialog.component.html',
    styleUrls: ['./bsc-signage-form-dialog.component.scss']
})
export class BscSignageFormDialogComponent implements OnInit {
    signageForm: FormGroup;
    optionsSignageType: ILov[];
    submitted: boolean = false;
    bscSignageCovers: IBscSignage[];
    currentUser$: Observable<IUser>;

    permissions: PermissionType[] = [];

    quote: IQuoteSlip
    minNSTP: any = 0;

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private fb: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private bscSignageService: BscSignageService,
        private listOfValueService: ListOfValueMasterService,
        private accountService: AccountService,
        private messageService: MessageService,
        private bscCoverService: BscCoverService
    ) {
        this.bscSignageCovers = config.data.bscSignageCover;

        this.currentUser$ = this.accountService.currentUser$

        this.quote = this.config.data.quote

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option

    }

    ngOnInit(): void {
        this.createFormGroup(this.bscSignageCovers);

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

    searchOptionsSignageType(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.BSC_SIGNAGE_TYPE, this.quote?.productId['_id']).subscribe({
            next: data => {
                this.optionsSignageType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, sumMin: entity?.fromSI, sumMax: entity?.toSI, maxNSTP: entity.perEmployeeLimit ?? 0 }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];
            },
            error: e => { }
        })
    }

    createFormGroup(items: IBscSignage[]) {
        this.signageForm = this.fb.group({
            // If has item creates form for each either just creates one blank form
            formArray: this.fb.array(items.length > 0 ? items.map((item: IBscSignage) => this.createForm(item)) : [this.createForm()]),
        });
    }

    createForm(item?: IBscSignage): FormGroup {
        const signageType = item?.signageTypeId as IListOfValueMaster;
        return this.fb.group({
            _id: [item?._id],
            signageTypeId: [signageType ? { label: signageType.lovKey, value: signageType._id, sumMin: signageType?.fromSI, sumMax: signageType?.toSI, maxNSTP: signageType.perEmployeeLimit ?? 0 } : null, [Validators.required]],
            // signageTypeId: [],
            signageDescription: [item?.signageDescription, [Validators.required, Validators.maxLength(255)]],
            sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
            fileInput: [item?.filePath]
        });
    }

    get formArray(): FormArray {
        return this.signageForm.get("formArray") as FormArray;
    }

    addFormToArray(): void {
        this.formArray.push(this.createForm());
    }

    deleteFormBasedOnIndex(rowIndex: number): void {

        if (this.bscSignageCovers[rowIndex]?._id) {
            this.bscSignageService.delete(this.bscSignageCovers[rowIndex]._id).subscribe({
                next: res => {
                    this.bscSignageCovers = this.bscSignageCovers.filter((item: IBscSignage) => item._id != this.bscSignageCovers[rowIndex]._id)

                    this.ref.close(this.bscSignageCovers);
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

        if (this.bscSignageCovers[rowIndex]?._id) {
            let payload = {}
            payload['filePath'] = this.bscSignageCovers[rowIndex]?.filePath
            payload['_id'] = this.bscSignageCovers[rowIndex]?._id
            this.bscSignageService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscSignageCovers[rowIndex])
                }
            })
        }
    }

    submitSignageForm() {
        if (this.signageForm.valid) {

            const formGroupData = { ...this.signageForm.value };

            const formArray = formGroupData["formArray"];
            const checkDulicateArray = formArray.map(item => item.signageTypeId.value)
            const isDuplicate = checkDulicateArray.filter((item, index) => checkDulicateArray.indexOf(item) !== index).length != 0

            if (isDuplicate) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Duplicate values are not allowed', icon: 'pi-times', closable: false });
            }
            else {
                const createContactDetailObservables$ = [];

                for (let i = 0; i < formArray.length; i++) {
                    const formData = formArray[i];
                    let bscFormData = new FormData();
                    bscFormData.append("signageDescription", formData['signageDescription']);
                    bscFormData.append("signageTypeId", formData['signageTypeId']['value']);
                    bscFormData.append("sumInsured", formData['sumInsured']);
                    bscFormData.append("quoteId", this.config.data.quoteId)
                    bscFormData.append("quoteOptionId", this.config.data.quoteOption._id)                             // New_Quote_option
                    bscFormData.append("_id", formData['_id'] ? formData['_id'] : '')
                    bscFormData.append("file", formData['fileInput']);

                    // createContactDetailObservables$.push(this.bscSignageService.create(bscFormData));
                    const payload = { ...formData };
                    payload['signageTypeId'] = payload.signageTypeId.value;

                    if (payload._id) {
                        // this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != payload._id ? bscFidelityGuranteeCover : payload)

                        createContactDetailObservables$.push(this.bscSignageService.update(payload._id, bscFormData));
                    } else {
                        payload['quoteId'] = this.config.data.quoteId;
                        payload['quoteOptionId'] = this.config.data.quoteOption._id;                      // New_Quote_option
                        createContactDetailObservables$.push(this.bscSignageService.create(bscFormData));
                    }


                }

                forkJoin(createContactDetailObservables$).subscribe({
                    next: (items: IBscSignage[]) => {
                        this.bscSignageCovers = []
                        items.map((response: any) => {
                            this.bscSignageCovers.push(response.data.entity)
                            if (response.data.entity._id) {
                                this.bscSignageCovers = this.bscSignageCovers.map((item: IBscSignage) => item._id != response.data.entity._id ? item : response.data.entity)
                            } else {
                                this.bscSignageCovers.push(response.data.entity)
                            }

                        })

                        this.ref.close(this.bscSignageCovers);

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

    downloadFile(i) {
        this.bscCoverService.downloadExcel(this.bscSignageCovers[i]?.filePath).subscribe(res => {

            let fileName = res?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'uploadedFile';

            const a = document.createElement('a')
            const blob = new Blob([res.body], { type: res.headers.get('content-type') });
            const file = new File([blob], 'Hello', { type: res.headers.get('content-type'), });
            const objectUrl = window.URL.createObjectURL(file);

            a.href = objectUrl
            a.download = fileName;
            a.click();

            window.open(objectUrl, '_blank');
            URL.revokeObjectURL(objectUrl);

        })
    }
}
