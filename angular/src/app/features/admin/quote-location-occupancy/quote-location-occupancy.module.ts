import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteLocationOccupancyListComponent } from './quote-location-occupancy-list/quote-location-occupancy-list.component';
import { QuoteLocationOccupancyFormComponent } from './quote-location-occupancy-form/quote-location-occupancy-form.component';

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
import { QuoteLocationOccupancyRoutingModule } from './quote-location-occupancy-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [
    QuoteLocationOccupancyListComponent,
    QuoteLocationOccupancyFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QuoteLocationOccupancyRoutingModule,
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
    AutoCompleteModule
  ],
  exports: [
    QuoteLocationOccupancyListComponent,
  ]
})
export class QuoteLocationOccupancyModule { }
