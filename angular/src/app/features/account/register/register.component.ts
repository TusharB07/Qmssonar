import { Component, OnInit } from "@angular/core";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  constructor(public app: AppComponent) {}

  ngOnInit(): void {}
}
