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

import { BscAccompaniedBaggageListComponent } from './bsc-accompanied-baggage-list/bsc-accompanied-baggage-list.component';
import { BscAccompaniedBaggageFormComponent } from './bsc-accompanied-baggage-form/bsc-accompanied-baggage-form.component';
import { AutoCompleteModule } from "primeng/autocomplete";
import { BscAccompaniedBaggageRoutingModule } from "./bsc-accompanied-baggage-routing.module";



@NgModule({
  declarations: [
    BscAccompaniedBaggageListComponent,
    BscAccompaniedBaggageFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BscAccompaniedBaggageRoutingModule,
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
    BscAccompaniedBaggageListComponent,
  ]
})
export class BscAccompaniedBaggageModule { }
