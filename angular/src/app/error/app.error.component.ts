import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AppComponent } from "../app.component";
import { IAppErrorEnvelope } from "../app.model";
import { AppService } from "../app.service";

@Component({
  selector: "app-error",
  templateUrl: "./app.error.component.html"
})
export class AppErrorComponent implements OnInit {
  lastError$: Observable<IAppErrorEnvelope>;

  constructor(public app: AppComponent, private appService: AppService) {}

  ngOnInit(): void {
    this.lastError$ = this.appService.lastError$;
  }
}
