import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Subscription } from "rxjs";
import { AllowedPushbacks } from "src/app/features/admin/product/product.model";
import { AllowedQuoteStates, IQuoteSlip } from "src/app/features/admin/quote/quote.model";
import { QuoteService } from "src/app/features/admin/quote/quote.service";

@Component({
  selector: "app-ic-list-dialog",
  templateUrl: "./ic-list-dialog.component.html",
  styleUrls: ["./ic-list-dialog.component.scss"]
})
export class IcListDialogComponent implements OnInit {
  public quote: any;
  public icList: any;
  private currentQuote: Subscription;
  selectedItems: { [key: string]: boolean } = {};
  selectedIds: any;
  constructor(private ref: DynamicDialogRef, private config: DynamicDialogConfig, private quoteService: QuoteService, private router: Router) {
    this.quote = config.data.quoteId
    this.quoteService.getQuoteByQuoteNo(this.quote.quoteNo).subscribe((res)=>{
      //@ts-ignore
      let brokerQuote = res.data.entity.filter(qt => qt.partnerId?.partnerType == 'broker');
      brokerQuote.map((ele)=>{
        this.icList = ele.partnerId?.mappedIcNames.map((val)=>({ name : val.icPartnerId.name , icId : val.icPartnerId._id}));
      })
    })
  }

  ngOnInit(): void {
    console.log(this.icList, "FFFFFF");
  }

  isAnySelected(): boolean {
    return this.selectedIds?.length > 0;
  }

  save(event: Event) {
    console.log(event);
    console.log(this.selectedIds);
    const data = [];
    this.selectedIds.map(ele => {
      data.push({ insurerId: ele });
    });
    this.quoteService.update(this.quote._id, { insurersAllowedToEditQCR: data }).subscribe(res => {
      console.log(res);
    });

    const payload = {};
    payload["pushBackFrom"] = AllowedPushbacks.QCR;
    payload["pushBackToState"] = AllowedQuoteStates.UNDERWRITTER_REVIEW;
    this.quoteService.pushBackTo(this.quote._id, payload).subscribe(res => {
      this.router.navigateByUrl("/backend/quotes");
      this.ref.close();
    });
    
  }
}
