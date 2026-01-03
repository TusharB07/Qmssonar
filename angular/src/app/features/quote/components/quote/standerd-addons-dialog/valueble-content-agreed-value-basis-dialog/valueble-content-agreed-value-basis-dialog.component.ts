import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Observable } from 'rxjs';
import { ILov, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscBurglaryHousebreakingCover } from 'src/app/features/admin/bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.model';
import { IBscLiability } from 'src/app/features/admin/bsc-liability/bsc-liability.model';
import { BscLiabilityService } from 'src/app/features/admin/bsc-liability/bsc-liability.service';
import { AllowedListOfValuesMasters, IListOfValueMaster } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IValuableContentsOnAgreedValue } from 'src/app/features/admin/valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.model';
import { ValuableContentOnAgreedValueBasisCoverService } from 'src/app/features/admin/valuable-content-on-agreed-value-basis-cover/valuable-content-on-agreed-value-basis-cover.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-valueble-content-agreed-value-basis-dialog',
    templateUrl: './valueble-content-agreed-value-basis-dialog.component.html',
    styleUrls: ['./valueble-content-agreed-value-basis-dialog.component.scss']
})
export class ValuebleContentAgreedValueBasisDialogComponent implements OnInit {
    coverForm: FormGroup;
    optionsRiskType: ILov[];
    submitted: boolean = false;
    covers: IValuableContentsOnAgreedValue[] = [];
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];
    uploadedFiles: any[] = [];
    quote: IQuoteSlip;

    quoteOption: IQuoteOption                                                       // New_Quote_option

    constructor(
        private fb: FormBuilder,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
        private coversService: ValuableContentOnAgreedValueBasisCoverService,
        private accountService: AccountService
    ) {
        this.covers = this.config.data.covers
        this.currentUser$ = this.accountService.currentUser$
        this.quote = this.config.data.quote;

        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option

    }

    ngOnInit(): void {
        this.createFormGroup(this.covers);

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


    createFormGroup(items: IValuableContentsOnAgreedValue[]) {

        this.coverForm = this.fb.group({
            // If has item creates form for each either just creates one blank form
            formArray: this.fb.array(items.length > 0 ? items.map((item: any) => this.createForm(item)) : [this.createForm()]),
        });
        items.map(item => this.uploadedFiles.push(null))
    }
    createForm(item?: IValuableContentsOnAgreedValue): FormGroup {

        return this.fb.group({
            _id: [item?._id],
            //   riskTypeId: [],
            itemDescription: [item?.itemDescription, [Validators.required]],
            sumInsured: [item?.sumInsured, [Validators.required]],
            valuationCertification: [item?.valuationCertification]
        });

    }

    get formArray(): FormArray {
        return this.coverForm.get("formArray") as FormArray;
    }

    addFormToArray(): void {
        this.formArray.push(this.createForm());
        this.uploadedFiles.push(null)
    }

    deleteFormBasedOnIndex(rowIndex: number): void {

        if (this.covers[rowIndex]?._id) {

            this.coversService.delete(this.covers[rowIndex]._id).subscribe({
                next: res => {
                    this.covers = this.covers.filter((item: IValuableContentsOnAgreedValue) => item._id != this.covers[rowIndex]._id)
                    this.formArray.removeAt(rowIndex);
                    this.uploadedFiles.splice(rowIndex, 1);
                },
                error: e => {
                    console.log(e.error.message);
                }
            });
        } else {
            this.formArray.removeAt(rowIndex);
            this.uploadedFiles.splice(rowIndex, 1);
        }
    }

    submitForm() {
        this.submitted = true;
        console.log(this.coverForm.value);

        if (this.coverForm.valid) {
            const formGroupData = { ...this.coverForm.value };

            const formArray = formGroupData["formArray"];

            const coverFormDetailObservables$ = [];

            for (let i = 0; i < formArray.length; i++) {
                const formData = formArray[i];

                const payload = { ...formData };

                if (payload._id) {

                    coverFormDetailObservables$.push(this.coversService.update(payload._id, payload));
                } else {

                    payload['quoteId'] = this.config.data.quote._id;
                    payload['quoteOptionId'] = this.config.data.quoteOption._id;

                    delete payload._id
                    coverFormDetailObservables$.push(this.coversService.create(payload));
                }


            }

            forkJoin(coverFormDetailObservables$).subscribe({
                next: (items: IBscLiability[]) => {
                    items.map((response: any, index) => {
                        if (this.uploadedFiles[index]) {
                            const formData = new FormData();
                            formData.append('location_photographs', this.uploadedFiles[index], this.uploadedFiles[index]?.name)
                            this.coversService.uploadCertificate(response.data.entity._id, formData).subscribe(item => {
                            })
                        }
                        this.covers.push(response.data.entity)
                    })

                    this.ref.close(this.covers);

                },
                error: err => {
                    console.log(err);
                }
            });
        }
    }

    onUploadValuableContentCertificate(event, position, mode) {
        // this.uploadedFiles = [];
        for (let file of event.files) {
            this.uploadedFiles.splice(position, 1, file);
        }
        // let payload = {...control.value}
        // payload['quoteId'] = this.config.data.quote._id;

        // this.coversService.create(payload).subscribe(data => {
        //     console.log(data)
        //     this.coversService.uploadCertificate(data.data.entity._id,this.uploadedFiles).subscribe(data => {
        //     })
        // })
        // this.quoteService.get(`${this.quote._id}`, { 'quoteLocationOccupancyId': this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id }).subscribe({
        //     next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //         // console.log(dto.data.entity)
        //         this.quoteService.setQuote(dto.data.entity)
        //     },
        //     error: e => {
        //         console.log(e);
        //     }
        // });
    }

    downloadLocationPhotograph(id: string, imagePath: string) {
        this.coversService.downloadCerificate(id, imagePath).subscribe({
            next: (response: any) => {
                let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Certifcate';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);

                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl);

            }
        })
    }

    deleteLocationPhotograph(id: string, imagePath: string) {
        this.coversService.deleteCerificate(id, imagePath).subscribe({
            next: (response: any) => {
                this.coverForm.controls.formArray['controls'].map(item => {
                    if (item.value._id == id && item.value.valuationCertification) {
                        item.value.valuationCertification = item.value.valuationCertification.filter(path => path.imagePath != imagePath)
                    }
                })
                /* let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Certifcate';

                const a = document.createElement('a')
                const blob = new Blob([response.body], { type: response.headers.get('content-type') });
                const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
                const objectUrl = window.URL.createObjectURL(file);

                // a.href = objectUrl
                // a.download = fileName;
                // a.click();

                window.open(objectUrl, '_blank');

                URL.revokeObjectURL(objectUrl); */

            }
        })
    }

    cancel() {
        this.ref.close();
    }
}
