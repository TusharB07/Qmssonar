import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { FormMode, ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IBscFireLossOfProfitCover } from '../../admin/bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.model';
import { ICity } from '../../admin/city/city.model';
import { IClientLocation } from '../../admin/client-location/client-location.model';
import { ClientLocationService } from '../../admin/client-location/client-location.service';
import { IClient } from '../../admin/client/client.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from '../../admin/list-of-value-master/list-of-value-master.model';
import { ListOfValueMasterService } from '../../admin/list-of-value-master/list-of-value-master.service';
import { IPartner } from '../../admin/partner/partner.model';
import { IPincode } from '../../admin/pincode/pincode.model';
import { LazyLoadEvent, MenuItem } from 'primeng/api';

import { IProduct } from '../../admin/product/product.model';
import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from '../../admin/quote-location-occupancy/quote-location-occupancy.service';
import { IQuoteSlip, OPTIONS_QUOTE_TYPES } from '../../admin/quote/quote.model';
import { QuoteService } from '../../admin/quote/quote.service';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};


@Component({
    selector: 'app-edit-insured-details-dialog',
    templateUrl: './edit-insured-details-dialog.component.html',
    styleUrls: ['./edit-insured-details-dialog.component.scss']
})
export class EditInsuredDetailsDialogComponent implements OnInit {
    id: string;
    optionsClientLocations: ILov[] = [];
    selectedClientLocation: ILov
    editInsuredDetailsForm: FormGroup;
    cities: any[];
    selectedCities: string = '';
    selectedTypeofPolicy: string = '';
    optionsrenewalPolicyPeriod: ILov[];
    selectedRenewalPolicyPeriod: string = '';
    optionsQuoteLocationOccupancies: ILov[];

    optionsQuoteType: ILov[] = [];
    selectedOption: string;
    private router: Router;

    quote: IQuoteSlip;

    mode: FormMode = "new";

    optionsIndmenityPeriod: ILov[];
    optionsEarthquakeZones: ILov[] = [];
    optionsTerrorism: any[];

    riskStartDate: Date

    today: string;

    selectedQuoteLocationOccpancyId: string;

    constructor(
        private clientLocationService: ClientLocationService,
        private fb: FormBuilder,
        private config: DynamicDialogConfig,
        private listOfValueService: ListOfValueMasterService,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        public ref: DynamicDialogRef,
        private quoteService: QuoteService,
        private activatedRoute: ActivatedRoute,
    ) {

        this.optionsQuoteType = OPTIONS_QUOTE_TYPES;

        this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');

        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.quote = this.config.data.quote;

        this.cities = [];

       
        if(this.quote?.productId['renewalPolicyPeriodinMonthsoryears'] == "Y"){
            this.optionsIndmenityPeriod = [
                { label: '01 Years', value: '01 Years' },
                { label: '02 Years', value: '02 Years' },
                { label: '03 Years', value: '03 Years' },
                { label: '04 Years', value: '04 Years' },
                { label: '05 Years', value: '05 Years' },
                { label: '06 Years', value: '06 Years' },
                { label: '07 Years', value: '07 Years' },
                { label: '08 Years', value: '08 Years' },
                { label: '09 Years', value: '09 Years' },
                { label: '10 Years', value: '10 Years' },
                { label: '11 Years', value: '11 Years' },
                { label: '12 Years', value: '12 Years' }
            ];
        }
       else{
            this.optionsIndmenityPeriod = [
                { label: '03 Months', value: '03 Months' },
                { label: '06 Months', value: '06 Months' },
                { label: '09 Months', value: '09 Months' },
                { label: '12 Months', value: '12 Months' },
                { label: '18 Months', value: '18 Months' },
            ];
        }

        this.optionsTerrorism = [
            { label: 'Yes', value: true },
            { label: 'No', value: false },
        ];

    }

    ngOnInit(): void {
        this.createForm(this.quote);

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                clientId: [
                    {
                        value: this.quote?.clientId,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.clientLocationService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IClientLocation>) => {
                console.log(dto.data.entities)
                // console.log(data)
                this.optionsQuoteLocationOccupancies = dto.data.entities.map((entity: IClientLocation) => {
                    // let clientLocation: IClientLocation = entity.clientLocationId as IClientLocation
                    // let pincode: IPincode = entity.pincodeId as IPincode
                    return { label: `${entity.locationName}`, value: entity._id }
                });

                // let client = this.quote.clientId as IClient

                // let headOfficeLocation = client.headOfficeLocationId as IClientLocation;


                const headOffice = dto.data.entities.find(((location: IClientLocation) => location.isHeadOffice))

                if (headOffice) {
                    this.editInsuredDetailsForm?.controls['clientLocationId'].setValue({ label: headOffice.locationName, value: headOffice._id })
                    this.editInsuredDetailsForm?.controls['clientLocationId'].disable()
                }

                // const headOffice = dto.data.entities.find(((location: IClientLocation) => location.isHeadOffice))

                // if (headOfficeLocation) {
                //     this.editInsuredDetailsForm.controls['clientLocationId'].setValue({ label: headOfficeLocation.locationName, value: headOfficeLocation._id })
                //     this.editInsuredDetailsForm.controls['clientLocationId'].disable()
                // }


                // this.quoteService.setQuoteLocationOccupancyId(this.optionsQuoteLocationOccupancies[0]?.value);
                // this.loadData(this.optionsQuoteLocationOccupancies[0]?.value);
            },
            error: e => { }
        });




    }

    handleRiskLocationOccupancyChange(event) {
        this.loadData(event.value)


    }

    loadData(quoteLocationOccupancyId: string) {
        this.quoteService.setQuoteLocationOccupancyId(quoteLocationOccupancyId)
    }


    searchOptionsrenewalPolicyPeriod(event) {
        this.listOfValueService.current(AllowedListOfValuesMasters.RENEWAL_POLICY_PERIOD).subscribe({
            next: data => {
                this.optionsrenewalPolicyPeriod = data.data.entities.map((entity: IListOfValueMaster) => ({ label: entity.lovKey, value: `${entity._id}` }));
                // this.selectedEquipmentType = this.optionsEquipmentType[0];

            },
            error: e => { }
        })
    }

    createForm(quote: IQuoteSlip) {

        console.log(quote)

        const client = quote.clientId as IClient;
        const product = quote.productId as IProduct;


        //         clientId: {tenantId: 'Client-6310baab3aae4fb988280b3f', _id: '6310baaf3aae4fb98828265f', clientType: 'client 2', name: 'Hasan', shortName: 'HASAN', …}
        // partnerId: "6310baab3aae4fb988280b3f"
        // productId: {_id: '6310baac3aae4fb988280bdf', type: 'Bharat Laghu Udyam Suraksha', category: '', status: true, shortName: 'BLUS', …}
        // quoteNo: "BLUS-HASAN-2022-00000002"
        // quoteType: "new"
        // sectorId: {_id: '6310bab03aae4fb9882827d4', name: 'Engineering Workshop', __v: 0}
        // tenantId: "QuoteSlip-6310baab3aae4fb988280b3f"
        // totalAccompaniedBaggage: 0
        // totalBurglaryHouse: 0
        // totalEarthquake: 0
        // totalFidelityGuarantee: 0
        // totalFireLossOfProfit: 0
        // totalFixedPlateGlass: 0
        // totalFlexa: 19.2
        // totalIndictiveQuoteAmt: 43.2
        // totalLiabilitySection: 0
        // totalMoneySafeTill: 0
        // totalMoneyTransit: 0
        // totalPortableEquipment: 0
        // totalSignage: 0
        // totalStfi: 15
        // totalSumAssured: 190000
        // totalTerrorism: 9
        // totalelectronicEquipment: 0


        let data    

        if(this.quote?.productId['renewalPolicyPeriodinMonthsoryears'] == "Y"){
            const years = Number(quote?.renewalPolicyPeriod .split(" ")[0])/12;
            data = {label : String(years)+' Years', value : String(years)+' Years'}
        }else{
            data = {label : quote?.renewalPolicyPeriod,value : quote?.renewalPolicyPeriod}
        }

        console.log(data)

        this.editInsuredDetailsForm = this.fb.group({
            insuredName: [client.name],
            clientLocationId: [null],
            riskType: [product.type],
            typeofPolicy: [null],
            sumAssured: [quote?.totalSumAssured],
            renewalPolicyPeriod: [data],
            crmId: [quote?.crmId],
            insuredBusiness: [client.natureOfBusiness],
            riskStartDate: [formatDate(this.quote.riskStartDate, 'yyyy-MM-dd', 'en')]
        })
    }


    submitInsuredDetails() {


    }

    selectClientLocation(value) {
        this.selectedClientLocation = value
    }

    openCreateClientLocationDialog() {

    }

    searchOptionsClientLocations(event) {

        event.filters = {
            // @ts-ignore
            name: [
                {
                    value: event.query,
                    matchMode: "startsWith",
                    operator: "or"
                }
            ],
            // @ts-ignore
            clientId: [
                {
                    value: this.config.data.clientId._id,
                    matchMode: "equals",
                    operator: "or"
                }
            ]
        };

        this.clientLocationService.getMany(event).subscribe({
            next: data => {
                this.optionsClientLocations = data.data.entities.map(entity => {
                    console.log(entity)
                    let city: ICity = entity.cityId as ICity
                    let pincode: IPincode = entity.pincodeId as IPincode

                    return { label: `${city.name} - ${pincode.name} - ${entity.locationName}`, value: entity._id }
                });
            },
            error: e => { }
        });
    }

    searchOptionsMandY(e){
        this.optionsIndmenityPeriod = [...this.optionsIndmenityPeriod]  
    }

    formSubmit() {
        if (this.editInsuredDetailsForm.valid) {

            const updatePayload = { ...this.editInsuredDetailsForm.value };
            // updatePayload["stateId"] = this.editInsuredDetailsForm.value["stateId"].value;
            console.log(updatePayload)
            if(this.quote?.productId['renewalPolicyPeriodinMonthsoryears'] == "Y"){
                const months = Number(updatePayload['renewalPolicyPeriod'].value .split(" ")[0])*12;
                delete updatePayload['renewalPolicyPeriod']
                updatePayload['renewalPolicyPeriod'] = String(months) + ' Months'
            }else{
                updatePayload['renewalPolicyPeriod'] = updatePayload['renewalPolicyPeriod'].value
            }
            console.log(updatePayload)

            if (this.mode) {
                this.quoteService.update(this.quote._id, updatePayload).subscribe({
                    next: partner => {
                        //   this.router.navigateByUrl(`${this.modulePath}`);
                        this.ref.close();


                    },

                    error: error => {
                        console.log(error);
                    }
                });


            }


        }
    }


}



