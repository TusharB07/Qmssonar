import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { DANDOTemplate, IQuoteSlip, liabiltyProductDeductibles } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IndicativePremiumCalcService } from '../../workmen-coverages-tab/indicativepremiumcalc.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { DeleteConfirmationDialogComponent } from '../../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { formatDate } from '@angular/common';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ILov } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { ProductService } from 'src/app/features/service/productservice';
import { IUser } from 'src/app/features/admin/user/user.model';

const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-deductibles-details-tab',
  templateUrl: './deductibles-details-tab.component.html',
  styleUrls: ['./deductibles-details-tab.component.scss']
})
export class DeductiblesDetailsTabComponent implements OnInit {

  private currentQuote: Subscription;
  quote: any;
  quoteDandOOptions: any;
  masterDeductiblesLoaded: boolean = false;
  deductiblesDetails: liabiltyProductDeductibles = new liabiltyProductDeductibles()
  editRecordIndex: number = 0
  templateName: string = ""
  quoteSubmissionDate: Date | null = null;
  isSaveEnabled: boolean = false
  showTextboxes: boolean = false;
  isEditDeductible: boolean = false
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  productsList: ILov[] = []
  selectedProduct: ILov[] = []
  currentUser$: Observable<IUser>;
  user: IUser;
  constructor(private quoteService: QuoteService, private accountService: AccountService, private productService: ProductService, private wclistofmasterservice: WCListOfValueMasterService, private dialogService: DialogService, private liabilityTemplateService: liabilityTemplateService, private messageService: MessageService, private indicativePremiumCalcService: IndicativePremiumCalcService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.templateName = this.quote?.productId['productTemplate']
        // this.quoteDandOOptions = this.quote?.liabilityTemplateDataId;
        // if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
        //   this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateDandOPremium(this.quoteCGLOptions.limitOfLiability)
        // }
        // else {
        //   this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCrimeInsurancePremium(this.quoteCGLOptions.limitOfLiability)
        // }

      }
    })
    this.currentUser$ = this.accountService.currentUser$;

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        const temp = template;
        this.quoteDandOOptions = temp
        this.selectedProduct = this.quoteDandOOptions.otherBusiness
        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.LIABILITY) {
          this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateDandOPremium(this.quoteDandOOptions.limitOfLiability)
        }
        else {
          this.quoteDandOOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCrimeInsurancePremium(this.quoteDandOOptions.limitOfLiability)
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

  loadMasterDeductibles() {
    if (!this.masterDeductiblesLoaded) {
      const handleResponse = (response: any) => {
        this.masterDeductiblesLoaded = true;
        const dedArray = response.data.entities;

        if (dedArray.length > 0) {
          dedArray.forEach((deductible: any) => {
            this.deductiblesDetails.amount = deductible.EmployeemaxLimit | 0;
            this.deductiblesDetails.description = deductible.lovKey.toString();
            this.quoteDandOOptions.liabiltyDeductibles.push(this.deductiblesDetails);
            this.ClearDeductibles();
          });

          this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
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
            detail: `No deductibles found from master for ${this.templateName == AllowedProductTemplate.LIABILITY_PRODUCT ? 'DandO' : 'Crime'} Product`,
            life: 3000,
          });
        }
      };

      const handleError = (error: any) => {
        console.log(error);
      };

      switch (this.templateName) {
        case AllowedProductTemplate.LIABILITY:
          this.wclistofmasterservice
            .current(WCAllowedListOfValuesMasters.LIABILITY_DEDUCTIBLES)
            .subscribe({ next: handleResponse, error: handleError });
          break;

        case AllowedProductTemplate.LIABILITY_CRIME:
          this.wclistofmasterservice
            .current(WCAllowedListOfValuesMasters.CRIME_DEDUCTIBLES)
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
        this.quoteDandOOptions.liabiltyDeductibles[this.editRecordIndex] = this.deductiblesDetails;
      }
      else {
        this.quoteDandOOptions.liabiltyDeductibles.push(this.deductiblesDetails)
      }
      this.ClearDeductibles()
      this.editRecordIndex = 0
      this.isEditDeductible = false
    }
    let totalIndictiveQuoteAmtWithGst = Number(this.quoteDandOOptions.totalPremiumAmt + this.quoteDandOOptions.totalPremiumAmt * 0.18)
    this.quoteService.update(this.quote._id, { totalIndictiveQuoteAmtWithGst: totalIndictiveQuoteAmtWithGst }).subscribe({
      next: quote => {
        this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
          next: quote => {
            console.log("CGL Added Successfully");
            this.quoteService.refresh();
          },
          error: error => {
            console.log(error);
          }

        });
      }
    });

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
    const recordToEdit = this.quoteDandOOptions.liabiltyDeductibles[index];
    this.deductiblesDetails = new liabiltyProductDeductibles()
    this.deductiblesDetails.description = recordToEdit.description
    this.deductiblesDetails.amount = recordToEdit.amount
    this.showTextboxes = true;
    this.editRecordIndex = index
    this.isEditDeductible = true
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
        this.quoteDandOOptions.otherBusiness = this.selectedProduct
        this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
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

  deleteRecord(item: liabiltyProductDeductibles, index: number) {

    const ref = this.dialogService.open(DeleteConfirmationDialogComponent, {
      header: '',
      width: '740px',
      styleClass: "flatPopup"
    });

    ref.onClose.subscribe((response) => {
      if (response?.confirmed != undefined) {

        if (response.confirmed) {
          this.quoteDandOOptions.liabiltyDeductibles.splice(index, 1);
          this.save();
          this.editRecordIndex = 0
          this.isEditDeductible = false
        } else {
        }
      }
    })


  }
}

