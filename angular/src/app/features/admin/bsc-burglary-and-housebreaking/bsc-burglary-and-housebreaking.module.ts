import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscBurglaryAndHousebreakingListComponent } from './bsc-burglary-and-housebreaking-list/bsc-burglary-and-housebreaking-list.component';
import { BscBurglaryAndHousebreakingFormComponent } from './bsc-burglary-and-housebreaking-form/bsc-burglary-and-housebreaking-form.component';
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
import { BscBurglaryAndHousebreakingRoutingModule } from './bsc-burglary-and-housebreaking-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';



@NgModule({
  declarations: [
    BscBurglaryAndHousebreakingListComponent,
    BscBurglaryAndHousebreakingFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BscBurglaryAndHousebreakingRoutingModule,
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
    BscBurglaryAndHousebreakingListComponent,
  ]
})
export class BscBurglaryAndHousebreakingModule { }
