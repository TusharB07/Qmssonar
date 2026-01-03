import { InputNumberModule } from 'primeng/inputnumber';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { TabViewModule } from "primeng/tabview";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { AccordionModule } from "primeng/accordion";
import { DropdownModule } from "primeng/dropdown";
import { ToggleButtonModule } from "primeng/togglebutton";
import { TableModule } from "primeng/table";
import { CreateRiskLocationOccupancyDialogComponent } from './create-risk-location-occupancy-dialog/create-risk-location-occupancy-dialog.component';
import { DataViewModule } from "primeng/dataview";
// import { BurglaryViewQuoteBreakupComponent } from './sum-insured-details/burglary-view-quote-breakup.component';
import { TreeTableModule } from "primeng/treetable";
import { CardModule } from "primeng/card";
import { IndicativeQuoteAddOnsDialogComponent } from "./indicative-quote-addon-dialog/indicative-quote-add-ons-dialog.component";
import { IndicativeQuoteViewQuoteBreakupDialogComponent } from "./indicative-quote-view-quote-breakup-dialog/indicative-quote-view-quote-breakup-dialog.component";
import { RiskInspectionStatusViewAllLoactionsDialogComponent } from "./risk-inspection-status-view-all-loactions-dialog/risk-inspection-status-view-all-loactions-dialog.component";
import { MultiSelectModule } from "primeng/multiselect";
import { SelectButtonModule } from "primeng/selectbutton";
import { PickListModule } from "primeng/picklist";
import { SplitButtonModule } from "primeng/splitbutton";
// import { ReviewQuoteDetailsComponent } from './review-quote-details/review-quote-details.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from "primeng/fileupload";
import { CreateClientComponent } from '../global/create-client/create-client.component';
import { CreateClientGroupComponent } from './create-client-group/create-client-group.component';
import { GlobalModule } from "../global/global.module";
import { NgxCurrencyModule } from "ngx-currency";
import { ChartModule } from "primeng/chart";
import { CalendarModule } from "primeng/calendar";
import { SharedModule } from "src/app/shared/shared.module";
import { GmcCoverageDetailsDialogComponent } from './gmc-coverage-details-dialog/gmc-coverage-details-dialog.component';
import { QuoteGmcEmployeeviewDialogComponent } from './quote-gmc-employeeview-dialog/quote-gmc-employeeview-dialog.component';
import { MarineSiSplitDialogComponent } from './marine-si-split-dialog/marine-si-split-dialog.component';
import { WCRatesFileUploadDialogComponent} from './quote-wc-ratesview-dialog/quote-wc-ratesview-dialog.component';


@NgModule({
    declarations: [
        // CreateClientAndGroupComponent,
        IndicativeQuoteAddOnsDialogComponent, // ! Important
        // IndicativeQuoteViewDetailsDialogComponent,
        IndicativeQuoteViewQuoteBreakupDialogComponent,

        RiskInspectionStatusViewAllLoactionsDialogComponent,
        // SidSumInsuredSplitDialogComponent,
        // CreateRiskLocationOccupancyDialogComponent,

        // ReviewQuoteDetailsComponent,
        // CreateClientComponent,
        CreateClientGroupComponent,
        // QuoteKanbanPageComponent,
        
        //Intergation-EB [Start]
        GmcCoverageDetailsDialogComponent,
        QuoteGmcEmployeeviewDialogComponent,
        WCRatesFileUploadDialogComponent,
        MarineSiSplitDialogComponent
        //Intergation-EB [END]
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        DynamicDialogModule,
        TabViewModule,
        AutoCompleteModule,
        ConfirmPopupModule,
        AccordionModule,
        DropdownModule,
        ToggleButtonModule,
        TableModule,
        MultiSelectModule,
        AutoCompleteModule,
        DataViewModule,
        TreeTableModule,
        CardModule,
        SelectButtonModule,
        PickListModule,
        SplitButtonModule,
        ProgressBarModule,
        CheckboxModule,
        TooltipModule,
        FileUploadModule,
        GlobalModule,
        NgxCurrencyModule,
        TreeTableModule,
        ChartModule,
        SharedModule,
        InputNumberModule,

        CalendarModule,
    ],
})
export class BrokerModule { }
