import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { IEandOTemplate, IQuoteGmcTemplate, IQuoteOption, IQuoteSlip, QuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IRole } from 'src/app/features/admin/role/role.model';
import { AllowedProductTemplate, IProduct } from 'src/app/features/admin/product/product.model';
import { MessageService } from 'primeng/api';
import { AllowedDecisionOptions, OPTIONS_ACCEPT_REJECT } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
    selector: 'app-quote-insurer-review-preview-download-tab',
    templateUrl: './quote-insurer-review-preview-download-tab.component.html',
    styleUrls: ['./quote-insurer-review-preview-download-tab.component.scss']
})
export class QuoteInsurerReviewPreviewDownloadTabComponent implements OnInit {

    allowedProductTemplate = AllowedProductTemplate
    id: string;
    quote: IQuoteSlip;
    requestSentDialog: boolean = false;
    editNextQuote: boolean = false;
    //   quoteId: string = '';
    selectedQuoteLocationOccpancyId: string;
    currentUser$: any;

    private currentQuote: Subscription;
    private currentUser: Subscription;
    private currentSelectedTemplate: Subscription;
    selectedQuoteTemplate: any[];
    decisionOptions: ILov[]
    templateName: string = ""

    // New_Quote_option
    quoteOption: IQuoteOption
    private currentPropertyQuoteOption: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private accountService: AccountService,
        private messageService: MessageService,
        private gmcQuoteTemplateService: QoutegmctemplateserviceService,
        private liabilityTemplateService: liabilityTemplateService,
        private liabilityEnOTemplateService: liabilityEandOTemplateService,
        private liabilityCglTemplateService: liabilityCGLTemplateService,
        private liabilityPlTemplateService: liabilityProductTemplateService,
        private wcTemplateService: QuoteWcTemplateService,
        private quoteOptionService: QuoteOptionService,

    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        // this.currentUser = this.accountService.currentUser$.subscribe({
        //     next: user => {
        //         this.currentUser$ = user;
        //     }
        // });


        // this.currentQuote = this.quoteService.currentQuote$.subscribe({
        //     next: (quote: IQuoteSlip) => {

        //         this.quoteService.get(quote._id, { allCovers: true }).subscribe(({
        //             next: (dto: IOneResponseDto<IQuoteSlip>) => [

        //                 this.quote = dto.data.entity
        //             ]
        //         }))

        //     }
        // })
        //  this.currentQuoteLocationOccupancyId = this.quoteService.currentQuoteLocationOccupancyId$.subscribe({
        //      next: (quoteLocationOccupancyId: string) => {
        //          this.selectedQuoteLocationOccpancyId = quoteLocationOccupancyId // Set the Id to this component

        //          if (quoteLocationOccupancyId) {
        //              //   this.quoteService.get(`${this.quote._id}?quoteLocationOccupancyId=${quoteLocationOccupancyId}`).subscribe({
        //    this.quoteService.get(`${this.quote._id}`, {'quoteLocationOccupancyId': quoteLocationOccupancyId}).subscribe({
        //                  next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //                      this.quoteService.setQuote(dto.data.entity)
        //                  },
        //                  error: e => {
        //                      console.log(e);
        //                  }
        //              });
        //          }
        //      }
        //  });
        this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
            next: (template) => {
                this.selectedQuoteTemplate = template?.sort((n1, n2) => n1.optionIndex - n2.optionIndex);
            }
        })

        this.decisionOptions = OPTIONS_ACCEPT_REJECT

    }

    ngOnInit(): void {
        this.allowedProductTemplate = AllowedProductTemplate

        this.quoteService.get(this.id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // console.log(dto.data.entity)
                // this.quoteService.setQuote(dto.data.entity)
                this.quote = dto.data.entity
                this.templateName = this.quote?.productId['productTemplate']
            },
            error: e => {
                console.log(e);
            }
        });

        this.loadQuoteOption(this.activatedRoute.snapshot.queryParams.quoteOptionId)

    }

    ngOnDestroy(): void {
        // this.currentQuoteLocationOccupancyId.unsubscribe();
        // this.currentQuote.unsubscribe();
    }

    save() {
        // this.router.navigateByUrl('backend/insurer/compare-analyse/decision-matrix')
    }

    sendForApproval() {
        // this.requestSentDialog = true;
        // this.router.navigateByUrl(`backend/broker/quotes`);
        //     this.quoteService.sendQuoteToUnderwritterApproval(this.quoteId).subscribe({
        //       next: quote => {
        //           this.quoteService.get(quote.data.entity._id).subscribe({
        //               next: (dto: IOneResponseDto<IQuoteSlip>) => {
        //                   this.quoteService.setQuote(dto.data.entity);

        //                   this.router.navigateByUrl(`/`);
        //               },
        //               error: e => {
        //                   console.log(e);
        //               }
        //           });
        //       },
        //       error: error => {
        //           console.log(error);
        //       }
        //   });
    }

    showNextDialog() {
        this.requestSentDialog = false;
        this.editNextQuote = true;
    }

    navigateToEdit() {
        // stays on the same page but with previous changes for new Quote/Broker
    }

    navigateToDashboard() {
        this.router.navigateByUrl('/')
    }
    //Intergation-EB [Start]
    showMessages(severityInfo, summaryInfo, detailInfo) {
        this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
    }
    acceptQuoteOption(option, flag) {
        if (this.selectedQuoteTemplate.some(x => x.isAccepted != AllowedDecisionOptions.ACCEPT && x.isAccepted != AllowedDecisionOptions.REJECT)) {
            this.showMessages("error", "Warning", "Select Accept/Reject for all options.");

            return;
        }

        if (this.selectedQuoteTemplate.some(x => +x.indicativePremium == 0 && x.isAccepted == AllowedDecisionOptions.ACCEPT)) {
            this.showMessages("error", "Warning", "Premium should be greater than 0 for all options.");
            return;
        }

        if (this.selectedQuoteTemplate.some(x => +x.brokarage == 0 && x.isAccepted == AllowedDecisionOptions.ACCEPT)) {
            this.showMessages("error", "Warning", "Brokerage should be greater than 0 for all options.");
            return;
        }
        // let indicativePremium =  this.selectedQuoteTemplate.filter(x=>x.isAccepted == AllowedDecisionOptions.ACCEPT)[0].indicativePremium
        // this.quoteService.update(this.id, { totalIndictiveQuoteAmtWithGst: +indicativePremium }).subscribe({
        //     next: (dto) => {
        //         console.log("Premium Updated")
        //     }
        // });

        this.selectedQuoteTemplate.forEach(element => {
            const updatePayload = element
            this.gmcQuoteTemplateService.updateArray(updatePayload._id, updatePayload).subscribe({
                next: partner => {
                    console.log("ttest");
                    this.quoteService.get(this.id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                            console.log(dto.data.entity)
                            this.quoteService.setQuote(dto.data.entity)
                            this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                                next: (dtoOption: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                    this.loadOptionsData(dtoOption.data.entity) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                                    //Load data    
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                },
                error: e => {
                    this.messageService.add({
                        severity: "fail",
                        summary: "Fail",
                        detail: e.error.message,
                        life: 3000
                    });
                }
            });
        });
    }

    acceptQuoteOptionEnO(option, flag) {
        if (this.selectedQuoteTemplate.some(x => x.isAccepted != AllowedDecisionOptions.ACCEPT && x.isAccepted != AllowedDecisionOptions.REJECT)) {
            this.showMessages("error", "Warning", "Select Accept/Reject for all options.");

            return;
        }
        this.selectedQuoteTemplate.forEach(element => {
            const updatePayload = element



            if (this.templateName == AllowedProductTemplate.LIABILITY_EANDO) {
                this.liabilityEnOTemplateService.updateArray(updatePayload._id, updatePayload).subscribe({
                    next: partner => {
                        console.log("ttest");
                        this.quoteService.get(this.id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                console.log(dto.data.entity)
                                this.quoteService.setQuote(dto.data.entity)
                                this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                    next: (dtoOption: IOneResponseDto<any[]>) => {
                                        this.loadOptionsData(dtoOption.data.entity.filter(x => x.version == this.quote.qcrVersion)) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                                        //Load data    
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            },
                            error: e => {
                                console.log(e);
                            }
                        });
                    },
                    error: e => {
                        this.messageService.add({
                            severity: "fail",
                            summary: "Fail",
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
            }
            else if (this.templateName == AllowedProductTemplate.LIABILITY || this.templateName == AllowedProductTemplate.LIABILITY_CRIME) {
                this.liabilityTemplateService.updateArray(updatePayload._id, updatePayload).subscribe({
                    next: partner => {
                        console.log("ttest");
                        this.quoteService.get(this.id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                console.log(dto.data.entity)
                                this.quoteService.setQuote(dto.data.entity)
                                this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                    next: (dtoOption: IOneResponseDto<any[]>) => {
                                        this.loadOptionsData(dtoOption.data.entity.filter(x => x.version == this.quote.qcrVersion)) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                                        //Load data    
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            },
                            error: e => {
                                console.log(e);
                            }
                        });
                    },
                    error: e => {
                        this.messageService.add({
                            severity: "fail",
                            summary: "Fail",
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
            }
            else if (this.templateName == AllowedProductTemplate.LIABILITY_CGL || this.templateName == AllowedProductTemplate.LIABILITY_PUBLIC) {
                this.liabilityCglTemplateService.updateArray(updatePayload._id, updatePayload).subscribe({
                    next: partner => {
                        console.log("ttest");
                        this.quoteService.get(this.id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                console.log(dto.data.entity)
                                this.quoteService.setQuote(dto.data.entity)
                                this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                    next: (dtoOption: IOneResponseDto<any[]>) => {
                                        this.loadOptionsData(dtoOption.data.entity.filter(x => x.version == this.quote.qcrVersion)) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                                        //Load data    
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            },
                            error: e => {
                                console.log(e);
                            }
                        });
                    },
                    error: e => {
                        this.messageService.add({
                            severity: "fail",
                            summary: "Fail",
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
            }
            else if (this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT || this.templateName == AllowedProductTemplate.LIABILITY_CYBER) {
                this.liabilityPlTemplateService.updateArray(updatePayload._id, updatePayload).subscribe({
                    next: partner => {
                        console.log("ttest");
                        this.quoteService.get(this.id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                console.log(dto.data.entity)
                                this.quoteService.setQuote(dto.data.entity)
                                this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                    next: (dtoOption: IOneResponseDto<any[]>) => {
                                        this.loadOptionsData(dtoOption.data.entity.filter(x => x.version == this.quote.qcrVersion)) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                                        //Load data    
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            },
                            error: e => {
                                console.log(e);
                            }
                        });
                    },
                    error: e => {
                        this.messageService.add({
                            severity: "fail",
                            summary: "Fail",
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
            }
            else if (this.templateName == AllowedProductTemplate.WORKMENSCOMPENSATION) {
                this.wcTemplateService.updateArray(updatePayload._id, updatePayload).subscribe({
                    next: partner => {
                        console.log("ttest");
                        this.quoteService.get(this.id).subscribe({
                            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                                console.log(dto.data.entity)
                                this.quoteService.setQuote(dto.data.entity)
                                this.quoteService.getAllLiabilityQuoteOptions(this.quote._id).subscribe({
                                    next: (dtoOption: IOneResponseDto<any[]>) => {
                                        this.loadOptionsData(dtoOption.data.entity.filter(x => x.version == this.quote.qcrVersion)) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                                        //Load data    
                                    },
                                    error: e => {
                                        console.log(e);
                                    }
                                });
                            },
                            error: e => {
                                console.log(e);
                            }
                        });
                    },
                    error: e => {
                        this.messageService.add({
                            severity: "fail",
                            summary: "Fail",
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
            }




        });
    }
    loadOptionsData(quoteOption: any[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }

    loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
        this.quoteService.setSelectedOptions(quoteOption)
    }
    addTerms(options) {
        if (options.otherTermText != null && options.otherTermText != undefined && options.otherTermText != '') {
            const selectedOption = this.selectedQuoteTemplate.filter(x => x._id == options._id)[0];
            selectedOption.otherTerms.push(options.otherTermText);
            options.otherTermText = ""
        }
        else {
            this.messageService.add({
                severity: "error",
                summary: "Missing Information",
                detail: 'Please enter terms',
                life: 3000
            });
        }
    }

    removeTerms(options, items) {
        const selectedOption = this.selectedQuoteTemplate.filter(x => x._id == options._id)[0];
        var index = selectedOption.otherTerms.indexOf(items);
        if (index !== -1) {
            selectedOption.otherTerms.splice(index, 1);
        }
    }


    loadQuoteOption(quoteOptionId) {
        if (quoteOptionId != undefined) {
            this.quoteOptionService.get(quoteOptionId, { allCovers: true }).subscribe({
                next: (dto) => {
                    this.quoteOption = dto.data.entity
                    this.quoteOptionService.setQuoteOptionForProperty(this.quoteOption)
                }
            })
        }

    }
}
