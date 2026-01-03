import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPartnerConfigurationListComponent } from './product-partner-configuration-list/product-partner-configuration-list.component';
import { ProductPartnerConfigurationFormComponent } from './product-partner-configuration-form/product-partner-configuration-form.component';
import { ProductPartnerConfigurationRoutingModule } from './product-partner-configuration-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { ComponentsModule } from 'src/app/components/components.module';
import { CardModule } from 'primeng/card';
import {FileUploadModule} from 'primeng/fileupload';


@NgModule({
  declarations: [
    ProductPartnerConfigurationListComponent,
    ProductPartnerConfigurationFormComponent
  ],
  imports: [
    CommonModule,
    ProductPartnerConfigurationRoutingModule,
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
    InputNumberModule,
    ComponentsModule,
    CardModule,
    FileUploadModule
  ],
  exports: [
    ProductPartnerConfigurationListComponent
  ],
})
export class ProductPartnerConfigurationModule { }
