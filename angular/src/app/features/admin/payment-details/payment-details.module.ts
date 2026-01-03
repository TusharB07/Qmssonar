import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentDetailsListComponent } from './payment-details-list/payment-details-list.component';
import { PaymentDetailsFormComponent } from './payment-details-form/payment-details-form.component';
import { PaymentDetailsRoutingModule } from './payment-details-routing.module';

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
import { MultiSelectModule } from "primeng/multiselect";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import { CardModule } from "primeng/card";
import { TabViewModule } from "primeng/tabview";



@NgModule({
  declarations: [
    PaymentDetailsListComponent,
    PaymentDetailsFormComponent
  ],
  imports: [
    CommonModule,
    PaymentDetailsRoutingModule,
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
    AutoCompleteModule,
    ChipsModule,
    CardModule,
    TabViewModule,
  ]
})
export class PaymentDetailsModule { }
