import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TestErrorComponent } from "./test-error/test-error.component";
import { TestErrorRoutingModule } from "./test-error-routing.module";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [TestErrorComponent],
  imports: [CommonModule, TestErrorRoutingModule, ButtonModule]
})
export class TestErrorModule {}
