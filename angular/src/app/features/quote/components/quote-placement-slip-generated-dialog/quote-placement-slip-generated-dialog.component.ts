import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-quote-placement-slip-generated-dialog',
    templateUrl: './quote-placement-slip-generated-dialog.component.html',
    styleUrls: ['./quote-placement-slip-generated-dialog.component.scss']
})
export class QuotePlacementSlipGeneratedDialogComponent implements OnInit {

    constructor(
        private ref: DynamicDialogRef,
        private router: Router
    ) { }

    ngOnInit(): void {
    }


    close() {
        this.ref.close();
        // this.router.navigateByUrl('/')
    }

}
