import { Component, Input, OnInit } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { AppService } from "src/app/app.service";
import { IDiffHistory } from "./audit-trail.model";
import { AuditTrailService } from "./audit-trail.service";

@Component({
  selector: "app-audit-trail",
  templateUrl: "./audit-trail.component.html",
  styleUrls: ["./audit-trail.component.scss"]
})
export class AuditTrailComponent implements OnInit {
  json: any = JSON;

  /** The entityId whose audit records have to be loaded. */
  @Input() entityId: string = "";
  @Input() entityResourcePrefix: string = "";

  /** Represents the data being displayed currently */
  auditRecords: IDiffHistory[];
  totalAuditRecords: number;
  loadingAuditRecords: boolean;

  constructor(private appService: AppService) {}

  ngOnInit(): void {}

  loadAuditRecords(event: LazyLoadEvent) {
    // console.log("loadAuditRecords:");
    // console.log(event);

    this.loadingAuditRecords = true;
    this.appService.getDiffHistory(this.entityId, this.entityResourcePrefix, event).subscribe({
      next: records => {
        // console.log(records);

        this.auditRecords = records.data.entities;
        this.totalAuditRecords = records.results;
        this.loadingAuditRecords = false;
      },
      error: e => {
        console.log(e);
      }
    });
  }
}
