import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { AppMainComponent } from "src/app/components/app-main/app.main.component";
import { MyOrganizationComponent } from "./my-organization/my-organization.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
    { path: "register", component: RegisterComponent },
    {
        path: "profile", component: AppMainComponent,
        children: [
            { path: "", component: ProfileComponent},
            // {
            //     path: "my-organization", component: MyOrganizationComponent

            // },
        ]
    },
    {
        path: "my-organization", component: AppMainComponent,
        children: [
            { path: "", component: MyOrganizationComponent},

        ]
    },

];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
