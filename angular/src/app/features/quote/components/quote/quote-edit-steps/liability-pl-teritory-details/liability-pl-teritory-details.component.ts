import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { liabilityProductTemplateService } from 'src/app/features/admin/quote/quote.liabilityProductTemplate.service';
import { IQuoteSlip, SubsidiaryProductDetails, liabiltyProductAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IRole, AllowedRoles } from 'src/app/features/admin/role/role.model';


@Component({
  selector: 'app-liability-pl-teritory-details',
  templateUrl: './liability-pl-teritory-details.component.html',
  styleUrls: ['./liability-pl-teritory-details.component.scss']
})
export class LiabilityProductliabilityTeritoryDetailsComponent implements OnInit {
  quotePLOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  subsidaryDetails: SubsidiaryProductDetails[] = [];
  liabiltyCovers: liabiltyProductAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  countryList: ILov[] = [];
  showEditOption = false;
  OptionTerritoryAndJurasdiction: ILov[] = []
  AllowedProductTemplate = AllowedProductTemplate;
  private currentSelectedTemplate: Subscription;

  constructor(private accountService: AccountService, private messageService: MessageService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityProductTemplateService: liabilityProductTemplateService) {
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
        if (this.quote?.liabilityProductTemplateDataId != null && this.quote?.liabilityProductTemplateDataId["_id"] != undefined) {
          this.liabilityProductTemplateService.get(this.quote?.liabilityProductTemplateDataId["_id"]).subscribe({
            next: quoteLiablitity => {
              // this.quotePLOptions = quoteLiablitity.data.entity;
              // console.log("NO 1: " + this.quotePLOptions.juridictionId)
              // this.subsidaryDetails = this.quotePLOptions.subsidaryDetails
              // this.subsidaryDetails.forEach(element => {
              //   if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
              //     element.activityName = 'N/A'
              //   }


              // });
              // this.liabiltyCovers = this.quotePLOptions.liabiltyCovers
              // this.liabiltyCovers.forEach(element => {
              //   if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
              //     element.optionSelected = 'N/A'
              //   }

              //   if (element.description == '' || element.description == null || element.description == undefined) {
              //     element.description = 'N/A'
              //   }
              // });
            },
            error: e => {
              console.log(e);
            }
          });
        }
        //}
        this.searchOptionsCountries()
      }
    })


    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.liabilityProductTemplateService.get(template["_id"]).subscribe({
          next: quoteLiablitity => {
            if (quoteLiablitity) {
              this.quotePLOptions = quoteLiablitity.data.entity
              console.log("NO 2: " + this.quotePLOptions.juridictionId)
              this.subsidaryDetails = this.quotePLOptions.subsidaryDetails
              this.subsidaryDetails.forEach(element => {
                if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
                  element.activityName = 'N/A'
                }
              });
              this.liabiltyCovers = this.quotePLOptions.liabiltyCovers
              this.liabiltyCovers.forEach(element => {
                if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                  element.optionSelected = 'N/A'
                }

                if (element.description == '' || element.description == null || element.description == undefined) {
                  element.description = 'N/A'
                }
              });
            }
          },
          error: error => {
            console.log(error);
          }
        });
      }
    })
  }

  ngOnInit(): void {
    this.searchOptionsCountries();
    this.loadTerritoryAndJurasdiction()
  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current((this.quote.productId['productTemplate'] === AllowedProductTemplate.LIABILITY_PRODUCT)
      ? WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_TERRITORY_AND_JURISDICTION
      : WCAllowedListOfValuesMasters.CYBER_LIABILITY_TERRITORY_AND_JURISDICTION).subscribe({
        next: records => {
          this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        },
        error: e => {
          console.log(e);
        }
      });
  }

  handleBusinessActivityCheckboxChange(event: any, item: any, index: number) {
    if (item.isSelected && !item.countryId) {
      this.messageService.add({
        key: "error",
        severity: "error",
        summary: `Missing Information`,
        detail: `Please select a location`
      });
      this.quotePLOptions.subsidaryDetails.splice(index, 1);
      let subDetails = new SubsidiaryProductDetails()
      this.quotePLOptions.subsidaryDetails.push(subDetails)

    }
    else {
      if (!item.isSelected) {
        this.quotePLOptions.subsidaryDetails[index].activityName = ""
      }
    }
  }
  removeRow(index: any) {
    this.quotePLOptions.subsidaryDetails.splice(index, 1);
  }

  addSubsidary() {
    let subDetails = new SubsidiaryProductDetails()
    this.quotePLOptions.subsidaryDetails.push(subDetails)
  }

  searchOptionsCountries() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.PRODUCT_LIABILITY_SUBSIDIARY_LOCATION).subscribe({
      next: records => {
        if (records.data.entities.length > 0) {
          records.data.entities = records.data.entities.sort((a, b) => (a.lovKey < b.lovKey ? -1 : 1));
        }
        this.countryList = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });

  }
  setCountryName(item: any) {
    item.countryName = this.countryList.filter(x => x.value == item.countryId)[0].label;
  }



  save() {
    this.liabilityProductTemplateService.updateArray(this.quotePLOptions._id, this.quotePLOptions).subscribe({
      next: quote => {
        console.log("PL Added Successfully");
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
