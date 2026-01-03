import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscMoneySafeTillListComponent } from './bsc-money-safe-till-list/bsc-money-safe-till-list.component';
import { BscMoneySafeTillFormComponent } from './bsc-money-safe-till-form/bsc-money-safe-till-form.component';

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
import { BscMoneySafeTillRoutingModule } from './bsc-money-safe-till-routing.module';
import { AutoCompleteModule } from "primeng/autocomplete";


@NgModule({
  declarations: [
    BscMoneySafeTillListComponent,
    BscMoneySafeTillFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BscMoneySafeTillRoutingModule,
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

  ], exports: [
    BscMoneySafeTillListComponent,
  ]
})
export class BscMoneySafeTillModule { }
