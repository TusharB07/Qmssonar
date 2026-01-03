import { ExternalPaymentComponent } from './public/external-payment/external-payment.component';
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FormLayoutDemoComponent } from "./features/view/formlayoutdemo.component";
import { EmptyDemoComponent } from "./features/view/emptydemo.component";
import { AppMainComponent } from "./components/app-main/app.main.component";
import { AppNotfoundComponent } from "./error/app.notfound.component";
import { AppErrorComponent } from "./error/app.error.component";
import { AppAccessdeniedComponent } from "./error/app.accessdenied.component";
import { TableDemoComponent } from "./features/view/tabledemo.component";
import { AppCrudComponent } from "./pages/app.crud.component";
import { AuthGuard } from "./guards/auth.guard";
import { AdminGuard, RoleGuard } from "./role.guard";
import { CreateClientComponent } from "./features/global/create-client/create-client.component";
import { DashboardComponent } from "./features/quote/pages/dashboard/dashboard.component";
import { MailParsingAIComponent } from './features/view/mail-parsingAI/mail-parsing-ai.component';
import { ExternalQcrComponent } from './public/external-qcr/external-qcr.component';
import { ExternalGmcQcrComponent } from './public/external-gmc-qcr/external-gmc-qcr.component';


@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                { path: "", pathMatch: "full", redirectTo: "/backend" },
                {
                    path: "account",
                    loadChildren: () => import("./features/account/account.module").then(mod => mod.AccountModule),
                    data: { breadcrumb: { skip: true } }
                },
                {
                    path: "backend",
                    canActivate: [AuthGuard],
                    canActivateChild: [RoleGuard],
                    component: AppMainComponent,
                    children: [
                        {
                            // data: { allowed_roles: [AllowedRoles.ADMIN] },
                            path: "", component: DashboardComponent
                        },
                        // {
                        //     // data: { allowed_roles: [AllowedRoles.ADMIN] },
                        //     path: "dashboard", component: DashboardComponent
                        // },
                        { path: "create-client", component: CreateClientComponent },
                        {
                            // data: { allowed_roles: [AllowedRoles.ADMIN] },
                            path: "admin",
                            canActivateChild: [AdminGuard],
                            loadChildren: () => import("./features/admin/admin.module").then(mod => mod.AdminModule)
                        },
                        {
                            // data: { allowed_roles: [AllowedRoles.ADMIN] },
                            path: "quotes",
                            loadChildren: () => import("./features/quote/quote.module").then(mod => mod.QuoteModule)
                        },
                        {
                            path: "broker",
                            // data: { allowed_roles: [AllowedRoles.BROKER_ADMIN] },
                            loadChildren: () => import("./features/broker/broker.module").then(mod => mod.BrokerModule)
                        },
                        {
                            path: "formlayout",
                            component: FormLayoutDemoComponent
                        },
                        { path: "table", component: TableDemoComponent },
                        {
                            path: "menu",
                            loadChildren: () => import("./features/view/menus/menus.module").then(m => m.MenusModule)
                        },
                        { path: "pages/crud", component: AppCrudComponent },
                        { path: "pages/empty", component: EmptyDemoComponent },
                        {
                            path: "test-error",
                            loadChildren: () => import("./features/test-error/test-error.module").then(mod => mod.TestErrorModule)
                        },
                        {
                            path:'mail-parsing',
                            component:MailParsingAIComponent
                        }
                    ]
                },
                { path: "server-error", component: AppErrorComponent },
                { path: "access-denied", component: AppAccessdeniedComponent },
                { path: "not-found", component: AppNotfoundComponent },
                // { path: "login", component: AppLoginComponent },
                { path : "externalPayment", component : ExternalPaymentComponent },
                { path : "externalQCR", component : ExternalQcrComponent },
                { path : "externalQCRGmc", component : ExternalGmcQcrComponent },
                { path: "**", redirectTo: "/not-found" }
            ],
            { scrollPositionRestoration: "enabled" }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
