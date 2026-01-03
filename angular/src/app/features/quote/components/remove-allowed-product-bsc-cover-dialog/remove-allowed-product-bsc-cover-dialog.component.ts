import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogContent } from 'primeng/dynamicdialog/dynamicdialogcontent';
import { AllowedProductBscCover } from 'src/app/features/admin/product/product.model';

@Component({
    selector: 'app-remove-allowed-product-bsc-cover-dialog',
    templateUrl: './remove-allowed-product-bsc-cover-dialog.component.html',
    styleUrls: ['./remove-allowed-product-bsc-cover-dialog.component.scss']
})
export class RemoveAllowedProductBscCoverDialogComponent implements OnInit {

    removedCovers: AllowedProductBscCover[]

    constructor(
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
    ) {

        this.removedCovers = this.config.data.removedCovers
    }

    close(){
        this.ref.close(false);
    }

    ngOnInit(): void {
    }

    deleteCovers() {
        this.ref.close(true);
    }
    ngOnDestroy(){
     
    }
}
