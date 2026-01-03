import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { AuditTrailComponent } from "./audit-trail/audit-trail.component";

@NgModule({
  declarations: [],
  imports: [CommonModule, TableModule, ButtonModule],
  exports: []
})
export class ComponentsModule {}
