import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { IOneResponseDto } from "src/app/app.model";
import { AllowedProductTemplate } from "src/app/features/admin/product/product.model";
import { IQuoteOption, IQuoteSlip } from "src/app/features/admin/quote/quote.model";
import { QuoteService } from "src/app/features/admin/quote/quote.service";
import { QuoteOptionService } from "src/app/features/admin/quote/quoteOption.service";

@Component({
  selector: "app-placement-dialog",
  templateUrl: "./placement-dialog.component.html",
  styleUrls: ["./placement-dialog.component.css"]
})
export class PlacementDialogComponent implements OnInit {
  quoteId: any;
  quote: IQuoteSlip
  constructor(private quoteService: QuoteService, private config: DynamicDialogConfig,
    private router: Router, private quoteOptionService: QuoteOptionService,
    private ref: DynamicDialogRef) {
    this.quoteId = this.config.data.quoteId;
    this.quote = this.config.data.quote;
  }

  ngOnInit() {
  }



  sendForAssignedPlacementId(): void {
    this.quoteService.sendForApproval(this.quoteId).subscribe({
      next: () => {

        if (this.isAllowedProductLiability(this.quote)) {
          this.quoteService.getAllLiabilityQuoteOptions(this.quoteId).subscribe({
            next: (dto: IOneResponseDto<any[]>) => {
              this.loadOptionsData(dto.data.entity);
              this.loadSelectedOption(dto.data.entity[0])
              this.router.navigate([`/backend/quotes/${this.quoteId}/requisition`], {
                queryParams: { quoteOptionId: dto.data.entity[0]?._id }
              });
              this.ref.close();
            },
            error: e => {
              console.log(e);
            }
          });
        }
        else {

          this.quoteOptionService.getAllOptionsByQuoteId(this.quoteId).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption[]>) => {
              this.router.navigate([`/backend/quotes/${this.quoteId}/requisition`], {
                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
              });
              this.ref.close();
            }
          });
        }
      }
    });
  }
  exit() {
    this.ref.close(false);
  }
  loadOptionsData(quoteOption: any[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }

  loadSelectedOption(quoteOption: any) {
    this.quoteService.setSelectedOptions(quoteOption)
  }
  isAllowedProductLiability(quote) {
    const isTemplateAllowed = [
      AllowedProductTemplate.LIABILITY_CGL,
      AllowedProductTemplate.LIABILITY_PUBLIC,
      AllowedProductTemplate.LIABILITY,
      AllowedProductTemplate.LIABILITY_EANDO,
      AllowedProductTemplate.LIABILITY_CRIME,
      AllowedProductTemplate.LIABILITY_PRODUCT,
      AllowedProductTemplate.WORKMENSCOMPENSATION,
      AllowedProductTemplate.LIABILITY_CYBER].includes(quote.productId['productTemplate'])
    // checking if quote option have qcr version object

    return isTemplateAllowed;
  }
}
