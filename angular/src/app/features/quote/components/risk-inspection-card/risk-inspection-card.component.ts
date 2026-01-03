import { RiskinspectionmasterService } from './../../../admin/risk-inspection-master/riskinspectionmaster.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { ILov, IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { ListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/list-of-value-master.service';
import { IQuoteLocationOccupancy } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, IQuoteOption, IQuoteSlip, OPTIONS_QUOTE_AGE_OF_BUILDING, OPTIONS_QUOTE_AMC_FOR_FIRE_PROTECTION, OPTIONS_QUOTE_CONSTRUCTION_TYPE, OPTIONS_QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE, OPTIONS_QUOTE_FIRE_PROTECTION, OPTIONS_QUOTE_PREMISES_FLOOR, OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { RiskInspectionStatusViewAllLoactionsDialogComponent } from 'src/app/features/broker/risk-inspection-status-view-all-loactions-dialog/risk-inspection-status-view-all-loactions-dialog.component';
import { ToWords } from 'to-words';

@Component({
    selector: 'app-risk-inspection-card',
    templateUrl: './risk-inspection-card.component.html',
    styleUrls: ['./risk-inspection-card.component.scss']
})
export class RiskInspectionCardComponent implements OnInit, OnChanges {

    quote: IQuoteSlip;
    private currentQuote: Subscription;

    // @Input() permissions: PermissionType[] = []
    currentUser$: Observable<IUser>;
    permissions: PermissionType[] = [];

    toWord = new ToWords();

    riskParametersForm: FormGroup;
    tempForm: FormGroup;

    optionsAgeOfBuilding: ILov[];
    optionsConstructionType: ILov[];
    optionsYearLossHistory: ILov[];
    optionsFireProtection: ILov[];
    optionsAmcProtection: ILov[];
    optionsDistanceBetweenFireBrigade: ILov[];
    optionsPremises: ILov[];
    optionRiskTypes: any[];

    fieldNames: any[] = [];

    riskInspectionReport = {}

    total = 0;

    commercialLoadingDiscount = 0;

    @Input() quoteOptionData: IQuoteOption    // New_Quote_Option

    constructor(
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private formBuilder: FormBuilder,
        private dialogService: DialogService,
        private listOfValueService: ListOfValueMasterService,
        private accountService: AccountService,
        private messageService: MessageService,
        private riskinspectionmasterService: RiskinspectionmasterService,
        private quoteService: QuoteService
    ) {
        this.optionsAgeOfBuilding = OPTIONS_QUOTE_AGE_OF_BUILDING;
        this.optionsConstructionType = OPTIONS_QUOTE_CONSTRUCTION_TYPE
        this.optionsYearLossHistory = OPTIONS_QUOTE_THREE_YEAR_LOSS_HISTORY
        this.optionsFireProtection = OPTIONS_QUOTE_FIRE_PROTECTION
        this.optionsAmcProtection = OPTIONS_QUOTE_AMC_FOR_FIRE_PROTECTION
        this.optionsDistanceBetweenFireBrigade = OPTIONS_QUOTE_DISTANCE_TO_NEAREST_FIRE_BRIGADE
        this.optionsPremises = OPTIONS_QUOTE_PREMISES_FLOOR

        this.currentUser$ = this.accountService.currentUser$

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
            }
        })

    }

    ngOnInit(): void {
        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;
                if (role?.name === AllowedRoles.INSURER_RM || this.quote.quoteState == AllowedQuoteStates.REJECTED) {

                    this.permissions = ['read'];
                } else {

                    this.permissions = ['read', 'update'];
                }
            }
        })
        // this.createDynamicForm()

        // this.loadData()
    }

    ngOnChanges(changes: SimpleChanges): void {
        // this.loadData()
        this.createDynamicForm()
    }

    createDynamicForm() {
        // Old_Quote
        // if(this.quote?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionReport != null){
        //     this.riskInspectionReport = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionReport
        //     this.commercialLoadingDiscount = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.commercialLoadingDiscount
        //     this.createForm(this.riskInspectionReport)
        // }else{
        //     this.createForm()
        // }

        // New_Quote_Option
        if (this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionReport != null) {
            this.riskInspectionReport = this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionReport
            this.commercialLoadingDiscount = this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.commercialLoadingDiscount
            this.createForm(this.riskInspectionReport)
        } else {
            this.createForm()
        }
    }

    createForm(riskInspectionReport?) {
        if (riskInspectionReport) {
            const dynamicFormControls = {};
            this.fieldNames = []
            this.total = 0
            Object.keys(riskInspectionReport).forEach((key) => {

                let obj = {}
                if (riskInspectionReport[key]['label'] && riskInspectionReport[key]['value']) {
                    obj['label'] = riskInspectionReport[key]['label']
                    obj['value'] = riskInspectionReport[key]['value']
                }

                // @ts-ignore
                obj['name'] = key.replaceAll('_', ' ')
                obj['fieldname'] = key
                obj['discount'] = riskInspectionReport[key]['discount']
                obj['fieldValue'] = riskInspectionReport[key]['fieldValue']
                if (riskInspectionReport[key]['parameterCode']) {
                    obj['parameterCode'] = riskInspectionReport[key]['parameterCode']
                }
                this.fieldNames.push(obj)
            })

            this.fieldNames.forEach(fieldName => {
                dynamicFormControls[fieldName.fieldname] = [{ label: fieldName?.label, value: fieldName?.value, discount: fieldName?.discount, fieldValue: fieldName?.fieldValue, parameterCode: fieldName?.parameterCode }, []];
            });

            this.tempForm = this.formBuilder.group(dynamicFormControls);

            // Old_Quote
            // this.total = this.quote?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionDiscount

            // New_Quote_Option
            this.total = this.quoteOptionData?.locationBasedCovers?.quoteLocationOccupancy?.riskInspectionDiscount


        } else {
            let lazyLoadEvent: LazyLoadEvent = {
                first: 0,
                rows: 20,
                sortField: null,
                sortOrder: 1,
                filters: {
                    // @ts-ignore
                    isHeading: [
                        {
                            value: "false",
                            matchMode: "equals",
                            operator: "and"
                        }
                    ],
                    // // @ts-ignore
                    //  isActive : [
                    //     {
                    //         value: "true",
                    //         matchMode: "equals",
                    //         operator: "and"
                    //     }
                    // ],
                    // @ts-ignore
                    partnerId: [
                        {
                            value: this.quote.partnerId['_id'],
                            matchMode: "equals",
                            operator: "and"
                        }
                    ],
                    // @ts-ignore
                    productId: [
                        {
                            value: this.quote.productId['_id'],
                            matchMode: "equals",
                            operator: "and"
                        }
                    ],
                },

                globalFilter: null,
                multiSortMeta: null
            }
            this.fieldNames = []
            this.total = 0
            this.riskinspectionmasterService.getMany(lazyLoadEvent).subscribe({
                next: data => {
                    data.data.entities.map(entity => (this.fieldNames.push({ label: entity.riskTypeOrValue, fieldValue: entity._id, parameterCode: entity?.parameterCode })));
                    const dynamicFormControls = {};
                    this.fieldNames.forEach(fieldName => {
                        // @ts-ignore
                        fieldName.fieldname = fieldName.label.replaceAll(' ', '_')
                        fieldName.name = fieldName.label
                        dynamicFormControls[fieldName.fieldname] = [null, []];
                    });

                    this.tempForm = this.formBuilder.group(dynamicFormControls);
                },
                error: e => { }
            });
        }
    }

    searchoptionRiskTypes(event, field) {

        event = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {

                //@ts-ignore
                parentId: [
                    {
                        value: field.fieldValue,
                        matchMode: "equals",
                        operator: "and"
                    }
                ],

                // @ts-ignore
                riskTypeOrValue: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ],
                // @ts-ignore
                // isActive : [
                //     {
                //         value: "true",
                //         matchMode: "equals",
                //         operator: "and"
                //     }
                // ],
            },
            globalFilter: null,
            multiSortMeta: null
        }


        this.riskinspectionmasterService.getMany(event).subscribe({
            next: data => {
                this.optionRiskTypes = data.data.entities.map(entity => ({ label: entity.riskTypeOrValue, value: entity._id, discount: entity?.discount, parameterCode: entity?.parameterCode }));
            },
            error: e => { }
        });
    }

    submitForm() {

        if (this.tempForm.valid) {
            let payload = {};

            payload['riskInspectionReport'] = { ...this.tempForm.value }

            if (Object.keys(this.riskInspectionReport).length == 0) {
                Object.keys(this.fieldNames).forEach((fieldkey) => {
                    // @ts-ignore
                    Object.keys(payload.riskInspectionReport).forEach((formkey) => {
                        if (this.fieldNames[fieldkey].fieldname.localeCompare(formkey) == 0) {
                            if (payload['riskInspectionReport'][formkey] == null || payload['riskInspectionReport'][formkey] == "") {
                                payload['riskInspectionReport'][formkey] = this.fieldNames[fieldkey]
                                delete payload['riskInspectionReport'][formkey]['label']
                                delete payload['riskInspectionReport'][formkey]['value']
                                delete payload['riskInspectionReport'][formkey]['discount']
                                delete payload['riskInspectionReport'][formkey]['parameterCode']
                            }
                            // @ts-ignore   
                            payload.riskInspectionReport[formkey]['fieldValue'] = this.fieldNames[fieldkey].fieldValue
                        }
                    })
                })
            } else {
                Object.keys(this.fieldNames).forEach((fieldkey) => {
                    // @ts-ignore
                    Object.keys(payload.riskInspectionReport).forEach((formkey) => {
                        if (this.fieldNames[fieldkey].fieldname.localeCompare(formkey) == 0) {
                            if (payload['riskInspectionReport'][formkey] == null || payload['riskInspectionReport'][formkey] == "") {
                                payload['riskInspectionReport'][formkey] = this.fieldNames[fieldkey]
                                delete payload['riskInspectionReport'][formkey]['label']
                                delete payload['riskInspectionReport'][formkey]['value']
                                delete payload['riskInspectionReport'][formkey]['discount']
                                delete payload['riskInspectionReport'][formkey]['parameterCode']
                            }
                            // @ts-ignore   
                            payload.riskInspectionReport[formkey]['fieldValue'] = this.fieldNames[fieldkey].fieldValue
                        }
                    })
                })
            }

            payload['commercialLoadingDiscount'] = this.commercialLoadingDiscount
            payload['riskInspectionDiscount'] = this.total
            payload['totalDiscount'] = Number(this.commercialLoadingDiscount ?? 0) + Number(this.total ?? 0)
            // Old_Quote
            // this.quoteLocationOccupancyService.update(this.quote.locationBasedCovers?.quoteLocationOccupancy._id, payload).subscribe({
            // New_Quote_Option
            this.quoteLocationOccupancyService.update(this.quoteOptionData.locationBasedCovers?.quoteLocationOccupancy._id, payload).subscribe({
                next: (dto: IOneResponseDto<IQuoteLocationOccupancy>) => {
                    // this.router.navigateByUrl(`${this.modulePath}`);
                    this.quoteService.refresh()
                    this.messageService.add({
                        severity: "success",
                        summary: "Successful",
                        detail: `Saved!`,
                        life: 3000
                    });
                },
                error: error => {
                    console.log(error);
                }
            });
        }
    }

    openRiskInspectionStatusDialog() {
        const ref = this.dialogService.open(RiskInspectionStatusViewAllLoactionsDialogComponent, {
            header: "Risk Parameters for all locations",
            data: {
                quote: this.quote,
                quoteOptionData: this.quoteOptionData             // New_Quote_Option
                // quoteLocationOccupancyId: this.quote?.locationBasedCovers.quoteLocationOccupancy._id,
            },
            width: '70%',
            styleClass: 'customPopup'
        })
    }

    computeTotal(e?) {
        this.total = 0

        Object.keys(this.tempForm.value).forEach(fieldName => {
            if (this.tempForm.value[fieldName] && this.tempForm.value[fieldName]?.discount && this.tempForm.value[fieldName] != "") {
                this.total += Number(this.tempForm.value[fieldName]?.discount)
            }
        });
    }

    onclear(e) {
        this.computeTotal()
    }

    // loadData() {
    //     if (this.quote?.locationBasedCovers?.quoteLocationOccupancy?.ageOfBuilding) {
    //         this.createForm(this.quote?.locationBasedCovers?.quoteLocationOccupancy);
    //     }
    //     else {
    //         this.createForm();
    //         this.riskParametersForm.controls['ageOfBuilding'].clearValidators();
    //         this.riskParametersForm.controls['constructionType'].clearValidators();
    //         this.riskParametersForm.controls['yearLossHistory'].clearValidators();
    //         this.riskParametersForm.controls['fireProtection'].clearValidators();
    //         this.riskParametersForm.controls['amcFireProtection'].clearValidators();
    //         this.riskParametersForm.controls['distanceBetweenFireBrigade'].clearValidators();
    //         this.riskParametersForm.controls['premises'].clearValidators();
    //     }
    // }

    // createForm(quoteLocationOccupancy?: IQuoteLocationOccupancy) {
    //     console.log('Form Created')
    //     console.log(quoteLocationOccupancy)
    //     // console.log(quoteLocationOccupancy);
    //     // console.log(this.ageOfBuildingOptions.find(el => el.value == quoteLocationOccupancy?.ageOfBuilding))

    //     // const ageOfBuilding = quoteLocationOccupancy.ageOfBuilding as IListOfValueMaster;

    //     // const constructionType = quoteLocationOccupancy.constructionType as IListOfValueMaster;
    //     // const yearLossHistory = quoteLocationOccupancy.yearLossHistory as IListOfValueMaster;
    //     // const fireProtection = quoteLocationOccupancy.fireProtection as IListOfValueMaster;
    //     // const amcFireProtection = quoteLocationOccupancy.amcFireProtection as IListOfValueMaster;
    //     // const distanceBetweenFireBrigade = quoteLocationOccupancy.distanceBetweenFireBrigade as IListOfValueMaster;
    //     // const riskCovered = quoteLocationOccupancy.riskCovered as IListOfValueMaster;
    //     // const premises = quoteLocationOccupancy.premises as IListOfValueMaster;



    //     this.riskParametersForm = this.formBuilder.group({
    //         ageOfBuilding: [
    //             quoteLocationOccupancy?.ageOfBuilding
    //                 ? this.optionsAgeOfBuilding.find(el => el.value == quoteLocationOccupancy.ageOfBuilding)
    //                 // : this.optionsAgeOfBuilding[0]],
    //                 : null, [Validators.required]],
    //         constructionType: [
    //             quoteLocationOccupancy?.constructionType
    //                 ? this.optionsConstructionType.find(el => el.value == quoteLocationOccupancy.constructionType)
    //                 // : this.optionsConstructionType[0]],
    //                 : null, [Validators.required]],
    //         yearLossHistory: [
    //             quoteLocationOccupancy?.yearLossHistory
    //                 ? this.optionsYearLossHistory.find(el => el.value == quoteLocationOccupancy.yearLossHistory)
    //                 // : this.optionsYearLossHistory[0]],
    //                 : null, [Validators.required]],
    //         fireProtection: [
    //             quoteLocationOccupancy?.fireProtection
    //                 ? this.optionsFireProtection.find(el => el.value == quoteLocationOccupancy.fireProtection)
    //                 // : this.optionsFireProtection[0]],
    //                 : null, [Validators.required]],
    //         amcFireProtection: [
    //             quoteLocationOccupancy?.amcFireProtection
    //                 ? this.optionsAmcProtection.find(el => el.value == `${quoteLocationOccupancy.amcFireProtection}`)
    //                 // : this.optionsAmcProtection[0]],
    //                 : null, [Validators.required]],
    //         distanceBetweenFireBrigade: [
    //             quoteLocationOccupancy?.distanceBetweenFireBrigade
    //                 ? this.optionsDistanceBetweenFireBrigade.find(el => el.value == quoteLocationOccupancy.distanceBetweenFireBrigade)
    //                 // : this.optionsRiskCovered[0]],
    //                 : null, [Validators.required]],
    //         premises: [
    //             quoteLocationOccupancy?.premises
    //                 ? this.optionsPremises.find(el => el.value == quoteLocationOccupancy.premises)
    //                 // : this.optionsPremises[0]],
    //                 : null, [Validators.required]],
    //         // ageOfBuilding: [ageOfBuilding ? { label: ageOfBuilding.lovKey, value: ageOfBuilding._id } : null, [Validators.required]],
    //         // constructionType: [constructionType ? { label: constructionType.lovKey, value: constructionType._id } : null, [Validators.required]],
    //         // yearLossHistory: [yearLossHistory ? { label: yearLossHistory.lovKey, value: yearLossHistory._id } : null, [Validators.required]],
    //         // fireProtection: [fireProtection ? { label: fireProtection.lovKey, value: fireProtection._id } : null, [Validators.required]],
    //         // amcFireProtection: [amcFireProtection ? { label: amcFireProtection.lovKey, value: amcFireProtection._id } : null, [Validators.required]],
    //         // riskCovered: [riskCovered ? { label: riskCovered.lovKey, value: riskCovered._id } : null, [Validators.required]],
    //         // premises: [premises ? { label: premises.lovKey, value: premises._id } : null]
    //     })
    // }

    // submitRiskParameterForm() {
    //     // console.log(this.riskParametersForm)

    //     this.riskParametersForm.controls['ageOfBuilding'].addValidators(Validators.required);
    //     this.riskParametersForm.controls['ageOfBuilding'].updateValueAndValidity();
    //     this.riskParametersForm.controls['constructionType'].addValidators(Validators.required);
    //     this.riskParametersForm.controls['constructionType'].updateValueAndValidity();
    //     this.riskParametersForm.controls['yearLossHistory'].addValidators(Validators.required);
    //     this.riskParametersForm.controls['yearLossHistory'].updateValueAndValidity();
    //     this.riskParametersForm.controls['fireProtection'].addValidators(Validators.required);
    //     this.riskParametersForm.controls['fireProtection'].updateValueAndValidity();
    //     this.riskParametersForm.controls['amcFireProtection'].addValidators(Validators.required);
    //     this.riskParametersForm.controls['amcFireProtection'].updateValueAndValidity();
    //     this.riskParametersForm.controls['distanceBetweenFireBrigade'].addValidators(Validators.required);
    //     this.riskParametersForm.controls['distanceBetweenFireBrigade'].updateValueAndValidity();
    //     this.riskParametersForm.controls['premises'].addValidators(Validators.required);
    //     this.riskParametersForm.controls['premises'].updateValueAndValidity();

    //     const payload = { ...this.riskParametersForm.value };

    //     payload['ageOfBuilding'] = payload['ageOfBuilding']?.value;
    //     payload['constructionType'] = payload['constructionType']?.value;
    //     payload['yearLossHistory'] = payload['yearLossHistory']?.value;
    //     payload['fireProtection'] = payload['fireProtection']?.value;
    //     payload['amcFireProtection'] = payload['amcFireProtection']?.value;
    //     payload['distanceBetweenFireBrigade'] = payload['distanceBetweenFireBrigade']?.value;
    //     payload['premises'] = payload['premises']?.value;

    //     if (this.riskParametersForm.valid) {
    //         this.quoteLocationOccupancyService.update(this.quote.locationBasedCovers?.quoteLocationOccupancy._id, payload).subscribe({
    //             next: (dto: IOneResponseDto<IQuoteLocationOccupancy>) => {
    //                 // this.router.navigateByUrl(`${this.modulePath}`);
    //                 console.log('its here', dto.data.entity)

    //                 this.messageService.add({
    //                     severity: "success",
    //                     summary: "Successful",
    //                     detail: `Risk Parameters Saved`,
    //                     life: 3000
    //                 });
    //             },
    //             error: error => {
    //                 console.log(error);
    //             }
    //         });
    //     }
    // }


}
