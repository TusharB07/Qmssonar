import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduxtWiseAgeListComponent } from './product-wise-age-list/product-wise-age-list.component';
import { ProductWiseAgeFormComponent } from './product-wise-age-form/product-wise-age-form.component';
import { ProductWiseAgeRoutingModule } from './product-wise-age-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CardModule } from 'primeng/card';
import { ComponentsModule } from 'src/app/components/components.module';



@NgModule({
  declarations: [
    ProduxtWiseAgeListComponent,
    ProductWiseAgeFormComponent
  ],
  imports: [
    CommonModule,
    ProductWiseAgeRoutingModule,
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
    
  ]
})
export class ProductWiseAgeModule { }
