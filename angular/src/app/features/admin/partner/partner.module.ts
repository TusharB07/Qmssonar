import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
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

import { PartnerListComponent } from "./partner-list/partner-list.component";
import { PartnerFormComponent } from "./partner-form/partner-form.component";
import { PartnerRoutingModule } from "./partner-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ComponentsModule } from "src/app/components/components.module";
import { ChipsModule } from "primeng/chips";
import { CardModule } from "primeng/card";
import { TabViewModule } from "primeng/tabview";
import { ProductPartnerConfigurationModule } from "../product-partner-configuration/product-partner-configuration.module";
import { FileUpload, FileUploadModule } from "primeng/fileupload";

@NgModule({
  declarations: [PartnerListComponent, PartnerFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PartnerRoutingModule,
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
    ChipsModule,
    CardModule,
    TabViewModule,
    FileUploadModule,

    ProductPartnerConfigurationModule,

  ],
//   schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class PartnerModule {}
