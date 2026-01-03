import { Component } from "@angular/core";
import { AppMainComponent } from "../app-main/app.main.component";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { Observable } from "rxjs";
import { IUser } from "./../../features/admin/user/user.model";
import { AccountService } from "./../../features/account/account.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-inlinemenu",
  templateUrl: "./app.inlinemenu.component.html",
  animations: [
    trigger("inline", [
      state(
        "hidden",
        style({
          height: "0px",
          overflow: "hidden"
        })
      ),
      state(
        "visible",
        style({
          height: "*"
        })
      ),
      state(
        "hiddenAnimated",
        style({
          height: "0px",
          overflow: "hidden"
        })
      ),
      state(
        "visibleAnimated",
        style({
          height: "*"
        })
      ),
      transition("visibleAnimated => hiddenAnimated", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")),
      transition("hiddenAnimated => visibleAnimated", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)"))
    ])
  ]
})
export class AppInlineMenuComponent {
  currentUser$: Observable<IUser>;
  staticUrl = environment.staticUrl;

  constructor(public appMain: AppMainComponent, private accountService: AccountService, private router: Router) {
    this.currentUser$ = this.accountService.currentUser$;
  }

  logout() {
    this.accountService.logout().subscribe();
  }

  loadProfile() {
    this.router.navigateByUrl("/backend/admin/partners/");
  }
}
