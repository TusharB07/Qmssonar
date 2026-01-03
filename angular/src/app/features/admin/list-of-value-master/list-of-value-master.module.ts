import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOfValueMasterListComponent } from './list-of-value-master-list/list-of-value-master-list.component';
import { ListOfValueMasterFormComponent } from './list-of-value-master-form/list-of-value-master-form.component';
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
import { ListOfValueMasterRoutingModule } from "./list-of-value-master-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CardModule } from 'primeng/card';
import { ListOfValueMasterSiSplitListComponent } from './list-of-value-master-si-split-list/list-of-value-master-si-split-list.component';
import { ListOfValueMasterDropdownListComponent } from './list-of-value-master-dropdown-list/list-of-value-master-dropdown-list.component';
import { ListOfValueMasterRiskParameterListComponent } from './list-of-value-master-risk-parameter-list/list-of-value-master-risk-parameter-list.component';
import { WCListOfValueMasterFormComponent } from './wc-list-of-value-master-form/wc-list-of-value-master-form.component';
import { WCListOfValueMasterDropdownListComponent } from './list-of-value-master-wc-dropdown-list/list-of-value-master-wc-dropdown-list.component';
// import { ListOfValueMasterRiskParamterListComponent } from './list-of-value-master-risk-paramter-list/list-of-value-master-risk-paramter-list.component';
// import { ListOfValueMasterRiskParameterListComponent } from './list-of-value-master-risk-parameter-list/list-of-value-master-risk-parameter-list.component';



@NgModule({
  declarations: [
    ListOfValueMasterListComponent,
    ListOfValueMasterFormComponent,
    ListOfValueMasterSiSplitListComponent,
    ListOfValueMasterDropdownListComponent,
    ListOfValueMasterRiskParameterListComponent,
    WCListOfValueMasterFormComponent,
    WCListOfValueMasterDropdownListComponent
  ],
  imports: [
    DialogModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ListOfValueMasterRoutingModule,
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
    CardModule,


  ],
  exports: [
    ListOfValueMasterListComponent,
    ListOfValueMasterSiSplitListComponent,
  ]
})
export class ListOfValueMasterModule { }
