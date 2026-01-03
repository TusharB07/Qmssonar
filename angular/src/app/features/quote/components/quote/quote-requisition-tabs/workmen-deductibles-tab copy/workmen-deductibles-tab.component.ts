import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, Subscription } from 'rxjs';
import { IQuoteSlip, liabiltyProductDeductibles } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';
import { IndicativePremiumCalcService } from '../workmen-coverages-tab/indicativepremiumcalc.service';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { formatDate } from '@angular/common';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { ILov } from 'src/app/app.model';
import { IUser } from 'src/app/features/admin/user/user.model';
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
  selector: 'app-workmen-deductibles-tab',
  templateUrl: './workmen-deductibles-tab.component.html',
  styleUrls: ['./workmen-deductibles-tab.component.scss']
})
export class DeductiblesWorkmanTabComponent implements OnInit {
  private currentQuote: Subscription;
  showTextboxes: boolean = false;
  quote: IQuoteSlip;
  quoteWCOptions: any
  quoteSubmissionDate: Date | null = null;
  deductiblesDetails: liabiltyProductDeductibles = new liabiltyProductDeductibles()
  editRecordIndex: number = 0
  templateName: string = ""
  masterDeductiblesLoaded: boolean = false;
  isEditDeductible: boolean = false
  isSaveEnabled: boolean = false
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  productsList: ILov[] = []
  selectedProduct: ILov[] = []
  currentUser$: Observable<IUser>;
  user: IUser;
  constructor(private quoteService: QuoteService,  private accountService: AccountService, private productService: ProductService,private wclistofmasterservice: WCListOfValueMasterService, private quoteWcTemplateService: QuoteWcTemplateService, private dialogService: DialogService, private liabilityTemplateService: liabilityCGLTemplateService, private messageService: MessageService) {
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        //this.templateName = this.quote?.productId['productTemplate'];
        // this.quoteWCOptions = this.quote?.wcTemplateDataId;
        // if (!this.quoteWCOptions.deductibles) {
        //   this.quoteWCOptions.deductibles = [];
        // }
        //this.quoteWCOptions.totalPremiumAmt = this.indicativePremiumCalcService.CalculateCGLPremium(this.quoteCGLOptions.limitOfLiabilityCGL)
      }
    })
    this.currentUser$ = this.accountService.currentUser$;

    
    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteWCOptions = template
        this.selectedProduct = this.quoteWCOptions.otherBusiness
        if (!this.quoteWCOptions.liabiltyDeductibles) {
          this.quoteWCOptions.liabiltyDeductibles = [];
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
        this.quoteWCOptions.liabiltyDeductibles[this.editRecordIndex] = this.deductiblesDetails;
      }
      else {
        this.quoteWCOptions.liabiltyDeductibles.push(this.deductiblesDetails)
      }
      this.ClearDeductibles()
      this.editRecordIndex = 0
      this.isEditDeductible = false
    }

    this.quoteWcTemplateService.update(this.quoteWCOptions._id, { liabiltyDeductibles: this.quoteWCOptions.liabiltyDeductibles }).subscribe({
      next: quote => {
        console.log("WC Added Successfully");
      },
      error: error => {
        console.log(error);
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
        this.quoteWCOptions.otherBusiness = this.selectedProduct
        this.quoteWcTemplateService.updateArray(this.quoteWCOptions._id, this.quoteWCOptions).subscribe({
          next: quote => {
            this.quoteService.refresh()
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
            this.quoteWCOptions.liabiltyDeductibles.push(this.deductiblesDetails);
            this.ClearDeductibles();
          });

          this.liabilityTemplateService.updateArray(this.quoteWCOptions._id, this.quoteWCOptions).subscribe({
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
            detail: `No deductibles found from master for Workmen Product`,
            life: 3000,
          });
        }
      };

      const handleError = (error: any) => {
        console.log(error);
      };

      switch (this.templateName) {
        case AllowedProductTemplate.WORKMENSCOMPENSATION:
          this.wclistofmasterservice
            .current(WCAllowedListOfValuesMasters.WC_DEDUCTIBLES)
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

  editRecord(item: liabiltyProductDeductibles, index: number) {
    const recordToEdit = this.quoteWCOptions.liabiltyDeductibles[index];
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
          this.quoteWCOptions.liabiltyDeductibles.splice(index, 1);
          this.save();
          this.editRecordIndex = 0
          this.isEditDeductible = false
        } else {
        }
      }
    })


  }
}

