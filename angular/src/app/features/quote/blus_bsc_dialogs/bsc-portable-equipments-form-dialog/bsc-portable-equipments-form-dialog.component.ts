import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { BscCoverService } from 'src/app/features/admin/bsc-cover/bsc-cover.service';
import { BscPortableEquipmentTypeService } from 'src/app/features/admin/bsc-portable-equipment-type/bsc-portable-equipment-type.service';
import { IBscPortableEquipments } from 'src/app/features/admin/bsc-portable-equipments/bsc-portable-equipment.model';
import { BscPortableEquipmentsService } from 'src/app/features/admin/bsc-portable-equipments/bsc-portable-equipments.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-bsc-portable-equipments-form-dialog',
    templateUrl: './bsc-portable-equipments-form-dialog.component.html',
    styleUrls: ['./bsc-portable-equipments-form-dialog.component.scss']
})
export class BscPortableEquipmentsFormDialogComponent implements OnInit {
    portableEquipmentsForm: FormGroup;

    optionsEquipmentType: ILov[];
    bscPortableEquipmentsCovers: IBscPortableEquipments[];
    optionsEquipments: ILov[];

    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];

    quote: IQuoteSlip;
    submitflag = false;
    minNSTP: number = 0;

    quoteOption: IQuoteOption                           // New_Quote_option

    constructor(
        private fb: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private bscPortableEquipmentsService: BscPortableEquipmentsService,
        private bscPortableEquipmentTypeService: BscPortableEquipmentTypeService,
        private listOfValueService: ListOfValueMasterService,
        private accountService: AccountService,
        private messageService: MessageService,
        private bscCoverService: BscCoverService

    ) {
        this.optionsEquipmentType = []

        this.bscPortableEquipmentsCovers = this.config.data.bscPortableEquipmentsCover

        this.currentUser$ = this.accountService.currentUser$

        this.quote = this.config.data.quote

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        this.createFormGroup(this.bscPortableEquipmentsCovers);

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
        this.listOfValueService.current(AllowedListOfValuesMasters.BSC_PORTABLE_EQUIPMENT_TYPE, this.quote?.productId['_id']).subscribe({
            next: data => {
                this.optionsEquipmentType = data.data.entities.filter(val => this.config.data.quote.partnerId == val.partnerId).map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}`, sumMin: entity.fromSI, sumMax: entity.toSI, maxNSTP: entity.perEmployeeLimit ?? 0 }));
            },
            error: e => { }
        })
    }

    createFormGroup(items: IBscPortableEquipments[]) {
        this.portableEquipmentsForm = this.fb.group({
            // If has item creates form for each either just creates one blank form
            formArray: this.fb.array(items.length > 0 ? items.map((item: IBscPortableEquipments) => this.createForm(item)) : [this.createForm()]),
        });
    }

    createForm(item?: IBscPortableEquipments): FormGroup {
        const portableEquipmentType = item?.equipmentTypeId as IListOfValueMaster;

        return this.fb.group({
            _id: [item?._id],
            equipmentTypeId: [portableEquipmentType ? { label: portableEquipmentType.lovKey, value: portableEquipmentType._id, sumMin: portableEquipmentType.fromSI, sumMax: portableEquipmentType.toSI, maxNSTP: portableEquipmentType.perEmployeeLimit ?? 0 } : null, [Validators.required]],
            //   equipmentTypeId: [],
            equipmentDescription: [item?.equipmentDescription, [Validators.required, Validators.maxLength(255)]],
            // geography: [item?.geography, [Validators.required]],
            sumInsured: [item?.sumInsured ?? 0, [Validators.required, Validators.min(1)]],
            fileInput: [item?.filePath]
        });
    }

    get formArray(): FormArray {
        return this.portableEquipmentsForm.get("formArray") as FormArray;
    }

    addFormToArray(): void {
        this.formArray.push(this.createForm());
    }

    deleteFormBasedOnIndex(rowIndex: number): void {

        if (this.bscPortableEquipmentsCovers[rowIndex]?._id) {

            this.bscPortableEquipmentsService.delete(this.bscPortableEquipmentsCovers[rowIndex]._id).subscribe({
                next: res => {
                    this.bscPortableEquipmentsCovers = this.bscPortableEquipmentsCovers.filter((item: IBscPortableEquipments) => item._id != this.bscPortableEquipmentsCovers[rowIndex]._id)

                    this.ref.close(this.bscPortableEquipmentsCovers);
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
        if (this.bscPortableEquipmentsCovers[rowIndex]._id) {
            let payload = {}
            payload['filePath'] = this.bscPortableEquipmentsCovers[rowIndex].filePath
            payload['_id'] = this.bscPortableEquipmentsCovers[rowIndex]._id
            this.bscPortableEquipmentsService.deleteFilePath(payload).subscribe(res => {
                // @ts-ignore
                if (res?.data.success) {
                    this.ref.close(this.bscPortableEquipmentsCovers[rowIndex])
                }
            })
        }
    }

    downloadFile(i) {
        this.bscCoverService.downloadExcel(this.bscPortableEquipmentsCovers[i]?.filePath).subscribe(res => {

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

    // submitPortableEquipmentForm() {
    //     console.log(this.portableEquipmentsForm)
    //     if (this.portableEquipmentsForm.valid) {

    //         const formGroupData = { ...this.portableEquipmentsForm.value };

    //         const formArray = formGroupData["formArray"];

    //         const checkDulicateArray = formArray.map(item => item.equipmentTypeId.value)
    //         const isDuplicate = checkDulicateArray.filter((item,index) => checkDulicateArray.indexOf(item) !== index).length != 0

    //         if(isDuplicate) {
    //             this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Duplicate values are not allowed', icon: 'pi-times', closable: false });
    //         }
    //         else{
    //             const createContactDetailObservables$ = [];

    //             for (let i = 0; i < formArray.length; i++) {
    //                 const formData = formArray[i];

    //                 let bscFormData = new FormData();
    //                 bscFormData.append("equipmentDescription", formData['equipmentDescription']);
    //                 bscFormData.append("equipmentTypeId", formData['equipmentTypeId']['value']);
    //                 bscFormData.append("geography", formData['geography']);
    //                 bscFormData.append("sumInsured", formData['sumInsured']);
    //                 bscFormData.append("quoteId",this.config.data.quoteId)
    //                 bscFormData.append("_id",formData['_id'] ? formData['_id']:'')
    //                 bscFormData.append("file", formData['fileInput']);

    //                 const payload = { ...formData };
    //                 delete payload.fileInput;
    //                 payload.equipmentTypeId = payload.equipmentTypeId.value

    //                 console.log(payload)
    //                 createContactDetailObservables$.push(this.bscPortableEquipmentsService.create(bscFormData));

    //                 // createContactDetailObservables$.push(this.bscPortableEquipmentsService.create(bscFormData));
    //                 // if (payload._id) {
    //                 //     console.log('update')
    //                 //     // this.bscFidelityGuranteeCovers = this.bscFidelityGuranteeCovers.map((bscFidelityGuranteeCover: IBSCFidelityGurantee) => bscFidelityGuranteeCover._id != payload._id ? bscFidelityGuranteeCover : payload)

    //                 //     createContactDetailObservables$.push(this.bscPortableEquipmentsService.update(payload._id, bscFormData));
    //                 // } else {
    //                 //     console.log('create')
    //                 //     // this.bscFidelityGuranteeCovers.push(payload)
    //                 //     payload['quoteId'] = this.config.data.quoteId;
    //                 //     createContactDetailObservables$.push(this.bscPortableEquipmentsService.create(bscFormData));
    //                 // } 


    //             }

    //             forkJoin(createContactDetailObservables$).subscribe({
    //                 next: (items: IBscPortableEquipments[]) => {
    //                     console.log(items)
    //                     this.bscPortableEquipmentsCovers = []
    //                     items.map((response: any) => {
    //                         this.bscPortableEquipmentsCovers.push(response.data.entity)
    //                         console.log(response.data.entity)
    //                         /* if (response.data.entity._id) {
    //                             this.bscPortableEquipmentsCovers = this.bscPortableEquipmentsCovers.map((item: IBscPortableEquipments) => item._id != response.data.entity._id ? item : response.data.entity)
    //                             console.log('update')
    //                         } else {

    //                             console.log('create')
    //                             this.bscPortableEquipmentsCovers.push(response.data.entity)
    //                         } */

    //                     })

    //                     this.ref.close(this.bscPortableEquipmentsCovers);

    //                 },
    //                 error: err => {
    //                     console.log(err);
    //                 }
    //             });
    //         }

    //     }
    // }

    isFile(val): boolean {
        return typeof val === 'object';
    }

    cancel() {
        this.ref.close();
    }

    onBasicUpload(e, index) {
        this.formArray.value[index].fileInput = e.currentFiles[0]
    }

    submitPortableEquipmentForm() {
        this.submitflag = true

        if (this.portableEquipmentsForm.valid) {
            const formGroupData = { ...this.portableEquipmentsForm.value };

            const formArray = formGroupData["formArray"];

            const checkDulicateArray = formArray.map(item => item.equipmentTypeId.value)
            const isDuplicate = checkDulicateArray.filter((item, index) => checkDulicateArray.indexOf(item) !== index).length != 0

            if (isDuplicate) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Duplicate values are not allowed', icon: 'pi-times', closable: false });
            }
            else {
                const createContactDetailObservables$ = [];
                let formData = formArray
                let files = []

                for (let i = 0; i < formData.length; i++) {
                    // const formData = formArray[i];
                    console.log(formData[i]['fileInput'])
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
                    formData[i]['equipmentTypeId'] = formData[i].equipmentTypeId.value;
                    formData[i]['quoteId'] = this.config.data.quoteId
                    formData[i]['quoteOptionId'] = this.config.data.quoteOption._id
                }
                const blob = JSON.stringify(formData)

                let bscFormData = new FormData();
                bscFormData.append("data", blob)

                for (let i = 0; i < files.length; i++) {
                    console.log(files[i])
                    if (files[i] != null) {
                        bscFormData.append('file', files[i], formData[i].equipmentTypeId);
                    }
                }

                this.bscPortableEquipmentsService.batchCreate(bscFormData).subscribe(response => {
                    this.bscPortableEquipmentsCovers = response.data.entities;
                    this.ref.close(this.bscPortableEquipmentsCovers);
                })

            }

        }
    }

}
