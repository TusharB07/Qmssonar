import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ReplaySubject, Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { GmcMasterService } from 'src/app/features/admin/gmc-master/gmc-master.service';
import { AllowedQuoteTypes, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SidebarService } from '../../components/quote-requisition-sidebar/sidebar.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};
@Component({
    selector: 'app-quote-requisition-page',
    templateUrl: './quote-requisition-page.component.html',
    styleUrls: ['./quote-requisition-page.component.scss']
})
export class QuoteRequisitionPageComponent implements OnInit, OnDestroy {
    quote: IQuoteSlip;
    AllowedProductTemplate = AllowedProductTemplate

    private currentQuote: Subscription;

    private currentParamsSource = new ReplaySubject<{ quoteId: string, quoteLocationOccupancyId?: string, quoteOptionId: string }>(null);
    currentParams$ = this.currentParamsSource.asObservable();
    private currentQuoteOptions: Subscription;
    private currentSelectedTemplate: Subscription;
    selectedQuoteTemplate: IQuoteGmcTemplate;
    optionsQuoteOptions: ILov[] = [];
    gmcTemplate: IGMCTemplate;
    quoteGmcOptionsLst: IQuoteGmcTemplate[];
    isMobile: boolean = false;
    isTabActive: boolean = false;
    isSidebarVisible: boolean = false;
    private currentPropertyQuoteOption: Subscription;       // New_Quote_option
    quoteOptionData: IQuoteOption     // New_Quote_option

    constructor(
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private router: Router,
        private appService: AppService,
        private gmcMasterService: GmcMasterService,
        private deviceService: DeviceDetectorService,
        private sidebarService: SidebarService,
        private quoteOptionService: QuoteOptionService,

    ) {

        this.sidebarService.isOpenLeft$.subscribe((isOpenleft) => {
            this.isSidebarVisible = isOpenleft
        })

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
                if (queryParams.get('tab')) {
                    this.isTabActive = true
                }
                else {
                    this.isTabActive = false;
                }
                this.currentParamsSource.next({
                    quoteId: quoteId,
                    quoteLocationOccupancyId: queryParams.get('location'),
                    quoteOptionId: queryParams.get('quoteOptionId')                                               // New_Quote_Option

                })
            }
        })

        // * DO NOT TOUCH
        this.currentParams$.subscribe({
            next: (params) => {
                // Old_Quote
                this.loadQuote(params.quoteId, params.quoteLocationOccupancyId)
                // if (params.quoteOptionId) {
                //     if (this.quote != undefined) {
                //         if (!this.isAllowedProductLiability()) {
                //             this.loadQuoteOption(params.quoteOptionId, params.quoteLocationOccupancyId)                         // New_Quote_Option
                //         }
                //     }
                // }
                 if (params.quoteOptionId) {
                    if (!this.isAllowedProductLiability()) {
                        this.loadQuoteOption(params.quoteOptionId, params.quoteLocationOccupancyId)                         // New_Quote_Option
                    }
                }
            }
        })

        // * DO NOT TOUCH
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
                // this.onQuoteSet(quote)      // Old_Quote
            }
        })

        // * DO NOT TOUCH
        // this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
        //     next: (template) => {
        //         this.selectedQuoteTemplate = template;
        //     }
        // });
        //GET Observable quote gmc options
        this.currentQuoteOptions = this.quoteService.currentQuoteOptions$.subscribe({
            next: (quoteOptions: IQuoteGmcTemplate[]) => {
                //Get LOV for DDL
                if (quoteOptions != null) {
                    // Assuming quoteOptions is an array of objects with properties optionName, _id, and qcrVersion
                    const filteredOptions = quoteOptions.reduce((acc, curr) => {
                        // Find if the optionName already exists in the accumulator
                        const existingOption = acc.find(option => option.optionName === curr.optionName);

                        // If it doesn't exist, or the current version is higher, update the accumulator
                        if (!existingOption || curr.version > existingOption.version) {
                            // Remove the old entry if it exists
                            acc = acc.filter(option => option.optionName !== curr.optionName);
                            // Add the current entry
                            acc.push(curr);
                        }
                        return acc;
                    }, []);

                    // Map the filtered options to the required label and value format
                    this.optionsQuoteOptions = filteredOptions.map(entity => ({
                        label: entity.optionName,
                        value: entity._id
                    }));
                    // this.optionsQuoteOptions = quoteOptions.map(entity => ({ label: entity.optionName, value: entity._id }));; // Set the Id to this component                }
                }
            }
        })

        // New_Quote_option
        this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
            next: (dto: IQuoteOption) => {
                this.quoteOptionData = dto
                //@ts-ignore
                // this.quoteService.setQuote(this.quoteOptionData.quoteId)
                this.onQuoteOptionSet(dto)

            }
        });
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
            AllowedProductTemplate.LIABILITY_CYBER
        ].includes(this.quote?.productId['productTemplate'])
        // checking if quote option have qcr version object

        return isTemplateAllowed;
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
        //             }
        //         })
        //     }
        // } else {

        //         this.quoteService.get(quoteId).subscribe({
        //             next: (dto) => {
        //                 const quote = dto.data.entity
        //                 this.quoteService.setQuote(quote)
        //                 if (quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
        //                     this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
        //                         next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        //                             this.quoteGmcOptionsLst = dto.data.entity;
        //                             this.loadOptionsData(dto.data.entity) //.map(entity => ({ label: entity.optionName, value: entity._id })))
        //                             //this.selectedQuoteTemplate = this.quoteGmcOptionsLst[0]; 
        //                             this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
        //                                 next: (template) => {
        //                                     this.selectedQuoteTemplate = template;
        // =======
        //                         this.quoteService.setQuote(quote)
        //                     }
        //                 })
        //             }
        //         } else {

        this.quoteService.get(quoteId).subscribe({
            next: (dto) => {
                const quote = dto.data.entity
                this.quoteService.setQuote(quote)
                if (quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
                    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.quoteGmcOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion);
                            this.loadOptionsData(dto.data.entity) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                            //this.selectedQuoteTemplate = this.quoteGmcOptionsLst[0]; 
                            this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
                                next: (template) => {
                                    this.selectedQuoteTemplate = template;
                                }
                            });
                            // this.loadSelectedOption(this.quoteGmcOptionsLst[0])
                            if (this.selectedQuoteTemplate == undefined) {
                                this.loadSelectedOption(this.quoteGmcOptionsLst[0])
                            }
                        }
                    });
                    // this.loadSelectedOption(this.quoteGmcOptionsLst[0])
                    if (this.selectedQuoteTemplate == undefined) {
                        if (this.quoteGmcOptionsLst != undefined) {
                            this.loadSelectedOption(this.quoteGmcOptionsLst[0])
                        }

                    }


                }
                error: e => {
                    console.log(e);
                }
            }
        });
        //         }
        //     }
        // })
        // }
    }
    loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }

    loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
        this.quoteService.setSelectedOptions(quoteOption)
    }
    onQuoteSet(quote: IQuoteSlip) {
        if (quote) {

            this.router.navigate([],
                {
                    relativeTo: this.activatedRoute,
                    queryParams: {
                        location: quote?.locationBasedCovers?.quoteLocationOccupancy?._id,
                    },
                    queryParamsHandling: 'merge'
                })


            if (quote?.otpVerifiedAt != null || quote?.offlineVerificationFormUrl != null) {
                this.router.navigateByUrl(
                    this.appService.routes.quotes.requisitionReview(quote._id), {
                    replaceUrl: true,
                    skipLocationChange: true,
                })

                return;
            }
        }
    }

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        //GET GMC Masters to Show side bar coverages
        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
        //  this.getGMCMasters()
        // }
    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
        // this.currentPropertyQuoteOption.unsubscribe();
    }

    getGMCMasters() {
        this.gmcMasterService.getMany(DEFAULT_RECORD_FILTER).subscribe({
            next: records => {
                this.gmcTemplate = records.data.entities[0];
            },
            error: e => {
                console.log(e);
            }
        });
    }


    // New_Quote_option
    loadQuoteOption(quoteOptionId, quoteLocationOccupanyId?) {
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
                },
                error: e => {
                    console.log(e);
                }
            })
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
        }
    }

    changeConditionBasedOnProduct() {
        const isTemplateAllowed = [
            AllowedProductTemplate.BLUS,
            AllowedProductTemplate.FIRE,
            AllowedProductTemplate.IAR
        ].includes(this.quote?.productId['productTemplate']);
        if (isTemplateAllowed) {
            return !!this.quoteOptionData;
        } else {
            return !!this.quote;
        }
    }

}
