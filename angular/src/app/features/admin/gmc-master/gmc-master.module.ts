import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GmcMasterFormComponent } from "./gmc-master-form/gmc-master-form.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MessagesModule } from "primeng/messages";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressBarModule } from "primeng/progressbar";
import { RadioButtonModule } from "primeng/radiobutton";
import { SliderModule } from "primeng/slider";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { ComponentsModule } from "src/app/components/components.module";
import { DistrictRoutingModule } from "../district/district-routing.module";
import { GMCMasterListComponent } from "./gmc-partner-list/gmc-master-list.component";
import { GmcMasterRoutingModule } from "./gmc-master-routing.module";
import { TabViewModule } from "primeng/tabview";
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from "primeng/card";
@NgModule({
  declarations: [GmcMasterFormComponent, GMCMasterListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    GmcMasterRoutingModule,
    ToolbarModule,
    ToastModule,
    TableModule,
    DialogModule,
    CardModule,
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
    TabViewModule,
    CheckboxModule
  ]
})
export class GmcMasterModule {}
