import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { IQuoteSlip, liabiltyProductDeductibles } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { IUser } from 'src/app/features/admin/user/user.model';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-liability-deductibles-details',
  templateUrl: './liability-deductibles-details.component.html',
  styleUrls: ['./liability-deductibles-details.component.scss']
})
export class LiabilityDeductiblesDetailsComponent implements OnInit {
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  quoteDandOOptions: any
  //selectedDeductibles: [] = [];
  showEditOption: boolean = false;
  deductiblesDetails: liabiltyProductDeductibles = new liabiltyProductDeductibles()
  editRecordIndex: number = 0
  isEditDeductible: boolean = false
  isSaveEnabled: boolean = false
  showTextboxes: boolean = false;
  private currentSelectedTemplate: Subscription;
  constructor(private accountService: AccountService,private messageService: MessageService,private dialogService: DialogService, private quoteService: QuoteService, private liabilityTemplateService: liabilityTemplateService) {
    // * DO NOT TOUCH
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
        //this.quoteDandOOptions = this.quote?.liabilityTemplateDataId;

      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteDandOOptions = template
      }
    })
  }

  // getSelectedDeductibles(){
  //   var addedDeductibles = this.quoteDandOOptions.liabiltyDeductibles;
  //   if(addedDeductibles.length>0){
  //     addedDeductibles = addedDeductibles.filter(x=>x.amount>0);
  //   }
  //   return addedDeductibles;
  // }
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
    this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
      next: quote => {
        console.log("DANDO Added Successfully");
      },
      error: error => {
        console.log(error);
      }
    });
  }
  ngOnInit(): void {
  }
  // onSideAIndividualCoverCheckboxChange(event: any, item: any) {
  //   if (!item.isSelected) {
  //     item.amount = 0
  //   }
  // }
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
