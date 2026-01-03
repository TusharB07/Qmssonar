import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip, liabiltyProductDeductibles } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { IOneResponseDto } from 'src/app/app.model';
import { liabilityCGLTemplateService } from 'src/app/features/admin/quote/quote.liabilityCGLTemplate.service';

@Component({
  selector: 'app-liability-cgl-deductibles-details',
  templateUrl: './liability-cgl-deductibles-details.component.html',
  styleUrls: ['./liability-cgl-deductibles-details.component.scss']
})
export class LiabilityCGLDeductiblesDetailsComponent implements OnInit {
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  quoteCGLOptions: any
  showEditOption = false;
  deductiblesDetails: liabiltyProductDeductibles = new liabiltyProductDeductibles()
  editRecordIndex: number = 0
  isEditDeductible: boolean = false
  isSaveEnabled: boolean = false
  showTextboxes: boolean = false;
  private currentSelectedTemplate: Subscription;

  constructor(private dialogService: DialogService, private messageService: MessageService, private accountService: AccountService, private quoteService: QuoteService, private liabilityCGLTemplateService: liabilityCGLTemplateService) {
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
        this.quoteCGLOptions = this.quote?.liabilityCGLTemplateDataId;

      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteCGLOptions = template;     
      }
    })
  }

  ngOnInit(): void {
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
        this.quoteCGLOptions.liabiltyDeductibles[this.editRecordIndex] = this.deductiblesDetails;
      }
      else {
        this.quoteCGLOptions.liabiltyDeductibles.push(this.deductiblesDetails)
      }
      this.ClearDeductibles()
      this.editRecordIndex = 0
      this.isEditDeductible = false
    }

    let totalIndictiveQuoteAmtWithGst = Number(this.quoteCGLOptions.totalPremiumAmt * 0.18)
    this.quoteService.update(this.quote._id, { totalIndictiveQuoteAmtWithGst: +totalIndictiveQuoteAmtWithGst }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.liabilityCGLTemplateService.updateArray(this.quoteCGLOptions._id, this.quoteCGLOptions).subscribe({
          next: quote => {
            this.quoteService.refresh(() => {
            })
          },
          error: error => {
            console.log(error);
          }
        });
        // console.log(this.quote)
      },
      error: e => {
        console.log(e);
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
    const recordToEdit = this.quoteCGLOptions.liabiltyDeductibles[index];
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
          this.quoteCGLOptions.liabiltyDeductibles.splice(index, 1);
          this.save();
          this.editRecordIndex = 0
          this.isEditDeductible = false
        } else {
        }
      }
    })


  }
}
