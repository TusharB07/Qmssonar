import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-comparison-under-write-b-approval-dialog',
    templateUrl: './comparison-under-write-b-approval-dialog.component.html',
    styleUrls: ['./comparison-under-write-b-approval-dialog.component.scss']
})
export class ComparisonUnderWriteBApprovalDialogComponent implements OnInit {

    constructor(
        private ref: DynamicDialogRef
    ) { }

    ngOnInit(): void {
    }

    close() {
        this.ref.close();
    }

}
