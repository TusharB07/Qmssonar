import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

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

import { AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/components/components.module";
import { CalendarModule } from "primeng/calendar";


import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { BscCoverDescriptionListComponent } from "./bsc-cover-description-list/bsc-cover-description-list.component";
import { BscCoverDescriptionFormComponent } from "./bsc-cover-description-form/bsc-cover-description-form.component";
import { BscCoverDescriptionRoutingModule } from "./bsc-cover-description-routing.module";

@NgModule({
  declarations: [
    BscCoverDescriptionListComponent,
    BscCoverDescriptionFormComponent],
  imports: [
    BscCoverDescriptionRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
export class BscCoverDescriptionModule { }
