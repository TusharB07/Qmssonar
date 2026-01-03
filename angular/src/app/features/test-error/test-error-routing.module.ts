import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { TestErrorComponent } from "./test-error/test-error.component";

const routes: Routes = [{ path: "", component: TestErrorComponent }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestErrorRoutingModule {}
