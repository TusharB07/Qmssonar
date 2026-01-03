import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormMode, ILov, IOneResponseDto } from 'src/app/app.model';
import { ToWords } from 'to-words';
import { ICity } from '../../admin/city/city.model';
import { IClientLocation } from '../../admin/client-location/client-location.model';
import { ClientLocationService } from '../../admin/client-location/client-location.service';
import { IOccupancyRate, ISubOccupancy } from '../../admin/occupancy-rate/occupancy-rate.model';
import { OccupancyRateService } from '../../admin/occupancy-rate/occupancy-rate.service';
import { IPincode } from '../../admin/pincode/pincode.model';
import { IQuoteLocationOccupancy } from '../../admin/quote-location-occupancy/quote-location-occupancy.model';
import { QuoteLocationOccupancyService } from '../../admin/quote-location-occupancy/quote-location-occupancy.service';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateService } from '../../admin/state/state.service';
import { CityService } from '../../admin/city/city.service';
import { PincodeService } from '../../admin/pincode/pincode.service';
import { CountryService } from '../../admin/country/country.service';
import { IState } from '../../admin/state/state.model';
import { IClient } from '../../admin/client/client.model';
import { ICountry } from '../../admin/country/country.model';
import { AppService } from 'src/app/app.service';
import { UploadStepWiseExcelForQuoteComponent } from '../../quote/components/upload-step-wise-excel-for-quote/upload-step-wise-excel-for-quote.component';
import { IQuoteSlip } from '../../admin/quote/quote.model';
import { SubOccupancyService } from '../../admin/sub-occupancy/sub-occupancy.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {},
    globalFilter: ''
};

interface Marker {
    lat: number;
    lng: number;
    label: string;
    draggable: boolean;
    cityId?: string;  // Optional properties
    stateId?: string; // Optional properties
    placeId?: string; // Optional properties
  }


@Component({
    selector: 'app-create-risk-location-occupancy-dialog',
    templateUrl: './create-risk-location-occupancy-dialog.component.html',
    styleUrls: ['./create-risk-location-occupancy-dialog.component.scss']
})
export class CreateRiskLocationOccupancyDialogComponent implements OnInit {
    quote_id: string;

    private apiKey = 'AIzaSyDshPQ0dxKnI9YK-uQDJETTjME8R9VklkE'; 
    private geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  

    optionsClientLocations: ILov[] = [];

    occupancies: IOccupancyRate[];
    suboccupancies: ISubOccupancy[];

    selectedClientLocation: ILov
    selectedOccupancyRate: IOccupancyRate;
    selectedSubOccupancy: ISubOccupancy;

    mode: FormMode = "new";

    // toWords = new ToWords();

    isCreateClientLocation: boolean

    totalRecords: number;
    totalSubOccupancies: number;
    loading: boolean;
    subloading: boolean;
    sumInsured: number;

    search: string = '';
    searchSuboccupancy: string = '';
    isMaster: boolean;

    toWords = new ToWords();

    public userQuestion: string;
    public userSubOccupancy: string;
    userQuestionUpdate = new Subject<string>();
    userSubOccupancyUpdate = new Subject<string>();

    optionsStates: ILov[] = [];
    optionsCities: ILov[] = [];
    optionsPincodes: ILov[] = [];
    optionsCountries: ILov[] = [];

    recordForm: FormGroup;
    submitted: boolean = false;

    importOptions: MenuItem[];

    quote: IQuoteSlip;

    totalOccupancy: number;

    partnerCount: number;
    productName: string;
    typeOfShopDescription: string = ''
    isMobile: boolean = false;
    sumInsuredValidateMsg:any;
    isMapVisible: boolean = false;
    //-------------------------------------------------------------------------------------------------

    zoom: number = 14;
    lat: number 
    lng: number 

    clickedMarker(label: string, index: number) {
        console.log(`Clicked marker: ${label} at index ${index}`);
    }

    markers: any[] = [];

    constructor(
        private clientLocationService: ClientLocationService,
        private occupancyRateService: OccupancyRateService,
        private suboccupancyRateService: SubOccupancyService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private quoteLocationOccupancyService: QuoteLocationOccupancyService,
        private activatedRoute: ActivatedRoute,
        private messageService: MessageService,
        private stateService: StateService,
        private cityService: CityService,
        private pincodeService: PincodeService,
        private countryService: CountryService,
        private formBuilder: FormBuilder,
        private appService: AppService,
        private dialogService: DialogService,
        private deviceService: DeviceDetectorService,
        private http: HttpClient
    ) {

        navigator.geolocation.getCurrentPosition(position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            this.zoom = 15;
            this.markers = [{
                lat: this.lat,
                lng: this.lng,
                label: 'You are here',
                draggable: false
              }];
        });
        this.quote_id = this.activatedRoute.snapshot.paramMap.get("id") ?? this.config.data.quote._id;
        this.productName = this.config.data?.productName;
        this.isMobile = this.deviceService.isMobile();

        this.quote = this.config.data.quote;

        this.totalOccupancy = this.config.data.totalRecords

        this.partnerCount = this.config.data.quote.productPartnerConfiguration?.locationCount

        this.userQuestionUpdate.pipe(
            debounceTime(500),
            distinctUntilChanged())
            .subscribe(value => {
                //   this.consoleMessages.push(value);
                this.search = value;
                this.loadData();
            });
        this.userSubOccupancyUpdate.pipe(
            debounceTime(500),
            distinctUntilChanged())
            .subscribe(value => {
                //   this.consoleMessages.push(value);
                this.searchSuboccupancy = value;
                this.loadSuboccupancyData();
            });
    }

    ngOnInit(): void {
        this.createForm();
        if (this.config.data?.quoteLocationOccupancyId) {
            this.mode = "edit";
            this.loadQuoteLocationOccupancy(this.config.data?.quoteLocationOccupancyId)
        }
        this.loadData()
        this.loadSuboccupancyData();
        this.importOptions = [
            {
                label: 'Upload Client Location Excel', icon: 'pi pi-upload', command: () => {
                    this.dialogService.open(UploadStepWiseExcelForQuoteComponent, {
                        header: "Upload Location",
                        data: {
                            quote: this.quote,
                        },
                        width: '35%',
                        height: 'h-100',
                        styleClass: "flatPopup"
                    })
                }
            }
        ];
    }

    initAutocomplete(): void {
    const input = document.getElementById('search-box') as HTMLInputElement;
    console.log(input);
    
        if (input) {
          // Ensure google is properly recognized
          const autocomplete = new google.maps.places.Autocomplete(input);
    
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
    
            if (place.geometry) {
              this.lat = place.geometry.location.lat();
              this.lng = place.geometry.location.lng();
              this.zoom = 15;
    
              // Optionally, add a marker for the searched location
              this.markers = [{
                lat: this.lat,
                lng: this.lng,
                label: place.name,
                draggable: false
              }];
              // Update the map center
              this.updateMap();
            }
          });
        } else {
          console.error('Search box element not found.');
        }
      }

      ngAfterViewInit(): void {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          this.initAutocomplete();
        } else {
          console.error('Google Maps JavaScript API not loaded.');
        }
      }

      updateMap(): void {
        // Perform any additional updates if needed (e.g., recenter map)
      }

    setSearch(value) {
        this.search = value;
        this.loadData();
        this.loadSuboccupancyData();
    }

    setSuboccupancySearch(value) {
        this.searchSuboccupancy = value;
        this.loadSuboccupancyData();
    }

    setSumInsured(value) {
        this.sumInsured = value;
    }

    selectClientLocation(value) {
        this.selectedClientLocation = value
    }

    selectOccupancyRate(occupancy) {
        this.selectedOccupancyRate = occupancy;
        this.loadSuboccupancyData();
    }
    selectsubOccupancyRate(occupancy) {
        this.selectedSubOccupancy = occupancy;
        // this.loadSuboccupancyData();
    }

    loadData() {

        // if (this.search != '') {
        //     event.filters = { global: { value: this.search, matchMode: 'contains' } }
        // }
        this.loading = true;
        this.occupancyRateService.getMatching({
            search: this.search,
            quoteId: this.config.data.quote_id,
            isMaster: this.isMaster,

        }).subscribe({
            next: records => {
                console.log(records);

                this.occupancies = records.data.entities;
                this.totalRecords = records.results;
                this.loading = false;
            },
            error: e => {
                console.log(e);
            }
        });
    }

    loadSuboccupancyData(e?: any) {
        this.subloading = true;
        this.suboccupancyRateService.getMatching({
            search: e?.query ?? '',
            productId: this.quote.productId['_id'] ?? this.quote.productId,
            occupancyId: this.selectedOccupancyRate?._id,

        }).subscribe({
            next: records => {
                console.log(records);

                this.suboccupancies = records.data.entities;
                this.totalSubOccupancies = records.results;
                this.subloading = false;
            },
            error: e => {
                console.log(e);
            }
        });
    }

    loadQuoteLocationOccupancy(quoteLocationOccupancyId: string) {
        this.quoteLocationOccupancyService.get(quoteLocationOccupancyId).subscribe({
            next: (dto: IOneResponseDto<IQuoteLocationOccupancy>) => {
                //   this.createForm(dto.data.entity);
                let record: IQuoteLocationOccupancy = dto.data.entity as IQuoteLocationOccupancy;
                let clientLocation: IClientLocation = record.clientLocationId as IClientLocation;
                let occupancyRate: IOccupancyRate = record.occupancyId as IOccupancyRate;
                let subOccupancy: ISubOccupancy = record.occupancySubTypeId as ISubOccupancy

                this.selectedOccupancyRate = occupancyRate;
                this.selectedSubOccupancy = subOccupancy
                this.typeOfShopDescription = dto.data.entity?.typeOfShopDescription

                this.selectedClientLocation = { value: clientLocation._id, label: clientLocation?.locationName };
                this.sumInsured = record.sumAssured;
            },
            error: e => {
                console.log(e);
            }
        });
    }

    createForm(clientLocation?: IClientLocation) {
        this.recordForm = this.formBuilder.group({
            _id: [null],
            locationName: [null, [Validators.required]],
            address: [null, [Validators.required]],
            pincodeId: [null, [Validators.required]],
            cityId: [{ value: null }, [Validators.required]],
            stateId: [{ value: null }, [Validators.required]],
            countryId: [{ value: null }, [Validators.required]],
            isHeadOffice: [false],
            Latitude: [{ value: null }, [Validators.required]],
            Longitude: [{ value: null }, [Validators.required]],
        });

        this.recordForm.controls['pincodeId'].valueChanges.subscribe(pincode => {
            console.log(pincode);
            
            if (pincode) {
                this.pincodeService.get(pincode.value).subscribe({
                    next: (dto: IOneResponseDto<IPincode>) => {
                        const pincode = dto.data.entity as IPincode
                        const city = pincode.cityId as ICity;
                        const state = pincode.stateId as IState;
                        const country = pincode.countryId as ICountry;

                        this.recordForm.controls['cityId'].setValue({ value: city._id, label: city.name });
                        this.recordForm.controls['stateId'].setValue({ value: state._id, label: state.name });
                        this.recordForm.controls['countryId'].setValue({ value: country._id, label: country.name });
                    }
                })
            }
        })
  }

    searchOptionsClientLocations(event) {

        event.filters = {
            // @ts-ignore
            locationName: [
                {
                    value: event.query,
                    matchMode: "contains",
                    operator: "and"
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
        event.sortField = 'createdAt';
        event.sortOrder = -1;

        this.clientLocationService.getMany(event).subscribe({
            next: data => {
                this.optionsClientLocations = data.data.entities.map(entity => {
                    let city: ICity = entity.cityId as ICity
                    let pincode: IPincode = entity.pincodeId as IPincode

                    //return { label: `${city.name} - ${pincode.name} - ${entity.locationName}`, value: entity._id }
                    return { label: `${entity.locationName} - ${city.name} - ${pincode.name}`, value: entity._id }

                });
            },
            error: e => { }
        });
    }

    submit() {
        if (this.selectedClientLocation?.value && this.config.data.quote_id && this.selectedOccupancyRate && this.sumInsured) {
            if (!this.quote.productId['isOccupancySubTypeShow'] || (this.quote.productId['isOccupancySubTypeShow'] && this.selectedSubOccupancy)) {
                if (!this.quote.productId['isOccupancySubTypeShow'] || (this.selectedSubOccupancy?._id && this.selectedSubOccupancy?.shopName != 'Others') || (this.selectedSubOccupancy?._id && this.selectedSubOccupancy?.shopName == 'Others' && this.typeOfShopDescription)) {
                    if (this.mode == 'edit') {

                        const payload: IQuoteLocationOccupancy = {
                            clientLocationId: this.selectedClientLocation.value,
                            quoteId: this.config.data.quote_id,
                            // New_Quote_Option
                            quoteOptionId: this.config.data.quoteOptionId,
                            occupancyId: this.selectedOccupancyRate._id,
                            occupancySubTypeId: this.selectedSubOccupancy?._id,
                            sumAssured: this.sumInsured,
                            flexaPremium: 0,
                            STFIPremium: 0,
                            earthquakePremium: 0,
                            terrorismPremium: 0,
                            totalPremium: 0,
                            isFlexa: true
                        };

                        if (this.selectedSubOccupancy?._id && this.selectedSubOccupancy?.shopName == 'Others') {
                            payload['typeOfShopDescription'] = this.typeOfShopDescription
                        }
                        else {
                            payload['typeOfShopDescription'] = ''
                        }
                        this.quoteLocationOccupancyService.update(this.config.data?.quoteLocationOccupancyId, payload).subscribe({
                            next: quote => {
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `Risk Location Occupancy Updated`,
                                    life: 3000
                                });
                                this.ref.close();
                            },
                            error: error => {
                                this.sumInsuredValidateMsg = error;
                                console.log(error);
                            }
                        });
                    } else {

                        const payload: IQuoteLocationOccupancy = {
                            clientLocationId: this.selectedClientLocation.value,
                            quoteId: this.config.data.quote_id,
                            // New_Quote_Option
                            quoteOptionId: this.config.data.quoteOptionId,
                            occupancyId: this.selectedOccupancyRate._id,
                            occupancySubTypeId: this.selectedSubOccupancy?._id,
                            sumAssured: this.sumInsured,
                            flexaPremium: 0,
                            STFIPremium: 0,
                            earthquakePremium: 0,
                            terrorismPremium: 0,
                            totalPremium: 0,
                            isFlexa: true
                        };
                        if (this.selectedSubOccupancy?._id && this.selectedSubOccupancy?.shopName == 'Others') {
                            payload['typeOfShopDescription'] = this.typeOfShopDescription
                        }

                        if (this.partnerCount == null || this.partnerCount == 0 || this.totalOccupancy < this.partnerCount) {
                            this.quoteLocationOccupancyService.create(payload).subscribe({
                                next: quote => {
                                    this.totalOccupancy = this.totalOccupancy + 1
                                    this.messageService.add({
                                        severity: "success",
                                        summary: "Successful",
                                        detail: `Risk Location Occupancy Created`,
                                        life: 3000});
                                        this.ref.close();
                                },
                                error: error => {
                                    this.sumInsuredValidateMsg = error
                                    console.log(error);
                                }
                            });
                        } else {
                            // if(this.totalOccupancy > this.partnerCount){
                            this.messageService.add({
                                severity: "error",
                                summary: "Error",
                                detail: `Risk Occupancy Location should not be greater than ` + this.partnerCount,
                                life: 3000
                            })
                            // }
                        }
                    }
                }
                else {
                    if (!this.typeOfShopDescription) {
                        this.messageService.add({
                            severity: "warn",
                            summary: "Validation",
                            detail: `Description of shop is Required`,
                            life: 3000
                        })
                    }
                }
            }
            else {

                if (!this.selectedSubOccupancy && this.quote.productId['isOccupancySubTypeShow']) {
                    this.messageService.add({
                        severity: "warn",
                        summary: "Validation",
                        detail: `Type of Shop Is Required`,
                        life: 3000
                    })
                }
            }
        } else {

            if (!this.selectedClientLocation?.value) {
                this.messageService.add({
                    severity: "warn",
                    summary: "Validation",
                    detail: `Client Location Is Required`,
                    life: 3000
                })
            }

            if (!this.selectedOccupancyRate) {
                this.messageService.add({
                    severity: "warn",
                    summary: "Validation",
                    detail: `Occupancy Is Required`,
                    life: 3000
                })
            }

            if (!this.sumInsured) {
                this.messageService.add({
                    severity: "warn",
                    summary: "Validation",
                    detail: `Sum Insured is requried`,
                    life: 3000
                })
            }
        }

    }

    submitAndAddOther() {
        if (this.partnerCount == null || this.partnerCount == 0 || this.totalOccupancy < this.partnerCount) {
            if (this.selectedClientLocation?.value && this.config.data.quote_id && this.selectedOccupancyRate && this.sumInsured) {
                if (!this.quote.productId['isOccupancySubTypeShow'] || (this.quote.productId['isOccupancySubTypeShow'] && this.selectedSubOccupancy)) {
                    if (!this.quote.productId['isOccupancySubTypeShow'] || (this.selectedSubOccupancy?._id && this.selectedSubOccupancy?.shopName != 'Others') || (this.selectedSubOccupancy?._id && this.selectedSubOccupancy?.shopName == 'Others' && this.typeOfShopDescription)) {
                        const payload: IQuoteLocationOccupancy = {
                            clientLocationId: this.selectedClientLocation.value,
                            quoteId: this.config.data.quote_id,
                            // New_Quote_Option
                            quoteOptionId: this.config.data.quoteOptionId,
                            occupancyId: this.selectedOccupancyRate._id,
                            occupancySubTypeId: this.selectedSubOccupancy?._id,
                            sumAssured: this.sumInsured,
                            flexaPremium: 0,
                            STFIPremium: 0,
                            earthquakePremium: 0,
                            terrorismPremium: 0,
                            totalPremium: 0,
                            isFlexa: true
                        };
                        if (this.selectedSubOccupancy?._id && this.selectedSubOccupancy?.shopName == 'Others') {
                            payload['typeOfShopDescription'] = this.typeOfShopDescription
                        }
                        else {
                            payload['typeOfShopDescription'] = ''
                        }
                        this.quoteLocationOccupancyService.create(payload).subscribe({
                            next: quote => {
                                this.totalOccupancy = this.totalOccupancy + 1
                                // this.ref.close();
                                this.selectedClientLocation = null;
                                this.selectedOccupancyRate = null;
                                this.selectedSubOccupancy = null;
                                this.sumInsured = null;
                                this.messageService.add({
                                    severity: "success",
                                    summary: "Successful",
                                    detail: `Risk Location Occupancy Created`,
                                    life: 3000
                                });
                            },
                            error: error => {
                                console.log(error);
                            }
                        });
                    }
                    else {
                        if (!this.typeOfShopDescription) {
                            this.messageService.add({
                                severity: "warn",
                                summary: "Validation",
                                detail: `Description of shop is Required`,
                                life: 3000
                            })
                        }
                    }
                } else {
                    if (!this.selectedSubOccupancy && this.quote.productId['isOccupancySubTypeShow']) {
                        this.messageService.add({
                            severity: "warn",
                            summary: "Validation",
                            detail: `Type of Shop Is Required`,
                            life: 3000
                        })
                    }
                }
            }
            else {
                this.messageService.add({
                    severity: "warn",
                    summary: "Validation",
                    detail: `Missing Required Fields.`,
                    life: 3000
                })
            }
        } else {

            this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: `Risk Occupancy Location should not be greater than ` + this.partnerCount,
                life: 3000
            })

        }

    }

    deleteRecord() {
        this.quoteLocationOccupancyService.delete(this.config.data.quoteLocationOccupancyId).subscribe({
            next: res => {
                this.ref.close();
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `Risk Location Occupancy Deleted`,
                    life: 3000
                });
                // call the api to fetch the data form user tabel after delete
            },
            error: e => {
                console.log(e)
            }
        });
    }

    openCreateClientLocationDialog() {
        this.isCreateClientLocation = !this.isCreateClientLocation
        this.recordForm.patchValue({
            locationName: '',
            address: '',
            pincodeId: '',
            cityId: '',
            stateId: '',
            countryId: ''
        });
    }

    createClientLocation() {
        if (this.recordForm.valid) {
          const pincode = this.recordForm.value.pincodeId?.label;
    
          if (pincode) {
            this.fetchCoordinatesAndSubmit(pincode);
          } else {
            console.warn('Pincode is not available.');
          }
        } else {
          console.warn('Form is invalid. Please check the fields.');
        }
      }
    
      private fetchCoordinatesAndSubmit(pincode: string) {
        this.getCoordinates(pincode).subscribe({
          next: (response) => {
            if (response.results.length > 0) {
              const location = response.results[0].geometry.location;
              const latitude = location.lat;
              const longitude = location.lng;
    
              // Update the form with fetched coordinates
              this.recordForm.patchValue({
                Latitude: latitude,
                Longitude: longitude
              });
    
              // Prepare the payload for submission
              const updatePayload = { ...this.recordForm.value };
              updatePayload.stateId = this.recordForm.value.stateId?.value;
              updatePayload.cityId = this.recordForm.value.cityId?.value;
              updatePayload.pincodeId = this.recordForm.value.pincodeId?.value;
              updatePayload.countryId = this.recordForm.value.countryId?.value;
              updatePayload.clientId = this.config.data.clientId?._id;
    
              console.log('Payload to be sent:', updatePayload);
    
              // Call clientLocationService to create/update client location
              this.clientLocationService.create(updatePayload).subscribe({
                next: (dto) => {
                  this.isCreateClientLocation = false;
                  // Optionally navigate or perform other actions
                  // this.router.navigateByUrl(`${this.modulePath}`);
                },
                error: (error) => {
                  console.error('Error creating client location:', error);
                }
              });
            } else {
              console.warn('No results found for the pincode.');
            }
          },
          error: (error) => {
            console.error('Error fetching coordinates:', error);
          }
        });
      }
    
      private getCoordinates(pincode: string) {
        // Encode the pincode to ensure it's URL-safe
        const address = encodeURIComponent(pincode);
        const url = `${this.geocodingUrl}?address=${address}&key=${this.apiKey}`;
        return this.http.get<any>(url);
      }
    

    searchOptionsStates(event) {
        this.stateService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchOptionsCities(event) {
        this.cityService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchOptionsPincodes(event) {
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                name: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ],
                // @ts-ignore
                active: [
                    {
                        value: true,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }

        this.pincodeService.getManyAsLovs(event, lazyLoadEvent).subscribe({
            next: data => {
                this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchOptionsCountries(event) {
        this.countryService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsCountries = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    log(event) {
        console.log(event)
    }

    onKeyDown(event: KeyboardEvent) {
        const maxLength = 15;
        if ((event.target as HTMLInputElement).value.length >= maxLength) {
          event.preventDefault();
        }
      }


    onChoseLocation(event: any) {
        console.log('Map click event:', event);
        console.log('Event type:', typeof event);
        
        const lat = event.lat || event.coords?.lat;
        const lng = event.lng || event.coords?.lng;

        this.markers = [{
            lat: lat,
            lng: lng,
            label: 'Selected Location',
            draggable: false
          }];
    
        if (lat !== undefined && lng !== undefined) {
            console.log('Latitude:', lat, 'Longitude:', lng);
    
            // Reverse geocoding API call
            this.http.get<any>(`${this.geocodingUrl}?latlng=${lat},${lng}&key=${this.apiKey}`)
                .subscribe(response => {
                    if (response.results.length > 0) {
                        const result = response.results[0];
                        const addressComponents = result.address_components;
                        const address = result.formatted_address;
                        const addressComponent = addressComponents.find(comp => comp.types.includes('street_address')) || {};
                        const pincodeComponent = addressComponents.find(comp => comp.types.includes('postal_code')) || {};
                        const cityComponent = addressComponents.find(comp => comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) || {};
                        const stateComponent = addressComponents.find(comp => comp.types.includes('administrative_area_level_1')) || {};
                        const countryComponent = addressComponents.find(comp => comp.types.includes('country')) || {};
                        console.log(pincodeComponent);
                        if (pincodeComponent.long_name) {
                            this.searchAndSelectPincode(pincodeComponent.long_name);
                        }
                        // setTimeout(() => {
                        // this.searchOptionsPincodes({ query: '' });
                        // const pincode = pincodeComponent.long_name;
                        // console.log(this.optionsPincodes);
                        // const pincodeOption = this.optionsPincodes.find(option => option.label === pincode);
                        // console.log(pincodeOption);
                        // // this.recordForm.controls['pincodeId'].setValue(pincodeOption.value);
                        // this.recordForm.controls['pincodeId'].updateValueAndValidity();}, 5000);
                        // Update the form values
                        this.recordForm.patchValue({
                            address: address || '',
                            Latitude: lat,
                            Longitude: lng,
                            // pincodeId: pincodeComponent.long_name || '',
                            // cityId: cityComponent.long_name || '',
                            // stateId: stateComponent.long_name || '',
                            // countryId: countryComponent.long_name || ''
                        });
                        setTimeout(() => {
                        this.isMapVisible = false;
                        }, 2000);
                          console.log('Form Data After Map Selection:', this.recordForm.value);
                    } else {
                        console.error('No results found');
                    }
                }, error => {
                    console.error('Error during reverse geocoding:', error);
                });
                
        } else {
            console.error('Latitude and Longitude are undefined');
        }
    }

    searchAndSelectPincode(pincode: string) {
        this.searchOptionsPincodes({ query: pincode });
        // Wait for the pincode options to be updated
        setTimeout(() => {
            const pincodeOption = this.optionsPincodes.find(option => option.label === pincode);
            console.log(pincodeOption);
            if (pincodeOption) {
                this.recordForm.controls['pincodeId'].setValue(pincodeOption);
                this.recordForm.controls['pincodeId'].updateValueAndValidity();
                this.pincodeService.get(pincodeOption.value).subscribe({
                    next: (dto: IOneResponseDto<IPincode>) => {
                        const pincodeEntity = dto.data.entity as IPincode;
                        const city = pincodeEntity.cityId as ICity;
                        const state = pincodeEntity.stateId as IState;
                        const country = pincodeEntity.countryId as ICountry;
                        this.recordForm.controls['cityId'].setValue({ value: city._id, label: city.name });
                        this.recordForm.controls['stateId'].setValue({ value: state._id, label: state.name });
                        this.recordForm.controls['countryId'].setValue({ value: country._id, label: country.name });
                    },
                    error: error => {
                        console.error('Error fetching pincode details:', error);
                    }
                });
            } else {
                console.error('Pincode option not found');
            }
        }, 1000);
    }
    openMap() {
        this.isMapVisible = true;
    }
}
