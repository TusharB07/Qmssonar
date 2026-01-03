import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip, liabiltyProductDeductibles } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';

@Component({
  selector: 'app-liability-wc-territory-details',
  templateUrl: './liability-wc-territory-details.component.html',
  styleUrls: ['./liability-wc-territory-details.component.scss']
})
export class LiabilityWCTerritoryDetailsComponent implements OnInit {
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  quoteWCOptions: any
  showEditOption = false;
  deductiblesDetails: liabiltyProductDeductibles = new liabiltyProductDeductibles()
  editRecordIndex: number = 0
  isEditDeductible: boolean = false
  isSaveEnabled: boolean = false
  showTextboxes: boolean = false;
  OptionTerritoryAndJurasdiction: ILov[] = []
  private currentSelectedTemplate: Subscription;

  constructor(private dialogService: DialogService, private wclistofmasterservice: WCListOfValueMasterService, private messageService: MessageService, private accountService: AccountService, private quoteService: QuoteService, private liabilityWCTemplateService: QuoteWcTemplateService) {
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
        //this.quoteWCOptions = this.quote.wcTemplateDataId
        
      }
    })
  
    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.quoteWCOptions = template
      }
    })


  }

  ngOnInit(): void {
    this.loadTerritoryAndJurasdiction()
  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CGL_TERRITORY_AND_JURISDICTION).subscribe({
      next: records => {
        this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }

  removeRow(index: any) {
    this.quoteWCOptions.subsidaryDetails.splice(index, 1);
  }

  save() {
    this.liabilityWCTemplateService.updateArray(this.quoteWCOptions._id, this.quoteWCOptions).subscribe({
      next: quote => {
        console.log("CGL Added Successfully");
        this.quoteService.refresh(() => {
        })
      },
      error: error => {
        console.log(error);
      }
    });
    this.quoteService.refresh(() => {
    })

  }
}
