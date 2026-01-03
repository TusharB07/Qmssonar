import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EarthquakeRateListComponent } from "./earthquake-rate-list/earthquake-rate-list.component";
import { EarthquakeRateFormComponent } from "./earthquake-rate-form/earthquake-rate-form.component";

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
import { EarthquakeRateRoutingModule } from "./earthquake-rate-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";

import { ComponentsModule } from "src/app/components/components.module";
import { CalendarModule } from "primeng/calendar";


import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [EarthquakeRateListComponent, EarthquakeRateFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EarthquakeRateRoutingModule,
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
    HttpClientModule
  ]
})
export class EarthquakeRateModule { }
