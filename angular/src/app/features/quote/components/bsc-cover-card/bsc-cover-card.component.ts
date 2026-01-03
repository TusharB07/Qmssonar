import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { AllowedRoles } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ToWords } from 'to-words';

export interface BscCoverCardProps {
    label: string;
    productName: string;
    premium?: number;
    isNegative?: boolean;
    sumInsured?: number;
    permissions: PermissionType[];
    formDialogFunction?: Function
    viewDialogFunction?: Function
    modelname?: string;
    totalPremium?: number;
    isNonOtc?: boolean
    deleteDialogFunction?: Function,
    modelId?: string,
    description?: string;
    percentage? :boolean;
}


@Component({
    selector: 'app-bsc-cover-card',
    templateUrl: './bsc-cover-card.component.html',
    styleUrls: ['./bsc-cover-card.component.scss']
})


export class BscCoverCardComponent implements OnInit {

    @Input() label: string;
    @Input() productName: string;
    @Input() modelId: string;
    @Input() description: string;

    @Input() premium: number;
    @Input() sumInsured: number;
    @Input() user : any
    @Input() modelname :any
    
    toWords = new ToWords;

    @Input() isView: boolean = false;

    @Output() openFormDialog = new EventEmitter();
    @Output() openViewDialog = new EventEmitter();
    @Output() deleteDialog = new EventEmitter();

    @Output() openDeleteDialog = new EventEmitter();


    @Input() permissions: PermissionType[] = []

    @Input() isNonOtc: boolean;
    // user: IUser
    AllowedRoles = AllowedRoles

   
    constructor( 
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {
        // console.log(this.permissions);
    }

    ngOnInit(): void {
    }

    tiggerFormDialog() {
        this.openFormDialog.emit()
    }
    tiggerViewDialog() {
        this.openViewDialog.emit()
    }

    deleteDialogFun(){
        // console.log(this.label)
            this.deleteDialog.emit({modelName : this.modelname, modelId : this.modelId})
        // this.confirmationService.confirm({
        //     message: 'Do you want to delete this record?',
        //     header: 'Delete Confirmation',
        //     icon: 'pi pi-info-circle',
        //     accept: () => {
        //         // this.messageService.add({severity:'info', summary:'Confirmed', detail:'Record deleted'});
        //     },
        //     reject: (type) => {
        //         switch(type) {
        //             case type.REJECT:
        //                 this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
        //             break;
        //             case type.CANCEL:
        //                 this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
        //             break;
        //         }
        //     }
        // });
    }
}
