import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableModule } from "primeng/table";
import { AuditTrailComponent } from "./audit-trail/audit-trail.component";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [AuditTrailComponent],
  imports: [CommonModule, TableModule, ButtonModule],
  exports: [AuditTrailComponent]
})
export class ComponentsModule {}
