import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BscProductPartnerConfigurationListComponent } from './bsc-product-partner-configuration-list/bsc-product-partner-configuration-list.component';
import { BscProductPartnerConfigurationFormComponent } from './bsc-product-partner-configuration-form/bsc-product-partner-configuration-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CityRoutingModule } from '../city/city-routing.module';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ComponentsModule } from 'src/app/components/components.module';
import { BscProductPartnerConfigurationRoutingModule } from './bsc-product-partner-configuration-routing.module';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [
    BscProductPartnerConfigurationListComponent,
    BscProductPartnerConfigurationFormComponent
  ],
  imports: [
    CommonModule,
    // ClaimExperienceRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // CityRoutingModule,
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
    CardModule,
    BscProductPartnerConfigurationRoutingModule
  ]
})
export class BscProductPartnerConfigurationModule { }
