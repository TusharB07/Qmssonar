import { DialogService } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../../admin/user/user.model';
import { AccountService } from '../account.service';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';
import { QuoteService } from '../../admin/quote/quote.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    constructor(private accountService: AccountService, 
        private dialogService: DialogService,  
        private quoteService: QuoteService) {}

    user: IUser

    ngOnInit(): void {
        this.accountService.currentUser$.subscribe({
            next: (user: IUser) => {
                this.user = user;
                console.log(user)
            }
        })
    }

    resetPassword() {
        console.log("Reset Password");
        const ref = this.dialogService.open(ResetPasswordDialogComponent,{
            header:"Reset Password",
            styleClass :  'customPopup',
            width : '300px'
        })

        ref.onClose.subscribe((data) => {
            // console.log("Hello",data)
        });
    }


}
