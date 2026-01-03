import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TerrorismRateListComponent } from "./terrorism-rate-list/terrorism-rate-list.component";
import { TerrorismRateFormComponent } from "./terrorism-rate-form/terrorism-rate-form.component";

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
import { TerrorismRateRoutingModule } from "./terrorism-rate-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ComponentsModule } from "src/app/components/components.module";



import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [TerrorismRateListComponent, TerrorismRateFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TerrorismRateRoutingModule,
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
    CalendarModule,
    ComponentsModule,
    FileUploadModule,
    HttpClientModule
  ]
})
export class TerrorismRateModule { }
