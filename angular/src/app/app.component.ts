import { Component, OnInit } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";

import { Observable } from "rxjs";
import { IUser } from "./features/admin/user/user.model";
import { AccountService } from "./features/account/account.service";

import AOS from 'aos'; //AOS - 1
import { environment } from "src/environments/environment";
import { ThemeService } from "./features/account/my-organization/theme.service";

// Hide all console log on production
if (environment.production) {
    console['log'] = (...arg) => undefined
}

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    menuMode = "horizontal";
    layout = "blue";
    theme = "blue";
    ripple: boolean;
    colorScheme = "dark";
    currentUser$: Observable<IUser>;

    constructor(private primengConfig: PrimeNGConfig, private accountService: AccountService,private themeService:ThemeService) {
        this.currentUser$ = this.accountService.currentUser$;
        this.themeService.applyTheme();
    }

    loadCurrentUser() {
        // const token = localStorage.getItem("authResponse");

        this.accountService.loadCurrentUser().subscribe({
            next: v => {
                // console.log("Loaded user...");

                this.currentUser$.subscribe({
                    next: v => {
                        if (v) {
                            this.menuMode = 'horizontal';
                            // this.layout = v.configLayout;
                            // this.theme = v.configTheme;
                            this.ripple = true;
                            this.colorScheme = 'light';
                        }
                    }
                });
            },
            error: e => {
                console.log(e);
            }
        });
    }

    ngOnInit() {
        AOS.init({
            disable: 'mobile',
            once: true,

        });//AOS - 2
        AOS.refresh();//refresh method is called on window resize and so on, as it doesn't require to build new store with AOS elements and should be as light as possible.

        console.log('hi this is a debug code')

        this.primengConfig.ripple = true;
        this.ripple = true;

        // load the currently logged in user.
        this.loadCurrentUser();
    }
}
