import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AppComponent } from "../app.component";
import { IAppErrorEnvelope } from "../app.model";
import { AppService } from "../app.service";

@Component({
  selector: "app-accessdenied",
  templateUrl: "./app.accessdenied.component.html"
})
export class AppAccessdeniedComponent implements OnInit {
  lastError$: Observable<IAppErrorEnvelope>;

  constructor(public app: AppComponent, private appService: AppService) {}

  ngOnInit(): void {
    this.lastError$ = this.appService.lastError$;
  }
}
