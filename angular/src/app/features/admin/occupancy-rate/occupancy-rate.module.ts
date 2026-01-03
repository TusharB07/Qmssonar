import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OccupancyRateListComponent } from "./occupancy-rate-list/occupancy-rate-list.component";
import { OccupancyRateFormComponent } from "./occupancy-rate-form/occupancy-rate-form.component";

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
import { OccupancyRateRoutingModule } from "./occupancy-rate-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";

import { ComponentsModule } from "src/app/components/components.module";
import { Calendar } from "@fullcalendar/core";
import { CalendarModule } from "primeng/calendar";


import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';

import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
  declarations: [OccupancyRateListComponent, OccupancyRateFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OccupancyRateRoutingModule,
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
    CalendarModule,
    FileUploadModule,
    HttpClientModule,
    InputNumberModule
  ]
})
export class OccupancyRateModule { }
