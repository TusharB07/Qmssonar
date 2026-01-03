import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { IQuoteGmcTemplate, IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-placementchecker-dialog',
  templateUrl: './placementchecker-dialog.component.html',
  styleUrls: ['./placementchecker-dialog.component.css']
})
export class PlacementcheckerDialogComponent implements OnInit {
  quoteId: any;
  quote: any;
  constructor(private quoteService: QuoteService, private config: DynamicDialogConfig,
    private router: Router, private quoteOptionService: QuoteOptionService,
    private ref: DynamicDialogRef) {
    this.quoteId = this.config.data.quoteData._id;
    this.quote = this.config.data.quoteData;
  }

  ngOnInit() {
  }
  sendForAssignedPlacementId(): void {
    this.quoteService.sendForApproval(this.quoteId).subscribe({
      next: () => {
        let isLiabilityProduct = false
        let isGmcProduct = false
        let liabilityRoute = '';
        let gmcRoute = '';
        switch (this.quote.productId['productTemplate']) {
          case AllowedProductTemplate.WORKMENSCOMPENSATION:
            liabilityRoute = `/backend/quotes/${this.quoteId}/comparision-review-detailed-wc`;
            isLiabilityProduct = true
            break;
          case AllowedProductTemplate.LIABILITY:
          case AllowedProductTemplate.LIABILITY_CRIME:
            liabilityRoute = `/backend/quotes/${this.quoteId}/comparision-review-detailed-liability`;
            isLiabilityProduct = true
            break;
          case AllowedProductTemplate.LIABILITY_EANDO:
            liabilityRoute = `/backend/quotes/${this.quoteId}/comparision-review-detailed-liabilityeando`;
            isLiabilityProduct = true
            break;
          case AllowedProductTemplate.LIABILITY_CGL:
          case AllowedProductTemplate.LIABILITY_PUBLIC:
            liabilityRoute = `/backend/quotes/${this.quoteId}/comparision-review-detailed-liabilitycgl`;  
            isLiabilityProduct = true
            break;
          case AllowedProductTemplate.LIABILITY_PRODUCT:
          case AllowedProductTemplate.LIABILITY_CYBER:
            liabilityRoute = `/backend/quotes/${this.quoteId}/comparision-review-detailed-liabilityproduct`;
            isLiabilityProduct = true
            break;
          case AllowedProductTemplate.GMC:
            gmcRoute = `/backend/quotes/${this.quoteId}/comparision-review-detailed-gmc`;
            isGmcProduct = true
        }
        if (isLiabilityProduct) {
          this.quoteService.getAllLiabilityQuoteOptions(this.quoteId).subscribe({
            next: (dto: IOneResponseDto<any[]>) => {
              let quoteOptionsLst = dto.data.entity.filter(x => x.version == this.quote.qcrVersion)
              this.loadOptionsData(quoteOptionsLst);
              this.loadSelectedOption(quoteOptionsLst[0]);
              this.loadQuoteDetails(this.quote._id)
              this.router.navigateByUrl(liabilityRoute)
              this.ref.close();
            },
            error: e => {
              console.log(e);
            }
          });
        }
        else if (isGmcProduct) {
          this.quoteService.getAllQuoteOptions(this.quoteId).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
              this.quoteService.setQuote(this.quote);
              this.loadOptionsData(dto.data.entity);
              this.loadSelectedOption(dto.data.entity[0])
              this.router.navigate([gmcRoute], {
                queryParams: { quoteOptionId: dto.data.entity[0]?._id }
              });
              this.ref.close();
            },
            error: e => {
              console.log(e);
            }
          });
          // this.router.navigateByUrl(`/backend/quotes/${this.quoteId}/comparision-review-detailed-gmc`)
        }
        else {
          this.quoteOptionService.getAllOptionsByQuoteId(this.quoteId).subscribe({
            next: (dto: IOneResponseDto<IQuoteOption[]>) => {
              this.router.navigate([`/backend/quotes/${this.quoteId}/comparision-review-detailed`], {
                queryParams: { quoteOptionId: dto.data.entities[0]?._id }
              });
              this.ref.close();
            }
          });
        }
        // }
      }
    });
  }
  exit() {
    this.ref.close(false);
  }

  loadQuoteDetails(qoute_id) {
    this.quoteService.get(qoute_id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.quote = dto.data.entity;
        this.quoteService.setQuote(dto.data.entity);
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadOptionsData(quoteOption: any[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }

  loadSelectedOption(quoteOption: any) {
    this.quoteService.setSelectedOptions(quoteOption)
  }

}