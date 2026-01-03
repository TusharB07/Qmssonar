import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ReplaySubject, Subscription } from 'rxjs';
import { IBulkImportResponseDto, ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, AllowedQuoteTypes, IQuoteGmcTemplate, IEandOTemplate, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { QouteSentForQcrDialogComponent } from '../../components/quote/qoute-sent-for-qcr-dialog/qoute-sent-for-qcr-dialog.component';
import { QuoteAuditTrailDialogComponent } from '../../components/quote/quote-audit-trail-dialog/quote-audit-trail-dialog.component';
import { QuoteUnderwritterReviewStatusDialogComponent } from '../../components/quote/quote-underwritter-review-status-dialog/quote-underwritter-review-status-dialog.component';
import { QuoteSentToNextUnderwriterDialogComponent } from '../../status_dialogs/quote-sent-to-next-underwriter-dialog/quote-sent-to-next-underwriter-dialog.component';
import { QuoteSentToUnderwritterByRmDialogComponent } from '../../status_dialogs/quote-sent-to-underwritter-by-rm-dialog/quote-sent-to-underwritter-by-rm-dialog.component';
import { GmcCoveragesOptionsDialogComponent } from '../../components/gmc-coverages-options-dialog/gmc-coverages-options-dialog.component';
import { GmcQuoteOnscreenCompareDialogComponent } from '../../components/gmc-quote-onscreen-compare-dialog/gmc-quote-onscreen-compare-dialog.component';
import { FamilyCompositionTabComponent } from '../../components/quote/quote-requisition-tabs/family-composition-tab/family-composition-tab.component';
import { GmcCoveregesTabComponent } from '../../components/quote/quote-requisition-tabs/gmc-covereges-tab/gmc-covereges-tab.component';
import { MaternityBenifitsTabComponent } from '../../components/quote/quote-requisition-tabs/maternity-benifits-tab/maternity-benifits-tab.component';
import { CostContainmentTabComponent } from '../../components/quote/quote-requisition-tabs/cost-containment-tab/cost-containment-tab.component';
import { FinalRaterTabComponent } from '../../components/quote/quote-requisition-tabs/final-rater-tab/final-rater-tab.component';
import { OtherDetailsTabComponent } from '../../components/quote/quote-requisition-tabs/other-details-tab/other-details-tab.component';
import { GmcOtherdetailsTabComponent } from '../../components/quote/quote-requisition-tabs/gmc-otherdetails-tab/gmc-otherdetails-tab.component';
import { RejectQuoteDialogComponent } from './reject-quote-dialog/reject-quote-dialog.component';
import { OtcProductLimitExceededConfirmationDialogComponent } from '../../confirmation_dialogs/otc-product-limit-exceeded-confirmation-dialog/otc-product-limit-exceeded-confirmation-dialog.component';
import { QmsService } from '../quote-discussion-page/qms.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { QuoteOptionListDialogComponent } from './quote-option-list-dialog/quote-option-list-dialog.component';

import { LiabilityOptionsDialogComponent } from '../../components/liability-options-dialog/liability-options-dialog.component';
import { LiabilityEandOBasicDetailsComponent } from '../../components/quote/quote-edit-steps/eando-liability-basic-details/eando-liability-basic-details.component';
import { LiabilityEandODeductiblesDetailsComponent } from '../../components/quote/quote-edit-steps/eando-liability-deductibles-details/eando-liability-deductibles-details.component';
import { LiabilityEandORevenueDetailsComponent } from '../../components/quote/quote-edit-steps/eando-liability-revenue-details/eando-liability-revenue-details.component';
import { LiabilityEandOTeritoryDetailsComponent } from '../../components/quote/quote-edit-steps/eando-liability-teritory-details/eando-liability-teritory-details.component';
import { LiabilityEandOExclusionDetailsComponent } from '../../components/quote/quote-edit-steps/liability-eando-exclusion-details/liability-eando-exclusion-details.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { IcOptions, QcrAnswers, QcrHeaders, QCRQuestionAnswer } from '../quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import { IQuoteLiabilityOptions } from '../../components/liability-options-dialog/ploptions.model';
import { GmcEnhancedCoversTabComponent } from '../../components/quote/quote-requisition-tabs/gmc-enhanced-covers-tab/gmc-enhanced-covers-tab.component';
import { IndicativePremiumCalcService } from '../../components/quote/quote-requisition-tabs/workmen-coverages-tab/indicativepremiumcalc.service';
@Component({
    selector: 'app-quote-insurer-review-page',
    templateUrl: './quote-insurer-review-page.component.html',
    styleUrls: ['./quote-insurer-review-page.component.scss']
})
export class QuoteInsurerReviewPageComponent implements OnInit, OnDestroy {
    @ViewChild(LiabilityEandOBasicDetailsComponent) liabilityEandOBasicDetailsComponent: LiabilityEandOBasicDetailsComponent;
    @ViewChild(LiabilityEandODeductiblesDetailsComponent) liabilityEandODeductiblesDetailsComponent: LiabilityEandODeductiblesDetailsComponent;
    @ViewChild(LiabilityEandOTeritoryDetailsComponent) liabilityEandOTeritoryDetailsComponent: LiabilityEandOTeritoryDetailsComponent;
    @ViewChild(LiabilityEandORevenueDetailsComponent) liabilityEandORevenueDetailsComponent: LiabilityEandORevenueDetailsComponent;
    @ViewChild(LiabilityEandOExclusionDetailsComponent) liabilityEandOExclusionDetailsComponent: LiabilityEandOExclusionDetailsComponent;
    showTableForExcel: boolean = false;
    visibleSidebar = false;

    quote: IQuoteSlip;
    quoteOptions: ILov[] = []
    selectedOptions: ILov;
    showEditOption: boolean = false;
    user: IUser;

    AllowedRoles = AllowedRoles;
    AllowedStates = AllowedQuoteStates;
    AllowedProductTemplate = AllowedProductTemplate
    isInsurerSelected: boolean = true;
    private currentQuote: Subscription;
    templateId: string = ""
    chatCount = 0;
    queries: any;
    dropdownName = []
    private currentParamsSource = new ReplaySubject<{ quoteId: string, quoteLocationOccupancyId?: string, quoteOptionId: string }>(null);
    currentParams$ = this.currentParamsSource.asObservable();
    //Intergation-EB [Start]
    private currentSelectedTemplate: Subscription;
    selectedQuoteTemplate: IQuoteGmcTemplate[];
    quoteId: string = "";
    quoteOptionsLst: any[];
    showPrintPdfOptions: boolean = false;
    questionAnswerList: QCRQuestionAnswer[] = []
    questionAnswerListTwo: QCRQuestionAnswer[] = []
    questionAnswerListToBind: QCRQuestionAnswer[] = []
    questionAnswerListToBindQuickQCR: QCRQuestionAnswer[] = []
    qmodel: QCRQuestionAnswer = new QCRQuestionAnswer()
    qcrHeadersLst: QcrHeaders[] = []
    qcrHeaderTwoLst: QcrHeaders[] = []
    totalPremium: number = 0
    //Intergation-EB [End]

    // New_Quote_option
    private currentPropertyQuoteOption: Subscription;
    quoteOptionData: IQuoteOption
    onLoadQuoteOption: string
    selectedQuoteOptionOfProperty: ILov
    allQuoteOptionDropdown: ILov[] = []
    allQuoteOptions: any
    optionsQuoteOptions: any
    selectedQuoteOption: any
    private currentSelectedOption: Subscription;

    private currentQuoteOptions: Subscription;
    selectedOption: any;
    brokerQuote: any;
    selectedICName: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private router: Router,
        private appService: AppService,
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private accountService: AccountService,
        private messageService: MessageService,
        private qmsService: QmsService,
        private quoteOptionService: QuoteOptionService,

    ) {
        // * DO NOT TOUCH
        this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user
            }
        });

        // * DO NOT TOUCH
        this.activatedRoute.params.subscribe({
            next: (params) => {
                const quoteLocationOccupanyId = this.activatedRoute.snapshot.queryParams.location
                const quoteOptionId = this.activatedRoute.snapshot.queryParams.quoteOptionId                            // New_Quote_Option
                this.currentParamsSource.next({
                    quoteId: params.quote_id,
                    quoteLocationOccupancyId: quoteLocationOccupanyId,
                    quoteOptionId: quoteOptionId                                                                        // New_Quote_Option

                })
            }
        })

        // * DO NOT TOUCH
        this.activatedRoute.queryParamMap.subscribe({
            next: (queryParams) => {
                const quoteId = this.activatedRoute.snapshot.paramMap.get("quote_id");
                this.currentParamsSource.next({
                    quoteId: quoteId,
                    quoteLocationOccupancyId: queryParams.get('location'),
                    quoteOptionId: queryParams.get('quoteOptionId')

                })
            }
        })

        // * DO NOT TOUCH
        this.currentParams$.subscribe({
            next: (params) => {
                this.loadQuote(params.quoteId, params.quoteLocationOccupancyId)
                if (params.quoteOptionId) {
                    this.loadQuoteOption(params.quoteOptionId, params.quoteLocationOccupancyId)                         // New_Quote_Option
                }
            }
        })

        // * DO NOT TOUCH
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
                if (!this.activatedRoute.snapshot.queryParams.quoteOptionId) {
                    this.onQuoteSet(quote)
                }
                this.quoteService.getQuoteByQuoteNo(this.quote.quoteNo).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        // @ts-ignore
                        this.brokerQuote = dto.data.entity.filter(qt => qt.partnerId?.partnerType == 'broker');
                        if (this.brokerQuote[0].insurersAllowedToEditQCR == undefined) {
                            this.dropdownName = []
                            this.quote.mappedIcNames.map((val) => {
                                if (!val.brokerAutoFlowStatus) {                                                                  // Check if brokerAutoFlowStatus is false
                                    this.dropdownName.push({ name: val.name });
                                }
                            })
                        } else if (this.brokerQuote[0].insurersAllowedToEditQCR?.length === 0) {
                            this.dropdownName = []
                            this.quote.mappedIcNames.map((val) => {
                                if (!val.brokerAutoFlowStatus) {                                                                  // Check if brokerAutoFlowStatus is false
                                    this.dropdownName.push({ name: val.name });
                                }
                            })
                        } else {
                            this.dropdownName = []
                            this.brokerQuote.map(qt => {
                                this.dropdownName = qt.insurersAllowedToEditQCR.map((ele) => ({ name: ele.insurerId.name, icId: ele.insurerId._id }))
                            })
                        }
                    }

                })
            }
        })
        //Intergation-EB [Start]
        // * DO NOT TOUCH
        // this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
        //     next: (template) => {
        //         // this.selectedQuoteTemplate = template;
        //         this.quoteOptions = template.map(entity => ({ label: entity.optionName, value: entity._id }));
        //     }
        // })

        //Intergation-EB [End]

        // New_Quote_option
        this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                const temp = template;
                this.selectedQuoteOption = template?._id;
            }
        })
        this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
            next: (template) => {
                const temp = template;
                this.allQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion);
                this.optionsQuoteOptions = template?.filter(x => x.version == this.quote?.qcrVersion).map(entity => ({ label: entity.optionName, value: entity._id }));
            }
        })

        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto
                this.onQuoteOptionSet(dto)
            }
        });
    }

    loadQuote(quoteId, quoteLocationOccupanyId?) {
        // if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id) {

        //     if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?._id != quoteLocationOccupanyId) {

        //         this.quoteService.get(quoteId, {
        //             quoteLocationOccupancyId: quoteLocationOccupanyId
        //         }).subscribe({
        //             next: (dto) => {
        //                 const quote = dto.data.entity

        //                 this.quoteService.setQuote(quote)
        //                 this.qmsService.notificationcount().subscribe({
        //                     next: (response) => {
        //                         // @ts-ignore
        //                         this.queries = response.data.entity


        //                         this.queries = this.queries.filter(query => query.state == 'Open')

        //                         this.queries.map(chat => {

        //                             if (chat.quoteId[0]._id == quote._id || chat.quoteId[0]._id == quote?.originalQuoteId) {
        //                                 this.chatCount += 1
        //                             }
        //                         })


        //                         this.queries.map(chat => {

        //                             if (chat.quoteId[0]._id == quote._id || chat.quoteId[0]._id == quote?.originalQuoteId) {
        //                                 this.chatCount += 1
        //                             }
        //                         })

        //                     }
        //                 })
        //             }
        //         })
        //     }
        // } else {

        this.quoteService.get(quoteId).subscribe({
            next: (dto) => {
                const quote = dto.data.entity
                this.quoteService.setQuote(quote)

                if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
                    this.quoteId = quote._id;
                    this.getOptions()
                }
                else if (this.isAllowedProductLiability()) {
                    this.quoteId = quote._id;
                    this.getOptionsLiability()
                }
                else {
                    this.getQuoteOptions()
                }
                this.qmsService.notificationcount().subscribe({
                    next: (response) => {
                        // @ts-ignore
                        this.queries = response.data.entity

                        this.queries = this.queries.filter(query => query.state == 'Open')

                        this.queries.map(chat => {
                            if (chat.quoteId[0]._id == quote._id || chat.quoteId[0]._id == quote?.originalQuoteId) {
                                this.chatCount += 1
                            }
                        })

                    }
                })
            }
        })
        // }

    }

    // New_Quote_option
    loadQuoteOption(quoteOptionId?, quoteLocationOccupanyId?) {
        if (quoteOptionId != undefined) {
            if (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id) {

                if (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?._id != quoteLocationOccupanyId) {

                    this.quoteOptionService.get(quoteOptionId, {
                        quoteLocationOccupancyId: quoteLocationOccupanyId
                    }).subscribe({
                        next: (dto) => {
                            const quoteOption = dto.data.entity
                            this.quoteOptionService.setQuoteOptionForProperty(quoteOption)
                        }
                    })
                }
            } else {
                this.quoteOptionService.get(quoteOptionId).subscribe({
                    next: (dto) => {
                        const quoteOption = dto.data.entity
                        this.quoteOptionService.setQuoteOptionForProperty(quoteOption)
                    }
                })
            }
        }
    }

    onQuoteOptionSet(quoteOption: IQuoteOption) {
        if (quoteOption) {
            this.router.navigate([],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: {
                        location: quoteOption?.locationBasedCovers?.quoteLocationOccupancy?._id,
                        quoteOptionId: quoteOption?._id
                    },
                    queryParamsHandling: 'merge'
                })
            this.loadTabs(this.quote)
            this.checkAndNavigate(this.quote)
        }
    }
    handleQuoteOptionChange(event) {
        console.log('Selected option:', event.value);
        const template = this.allQuoteOptions.filter(x => x._id == event.value)[0]
        this.loadSelectedOption(template)
    }
    isAllowedProductLiability() {
        const isTemplateAllowed = [
            AllowedProductTemplate.LIABILITY_CGL,
            AllowedProductTemplate.LIABILITY_PUBLIC,
            AllowedProductTemplate.LIABILITY,
            AllowedProductTemplate.LIABILITY_EANDO,
            AllowedProductTemplate.LIABILITY_CRIME,
            AllowedProductTemplate.LIABILITY_PRODUCT,
            AllowedProductTemplate.WORKMENSCOMPENSATION,
            AllowedProductTemplate.LIABILITY_CYBER].includes(this.quote?.productId['productTemplate'])
        // checking if quote option have qcr version object

        return isTemplateAllowed;
    }


    handleOptionChange(tabIndexFragment: string, productTemplate: string) {
        // if (this.user.partnerId["brokerModeStatus"] == true) {
        //     if (!this.isInsurerSelected) {
        //         this.messageService.add({
        //             severity: "error",
        //             summary: "Fail",
        //             detail: "Select Insurrer",
        //             life: 3000
        //         });
        //         return;
        //     }
        // }

        this.loadSelectedOption(this.quoteOptionsLst.filter(x => x.optionName == this.selectedOptions.label)[0], true);
        this.templateId = this.selectedOptions.value;
    }

    loadOptionsAction(action: string) {
        switch (action) {
            case AllowedProductTemplate.GMC:
                this.getOptions()
                break;
            case AllowedProductTemplate.LIABILITY_EANDO:
                this.getOptionsLiability()
                break;
            case AllowedProductTemplate.LIABILITY:
                this.getOptionsLiability()
                break;
            case AllowedProductTemplate.LIABILITY_CRIME:
                this.getOptionsLiability()
                break;
            case AllowedProductTemplate.LIABILITY_CYBER:
                this.getOptionsLiability()
                break;
            case AllowedProductTemplate.LIABILITY_PRODUCT:
                this.getOptionsLiability()
                break;
            case AllowedProductTemplate.LIABILITY_CGL:
                this.getOptionsLiability()
                break;
            case AllowedProductTemplate.LIABILITY_PUBLIC:
                this.getOptionsLiability()
                break;
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                this.getOptionsLiability()
                break;
            default:
        }
    }

    //Intergation-EB [Start]
    getOptions() {
        this.quoteService.getAllQuoteOptions(this.quoteId).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion) //.map(entity => ({ label: entity.optionName, value: entity._id }));;
                this.quoteOptions = this.quoteOptionsLst.map(entity => ({ label: entity.optionName, value: entity._id }));

                this.quoteOptionsLst.forEach(element => {
                    const sortOrder = [
                        'Basic Details',
                        'Family Composition',
                        'Standard Coverages',
                        'Maternity Benifits',
                        'Enhanced Covers',
                        'Other Restrictions',
                        'Other Details'
                    ];
                    console.log(this.quote._id)
                    // Sorting the gmcTemplateData array by parentTabName according to the defined sortOrder
                    element.gmcTemplateData = element.gmcTemplateData.sort((a, b) => {
                        const aIndex = sortOrder.indexOf(a.parentTabName);
                        const bIndex = sortOrder.indexOf(b.parentTabName);

                        // If aIndex or bIndex is -1 (not found in sortOrder), push those to the end
                        if (aIndex === -1) return 1; // If a is not found in sortOrder, push it to the end
                        if (bIndex === -1) return -1; // If b is not found in sortOrder, push it to the end

                        return aIndex - bIndex; // Sort in the order defined in sortOrder
                    });
                });

                this.loadOptionsData(this.quoteOptionsLst);
                this.loadSelectedOption(this.quoteOptionsLst.filter(x => x.optionName == this.selectedOptions.label)[0]);
                this.getDataForDownload(this.quoteOptionsLst)
            },
            error: e => {
                console.log(e);
            }
        });
    }
    getOptionsLiability() {
        this.quoteService.getAllLiabilityQuoteOptions(this.quoteId).subscribe({
            next: (dto: IOneResponseDto<any[]>) => {
                this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                this.quoteOptions = this.quoteOptionsLst.map(entity => ({ label: entity.optionName, value: entity._id }));
                this.selectedOptions = this.quoteOptions[0];
                this.loadOptionsData(this.quoteOptionsLst);
                this.loadSelectedOption(this.quoteOptionsLst[0]);
                this.loadQuoteDetails(this.quote._id)
            },
            error: e => {
                console.log(e);
            }
        });
    }
    onQuoteSet(quote: IQuoteSlip) {
        if (quote) {

            this.router.navigate([],
                {
                    relativeTo: this.activatedRoute,
                    // queryParams: { location: quote?.locationBasedCovers?.quoteLocationOccupancy?._id },
                    queryParamsHandling: 'merge'
                })


            this.loadTabs(quote)

            this.checkAndNavigate(quote)

        }
    }

    getPremiumValueByQuote(): number {
        switch (this.quote.productId?.['productTemplate']) {
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                return this.quote.wcTemplateDataId?.['indicativePremium'] ?? 0;
            case AllowedProductTemplate.LIABILITY:
            case AllowedProductTemplate.LIABILITY_CRIME:
                return this.quote.liabilityTemplateDataId?.['totalPremiumAmt'] ?? 0;
            case AllowedProductTemplate.LIABILITY_EANDO:
                return this.quote.liabilityEandOTemplateDataId?.['totalPremiumAmt'] ?? 0;
            case AllowedProductTemplate.LIABILITY_CGL:
            case AllowedProductTemplate.LIABILITY_PUBLIC:
                return this.quote.liabilityCGLTemplateDataId?.['totalPremiumAmt'] ?? 0;
            case AllowedProductTemplate.LIABILITY_PRODUCT:
            case AllowedProductTemplate.LIABILITY_CYBER:
                return this.quote.liabilityProductTemplateDataId?.['totalPremiumAmt'] ?? 0;
            default:
                return 0;
        }
    }

    getPremiumValueByOption(option: any): number {
        switch (this.quote.productId?.['productTemplate']) {
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                return option['indicativePremium'] ?? 0;
            case AllowedProductTemplate.LIABILITY:
            case AllowedProductTemplate.LIABILITY_CRIME:
            case AllowedProductTemplate.LIABILITY_EANDO:
            case AllowedProductTemplate.LIABILITY_CGL:
            case AllowedProductTemplate.LIABILITY_PUBLIC:
            case AllowedProductTemplate.LIABILITY_PRODUCT:
            case AllowedProductTemplate.LIABILITY_CYBER:
                return option['totalPremiumAmt'] ?? 0;
            default:
                return 0;
        }
    }


    getDataForDownload(quoteOptionsLst: any) {
        //Foreach option
        this.questionAnswerList = [];
        this.qcrHeadersLst = []
        const qcrHeaders = new QcrHeaders();
        qcrHeaders.label = ""
        this.qcrHeadersLst.push(qcrHeaders);

        const qcrHeaderstwo = new QcrHeaders();
        qcrHeaderstwo.label = ""
        qcrHeaderstwo.quoteId = "";
        this.qcrHeaderTwoLst.push(qcrHeaderstwo);

        let i = 0
        quoteOptionsLst.forEach(element => {
            const qcrHeaderstwo = new QcrHeaders();
            qcrHeaderstwo.label = this.quote.partnerId['name']
            qcrHeaderstwo.quoteId = this.quote._id;
            qcrHeaderstwo.quoteFor = "Broker"
            this.qcrHeaderTwoLst.push(qcrHeaderstwo);

            i++;
        });



        //Other Tabs
        quoteOptionsLst.forEach(element => {
            let qcrHeaders = new QcrHeaders();
            qcrHeaders.label = element.optionName
            qcrHeaders.colspan = 1;
            this.qcrHeadersLst.push(qcrHeaders);
            //Optiom Index
            const optionIndex = element.optionIndex;

            element.gmcTemplateData.forEach(tempdata => {
                //Temp ID
                const tempId = tempdata._id
                if (tempdata.parentTabName === 'Other Details') {
                    console.log("Otherfdffffs")
                }
                tempdata.gmcSubTab.forEach(gmcsTab => {

                    //Sub Tab Id        
                    const subtabId = gmcsTab._id
                    //Subtab Name                  
                    if (optionIndex == 1) {
                        this.qmodel = new QCRQuestionAnswer();
                        this.qmodel.parentTabName = tempdata.parentTabName
                        this.qmodel.quoteId = element.quoteId;
                        this.qmodel.question = gmcsTab.subTabName;
                        this.qmodel.isHeader = false;
                        this.qmodel.isSubHeader = true;
                        this.qmodel.isLabel = false;
                        this.qmodel.colspan = quoteOptionsLst.length;
                        this.questionAnswerList.push(this.qmodel);
                    }

                    gmcsTab.gmcLabelForSubTab.forEach(pos => {

                        //GMC LabelSubTabId
                        const gmcLabelForSubTabId = pos._id;
                        if (pos.gmcQuestionAnswers != undefined) {
                            pos.gmcQuestionAnswers.forEach(eQues => {

                                //QuestionId
                                const questId = eQues._id;

                                this.qmodel = new QCRQuestionAnswer();
                                this.qmodel.quoteId = element.quoteId;
                                this.qmodel.tempId = tempId;
                                this.qmodel.subtabId = subtabId;
                                this.qmodel.gmcLabelForSubTabId = gmcLabelForSubTabId;
                                this.qmodel.questId = questId;
                                this.qmodel.isHeader = false;
                                this.qmodel.isSubHeader = false;
                                this.qmodel.isLabel = true;
                                this.qmodel.parentTabName = tempdata.parentTabName
                                //Answer Broker Ans
                                const qcrAnswers = new QcrAnswers();
                                if (eQues.question.trim() == "Family Definition") {
                                    const ans = element.coverageTypeName
                                    qcrAnswers.answer.push(ans.toString());
                                }
                                else {
                                    qcrAnswers.answer = this.getAnswer(eQues);
                                }

                                qcrAnswers.icType = "Broker" + optionIndex;
                                qcrAnswers.id = questId;
                                qcrAnswers.optionIndex = optionIndex

                                if (optionIndex == 1) {

                                    //Answer Broker Question
                                    this.qmodel.parentTabName = tempdata.parentTabName
                                    this.qmodel.question = eQues.question;
                                    this.qmodel.answer.push(qcrAnswers);
                                }
                                else {
                                    //Search in answer array and add answer
                                    this.questionAnswerList.filter(x => x.isHeader == false && x.question.trim() == eQues.question.trim() && x.subtabId == subtabId && x.gmcLabelForSubTabId == gmcLabelForSubTabId && x.questId == questId && x.parentTabName == this.qmodel.parentTabName)[0].answer.push(qcrAnswers)
                                }

                                if (optionIndex == 1) {
                                    this.questionAnswerList.push(this.qmodel);
                                }
                            });

                        }
                    });
                });
                // }

            });
        });
    }

    getAnswer(coveritemQuetions) {
        let text = ""
        if (coveritemQuetions.inputControl == 'dropdown') {

            let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
            if (ans != undefined) {
                return ans.answer == '' ? '--' : ans.answer
            }
            else {
                return '--'
            }


        } else if (coveritemQuetions.inputControl == 'multiselectdropdown') {
            if (coveritemQuetions.selectedAnswer != 0) {

                if (Array.isArray(coveritemQuetions.selectedAnswer)) {
                    const answersString = coveritemQuetions.selectedAnswer
                        .map((item) => item.answer) // Extract `answer` property
                        .filter((answer) => answer) // Remove undefined or empty values
                        .join(", "); // Join with commas
                    console.log("selectedAnswer is an array");
                    return answersString;
                } else {
                    console.log("selectedAnswer is not an array");
                    return "-"
                }


            }
            else {
                return "-"
            }



        }
        else {
            return coveritemQuetions.selectedAnswer == '' || coveritemQuetions.selectedAnswer.length == 0 ? '--' : coveritemQuetions.selectedAnswer
        }
    }
    showDialog() {
        const ref = this.dialogService.open(RejectQuoteDialogComponent, {
            header: "Reject Quote",
            styleClass: 'customPopup',
            width: '450px',
            data: {
                quoteId: this.quote._id,
                quote: this.quote
            }
        })

        ref.onClose.subscribe((data) => {
            this.quoteService.refresh();
        });
    }


    ngOnInit(): void {
        // this.getQuoteOptions()
        // this.quote.mappedIcNames.map((val) => {
        //     // this.dropdownName.push({ name: val.name })
        //     if (!val.brokerAutoFlowStatus) { // Check if brokerAutoFlowStatus is false
        //         this.dropdownName.push({ name: val.name });
        //     }
        // })

        if (this.quote?.productId['productTemplate'] == AllowedProductTemplate.GMC) {
            // this.dropdownName.push({ name: "Expired Term" })
            // this.showPrintPdfOptions = true;
            this.showPrintPdfOptions = true;
        }
    }

    visible() {
        this.visibleSidebar = true
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
        this.currentPropertyQuoteOption.unsubscribe();

        // location.reload();
    }
    createQuoteOptionsDialog() {
        // if (!this.isInsurerSelected) {
        //     this.messageService.add({
        //         severity: "error",
        //         summary: "Fail",
        //         detail: "Select Insurrer",
        //         life: 3000
        //     });
        //     return;
        // }
        const ref = this.dialogService.open(LiabilityOptionsDialogComponent, {
            header: "Create Options",
            data: {
                quote_id: this.quoteId,
                clientId: this.quote.clientId,
                quote: this.quote,
            },
            width: "50vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            this.getOptionsLiability()
            this.loadQuoteDetails(this.quote._id);
        })
    }

    downloadPdf() {
        const element = document.getElementById('execeltbl'); // Replace 'execeltbl' with your table's ID
        if (!element) {
            console.error(`Element with id "execeltbl" not found.`);
            return;
        }

        // Add the class to make the table visible for export
        element.classList.add('visible-for-export');
        this.showTableForExcel = true;

        const margin = 10; // Margin for the PDF (in mm)
        const headerHeight = 15; // Height reserved for the header (in mm)
        const headerText = 'GMC Review Report'; // Text for the header

        // Ensure the table is visible before exporting
        setTimeout(() => {
            html2canvas(element, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png'); // Convert canvas to Data URL in PNG format
                const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize jsPDF

                const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2; // Width with margins
                const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2 - headerHeight; // Height with top and bottom margins and header

                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                // Calculate height for PDF while maintaining aspect ratio
                const imgPDFHeight = (imgHeight * pdfWidth) / imgWidth;

                let position = 0; // Initialize position to track where to start each slice
                const pageHeightInCanvas = (pdfHeight * imgWidth) / pdfWidth; // Height of one PDF page in canvas scale

                // Loop over the image height to create pages
                while (position < imgHeight) {
                    const canvasPage = document.createElement('canvas'); // Create a temporary canvas for each page
                    const context = canvasPage.getContext('2d');

                    canvasPage.width = imgWidth;
                    canvasPage.height = pageHeightInCanvas; // Height per page (scaled to canvas)

                    // Draw the portion of the image corresponding to this page
                    context.drawImage(
                        canvas, // Source canvas
                        0, position, // Start at (x=0, y=position)
                        imgWidth, pageHeightInCanvas, // Dimensions to crop
                        0, 0, // Place at (x=0, y=0) in new canvas
                        imgWidth, pageHeightInCanvas // Dimensions in the new canvas
                    );

                    const pageImgData = canvasPage.toDataURL('image/png'); // Convert page canvas to PNG

                    const pdfHeightForPage = (pageHeightInCanvas * pdfWidth) / imgWidth; // Height in PDF units

                    // Add header text before the image on each page
                    pdf.setFontSize(12);
                    pdf.text(headerText, margin, margin + 5); // Position the header text

                    // Add the image to the PDF with margins and below the header
                    pdf.addImage(pageImgData, 'PNG', margin, margin + headerHeight, pdfWidth, pdfHeightForPage);

                    position += pageHeightInCanvas; // Move position to the next portion of the image

                    // Add a new page if there's more content to render
                    if (position < imgHeight) {
                        pdf.addPage();
                    }
                }

                pdf.save('GMC_Review.pdf'); // Save the PDF

                // Remove the class after exporting
                element.classList.remove('visible-for-export');
                this.showTableForExcel = false;
            }).catch(error => {
                console.error("Error generating PDF:", error);
            });
        }, 100); // Adjust the delay as needed (100 milliseconds = 0.1 second)
    }



    downloadExcelGMC(): void {
        const table = document.getElementById("execeltbl");
        if (!table) {
            console.error(`Table with id "execeltbl" not found.`);
            return;
        }

        // Add the class to make the table visible
        table.classList.add("visible-for-export");

        this.showTableForExcel = true;
        // Add a delay to ensure the table is visible before exporting
        setTimeout(() => {
            this.exportTableToExcel("execeltbl", "GMC_QCRExcel.xlsx");
            // Remove the class after exporting
            table.classList.remove("visible-for-export");
            this.showTableForExcel = false;
        }, 100); // Adjust the delay as needed (1000 milliseconds = 1 second)
        //this.exportTableToExcel("execeltbl", "GMC_QCRExcel.xlsx");
        //this.showTableForExcel = false;
    }


    exportTableToExcel(tableId: string, fileName: string = 'excel_file.xlsx'): void {
        const table = document.getElementById(tableId);
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
        // Apply formatting and adjust column widths
        this.applyFormattingAndAdjustWidths(worksheet, table);

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, fileName);
    }
    private applyFormattingAndAdjustWidths(worksheet: XLSX.WorkSheet, table: HTMLElement): void {
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const colWidths: number[] = new Array(range.e.c - range.s.c + 1).fill(10);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (!cell) continue;

                const htmlCell = table.querySelector(`tr:nth-child(${R + 1}) td:nth-child(${C + 1})`) as HTMLElement;
                if (!htmlCell) continue;

                const cellValue = String(cell.v);
                colWidths[C] = Math.max(colWidths[C], cellValue.length);

                // Extract and apply styles
                const styles = this.getCellStyles(htmlCell);
                cell.s = styles;
            }
        }
        worksheet['!cols'] = colWidths.map(w => ({ wch: w + 2 }));
    }

    private getCellStyles(htmlCell: HTMLElement): any {
        const styles = window.getComputedStyle(htmlCell);
        return {
            fill: {
                fgColor: { rgb: this.rgbToHex(styles.backgroundColor) }
            },
            font: {
                name: 'Arial',
                sz: 12,
                bold: styles.fontWeight === 'bold',
                color: { rgb: this.rgbToHex(styles.color) }
            },
            alignment: {
                horizontal: styles.textAlign as any,
                vertical: 'center'
            },
            border: this.getBorderStyles(styles)
        };
    }

    private getBorderStyles(styles: CSSStyleDeclaration): any {
        const borders = ['top', 'bottom', 'left', 'right'];
        const borderStyles: any = {};
        borders.forEach(border => {
            const style = styles[`border${border.charAt(0).toUpperCase() + border.slice(1)}Style`];
            const width = styles[`border${border.charAt(0).toUpperCase() + border.slice(1)}Width`];
            const color = styles[`border${border.charAt(0).toUpperCase() + border.slice(1)}Color`];
            if (style !== 'none') {
                borderStyles[border] = { style: this.borderStyleMap(style), color: { rgb: this.rgbToHex(color) } };
            }
        });
        return borderStyles;
    }

    private borderStyleMap(style: string): string {
        const styleMap: { [key: string]: string } = {
            'solid': 'thin',
            'dotted': 'dotted',
            'dashed': 'dashed',
            // Add more mappings as needed
        };
        return styleMap[style] || 'thin';
    }
    private rgbToHex(rgb: string): string {
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
        return result ? `FF${this.toHex(result[1])}${this.toHex(result[2])}${this.toHex(result[3])}` : 'FFFFFFFF';
    }

    private toHex(value: string): string {
        return ('0' + parseInt(value, 10).toString(16)).slice(-2).toUpperCase();
    }

    loadQuoteDetails(qoute_id) {
        this.quoteService.get(qoute_id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quote = dto.data.entity;
                this.quoteService.setQuote(dto.data.entity);
                //this.getEmployeesDemographySummary()
            },
            error: e => {
                console.log(e);
            }
        });
    }
    // Handle Tabs --------------------------------------------------------------------------------------

    tabs: MenuItem[] = [];
    tabIndex: number
    loadTabs(quote: IQuoteSlip) {
        const product: IProduct = quote.productId as IProduct;

        const role: IRole = this.user.roleId as IRole;
        // if (this.quote.partnerId['brokerModeStatus'] == true) {
        //     if (AllowedRoles.BROKER_CREATOR_AND_APPROVER || AllowedRoles.SALES_CREATOR_AND_APPROVER || AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER || AllowedRoles.PLACEMENT_APPROVER == role?.name) {
        //         this.showEditOption = false;
        //         console.log("rrrrrrrrrrrrrrrrrrenetr")
        //     }
        // }
        if (AllowedRoles.INSURER_RM == role?.name) {
            this.showEditOption = false;
        }
        else {
            let productTemplate = product?.productTemplate;
            if (productTemplate == AllowedProductTemplate.GMC
                || productTemplate == AllowedProductTemplate.LIABILITY_EANDO
                || productTemplate == AllowedProductTemplate.LIABILITY
                || productTemplate == AllowedProductTemplate.LIABILITY_CGL
                || productTemplate == AllowedProductTemplate.LIABILITY_PRODUCT
                || productTemplate == AllowedProductTemplate.LIABILITY_CYBER
                || productTemplate == AllowedProductTemplate.LIABILITY_CRIME
                || productTemplate == AllowedProductTemplate.LIABILITY_PUBLIC
                || productTemplate == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                this.showEditOption = true;

            }
            else {
                this.showEditOption = false;

            }


            if (productTemplate == AllowedProductTemplate.GMC) {
                this.showPrintPdfOptions = true;
            } else {

            } this.showPrintPdfOptions = false;
        }


        function getTabsForBlus(isFlexashow: boolean, options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role?.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command },)
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command },)
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command },)
                    if (isFlexashow) {
                        tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command },)
                    }
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }

                    // tabs.push({ label: 'Business Suraksha Covers', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-business-suraksha-covers', command: options.command },)
                    tabs.push({ label: 'Risk Inspection Status', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-claim-experience-tab', command: options.command },)

                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command },)
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command },)
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command },)
                    if (isFlexashow) {
                        tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command },)
                    }
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }

                    // tabs.push({ label: 'Business Suraksha Covers', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-business-suraksha-covers', command: options.command },)
                    tabs.push({ label: 'Risk Inspection Status', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: options.command },)
                    tabs.push({ label: 'Decision Matrix', /* routerLinkActiveOptions: { isMultilocation: true }, */ fragment: 'app-quote-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)

                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    tabs.push({ label: 'Risk Header Letter', fragment: 'app-quote-insurer-review-risk-cover-letter-tab', command: options.command })
                    break;
                // Broker Module
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    // case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command },)
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command },)
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command },)
                    if (isFlexashow) {
                        tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command },)
                    }
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }
                    // tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    // tabs.push({ label: 'Business Suraksha Covers', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-business-suraksha-covers', command: options.command },)
                    tabs.push({ label: 'Risk Inspection Status', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: options.command },)
                    tabs.push({ label: 'Decision Matrix', /* routerLinkActiveOptions: { isMultilocation: true }, */ fragment: 'app-quote-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)

                    break;
            }
            return tabs
        }
        function getTabsForFire(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command })
                    tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command })
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }
                    tabs.push({ label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command })
                    tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command })
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }
                    tabs.push({ label: 'Risk Inspection Status', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: options.command },)
                    tabs.push({ label: 'Decision Matrix', /* routerLinkActiveOptions: { isMultilocation: true }, */ fragment: 'app-quote-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)

                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    tabs.push({ label: 'Risk Header Letter', fragment: 'app-quote-insurer-review-risk-cover-letter-tab', command: options.command })
                    break;
                // Broker Module
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    // case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command })
                    tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command })
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }
                    tabs.push({ label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command })
                    tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: options.command },)
                    tabs.push({ label: 'Decision Matrix', /* routerLinkActiveOptions: { isMultilocation: true }, */ fragment: 'app-quote-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)

                    break;
            }
            return tabs
        }
        function getTabsForIar(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command })
                    tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command })
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }
                    //tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    tabs.push({ label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command })
                    tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command })
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }
                    //tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    tabs.push({ label: 'Risk Inspection Status', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-claim-experience-tab', command: options.command },)
                    tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: options.command },)
                    tabs.push({ label: 'Decision Matrix', /* routerLinkActiveOptions: { isMultilocation: true }, */ fragment: 'app-quote-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)

                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    tabs.push({ label: 'Risk Header Letter', fragment: 'app-quote-insurer-review-risk-cover-letter-tab', command: options.command })
                    break;
                // Broker Module
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    // case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-quote-insurer-review-basic-details-tab', command: options.command })
                    tabs.push({ label: 'Documents Uploaded', fragment: 'app-quote-insurer-review-documents-uploaded-tab', command: options.command })
                    tabs.push({ label: 'Sum Insured Details', fragment: 'app-quote-location-breakup', command: options.command },)
                    if (product.shortName == "EAR" || product.shortName == "CAR") {
                        tabs.push({ label: "Installment", fragment: "app-installment-tab", command: options.command })
                    }
                    tabs.push({ label: 'Multilocation Annexure', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-multilocation-annexure-tab', command: options.command })
                    tabs.push({ label: "Add On's", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-addon-tab', command: options.command })
                    if (product.shortName == "BLUSP" || product.shortName == "BSUSP" || product.shortName == "BGRP") {
                        tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    }
                    //tabs.push({ label: 'Risk Management Features', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-risk-management-features-tab', command: options.command })
                    tabs.push({ label: 'Risk Inspection Status & Claim Experience', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-edit-steps-risk-inspection-claim-experience-tab', command: options.command })
                    tabs.push({ label: 'Warranties, Exclusions & Subjectives', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-quote-insurer-review-warrenties-exclusions-subjectives-tab', command: options.command },)
                    tabs.push({ label: 'Decision Matrix', /* routerLinkActiveOptions: { isMultilocation: true }, */ fragment: 'app-quote-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command },)

                    break;
            }
            return tabs
        }

        function getTabsForGmc(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-gmc-basic-details', command: options.command })
                    tabs.push({
                        label: 'Employee Demographic Details', fragment: 'app-gmc-employee-details', command: options.command
                    })
                    tabs.push({ label: 'Family Composition', fragment: 'app-gmc-family-composition', command: options.command })
                    tabs.push({ label: 'Standard Coverages', fragment: 'app-gmc-coverages', command: options.command })
                    tabs.push({ label: 'Enhanced Covers', fragment: 'app-gmc-enhanced-covers', command: options.command })
                    tabs.push({ label: "Maternity Benifits", fragment: 'app-gmc-maternity-benifits', command: options.command })
                    tabs.push({ label: 'Other Restrictions', fragment: 'app-gmc-cost-containment', command: options.command })
                    if (quote.quoteType != 'new') {
                        tabs.push({ label: 'Claim Analytics', fragment: 'app-gmc-claim-analytics', command: options.command })
                        tabs.push({ label: 'Final Rater', fragment: 'app-gmc-final-rater', command: options.command })
                    }
                    tabs.push({ label: 'Other Details', fragment: 'app-gmc-other-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-gmc-basic-details', command: options.command })
                    tabs.push({ label: 'Employee Demographic Details', fragment: 'app-gmc-employee-details', command: options.command })
                    tabs.push({ label: 'Family Composition', fragment: 'app-gmc-family-composition', command: options.command })
                    tabs.push({ label: 'Standard Coverages', fragment: 'app-gmc-coverages', command: options.command })
                    tabs.push({ label: 'Enhanced Covers', fragment: 'app-gmc-enhanced-covers', command: options.command })
                    tabs.push({ label: "Maternity Benifits", fragment: 'app-gmc-maternity-benifits', command: options.command })
                    tabs.push({ label: 'Other Restrictions', fragment: 'app-gmc-cost-containment', command: options.command })
                    if (quote.quoteType != 'new') {
                        tabs.push({ label: 'Claim Analytics', fragment: 'app-gmc-claim-analytics', command: options.command })
                        tabs.push({ label: 'Final Rater', fragment: 'app-gmc-final-rater', command: options.command })
                    }
                    tabs.push({ label: 'Other Details', fragment: 'app-gmc-other-details', command: options.command })

                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-gmc-basic-details', command: options.command })
                    tabs.push({ label: 'Employee Details', fragment: 'app-gmc-employee-details', command: ($event) => this.activateTab($event.index, this.tabs) })
                    tabs.push({ label: 'Family Composition', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-family-composition', command: options.command })
                    tabs.push({ label: 'Standard Coverages', fragment: 'app-gmc-coverages', command: options.command })
                    tabs.push({ label: 'Enhanced Covers', fragment: 'app-gmc-enhanced-covers', command: options.command })

                    tabs.push({ label: "Maternity Benifits", routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-maternity-benifits', command: options.command })
                    tabs.push({ label: 'Other Restrictions', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-cost-containment', command: options.command })
                    if (quote.quoteType != 'new') {
                        tabs.push({ label: 'Claim Analytics', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-claim-analytics', command: options.command })
                        tabs.push({ label: 'Final Rater', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-final-rater', command: options.command })
                    }
                    tabs.push({ label: 'Other Details', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-other-details', command: options.command })
                    tabs.push({ label: 'Other Details', routerLinkActiveOptions: { isMultilocation: true }, fragment: 'app-gmc-other-product', command: options.command })

                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                // Broker Module
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:

                    if (quote.productId["type"].toLowerCase() === "group health policy") {
                        tabs.push({ label: 'Basic Details', fragment: 'app-gmc-basic-details', command: options.command })
                        tabs.push({ label: 'Employee Demographic Details', fragment: 'app-gmc-employee-details', command: options.command })
                        tabs.push({ label: 'Family Composition', fragment: 'app-gmc-family-composition', command: options.command })
                        tabs.push({ label: 'Standard Coverages', fragment: 'app-gmc-coverages', command: options.command })
                        tabs.push({ label: 'Enhanced Covers', fragment: 'app-gmc-enhanced-covers', command: options.command })
                        tabs.push({ label: "Maternity Benifits", fragment: 'app-gmc-maternity-benifits', command: options.command })
                        tabs.push({ label: 'Other Restrictions', fragment: 'app-gmc-cost-containment', command: options.command })
                        tabs.push({ label: 'Other Details', fragment: 'app-gmc-other-details', command: options.command })
                    }

                    else if (quote.productId["type"].toLowerCase() === "group health policy top up") {
                        tabs.push({ label: 'Basic Details', fragment: 'app-gmc-basic-details', command: options.command })
                        tabs.push({ label: 'Employee Demographic Details', fragment: 'app-gmc-employee-details', command: options.command })
                        tabs.push({ label: 'Family Composition', fragment: 'app-gmc-family-composition', command: options.command })
                        tabs.push({ label: 'Standard Coverages', fragment: 'app-gmc-coverages', command: options.command })
                       // tabs.push({ label: 'Enhanced Covers', fragment: 'app-gmc-enhanced-covers', command: options.command })
                        tabs.push({ label: 'Other Restrictions', fragment: 'app-gmc-cost-containment', command: options.command })
                        tabs.push({ label: 'Other Details', fragment: 'app-gmc-other-details', command: options.command })
                    }
                    else{
                        tabs.push({ label: 'Basic Details', fragment: 'app-gmc-basic-details', command: options.command })
                        tabs.push({ label: 'Employee Demographic Details', fragment: 'app-gmc-employee-details', command: options.command })
                        tabs.push({ label: 'Family Composition', fragment: 'app-gmc-family-composition', command: options.command })
                        tabs.push({ label: 'Standard Coverages', fragment: 'app-gmc-coverages', command: options.command })
                        tabs.push({ label: 'Enhanced Covers', fragment: 'app-gmc-enhanced-covers', command: options.command })
                        tabs.push({ label: 'Other Details', fragment: 'app-gmc-other-details', command: options.command })

                    }
                    
                    if (quote.quoteType != 'new') {
                        tabs.push({ label: 'Claim Analytics', fragment: 'app-gmc-claim-analytics', command: options.command })
                        tabs.push({ label: 'Final Rater', fragment: 'app-gmc-final-rater', command: options.command })
                    }

                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
            }
            return tabs
        }

        function getTabsForWC(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Employee Details', fragment: 'app-wc-employee-details', command: options.command })
                    tabs.push({ label: 'Coverages Details', fragment: 'app-wc-coverage-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-wc-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Employee Details', fragment: 'app-wc-employee-details', command: options.command })
                    tabs.push({ label: 'Coverages Details', fragment: 'app-wc-coverage-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-wc-territory-details', command: options.command })
                    tabs.push({ label: 'Deductibles and Claim Experience', fragment: 'app-liability-wc-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-wc-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Employee Details', fragment: 'app-wc-employee-details', command: options.command })
                    tabs.push({ label: 'Coverages Details', fragment: 'app-wc-coverage-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-wc-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                // Broker Module
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    // case AllowedRoles.BROKER_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Employee Details', fragment: 'app-wc-employee-details', command: options.command })
                    tabs.push({ label: 'Coverages Details', fragment: 'app-wc-coverage-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-wc-territory-details', command: options.command })
                    tabs.push({ label: 'Deductibles and Claim Experience', fragment: 'app-liability-wc-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-wc-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
            }
            return tabs
        }

        function getTabsForLiability(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })

                    //tabs.push({ label: 'Revenue Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-liability-deductibles-details', command: options.command })
                    // tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles and Claim Experience', fragment: 'app-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })

                    tabs.push({ label: 'Revenue Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles and Claim Experience', fragment: 'app-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
            }
            return tabs
        }

        function getTabsForCrimeLiability(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles & Claim Experience', fragment: 'app-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles & Claim Experience', fragment: 'app-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles & Claim Experience', fragment: 'app-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details', fragment: 'app-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles & Claim Experience', fragment: 'app-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
            }
            return tabs
        }


        function getTabsForEandOLiability(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-eando-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-eando-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Revenue Details', fragment: 'app-eando-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-eando-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-eando-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-eando-liability-teritory-details', command: options.command })
                    //tabs.push({ label: 'Revenue Details', fragment: 'app-eando-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-eando-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-eando-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-eando-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-eando-liability-teritory-details', command: options.command })
                    tabs.push({ label: 'Revenue Details', fragment: 'app-eando-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-eando-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-eando-liability-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-eando-liability-teritory-details', command: options.command })
                    //tabs.push({ label: 'Revenue Details', fragment: 'app-eando-liability-revenue-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-eando-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-eando-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
            }
            return tabs
        }


        function getTabsForCGLLiability(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Claim Experience & Turnover Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-cgl-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Deductibles & Claim Experience', fragment: 'app-liability-cgl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-cgl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Claim Experience & Turnover Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Deductibles', fragment: 'app-cgl-liability-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory & Subsidiary Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Breakup Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Deductibles & Claim Experience', fragment: 'app-liability-cgl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-cgl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
            }
            return tabs
        }

        function getTabsForPublicLiability(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Turnover Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Turnover Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-cgl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Turnover Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    tabs.push({ label: 'Basic Details', fragment: 'app-liability-cgl-basic-details', command: options.command })
                    tabs.push({ label: 'Territory Details', fragment: 'app-liability-cgl-teritory-details', command: options.command })
                    tabs.push({ label: 'Turnover Details', fragment: 'app-liability-cgl-claim-experience-turnover-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-cgl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
            }
            return tabs
        }

        function getTabsForProductLiability(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    tabs.push({ label: "Turnover Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    tabs.push({ label: "Turnover Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-pl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    tabs.push({ label: "Turnover Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    tabs.push({ label: "Turnover Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-pl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
            }
            return tabs
        }

        function getTabsForCyberLiability(options: { command: ($event) => void }): MenuItem[] {
            const tabs: MenuItem[] = [];
            switch (role.name) {
                case AllowedRoles.INSURER_RM:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    //tabs.push({ label: "Breakup Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.INSURER_UNDERWRITER:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    //tabs.push({ label: "Breakup Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-pl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
                case AllowedRoles.OPERATIONS:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    //tabs.push({ label: "Breakup Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })

                    break;
                case AllowedRoles.PLACEMENT_APPROVER:
                case AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER:
                    tabs.push({ label: "Basic Details", fragment: 'app-liability-pl-basic-details', command: options.command })
                    tabs.push({ label: "Territory & Subsidiary Details", fragment: 'app-liability-pl-teritory-details', command: options.command })
                    //tabs.push({ label: "Breakup Details", fragment: 'app-liability-pl-turnover-details', command: options.command })
                    tabs.push({ label: "Deductibles & Claim Experience", fragment: 'app-liability-pl-deductibles-details', command: options.command })
                    tabs.push({ label: 'Exclusion & Subjectivity', fragment: 'app-liability-pl-exclusion-details', command: options.command })
                    //tabs.push({ label: 'Decision Matrix', fragment: 'app-liability-insurer-review-decision-matrix-tab', command: options.command },)
                    tabs.push({ label: 'Preview & Download', fragment: 'app-quote-insurer-review-preview-download-tab', command: options.command })
                    break;
            }
            return tabs
        }


        this.tabs = []
        switch (product?.productTemplate) {
            case AllowedProductTemplate.BLUS:
                this.tabs = getTabsForBlus(product.isFlexaShow, {
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.FIRE:
                this.tabs = getTabsForFire({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.IAR:
                this.tabs = getTabsForIar({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.GMC:
                this.tabs = getTabsForGmc({
                    command: ($event) => this.activateTab($event.index)
                });
                break;

            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                this.tabs = getTabsForWC({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.LIABILITY:
                this.tabs = getTabsForLiability({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.LIABILITY_EANDO:
                this.tabs = getTabsForEandOLiability({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.LIABILITY_CGL:
                this.tabs = getTabsForCGLLiability({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.LIABILITY_PRODUCT:
                this.tabs = getTabsForProductLiability({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.LIABILITY_CYBER:
                this.tabs = getTabsForCyberLiability({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.LIABILITY_PUBLIC:
                this.tabs = getTabsForPublicLiability({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            case AllowedProductTemplate.LIABILITY_CRIME:
                this.tabs = getTabsForCrimeLiability({
                    command: ($event) => this.activateTab($event.index)
                });
                break;
            default:
                this.tabs = []
        }

        if (this.activatedRoute.snapshot.queryParams.tab < 1 || this.activatedRoute.snapshot.queryParams.tab > this.tabs?.length) {
            this.router.navigate([], { queryParams: {} });
        }
        this.tabIndex = (this.activatedRoute.snapshot.queryParams.tab ?? 1) - 1;

    }

    checkAndNavigate(quote: IQuoteSlip) {

        if (quote) {

            const role = this.user.roleId as IRole

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
                        AllowedQuoteStates.UNDERWRITTER_REVIEW,
                        AllowedQuoteStates.REJECTED
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


    activateTab(index: number) {
        this.router.navigate([], {

            queryParams: {
                ...this.activatedRoute.snapshot.queryParams,
                ...{ tab: index + 1, }
            }

        });

        this.tabIndex = index
    }

    get isNext() {
        return this.tabIndex < this.tabs.length - 1
    }
    get isPrev() {
        return this.tabIndex > 0
    }

    editQuoteOptionsDialog(tabIndexFragment: any) {
        if (!this.selectedOptions) {
            this.messageService.add({
                severity: "error",
                summary: "Fail",
                detail: "Select option for editing",
                life: 3000
            });
            return;
        }

        this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                this.quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                const template = this.quoteOptionsLst.filter(x => x._id == this.selectedOptions.value)[0]
                this.loadSelectedOption(template)
                this.loadOptionsData(this.quoteOptionsLst)
                switch (tabIndexFragment) {
                    case 'app-gmc-family-composition':
                        const ref1 = this.dialogService.open(FamilyCompositionTabComponent, {
                            header: "Family Composition",
                            width: "50vw",
                            styleClass: "customPopup"
                        }).onClose.subscribe(() => {
                            this.loadQuote(this.quote._id, '')
                        })
                        break;
                    case 'app-gmc-coverages':
                        const ref = this.dialogService.open(GmcCoveregesTabComponent, {
                            header: "Covereges",
                            width: "50vw",
                            styleClass: "customPopup"
                        }).onClose.subscribe(() => {
                            //this.router.navigateByUrl(`/`);
                            this.loadQuote(this.quote._id, '')
                        })
                        break;
                    case "app-gmc-maternity-benifits":
                        const ref2 = this.dialogService.open(MaternityBenifitsTabComponent, {
                            header: "Maternity Benifits",
                            width: "50vw",
                            styleClass: "customPopup"
                        }).onClose.subscribe(() => {
                            this.loadQuote(this.quote._id, '')
                        })
                        break;
                    case "app-gmc-enhanced-covers":
                        const ref23 = this.dialogService.open(GmcEnhancedCoversTabComponent, {
                            header: "Enhanced Benifits",
                            width: "50vw",
                            styleClass: "customPopup"
                        }).onClose.subscribe(() => {
                            this.loadQuote(this.quote._id, '')
                        })
                        break;
                    case 'app-gmc-cost-containment':
                        const ref3 = this.dialogService.open(CostContainmentTabComponent, {
                            header: "Other Restrictions",
                            width: "50vw",
                            styleClass: "customPopup"
                        }).onClose.subscribe(() => {
                            this.loadQuote(this.quote._id, '')
                        })
                        break;
                    case 'app-gmc-other-details':
                        const ref4 = this.dialogService.open(GmcOtherdetailsTabComponent, {
                            header: "Other Details",
                            width: "50vw",
                            styleClass: "customPopup"
                        }).onClose.subscribe(() => {
                            this.loadQuote(this.quote._id, '')
                        })
                        break;
                    case 'app-gmc-final-rater':
                        const ref6 = this.dialogService.open(FinalRaterTabComponent, {
                            header: "Final Rater",
                            width: "50vw",
                            styleClass: "customPopup"
                        }).onClose.subscribe(() => {
                            this.loadQuote(this.quote._id, '')
                        })
                        break;
                }
            },
            error: e => {
                console.log(e);
            }
        });

    }
    loadOptionsData(quoteOption: any[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }

    loadSelectedOption(quoteOption: any, optionChangedManual: boolean = false) {
        switch (this.quote.productId?.['productTemplate']) {
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                this.quote.wcTemplateDataId = quoteOption._id;
                break;
            case AllowedProductTemplate.LIABILITY:
            case AllowedProductTemplate.LIABILITY_CRIME:
                this.quote.liabilityTemplateDataId = quoteOption._id;
                break;
            case AllowedProductTemplate.LIABILITY_EANDO:
                this.quote.liabilityEandOTemplateDataId = quoteOption._id;
                break;
            case AllowedProductTemplate.LIABILITY_CGL:
            case AllowedProductTemplate.LIABILITY_PUBLIC:
                this.quote.liabilityCGLTemplateDataId = quoteOption._id;
                break;
            case AllowedProductTemplate.LIABILITY_PRODUCT:
            case AllowedProductTemplate.LIABILITY_CYBER:
                this.quote.liabilityProductTemplateDataId = quoteOption._id;
                break;
        }
        let payloadQuote = this.quote;
        this.quoteService.updateUWSlip(payloadQuote).subscribe({
            next: (quote: any) => {
                this.totalPremium = this.getPremiumValueByOption(quoteOption)
                this.quoteService.setSelectedOptions(quoteOption)
                if (optionChangedManual) {
                    this.quoteService.refresh();
                }
            },
            error: error => {
                console.log(error);
            }
        });
    }


    sendForApproval() {
        this.quoteService.sendQuoteToUnderwritterApproval(this.quote._id).subscribe({
            next: quote => {
                // this.quoteService.refresh((quote) => {
                const refByRM = this.dialogService.open(QuoteSentToUnderwritterByRmDialogComponent, {
                    header: '',
                    width: '500px',
                    styleClass: 'flatPopup'
                })
                refByRM.onClose.subscribe(() => {
                    this.router.navigateByUrl(`/`);
                })
            },
            error: error => {
                console.log(error);
            }
        });
    }

    proceedFuther() {
        let decisionSelected = true;
        if (this.quote.productId['productTemplate'] === AllowedProductTemplate.GMC) {
            this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                    let template = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                    if (template.some(x => x.isAccepted == "")) {
                        this.messageService.add({
                            severity: "error",
                            summary: "Fail",
                            detail: "Select Decision for each option",
                            life: 3000
                        });
                        decisionSelected = false;
                    }
                    // else if(template.some(x => x.calculatedPremium == 0)){
                    //     this.messageService.add({
                    //         severity: "error",
                    //         summary: "Fail",
                    //         detail: "Calculated premium is 0",
                    //         life: 3000
                    //     });
                    //     decisionSelected = false;
                    // }
                    if (decisionSelected) {
                        this.quoteService.sendQuoteForComparisonReview(this.quote._id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Success",
                                    detail: "Quote sent for QCR",
                                    life: 3000
                                });
                                // this.quoteService.setQuote(dto.data.entity);

                                this.quoteService.refresh((quote) => {
                                    switch (quote?.quoteState) {
                                        case AllowedQuoteStates.UNDERWRITTER_REVIEW:

                                            // const refByUnderwriter = this.dialogService.open(QuoteSentToNextUnderwriterDialogComponent, {
                                            //     header: '',
                                            //     width: '500px',
                                            //     styleClass: 'flatPopup'
                                            // })
                                            // refByUnderwriter.onClose.subscribe(() => {
                                            //     if (this.user.partnerId["brokerModeStatus"] == true) {
                                            //         this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                            //     } else {
                                            //         this.router.navigateByUrl(`/`); 0
                                            //     }
                                            // })


                                            break;

                                        case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:

                                            if (this.user.partnerId["brokerModeStatus"] == true) {
                                                this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                            } else {
                                                this.router.navigateByUrl(`/`);
                                            }
                                            // const ref1 = this.dialogService.open(QouteSentForQcrDialogComponent, {
                                            //     header: '',
                                            //     width: '500px',
                                            //     styleClass: 'flatPopup',
                                            //     data: {
                                            //         quote: quote,
                                            //     }
                                            // })

                                            // ref1.onClose.subscribe(() => {
                                            //     this.router.navigateByUrl(`/`);

                                            // })
                                            // ref1.onClose.subscribe(() => {
                                            //     if (this.user.partnerId["brokerModeStatus"] == true) {
                                            //         this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                            //     } else {
                                            //         this.router.navigateByUrl(`/`);
                                            //     }

                                            // })

                                            break;
                                    }
                                })
                                //   if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/broker/quotes/${this.quoteId}/sum-insured-details`);
                            }
                        })
                    }
                },
                error: e => {
                    console.log(e);
                }
            });
        }
        else if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CRIME
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CGL
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_EANDO
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PUBLIC
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.WORKMENSCOMPENSATION
            || this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_CYBER
        ) {
            this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                next: (dto: IOneResponseDto<any[]>) => {
                    let template = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
                    if (template.some(x => x.isAccepted == "")) {
                        this.messageService.add({
                            severity: "error",
                            summary: "Fail",
                            detail: "Select Decision for each option",
                            life: 3000
                        });
                        decisionSelected = false;
                    }
                    if (decisionSelected) {
                        this.quoteService.sendQuoteForComparisonReview(this.quote._id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                console.log(dto)
                                // this.quoteService.setQuote(dto.data.entity);
                                this.quoteService.refresh((quote) => {
                                    switch (quote?.quoteState) {
                                        case AllowedQuoteStates.UNDERWRITTER_REVIEW:
                                            // const refByUnderwriter = this.dialogService.open(QuoteSentToNextUnderwriterDialogComponent, {
                                            //     header: '',
                                            //     width: '500px',
                                            //     styleClass: 'flatPopup'
                                            // })
                                            // refByUnderwriter.onClose.subscribe(() => {
                                            //     if (this.user.partnerId["brokerModeStatus"] == true) {
                                            //         this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                            //     } else {
                                            //         this.router.navigateByUrl(`/`); 0
                                            //     }
                                            // })
                                            break;

                                        case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:
                                            if (this.user.partnerId["brokerModeStatus"] == true) {
                                                this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                            } else {
                                                this.router.navigateByUrl(`/`);
                                            }
                                            break;
                                    }

                                })
                            }
                        })
                    }
                },
                error: e => {
                    console.log(e);
                }
            });
        }
        else {
            const premium = this?.quoteOptionData?.premiumDetails?.premium
            const brokerage = this?.quoteOptionData?.premiumDetails?.premiumBrokerage
            if (this.quoteOptionData?.qcrVersion) {
                if (!premium || !brokerage) {
                    this.messageService.add({
                        severity: "warn",
                        summary: "Warning",
                        detail: "Premium and brokerage are required in the decision matrix",
                        life: 3000
                    });
                }
            }
            // else {
            this.quoteOptionService.getAllOptionsByQuoteId(this.quote._id).subscribe((res) => {
                const data = res.data.entities.map((ele) => ele.premiumDetails);
                if (data.includes(undefined) && (!this.quoteOptionData?.qcrVersion || !this.quoteOptionData?.hasOwnProperty('qcrVersion'))) {
                    this.messageService.add({
                        severity: "warn",
                        summary: "Warning",
                        detail: "Premium and brokerage are required in the decision matrix for all options",
                        life: 3000
                    });
                } else {
                    // New_Quote_option
                    const ref1 = this.dialogService.open(QuoteOptionListDialogComponent, {
                        header: "Select Quote Option",
                        width: "500px",
                        styleClass: "flatPopup",
                        data: {
                            quoteId: this.quote._id,
                            isMergeOption: false,
                            selectedICName: this.selectedICName,
                            isIcOptionList: true,
                        }
                    }).onClose.subscribe((res) => {
                        if (res?.length > 0) {
                            // Old_Quote
                            // this.quoteService.sendQuoteForComparisonReview(this.quote._id,).subscribe({

                            // New_Quote_option
                            const payload = { quoteOptionIds: res }
                            this.quoteOptionService.sendQuoteOptionForComparisonReview(this.quote._id, payload).subscribe({
                                next: (dto: IOneResponseDto<IQuoteOption>) => {

                                    this.quoteService.refresh((quote) => {
                                        switch (quote?.quoteState) {
                                            case AllowedQuoteStates.UNDERWRITTER_REVIEW:

                                                // const refByUnderwriter = this.dialogService.open(QuoteSentToNextUnderwriterDialogComponent, {
                                                //     header: '',
                                                //     width: '500px',
                                                //     styleClass: 'flatPopup'
                                                // })

                                                // refByUnderwriter.onClose.subscribe(() => {
                                                //     if (this.user.partnerId["brokerModeStatus"] == true) {
                                                //         this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)
                                                //     } else {
                                                //         this.router.navigateByUrl(`/`);
                                                //     }
                                                // })


                                                break;

                                            case AllowedQuoteStates.QCR_FROM_UNDERWRITTER:


                                                if (this.user.partnerId["brokerModeStatus"] == true) {
                                                    this.router.navigateByUrl(`/backend/quotes/${quote._id}/edit`)

                                                }
                                                if (!this.user.partnerId.hasOwnProperty('brokerModeStatus') || this.user.partnerId["brokerModeStatus"] == false) {

                                                    const ref1 = this.dialogService.open(QouteSentForQcrDialogComponent, {
                                                        header: '',
                                                        width: '500px',
                                                        styleClass: 'flatPopup'
                                                    })

                                                    ref1.onClose.subscribe(() => {
                                                        if (this.user.partnerId["brokerModeStatus"] == true) {
                                                            this.router.navigateByUrl(`/`);
                                                        }

                                                    })
                                                }

                                                break;
                                        }

                                    })


                                    //   if (this.quote.quoteNo) this.router.navigateByUrl(`/backend/broker/quotes/${this.quoteId}/sum-insured-details`);

                                }
                            })
                        } else {
                            this.messageService.add({
                                severity: "error",
                                summary: "Fail",
                                detail: "Select Quote Option For Proceed Further  ",
                                life: 3000
                            });
                        }
                    })
                }
            })
            // }
        }


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


    openExceedReason() {
        this.dialogService.open(OtcProductLimitExceededConfirmationDialogComponent, {
            header: IndicativePremiumCalcService.isLiabilityProduct(this.quote) ? `Confirmation Dialog` : `Following limits has been exceeded`,
            data: {
                quote: this.quote,
            },
            width: '650px',
            styleClass: "customPopup"
        }).onClose.subscribe((action: boolean) => {
            if (action) {
                this.router.navigateByUrl(this.appService.routes.quotes.requisitionReview(this.quote._id));
            }
        })
    }

    downloadExcel(): void {
        // Use this.quote.id instead of this.quoteId
        this.quoteService.downloadUnderWriterReviewExcel(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)

                }
            }
        });
    }
    // Broker Module
    showInsuranceCompanyDetails(val: any) {
        // console.log(this.selectedOption);
        // this.isInsurerSelected = true
        this.selectedICName = val.value['name'];
        let name = val.value['name']
        // let isLiabilityProduct = false
        // switch (this.quote.productId?.['productTemplate']) {
        //     case AllowedProductTemplate.WORKMENSCOMPENSATION:
        //         isLiabilityProduct = true
        //         break;
        //     case AllowedProductTemplate.LIABILITY:
        //     case AllowedProductTemplate.LIABILITY_CRIME:
        //         isLiabilityProduct = true
        //         break;
        //     case AllowedProductTemplate.LIABILITY_EANDO:
        //         isLiabilityProduct = true
        //         break;
        //     case AllowedProductTemplate.LIABILITY_CGL:
        //     case AllowedProductTemplate.LIABILITY_PUBLIC:
        //         isLiabilityProduct = true
        //         break;
        //     case AllowedProductTemplate.LIABILITY_PRODUCT:
        //     case AllowedProductTemplate.LIABILITY_CYBER:
        //         isLiabilityProduct = true
        //         break;
        // }
        // if (isLiabilityProduct) {
        //     let selectedOptions;
        //     this.quoteService.getQuoteByQuoteNo(this.quote.quoteNo).subscribe({
        //         next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //             var icId = null
        //             let quoteOptionId
        //             Object.keys(dto.data.entity).forEach(function (key, index) {
        //                 if (dto.data.entity[key].partnerId.name == name) {
        //                     icId = dto.data.entity[key]._id;
        //                 }
        //                 if (name == "Expired Term") {
        //                     if (dto.data.entity[key].parentQuoteId) {
        //                         icId = dto.data.entity[key]._id;                               
        //                     }
        //                 }
        //             })
        //             this.quoteService.getAllLiabilityQuoteOptions(icId).subscribe({
        //                 next: (recorddto: IOneResponseDto<any[]>) => {
        //                     let quoteOptionId;
        //                     this.quoteOptionsLst = recorddto.data.entity.filter(x => x.version == this.quote.qcrVersion)
        //                     quoteOptionId = this.quoteOptionsLst[0]._id
        //                     selectedOptions = this.quoteOptionsLst[0];
        //                     this.router.navigateByUrl(`/backend/quotes/${icId}/edit`)
        //                     this.loadOptionsData(this.quoteOptionsLst);
        //                     //this.quoteService.setSelectedOptions(this.quoteOptionsLst.filter(x => x.optionName == 'Option 1')[0])
        //                     //this.selectedQuoteOption = this.quoteOptionsLst.filter(x => x.optionName == 'Option 1')[0]._id;
        //                     this.loadSelectedOption(this.quoteOptionsLst.filter(x => x.optionName == 'Option 1')[0]);
        //                     this.loadQuoteDetails(this.quote._id)
        //                 },
        //                 error: e => {
        //                     console.log(e);
        //                 }
        //             });
        //         }
        //     })
        // } else {
        this.quoteService.getQuoteByQuoteNo(this.quote.quoteNo).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                let a: ILov[] = []
                var icId = null
                let quoteOptionId
                Object.keys(dto.data.entity).forEach(function (key, index) {
                    if (dto.data.entity[key].partnerId.name == name) {
                        icId = dto.data.entity[key]._id;
                        //if (dto.data.entity.productId['productTemplate'] != AllowedProductTemplate.GMC) {
                        // New_Quote_Option
                        quoteOptionId = dto.data.entity[key]?.quoteOption[0]?._id
                        //}
                    }
                    if (name == "Expired Term") {
                        if (dto.data.entity[key].parentQuoteId) {
                            icId = dto.data.entity[key]._id;
                            // if (dto.data.entity.productId['productTemplate'] != AllowedProductTemplate.GMC) {

                            // New_Quote_Option
                            quoteOptionId = dto.data.entity[key]?.quoteOption[0]?._id
                            //}
                        }
                    }
                })
                this.router.navigateByUrl(`/backend/quotes/${icId}/edit`)
                this.loadQuoteOption(quoteOptionId, null)
                this.loadQuote(icId, null)
                // setTimeout(() => {
                //     this.getQuoteOptions()
                // }, 3000);
            }
        })
        //}

    }

    // New_Quote_option
    getQuoteOptions() {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: this.activatedRoute.snapshot.params.quote_id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };
        this.quoteOptionService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IQuoteOption>) => {
                // this.allQuoteOptionDropdown = dto.data.entities
                //     .map(entity => ({ label: entity.quoteOption, value: entity._id }))
                // this.selectedQuoteOptionOfProperty = { label: dto.data.entities[0].quoteOption, value: dto.data.entities[0]._id }
                this.selectedQuoteOptionOfProperty = this.activatedRoute.snapshot.queryParams?.quoteOptionId
                const quoteOptionVersionData = dto.data.entities.filter(val => val.qcrVersion)
                this.allQuoteOptionDropdown = quoteOptionVersionData.length ?
                [{ label: quoteOptionVersionData[quoteOptionVersionData.length - 1].quoteOption, value: quoteOptionVersionData[quoteOptionVersionData.length - 1]._id }]
                : dto.data.entities
                .map(entity => ({ label: entity.expiredQuoteOption == true ? entity.quoteOption = "Expired Option" : entity.quoteOption, value: entity._id }))
                this.selectedQuoteOptionOfProperty = this.activatedRoute.snapshot.queryParams?.quoteOptionId
            },
            error: e => {
                console.log(e);
            }
        });
    }

    onChangeQuoteOption(quoteOptionId) {
        this.router.navigate([`/backend/quotes/${this.quote._id}/edit`], {
            queryParams: {
                ...this.activatedRoute.snapshot.queryParams,
                quoteOptionId: quoteOptionId,
                tab: 1
            }
        });
        this.loadQuoteOption(quoteOptionId)
    }


}
