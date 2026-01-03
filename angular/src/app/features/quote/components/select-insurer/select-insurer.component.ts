import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { IManyResponseDto } from 'src/app/app.model';
import { SendMailComponent } from 'src/app/features/BrokerModule/send-mail/send-mail.component';
import { IMappedRmEmailICName, IRmMappedIntermediate } from 'src/app/features/admin/partner/partner.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { RmMappedIntermediateService } from 'src/app/features/admin/quote/RmMappedIntermediate.service';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteReviewPageComponent } from '../../pages/quote-review-page/quote-review-page.component';
import { AccountService } from 'src/app/features/account/account.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};
@Component({
    selector: 'app-select-insurer',
    templateUrl: './select-insurer.component.html',
    styleUrls: ['./select-insurer.component.scss']
})
export class SelectInsurerComponent implements OnInit, OnChanges {
    @Output() isClick = new EventEmitter<boolean>();
    @Input() quote: IQuoteSlip;
    hideSendMailButton: boolean;
    user: IUser;
    @Input() gmcQuoteOption: any;
    @Input() quoteOption: IQuoteOption;
    // hideSendMailButton:boolean;
    constructor(
        private quoteService: QuoteService,
        private rmMappedService: RmMappedIntermediateService,
        private messageService: MessageService,
        private dialogService: DialogService,
        private renderer: Renderer2,
        private quoteReviewPageComponent: QuoteReviewPageComponent,
        private accountService: AccountService,
    ) {
        this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user;
            }
        });
    }

    filterInsurerInput: string;

    optionsInsurer: IMappedRmEmailICName[] = [];
    rmMappedIntermediates: IRmMappedIntermediate[] = []
    selectedInsurers: any = []
    selectedRMEmails = [] = []

    selectedInsurersWithEmail: any
    selectedInsurersWithEmailMaster: any

    selectInsurances: any;
    selectedInsuer: any;
    AllowedProductTemplate = AllowedProductTemplate;

    payload: IMappedRmEmailICName[] = []

    @Output() mappedIcNamesChange = new EventEmitter<IMappedRmEmailICName[]>();


    ngOnInit(): void {
        this.getInsurerList();
    }

    ngOnChanges(e) {
        console.log(e)
    }

    getInsuranceCompanyMapping() {
        this.quoteService.getInsuranceCompanyMapping(this.quote._id).subscribe({
            next: (dto: IManyResponseDto<IMappedRmEmailICName>) => {
                var obj = {};
                this.optionsInsurer = dto.data.entities
                if (this.optionsInsurer.length > 0) {
                    this.optionsInsurer.forEach(element => {
                        if (element.isAutoAssignActive) {
                            element.mappedRmEmails.forEach(elementEmails => {
                                if (!elementEmails.toShow) {
                                    this.selectedInsurers.push(element.name)
                                    obj[element.name] = elementEmails.email;
                                    this.selectedInsurersWithEmail = (obj);
                                }
                            });
                        }
                        else {
                            element.mappedRmEmails.forEach(elementEmails => {
                                // if (this.rmMappedIntermediates.some(x => x.rmEmail == elementEmails.email)) {
                                //     elementEmails.toShow = true;
                                // }
                                elementEmails.toShow = true;
                                this.selectedInsurers.push(element.name)
                                obj[element.name] = elementEmails.email;
                                this.selectedInsurersWithEmail = (obj);


                            });
                        }
                    });
                }
                else {
                    this.messageService.add({
                        key: "error",
                        severity: "error",
                        summary: `Error: RM Mapping Emails not found.Contact administrator`,
                        detail: `RM Mapping Emails not found.Contact administrator`
                    });
                }

                //this.rmMappedIntermediates
                if (this.selectedInsurersWithEmail) {

                    this.generatePayload(this.selectedInsurersWithEmail);
                }
                else {
                    for (const insurer of Object.values(this.optionsInsurer)) {

                        this.selectedInsurersWithEmail[insurer.name] = ''
                    }
                }

                // for (const insurer of Object.values(this.optionsInsurer)) {

                //     this.selectedInsurersWithEmail[insurer.name] = ''
                // }


            },
            error: error => {
                console.log(error);
            }
        });
    }
    // getInsurerList() {
    //     //Broker Module
    //     // if (this.quote.partnerId['brokerModeStatus'] == true) {
    //         //PA- for GMC take rm mapping insurer
    //         // if (this.quote?.productId['productTemplate'] == AllowedProductTemplate.GMC) {
    //             this.quoteService.getInsuranceCompanyMapping(this.quote._id).subscribe({
    //                 next: (dto: IManyResponseDto<IMappedRmEmailICName>) => {
    //                     var obj = {};
    //                     this.optionsInsurer = dto.data.entities
    //                     if (this.optionsInsurer.length > 0) {
    //                         this.optionsInsurer.forEach(element => {
    //                             if (element.isAutoAssignActive) {
    //                                 element.mappedRmEmails.forEach(elementEmails => {
    //                                     if (!elementEmails.toShow) {
    //                                         this.selectedInsurers.push(element.name)
    //                                         obj[element.name] = elementEmails.email;
    //                                         this.selectedInsurersWithEmail = (obj);
    //                                     }
    //                                 });
    //                             }
    //                             else {
    //                                 element.mappedRmEmails.forEach(elementEmails => {
    //                                   elementEmails.toShow = true;
    //                                     if (!this.selectedInsurers.includes(element.name)) {
    //                                         this.selectedInsurers.push(element.name)
    //                                     }
    //                                     obj[element.name] = elementEmails.email;
    //                                     this.selectedInsurersWithEmail = (obj);


    //                                 });
    //                             }
    //                         });
    //                     }
    //                     else {
    //                         this.messageService.add({
    //                             key: "error",
    //                             severity: "error",
    //                             summary: `Error: RM Mapping Emails not found.Contact administrator`,
    //                             detail: `RM Mapping Emails not found.Contact administrator`
    //                         });
    //                     }

    //                     //this.rmMappedIntermediates
    //                     if (this.selectedInsurersWithEmail) {

    //                         this.generatePayload(this.selectedInsurersWithEmail);
    //                     }
    //                     else {
    //                         for (const insurer of Object.values(this.optionsInsurer)) {

    //                             this.selectedInsurersWithEmail[insurer.name] = ''
    //                         }
    //                     }
    //                 },
    //                 error: error => {
    //                     console.log(error);
    //                 }
    //             });

    //         // }
    //         // else {
    //         //     //For BLUS products - PA
    //         //     this.quote.insurerDetails.forEach((ele) => {
    //         //         this.selectedInsurers = [...this.selectedInsurers, ...ele.name];
    //         //     })
    //         //     this.mappedIcNamesChange.emit(this.selectedInsurers);
    //         // }

    //     // } else {

    //     //     this.getInsuranceCompanyMapping();
    //     // }

    // }

    getInsurerList() {
        //Broker Module
        // if(this.quote.partnerId['brokerModeStatus'] == true){
        //     this.quote.insurerDetails.forEach((ele)=>{
        //         this.selectedInsurers = [...this.selectedInsurers, ...ele.name];
        //     })
        //     this.mappedIcNamesChange.emit(this.selectedInsurers);
        // }else{
        this.quoteService.getInsuranceCompanyMapping(this.quote._id).subscribe({
            next: (dto: IManyResponseDto<IMappedRmEmailICName>) => {
                var obj = {};
                this.optionsInsurer = dto.data.entities
                if (this.optionsInsurer.length > 0) {
                    this.optionsInsurer.forEach((element: any) => {
                        element.hideSendMailButton = true;
                        if (element.isAutoAssignActive) {
                            element.mappedRmEmails.forEach(elementEmails => {
                                if (!elementEmails.toShow) {
                                    this.selectedInsurers.push(element.name)
                                    obj[element.name] = elementEmails.email;
                                    this.selectedInsurersWithEmail = (obj);
                                }
                            });
                        }
                        else {
                            element.mappedRmEmails.forEach(elementEmails => {
                                // if (this.rmMappedIntermediates.some(x => x.rmEmail == elementEmails.email)) {
                                //     elementEmails.toShow = true;
                                // }
                                elementEmails.toShow = true;
                                this.selectedInsurers.push(element.name)
                                obj[element.name] = elementEmails.email;
                                this.selectedInsurersWithEmail = (obj);


                            });
                        }
                    });
                }
                else {
                    this.messageService.add({
                        key: "error",
                        severity: "error",
                        summary: `Error: RM Mapping Emails not found.Contact administrator`,
                        detail: `RM Mapping Emails not found.Contact administrator`
                    });
                }

                //this.rmMappedIntermediates
                if (this.selectedInsurersWithEmail) {

                    this.generatePayload(this.selectedInsurersWithEmail);
                }
                else {
                    for (const insurer of Object.values(this.optionsInsurer)) {

                        this.selectedInsurersWithEmail[insurer.name] = ''
                    }
                }

                // for (const insurer of Object.values(this.optionsInsurer)) {

                //     this.selectedInsurersWithEmail[insurer.name] = ''
                // }


            },
            error: error => {
                console.log(error);
            }
        });

        // }

    }


    getRmMappedImermediate() {

        // var payload = {
        //     intermediatePartnerId: "641bfa1e0ed0d6f1a7b6b454",
        //     rmUserId: "653cc205af2e64d234716ebc",
        //     rmEmail: "fg_rm@alwrite.com",
        //     active: true
        // }

        // this.rmMappedService.create(payload).subscribe({
        //     next: quote => {
        //         console.log("Added Successfully");
        //     },
        //     error: error => {
        //         console.log(error);
        //     }
        // });
        this.rmMappedService.getManyAsLovs(DEFAULT_RECORD_FILTER).subscribe({
            next: (dto: IManyResponseDto<IRmMappedIntermediate>) => {
                this.rmMappedIntermediates = dto.data.entities
                this.getInsurerList();
            },
            error: error => {
                console.log(error);
            }
        });
    }

    filterInsurers(inputText) {
        // TODO: Need to filter on search input


        if (inputText) {
            this.optionsInsurer = this.optionsInsurer.filter((item) => {
                return item.name.toLowerCase().includes(inputText.toLowerCase())
            })

        } else {
            this.getInsurerList()
        }
        // if (e) {
        //     this.optionsInsurer = this.insurer.filter(options => {
        //         if (options.name.toLowerCase().includes(e.toLowerCase())) {
        //             return true;
        //         }
        //         else {
        //             let emailSearch = false;
        //             options.mappedRmEmails.forEach(managers => {
        //                 if (managers.email.toLowerCase().includes(e.toLowerCase())) {
        //                     emailSearch = true
        //                 }
        //             })
        //             return emailSearch;
        //         }
        //     })
        // } else {
        //     this.optionsInsurer = this.insurer;
        // }
    }
    //Brker Module

    selectInsurance(insurance) {
        this.selectInsurances = insurance;
        // const latestInsuranceCompany = this.selectInsurances[this.selectInsurances.length - 1];
        // this.selectInsurances.length = 0;
        // this.selectInsurances.push(latestInsuranceCompany);

    }

    selectInsurer(event, insurers) {
        insurers.hideSendMailButton = !insurers.hideSendMailButton;
        this.selectedInsurers = event;
        // for (let [insurerName, rmEmail] of Object.entries(this.selectedInsurersWithEmail)) {
        //     if (!this.selectedInsurers.includes(insurerName)) {
        //this.selectedInsurersWithEmail[insurerName] = ''        
        //       this.generatePayload(this.selectedInsurersWithEmail);
        //     }
        //     else{
        //         console.log("here")
        //     }

        // }
        let filteredInsurerWithEmailMaster: any = {};
        for (let [insurerName, rmEmail] of Object.entries(this.selectedInsurersWithEmail)) {
            if (this.selectedInsurers.includes(insurerName)) {
                filteredInsurerWithEmailMaster[insurerName] = rmEmail;
            }
        }
        this.generatePayload(filteredInsurerWithEmailMaster);



    }

    isDisabledRmEmail(insurerName): boolean {
        return !this.selectedInsurers?.find((item) => item == insurerName)
    }

    rmEmailChanged(rmEmail) {
        this.generatePayload(this.selectedInsurersWithEmail);
    }
    getFlag(insurerName, rmEmail) {
        let rmMapped = this.optionsInsurer.filter(x => x.name == insurerName)[0]
        return rmMapped.mappedRmEmails[0].toShow
    }

    generatePayload(selectedInsurersWithEmail) {

        this.payload = []
        for (let [insurerName, rmEmail] of Object.entries(selectedInsurersWithEmail)) {
            if (rmEmail) {
                let insurerBrokerAutoFlowStatus = this.optionsInsurer?.find(insurer => insurer.name === insurerName);
                this.payload.push({
                    name: insurerName,
                    mappedRmEmails: [{
                        email: rmEmail as string,
                        toShow: this.getFlag(insurerName, rmEmail as string)
                    }
                    ],
                    isAutoAssignActive: true,
                    brokerAutoFlowStatus: insurerBrokerAutoFlowStatus?.brokerAutoFlowStatus,
                })
            }
        }
        this.mappedIcNamesChange.emit(this.payload);
        // console.log('payload',this.payload)
    }

    //Broker Module

    openSendMailDialog() {
        console.log(this.quoteOption, 'mahhhhhhhhhhhhhhhhhhhhh');


        const ref = this.dialogService.open(SendMailComponent, {
            width: '650px',
            // height:'500px',
            // data: { insureName: this.quote.quoteNo, insureType: this.quote.productId['type'] }
            data: { insureName: this.quote.quoteNo, quoteOption: this.quoteOption, insureType: this.quote.productId['type'], gmcQuoteOption: this.gmcQuoteOption }
        })
        this.isClick.emit(true);
        ref.onClose.subscribe(() => {


        });
    }
    checkboxValue(val) {
        this.selectedInsuer = val;
    }

}
