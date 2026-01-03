import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { QuoteLocationBreakupMasterService } from "../../admin/quote-location-breakup-master/quote-location-breakup-master.service";
import { PartnerService } from "../../admin/partner/partner.service";

interface Partner {
  name: string;
}

@Component({
  selector: "app-mail-parsing-ai",
  templateUrl: "./mail-parsing-ai.component.html",
  styleUrls: ["./mail-parsing-ai.component.css"]
})
export class MailParsingAIComponent implements OnInit {
  AIForm: any;
  quoteId = "66b615b1b170cad736bebadc";
  // quoteNo = "FIPR-2024-8-00006568";
  partners: Partner[];
  partnerName: Partner;

  constructor(private fb: FormBuilder, private quoteLocationBreakupMasterService: QuoteLocationBreakupMasterService, private partnerService: PartnerService) {
    this.partners = [
      { name: "Bajaj" }, 
      { name: "Reliance" },
      {name: "Chola Mandalam"},
      {name : "Liberty Insurer"},
      {name : "Alwrite Insurer"}
    ];
  }
  ngOnInit() {
    this.AIForm = this.fb.group({
      quoteNo: [""],
      emailData: [""],
      partnerName: []
    });
  }
  OnSubmit() {
    const payload = {};
    const partnerName1 = this.AIForm.controls["partnerName"].value;
    payload["partnerName"] = partnerName1.name;
    payload["EMAIL_DATA_FROM_INSURER"] = this.AIForm.controls["emailData"].value;
    payload["quoteNo"] = this.AIForm.controls["quoteNo"].value;
    this.quoteLocationBreakupMasterService.batchUpsertMailParser(this.quoteId, payload).subscribe({
      next:(res) => {
        console.log(res);
      },
      error: e =>{
        console.log(e);
      }
    });
  }
}
