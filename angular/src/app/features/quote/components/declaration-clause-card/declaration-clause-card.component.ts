import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IQuoteOption, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';

@Component({
  selector: 'app-declaration-clause-card',
  templateUrl: './declaration-clause-card.component.html',
  styleUrls: ['./declaration-clause-card.component.scss']
})
export class DeclarationClauseCardComponent implements OnInit {

  isMobile: boolean = false;
  declarationForm: FormGroup;
  declarationClause = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
  declarationDropdown = [{ label: 'Highest', value: "Highest" }, { label: 'Average', value: "Average" }];
  selectedDeclarationClause : boolean;
  selectedDeclarationDropDown : string;
  @Input() quote: IQuoteSlip
  @Input() quoteOptionData: IQuoteOption    // New_Quote_Option
  private currentPropertyQuoteOption: Subscription;


  constructor(
    private deviceService: DeviceDetectorService,
    private quoteOptionService: QuoteOptionService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {

    // New_Quote_option
    this.currentPropertyQuoteOption = this.quoteOptionService.currentPropertyQuoteOption$.subscribe({
      next: (dto: IQuoteOption) => {
        this.quoteOptionData = dto;
        this.selectedDeclarationClause = this.quoteOptionData?.dropdownClause
        this.selectedDeclarationDropDown = this.quoteOptionData?.declarationDropdown 
      }
    });

  }

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
     
  }

  handleClauseDropdownChange(event){
    
    this.quoteOptionService.dropdownClause(this.quote._id, this.quoteOptionData._id, event.value).subscribe({
      next: res => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: `Successful`,
          life: 3000
        });
        // call the api to fetch the data form user tabel after delete
      },
      error: e => {
        console.log(e.error.message);
        this.messageService.add({
          severity: "fail",
          summary: "Fail",
          detail: e.error.message,
          life: 3000
        });
      }
    })
  }  

  handleDropdownChange(event){
    
    this.quoteOptionService.descriptionDropdown(this.quote._id, this.quoteOptionData._id, event.value).subscribe({
      next: res => {
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: `Successful`,
          life: 3000
        });
        // call the api to fetch the data form user tabel after delete
      },
      error: e => {
        console.log(e.error.message);
        this.messageService.add({
          severity: "fail",
          summary: "Fail",
          detail: e.error.message,
          life: 3000
        });
      }
    })
  }  

}
