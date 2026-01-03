import { AllowedRoles } from './../../role/role.model';
import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ICity } from '../../../admin/city/city.model';
import { CityService } from '../../../admin/city/city.service';
import { ICountry } from '../../../admin/country/country.model';
import { IDistrict } from '../../../admin/district/district.model';
import { IPincode } from '../../../admin/pincode/pincode.model';
import { PincodeService } from '../../../admin/pincode/pincode.service';
import { IState } from '../../../admin/state/state.model';
import { CountryService } from '../../../service/countryservice';
import { StateService } from '../../../admin/state/state.service';
import { DistrictService } from '../../../admin/district/district.service';
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { FormMode, ILov, IManyResponseDto, IOneResponseDto } from "src/app/app.model";
import { environment } from "src/environments/environment";
import { AccountService } from "../../../account/account.service";
import { PartnerService } from "../../partner/partner.service";
import { OPTIONS_COLOR_SCHEMES, OPTIONS_MENU_TYPES, IUser, OPTIONS_ROLES, IDiffHistory } from "../user.model";
import { UserService } from "../user.service";
import { LazyLoadEvent, MessageService, SelectItem } from "primeng/api";
import { AllowedPartnerTypes, IPartner, OPTIONS_PARTNER_TYPES } from "../../partner/partner.model";
import { AppService } from "src/app/app.service";
import { RoleService } from "../../role/role.service";
import { IRole } from "../../role/role.model";
import { Observable } from "rxjs";
import { CustomValidator } from 'src/app/shared/validators';
import { Encryption } from 'src/app/shared/encryption';

@Component({
    selector: "app-user-form",
    templateUrl: "./user-form.component.html",
    styleUrls: ["./user-form.component.scss"]
})
export class UserFormComponent implements OnInit {
    AllowedRoles = AllowedRoles
    optionsMenuTypes: ILov[] = [];
    optionsColorSchemes: ILov[] = [];
    optionsRoles: any[] = [];
    optionsUserRoles: any[] = [];
    tempoptionsRoles: any[] = [];
    optionsPartners: ILov[] = [];
    apiUrl = environment.apiUrl;
    staticUrl = environment.staticUrl;
    photoUploadHttpHeaders: HttpHeaders;
    // partner:IPartner;
    // partnerid:any[]
    partnerReadonly: any;

    partners: IPartner[] = []

    mode: FormMode = "new";
    recordForm: FormGroup;
    zoneOptions: { label: string, value: string, data: number, role: string }[] = [];
    branchName: { label: string, value: string, role: string }[] = [];
    branchCode: { label: string, value: string, }[] = [];
    submitted: boolean = false;
    _id: string;
    id: string;
    selectedPartner: IPartner;
    userPhoto: boolean = false;
    // consfigSelectedMenu: ILov[] = [];

    recordSingularName = "User";
    recordPluralName = "Users";
    modulePath: string = "/backend/admin/users";
    modelPath: string = "C:\Users\kpkum\Documents\inexchange\inexchg_node\seed_data\partners.json";
    currentUser$: Observable<IUser>;
    mappedPlacementUsers:any

    optionsStates: { label: string; value: string; }[];
    optionsCountries: { label: string; value: string; }[];
    optionsPincodes: { label: string; value: string; }[];
    optionsDistricts: { label: string; value: string; }[];
    optionsCities: { label: string; value: string; }[];

    constructor(
        private recordService: UserService,
        private activatedRoute: ActivatedRoute,
        private breadcrumbService: AppBreadcrumbService,
        private formBuilder: FormBuilder,
        private router: Router,
        private accountService: AccountService,
        private partnerService: PartnerService,
        private appService: AppService,
        public messageService: MessageService,
        private roleService: RoleService,
        private cityService: CityService,
        private districtService: DistrictService,
        private pincodeService: PincodeService,
        private countryService: CountryService,
        private stateService: StateService,
    ) {
        this.currentUser$ = this.accountService.currentUser$;
        this.optionsMenuTypes = OPTIONS_MENU_TYPES;
        this.optionsColorSchemes = OPTIONS_COLOR_SCHEMES;
        this.optionsUserRoles = [
            { label: 'Branch Head', value: 'Branch Head' },
            { label: 'Zonal Head', value: 'Zonal Head' },
            { label: 'Placement Head', value: 'Placement Head' }
        ]
        // this.optionsRoles = OPTIONS_ROLES;
        // this.partnerId = OPTIONS_PARTNER_TYPES;
        // this.partnerId =this.user?.partnerId?.name;
        // this.partnerId =
        ///backend/admin/partners/user.partnerId?._id    user.partnerId?.name


        // Set the HTTP headers incase required for the file upload.
        this.photoUploadHttpHeaders = this.accountService.bearerTokenHeader();
    }

    user: IUser
    loggedInUser: IUser;
    isEditAllowed: boolean = false

    ngOnInit(): void {
        this.searchOptionsUsers(Event)

        this.currentUser$.subscribe({
            next: user => {
                let role: IRole = user?.roleId as IRole;

                this.partnerReadonly = role

                console.log(this.partnerReadonly.name)
                // if (role?.name === AllowedRoles.ADMIN) {
                //     this.isEditAllowed = true
                // }
                this.loggedInUser = user;

            }
        });


        this.id = this.activatedRoute.snapshot.paramMap.get("id");

        // mode: Edit
        if (this.id !== "new") {
            this.mode = "edit";
            this.recordService.get(this.id).subscribe({
                next: (dto: IOneResponseDto<IUser>) => {
                    this.breadcrumbService.setItems([
                        { label: "Pages" },
                        {
                            label: `${dto.data.entity.name}`,
                            routerLink: [`${this.modulePath}/new`]
                        }
                    ]);

                    this.user = dto.data.entity;

                    console.log(this.user)

                    this.createForm(this.user);
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
        // this.searchOptionsRoles({});
    }

    // passwordConfirming(c: AbstractControl): { invalid: boolean } {
    //     if (c.get("password").value !== c.get("passwordConfirm").value) {
    //         return { invalid: true };
    //     }

    //     return { invalid: false };
    // }





    confirmPasswordValidator(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            let control = formGroup.controls[controlName];
            let matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.confirmPasswordValidator) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmPasswordValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    createForm(user?: IUser) {
        console.log(this.loggedInUser);
        const role: IRole = user?.roleId as IRole;
        let partner: IPartner = user?.partnerId as IPartner;

        if (!partner) partner = this.loggedInUser.partnerId as IPartner;
        if (user?.photo) this.userPhoto = true;
        const city: ICity = user?.cityId as ICity;
        const district: IDistrict = user?.districtId as IDistrict;
        const pincode: IPincode = user?.pincodeId as IPincode;
        const country: ICountry = user?.countryId as ICountry;
        const state: IState = user?.stateId as IState;

        //   this.selectedPartner = this.partners.find((partnerIn: IPartner) => partnerIn._id == partner._id)
        //   console.log(partner);


        this.recordForm = this.formBuilder.group(
            {
                _id: [user?._id],
                name: [user?.name, [Validators.required, Validators.pattern("^[a-zA-Z -']+"), Validators.maxLength(100)]],
                email: [user?.email, [Validators.required, Validators.maxLength(64)]],
                userEmail: [user?.userEmail, [Validators.required, CustomValidator.emailValidator]],
                mobileNumber: [user?.mobileNumber, [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
                branchName: [null, [Validators.required]],
                branchCode: [null, [Validators.required]],
                zone: [null],
                branchId: [user?.branchId || ''],
                staffCode: [user?.staffCode, []],
                active: [user?.active ? user?.active : false],
                age: [user?.age, Validators.max(100)],

                password: [null, this.mode === "new" ? [Validators.required, CustomValidator.passwordValidator] : []],
                passwordConfirm: [null, this.mode === "new" ? [Validators.required] : []],
                // passwords: this.formBuilder.group({}),
                configColorScheme: [user?.configColorScheme ? user?.configColorScheme : "dark"],
                configMenuType: [user?.configMenuType ? user?.configMenuType : "static"],
                photo: [user?.photo, []],
                // partnerId: [partner ? { label: partner.name, value: partner._id } : null, [Validators.required]],
                status: [(partner?.status ?? true)],

                address: [user?.address, [Validators.required]],
                pincodeId: [pincode ? { label: pincode.name, value: pincode._id } : null, [Validators.required]],
                cityId: [city ? { label: city.name, value: city._id } : null, [Validators.required]],
                districtId: [district ? { label: district.name, value: district._id } : null, [Validators.required]],
                stateId: [state ? { label: state.name, value: state._id } : null, [Validators.required]],
                countryId: [country ? { label: country.name, value: country._id } : null, [Validators.required]],

                partnerId: [{ value: (partner ? { label: partner.name, value: partner._id } : null), disabled: partner?.partnerType == AllowedPartnerTypes.self ? this.mode != "new" : this.mode == "new" }, [Validators.required]],
                roleId: [role ? { label: role.name.replace('_', ' '), value: role._id } : null, [Validators.required]],
                userRole: [user?.userRole ? { label: user.userRole, value: user.userRole } : null, [Validators.required]],
                // partnerId: [{value : (partner ? { label: partner.name, value: partner._id } : null) , disabled: this.mode === "new" &&  ? false: true }, [Validators.required]],
                // partnerId: [{ value: (partner ? { label: partner.name, value: partner._id } : null), disabled: partner?.partnerType == AllowedPartnerTypes.self ? this.mode === "new" ? true : false  : true }, [Validators.required]],
                isLocked: [user?.isLocked ? user?.isLocked : false],
                attemptCount: [{ value: user?.attemptCount, disabled: true }],
                underWriterLevel: [{ value: user?.underWriterLevel, disabled: (role?.name == AllowedRoles.INSURER_UNDERWRITER ? false : true) }, [Validators.required, Validators.min(1), Validators.max(10)]],
                vendorName: [user?.vendorName, [Validators.required]],
                agentCode: [user?.agentCode, [Validators.required]],
                mappedPlacementUsers:[user?.mappedPlacementUsers]
            },
            {
                validator: this.mode === "new" ? this.confirmPasswordValidator("password", "passwordConfirm") : null
            }
        );
        this.recordService.getABranchCode().subscribe(
            (response: any) => {
                const data = response.data;
                if (Array.isArray(data.entities)) {
                    this.zoneOptions = data.entities.map(item => ({ label: item.zone, value: item.name, data: item.code, role: item._id }));
                    console.log(this.zoneOptions, "zo")
                } else {
                    console.error('Invalid data received:', data);
                }
            },
            error => {
                console.error('Error fetching category names:', error);
            }
        );

        this.recordForm.get('zone').valueChanges.subscribe(zone => {
            console.log('Selected Zone:', zone);
            console.log('Zone Options:', this.zoneOptions);

            this.branchName = this.zoneOptions.filter(option => {
                console.log('Option Label:', option.label);
                return option.label.trim() === zone.label.trim();
            }).map(option => ({ label: option.value, value: `${option.data}`, role: `${option.role}` }));

            console.log('Filtered Branch Names:', this.branchName);
        });

        this.recordForm.get('branchName').valueChanges.subscribe(selectedBranch => {
            console.log('Selected Branch:', selectedBranch);

            const selectedBranchLabel = typeof selectedBranch === 'object' ? selectedBranch.label : selectedBranch;
            const foundBranch = this.branchName.find(branch => branch.label === selectedBranchLabel);

            if (foundBranch) {
                const branchCodeValue = foundBranch.value; // Assuming foundBranch.value holds the ID of the branch
                this.recordForm.patchValue({ branchCode: branchCodeValue });
                console.log('Updated Branch Code:', this.recordForm.get('branchCode').value);
            } else {
                console.error('Selected Branch not found:', selectedBranch);
            }
            const branchId = foundBranch.role; // Assuming foundBranch.value holds the ID of the branch
            this.recordForm.patchValue({ branchId: branchId });

        });

        this.recordForm.controls['pincodeId'].valueChanges.subscribe(pincode => {

            if (pincode) {

                this.pincodeService.get(pincode.value).subscribe({
                    next: (dto: IOneResponseDto<IPincode>) => {
                        console.log(dto.data.entity, 'response');

                        const pincode = dto.data.entity as IPincode

                        const country = pincode.countryId as ICountry;
                        const city = pincode.cityId as ICity;
                        const state = pincode.stateId as IState;
                        const district = pincode.districtId as IDistrict;

                        this.recordForm.controls['cityId'].setValue({ value: city._id, label: city.name });
                        this.recordForm.controls['stateId'].setValue({ value: state._id, label: state.name });
                        this.recordForm.controls['districtId'].setValue({ value: district._id, label: district.name });
                        this.recordForm.controls['countryId'].setValue({ value: country._id, label: country.name });
                        console.log(this.recordForm, 'pincode');
                    }
                })
            }
        })


        this.recordForm.controls['partnerId'].valueChanges.subscribe(selected => {
            console.log('selected partner', selected)

            this.selectedPartner = this.partners.find((partner: IPartner) => partner._id == selected.value)


            this.getOptionRoles(selected.partnerType)

            // this.searchOptionsRoles({});
        })
        this.recordForm.controls['roleId'].valueChanges.subscribe(selected => {

            console.log(this.recordForm);

            console.log(selected.value)
            console.log(AllowedRoles.INSURER_UNDERWRITER.replace('_', ' '))

            if (selected.label == AllowedRoles.INSURER_UNDERWRITER.replace('_', ' ')) {
                this.recordForm.controls['underWriterLevel'].enable()
            } else {
                this.recordForm.controls['underWriterLevel'].disable()
            }
        })

        this.searchOptionsRoles({});

        console.log(this.recordForm);


    }

    saveRecord() {
        this.recordService.setFilterValueExist(true);
        console.log(this.recordForm.value);


        if (this.recordForm.valid) {
            const updatePayload = { ...this.recordForm.value };
            const selectedZoneLabel = this.recordForm.value.zone;
            console.log(updatePayload)
            if (!updatePayload.isLocked) {
                updatePayload.attemptCount = 0
            }
            updatePayload["cityId"] = this.recordForm.value["cityId"].value;
            updatePayload["districtId"] = this.recordForm.value["districtId"].value;
            updatePayload["pincodeId"] = this.recordForm.value["pincodeId"].value;
            updatePayload["countryId"] = this.recordForm.value["countryId"].value;
            updatePayload["stateId"] = this.recordForm.value["stateId"].value;
            updatePayload["branchName"] = this.recordForm.value["branchName"]?.label ?? '';
            updatePayload["zone"] = this.recordForm.value["zone"]?.label ?? '';
            updatePayload["branchCode"] = this.recordForm.value["branchCode"];
            updatePayload["userRole"] = this.recordForm.value["userRole"].value;
            updatePayload["branchId"] = this.recordForm.value["branchId"];
            updatePayload["partnerId"] = this.recordForm.value["partnerId"]?.value ?? this.loggedInUser.partnerId['_id'];
            updatePayload["roleId"] = this.recordForm.value["roleId"].value;
            updatePayload["photo"] = this.recordForm.value["photo"];
            updatePayload["email"] = this.recordForm.value["email"].toLowerCase();
            updatePayload["userEmail"] = this.recordForm.value["userEmail"].toLowerCase();

            updatePayload["mappedPlacementUsers"] = this.recordForm.value['mappedPlacementUsers'];
            
            if (this.mode === "edit") {
                // if password has not been set then we remove it from the update.
                if (!this.recordForm.value["password"]) delete updatePayload["password"];
                if (!this.recordForm.value["passwordConfirm"]) delete updatePayload["passwordConfirm"];
                const encryptedNewPassword = Encryption.encryptData(updatePayload["password"])
                const encryptedConfirmPassword = Encryption.encryptData(updatePayload["passwordConfirm"])

                delete updatePayload["password"]
                delete updatePayload["passwordConfirm"]

                updatePayload["password"] = encryptedNewPassword
                updatePayload["passwordConfirm"] = encryptedConfirmPassword
                console.log(updatePayload, "LLLLLLl");

                this.recordService.update(this.id, updatePayload).subscribe({
                    next: user => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            } else {
                const encryptedNewPassword = Encryption.encryptData(updatePayload["password"])
                const encryptedConfirmPassword = Encryption.encryptData(updatePayload["passwordConfirm"])

                delete updatePayload["password"]
                delete updatePayload["passwordConfirm"]

                updatePayload["password"] = encryptedNewPassword
                updatePayload["passwordConfirm"] = encryptedConfirmPassword

                console.log(updatePayload, "sssssssssssssss")

                this.recordService.create(updatePayload).subscribe({
                    next: user => {
                        this.router.navigateByUrl(`${this.modulePath}`);
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        } else {
            // this.appService.createValidationErrorToast(this.recordForm);
        }
    }

    onBasicUpload(e) {
        let bscFormData = new FormData();
        bscFormData.append("photo", e.currentFiles[0]);
        this.recordService.logoUpload(bscFormData).subscribe(res => {
            this.recordForm.value.photo = res.data.entity["url"];
        });
    }

    deletefile() {
        this.recordForm.controls["photo"].setValue(null);
        this.userPhoto = false;
    }

    searchOptionsPartners(event) {

        event = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                status: [
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

        this.partnerService.getMany(event).subscribe({
            next: (dto: IManyResponseDto<IPartner>) => {
                this.optionsPartners = dto.data.entities.map((partner) => ({ label: partner.name, value: partner._id, partnerType: partner.partnerType }));
                // console.log(this.user.partnerId)
            },
            error: e => {
                console.log(e);
            }
        });
    }



    searchOptionsRoles(event) {
        event = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                status: [
                    {
                        value: true,
                    }
                ]
            },
            gs: null,
            multiSortMeta: null
        }
        this.roleService.getMany(event).subscribe({
            next: (dto: IManyResponseDto<IRole>) => {
                let partner: IPartner = this.user?.partnerId as IPartner;

                if (!partner) partner = this.loggedInUser?.partnerId as IPartner;

                this.tempoptionsRoles = dto.data.entities.map(entity => ({ label: entity.name.replace('_', ' '), value: entity._id }));

                this.getOptionRoles(partner.partnerType)
            },
            error: e => { }
        });
    }

    searchOptionsCities(event) {

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
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.cityService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsCities = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    searchOptionsDistricts(event) {
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
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.districtService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsDistricts = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
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
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.pincodeService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsPincodes = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
                console.log(this.optionsPincodes, "FFFFFFFFFFFFFFFF")
            },
            error: e => { }
        });
    }

    searchOptionsStates(event) {
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
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.stateService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                this.optionsStates = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    getOptionRoles(partnerType) {
        this.optionsRoles = this.tempoptionsRoles
        console.log(this.optionsRoles)
        switch (partnerType) {
            case AllowedPartnerTypes.self:
                this.optionsRoles = this.optionsRoles.filter((role: ILov) => [
                    AllowedRoles.ADMIN.replace('_', ' '),
                    AllowedRoles.INSURER_ADMIN.replace('_', ' '),
                    AllowedRoles.INSURER_RM.replace('_', ' '),
                    AllowedRoles.INSURER_UNDERWRITER.replace('_', ' '),
                    AllowedRoles.BROKER_ADMIN.replace('_', ' '),
                    AllowedRoles.BROKER_CREATOR.replace('_', ' '),
                    AllowedRoles.BROKER_APPROVER.replace('_', ' '),
                    AllowedRoles.BROKER_CREATOR_AND_APPROVER.replace('_', ' '),
                    AllowedRoles.BROKER_RM.replace('_', ' '),
                    AllowedRoles.AGENT_ADMIN.replace('_', ' '),
                    AllowedRoles.AGENT_CREATOR.replace('_', ' '),
                    AllowedRoles.AGENT_CREATOR_AND_APPROVER.replace('_', ' '),
                    AllowedRoles.BANCA_ADMIN.replace('_', ' '),
                    AllowedRoles.BANCA_ADMIN.replace('_', ' '),
                    AllowedRoles.BANCA_CREATOR.replace('_', ' '),
                    AllowedRoles.BANCA_RM.replace('_', ' '),
                    AllowedRoles.OPERATIONS.replace('_', ' '),
                    AllowedRoles.SALES_CREATOR.replace('_', ' '),
                    AllowedRoles.SALES_APPROVER.replace('_', ' '),
                    AllowedRoles.SALES_CREATOR_AND_APPROVER.replace('_', ' '),
                    AllowedRoles.PLACEMENT_CREATOR.replace('_', ' '),
                    AllowedRoles.PLACEMENT_APPROVER.replace('_', ' '),
                    AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER.replace('_', ' '),
                ].includes(role.label))
                break;
            case AllowedPartnerTypes.insurer:
                this.optionsRoles = this.optionsRoles.filter((role: ILov) => [
                    AllowedRoles.INSURER_ADMIN.replace('_', ' '),
                    AllowedRoles.INSURER_RM.replace('_', ' '),
                    AllowedRoles.INSURER_UNDERWRITER.replace('_', ' '),
                    AllowedRoles.OPERATIONS.replace('_', ' ')
                ].includes(role.label))
                break;
            case AllowedPartnerTypes.broker:
                this.optionsRoles = this.optionsRoles.filter((role: ILov) => [
                    AllowedRoles.BROKER_ADMIN.replace('_', ' '),
                    AllowedRoles.BROKER_CREATOR.replace('_', ' '),
                    AllowedRoles.BROKER_APPROVER.replace('_', ' '),
                    AllowedRoles.BROKER_CREATOR_AND_APPROVER.replace('_', ' '),
                    AllowedRoles.BROKER_RM.replace('_', ' '),
                    AllowedRoles.SALES_CREATOR.replace('_', ' '),
                    AllowedRoles.SALES_APPROVER.replace('_', ' '),
                    AllowedRoles.SALES_CREATOR_AND_APPROVER.replace('_', ' '),
                    AllowedRoles.PLACEMENT_CREATOR.replace('_', ' '),
                    AllowedRoles.PLACEMENT_APPROVER.replace('_', ' '),
                    AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER.replace('_', ' '),

                ].includes(role.label))
                break;
            case AllowedPartnerTypes.agent:
                this.optionsRoles = this.optionsRoles.filter((role: ILov) => [
                    AllowedRoles.AGENT_ADMIN.replace('_', ' '),
                    AllowedRoles.AGENT_CREATOR.replace('_', ' '),
                    AllowedRoles.AGENT_CREATOR_AND_APPROVER.replace('_', ' '),

                ].includes(role.label))
                break;
            case AllowedPartnerTypes.banca:
                this.optionsRoles = this.optionsRoles.filter((role: ILov) => [
                    AllowedRoles.BANCA_ADMIN.replace('_', ' '),
                    AllowedRoles.BANCA_APPROVER.replace('_', ' '),
                    AllowedRoles.BANCA_CREATOR.replace('_', ' '),
                    AllowedRoles.BANCA_CREATOR_AND_APPROVER.replace('_', ' '),

                ].includes(role.label))
                break;
            case AllowedPartnerTypes.corporateAgent:
                this.optionsRoles = this.optionsRoles.filter((role: ILov) => [
                    AllowedRoles.OPERATIONS.replace('_', ' '),

                ].includes(role.label))
                break;
        }
    }

    onCancel() {
        this.recordService.setFilterValueExist(true);
        this.router.navigateByUrl(this.modulePath);
    }
    searchOptionsUsers(event) {
        let lazyLoadEvent: LazyLoadEvent = {
          first: 0,
          rows: 200,
          sortField: null,
          sortOrder: 1,
          filters: {},
          globalFilter: null,
          multiSortMeta: null
        };
    
        this.recordService.getMany(lazyLoadEvent).subscribe({
          next: data => {
              const users = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, roleID: entity.roleId,partnerId:entity.partnerId }));
              console.log(users,"GGGGGGGGGGG")
              this.mappedPlacementUsers = users.filter(item => item.roleID["name"] === AllowedRoles.PLACEMENT_CREATOR_AND_APPROVER);
              console.log(this.mappedPlacementUsers,"HHHHHHHHHHHHHHHHH")
              this.recordForm.controls['roleId'].valueChanges.subscribe(selected => {

                console.log(selected,"SSSSSSSSSS")});
          },
          error: e => {}
        });
      }
}



// {{user.partnerId?.name}}
