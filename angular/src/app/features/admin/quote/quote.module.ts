import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteListComponent } from './quote-list/quote-list.component';
import { QuoteFormComponent } from './quote-form/quote-form.component';

import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from "primeng/radiobutton";

import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ProgressBarModule } from "primeng/progressbar";
import { SliderModule } from "primeng/slider";

import { MultiSelectModule } from "primeng/multiselect";
import { QuoteRoutingModule } from './quote-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComponentsModule } from 'src/app/components/components.module';
import { TabViewModule } from 'primeng/tabview';
import { QuoteLocationAddonModule } from '../quote-location-addon/quote-location-addon.module';
import { QuoteLocationOccupancyModule } from '../quote-location-occupancy/quote-location-occupancy.module';
import { BscBurglaryAndHousebreakingListComponent } from '../bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking-list/bsc-burglary-and-housebreaking-list.component';
import { BscBurglaryAndHousebreakingModule } from '../bsc-burglary-and-housebreaking/bsc-burglary-and-housebreaking.module';
import { BscElectronicEquipmentModule } from '../bsc-electronic-equipment/bsc-electronic-equipment.module';
import { BscFireLossOfProfitModule } from '../bsc-fire-loss-of-profit/bsc-fire-loss-of-profit.module';
import { BscMoneySafeTillModule } from '../bsc-money-safe-till/bsc-money-safe-till.module';
import { BscMoneyTransitModule } from '../bsc-money-transit/bsc-money-transit.module';
import { BscSignageModule } from '../bsc-signage/bsc-signage.module';
import { BscLiabilityModule } from '../bsc-liability/bsc-liability.module';
import { BscFidelityGuranteeModule } from '../bsc-fidelity-gurantee/bsc-fidelity-gurantee.module';
import { BscAccompaniedBaggageModule } from '../bsc-accompanied-baggage/bsc-accompanied-baggage.module';
import { BscPortableEquipmentsModule } from '../bsc-portable-equipments/bsc-portable-equipments.module';


@NgModule({
  declarations: [
    QuoteListComponent,
    QuoteFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QuoteRoutingModule,
    ToolbarModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    MessageModule,
    DropdownModule,
    MessagesModule,
    RadioButtonModule,
    InputTextModule,
    ButtonModule,
    ToggleButtonModule,
    MultiSelectModule,
    ProgressBarModule,
    SliderModule,
    AutoCompleteModule,
    ComponentsModule,
    TabViewModule,
    QuoteLocationAddonModule,
    QuoteLocationOccupancyModule,
    BscBurglaryAndHousebreakingModule,
    BscElectronicEquipmentModule,
    BscFireLossOfProfitModule,
    BscMoneySafeTillModule,
    BscMoneyTransitModule,
    BscSignageModule,
    BscLiabilityModule,
    BscFidelityGuranteeModule,
    BscAccompaniedBaggageModule,
    BscPortableEquipmentsModule,
  ],
  exports: [
    QuoteListComponent,
  ]
})
export class QuoteModule { }
