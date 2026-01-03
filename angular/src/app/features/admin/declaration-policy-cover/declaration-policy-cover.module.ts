import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { DeclarationPolicyCoverListComponent } from './declaration-policy-cover-list/declaration-policy-cover-list.component';
import { DeclarationPolicyCoverFormComponent } from './declaration-policy-cover-form/declaration-policy-cover-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeclarationPolicyCoverRoutingModule } from './declaration-policy-cover-routing.module';
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
import { DeclarationPolicyCoverListComponent } from './declaration-policy-cover-list/declaration-policy-cover-list.component';
import { CardModule } from 'primeng/card';



@NgModule({
  declarations: [
    DeclarationPolicyCoverListComponent,
    DeclarationPolicyCoverFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DeclarationPolicyCoverRoutingModule,
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
    CardModule
  ]
})
export class DeclarationPolicyCoverModule { }
