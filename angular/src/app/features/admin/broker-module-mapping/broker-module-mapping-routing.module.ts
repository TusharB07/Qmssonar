import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrokerModuleMappingListComponent } from "./broker-module-mapping-list/broker-module-mapping-list.component";
import { BrokerModuleMappingFormComponent } from "./broker-module-mapping-form/broker-module-mapping-form.component";

const routes: Routes = [
    { path: "", component: BrokerModuleMappingListComponent },
    { path: ":id", component: BrokerModuleMappingFormComponent }
  ];
@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class BrokerModuleMappingRoutingModule { }