import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IDeclarationPolicy } from 'src/app/features/admin/declaration-policy-cover/declaration-policy-cover.model';
import { DeclarationPolicyCoverService } from 'src/app/features/admin/declaration-policy-cover/declaration-policy-cover.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-declaration-policy-dialog',
    templateUrl: './declaration-policy-dialog.component.html',
    styleUrls: ['./declaration-policy-dialog.component.scss']
})
export class DeclarationPolicyDialogComponent implements OnInit {

    coverForm: FormGroup;

    toWords = new ToWords;

    submitted: boolean = false;

    cover: IDeclarationPolicy;
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] =[];
    // formBuilder: any;
    constructor(
        private formBuilder: FormBuilder,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private coverService: DeclarationPolicyCoverService,
        private accountService: AccountService
    ) {
        this.cover = this.config.data.cover;
        this.currentUser$ = this.accountService.currentUser$
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



    createForm(item?: IDeclarationPolicy) {
        console.log(item);

        this.coverForm = this.formBuilder.group({
            // numberOfMonth: [item.numberOfMonth ? { label: item.numberOfMonth, value: item.numberOfMonth } : { label: '12 Months', value: '12 Months' }, [Validators.required]],
            stock: [item?.stock, [Validators.required]],
            sumInsured: [item?.sumInsured, [Validators.required, Validators.min(0)]]
        })
    }

    submitForm() {
        console.log(this.coverForm)
        if (this.coverForm.valid) {
            if (this.cover?._id) {
                console.log(this.coverForm)
                console.log('Updated')
                const payload = { ...this.coverForm.value }

                this.coverService.update(this.cover?._id, payload).subscribe({
                    next: (response: IOneResponseDto<IDeclarationPolicy>) => {

                        console.log(response.data.entity)
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

                console.log('Created');

                this.coverService.create(payload).subscribe({
                    next: (response: IOneResponseDto<IDeclarationPolicy>) => {

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
