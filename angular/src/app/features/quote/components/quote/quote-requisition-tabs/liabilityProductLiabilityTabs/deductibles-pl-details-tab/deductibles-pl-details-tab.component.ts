import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { IProductLiabilityTemplate, IQuoteSlip, liabiltyProductDeductibles } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { DeleteConfirmationDialogComponent } from '../../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { formatDate } from '@angular/common';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { ILov } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { ProductService } from 'src/app/features/service/productservice';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-deductibles-pl-details-tab',
  templateUrl: './deductibles-pl-details-tab.component.html',
  styleUrls: ['./deductibles-pl-details-tab.component.scss']
})
export class DeductiblesProductLiabilityDetailsTabComponent implements OnInit {
  private currentQuote: Subscription;
  showTextboxes: boolean = false;
  quote: IQuoteSlip;
  masterDeductiblesLoaded: boolean = false;
  quotePLOptions: any
  quoteSubmissionDate: Date | null = null;
  deductiblesDetails: liabiltyProductDeductibles = new liabiltyProductDeductibles()
  editRecordIndex: number = 0
  isEditDeductible: boolean = false
  isSaveEnabled: boolean = false
  templateName: string = ""
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  productsList: ILov[] = []
  selectedProduct: ILov[] = []
  currentUser$: Observable<IUser>;
  user: IUser;
  constructor(private quoteService: QuoteService, private accountService: AccountService, private productService: ProductService, private wclistofmasterservice: WCListOfValueMasterService, private indicativePremiumCalcService: IndicativePremiumCalcService, private dialogService: DialogService, private liabilityProductTemplateService: liabilityProductTemplateService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
        // this.quotePLOptions = this.quote?.liabilityProductTemplateDataId;
        // if (!this.quotePLOptions.deductibles) {
        //   this.quotePLOptions.deductibles = [];
        // }
        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT) {
        //   this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateProductLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityProduct)
        // }
        // else {
        //   //CYBER
        //   this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCyberLiabilityPremium(this.quoteCGLOptions.limitOfLiabilityProduct)
        // }
      }
    })

    this.currentUser$ = this.accountService.currentUser$;

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quotePLOptions = temp;
        this.selectedProduct = this.quotePLOptions.otherBusiness
        if (!this.quotePLOptions.liabiltyDeductibles) {
          this.quotePLOptions.liabiltyDeductibles = [];
        }
        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY_PRODUCT) {
          this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateProductLiabilityPremium(this.quotePLOptions.limitOfLiability)
        }
        else {
          //CYBER
          this.quotePLOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCyberLiabilityPremium(this.quotePLOptions.limitOfLiability)
        }
      }
    })
  }

  ngOnInit(): void {
    this.quoteSubmissionDate = this.quote?.quoteSubmissionDate
      ? new Date(this.quote.quoteSubmissionDate)
      : new Date();

      this.currentUser$.subscribe({
        next: user => {
          this.user = user
        }
      });
      this.getAllProducts()
  }

  getAllProducts() {
    this.productService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: data => {
        this.productsList = data.data.entities.map(entity => ({ label: entity.type, value: entity._id }));
      },
      error: e => { }
    });
  }

  displayErrorMessage(message) {
    this.messageService.add({
      severity: "error", summary: "Missing Information",
      detail: message, life: 3000
    });
  }
  save() {
    if ((this.deductiblesDetails.description != null && this.deductiblesDetails.description != undefined && this.deductiblesDetails.description != '')
      && (this.deductiblesDetails.amount != null && this.deductiblesDetails.amount != undefined && this.deductiblesDetails.amount != 0)) {
      if (this.isEditDeductible) {
        this.quotePLOptions.liabiltyDeductibles[this.editRecordIndex] = this.deductiblesDetails;
      }
      else {
        this.quotePLOptions.liabiltyDeductibles.push(this.deductiblesDetails)
      }
      this.ClearDeductibles()
      this.editRecordIndex = 0
      this.isEditDeductible = false
    }
    let totalIndictiveQuoteAmtWithGst = Number(this.quotePLOptions.totalPremiumAmt + this.quotePLOptions.totalPremiumAmt * 0.18)
    this.quoteService.update(this.quote._id, { totalIndictiveQuoteAmtWithGst: totalIndictiveQuoteAmtWithGst }).subscribe({
      next: quote => {
        this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
          next: quote => {
            console.log("Product Liability Added Successfully");
            this.quoteService.refresh();
          },
          error: error => {
            console.log(error);
          }

        });
      }
    });





  }

  saveBrokerage(): void {
    let payload = { ...this.quote };
    payload['brokerage'] = this.quote.brokerage;
    payload['quoteSubmissionDate'] = this.quoteSubmissionDate ? formatDate(this.quoteSubmissionDate, 'yyyy-MM-dd', 'en') : '';// Format for backend: '';
    this.quoteService.updateArray(this.quote['_id'], payload).subscribe({
      next: dto => {
        this.quote = dto.data.entity
        if (this.quote.quoteSubmissionDate) {
          this.quote.quoteSubmissionDate = new Date(this.quote.quoteSubmissionDate); // Convert to Date object
        }
        this.quotePLOptions.otherBusiness = this.selectedProduct
        this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
          next: quote => {
            this.quoteService.refresh();
          },
          error: error => {
            console.log(error);
          }

        });
      }
    });
  }

  loadMasterDeductibles() {
    if (!this.masterDeductiblesLoaded) {
      const handleResponse = (response: any) => {
        this.masterDeductiblesLoaded = true;
        const dedArray = response.data.entities;

        if (dedArray.length > 0) {
          dedArray.forEach((deductible: any) => {
            this.deductiblesDetails.amount = deductible.EmployeemaxLimit | 0;
            this.deductiblesDetails.description = deductible.lovKey.toString();
            this.quotePLOptions.liabiltyDeductibles.push(this.deductiblesDetails);
            this.ClearDeductibles();
          });

          this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
            next: () => {
              console.log("CGL Deductibles Loaded Successfully");
            },
            error: error => {
              console.log(error);
            }
          });
        } else {
          this.messageService.add({
            severity: "warn",
            summary: "No Deductibles",
            detail: `No deductibles found from master for ${this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT ? 'Product Liability' : 'Cyber'} Product`,
            life: 3000,
          });
        }
      };

      const handleError = (error: any) => {
        console.log(error);
      };

      switch (this.templateName) {
        case AllowedProductTemplate.LIABILITY_PRODUCT:
          this.wclistofmasterservice
            .current(WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_DEDUCTIBLES)
            .subscribe({ next: handleResponse, error: handleError });
          break;

        case AllowedProductTemplate.LIABILITY_CYBER:
          this.wclistofmasterservice
            .current(WCAllowedListOfValuesMasters.CYBER_DEDUCTIBLES)
            .subscribe({ next: handleResponse, error: handleError });
          break;

        default:
          break;
      }
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "No Deductibles",
        detail: "Deductibles from master are already loaded",
        life: 3000,
      });
    }
  }

  addDeductibles() {
    this.deductiblesDetails = new liabiltyProductDeductibles()
    this.deductiblesDetails.description = ""
    this.deductiblesDetails.amount = 0
    this.showTextboxes = true;
  }

  ClearDeductibles() {
    this.deductiblesDetails = new liabiltyProductDeductibles()
    this.deductiblesDetails.description = ""
    this.deductiblesDetails.amount = 0
    this.showTextboxes = false;
  }

  checkValidity() {
    if (this.deductiblesDetails.amount !== null && this.deductiblesDetails.amount !== undefined && this.deductiblesDetails.amount !== 0 && this.deductiblesDetails.description !== null && this.deductiblesDetails.description !== undefined && this.deductiblesDetails.description !== '') {
      this.isSaveEnabled = true;
    } else {
      this.isSaveEnabled = false;
    }
  }

  editRecord(item: liabiltyProductDeductibles, index: number) {
    const recordToEdit = this.quotePLOptions.liabiltyDeductibles[index];
    this.deductiblesDetails = new liabiltyProductDeductibles()
    this.deductiblesDetails.description = recordToEdit.description
    this.deductiblesDetails.amount = recordToEdit.amount
    this.showTextboxes = true;
    this.editRecordIndex = index
    this.isEditDeductible = true
  }

  deleteRecord(item: liabiltyProductDeductibles, index: number) {

    const ref = this.dialogService.open(DeleteConfirmationDialogComponent, {
      header: '',
      width: '740px',
      styleClass: "flatPopup"
    });

    ref.onClose.subscribe((response) => {
      if (response?.confirmed != undefined) {

        if (response.confirmed) {
          this.quotePLOptions.liabiltyDeductibles.splice(index, 1);
          this.save();
          this.editRecordIndex = 0
          this.isEditDeductible = false
        } else {
        }
      }
    })


  }
}

