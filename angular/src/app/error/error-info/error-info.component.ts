import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-error-info",
  templateUrl: "./error-info.component.html",
  styleUrls: ["./error-info.component.scss"]
})
export class ErrorInfoComponent implements OnInit {
  stack: string;

  constructor() {}

  ngOnInit(): void {}
}
