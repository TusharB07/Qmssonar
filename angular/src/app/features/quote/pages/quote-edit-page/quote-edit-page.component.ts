import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ILov, IManyResponseDto, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Observable, Subscription } from 'rxjs';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { IClientLocation } from 'src/app/features/admin/client-location/client-location.model';
import { IPincode } from 'src/app/features/admin/pincode/pincode.model';
import { DialogService } from 'primeng/dynamicdialog';
import { ComparisonUnderWriteBApprovalDialogComponent } from '../../components/quote/comparison-under-write-b-approval-dialog/comparison-under-write-b-approval-dialog.component';
import { QouteSentForQcrDialogComponent } from '../../components/quote/qoute-sent-for-qcr-dialog/qoute-sent-for-qcr-dialog.component';
import { QuoteUnderwritterReviewStatusDialogComponent } from '../../components/quote/quote-underwritter-review-status-dialog/quote-underwritter-review-status-dialog.component';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { QuoteAuditTrailDialogComponent } from '../../components/quote/quote-audit-trail-dialog/quote-audit-trail-dialog.component';
import { AppService } from 'src/app/app.service';
import { QuoteSentToUnderwritterByRmDialogComponent } from '../../status_dialogs/quote-sent-to-underwritter-by-rm-dialog/quote-sent-to-underwritter-by-rm-dialog.component';
import { QuoteSentToNextUnderwriterDialogComponent } from '../../status_dialogs/quote-sent-to-next-underwriter-dialog/quote-sent-to-next-underwriter-dialog.component';

@Component({
    selector: 'app-quote-edit-page',
    templateUrl: './quote-edit-page.component.html',
    styleUrls: ['./quote-edit-page.component.scss']
})
export class QuoteEditPageComponent implements OnInit {

    tabs: MenuItem[] = [];

    id: string;
    quote: IQuoteSlip;
    optionsQuoteLocationOccupancies: ILov[];
    selectedQuoteLocationOccpancyId: string;

    private currentQuote: Subscription;

    @Input() permissions: PermissionType[] = ['read', 'create', 'update', 'delete']

    index = 0;
    // activeTab = '';
    tasks = [];
    showTaskDialog = false;

    isSendForApproval: boolean;
    isProceedFuther: boolean;

    currentUser$: Observable<IUser>;

    user: IUser;

    isIcRates: boolean;
    hideBrokeRatesFromRM: boolean;
    //Intergation-EB [Start]
    private currentSelectedTemplate: Subscription;
    selectedQuoteTemplate: IQuoteGmcTemplate[];
    //Intergation-EB [End]
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private dialogService: DialogService,
        private accountService: AccountService,
        private appService: AppService,
    ) {

        this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user
                const role: IRole = user?.roleId as IRole;

                if (role?.name === AllowedRoles.INSURER_UNDERWRITER) {
                    this.isEditAllowed = true
                }

                if (role?.name === AllowedRoles.INSURER_RM) {
                    this.hideBrokeRatesFromRM = true
                }
            }
        });


        //   this.quote = this.activatedRoute.parent.snapshot.paramMap.get("id");
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote

                this.checkAndNavigate(quote)

                this.onQuoteSet(quote)

            }
        })
        //Intergation-EB [Start]
        this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
            next: (template) => {
                this.selectedQuoteTemplate = template;
            }
        })
        //Intergation-EB [End]
    }

    isEditAllowed: boolean


    onQuoteSet(quote: IQuoteSlip) {
        this.isIcRates = quote?.isIcRates

        this.isSendForApproval = false;
        this.isProceedFuther = false;

        switch (quote?.quoteState) {
            case AllowedQuoteStates.SENT_TO_INSURER_RM:
                this.isSendForApproval = true
                this.permissions = ['read']
                break;
            case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                this.isProceedFuther = true;
                break;
        }

        const product = quote?.productId as IProduct;

        switch (product?.productTemplate) {
            case AllowedProductTemplate.BLUS:
                this.tabs = [];
                if (this.quote.quoteState == AllowedQuoteStates.PLACEMENT) {
                    this.tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Risk Header Letter', fragment: 'app-quote-insurer-review-risk-cover-letter-tab', command: ($event) => this.activateTab($event.index, this.tabs) })

                } else {
                    this.tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    // this.tabs.push({ label: 'Sum Insured Details', fragment: 'app-sum-insured-details', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: 'Business Suraksha Covers', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-business-suraksha-covers', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    if (this.isProceedFuther) this.tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    if (this.isProceedFuther) this.tabs.push({ label: 'Decision Matrix', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-decision-matrix-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) },)
                }
                break;
            case AllowedProductTemplate.FIRE:
                this.tabs = []
                if (this.quote.quoteState == AllowedQuoteStates.PLACEMENT) {
                    this.tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Risk Header Letter', fragment: 'app-quote-insurer-review-risk-cover-letter-tab', command: ($event) => this.activateTab($event.index, this.tabs) })

                } else {
                    this.tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    // this.tabs.push({ label: 'Sum Insured Details', fragment: 'app-sum-insured-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                    // this.tabs.push({ label: 'Sum Insured Details', fragment: 'app-sid-sum-insured-split-dialog', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: ($event) => this.activateTab($event.index, this.tabs) },)
                    this.tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    if (this.isProceedFuther) this.tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    if (this.isProceedFuther) this.tabs.push({ label: 'Decision Matrix', routerLinkActiveOptions: { isMultilocation: false }, fragment: 'app-quote-insurer-review-decision-matrix-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                }

                break;
            case AllowedProductTemplate.IAR:
                this.tabs = []
                if (this.quote.quoteState == AllowedQuoteStates.PLACEMENT) {
                    this.tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Risk Header Letter', fragment: 'app-quote-insurer-review-risk-cover-letter-tab', command: ($event) => this.activateTab($event.index, this.tabs) })

                } else {
                    this.tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    // this.tabs.push({ label: 'Sum Insured Details', fragment: 'app-sum-insured-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Sum Insured Details', fragment: 'app-sum-insured-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    if (this.isProceedFuther) this.tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    if (this.isProceedFuther) this.tabs.push({ label: 'Decision Matrix', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-decision-matrix-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                }
                break;
            case AllowedProductTemplate.GMC:
                this.tabs = []

                this.tabs.push({ label: 'Basic Details', fragment: 'app-gmc-basic-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Employee Demographic Details', fragment: 'app-gmc-employee-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Family Composition', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-family-composition', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Standard Coverages', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-coverages', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: "Maternity Benifits", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-maternity-benifits', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Enhanced Covers', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-enhanced-covers', command: ($event) => this.activateTab($event.index, this.tabs) })

                this.tabs.push({ label: 'Other Restrictions', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-cost-containment', command: ($event) => this.activateTab($event.index, this.tabs) })
                if (this.quote.quoteType != 'new') {
                    this.tabs.push({ label: 'Claim Analytics', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-claim-analytics', command: ($event) => this.activateTab($event.index, this.tabs) })
                    this.tabs.push({ label: 'Final Rater', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-final-rater', command: ($event) => this.activateTab($event.index, this.tabs) })
                }
                this.tabs.push({ label: 'Other Details', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-other-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) })
                break;

            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                this.tabs = []
                this.tabs.push({ label: 'Employee Details', fragment: 'app-wc-employee-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Coverage Details', fragment: 'app-wc-coverage-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                break;
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                this.tabs = []
                this.tabs.push({ label: 'Employee Details', fragment: 'app-wc-employee-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Coverage Details', fragment: 'app-wc-coverage-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                break;
            case AllowedProductTemplate.LIABILITY:
                this.tabs = []
                this.tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                // this.tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Deductibles', fragment: 'app-liability-deductibles-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                break;

            case AllowedProductTemplate.LIABILITY:
                this.tabs = []
                this.tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-cgl-teritory-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                this.tabs.push({ label: 'Claim Experience & Turnover Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                break;
        }

        this.activateTab((this.activatedRoute.snapshot.queryParams.tab ?? 1) - 1, this.tabs)


    }

    checkAndNavigate(quote: IQuoteSlip) {

        if (quote) {

            const role = this.user.roleId as IRole
            console.log(this.user);
            console.log(quote);

            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    if (![
                        AllowedQuoteStates.SENT_TO_INSURER_RM
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appService.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    if (![
                        AllowedQuoteStates.UNDERWRITTER_REVIEW
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appService.routes.quotes.list())
                    }
                    break;
                case AllowedRoles.OPERATIONS:
                    if (![
                        AllowedQuoteStates.PENDING_PAYMENT
                    ].includes(quote.quoteState)) {
                        this.router.navigateByUrl(this.appService.routes.quotes.list())
                    }
                    break;
            }

        }
    }



    ngOnInit() {
        console.log(this.tabs)

        // this.tabs = [
        //     // { label: 'Basic Details', routerLink: 'basic-details' },
        //     // { label: 'Sum Insured Details', routerLink: 'sum-insured-details' },
        //     // { label: 'Multilocation Annexure', routerLink: 'multilocation-annexure' },
        //     // { label: "Add On's", routerLink: 'add-on' },
        //     // { label: 'Business Suraksha Covers', routerLink: 'business-suraksha-covers' },
        //     // { label: 'Risk Inspection Status & Claim Experience', routerLink: 'risk-inspection-status-and-claim-experience' },
        //     // { label: 'Warranties, Exclusions & Subjectives', routerLink: 'warrenties-and-exclusion-and-subjectives' },
        //     // { label: 'Decision Matrix', routerLink: 'decision-matrix' },
        //     // { label: 'Preview & Download', routerLink: 'preview-and-download' },
        //     { label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: 'Sum Insured Details', fragment: 'app-sum-insured-details', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: 'Business Suraksha Covers', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-business-suraksha-covers', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: 'Decision Matrix', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-decision-matrix-tab', command: ($event) => this.activateTab($event.index, this.tabs) },
        //     { label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: ($event) => this.activateTab($event.index, this.tabs) },
        // ];


        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: this.id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        // console.log(event)

        this.quoteLocationOccupancyService.getManyAsLovs({}, lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteLocationOccupancy>) => {
                // console.log(dto.data.entities)
                // console.log(data)
                this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IQuoteLocationOccupancy) => {
                    let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation
                    let pincode: IPincode = entity.pincodeId as IPincode

                    return { label: `${clientLocation.locationName} - ${pincode.name}`, value: entity._id }
                });

                // this.quoteService.setQuoteLocationOccupancyId(this.optionsQuoteLocationOccupancies[0]?.value);
                this.loadData(this.optionsQuoteLocationOccupancies[0]?.value);
            },
            error: e => { }
        });

        // this.tasks.push(
        //     { "status": "inprogress", "brokerName": "Anil Patel", "role": "make", "statusText": "Not started" },
        //     { "status": "completed", "brokerName": "Rekha Ahuja", "role": "Checker", "statusText": "Completed" },
        //     { "status": "access-denied", "brokerName": "Shanti Reddy", "role": "Checker", "statusText": "Access Denied" },
        //     { "status": "access-denied", "brokerName": "Krishna Arya", "role": "Checker", "statusText": "Access Denied" },
        //     { "status": "access-denied", "brokerName": "Amit Bhatt", "role": "Checker", "statusText": "Access Denied" },
        //     { "status": "pending", "brokerName": "Sunil Khatri", "role": "Maker, Checker", "statusText": "In Progress" }
        // )
        // console.log(this.tasks);



    }

    isNext() {
        return this.index < this.tabs.length - 1
    }
    isPrev() {
        return this.index > 0
    }

    activateTab(index, items) {
        if (this.activatedRoute.snapshot.queryParams.tab < 1 || this.activatedRoute.snapshot.queryParams.tab > this.tabs.length) {

            // this.router.navigate([], { queryParams: { tab: 1 } });
            this.router.navigate([], {
                queryParams: {
                    tab: 1,
                    location: this.activatedRoute.snapshot.queryParams.location
                }
            });

            console.log(this.index)
        } else {
            this.router.navigate([], {
                queryParams: {
                    tab: index + 1,
                    location: this.activatedRoute.snapshot.queryParams.location
                }
            });

            // this.router.navigate([], {
            //     queryParams: {
            //         tab: index + 1
            //     },
            //     replaceUrl: true
            // });

            this.index = index;
        }

        // console.log(this.index)
        // this.activeTab = items[index].fragment;
    }
   
    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }

    loadData(quoteLocationOccupancyId: string) {
        this.quoteService.setQuoteLocationOccupancyId(quoteLocationOccupancyId)
    }

    handleRiskLocationOccupancyChange(event) {
        this.loadData(event.value)
        // this.quoteService.setQuoteLocationOccupancyId(event.value)
    }

    nextPage() {
        this.activateTab(this.index + 1, this.tabs)
    }
    prevPage() {
        this.activateTab(this.index - 1, this.tabs)
    }

    proceedFuther() {
        // alert('Send quote to next underwritter or QCR for Broker')
        this.quoteService.sendQuoteForComparisonReview(this.id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                console.log(dto)

                // this.quoteService.setQuote(dto.data.entity);

                this.quoteService.refresh((quote) => {
                    switch (quote?.quoteState) {
                        case AllowedQuoteStates.UNDERWRITTER_REVIEW:

                            const refByUnderwriter = this.dialogService.open(QuoteSentToNextUnderwriterDialogComponent, {
                                header: '',
                                width: '500px',
                                styleClass: 'flatPopup'
                            })

                            refByUnderwriter.onClose.subscribe(() => {
                                this.router.navigateByUrl(`/`);
                            })


                            break;

                        case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:


                            const ref1 = this.dialogService.open(QouteSentForQcrDialogComponent, {
                                header: '',
                                width: '500px',
                                styleClass: 'flatPopup'
                            })

                            ref1.onClose.subscribe(() => {
                                this.router.navigateByUrl(`/`);

                            })

                            break;
                    }

                })


                //   if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/broker/quotes/${this.quoteId}/sum-insured-details`);

            }
        })
    }

    sendForApproval() {


        this.quoteService.sendQuoteToUnderwritterApproval(this.quote._id).subscribe({
            next: quote => {

                this.quoteService.refresh((quote) => {
                    const refByRM = this.dialogService.open(QuoteSentToUnderwritterByRmDialogComponent, {
                        header: '',
                        width: '500px',
                        styleClass: 'flatPopup'
                    })

                    refByRM.onClose.subscribe(() => {
                        this.router.navigateByUrl(`/`);
                    })
                })
            },
            error: error => {
                console.log(error);
            }
        });


        // this.requestSentDialog = true;
        // this.router.navigateByUrl(`backend/broker/quotes`);
        // if (this.quote.quoteState == 'Sent To Insurance Company RM') {
        // } else if (this.quote.quoteState == 'QCR From Underwritter') {
        //     console.log('else if');

        //     this.quoteService.generatePlacementSlip(this.quote._id).subscribe({
        //         next: quote => {
        //             this.quoteService.get(quote.data.entity._id).subscribe({
        //                 next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //                     this.quote = dto.data.entity;
        //                     if (this.quote.quoteNo) this.router.navigateByUrl(`/backend`);
        //                 },
        //                 error: e => {
        //                     console.log(e);
        //                 }
        //             });
        //         },
        //         error: error => {
        //             console.log(error);
        //         }
        //     });
        // }
    }
    showTaskDialogModal() {
        // this.showTaskDialog = true;


        const ref = this.dialogService.open(QuoteUnderwritterReviewStatusDialogComponent, {
            header: 'View Status',
            width: '500px',
            styleClass: 'flatPopup task-dialog',
        })

        // ref.onClose.subscribe(() => {
        //     this.router.navigateByUrl(`/`);
        // })

    }

    showQuoteAuditTrailDialog() {

        const ref = this.dialogService.open(QuoteAuditTrailDialogComponent, {
            header: 'Quote Change History',
            width: '900px',
            styleClass: 'flatPopup task-dialog',
        })
    }

    toggleRates() {
        this.quoteService.getRate({
            quoteId: this.quote._id,
            partnerId: this.quote.isIcRates ? this.quote.originalPartnerId : this.quote.partnerId,
        }).subscribe(({
            next: () => {
                this.quoteService.refresh()
            }
        }))
    }
}
