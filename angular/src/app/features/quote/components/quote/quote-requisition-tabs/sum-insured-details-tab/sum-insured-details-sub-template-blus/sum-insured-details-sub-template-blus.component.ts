import { Component, Input, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PermissionType } from 'src/app/app.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';

@Component({
    selector: 'app-sum-insured-details-sub-template-blus',
    templateUrl: './sum-insured-details-sub-template-blus.component.html',
    styleUrls: ['./sum-insured-details-sub-template-blus.component.scss']
})
export class SumInsuredDetailsSubTemplateBlusComponent implements OnInit {

    @Input() quote: IQuoteSlip

    @Input() permissions: PermissionType[] = ['read','update']
    isMobile: boolean = false;

    @Input() quoteOptionData: IQuoteOption     // New_Quote_option
    constructor(
        private deviceService: DeviceDetectorService
    ) { }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
    }

}
