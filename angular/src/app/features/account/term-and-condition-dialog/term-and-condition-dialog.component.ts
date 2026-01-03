import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from '../account.service';
import { ButtonModule } from 'primeng/button';
import { TermPopupComponent } from '../term-popup/term-popup.component';
import { Router } from '@angular/router';
import { ResetPasswordPopupDialogComponent } from '../../quote/components/quote/reset-password-popup-dialog/reset-password-popup-dialog.component';
import { MessageService } from 'primeng/api';
import { IUser } from '../../admin/user/user.model';
import { AllowedRoles, IRole } from '../../admin/role/role.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-term-and-condition-dialog',
  templateUrl: './term-and-condition-dialog.component.html',
  styleUrls: ['./term-and-condition-dialog.component.scss']
})
export class TermAndConditionDialogComponent implements OnInit {
  acceptedTermsAndConditions: boolean;
  returnUrl: string;
  @Input() user;
  role: IRole
  isAllowedCreateQuote: boolean
  isMobile: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    private accountService: AccountService,
    private dialogService: DialogService,
    private router: Router,
    private messageService: MessageService,
    private deviceService: DeviceDetectorService
  ) { 
    this.isMobile = this.deviceService.isMobile();
    accountService.currentUser$.subscribe({
      next: (user: IUser) => {
          if (user) {
              this.user = user;
              this.role = user.roleId as IRole;

              if (![
                  // AllowedRoles.BROKER_ADMIN,
                  // AllowedRoles.BROKER_APPROVER,
                  AllowedRoles.INSURER_RM,
                  AllowedRoles.OPERATIONS,
                  AllowedRoles.INSURER_ADMIN,
                  AllowedRoles.INSURER_UNDERWRITER,
                  // AllowedRoles.BROKER_CREATOR,
                  // AllowedRoles.BROKER_CREATOR_AND_APPROVER,
                  // AllowedRoles.AGENT_CREATOR,
                  // AllowedRoles.AGENT_CREATOR_AND_APPROVER,
              ].includes(this.role.name)) {
                  this.isAllowedCreateQuote = true
              }
          }
      }
  })
  }

  ngOnInit(): void {
  }



  acceptCondition() {
    let payload = {
      acceptedTermsAndConditions : true,
    }
    // this.acceptedTermsAndConditions = true
    // let payload =  this.acceptedTermsAndConditions 
    console.log("vikrant");
    this.accountService.update(payload).subscribe({
      next: v => {
        // console.log(`About to navigate to ${this.returnUrl}`);
        // this.router.navigateByUrl(this.returnUrl);
        this.ref.close('closed');
        this.openResetPasswordPopup();

      },
      error: e => {
        console.log(e);
      }
    });
  }


  openResetPasswordPopup() {
    const ref1 = this.dialogService.open(ResetPasswordPopupDialogComponent, {
        header: 'Important!',
        width: this.isMobile ? '350px' : '500px',
        styleClass: 'flatPopup',
        data: {
            lastLogin: this.user?.lastLogin
        },        
        closable: false,
        closeOnEscape: false
    })

    ref1.onClose.subscribe((value) => {
        if (value == 'closed') {
            ref1.close();
            this.accountService.logout();
        }
        if (value == 'changed') {
            this.dialogService.dialogComponentRefMap.forEach(dialog => {
                dialog.destroy();
            });
            this.accountService.logout();
            this.messageService.add({
                severity: "success",
                summary: "Successful",
                detail: `Password Changed Sucessfully`,
                life: 3000
            });
        }
    })
}

  openInsuredDetailsDialog() {
    const ref = this.dialogService.open(TermPopupComponent, {
        header: "Welcome to Alwrite!" ,
        width:  '70%',
        styleClass: 'customPopup',
        // data: {
        //     quote: this.quote,
        // }
    })

    ref.onClose.subscribe({
        next: () => {
           
        }
    })
}


}
  

