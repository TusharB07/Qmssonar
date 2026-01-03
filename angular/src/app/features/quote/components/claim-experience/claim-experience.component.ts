import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Subscription } from 'rxjs';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto, PermissionType, PFileUploadGetterProps } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-claim-experience',
    templateUrl: './claim-experience.component.html',
    styleUrls: ['./claim-experience.component.scss']
})
export class ClaimExperienceComponent implements OnInit {

    cols: number[] = [];
    isMobile: boolean = false;
    rows: ILov[] = [
        { value: 'premiumPaid', label: 'Premium Paid' },
        { value: 'claimAmount', label: 'Claim Amount' },
        { value: 'numberOfClaims', label: 'No. of Claims' },
        { value: 'natureOfClaim', label: 'Nature of Claim' },
    ];
    currentYear: number = new Date().getFullYear();

    claimExperiences: IClaimExperience[] = []

    recordForm: FormGroup;

    @Input() quote: IQuoteSlip;
    private currentQuote: Subscription;

    // @Input() permissions: PermissionType[] = []
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option
    private currentUser: Subscription;
    user: IUser;
    quoteOptionId: any;


    constructor(
        private claimExperienceService: ClaimExperienceService,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private deviceService: DeviceDetectorService,
        private quoteService: QuoteService,
        private messageService: MessageService,
        private appService: AppService,
        private activatedRoute:ActivatedRoute,
    ) {
        this.currentUser$ = this.accountService.currentUser$

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })
        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
              this.user = user;
            }
          });
          this.quoteOptionId = this.activatedRoute.snapshot.queryParamMap.get('quoteOptionId');
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })

        // Make a call to

        this.cols = [
            this.currentYear - 2,
            this.currentYear - 1,
            this.currentYear
        ];

        // Old_Quote
        // let lazyLoadEvent: LazyLoadEvent = {
        //     first: 0,
        //     rows: 5,
        //     sortField: '_id',
        //     sortOrder: -1,
        //     filters: {
        //         // @ts-ignore
        //         quoteId: [
        //             {
        //                 value: this.quote._id,
        //                 matchMode: "equals",
        //                 operator: "and"
        //             }
        //         ]
        //     },
        //     globalFilter: null,
        //     multiSortMeta: null
        // };

        // New_Quote_Option
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 5,
            sortField: '_id',
            sortOrder: -1,
            filters: {
                // @ts-ignore
                quoteOptionId: [
                    {
                        value: this.quoteOptionData?._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IClaimExperience>) => {
                this.claimExperiences = dto.data.entities
                this.createForm(dto.data.entities);
            }
        })
    }


    createForm(claimExperiences: IClaimExperience[]) {

        this.recordForm = this.formBuilder.group({
            claimYearArray: this.formBuilder.array(
                claimExperiences.map((claimExperience) => this.createClaimYearRow(claimExperience))
            ),
        });
    }

    createClaimYearRow(claimExperience?: IClaimExperience): FormGroup {
        let form = this.formBuilder.group({
            _id: [claimExperience?._id],
            premiumPaid: [claimExperience?.premiumPaid, []],
            claimAmount: [claimExperience?.claimAmount, []],
            numberOfClaims: [claimExperience?.numberOfClaims, [Validators.min(0),]],
            natureOfClaim: [claimExperience?.natureOfClaim, []],
        });

        return form;
    }


    get claimYearArray(): FormArray {
        return this.recordForm.get("claimYearArray") as FormArray;
    }



    saveRecord() {

        const recordForm = { ...this.recordForm.value }

        const claimExperiences = recordForm['claimYearArray'];

        for (let i = 0; i < claimExperiences.length; i++) {

            const claimExperience = claimExperiences[i]

            this.claimExperienceService.update(claimExperience._id, claimExperience).subscribe({
                next: (dto: IOneResponseDto<IClaimExperience>) => {
                }
            })
        }
        this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: `Saved!`,
            life: 3000
        });
    }

    decreaseYear() {
        if (this.cols[0] > 2000) {
            this.cols = this.cols.map(item => item - 1);
        }
    }
    increaseYear() {
        if (this.cols[2] < this.currentYear) {
            this.cols = this.cols.map(item => item + 1);
        }
    }

    valueUpdated() {
        // console.log(this.claimExperiences)
    }

    ngOnChanges(): void {
        this.ngOnInit();
    }
    downloadSampleFile(){
        this.claimExperienceService.bulkExportGenerateSample(this.quote._id,{quoteOptionId:this.quoteOptionId}).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }
    get quoteLocationBreakupBulkImportProps(): PFileUploadGetterProps {
        // Old_Quote
        // return this.quoteLocationBreakupService.getBulkImportProps(this.quote['_id'], (dto: IOneResponseDto<IBulkImportResponseDto>) => {

        // New_Quote_Option
        return this.claimExperienceService.getBulkImportProps(this.quote._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                this.messageService?.add({
                    summary: "Success",
                    detail: 'File Uploaded Successfully',
                    severity: 'success'
                })
               
            } else {
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }
        })
    }
    get onUploadClaimExperienceReport() {
        return this.claimExperienceService.claimExperienceReportUpload(this.quote._id, (dto: IOneResponseDto<IBulkImportResponseDto>) => {
            this.quoteService.refresh();
            if (dto.status == 'success') {
                this.messageService?.add({
                    summary: "Success",
                    detail: 'File Uploaded Successfully',
                    severity: 'success'
                })
               
            } else {
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }
        })
    }


}
