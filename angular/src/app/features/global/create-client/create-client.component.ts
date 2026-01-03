import { Component, OnInit, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { ICity } from '../../admin/city/city.model';
import { CityService } from '../../admin/city/city.service';
import { ClientContactService } from '../../admin/client-contact/client-contact.service';
import { ClientGroupService } from '../../admin/client-group/client-group.service';
import { AllowedClientTypes, AllowedKycTypes, OPTIONS_CLIENT_TYPES, OPTIONS_KYC_TYPES, OPTIONS_KYC_TYPES_FOR_COMPANY_AND_GROUP, OPTION_GENDER_LIST } from '../../admin/client/client.model';
import { ClientService } from '../../admin/client/client.service';
import { IPincode } from '../../admin/pincode/pincode.model';
import { PincodeService } from '../../admin/pincode/pincode.service';
import { IState } from '../../admin/state/state.model';
import { StateService } from '../../admin/state/state.service';
import { CreateClientGroupComponent } from '../../broker/create-client-group/create-client-group.component';
import { IDistrict } from '../../admin/district/district.model';
import { CustomValidator } from 'src/app/shared/validators';
import { Encryption } from 'src/app/shared/encryption';

@Component({
    selector: 'app-create-client',
    templateUrl: './create-client.component.html',
    styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit, OnChanges {

    constructor(
        private formBuilder: FormBuilder,
        private clientService: ClientService,
        private clientContactService: ClientContactService,
        private clientGroupService: ClientGroupService,


        private cityService: CityService,
        private stateService: StateService,
        private pincodeService: PincodeService,

        private dialogService: DialogService,
        private router: Router,
        public ref: DynamicDialogRef,
        public messageService: MessageService,

    ) {
        this.optionGender = OPTION_GENDER_LIST;
        this.optionsClientTypes = OPTIONS_CLIENT_TYPES;
        this.optionKycTypes = OPTIONS_KYC_TYPES;
        this.optionKycTypesForCompanyAndGroup = OPTIONS_KYC_TYPES_FOR_COMPANY_AND_GROUP

        this.createClientForm();
        this.createFormGroup();
        console.log(this.clientForm)
    }

    ngOnInit(): void {
    }

    ngOnChanges() {
        this.optionKycTypes = []
        this.clientForm.controls['clientType'].valueChanges.subscribe(clientType => {
            if (clientType == 'indvidual') {
                this.optionKycTypes = OPTIONS_KYC_TYPES
            } else {
                this.optionKycTypes = OPTIONS_KYC_TYPES_FOR_COMPANY_AND_GROUP
            }
        })
    }

    addCustomValidors(event) {
        switch (event.value) {
            case AllowedKycTypes.AADHARCARD:
                this.clientForm.get('kycNumber')?.clearValidators()
                this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.aadharValidator])
                break;
            case AllowedKycTypes.VOTER:
                this.clientForm.get('kycNumber')?.clearValidators()
                this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.voterIDValidator])
                break;
            case AllowedKycTypes.PASSPORT:
                this.clientForm.get('kycNumber')?.clearValidators()
                this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.passportValidator])
                break;
            case AllowedKycTypes.DL:
                this.clientForm.get('kycNumber')?.clearValidators()
                this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.drivingLicenceValidator])
                break;
            case AllowedKycTypes.CIN:
                this.clientForm.get('kycNumber')?.clearValidators()
                this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.cinValidator])
                break;
            case AllowedKycTypes.PAN:
                this.clientForm.get('kycNumber')?.clearValidators()
                this.clientForm.get('kycNumber')?.setValidators([Validators.required, CustomValidator.panValidator])
                break;

            default:
                break;
        }
        this.clientForm.get('kycNumber')?.updateValueAndValidity()
    }

    optionGender: ILov[] = [];
    optionKycTypes: ILov[] = [];
    optionKycTypesForCompanyAndGroup: ILov[] = [];
    optionsCities: ILov[] = [];
    optionsStates: ILov[] = [];
    optionsPincodes: ILov[] = [];
    optionsClientTypes: ILov[] = [];

    clientForm: FormGroup;
    submittedClientForm: boolean = false;

    selectedClientGroup: ILov;

    optionsClientGroups: ILov[] = [];
    contactDetailsForm: FormGroup

    clientId: any;

    searchOptionsClientGroups(event) {
        this.clientGroupService.getMatchingClientGroups(event.query).subscribe({
            next: data => {
                console.log(data);

                const optionsClientGroups: ILov[] = [];
                for (let i = 0; i < data.data.entities.length; i++) {
                    const entity = data.data.entities[i];
                    optionsClientGroups.push({
                        label: entity.clientGroupName,
                        value: entity._id
                    });
                }
                this.optionsClientGroups = optionsClientGroups;
            },
            error: e => {
                console.log(e);
            }
        });
    }


    createClientForm() {

        this.clientForm = this.formBuilder.group({
            clientType: [null, [Validators.required]],
            clientGroupId: [{ value: null, disabled: true }, []],
            salutation: [null],
            name: [null, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
            // firstName: [null],
            lastName: [null],
            gender: [null],
            contactNo: [null, [Validators.pattern('^[6-9][0-9]{9}$')]],
            email: [null, [CustomValidator.emailValidator]],
            street: [null, []],
            street2: [null],
            street3: [null],
            kycType: [null, []],
            kycNumber: [null, []],
            pincodeId: [null, []],
            stateId: [{ value: null }, []],
            cityId: [{ value: null }, []],
            districtId: [null],
            // shortName: [null, [Validators.pattern("^[a-zA-Z -']+"), Validators.minLength(3)]],
            // pan: [null, [ Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")]],
            // gst: [null, [Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")]],
            dateOfIncorporation: [null, []],

            //     // active: [true, []],
            //     // clientGroupId: [this.selectedClientGroup ? { label: this.selectedClientGroup.label, value: this.selectedClientGroup.value } : null, []],
            //     // clientGroupName: [client?.clientGroupName, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
            //     // pan: ["", [Validators.required, ]],
            //     // gst: ["", [Validators.required, ]],
            //     // copyOfPan: [null, []],
            //     // copyOfPanSource: [null, []],
            // vin: [null, [Validators.required]],
            // leadGenerator: [null, [Validators.pattern("^[a-zA-Z -']+")]],
            // natureOfBusiness: [null, [Validators.pattern("^[a-zA-Z -']+")]],
            // claimsManager: [null, [Validators.pattern("^[a-zA-Z -']+")]],
            // referralRM: [null, [Validators.pattern("^[a-zA-Z -']+")]],
            // referredCompany: [null, [Validators.pattern("^[a-zA-Z -']+")]],
            // employeeStrength: [null, [ Validators.min(0), Validators.max(1000000)]],
            //     // sameAddressVerification: [false, []],

            //     // narration: [null, []]
            //     // clientKycMasterId: [clientKyc ? { label: clientKyc.clientGroupName, value: clientKyc._id } : null, [Validators.required]]
        });


        this.clientForm.controls['pincodeId'].valueChanges.subscribe(pincode => {

            if (pincode) {

                this.pincodeService.get(pincode.value).subscribe({
                    next: (dto: IOneResponseDto<IPincode>) => {
                        console.log(dto.data.entity);

                        const pincode = dto.data.entity as IPincode

                        const city = pincode.cityId as ICity;
                        const state = pincode.stateId as IState;
                        const district = pincode.districtId as IDistrict

                        this.clientForm.controls['districtId'].setValue({ value: district._id, label: district.name });
                        this.clientForm.controls['cityId'].setValue({ value: city._id, label: city.name });
                        this.clientForm.controls['stateId'].setValue({ value: state._id, label: state.name });
                    }
                })
            }
        })

        this.clientForm.controls['clientType'].valueChanges.subscribe(value => {

            console.log(this.clientForm)
            if (value === AllowedClientTypes.GROUP) {
                this.clientForm.controls['clientGroupId'].enable()
            } else {
                this.clientForm.controls['clientGroupId'].disable()
            }
        })

    }

    onCreateClient() {
        // console.log("onCreateClient");
        // console.log(this.selectClientGroupForm.value);

        // if (this.selectClientGroupForm.valid) {
        //     console.log("The client group selection form seems to be valid!!!");
        //     this.selectedClientGroup = this.selectClientGroupForm.value.clientGroupId;

        //     console.log(this.selectedClientGroup);

        //     this.createClientActiveTabIndex = 2;

        //     this.createClientForm();
        // }
    }




    submitContactForm() {
        console.log(this.contactDetailsForm.value)
        if (this.contactDetailsForm.valid) {
            if (this.clientId) {
                // const allFieldsNull = Object.values(contactDetails[0].value).every(value => value == null);
                // console.log(Object.values(contactDetails[0].value))


                const createContactDetailObservables$ = [];

                for (let i = 0; i < this.contactDetailsArray.value.length; i++) {
                    const contactDetail = this.contactDetailsArray.value[i];
                    const contactDetailFormData = new FormData();

                    contactDetailFormData.append("contactPerson", contactDetail["contactPerson"]);
                    contactDetailFormData.append("designation", contactDetail["designation"]);
                    contactDetailFormData.append("phone", contactDetail["phone"]);
                    contactDetailFormData.append("email", contactDetail["email"]);
                    // contactDetailFormData.append("mobile", contactDetail["mobile"]);
                    contactDetailFormData.append("address", contactDetail["address"]);
                    contactDetailFormData.append("stateId", contactDetail["stateId"]?.value);
                    contactDetailFormData.append("cityId", contactDetail["cityId"]?.value);
                    contactDetailFormData.append("pincodeId", contactDetail["pincodeId"]?.value);
                    // contactDetailFormData.append("visitingCard", contactDetail["visitingCardSource"]);
                    contactDetailFormData.append("clientId", this.clientId);


                    createContactDetailObservables$.push(this.clientContactService.createFormData(contactDetailFormData));
                }


                forkJoin(createContactDetailObservables$).subscribe({
                    next: v => {
                        console.log(v);

                        // this.createClientActiveTabIndex = 2;
                        this.router.navigateByUrl(`/backend/quotes/new`);
                    },
                    error: err => {
                        console.log(err);
                    }
                });
            } else {
                this.messageService.add({
                    severity: "warn",
                    summary: "Client is not created",
                    life: 3000
                });
            }
        }
    }

    onSaveClient() {
        console.log(this.clientForm);
        console.log(this.clientForm.controls['clientType'].touched);
        // this.submittedClientForm = true;

        if (this.clientForm.valid) {
            // const clientPayload = { ...this.clientForm.value };
            const clientDetails = { ...this.clientForm.value };
            delete clientDetails['pincodeId']
            delete clientDetails['cityId']
            delete clientDetails['stateId']
            delete clientDetails['districtId']
            clientDetails['cityId'] = this.clientForm?.value['cityId']?.value
            clientDetails['stateId'] = this.clientForm?.value['stateId']?.value
            clientDetails['districtId'] = this.clientForm?.value['districtId']?.value
            clientDetails['pincodeId'] = this.clientForm?.value['pincodeId']?.value
            if (this.clientForm?.value['kycType'] == AllowedKycTypes.PAN) {
                clientDetails['pan'] = Encryption.encryptData(this.clientForm?.value['kycNumber'])
            }
            if (this.clientForm?.value['kycType'] == AllowedKycTypes.CIN) {
                clientDetails['vin'] = Encryption.encryptData(this.clientForm?.value['kycNumber'])
            }
            clientDetails['kycNumber'] = Encryption.encryptData(clientDetails['kycNumber'])
            if (this.clientForm?.value['clientType'] == 'group') {
                clientDetails['clientGroupId'] = clientDetails['clientGroupId'].value;
            }

            clientDetails['email'] = Encryption.encryptData(clientDetails['email'])
            clientDetails['contactNo'] = Encryption.encryptData(clientDetails['contactNo'])
            clientDetails['lastName'] = Encryption.encryptData(clientDetails['lastName'])
            clientDetails['street'] = Encryption.encryptData(clientDetails['street'])
            clientDetails['street2'] = Encryption.encryptData(clientDetails['street2'])
            clientDetails['street3'] = Encryption.encryptData(clientDetails['street3'])

            this.clientService.create(clientDetails).subscribe({
                next: client => {
                    console.log("new client created");
                    console.log(client);
                    this.clientId = client.data.entity._id
                    this.clientForm.reset();
                    this.messageService.add({
                        severity: "success",
                        summary: "Successful",
                        detail: `Client created successfully`,
                        life: 3000
                    });
                    this.ref.close()
                }
            })

            // let clientFormData = new FormData();

            // console.log(clientDetails['clientType'])

            // clientFormData.append("clientType", clientDetails['clientType']);
            // clientFormData.append("name", clientDetails['name']);
            // clientFormData.append("shortName", clientDetails['shortName']);
            // // clientFormData.append("active", clientDetails['active']);
            // clientDetails['clientGroupId'] && clientFormData.append("clientGroupId", clientDetails['clientGroupId']?.value);
            // clientFormData.append("pan", clientDetails['pan']);
            // clientFormData.append("gst", clientDetails['gst']);
            // // clientFormData.append("copyOfPan", clientDetails['copyOfPanSource']);
            // clientFormData.append("vin", clientDetails['vin']);
            // clientFormData.append("leadGenerator", clientDetails['leadGenerator']);
            // clientFormData.append("natureOfBusiness", clientDetails['natureOfBusiness']);
            // clientFormData.append("claimsManager", clientDetails['claimsManager']);
            // clientFormData.append("referralRM", clientDetails['referralRM']);
            // clientFormData.append("referredCompany", clientDetails['referredCompany']);
            // clientFormData.append("employeeStrength", clientDetails['employeeStrength']);
            // // clientFormData.append("sameAddressVerification", clientDetails['sameAddressVerification']);
            // clientFormData.append("contactDetailsArray", clientDetails['contactDetailsArray']);
            // // clientFormData.append("narration", clientDetails['narration']);

            // console.log(clientFormData)



            // } else {

            //     let errors = [];

            //     Object.entries(this.clientForm.controls).filter(([key, value]) => value.status == 'INVALID')?.map(([key, value]) => {
            //         if (key == 'contactDetailsArray') {
            //             value['controls'].map((contactDetail, index) => {
            //                 Object.entries(contactDetail.controls).filter(([key, value]) => value['status'] == 'INVALID')?.map(([key, value]) => {
            //                     errors.push(`${key}`)
            //                 })
            //             })

            //         } else {
            //             errors.push(key)
            //         }

            //     })
            //     // console.log("validation errors", errors);

            //     let mapping = {
            //         "clientType": 'Client Type',
            //         "name": 'Name',
            //         "pan": "Pan",
            //         "gst": "GST Number",
            //         "vin": "CIN ",
            //         "leadGenerator": "Lead Generator",
            //         "natureOfBusiness": "Nature Of Business",
            //         "employeeStrength": "Employee Strength",
            //         "shortName": "Short Name",
            //         "contactPerson": "Contact Person",
            //         "phone": "Phone",
            //         "email": "Email",
            //         "mobile": "Mobile",
            //         "address": "Address",
            //         "stateId": "State",
            //         "cityId": "City",
            //         "pincodeId": "Pincode",
            //         "visitingCard": "Visiting Card",
            //         "visitingCardSource": "",
            //     };


            //     errors = errors.map((error => {
            //         let map = Object.entries(mapping)?.find(([key, value]) => key == error)
            //         return map ? map[1] : error
            //     }))


            //     console.log(errors)
            //     this.messageService.clear("error");


            //     this.messageService.add({
            //         key: "error",
            //         sticky: true,
            //         severity: "error",
            //         summary: "Please Fill Required Fields",
            //         // detail: errors.join(', '),
            //         detail: `<ul>${errors.map(error => `<li>${error}</li>`).join("")}</ul>`,
            //         life: 3000
            //     });
        }
    }

    onCopyOfPanFileChange(event) {
        // console.log(`Adding file at index ${rowIndex}`);

        if (event.target.files.length > 0) {
            const file = event.target.files[0];

            this.clientForm.patchValue({
                visitingCardSource: file
            });
        }
    }


    searchOptionsCities(event) {
        this.cityService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
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

    searchOptionsPincodes(event) {
        this.pincodeService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    createFormGroup() {
        this.contactDetailsForm = this.formBuilder.group({
            contactDetailsArray: this.formBuilder.array([this.createContactDetailsFormRow()])
        });
    }

    createContactDetailsFormRow(): FormGroup {
        let form = this.formBuilder.group({
            contactPerson: [null, [Validators.pattern("^[a-zA-Z -']+"), Validators.required]],
            designation: [null, [Validators.pattern("^[a-zA-Z -']+"), Validators.required]],
            phone: [null, [Validators.pattern('^[7-9][0-9]{9}$'), Validators.required]],
            email: [null, [CustomValidator.emailValidator, Validators.required]],
            // mobile: [null, [Validators.required]],
            address: [null, [Validators.required]],
            pincodeId: [null, [Validators.required]],
            stateId: [{ value: null }, [Validators.required]],
            cityId: [{ value: null }, [Validators.required]],
            visitingCard: [null, []],
            visitingCardSource: [null, []]
        });

        form.controls['pincodeId'].valueChanges.subscribe(pincode => {

            if (pincode) {

                this.pincodeService.get(pincode.value).subscribe({
                    next: (dto: IOneResponseDto<IPincode>) => {
                        console.log(dto.data.entity);

                        const pincode = dto.data.entity as IPincode

                        const city = pincode.cityId as ICity;
                        const state = pincode.stateId as IState;

                        form.controls['cityId'].setValue({ value: city._id, label: city.name });
                        form.controls['stateId'].setValue({ value: state._id, label: state.name });
                    }
                })
            }
        })

        return form;
    }

    // Contact Details Form -----------------------------------------------------------------------------
    get contactDetailsArray(): FormArray {
        return this.contactDetailsForm.get("contactDetailsArray") as FormArray;
    }

    onAddContactDetailsRow(): void {
        this.contactDetailsArray.push(this.createContactDetailsFormRow());
    }

    onVisitingCardFileChange(event, rowIndex: number) {
        console.log(`Adding file at index ${rowIndex}`);

        if (event.target.files.length > 0) {
            const file = event.target.files[0];

            const contactDetailForm = this.contactDetailsArray.controls[rowIndex];

            contactDetailForm.patchValue({
                visitingCardSource: file
            });
        }
    }

    onDeleteContactDetailsRow(rowIndex: number): void {
        this.contactDetailsArray.removeAt(rowIndex);
    }
    // -------------------------------------------------------------------------------------------------------

    openCreateClientGroupDialog() {
        const ref = this.dialogService.open(CreateClientGroupComponent, {
            header: "Create Client Group",
            width: "50%",
            styleClass: "customPopup"
        });
    }
}
