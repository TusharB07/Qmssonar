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
import { CalendarModule } from 'primeng/calendar';

import { BscDiscountListComponent } from "./bsc-discount-list/bsc-discount-list.component";
import { BscDiscountFormComponent } from "./bsc-discount-form/bsc-discount-form.component";
import { BscDiscountRoutingModule } from "./bsc-discount-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";

@NgModule({
  declarations: [BscDiscountListComponent, BscDiscountFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BscDiscountRoutingModule,
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
    AutoCompleteModule,
    SliderModule,
    CalendarModule
  ]
})
export class BscDiscountModule {}
