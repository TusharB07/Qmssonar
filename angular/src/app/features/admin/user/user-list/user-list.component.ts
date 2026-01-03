import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { IUser, OPTIONS_COLOR_SCHEMES, OPTIONS_MENU_TYPES, OPTIONS_ROLES } from "../user.model";
import { IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { ConfirmationService, LazyLoadEvent, MessageService } from "primeng/api";
import { UserService } from "../user.service";
import { Table } from "primeng/table";
import { Router } from "@angular/router";
import { RoleService } from "../../role/role.service";
import { PartnerService } from "../../partner/partner.service";
import { AppService } from "src/app/app.service";

const DEFAULT_RECORD_SHAPE = {
    name: "",
    email: "",
    //
    mobileNumber: null,
    //
    role: "admin",
    photo: "",
    password: "",
    passwordConfirm: "",
    active: true,
    configSidebarIsOpen: true,
    configMenuType: "sidebar",
    configColorScheme: "light",
    configRippleEffect: true,
    roleId: '',
    underWriterLevel: null,
    address: '',
    cityId: '',
    districtId: '',
    stateId: '',
    pincodeId: '',
    countryId: '',
};

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 0,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};

@Component({
    selector: "app-user-list",
    templateUrl: "./user-list.component.html",
    styleUrls: ["./user-list.component.scss"],
    providers: [MessageService, ConfirmationService]
})
export class UserListComponent implements OnInit, OnDestroy {

    optionsMenuTypes: ILov[] = [];
    optionsColorSchemes: ILov[] = [];
    optionsRoles: ILov[] = [];
    ageValues: number[] = [0, 100];
    cols: any[];

    recordSingularName = "User";
    recordPluralName = "Users";
    modulePath: string = "/backend/admin/users";
    /** Represents the data being displayed currently */
    records: IUser[];
    /** Represents the user record being deleted. */
    selectedRecord: IUser | null = null;
    /** Represents the user records being deleted. */
    selectedRecords: IUser[] = [];

    /** Dialog to show when attempting to delete one record */
    deleteRecordDialog: boolean = false;
    /** Dialog to show when attempting to delete more than one record */
    deleteSelectedRecordsDialog: boolean = false;

    totalRecords: number;
    loading: boolean;
    selectAll: boolean = false;

    selectedRoleId: any[];
    optionsRoleId: any[];
    selectedPartners: any[];
    optionsPartners: any[];
    specialFilters = {};
    commonFilters = {};
    filterData: any;

    constructor(
        private appService: AppService,
        private router: Router,
        private messageService: MessageService,
        private breadcrumbService: AppBreadcrumbService,
        private recordService: UserService,
        private cd: ChangeDetectorRef,
        private roleService: RoleService,
        private partnerService: PartnerService
    ) {
        this.breadcrumbService.setItems([
            { label: "Pages" },
            {
                label: this.recordPluralName,
                routerLink: [`${this.modulePath}`]
            }
        ]);
    }

    ngAfterViewInit() {
        this.cd.detectChanges();
    }

    ngOnInit(): void {
        this.cols = [
            { field: "_id", header: "Id" },
            { field: "name", header: "Name" },
            { field: "email", header: "Email" },
            { field: "mobileNumber", header: "Mobile Number" },
            { field: "role", header: "Role" },
            { field: "underWriterLevel", header: "Under Writer Level" },
            // { field: "configMenuType", header: "Menu Type" },
            { field: "configColorScheme", header: "Color Scheme" }
        ];

        // this.idFilterMatchModeOptions = [
        //     { label: "Equals", value: FilterMatchMode.EQUALS },
        //     { label: "Not Equals", value: FilterMatchMode.NOT_EQUALS },
        // ];

        this.optionsMenuTypes = OPTIONS_MENU_TYPES;
        this.optionsColorSchemes = OPTIONS_COLOR_SCHEMES;
        this.optionsRoles = OPTIONS_ROLES;
        this.filterData = this.recordService.getFilterData();
    }

    loadRecords(event: LazyLoadEvent, name?: string) {
        let filterValue = this.recordService.getFilterValueExist();
        if (name) {
            console.log("If Block Called");
            let filtermetadata = {}
            let values = [];

            // @ts-ignore
            event.filters[name].forEach(element => {
                if (element.value != null) {
                    values = [...values, ...element.value.split(',').map(data => { return { value: data } })];
                }
            });

            filtermetadata[name] = [{
                value: values.length > 0 ? values : null,
                matchMode: "in",
                operator: "and"
            }]
            event.filters = { ...this.commonFilters, ...this.specialFilters, ...filtermetadata }
            this.specialFilters = { ...this.specialFilters, ...filtermetadata }
        }
        else {
            let filters = Object.keys(event.filters);
            let filtermetadata = {}
            // @ts-ignore
            let statusValue = event.filters['active']?.map(item => item.value);

            filters.map(item => {
                if (item != 'name' && item != 'mobileNumber' && item != 'branchCode' && item != 'staffCode') {
                    let values = [];
                    // @ts-ignore
                    event.filters[item].forEach(element => {

                        if (element.value != null && typeof element.value != 'boolean') {
                            values = [...values, ...element.value.split(',').map(data => { return { value: data } })];
                        }
                    });
                    filtermetadata[item] = [{
                        value: values.length > 0 ? values : null,
                        matchMode: "in",
                        operator: "and"
                    }]
                }
                else {
                    filtermetadata[item] = event.filters[item]
                }
            })

            if (statusValue && statusValue.length > 0) {
                filtermetadata['active'] = [{
                    value: statusValue[0],
                    matchMode: "equals",
                    operator: "and"
                }]
            }
            event.filters = { ...filtermetadata, ...this.specialFilters }
            this.commonFilters = { ...this.commonFilters, ...filtermetadata }
        }

        if (filterValue && !!this.filterData && Object.keys(this.filterData?.filters).length) {
            event = { ...this.filterData };
        }
        this.loading = true;
        this.recordService.getMany(event).subscribe({
            next: records => {

                this.filterData = null;
                this.recordService.setFilterData(event);
                this.records = records.data.entities;
                this.totalRecords = records.results;
                this.loading = false;
            },
            error: e => {
                console.log(e);
            }
        });
    }

    getOptionsRoleId(e) {

        this.roleService.getManyAsLovs(e.query).subscribe({
            next: data => {
                if (e.query) {
                    this.optionsRoleId = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
                        .map(entity => ({ label: entity.name, value: entity._id }));
                    this.optionsRoleId.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
                } else {
                    this.optionsRoleId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
                    this.optionsRoleId.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
                }
            },
            error: e => { }
        });
    }
    roleIdHandleFilter(e) {
        let roleId = this.selectedRoleId?.map(item => {
            let obj = {
                "value": null,
                "matchMode": "equals",
                "operator": "or"
            };
            obj.value = item.value;
            return obj;
        })
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                "roleId": roleId
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.loadRecords(lazyLoadEvent, 'roleId');
    }
    getOptionsPartnerId(e) {
        this.partnerService.getManyAsLovs(e.query).subscribe({
            next: data => {
                if (e.query) {
                    this.optionsPartners = data.data.entities.filter(entity => entity.name.toLowerCase().includes(e.query.toLowerCase()))
                        .map(entity => ({ label: entity.name, value: entity._id }));
                    this.optionsPartners.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
                } else {
                    this.optionsPartners = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
                    this.optionsPartners.sort((a, b) => a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1);
                }
            },
            error: e => { }
        });
    }
    partnerIdHandleFilter(e) {
        let partnerId = this.selectedPartners?.map(item => {
            let obj = {
                "value": null,
                "matchMode": "equals",
                "operator": "or"
            };
            obj.value = item.value;
            return obj;
        })
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                "partnerId": partnerId
            },
            globalFilter: null,
            multiSortMeta: null
        }
        this.loadRecords(lazyLoadEvent, 'partnerId');
    }

    createRecord() {
        this.router.navigateByUrl(`${this.modulePath}/new`);
    }

    editRecord(record) {
        this.router.navigateByUrl(`${this.modulePath}/${record._id}`);
    }

    openDeleteRecordConfirmationDialog(selectedRecord) {
        this.deleteRecordDialog = true;
        this.selectedRecord = { ...selectedRecord };
    }

    deleteRecord() {
        this.deleteRecordDialog = false;

        this.recordService.delete(this.selectedRecord._id).subscribe({
            next: res => {
                this.loadRecords(DEFAULT_RECORD_FILTER);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `${this.recordSingularName} Deleted`,
                    life: 3000
                });
                // call the api to fetch the data form user tabel after delete
            },
            error: e => {
                console.log(e.error.message);
                this.messageService.add({
                    severity: "fail",
                    summary: "Fail",
                    detail: e.error.message,
                    life: 3000
                });
            }
        });

        this.selectedRecord = { ...DEFAULT_RECORD_SHAPE };
    }

    openDeleteSelectedRecordsConfirmationDialog() {
        this.deleteSelectedRecordsDialog = true;
    }

    deleteSelectedRecords() {
        this.deleteSelectedRecordsDialog = false;

        const userIds = this.selectedRecords.map(selectedUser => {
            return selectedUser._id;
        });
        this.recordService.deleteMany(userIds).subscribe({
            next: v => {
                this.loadRecords(DEFAULT_RECORD_FILTER);
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `${this.recordPluralName} Deleted`,
                    life: 3000
                });
            },
            error: e => {
                // console.log(e);
                this.messageService.add({
                    severity: "error",
                    summary: "Fail",
                    detail: e.error.message,
                    life: 3000
                });
            }
        });

        this.selectedRecords = null;
    }

    onSelectionChange(value = []) {
        console.log("onSelectionChange");
        console.log(value);

        this.selectAll = value.length === this.totalRecords;
        this.selectedRecords = value;
    }

    onSelectAllChange(event) {
        const checked = event.checked;

        if (checked) {
            this.selectedRecords = [...this.records];
            this.selectAll = true;
        } else {
            this.selectedRecords = [];
            this.selectAll = false;
        }
    }

    clear(table: Table) {
        this.specialFilters = [];
        this.commonFilters = [];
        this.selectedRecords = [];
        this.selectAll = false;
        table.clear();
    }

    hideDialog() {
        console.log("hideDialog");
    }

    bulkImportGenerateSample() {
        this.recordService.bulkImportGenerateSample().subscribe({
            next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                if (dto.status == 'success') {
                    // Download the sample file
                    this.appService.downloadFileFromUrl(' Sample Sheet', dto.data.entity.downloadablePath)

                }
            }
        })
    }

    get uploadProps(): PFileUploadGetterProps {
        return this.recordService.getBulkImportProps((dto: IOneResponseDto<IBulkImportResponseDto>) => {
            if (dto.status == 'success') {
                window.location.reload()
            } else {
                // this.messageService.add({
                //     severity: 'fail',
                //     summary: "Failed to Upload",
                //     detail: `${dto.data.entity?.errorMessage}`,
                // })
                alert(dto.data.entity?.errorMessage)
                if (dto.data.entity?.downloadablePath) {
                    this.appService.downloadFileFromUrl('Sample Sheet', dto.data.entity?.downloadablePath)
                }
            }
        })
    }
    ngOnDestroy() {
        this.recordService.setFilterValueExist(null);
    }
}
