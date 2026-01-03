import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AccountRoutingModule } from "./account-routing.module";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { ProfileComponent } from './profile/profile.component';
import { CardModule } from "primeng/card";
import { AdminRoutingModule } from "../admin/admin-routing.module";
// import { AutoCompleteModule } from "primeng/autocomplete";
import {AutoCompleteModule} from 'primeng/autocomplete';
import { PartnerRoutingModule } from "../admin/partner/partner-routing.module";
import { ToolbarModule } from "primeng/toolbar";
import { ChipsModule } from "primeng/chips";
import { ComponentsModule } from "src/app/components/components.module";
import { SliderModule } from "primeng/slider";
import { ProgressBarModule } from "primeng/progressbar";
import { MultiSelectModule } from "primeng/multiselect";
import { ToggleButtonModule } from "primeng/togglebutton";
import { RadioButtonModule } from "primeng/radiobutton";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { PasswordModule } from 'primeng/password';
import { MyOrganizationComponent } from "./my-organization/my-organization.component";
import { ResetPasswordDialogComponent } from './profile/reset-password-dialog/reset-password-dialog.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { TermAndConditionDialogComponent } from './term-and-condition-dialog/term-and-condition-dialog.component';
import { TermPopupComponent } from './term-popup/term-popup.component';
import { ResetPasswordSuccessDialogComponent } from "./profile/reset-password-success-dialog/reset-password-success-dialog.component";


@NgModule({
  declarations: [LoginComponent, RegisterComponent, ProfileComponent, 
    MyOrganizationComponent, ResetPasswordDialogComponent, ForgotPasswordComponent, TermAndConditionDialogComponent, TermPopupComponent,ResetPasswordSuccessDialogComponent
  ],
  imports: [
    CommonModule,    
    AccountRoutingModule,
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    PartnerRoutingModule,
    ToolbarModule,
    ToastModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    MessageModule,
    MessagesModule,
    RadioButtonModule,
    InputTextModule,
    ButtonModule,
    ToggleButtonModule,
    MultiSelectModule,
    DropdownModule,
    ProgressBarModule,
    SliderModule,
    AutoCompleteModule,  
    ComponentsModule,
    ChipsModule,
    CardModule,
    PasswordModule,
    InputNumberModule
  ]
})
export class AccountModule {}
