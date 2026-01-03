import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';


@Component({
    selector: 'delete-confirmation-dialog',
    templateUrl: './delete-confirmation-dialog.component.html',
    styleUrls: ['./delete-confirmation-dialog.component.scss'],
    providers: [DialogService, MessageService]
})
export class DeleteConfirmationDialogComponent implements OnInit {

    progress;

    id: string;
    quote: IQuoteSlip;

    currentUser$: any;

    constructor(
        public messageService: MessageService,
        private ref: DynamicDialogRef

    ) { 
        
    }

    ngOnInit(): void {

    }

    confirmDelete() {
        // console.log('Yes')
        this.ref.close({ confirmed: true });
    }

    cancelDelete() {
        // console.log('No')
        this.ref.close({ confirmed: false });
    }
}

