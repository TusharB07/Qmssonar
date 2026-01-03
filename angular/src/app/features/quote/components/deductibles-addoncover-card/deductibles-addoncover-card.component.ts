import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteLocationBreakupDialogComponent } from '../quote-location-breakup-dialog/quote-location-breakup-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { Subscription } from 'rxjs';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { QuoteLocationBreakupMasterService } from 'src/app/features/admin/quote-location-breakup-master/quote-location-breakup-master.service';
import { LazyLoadEvent } from 'primeng/api';
import { AllowedLovReferences } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { HttpClient } from '@angular/common/http';
import { IDeductibleaddoncover, IDeductiblesAddoncover } from './deductibles-addoncover-card.model';
import { DeductiblesAddoncoverCardService } from './deductibles-addoncover-card.service';

@Component({
  selector: 'app-deductibles-addoncover-card',
  templateUrl: './deductibles-addoncover-card.component.html',
  styleUrls: ['./deductibles-addoncover-card.component.scss']
})
export class DeductiblesAddoncoverCardComponent implements OnInit {
  @Input() quote: IQuoteSlip;
  AllowedProductTemplate = AllowedProductTemplate;
  @Input() isShowBreakupType: boolean;
  totalPremium = 0;
  basePremium = 0;
  sumInsured = 0;
  total = 0;
  toWord = new ToWords();
  isAllSelected: boolean = false;
  ischecked: boolean;
  @Input() quoteOptionData: IQuoteOption;
  claimPercentage: any;
  claimAmountMin:any;
  newCoverName: string = '';
  newCoverSelected: boolean = true;
  data: IDeductiblesAddoncover[];
  newclaimPercentage: any;
  newclaimAmountMin: any;
  newischecked: boolean;
  newisChecked: boolean = true;
  newproductValue: string = 'OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF';
 
  // data = [
  //   {
  //     selected: false,
  //     coverName: 'Off Premises'
  //   },
  //   {
  //     selected: false,
  //     coverName: 'Property in Transit B'
  //   },
  //   {
  //     selected: false,
  //     coverName: ' Property In Course of Construction / Minor Works'
  //   },
  //   {
  //     selected: false,
  //     coverName: 'Burlgary/Theft'
  //   },
  //   {
  //     selected: false,
  //     coverName: 'Temporary Removal of stocks and other than stocks'
  //   },
  //   {
  //     selected: false,
  //     coverName: 'Contamination & Co-mingling of Stocks'
  //   },
  //   {
  //     selected: false,
  //     coverName: 'Deliberate Damage'
  //   },
  //   {
  //     selected: false,
  //     coverName: 'Leakage & Overflowing'
  //   },
  // ];
  constructor(
    private dialogService: DialogService,
    private quoteService: QuoteService,
    private quoteLocationBreakupService: QuoteLocationBreakupMasterService,
    private http: HttpClient,
    private deductiblesAddoncover: DeductiblesAddoncoverCardService
  ) { 
    let lazyLoadEvent: LazyLoadEvent = {
        "sortField": "_id",
        "sortOrder": 1,
        "rows": 500
    };
    this.deductiblesAddoncover.getDeductibleAddoncover(lazyLoadEvent).subscribe({
      next: (dto: IManyResponseDto<IDeductiblesAddoncover>) => {
        this.data = dto.data.entities;
      }
    })
  }

  ngOnInit(): void {
  }

  toggleSelectAll() {
    this.data.forEach(row => row.isChecked = this.newisChecked);
  }


  addNewCover() {
    if (this.newCoverName.trim()) {
      // Push the new cover to the table data
      this.data.push({
        isChecked: this.newisChecked,
        addOnCoverName: this.newCoverName.trim(),
        productValue: '% OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF',
        claimPercentage: this.newclaimPercentage,
        claimAmountMin: this.newclaimAmountMin
      });
      const newCover = {
        addOnCoverName: this.newCoverName.trim(),
        isChecked: this.newisChecked,
        productValue: '% OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF',
        claimPercentage: this.newclaimPercentage,
        claimAmountMin: this.newclaimAmountMin
      };
  
      // Call the service to create the cover
      this.deductiblesAddoncover.create(newCover).subscribe({
        next: (partner) => {
          console.log('Cover added successfully:', partner);
        },
        error: (error) => {
          console.error('Error adding cover:', error);
        }
      });
  
      // Reset the input fields after adding the cover
      this.newCoverName = '';
      this.newCoverSelected = true;
      this.newproductValue ='OF CLAIM AMOUNT SUBJECT TO A MINIMUM OF',
      this.newclaimPercentage = 0,
      this.newclaimAmountMin = 0
    } else {
      alert('Please enter a cover name!');
    }
  }


  updateRow(row: any) {
    if (row.claimPercentage < 0) {
      row.claimPercentage = 0;
    } else if (row.claimPercentage > 100) {
      row.claimPercentage = 100;
    }
    const updatedRow = { ...row };
    console.log(updatedRow);
    this.deductiblesAddoncover.update(row._id, row).subscribe({
      next: data => {
      },
      error: error => {
        console.log(error);
      }
    });
    }
  
    restrictInput(event: any) {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, ''); 
      if (parseInt(value) > 100) {
        value = '100'; 
      } else if (parseInt(value) < 0) {
        value = '0';
      }
      event.target.value = value;
      this.claimPercentage = value
    }


    validateClaimAmountMin(event: any) {
      let value = event.target.value;
      value = value.replace(/[^0-9]/g, ''); 
      if (parseInt(value) > 1000000) {
        value = '1000000'; 
      } else if (parseInt(value) < 0) {
        value = '0';
      }
      event.target.value = value;
      this.claimAmountMin = value
    }


    // validateClaimAmountMin(row: any) {
    //   let claimAmount = Number(row.claimAmountMin);
    //   if (claimAmount > 1000000) {
    //     row.claimAmountMin = 1000000; 
    //   }
    // }


}
