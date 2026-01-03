import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { FireFloaterAddonCoverService } from 'src/app/features/admin/fire-floater-addon-cover/fire-floater-addon-cover.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
    selector: 'app-fire-floater-cover-addon-dialog',
    templateUrl: './fire-floater-cover-addon-dialog.component.html',
    styleUrls: ['./fire-floater-cover-addon-dialog.component.scss']
})
export class FireFloaterCoverAddonDialogComponent implements OnInit, OnChanges {

    quote: IQuoteSlip

    recordForm: FormGroup;

    allFloaters = []
    permissions: PermissionType[] = [];
    currentUser$: Observable<IUser>;

    quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private fireFloaterAddonService: FireFloaterAddonCoverService,
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private quoteService: QuoteService,
        private quoteOptionService: QuoteOptionService,

    ) {
        this.quote = this.config.data.quote
        this.currentUser$ = this.accountService.currentUser$

        this.quoteOptionData = this.config.data.quoteOptionData                    // New_Quote_Option

    }

    ngOnInit(): void {
        // Old_Quote
        // this.fireFloaterAddonService.getAllFloaterCoverAddOn(this.quote._id).subscribe({

        // New_Quote_Option
        this.fireFloaterAddonService.getAllFloaterCoverAddOn(this.quoteOptionData._id).subscribe({
            next: (dto: IOneResponseDto<any>) => {

                this.createForm(dto.data.entity)

                this.allFloaters = dto.data.entity.allFloaters
            }
        })

        this.createForm()

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
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit()
    }

    createForm(floater?) {
        this.recordForm = this.formBuilder.group({
            total: [floater?.total ?? 0, [Validators.required]],
        });
    }

    saveRecord() {
        if (this.recordForm.valid) {
            const payload = { ...this.recordForm.value };

            // Old_Quote
            // this.fireFloaterAddonService.setAllFloaterCoverAddOn(this.quote._id, payload).subscribe({
            //     next: (dto) => {
            //         this.quoteService.refresh()
            //         this.ref.close();
            //         console.log(dto)
            //     }
            // })

            // New_Quote_Option
            this.fireFloaterAddonService.setAllFloaterCoverAddOn(this.quoteOptionData._id, payload).subscribe({
                next: (dto) => {
                    this.quoteOptionService.refreshQuoteOption()
                    this.ref.close();
                }
            })
        }
    }

    cancel() {
        this.ref.close();
    }
}
