import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddonCoverSectorListComponent } from "./addon-cover-sector-list/addon-cover-sector-list.component";
import { AddonCoverSectorFormComponent } from "./addon-cover-sector-form/addon-cover-sector-form.component";

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
import { AddonCoverSectorRoutingModule } from "./addon-cover-sector-routing.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
  declarations: [AddonCoverSectorListComponent, AddonCoverSectorFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AddonCoverSectorRoutingModule,
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
    CheckboxModule,
  ],
  exports: [
    AddonCoverSectorListComponent
  ],
})
export class AddonCoverSectorModule { }
