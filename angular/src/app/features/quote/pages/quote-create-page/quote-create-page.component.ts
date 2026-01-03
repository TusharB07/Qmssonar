import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DialogService } from 'primeng/dynamicdialog';
import { ILov } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IClient } from 'src/app/features/admin/client/client.model';
import { ClientService } from 'src/app/features/admin/client/client.service';
import { OPTIONS_QUOTE_TYPES } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ISector } from 'src/app/features/admin/sector/sector.model';
import { SectorService } from 'src/app/features/admin/sector/sector.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { CreateClientComponent } from 'src/app/features/global/create-client/create-client.component';
// import { CreateClientAndGroupComponent } from 'src/app/features/broker/create-client-and-group/create-client-and-group.component';

const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 25,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};
@Component({
    selector: 'app-quote-create-page',
    templateUrl: './quote-create-page.component.html',
    styleUrls: ['./quote-create-page.component.scss']
})
export class QuoteCreatePageComponent implements OnInit {

    sectors: ISector[] = [];
    selectedSector: Object = {};

    clients: IClient[] = [];
    filteredClientName: ILov[] = [];
    selectedClient: Object = {};

    optionsQuoteType: ILov[] = [];
    selectedOption: string;
    quoteCreationForm: FormGroup;
    submitted: boolean = false;
    isMobile: boolean = false;

    user: IUser;

    constructor(
        private formBuilder: FormBuilder,
        private sectorService: SectorService,
        private clientService: ClientService,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private messageService: MessageService,
        private router: Router,
        private deviceService: DeviceDetectorService,
        private accountService: AccountService,

    ) {
        this.optionsQuoteType = OPTIONS_QUOTE_TYPES;

        // * DO NOT TOUCH
        this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user
            }
        });
    }

    ngOnInit(): void {
        // this.clientNameService.getClientName().then(countries => {
        //   this.clientName = countries;
        // });
        this.isMobile = this.deviceService.isMobile();
        this.createForm();
        this.loadSectorRecords();
    }
    //creation form for the quote creation

    createForm() {
        this.quoteCreationForm = this.formBuilder.group({
            sectorId: [null, [Validators.required]],
            clientId: [null, [Validators.required]],
            quoteType: [null, [Validators.required]]
        });
    }

    //fetchin all the sector records
    loadSectorRecords() {
        this.sectorService.getMany(DEFAULT_RECORD_FILTER).subscribe({
            next: records => {
                // this.sectors = JSON.parse(JSON.stringify(records["data"]["entities"]));
                this.sectors = records["data"]["entities"].filter(item => item.isActive == true)
            },
            error: e => {
                console.log(e);
            }
        });
    }

    //filtrering Client on the basis of user input
    filterClientName(event) {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        const lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 20,
            sortField: 'createdAt',
            sortOrder: -1,
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
                shortName: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ],
                // @ts-ignore
                pan: [
                    {
                        value: event.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.clientService.getMany(lazyLoadEvent).subscribe({
            next: data => {
                const optionClient: IClient[] = [];
                // for (let i = 0; i < data.data.entities.length; i++) {
                //     const entity = data.data.entities[i];
                //     optionClient.push(entity);
                // }
                // this.filteredClientName = optionClient;
                this.filteredClientName = data.data.entities.map((client: IClient) => ({ label: client.name, value: client._id }));
            },
            error: e => {
                console.log(e);
            }
        });
    }

    createClientDialogue() {
        const ref = this.dialogService.open(CreateClientComponent, {
            header: "Create Client Master",
            /* data: {
                quote_id: this.id,
                clientId: this.quote.clientId,
                quoteLocationOccupancyId: quoteLocationOccupancyId,
                quote: this.quote,
                totalRecords : this.totalRecords ,
                allowedLocationCount : this.user.partnerId['locationCount'],
                productName: this.productName
            }, */
            width: this.isMobile ? '98vw' : "50vw",
            styleClass: "customPopup"
        }).onClose.subscribe(() => {
            // this.messageService.add({
            //     severity: "success",
            //     summary: "Successful",
            //     detail: "Client Created Sucessfully!",
            //     life: 3000
            //   });
        })
    }

    changeSector() {
        console.log(this.selectedSector["name"]);
        console.log(this.selectedClient["name"]);
    }

    saveRecord() {
        if (this.quoteCreationForm.valid) {
            console.log(this.quoteCreationForm.value);

            const updatePayload = { ...this.quoteCreationForm.value };
            updatePayload["clientId"] = this.quoteCreationForm.value["clientId"].value;
            if (this.user.partnerId["brokerModeStatus"] == true) {
                updatePayload["brokerModuleQuote"] = true // broker module
            }

            console.log(updatePayload);

            this.quoteService.create(updatePayload).subscribe({
                next: quote => {
                    console.log(quote.data.entity._id)
                    this.router.navigateByUrl(`backend/quotes/${quote.data.entity._id}`);
                },
                error: error => {
                    console.log(error);
                }
            });
        }
        console.log(this.quoteCreationForm.value);
    }

    // openAddNewClientDialog() {
    //     const ref = this.dialogService.open(CreateClientAndGroupComponent, {
    //         header: "Create A Client",
    //         width: "50%",
    //         styleClass: "customPopup"
    //     });
    // }

    onQuoteUpload(event) { }
}
