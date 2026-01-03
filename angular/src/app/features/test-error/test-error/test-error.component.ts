import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { AppBreadcrumbService } from "src/app/components/app-breadcrumb/app.breadcrumb.service";
import { TestErrorService } from "../test-error.service";

@Component({
  selector: "app-test-error",
  templateUrl: "./test-error.component.html",
  styleUrls: ["./test-error.component.scss"]
})
export class TestErrorComponent implements OnInit {
  constructor(private breadcrumbService: AppBreadcrumbService, private testErrorService: TestErrorService, private messageService: MessageService) {
    this.breadcrumbService.setItems([{ label: "Pages" }, { label: "Error Page", routerLink: ["/backend/error"] }]);
  }

  ngOnInit(): void {}

  get401Error() {
    this.testErrorService.get401Error();
  }

  get404Error() {
    this.testErrorService.get404Error();
  }

  get500Error() {
    this.testErrorService.get500Error();
  }

  get400Error() {
    // this.messageService.add({severity:'error', summary: 'Error', detail: 'Message Content'});

    this.testErrorService.get400Error();
  }
}
