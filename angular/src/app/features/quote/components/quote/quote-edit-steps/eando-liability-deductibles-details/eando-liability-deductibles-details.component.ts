import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { IQuoteSlip, liabiltyEandODeductibles } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { IOneResponseDto } from 'src/app/app.model';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';

@Component({
  selector: 'app-eando-liability-deductibles-details',
  templateUrl: './eando-liability-deductibles-details.component.html',
  styleUrls: ['./eando-liability-deductibles-details.component.scss']
})
export class LiabilityEandODeductiblesDetailsComponent implements OnInit {
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  quoteEandOOptions: any
  showEditOption = false;
  deductiblesDetails: liabiltyEandODeductibles = new liabiltyEandODeductibles()
  editRecordIndex: number = 0
  isEditDeductible: boolean = false
  isSaveEnabled: boolean = false
  showTextboxes: boolean = false;
  private currentSelectedTemplate: Subscription;
  AllowedProductTemplate = AllowedProductTemplate;

  constructor(private dialogService: DialogService, private messageService: MessageService, private accountService: AccountService, private quoteService: QuoteService, private liabilityEandOTemplateService: liabilityEandOTemplateService) {
    this.accountService.currentUser$.subscribe({
      next: user => {
        const role: IRole = user.roleId as IRole;
        if (AllowedRoles.INSURER_RM == role?.name) {
          this.showEditOption = false;
        }
        else {
          this.showEditOption = true;
        }
      }
    });
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        this.quoteEandOOptions = this.quote?.liabilityEandOTemplateDataId;

      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        if ([AllowedProductTemplate.LIABILITY_EANDO].includes(this.quote?.productId['productTemplate'])) {
        this.quoteEandOOptions = template
        }
      }
    })
  }

  ngOnInit(): void {
  }
  loadQuoteOption(templateId: string) {
    this.liabilityEandOTemplateService.get(templateId).subscribe({
      next: quoteLiablitity => {
        this.quoteEandOOptions = quoteLiablitity.data.entity;
      },
      error: e => {
        console.log(e);
      }
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
        this.quoteEandOOptions.liabiltyDeductibles[this.editRecordIndex] = this.deductiblesDetails;
      }
      else {
        this.quoteEandOOptions.liabiltyDeductibles.push(this.deductiblesDetails)
      }
      this.ClearDeductibles()
      this.editRecordIndex = 0
      this.isEditDeductible = false
    }

    // let totalIndictiveQuoteAmtWithGst = Number(this.quoteEandOOptions.totalPremiumAmt * 0.18)
    // this.quoteService.update(this.quote._id, { totalIndictiveQuoteAmtWithGst: +totalIndictiveQuoteAmtWithGst }).subscribe({
    //   next: (dto: IOneResponseDto<IQuoteSlip>) => {
    this.liabilityEandOTemplateService.updateArray(this.quoteEandOOptions._id, this.quoteEandOOptions).subscribe({
      next: quote => {
        console.log("E&O Added Successfully");
        this.quoteService.refresh(() => {
        })
      },
      error: error => {
        console.log(error);
      }
    });
    // console.log(this.quote)
    // },
    // error: e => {
    //   console.log(e);
    // }
    //    });




  }

  addDeductibles() {
    this.deductiblesDetails = new liabiltyEandODeductibles()
    this.deductiblesDetails.description = ""
    this.deductiblesDetails.amount = 0
    this.showTextboxes = true;
  }

  ClearDeductibles() {
    this.deductiblesDetails = new liabiltyEandODeductibles()
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

  editRecord(item: liabiltyEandODeductibles, index: number) {
    const recordToEdit = this.quoteEandOOptions.liabiltyDeductibles[index];
    this.deductiblesDetails = new liabiltyEandODeductibles()
    this.deductiblesDetails.description = recordToEdit.description
    this.deductiblesDetails.amount = recordToEdit.amount
    this.showTextboxes = true;
    this.editRecordIndex = index
    this.isEditDeductible = true
  }

  deleteRecord(item: liabiltyEandODeductibles, index: number) {

    const ref = this.dialogService.open(DeleteConfirmationDialogComponent, {
      header: '',
      width: '740px',
      styleClass: "flatPopup"
    });

    ref.onClose.subscribe((response) => {
      if (response?.confirmed != undefined) {

        if (response.confirmed) {
          this.quoteEandOOptions.liabiltyDeductibles.splice(index, 1);
          this.save();
          this.editRecordIndex = 0
          this.isEditDeductible = false
        } else {
        }
      }
    })


  }
}
