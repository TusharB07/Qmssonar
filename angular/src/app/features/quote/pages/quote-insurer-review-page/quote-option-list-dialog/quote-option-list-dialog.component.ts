import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSentForQcrDialogComponent } from '../../../status_dialogs/quote-sent-for-qcr-dialog/quote-sent-for-qcr-dialog.component';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';

@Component({
    selector: 'app-quote-option-list-dialog',
    templateUrl: './quote-option-list-dialog.component.html',
    styleUrls: ['./quote-option-list-dialog.component.scss']
})
export class QuoteOptionListDialogComponent implements OnInit {

    allQuoteOptionDropdown: any
    quoteId: string;
    selectedQuoteOption: any
    isIcOptionList: boolean
    user: IUser
    AllowedRoles = AllowedRoles
    selectedICName: any;
    isMergeOption: boolean;

    optionWithoutExpired: ILov[]
    selectedMergeOption: string | null = null;
    showNewOption = false;
    expiredQuoteOption: boolean
    hasExpiredOption: any

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private activatedRoute: ActivatedRoute,
        private quoteOptionService: QuoteOptionService,
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private router: Router,
        private messageService: MessageService,
        private accountService: AccountService,

    ) {
        this.accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
            }
        })

        this.quoteId = this.config.data.quoteId
        this.selectedICName = this.config.data.selectedICName;
        this.isMergeOption = this.config.data.isMergeOption;
        this.isIcOptionList = this.config.data.isIcOptionList
    }

    ngOnInit() {
        this.getQuoteOptions()
    }

    // New_Quote_option
    getQuoteOptions() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: this.quoteId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.quoteOptionService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteOption>) => {
                const quoteOptionVersionData = dto.data.entities.filter(val => val.qcrVersion)
                this.allQuoteOptionDropdown = quoteOptionVersionData.length ? [quoteOptionVersionData[quoteOptionVersionData.length - 1]]
                    // [{ label: quoteOptionVersionData[quoteOptionVersionData.length - 1].quoteOption, value: quoteOptionVersionData[quoteOptionVersionData.length - 1]._id }] 
                    : dto.data.entities
                        .map(entity => (entity.expiredQuoteOption == true ? { ...entity, quoteOption: "Expired Option" } : entity))
                this.optionWithoutExpired = dto.data.entities.filter(val => !val.expiredQuoteOption)
                    .map(entity => ({ label: entity.quoteOption, value: entity._id }))

                this.hasExpiredOption = dto.data.entities.some(option => option.expiredQuoteOption === true);
            },
            error: e => {
                console.log(e);
            }
        });
    }

    save() {
        if (this.selectedQuoteOption != undefined) {
            this.quoteService.refresh((quote) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `Response is captured for ${this.selectedICName}`,
                    life: 5000
                });

            })
            this.ref.close(this.selectedQuoteOption)
        }
    }
    // onCheckboxChange(optionValue: string, isChecked: boolean) {
    //     if (isChecked) {
    //         if (this.selectedQuoteOption.length < 2) {
    //             this.selectedQuoteOption.push(optionValue);
    //         }
    //     } else {
    //         this.selectedQuoteOption = this.selectedQuoteOption.filter(
    //             (val) => val !== optionValue
    //         );
    //     }
    // }

    // isCheckboxDisabled(optionValue: string): boolean {
    //     return (
    //         this.selectedQuoteOption.length >= 2 &&
    //         !this.selectedQuoteOption.includes(optionValue)
    //     );
    // }

    createNewOption() {
        this.quoteOptionService.copyAndCreateQuoteOptions(this.selectedQuoteOption).subscribe({
            next: quoteOption => {
                this.ref.close()
                this.router.navigate([`backend/quotes/${this.quoteId}`], {
                    queryParams: {
                        quoteOptionId: quoteOption.data.entities._id
                    }
                });
            },
            error: error => {
                console.log(error);
            }
        });
    }

    mergeWithExpired() {
        const expiredOption = this.allQuoteOptionDropdown.find(option => option.expiredQuoteOption);
        if (!expiredOption) {
            this.messageService.add({
                severity: "error",
                summary: "Fail",
                detail: "To merge option you have to select expired checkbox from option",
                life: 3000
            });
        }
        else {
            const payload = { quoteOptionIds: [this.selectedMergeOption, expiredOption._id] }
            this.quoteOptionService.mergeQuoteOptions(payload).subscribe({
                next: quoteOption => {
                    this.ref.close()
                    this.router.navigate([`/backend/quotes/${this.quoteId}/requisition`], {
                        queryParams: {
                            ...this.activatedRoute.snapshot.queryParams,
                            quoteOptionId: quoteOption.data.entity._id
                        }
                    });
                },
                error: error => {
                    console.log(error);
                }
            })
        }
    }

    // Delete option
    // deleteOption(id: number) {
    //     this.options = this.options.filter(option => option.id !== id);
    // }

    addMore() {
        this.showNewOption = true;
        this.selectedQuoteOption = null;
    }

    updateQuoteOptionWise(quoteOptionId, expiredQuoteOption) {
        const updatePayload = {}
        updatePayload['expiredQuoteOption'] = expiredQuoteOption;
        this.quoteOptionService.update(quoteOptionId, updatePayload).subscribe({
            next: quote => {
                this.getQuoteOptions()
                // this.quoteOptionService.get(quote.data.entity._id).subscribe({
                //     next: (dto: IOneResponseDto<IQuoteOption>) => {
                //         // this.expiredQuoteOption = dto.data.entity?.expiredQuoteOption
                //     },
                //     error: e => {
                //         console.log(e);
                //     }
                // });
            },
            error: error => {
                console.log(error);
            }
        });
    }

    isAnyOptionSelected(): boolean {
        return this.allQuoteOptionDropdown.some(option => option.expiredQuoteOption);
    }

}
