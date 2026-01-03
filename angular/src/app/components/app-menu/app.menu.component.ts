import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AppComponent } from "../../app.component";
import { AppMainComponent } from "../app-main/app.main.component";
import { IUser } from "../../features/admin/user/user.model";
import { AccountService } from "../../features/account/account.service";
import { IRole, AllowedRoles } from "../../features/admin/role/role.model";
import { ADMIN_MENU_CLIENTS, ADMIN_MENU_CLIENTS_CONFIGURATIONS, ADMIN_MENU_CLIENTS_KYC, ADMIN_MENU_CONFIGURATION, ADMIN_MENU_CONFIGURATIONS, ADMIN_MENU_MASTERS_CONFIGURATIONS, ADMIN_MENU_MASTERS_DATA, ADMIN_MENU_MASTERS_TENANTAWARE_ICRM, ADMIN_MENU_ONBOARDING, ADMIN_MENU_QUOTE, ADMIN_MENU_Technical, SUPER_ADMIN_MENU_ONBOARDING} from "../../features/admin/admin-routing.module";
import { MenuItem } from "primeng/api";
import { AppService } from "src/app/app.service";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-menu",
  templateUrl: "./app.menu.component.html"
})
export class AppMenuComponent implements OnInit {
  public model: MenuItem[];
  currentUser$: Observable<IUser>;
  ismobile: boolean = false;
  photo: any
  user : any

  constructor(
    public app: AppComponent,
    public appMain: AppMainComponent,
    private accountService: AccountService,
    private appService: AppService,
    private deviceService: DeviceDetectorService
  ) {
    this.currentUser$ = this.accountService.currentUser$;
  }

  public currentRole;

  ngOnInit() {
    this.model = []
    this.ismobile = this.deviceService.isMobile();
    this.currentUser$.subscribe({
      next: user => {
        this.photo = user.photo
        this.user = user
        let role: IRole = user?.roleId as IRole;

        if(role?.name != AllowedRoles.ADMIN){
          this.model = [
            {
              label: "Dashboard",
              icon: "pi pi-fw pi-home",
              routerLink: ["/backend"]
            },
            {
              label: "Quotes",
              icon: "pi pi-fw pi-list",
              routerLink: [this.appService.routes.quotes.list()]              
            },
          ];
        }
        if (role?.name === AllowedRoles.ADMIN) {
          //Intergation-EB [Start]
          this.model = this.mapMenu(...SUPER_ADMIN_MENU_ONBOARDING, ...ADMIN_MENU_CLIENTS_KYC, ...ADMIN_MENU_MASTERS_CONFIGURATIONS, ...ADMIN_MENU_CONFIGURATIONS,...ADMIN_MENU_Technical);
          // this.model = this.mapMenu(...SUPER_ADMIN_MENU_ONBOARDING, ...ADMIN_MENU_CLIENTS_KYC, ...ADMIN_MENU_MASTERS_CONFIGURATIONS, ...ADMIN_MENU_CONFIGURATIONS);
          //Intergation-EB [End]
        }
        if (role?.name === AllowedRoles.BROKER_ADMIN) {
          this.model = this.mapMenu(...ADMIN_MENU_ONBOARDING, ...ADMIN_MENU_CLIENTS_CONFIGURATIONS, ...ADMIN_MENU_MASTERS_TENANTAWARE_ICRM);
        }
        if (role?.name === AllowedRoles.AGENT_ADMIN) {
          this.model = this.mapMenu(...ADMIN_MENU_ONBOARDING, ...ADMIN_MENU_CLIENTS_CONFIGURATIONS, ...ADMIN_MENU_MASTERS_TENANTAWARE_ICRM);
        }
        if (role?.name === AllowedRoles.BANCA_ADMIN) {
          this.model = this.mapMenu(...ADMIN_MENU_ONBOARDING, ...ADMIN_MENU_CLIENTS_CONFIGURATIONS, ...ADMIN_MENU_MASTERS_TENANTAWARE_ICRM);
        }
        if (role?.name === AllowedRoles.INSURER_ADMIN) {
          this.model = this.mapMenu(...ADMIN_MENU_ONBOARDING, ...ADMIN_MENU_MASTERS_DATA, ...ADMIN_MENU_CONFIGURATION);
        }
      }
    });
  }


  mapMenu(...models: MenuItem[]) {
    return [...this.model, ...models]
  }
}
