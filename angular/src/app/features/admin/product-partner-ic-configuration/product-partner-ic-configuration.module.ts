import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPartnerIcConfigurationListComponent } from './product-partner-ic-configuration-list/product-partner-ic-configuration-list.component';
import { ProductPartnerIcConfigurationFormComponent } from './product-partner-ic-configuration-form/product-partner-ic-configuration-form.component';
import { ProductPartnerIcConfigurationRoutingModule } from './product-partner-ic-configuration-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
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
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';


@NgModule({
  declarations: [
    ProductPartnerIcConfigurationListComponent,
    ProductPartnerIcConfigurationFormComponent
  ],
  imports: [
    CommonModule,
    ProductPartnerIcConfigurationRoutingModule,
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
    ProgressBarModule,
    SliderModule,
    AutoCompleteModule,
    ComponentsModule,
    CardModule,
    ChipsModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    FileUploadModule
  ]
})
export class ProductPartnerIcConfigurationModule { }
