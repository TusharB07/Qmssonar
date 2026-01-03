import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-quote-sent-to-next-underwriter-dialog',
    templateUrl: './quote-sent-to-next-underwriter-dialog.component.html',
    styleUrls: ['./quote-sent-to-next-underwriter-dialog.component.scss']
})
export class QuoteSentToNextUnderwriterDialogComponent implements OnInit {

    constructor(
        private ref: DynamicDialogRef
    ) { }

    ngOnInit(): void {
    }

    close() {
        this.ref.close();
    }

}
