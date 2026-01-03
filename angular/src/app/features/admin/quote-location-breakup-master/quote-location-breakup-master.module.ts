import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteLocationBreakupMasterListComponent } from './quote-location-breakup-master-list/quote-location-breakup-master-list.component';
import { QuoteLocationBreakupMasterFormComponent } from './quote-location-breakup-master-form/quote-location-breakup-master-form.component';
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

import { QuoteLocationBreakupMasterRoutingModule } from "./quote-location-breakup-master-routing.module";
import {  AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/components/components.module";



@NgModule({
  declarations: [
    QuoteLocationBreakupMasterListComponent,
    QuoteLocationBreakupMasterFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QuoteLocationBreakupMasterRoutingModule,
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
  ]
})
export class QuoteLocationBreakupMasterModule { }
