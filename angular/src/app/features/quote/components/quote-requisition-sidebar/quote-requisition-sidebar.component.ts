import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AllowedAddonCoverCategory, OPTIONS_ADDON_COVER_CATEGORIES } from 'src/app/features/admin/addon-cover/addon-cover.model';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { QuoteLocationAddonService } from 'src/app/features/admin/quote-location-addon/quote-location-addon.service';
import { IMarineSIData, IMarineTemplate, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { EditInsuredDetailsDialogComponent } from 'src/app/features/broker/edit-insured-details-dialog/edit-insured-details-dialog.component';
import { ConditionalFreeAddOnsDialogComponent } from '../quote/add-on-covers-dialogs/conditional-free-add-ons-dialog/conditional-free-add-ons-dialog.component';
import { FlexaCoversDialogComponent } from '../quote/add-on-covers-dialogs/flexa-covers-dialog/flexa-covers-dialog.component';
import { SectorAvgFreeAddOnsDialogComponent } from '../quote/add-on-covers-dialogs/sector-avg-free-add-ons-dialog/sector-avg-free-add-ons-dialog.component';
import { SectorAvgPaidAddOnsDialogComponent } from '../quote/add-on-covers-dialogs/sector-avg-paid-add-ons-dialog/sector-avg-paid-add-ons-dialog.component';
import { LocationWiseCoversBreakDialogComponent } from '../quote/location-wise-covers-break-dialog/location-wise-covers-break-dialog.component';
import { RemoveAllowedProductBscCoverDialogComponent } from '../remove-allowed-product-bsc-cover-dialog/remove-allowed-product-bsc-cover-dialog.component';
import { Subscription } from 'rxjs';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { ClausesHeadsService } from 'src/app/features/admin/Marine/ClausesHeadsMaster/clausesHeads.service';
import { IClauses } from 'src/app/features/admin/Marine/ClausesMaster/clauses.model';
import { SidebarService } from './sidebar.service';
import { OPTIONS_BSC_COVER_RULES } from 'src/app/features/admin/bsc-cover/bsc-cover.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LiabilityAddoncoversDialogComponent } from '../quote/add-on-covers-dialogs/liability-addoncovers-dialog/liability-addoncovers-dialog.component';
import { LiabilityEandOAddoncoversDialogComponent } from '../quote/add-on-covers-dialogs/liability-eando-addoncovers-dialog/liability-eando-addoncovers-dialog.component';
import { LiabilityCGLAddoncoversDialogComponent } from '../quote/add-on-covers-dialogs/liability-cgl-addoncovers-dialog/liability-cgl-addoncovers-dialog.component';
import { LiabilityProductliabilityAddoncoversDialogComponent } from '../quote/add-on-covers-dialogs/liability-productliability-addoncovers-dialog/liability-productliability-addoncovers-dialog.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
import { LiabilityWorkmenAdOnCoverComponent } from '../quote/add-on-covers-dialogs/liability-workmen-addoncovers-dialog/liability-workmen-addoncovers-dialog.component';

@Component({
    selector: 'app-quote-requisition-sidebar',
    templateUrl: './quote-requisition-sidebar.component.html',
    styleUrls: ['./quote-requisition-sidebar.component.scss']
})
export class QuoteRequisitionSidebarComponent implements OnInit, OnChanges {

    @Input() quote: IQuoteSlip
    private currentQuote: Subscription;
    private currentQuoteOptions: Subscription;
    private currentSelectedTemplate: Subscription;
    private currentSelectedOptions: Subscription;
    quoteGmcOptionsLst: IQuoteGmcTemplate[];
    selectedQuoteTemplate: IQuoteGmcTemplate;
    coveredQuoteTemplate: IGMCTemplate[];
    notcoveredQuoteTemplate: IGMCTemplate[];
    optionsQuoteOptions: ILov[] = [];
    isMobile: boolean = false;
    quoteWCOptions: any
    quoteDandOOptions: any
    quoteEandOOptions: any
    quoteCGLOptions: any
    covers: any

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        private dialogService: DialogService,
        private quoteService: QuoteService,
        private quoteLocationAddOnService: QuoteLocationAddonService,
        private clausesHeadsService: ClausesHeadsService,
        private sidebarService: SidebarService,
        private deviceService: DeviceDetectorService,
        private quoteOptionService: QuoteOptionService,

    ) {
        this.sidebarService.isOpenLeft$.subscribe((isOpenleft) => {
            this.isSidebarVisible = isOpenleft
        })

        // * DO NOT TOUCH
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
            }
        })

        this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                this.selectedQuoteTemplate = template;

                if (this.quote.productId['type'].toLowerCase() == "group health policy top up") {
                    //this.selectedQuoteTemplate.gmcTemplateData = this.selectedQuoteTemplate.gmcTemplateData.filter(item => item.parentTabName === 'Other Details');
                }

                this.coveredQuoteTemplate = (this.selectedQuoteTemplate?.gmcTemplateData || [])
                    .reduce((acc, templateData) => {
                        if (templateData.gmcSubTab) {
                            acc.push(...templateData.gmcSubTab);
                        }
                        return acc;
                    }, [])
                    .reduce((acc, subTab) => {
                        if (subTab.gmcLabelForSubTab) {
                            acc.push(...subTab.gmcLabelForSubTab);
                        }
                        return acc;
                    }, [])
                    .reduce((acc, labelForSubTab) => {
                        if (labelForSubTab.gmcQuestionAnswers) {
                            acc.push(...labelForSubTab.gmcQuestionAnswers);
                        }
                        return acc;
                    }, [])
                    .filter(questionAnswer => questionAnswer.selectedAnswer > 0);

                //this.coveredQuoteTemplate = this.selectedQuoteTemplate.gmcTemplateData.filter(x => x.gmcSubTab.filter(x => x.gmcLabelForSubTab.filter(x => x.gmcQuestionAnswers.filter(x => x.selectedAnswer > 0))))
                //this.notcoveredQuoteTemplate = this.selectedQuoteTemplate.gmcTemplateData.filter(x => x.gmcSubTab.filter(x => x.gmcLabelForSubTab.filter(x => x.gmcQuestionAnswers.filter(x => x.selectedAnswer == 0))))
                this.notcoveredQuoteTemplate = (this.selectedQuoteTemplate?.gmcTemplateData || [])
                    .reduce((acc, templateData) => {
                        if (templateData.gmcSubTab) {
                            acc.push(...templateData.gmcSubTab);
                        }
                        return acc;
                    }, [])
                    .reduce((acc, subTab) => {
                        if (subTab.gmcLabelForSubTab) {
                            acc.push(...subTab.gmcLabelForSubTab);
                        }
                        return acc;
                    }, [])
                    .reduce((acc, labelForSubTab) => {
                        if (labelForSubTab.gmcQuestionAnswers) {
                            acc.push(...labelForSubTab.gmcQuestionAnswers);
                        }
                        return acc;
                    }, [])
                    .filter(questionAnswer => questionAnswer.selectedAnswer === 0);

            }
        });

        //GET Observable quote gmc options
        // this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
        //     next: (quoteOptions: IQuoteGmcTemplate[]) => {
        //         //Get LOV for DDL
        //         this.optionsQuoteOptions = quoteOptions.map(entity => ({ label: entity.optionName, value: entity._id }));; // Set the Id to this component
        //     }
        // })
    }

    isSidebarVisible: boolean;

    flexaCovers: any[] = [];

    optionsAllowedBscCoversForQuote = [];
    selectedAllowedBscCoversForQuote = [];
    marineSIData: IMarineSIData
    marineData: IMarineTemplate
    quoteId: string = "";
    marineCoverAddOnCovers: IClauses[] = []
    marineOtherDetails: string[] = []
    marineHeads: any[] = [];
    optionsAddonCoverCategories: ILov[];

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        this.optionsAddonCoverCategories = OPTIONS_ADDON_COVER_CATEGORIES

        const product: IProduct = this.quote.productId as IProduct;
        // Old_Quote
        // this.optionsAllowedBscCoversForQuote = this.quoteService.getBscAllowedCoversOptions(this.quote);
        // this.selectedAllowedBscCoversForQuote = this.quoteService.getSelectedBscAllowedCovers(this.quote);
        switch (product['productTemplate']) {
            case AllowedProductTemplate.BLUS:
                // Old_Quote
                // this.applyFilterOnAddonCovers(this.quote, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                // New_Quote_Option
                this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                break;
            case AllowedProductTemplate.FIRE:
                // Old_Quote
                // this.applyFilterOnAddonCovers(this.quote, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                // New_Quote_Option
                this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                break;
            case AllowedProductTemplate.IAR:
                // Old_Quote
                // const addonCoverType: AllowedAddonCoverCategory = localStorage.getItem(`${this.quote._id}.${this.quote.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`) as AllowedAddonCoverCategory
                // this.applyFilterOnAddonCovers(this.quote, addonCoverType ?? AllowedAddonCoverCategory.PROPERTY_DAMAGE)

                // New_Quote_Option
                const addonCoverType: AllowedAddonCoverCategory = localStorage.getItem(`${this.quoteOptionData._id}.${this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`) as AllowedAddonCoverCategory
                this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, addonCoverType ?? AllowedAddonCoverCategory.PROPERTY_DAMAGE)
                break;
            case AllowedProductTemplate.GMC:
                //this.applyFilterOnGmcCovers(this.quote, AllowedAddonCoverCategory.GMC)
                this.quoteService.setQuote(this.quote)
                break;

            case AllowedProductTemplate.MARINE:
                //this.applyFilterOnGmcCovers(this.quote, AllowedAddonCoverCategory.GMC)
                this.quoteService.setQuote(this.quote)
                this.getMarineHeads();
                if (this.quote?.marineDataId != undefined) {
                    this.marineData = this.quote?.marineDataId as IMarineTemplate
                    this.marineSIData = this.quote?.marineDataId['marineSIData'][0];
                    this.marineOtherDetails = this.quote?.marineDataId['otherDetails'];
                    this.marineCoverAddOnCovers = this.quote?.marineDataId['marineCoverAddOnCovers'];
                }
                break;
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                this.covers = this.selectedQuoteTemplate['liabiltyCovers'],
                    this.quoteWCOptions = this.selectedQuoteTemplate
                this.quoteService.setQuote(this.quote)
                break;
            case AllowedProductTemplate.LIABILITY:
                this.covers = this.selectedQuoteTemplate['liabiltyCovers'],
                    this.quoteDandOOptions = this.selectedQuoteTemplate
                this.quoteService.setQuote(this.quote)
                break;
            case AllowedProductTemplate.LIABILITY_EANDO:
                this.covers = this.selectedQuoteTemplate['liabiltyCovers'],
                    this.quoteEandOOptions = this.selectedQuoteTemplate
                this.quoteService.setQuote(this.quote)
                break;
            case AllowedProductTemplate.LIABILITY_CGL:
                this.covers = this.selectedQuoteTemplate['liabiltyCovers'],
                    this.quoteCGLOptions = this.selectedQuoteTemplate
                this.quoteService.setQuote(this.quote)
                break;
            case AllowedProductTemplate.LIABILITY_PRODUCT:
                this.covers = this.selectedQuoteTemplate['liabiltyCovers'],
                    this.quoteCGLOptions = this.selectedQuoteTemplate
                this.quoteService.setQuote(this.quote)
                break;
            case AllowedProductTemplate.LIABILITY_CYBER:
                this.covers = this.selectedQuoteTemplate['liabiltyCovers'],
                    this.quoteCGLOptions = this.selectedQuoteTemplate
                this.quoteService.setQuote(this.quote)
                break;
            case AllowedProductTemplate.LIABILITY_CRIME:
                this.covers = this.selectedQuoteTemplate['liabiltyCovers'],
                this.quoteDandOOptions = this.selectedQuoteTemplate
                this.quoteService.setQuote(this.quote)
                break;

        }

        if (product['productTemplate'] != AllowedProductTemplate.GMC) {
            // New_Quote_Option
            this.optionsAllowedBscCoversForQuote = this.quoteOptionService?.getBscAllowedCoversOptions(this.quoteOptionData);
            this.selectedAllowedBscCoversForQuote = this.quoteOptionService?.getSelectedBscAllowedCovers(this.quoteOptionData);
        }



    }

    ngOnChanges(changes: SimpleChanges): void {
        this.ngOnInit()
    }

    sidebarClosed(e) {
        this.sidebarService.openSideBar(false);
    }

    AllowedProductTemplate = AllowedProductTemplate

    openInsuredDetailsDialog() {
        const ref = this.dialogService.open(EditInsuredDetailsDialogComponent, {
            header: "Insured Details: " + this.quote.quoteNo,
            width: this.isMobile ? '98vw' : '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
            }
        })

        ref.onClose.subscribe({
            next: () => {
                this.quoteService.refresh()
                this.quoteOptionService.refreshQuoteOption()
            }
        })
    }
    filteredClaues(headId: string) {
        return this.marineCoverAddOnCovers.filter(x => x.headId["_id"] == headId && x.isClauseSelected == true)
    }
    openLocationWiseBreakupDialog() {
        const ref = this.dialogService.open(LocationWiseCoversBreakDialogComponent, {
            header: "Location wise Breakup of Total Indicative Pricing",
            width: this.isMobile ? '98vw' : '960px',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData,
                selectedLocation: this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy
            }
        })
    }

    openFlexaCoversDialog() {
        // Old_Quote
        // let splitLocation = this.quote.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')

        // New_Quote_Option
        let splitLocation = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')
        const ref = this.dialogService.open(FlexaCoversDialogComponent, {
            header: "Flexa Covers : " + splitLocation[0] + " -" + splitLocation[splitLocation.length - 2],
            width: this.isMobile ? '98vw' : '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                covers: this.flexaCovers,
                quoteOptionData: this.quoteOptionData,
            }
        })
        ref.onClose.subscribe((data) => {
            if (data) {
                this.flexaCovers = data;
            }
            this.quoteService.refresh()
            this.quoteOptionService.refreshQuoteOption()
        });
    }
    openLiabilityCoversDialog() {
        const ref = this.dialogService.open(LiabilityAddoncoversDialogComponent, {
            header: "Add-on Covers",
            width: '70%',
            styleClass: 'customPopup',
            
            closable: false,
            closeOnEscape: false,
            data: {
                quote: this.quote,
                covers: this.selectedQuoteTemplate['liabiltyCovers'],
                quoteDandOOptions: this.selectedQuoteTemplate
            }
        })

        ref.onClose.subscribe((data) => {

            this.quoteService.refresh()
        });
    }

    openLiabilityEandOCoversDialog() {
        const ref = this.dialogService.open(LiabilityEandOAddoncoversDialogComponent, {
            header: "Add-on Covers",
            width: '70%',
            styleClass: 'customPopup',
            closable: false,
            closeOnEscape: false,
            data: {
                quote: this.quote,
                covers: this.selectedQuoteTemplate['liabiltyCovers'],
                quoteEandOOptions: this.selectedQuoteTemplate
            }
        })

        ref.onClose.subscribe((data) => {

            this.quoteService.refresh()
        });
    }


    openLiabilityProductLiabilityCoversDialog() {
        const ref = this.dialogService.open(LiabilityProductliabilityAddoncoversDialogComponent, {
            header: "Add-on Covers",
            width: '70%',
            styleClass: 'customPopup',
            closable: false,
            closeOnEscape: false,
            data: {
                quote: this.quote,
                covers: this.selectedQuoteTemplate['liabiltyCovers'],
                quotePLOptions: this.selectedQuoteTemplate
            }
        })
        ref.onClose.subscribe((data) => {

            this.quoteService.refresh()
        });
    }

    openWorkmanCompensationCoversDialog() {
        const ref = this.dialogService.open(LiabilityWorkmenAdOnCoverComponent, {
            header: "Add-on Covers",
            width: '70%',
            styleClass: 'customPopup',
            closable: false,
            closeOnEscape: false,
            data: {
                quote: this.quote,
                covers: this.selectedQuoteTemplate['liabiltyCovers'],
                quoteWCoption: this.selectedQuoteTemplate
            }
        })
        ref.onClose.subscribe((data) => {

            this.quoteService.refresh()
        });
    }


    openLiabilityCGLCoversDialog() {
        const ref = this.dialogService.open(LiabilityCGLAddoncoversDialogComponent, {
            header: "Add-on Covers",
            width: '70%',
            styleClass: 'customPopup',
            closable: false,
            closeOnEscape: false,
            data: {
                quote: this.quote,
                covers: this.selectedQuoteTemplate['liabiltyCovers'],
                quoteCGLOptions: this.selectedQuoteTemplate
            }
        })

        ref.onClose.subscribe((data) => {

            this.quoteService.refresh()
        });
    }

    coversUpdated($event) {

        let currentCovers = $event.value.map((item) => item.value);
        // let existingCovers = this.quote.selectedAllowedProductBscCover                         // Old_Quote

        let existingCovers = this.quoteOptionData.selectedAllowedProductBscCover                  // New_Quote_Option

        let removedCovers = existingCovers.filter(x => !currentCovers.includes(x))

        if (removedCovers.length > 0) {
            const ref = this.dialogService.open(RemoveAllowedProductBscCoverDialogComponent, {
                header: "Are you sure you want to remove the cover",
                data: {
                    quoteId: this.quote._id,
                    removedCovers: removedCovers.map((cover) => cover.replace(/(?:_| |\b)(\w)/g, function (key, p1) { return ` ${p1.toUpperCase()}` })),

                    // clientLocationId: this.clientLocation?._id,
                    // bscFireLossOfProfitCover: this.bscFireLossOfProfitCover
                },
                width: this.isMobile ? '98vw' : '45%',
                styleClass: "flatPopup"
            })

            ref.onClose.subscribe({
                next: (response: boolean = false) => {
                    if (response) {
                        // this.quoteService.toggleAllowedProductBscCovers(this.quote._id, {                      // Old_Quote
                        this.quoteOptionService.toggleAllowedProductBscCovers(this.quoteOptionData._id, {                   // New_Quote_option
                            removed_covers: removedCovers,
                            selectedAllowedProductBscCover: currentCovers,
                        }).subscribe({
                            next: (dto) => {
                                // const quote = this.quote
                                // this.quoteService.setQuoteLocationOccupancyId(quote.locationBasedCovers.quoteLocationOccupancy._id)
                                this.quoteService.refresh((quote) => {

                                })
                                this.quoteOptionService.refreshQuoteOption()

                            }
                        })
                    } else {
                        // Old_Quote
                        // this.optionsAllowedBscCoversForQuote = this.quoteService.getBscAllowedCoversOptions(this.quote);
                        // this.selectedAllowedBscCoversForQuote = this.quoteService.getSelectedBscAllowedCovers(this.quote);

                        // New_Quote_Option
                        this.optionsAllowedBscCoversForQuote = this.quoteOptionService.getBscAllowedCoversOptions(this.quoteOptionData);
                        this.selectedAllowedBscCoversForQuote = this.quoteOptionService.getSelectedBscAllowedCovers(this.quoteOptionData);
                        alert('Covers not changed')
                    }
                }
            })
        } else {
            // this.quoteService.toggleAllowedProductBscCovers(this.quote._id, {                          // Old_Quote
            this.quoteOptionService.toggleAllowedProductBscCovers(this.quoteOptionData._id, {                   // New_Quote_option
                removed_covers: removedCovers,
                selectedAllowedProductBscCover: currentCovers,
            }).subscribe({
                next: (dto) => {
                    // const quote = this.quote
                    // this.quoteService.setQuoteLocationOccupancyId(quote.locationBasedCovers.quoteLocationOccupancy._id)
                    this.quoteService.refresh()
                    this.quoteOptionService.refreshQuoteOption()


                }
            })
        }


        // console.log($event.itemValue)
        // console.log($event.value.map((item) => item.value))

        // if (removedCovers.length > 0) {
        //     if (confirm(`!!! CONFIRMATION !!!\n\nAre you Sure You want to remove the following covers ${['', ...removedCovers.map((cover) => cover.replace(/(?:_| |\b)(\w)/g, function (key, p1) { return ` ${p1.toUpperCase()}` }))].join('\n\u2022')} \n\nThis remove all the input of the cover`)) {

        //         this.quoteService.update(this.quote._id, {
        //             selectedAllowedProductBscCover: $event.value.map((item) => item.value)
        //         }).subscribe({
        //             next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //                 console.log(dto)
        //                 const quote = this.quote
        //                 this.quoteService.setQuoteLocationOccupancyId(quote.locationBasedCovers.quoteLocationOccupancy._id)
        //             }
        //         })
        //     }



        // } else {
        //     this.quoteService.update(this.quote._id, {
        //         selectedAllowedProductBscCover: $event.value.map((item) => item.value)
        //     }).subscribe({
        //         next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //             console.log(dto)
        //             const quote = this.quote
        //             this.quoteService.setQuoteLocationOccupancyId(quote.locationBasedCovers.quoteLocationOccupancy._id)
        //         }
        //     })

        // }

    }

    loadData(quoteLocationOccupancyId: string) {
        this.quoteService.setQuoteLocationOccupancyId(quoteLocationOccupancyId)
    }

    handleRiskLocationOccupancyChange(event) {
        this.loadData(event.value)
        // this.quoteService.setQuoteLocationOccupancyId(event.value)
    }


    selectedAddonCoverType;
    //Intergation-EB [End]
    getMarineHeads() {
        this.clausesHeadsService.getManyAsLovs(event).subscribe({
            next: records => {
                console.log(records);

                this.marineHeads = records.data.entities;

            },
            error: e => {
                console.log(e);
            }
        });
    }

    addonCoverTypeChanged($event) {
        // Old_Quote
        // this.applyFilterOnAddonCovers(this.quote, $event.value)

        // New_Quote_Option
        this.applyFilterOnAddonCoversForQuoteOption(this.quoteOptionData, $event.value)
    }

    selectedConditionalFreeCovers: any[] = [];
    conditionalFreeCovers: any[] = [];

    selectedSectorAvgPaidCovers: any[] = [];
    sectorAvgPaidCovers = [];

    sectorAvgCovers: any[] = []


    // Old_Quote
    // applyFilterOnAddonCovers(quote: IQuoteSlip, type: AllowedAddonCoverCategory) {

    //     if (quote?._id && quote.locationBasedCovers?.quoteLocationOccupancy?._id) {

    //         this.selectedAddonCoverType = type;

    //         localStorage.setItem(`${quote._id}.${quote.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`, type)

    //         console.log(quote.locationBasedCovers?.conditonalBasedAddOn);

    //         function filterByOccupancyType(flexaCovers) {
    //             const occupancyType = quote.locationBasedCovers?.quoteLocationOccupancy?.occupancyId['_id']
    //             const hasMatchingOccupancyType = flexaCovers.some(item => item?.addOnCoverId?.occupancyId === occupancyType);
    //             if (hasMatchingOccupancyType) {
    //                 return flexaCovers.filter(item => item?.addOnCoverId?.occupancyId === occupancyType);
    //             }
    //             return flexaCovers.filter(item => !item?.addOnCoverId?.occupancyId || item?.addOnCoverId?.occupancyId === null);
    //         }

    //         this.flexaCovers = quote.locationBasedCovers?.conditonalBasedAddOn
    //             ?.filter((item) => item?.addOnCoverId?.category == type)
    //             ?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free')
    //             ?.filter(item => item?.addOnCoverId?.sectorId?.name == quote?.sectorId['name']);
    //         this.flexaCovers = filterByOccupancyType(this.flexaCovers)

    //         this.conditionalFreeCovers = quote.locationBasedCovers?.conditonalBasedAddOn
    //             ?.filter((item) => item?.addOnCoverId?.category == type)
    //             ?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid')
    //             ?.filter(item => item?.addOnCoverId?.sectorId?.name == quote?.sectorId['name']);
    //         this.conditionalFreeCovers = filterByOccupancyType(this.conditionalFreeCovers)

    //         this.selectedConditionalFreeCovers = quote.locationBasedCovers?.conditonalBasedAddOn
    //             ?.filter((item) => item?.addOnCoverId?.category == type)
    //             ?.filter(item => item.isChecked == true && (item.addOnCoverId.addonTypeFlag == 'Condition Fix Paid' || item.addOnCoverId.addonTypeFlag == 'Condition Perc Paid')).map(item => item.addOnCoverId.name);
    //         this.selectedConditionalFreeCovers = filterByOccupancyType(this.selectedConditionalFreeCovers)

    //         this.sectorAvgPaidCovers = quote.locationBasedCovers?.conditonalBasedAddOn
    //             ?.filter((item) => item?.addOnCoverId?.category == type)
    //             ?.filter(item => item?.addOnCoverId?.addonTypeFlag == 'Paid')
    //             ?.filter(item => item?.addOnCoverId?.sectorId?.name == quote?.sectorId['name']);
    //         this.sectorAvgPaidCovers = filterByOccupancyType(this.sectorAvgPaidCovers)

    //         this.selectedSectorAvgPaidCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);
    //         this.selectedSectorAvgPaidCovers = filterByOccupancyType(this.selectedSectorAvgPaidCovers)
    //     }

    // }

    // New_Quote_option
    applyFilterOnAddonCoversForQuoteOption(quoteOption: IQuoteOption, type: AllowedAddonCoverCategory) {
        if (quoteOption?._id && quoteOption.locationBasedCovers?.quoteLocationOccupancy?._id) {

            this.selectedAddonCoverType = type;

            localStorage.setItem(`${quoteOption._id}.${quoteOption.locationBasedCovers?.quoteLocationOccupancy?._id}.addonCoverType`, type)

            this.flexaCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn
                ?.filter((item) => item?.addOnCoverId?.category == type)
                ?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free')
                ?.filter(item => item?.addOnCoverId?.sectorId?.name == this.quote?.sectorId['name']);

            this.conditionalFreeCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn
                ?.filter((item) => item?.addOnCoverId?.category == type)
                ?.filter(item => item?.addOnCoverId?.addonTypeFlag != 'Free' && item?.addOnCoverId?.addonTypeFlag != 'Paid')
                ?.filter(item => item?.addOnCoverId?.sectorId?.name == this.quote?.sectorId['name']);

            this.selectedConditionalFreeCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn
                ?.filter((item) => item?.addOnCoverId?.category == type)
                ?.filter(item => item.isChecked == true && (item.addOnCoverId.addonTypeFlag == 'Condition Fix Paid' || item.addOnCoverId.addonTypeFlag == 'Condition Perc Paid')).map(item => item.addOnCoverId.name);

            this.sectorAvgPaidCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn
                ?.filter((item) => item?.addOnCoverId?.category == type)
                ?.filter(item => item?.addOnCoverId?.addonTypeFlag == 'Paid')
                ?.filter(item => item?.addOnCoverId?.sectorId?.name == this.quote?.sectorId['name']);
            this.selectedSectorAvgPaidCovers = quoteOption.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.isChecked == true && item?.addOnCoverId?.addonTypeFlag == 'Paid').map(item => item.addOnCoverId.name);
        }

    }


    openSectorAvgAddOnsDialog() {
        // Old_Quote
        // let splitLocation = this.quote.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')

        // New_Quote_Option
        let splitLocation = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')

        const ref = this.dialogService.open(SectorAvgFreeAddOnsDialogComponent, {
            header: "Sector Avg. Free Addons : " + splitLocation[0] + " -" + splitLocation[splitLocation.length - 2],
            width: this.isMobile ? '98vw' : '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                covers: this.sectorAvgCovers
            }
        })
    }

    openConditionalFreeAddOnsDialog() {
        // Old_Quote
        // let splitLocation = this.quote.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')

        // New_Quote_Option
        let splitLocation = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')
        const ref = this.dialogService.open(ConditionalFreeAddOnsDialogComponent, {
            header: "Sector Conditional Paid Addons : " + splitLocation[0] + " -" + splitLocation[splitLocation.length - 2],
            width: this.isMobile ? '98vw' : '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                // New_Quote_Option
                quoteOptionData: this.quoteOptionData,
                covers: this.conditionalFreeCovers,
                selectedCovers: this.selectedConditionalFreeCovers
            }
        });

        ref.onClose.subscribe((data) => {
            if (data) {
                this.selectedConditionalFreeCovers = data;
            }
            this.quoteService.refresh()
            this.quoteOptionService.refreshQuoteOption()
        });
    }

    openSectorAvgPaidAddOnsDialog() {
        let cover = this.sectorAvgPaidCovers.filter(item => !this.selectedSectorAvgPaidCovers.includes(item.addOnCoverId?.name));
        let selectedcover = this.sectorAvgPaidCovers.filter(item => this.selectedSectorAvgPaidCovers.includes(item.addOnCoverId?.name));
        // Old_Quote
        // let splitLocation = this.quote.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')

        // New_Quote_Option
        let splitLocation = this.quoteOptionData.locationBasedCovers.quoteLocationOccupancy.locationName.split(',')
        const ref = this.dialogService.open(SectorAvgPaidAddOnsDialogComponent, {
            header: "Sector Avg Paid Addons : " + splitLocation[0] + " -" + splitLocation[splitLocation.length - 2],
            width: this.isMobile ? '98vw' : '70%',
            styleClass: 'customPopup',
            data: {
                quote: this.quote,
                covers: cover,
                selectedCovers: selectedcover,
                quoteOptionData: this.quoteOptionData
            }
        });

        ref.onClose.subscribe((data) => {
            if (data) {
                this.selectedSectorAvgPaidCovers = data.map(item => item.addOnCoverId.name);
            }
            this.quoteService.get(this.quote._id).subscribe(res => {
                this.quoteService.setQuote(res.data.entity)
            })
            this.quoteOptionService.refreshQuoteOption()
        });
    }

    updateAddonCover(cover: any, e) {
        if (e.checked.includes(cover?.addOnCoverId?.name)) {
            console.log('checked');
            cover.isChecked = true;
        }
        else {
            console.log('unchecked');
            cover.isChecked = false;
        }
        this.quoteLocationAddOnService.update(cover._id, cover).subscribe({
            next: (dto: IOneResponseDto<any>) => {
            }
        })
    }

    //Intergation-EB [Start]
    applyFilterOnGmcCovers(quote: IQuoteSlip, type: AllowedAddonCoverCategory) {

        // if (quote?._id && quote?.gmcTemplateDataId) {

        //     this.selectedAddonCoverType = type;
        //     this.selectedQuoteTemplate = quote?.gmcTemplateDataId['gmcTemplateData']
        //     // this.gmcSelectedCovers = quote.gmcTemplateData.filter((item) => item?.gmcSubTab?.filter(item => item.gmcLabelForSubTab.filter((item)=>item.gmcQuestionAnswers.filter((item)=>item.answer.filter(item)=>item.gmcQuestionAnswer.addonTypeFlag == 'Free');
        //     // this.gmcNotSelectedCovers = quote.locationBasedCovers?.conditonalBasedAddOn?.filter((item) => item?.addOnCoverId?.category == type)?.filter(item => item.addOnCoverId?.addonTypeFlag == 'Free');

        // }
        this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                this.selectedQuoteTemplate = template;
                if (this.selectedQuoteTemplate != null || this.selectedQuoteTemplate != undefined) {
                    this.coveredQuoteTemplate = this.selectedQuoteTemplate.gmcTemplateData.filter(x => x.gmcSubTab.filter(x => x.gmcLabelForSubTab.filter(x => x.gmcQuestionAnswers.filter(x => x.selectedAnswer > 0))))
                    this.notcoveredQuoteTemplate = this.selectedQuoteTemplate.gmcTemplateData.filter(x => x.gmcSubTab.filter(x => x.gmcLabelForSubTab.filter(x => x.gmcQuestionAnswers.filter(x => x.selectedAnswer == 0))))
                }


            }
        });
    }

    getAnswer(coveritemQuetions) {
        //console.log(coveritemQuetions)
        let text = ""
        if (this.quote.quoteType == 'new') {
            if (coveritemQuetions.inputControl == 'dropdown') {
                if (+coveritemQuetions.selectedAnswer > 0) {
                    let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
                    return ans.answer
                }
                else {
                    return 'Not Selected'
                }
            }
            else if (coveritemQuetions.inputControl == 'multiselectdropdown') {
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



            } else {
                return coveritemQuetions.selectedAnswer
            }

        }
        else {
            if (coveritemQuetions.answer.some(x => x.isSelected == true)) {
                let ans = coveritemQuetions.answer.filter(x => x.isSelected == true)[0]
                return ans.answer.trim()
            }
            else {
                return 'Not Selected'
            }
        }

    }

    getCoveragesFlag(cover: any) {
        return true

    }
    //Intergation-EB [End]
}
