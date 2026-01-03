import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import { ICity } from "../../city/city.model";
import { CityService } from "../../city/city.service";
import { ICountry } from "../../country/country.model";
import { CountryService } from "../../country/country.service";
import { IDistrict } from "../../district/district.model";
import { DistrictService } from "../../district/district.service";
import { IPincode } from "../../pincode/pincode.model";
import { PincodeService } from "../../pincode/pincode.service";
import { IMappedICName, IMappedRmEmail, IMappedRmEmailICName, IPartner } from "../partner.model";
import { PartnerService } from "../partner.service";
import { ChipsModule } from 'primeng/chips';
import { IState } from "../../state/state.model";
import { StateService } from "../../state/state.service";
import { OPTIONS_PARTNER_TYPES } from '../partner.model'
import { IProductPartnerConfiguration } from "../../product-partner-configuration/product-partner-configuration.model";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { ProductPartnerConfigurationService } from "../../product-partner-configuration/product-partner-configuration.service";
import { Table } from "primeng/table";
import { ProductService } from "../../product/product.service";
import { CustomValidator } from "src/app/shared/validators";
import { Encryption } from "src/app/shared/encryption";


// const DEFAULT_RECORD_FILTER = {
//     first: 0,
//     rows: 0,
//     sortField: "",
//     sortOrder: 1,
//     multiSortMeta: [],
//     filters: {}
//   };
@Component({
    selector: "app-partner-form",
    templateUrl: "./partner-form.component.html",
    styleUrls: ["./partner-form.component.scss"]
})
export class PartnerFormComponent implements OnInit {
    id: string;
    mode: FormMode = "new";
    recordForm: FormGroup;
    submitted: boolean = false;

    recordSingularName = "Partner";
    recordPluralName = "Partners";
    modulePath: string = "/backend/admin/partners";
    modulepartnerPath: string = "/backend/admin/product-partner-configuration";

    optionsCities: ILov[] = [];
    optionsDistricts: ILov[] = [];
    optionsStates: ILov[] = [];
    optionsPincodes: ILov[] = [];
    optionsCountries: ILov[] = [];
    optionsPartnerType: ILov[] = [];
    optionsProducts: ILov[] = [];
    optionsPartnerId: ILov[] = [];
    optionsInsurerPartnerId: ILov[] = [];

    cols: any[];
    records: IProductPartnerConfiguration[];
    selectedRecord: IProductPartnerConfiguration | null = null;
    selectedRecords: IProductPartnerConfiguration[] = [];
    deleteRecordDialog: boolean = false;
    deleteSelectedRecordsDialog: boolean = false;
    totalRecords: number;
    loading: boolean;
    selectAll: boolean = false;
    partnerDetail: any
    partner:any
    logoImagelocal = false;

    showMappingDiv: boolean;
    constructor(
        private recordService: PartnerService,
        private cityService: CityService,
        private districtService: DistrictService,
        private pincodeService: PincodeService,
        private countryService: CountryService,
        private stateService: StateService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private router: Router,
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private messageService: MessageService,
        private partnerService: PartnerService,
        private productPartnerConfigurationService: ProductPartnerConfigurationService,

    ) {
        this.optionsPartnerType = OPTIONS_PARTNER_TYPES;
        this.optionsPartnerType = this.optionsPartnerType.filter(item => item.value != "self")
    }

    ngOnInit(): void {


        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        console.log(this.id)

        if (this.id != "new") {
            this.partnerService.get(this.id).subscribe(partner => {
                this.partnerDetail = partner.data.entity
                console.log(this.partnerDetail)
            })
        }
        
        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IPartner>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {
                            label: `${dto.data.entity.name}`,
                            routerLink: [`${this.modulePath}/new`]
                        }
                    ]);
                    this.partner = dto.data.entity
                    this.createForm(dto.data.entity);
                },
                error: e => {
                    console.log(e);
                }
            });
        } else {
            this.breadcrumbService.setItems([
                { label: "Pages" },
                {
                    label: `Add new ${this.recordSingularName}`,
                    routerLink: [`${this.modulePath}/new`]
                }
            ]);
        }

        // mode: New

        this.createForm();

        this.cols = [
            { field: "partnerId", header: "partnerId" },
            { field: "productId", header: "productId" },

        ];
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                partnerType: [
                    {
                        value: 'insurer',
                        matchMode: "equals",
                        operator: "or"
                    }
                ],
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.partnerService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsInsurerPartnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
                console.log( data.data.entities)
            },
            error: e => { }
        });
    }
    // loadRecords(event: LazyLoadEvent) {

    //     console.log(event);

    //     this.loading = true;
    //     this.productPartnerConfigurationService.getMany(event).subscribe({
    //       next: records => {
    //         console.log(records);

    //         this.records = records.data.entities;
    //         this.totalRecords = records.results;
    //         this.loading = false;
    //       },
    //       error: e => {
    //         console.log(e);
    //       }
    //     });
    //   }

    //   createRecord() {
    //     this.router.navigateByUrl(`${this.modulepartnerPath}/new`);
    //   }

    //   editRecord(record) {
    //     this.router.navigateByUrl(`${this.modulepartnerPath}/${record._id}`);
    //   }

    //   openDeleteRecordConfirmationDialog(selectedRecord) {
    //     this.deleteRecordDialog = true;
    //     this.selectedRecord = { ...selectedRecord };
    //   }

    createForm(partner?: IPartner) {
        console.log(">>>>>123", partner);
        const city: ICity = partner?.cityId as ICity;
        const district: IDistrict = partner?.districtId as IDistrict;
        const pincode: IPincode = partner?.pincodeId as IPincode;
        const country: ICountry = partner?.countryId as ICountry;
        const state: IState = partner?.stateId as IState;
        let pan
        let gstin
        let cin
        if(partner?.pan) pan = Encryption.decryptData(partner?.pan)
        if(partner?.gstin) gstin = Encryption.decryptData(partner?.gstin)
        if(partner?.cin) cin = Encryption.decryptData(partner?.cin)
        if(partner?.logo) this.logoImagelocal = true

        this.recordForm = this.formBuilder.group({
            _id: [partner?._id],
            partnerType: [partner?.partnerType, [Validators.required]],
            name: [partner?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
            shortName: [partner?.shortName, [Validators.required]],
            status: [(partner?.status ?? true)],
            underwriterMappingFlag: [(partner?.underwriterMappingFlag ?? true)],
            brokerModeStatus: [(partner?.brokerModeStatus ?? false)],
            brokerAutoFlowStatus: [(partner?.brokerAutoFlowStatus ?? false)],
            isRiskInspection: [(partner?.isRiskInspection ?? false)],

            address: [partner?.address, [Validators.required]],
            pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null, [Validators.required]],
            cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
            districtId: [district ? { label: district.name, value: district._id } : null, [Validators.required]],
            stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
            countryId: [country ? { label: country.name, value: country._id } : null, [Validators.required]],

            pan: [pan ?? partner?.pan, [Validators.required, CustomValidator.panValidator]],
            gstin: [gstin ?? partner?.gstin, [Validators.required, CustomValidator.gstValidator]],
            cin: [cin ?? partner?.cin, [Validators.required, CustomValidator.cinValidator]],
            logo: [partner?.logo, []],

            // contactPerson: [partner?.contactPerson, [Validators.required]],
            // designation: [partner?.designation, [Validators.required]],
            // mobileNumber: [partner?.mobileNumber, [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
            mappedIcNames: [partner?.mappedIcNames?.map(a => a.icPartnerId), []],
            vendorName: [partner?.vendorName],
            vendorCode: [partner?.vendorCode],
            agentCode: [partner?.agentCode],
            locationCount:[partner?.locationCount],
            isAutoAssignActive:[partner?.isAutoAssignActive, partner?.partnerType=='insurer' ? [Validators.required] : []],
            concurrentSesssion:[partner?.concurrentSesssion ?? true],
            isRate:[(partner?.isRate ?? false)],
            isBrokerMappedFromMaster:[partner?.isBrokerMappedFromMaster ?? true]

            // formArray: this.fb.array(items.length > 0 ? items.map((item: IBscSignage) => this.createForm(item)) : [this.createForm()]),
            // mappedIcNames: this.formBuilder.array([this.createICMappingFormRow(partner)]),
            // mappedIcNames: this.formBuilder.array(partner?.mappedIcNames?.length > 0 ? partner?.mappedIcNames.map((icName: IMappedRmEmailICName) => this.createICMappingFormRow(icName)) : []),
            // icNamesArray: this.formBuilder.array([this.createICNamesFormRow()]),

        });
        // console.log(partner?.mappedIcNames.map(a => a.icPartnerId)),

        this.recordForm.controls['pincodeId'].valueChanges.subscribe(pincode => {

            console.log(pincode)
            if (pincode && (pincode?.value || pincode?.value?.length == 6)) {

                this.pincodeService.get(pincode.value).subscribe({
                    next: (dto: IOneResponseDto<IPincode>) => {
                        console.log(dto.data.entity);

                        const pincode = dto.data.entity as IPincode

                        const country = pincode.countryId as ICountry;
                        const city = pincode.cityId as ICity;
                        const state = pincode.stateId as IState;
                        const district = pincode.districtId as IDistrict;

                        this.recordForm.controls['cityId'].setValue({ value: city._id, label: city.name });
                        this.recordForm.controls['stateId'].setValue({ value: state._id, label: state.name });
                        this.recordForm.controls['districtId'].setValue({ value: district._id, label: district.name });
                        this.recordForm.controls['countryId'].setValue({ value: country._id, label: country.name });
                    }
                })
            }
        })

        console.log(this.recordForm)
    }

    saveRecord() {
        this.recordService.setFilterValueExist(true);
        console.log(this.recordForm);

        if (this.recordForm.valid) {
            const updatePayload = { ...this.recordForm.value };
            updatePayload["cityId"] = this.recordForm.value["cityId"].value;
            updatePayload["districtId"] = this.recordForm.value["districtId"].value;
            updatePayload["pincodeId"] = this.recordForm.value["pincodeId"].value;
            updatePayload["countryId"] = this.recordForm.value["countryId"].value;
            updatePayload["stateId"] = this.recordForm.value["stateId"].value;

            updatePayload["mappedIcNames"] = this.recordForm.value['mappedIcNames']?.map((icPartnerId: IMappedICName) => ({
                icPartnerId: icPartnerId,
                // mappedRmEmails: icName.mappedRmEmails.map((rmEmail: IMappedRmEmail) => ({ email: rmEmail }))
            }))

            console.log(updatePayload["mappedIcNames"])
            updatePayload['pan'] = Encryption.encryptData(updatePayload['pan']);
            updatePayload['gstin'] = Encryption.encryptData(updatePayload['gstin']);
            updatePayload['cin'] = Encryption.encryptData(updatePayload['cin']);

            console.log(JSON.stringify(updatePayload['mappedIcNames']))
            // updatePayload['mappedIcNames'] = this.recordForm.value['mappedIcNames'];
            let bscFormData = new FormData();
            // bscFormData.append("address", updatePayload['address']);
            // bscFormData.append("agentCode", updatePayload['agentCode']);
            // bscFormData.append("cin", updatePayload['cin']);
            // bscFormData.append("cityId", updatePayload['cityId']);
            // bscFormData.append("contactPerson", updatePayload['contactPerson']);
            // bscFormData.append("countryId", updatePayload['countryId']);
            // bscFormData.append("designation", updatePayload['designation']);
            // bscFormData.append("districtId", updatePayload['districtId']);
            // bscFormData.append("gstin", updatePayload['gstin']);
            // bscFormData.append("locationCount", updatePayload['locationCount']);
            // bscFormData.append("mappedIcNames", JSON.stringify(updatePayload['mappedIcNames']));
            // bscFormData.append("mobileNumber", updatePayload['mobileNumber']);
            // bscFormData.append("name", updatePayload['name']);
            // bscFormData.append("pan", updatePayload['pan']);
            // bscFormData.append("partnerType", updatePayload['partnerType']);
            // bscFormData.append("pincodeId", updatePayload['pincodeId']);
            // bscFormData.append("shortName", updatePayload['shortName']);
            // bscFormData.append("stateId", updatePayload['stateId']);
            // bscFormData.append("status", updatePayload['status']);
            // bscFormData.append("vendorCode", updatePayload['vendorCode']);
            // bscFormData.append("_id", updatePayload['_id'] ? updatePayload['_id'] : '')
            // bscFormData.append("file", updatePayload['logo']);


            console.log(">>>>>", updatePayload)

            if (this.mode === "edit") {
                this.recordService.update(this.id, updatePayload).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
            if (this.mode === "new") {
                this.recordService.create(updatePayload).subscribe({
                    next: partner => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }


    onCancel() {
        this.recordService.setFilterValueExist(true);
        this.router.navigateByUrl(`${this.modulePath}`);
    }

    onclear(){
        console.log("In")
        this.deletefile()
    }

    searchOptionsCities(event) {
        this.cityService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchOptionsDistricts(event) {
        this.districtService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsDistricts = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchOptionsPincodes(event) {
        this.pincodeService.getManyAsLovs(event).subscribe({
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

    searchOptionsStates(event) {
        this.stateService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    isFile(val): boolean {
        console.log(typeof val);
        return typeof val === 'object';
    }

    onBasicUpload(e) {
       
        let bscFormData = new FormData();
        bscFormData.append("logo", e.currentFiles[0]);
        this.partnerService.logoUpload(bscFormData).subscribe(res => {
            this.recordForm.value.logo = res.data.entity['url']
        })
    }

    deletefile(){
        this.recordForm.controls['logo'].setValue(null);
        this.logoImagelocal = false
    }

    // Insurance Company Mapping Recursive Form

    // get mappedIcNames(): FormArray {
    //     return this.recordForm.get("mappedIcNames") as FormArray;
    // };

    // createICMappingFormRow(mappedIcName?: IMappedRmEmailICName): FormGroup {
    //     console.log(">>>>>ICNAME", mappedIcName);

    //     return this.formBuilder.group({
    //         name: [mappedIcName?.name, [Validators.required]],
    //         mappedRmEmails: [mappedIcName?.mappedRmEmails?.map((rmEmail: IMappedRmEmail) => rmEmail.email), []],  // rmEmail: [['harish@test.com'], []],
    //     });
    // };

    // onAddICMappingRow(): void {
    //     this.mappedIcNames.push(this.createICMappingFormRow());
    // };

    // onDeleteICMappingRow(rowIndex: number): void {
    //     this.mappedIcNames.removeAt(rowIndex);
    // }


    // Repeat RM emails

    // onAddRMEmailsRow(): void {
    //   this.icNamesArray.push(this.createICNamesFormRow());
    // };

    // createICNamesFormRow(): FormGroup {
    //   return this.formBuilder.group({
    //       icName: ["Harish", [Validators.required]],
    //       rmEmail: ['harish@test.com', []],
    //   });
    // };

    // onClocse() {
    //     this.router.navigateByUrl(`${this.modulePath}`);
    //   }

    //   searchOptionsProducts(event) {
    //     this.productService.getManyAsLovs(event).subscribe({
    //       next: data => {
    //         this.optionsProducts = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
    //       },
    //       error: e => { }
    //     });
    //   }
    //   searchOptionsPartnerId(event) {
    //     this.partnerService.getManyAsLovs(event).subscribe({
    //       next: data => {
    //         this.optionsPartnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
    //       },
    //       error: e => { }
    //     });
    //   }

    addValidator(e){
        if(e.value=='insure'){
            this.recordForm.get('isAutoAssignActive')?.clearValidators()
            this.recordForm.controls['isAutoAssignActive'].addValidators(Validators.required);
            this.recordForm.controls['isAutoAssignActive'].updateValueAndValidity();
        }else{
            this.recordForm.get('isAutoAssignActive')?.clearValidators()
            this.recordForm.controls['isAutoAssignActive'].updateValueAndValidity();
        }
    }
}
export class MyModel {

    values: string[];

}
