import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IBscFireLossOfProfitCover } from 'src/app/features/admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { ILossOfRent } from 'src/app/features/admin/loss-of-rent-cover/loss-of-rent-cover.model';
import { LossOfRentCoverService } from 'src/app/features/admin/loss-of-rent-cover/loss-of-rent-cover.service';
import { IQuoteOption } from 'src/app/features/admin/quote/quote.model';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-loss-of-rent-dialog',
    templateUrl: './loss-of-rent-dialog.component.html',
    styleUrls: ['./loss-of-rent-dialog.component.scss']
})
export class LossOfRentDialogComponent implements OnInit {

    coverForm: FormGroup;

    toWords = new ToWords;

    optionnumberOfMonths: ILov[];

    submitted: boolean = false;

    cover: ILossOfRent;
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] =[];

    quoteOption: IQuoteOption                           // New_Quote_option

    // formBuilder: any;
    constructor(
        private formBuilder: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private coverService: LossOfRentCoverService,
        private accountService: AccountService
    ) {
        this.optionnumberOfMonths = [
            { label: '03 Months', value: '03 Months' },
            { label: '06 Months', value: '06 Months' },
            { label: '09 Months', value: '09 Months' },
            { label: '12 Months', value: '12 Months' },
            { label: '18 Months', value: '18 Months' },
        ];

        this.cover = this.config.data.cover;
        this.currentUser$ = this.accountService.currentUser$
        this.quoteOption = this.config.data.quoteOption                              // New_Quote_option
    }

    ngOnInit(): void {
        this.createForm(this.cover);

        this.currentUser$.subscribe({
            next: user => {
              let role: IRole = user?.roleId as IRole;
        if (role?.name === AllowedRoles.INSURER_RM) {

           this.permissions = ['read'];
        }else{

            this.permissions = ['read', 'update'];
        }
    }
})
    }



    createForm(item?: ILossOfRent) {
        this.coverForm = this.formBuilder.group({
            // numberOfMonth: [item.numberOfMonth ? { label: item.numberOfMonth, value: item.numberOfMonth } : { label: '12 Months', value: '12 Months' }, [Validators.required]],
            numberOfMonth: [item?.numberOfMonth ?? '12 Months', [Validators.required]],
            sumInsured: [item?.sumInsured, [Validators.required, Validators.min(0)]]
        })
    }

    submitForm() {
        if (this.coverForm.valid) {
            if (this.cover?._id) {
                const payload = { ...this.coverForm.value }

                this.coverService.update(this.cover?._id, payload).subscribe({
                    next: (response: IOneResponseDto<ILossOfRent>) => {

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
                payload['quoteOptionId'] = this.config.data.quoteOption._id;

                this.coverService.create(payload).subscribe({
                    next: (response: IOneResponseDto<ILossOfRent>) => {

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
}


