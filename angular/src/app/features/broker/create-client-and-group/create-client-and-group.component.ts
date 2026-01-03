// import { Component, OnInit } from "@angular/core";
// import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { ActivatedRoute, Router } from "@angular/router";
// import { ConfirmationService } from "primeng/api";
// import { forkJoin } from "rxjs";
// import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
// import { ILov } from "src/app/app.model";
// import { CityService } from "../../admin/city/city.service";
// import { ClientContactService } from "../../admin/client-contact/client-contact.service";
// import { ClientGroupService } from "../../admin/client-group/client-group.service";
// import { ClientService } from "../../admin/client/client.service";
// import { PincodeService } from "../../admin/pincode/pincode.service";
// import { StateService } from "../../admin/state/state.service";

// @Component({
//     selector: "app-create-client-and-group",
//     templateUrl: "./create-client-and-group.component.html",
//     styleUrls: ["./create-client-and-group.component.scss"]
// })
// export class CreateClientAndGroupComponent implements OnInit {

//     id: string;
//     // mode: FormMode = "new";
//     modulePath: string = "/backend/admin/client-groups";

//     constructor(
//         private formBuilder: FormBuilder,
//         private confirmationService: ConfirmationService,
//         private clientGroupService: ClientGroupService,
//         private clientService: ClientService,
//         private clientContactService: ClientContactService,
//         private cityService: CityService,
//         private stateService: StateService,
//         private pincodeService: PincodeService,
//         private activatedRoute: ActivatedRoute,
//         private breadcrumbService: AppBreadcrumbService,
//         private router: Router
//     ) { }

//     ngOnInit(): void {
//         this.createSelectClientGroupForm();
//         this.createClientGroupForm();
//     }


//     // Tab View Management ---------------------------------------------------------------------------------
//     createClientActiveTabIndex: number = 0;

//     onTabViewChange(e) {
//         this.createClientActiveTabIndex = e.index;
//     }
//     // -------------------------------------------------------------------------------------------------------

//     // Select Client Group Form
//     selectedClientGroup: ILov;
//     optionsClientGroups: ILov[] = [];

//     selectClientGroupForm: FormGroup;
//     submittedSelectClientGroupForm: boolean = false;

//     createSelectClientGroupForm() {
//         this.selectClientGroupForm = this.formBuilder.group({
//             clientGroupId: [null, [Validators.required]]
//         });
//     }

//     searchOptionsClientGroups(event) {
//         this.clientGroupService.getMatchingClientGroups(event.query).subscribe({
//             next: data => {
//                 console.log(data);

//                 const optionsClientGroups: ILov[] = [];
//                 for (let i = 0; i < data.data.entities.length; i++) {
//                     const entity = data.data.entities[i];
//                     optionsClientGroups.push({
//                         label: entity.clientGroupName,
//                         value: entity._id
//                     });
//                 }
//                 this.optionsClientGroups = optionsClientGroups;
//             },
//             error: e => {
//                 console.log(e);
//             }
//         });
//     }
//     // -------------------------------------------------------------------------------------------------------

//     // Client Group Form -----------------------------------------------------------------------------------
//     clientGroupForm: FormGroup;
//     submittedClientGroupForm: boolean = false;

//     createClientGroupForm() {
//         this.clientGroupForm = this.formBuilder.group({
//             vin: [null, [Validators.required]],
//             clientGroupName: [null, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
//             clientGroupContactName: [null, [Validators.required]],
//             address: [null, [Validators.required]],
//             cityId: [null, [Validators.required]],
//             pincodeId: [null, [Validators.required]],
//             email: [null, [Validators.required, Validators.email]],
//             active: [null]
//         });
//     }

//     onCreateClientGroup(event: Event) {
//         event.preventDefault();
//         console.log("onCreateClientGroup");

//         this.confirmationService.confirm({
//             target: event.target,
//             message: "Are you sure you want to create a new client group?",
//             icon: "pi pi-exclamation-triangle",
//             accept: () => {
//                 this.submittedSelectClientGroupForm = false;
//                 this.createClientActiveTabIndex = 1;
//             },
//             reject: () => {
//                 this.createClientActiveTabIndex = 0;
//             }
//         });
//     }

//     onSaveClientGroup() {
//         console.log(this.clientGroupForm.value);
//         if (this.clientGroupForm.valid) {
//             const updatePayload = { ...this.clientGroupForm.value };
//             updatePayload["cityId"] = this.clientGroupForm.value["cityId"].value;
//             updatePayload["pincodeId"] = this.clientGroupForm.value["pincodeId"].value;

//             this.clientGroupService.create(updatePayload).subscribe({
//                 next: partner => {
//                     this.createClientActiveTabIndex = 2;

//                     this.createClientForm();
//                     // this.router.navigateByUrl(`${this.modulePath}`);
//                 },
//                 error: error => {
//                     console.log(error);
//                 }
//             });
//         }
//     }
//     // -------------------------------------------------------------------------------------------------------

//     // Client Form -----------------------------------------------------------------------------------
//     optionsCities: ILov[] = [];
//     optionsStates: ILov[] = [];
//     optionsPincodes: ILov[] = [];

//     clientForm: FormGroup;
//     submittedClientForm: boolean = false;

//     createClientForm() {
//         this.clientForm = this.formBuilder.group({
//             clientType: ["Very Large Company", [Validators.required]],
//             name: ["Ultratech Cement", [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
//             shortName: ["ULTCMNT", [Validators.pattern("^[a-zA-Z -']+")]],
//             active: [true, []],
//             clientGroupId: [this.selectedClientGroup ? { label: this.selectedClientGroup.label, value: this.selectedClientGroup.value } : null, [Validators.required]],
//             // clientGroupName: [client?.clientGroupName, [Validators.required, Validators.pattern("^[a-zA-Z -']+")]],
//             pan: ["AMTPP989898", []],
//             copyOfPan: [null, []],
//             copyOfPanSource: [null, []],
//             vin: ["IAMVIN", [Validators.required]],
//             leadGenerator: ["SOMELEADGEN", [Validators.required]],
//             natureOfBusiness: ["CEMENT MANU", [Validators.required]],
//             claimsManager: ["SOMECLAMS", []],
//             referralRM: ["SOMERM", []],
//             referredCompany: ["null", []],
//             employeeStrength: [12000, [Validators.required]],
//             sameAddressVerification: [false, []],
//             contactDetailsArray: this.formBuilder.array([this.createContactDetailsFormRow()]),
//             narration: [null, []]
//             // clientKycMasterId: [clientKyc ? { label: clientKyc.clientGroupName, value: clientKyc._id } : null, [Validators.required]]
//         });
//     }

//     onCreateClient() {
//         console.log("onCreateClient");
//         console.log(this.selectClientGroupForm.value);

//         if (this.selectClientGroupForm.valid) {
//             console.log("The client group selection form seems to be valid!!!");
//             this.selectedClientGroup = this.selectClientGroupForm.value.clientGroupId;

//             console.log(this.selectedClientGroup);

//             this.createClientActiveTabIndex = 2;

//             this.createClientForm();
//         }
//     }

//     onSaveClient() {
//         // console.log(this.clientForm);
//         if (this.clientForm.valid) {
//             // const clientPayload = { ...this.clientForm.value };
//             const clientDetails = { ...this.clientForm.value };
//             let clientFormData = new FormData();

//             console.log(clientDetails['clientType'])

//             clientFormData.append("clientType", clientDetails['clientType']);
//             clientFormData.append("name", clientDetails['name']);
//             clientFormData.append("shortName", clientDetails['shortName']);
//             clientFormData.append("active", clientDetails['active']);
//             clientFormData.append("clientGroupId", clientDetails['clientGroupId'].value);
//             clientFormData.append("pan", clientDetails['pan']);
//             clientFormData.append("copyOfPan", clientDetails['copyOfPanSource']);
//             clientFormData.append("vin", clientDetails['vin']);
//             clientFormData.append("leadGenerator", clientDetails['leadGenerator']);
//             clientFormData.append("natureOfBusiness", clientDetails['natureOfBusiness']);
//             clientFormData.append("claimsManager", clientDetails['claimsManager']);
//             clientFormData.append("referralRM", clientDetails['referralRM']);
//             clientFormData.append("referredCompany", clientDetails['referredCompany']);
//             clientFormData.append("employeeStrength", clientDetails['employeeStrength']);
//             clientFormData.append("sameAddressVerification", clientDetails['sameAddressVerification']);
//             clientFormData.append("contactDetailsArray", clientDetails['contactDetailsArray']);
//             clientFormData.append("narration", clientDetails['narration']);

//             // console.log(clientFormData)

//             const contactDetails = clientDetails["contactDetailsArray"];
//             delete clientFormData["contactDetailsArray"];


//             this.clientService.createFormData(clientFormData).subscribe({
//                 next: client => {
//                     console.log("new client created");
//                     console.log(client);

//                     const createContactDetailObservables$ = [];

//                     for (let i = 0; i < contactDetails.length; i++) {
//                         const contactDetail = contactDetails[i];
//                         const contactDetailFormData = new FormData();

//                         contactDetailFormData.append("contactPerson", contactDetail["contactPerson"]);
//                         contactDetailFormData.append("designation", contactDetail["designation"]);
//                         contactDetailFormData.append("phone", contactDetail["phone"]);
//                         contactDetailFormData.append("email", contactDetail["email"]);
//                         contactDetailFormData.append("mobile", contactDetail["mobile"]);
//                         contactDetailFormData.append("address", contactDetail["address"]);
//                         contactDetailFormData.append("stateId", contactDetail["stateId"].value);
//                         contactDetailFormData.append("cityId", contactDetail["cityId"].value);
//                         contactDetailFormData.append("pincodeId", contactDetail["pincodeId"].value);
//                         contactDetailFormData.append("visitingCard", contactDetail["visitingCardSource"]);
//                         contactDetailFormData.append("clientId", client.data.entity._id);

//                         createContactDetailObservables$.push(this.clientContactService.createFormData(contactDetailFormData));
//                     }

//                     forkJoin(createContactDetailObservables$).subscribe({
//                         next: v => {
//                             console.log(v);

//                             // this.createClientActiveTabIndex = 2;
//                             // this.router.navigateByUrl(`/backend/broker/quotes/${}`);
//                         },
//                         error: err => {
//                             console.log(err);
//                         }
//                     });
//                 },
//                 error: error => {
//                     console.log(error);
//                 }
//             });
//         } else {
//             console.log("validation errors");
//         }
//     }

//     onCopyOfPanFileChange(event) {
//         // console.log(`Adding file at index ${rowIndex}`);

//         if (event.target.files.length > 0) {
//             const file = event.target.files[0];

//             this.clientForm.patchValue({
//                 visitingCardSource: file
//             });
//         }
//     }


//     searchOptionsCities(event) {
//         this.cityService.getManyAsLovs(event).subscribe({
//             next: data => {
//                 this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
//             },
//             error: e => { }
//         });
//     }

//     searchOptionsStates(event) {
//         this.stateService.getManyAsLovs(event).subscribe({
//             next: data => {
//                 this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
//             },
//             error: e => { }
//         });
//     }

//     searchOptionsPincodes(event) {
//         this.pincodeService.getManyAsLovs(event).subscribe({
//             next: data => {
//                 this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
//             },
//             error: e => { }
//         });
//     }
//     // -------------------------------------------------------------------------------------------------------

//     // Contact Details Form -----------------------------------------------------------------------------
//     get contactDetailsArray(): FormArray {
//         return this.clientForm.get("contactDetailsArray") as FormArray;
//     }

//     createContactDetailsFormRow(): FormGroup {
//         return this.formBuilder.group({
//             contactPerson: ["Harish", [Validators.required]],
//             designation: [null, []],
//             phone: ["9987027067", [Validators.required]],
//             email: ["harish@ultratech.com", [Validators.required, Validators.email]],
//             mobile: ["9987027067", [Validators.required]],
//             address: ["someaddress somewhere", [Validators.required]],
//             stateId: [null, [Validators.required]],
//             cityId: [null, [Validators.required]],
//             pincodeId: [null, [Validators.required]],
//             visitingCard: [null, [Validators.required]],
//             visitingCardSource: [null, [Validators.required]]
//         });
//     }

//     onVisitingCardFileChange(event, rowIndex: number) {
//         console.log(`Adding file at index ${rowIndex}`);

//         if (event.target.files.length > 0) {
//             const file = event.target.files[0];

//             const contactDetailForm = this.contactDetailsArray.controls[rowIndex];

//             contactDetailForm.patchValue({
//                 visitingCardSource: file
//             });
//         }
//     }

//     onAddContactDetailsRow(): void {
//         this.contactDetailsArray.push(this.createContactDetailsFormRow());
//     }

//     onDeleteContactDetailsRow(rowIndex: number): void {
//         this.contactDetailsArray.removeAt(rowIndex);
//     }
//     // -------------------------------------------------------------------------------------------------------
// }
