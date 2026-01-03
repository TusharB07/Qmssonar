import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AppComponent } from "../app.component";
import { IAppErrorEnvelope } from "../app.model";
import { AppService } from "../app.service";

@Component({
  selector: "app-notfound",
  templateUrl: "./app.notfound.component.html"
})
export class AppNotfoundComponent {
  lastError$: Observable<IAppErrorEnvelope>;

  constructor(public app: AppComponent, private appService: AppService) {}

  ngOnInit(): void {
    this.lastError$ = this.appService.lastError$;
  }
}
