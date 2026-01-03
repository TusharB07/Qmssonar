import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';
import { liabilityTemplateService } from 'src/app/features/admin/quote/quote.liabilityTemplate.service';
import { IQuoteSlip, SubsidiaryDetails, liabiltyAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';

@Component({
  selector: 'app-liability-teritory-details',
  templateUrl: './liability-teritory-details.component.html',
  styleUrls: ['./liability-teritory-details.component.scss']
})
export class LiabilityTeritoryDetailsComponent implements OnInit {
  //optionsBusinessTypeAsParentCompany: ILov[] = []
  quoteDandOOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  subsidaryDetails: SubsidiaryDetails[] = [];
  liabiltyCovers: liabiltyAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  subsidairyfilename: string = ""
  countryList: ILov[] = [];
  showEditOption: boolean = false;
  AllowedProductTemplate = AllowedProductTemplate;
  private currentSelectedTemplate: Subscription;
  OptionTerritoryAndJurasdiction: ILov[] = []

  constructor(private accountService: AccountService, private messageService: MessageService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityTemplateService: liabilityTemplateService) {
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
        // this.loadTerritoryAndJurasdiction()
        // if (this.quote?.liabilityTemplateDataId != null && this.quote?.liabilityTemplateDataId["_id"] != undefined) {
        //   this.liabilityTemplateService.get(this.quote?.liabilityTemplateDataId["_id"]).subscribe({
        //     next: quoteLiablitity => {
        //       this.quoteDandOOptions = quoteLiablitity.data.entity
        //       console.log("THIS IS JURISDICTION ID 2: " + this.quoteDandOOptions.juridictionId)
        //       this.subsidaryDetails = this.quoteDandOOptions.subsidaryDetails
        //       this.subsidaryDetails.forEach(element => {
        //         if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
        //           element.activityName = 'N/A'
        //         }
        //       });
        //       this.liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
        //       this.liabiltyCovers.forEach(element => {
        //         if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
        //           element.optionSelected = 'N/A'
        //         }
        //         if (element.description == '' || element.description == null || element.description == undefined) {
        //           element.description = 'N/A'
        //         }
        //       });
        //       this.getFilenameFromPath()
        //       this.searchOptionsCountries()

        //     },
        //     error: error => {
        //       console.log(error);
        //     }
        //   });
        // }

      }
    })


    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.liabilityTemplateService.get(template._id).subscribe({
          next: quoteLiablitity => {
            this.quoteDandOOptions = quoteLiablitity.data.entity
            this.subsidaryDetails = this.quoteDandOOptions.subsidaryDetails
            console.log("THIS IS JURISDICTION ID 1: " + this.quoteDandOOptions.juridictionId)
            this.subsidaryDetails.forEach(element => {
              if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
                element.activityName = 'N/A'
              }
            });
            this.liabiltyCovers = this.quoteDandOOptions.liabiltyCovers
            this.liabiltyCovers.forEach(element => {
              if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                element.optionSelected = 'N/A'
              }

              if (element.description == '' || element.description == null || element.description == undefined) {
                element.description = 'N/A'
              }
            });
            this.loadTerritoryAndJurasdiction()
            this.getFilenameFromPath()
            this.searchOptionsCountries()
          },
          error: error => {
            console.log(error);
          }
        });

      }
    })
  }

  ngOnInit(): void {
    //this.loadTypeOfPolicy()

    this.searchOptionsCountries()


  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.CRIME_TERRITORY_AND_JURISDICTION).subscribe({
      next: records => {

        this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
        console.log(this.OptionTerritoryAndJurasdiction)
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
      this.quoteDandOOptions.subsidaryDetails.splice(index, 1);
      let subDetails = new SubsidiaryDetails()
      this.quoteDandOOptions.subsidaryDetails.push(subDetails)

    }
    else {
      if (!item.isSelected) {
        this.quoteDandOOptions.subsidaryDetails[index].activityName = ""
      }
    }
  }
  removeRow(index: any) {
    this.quoteDandOOptions.subsidaryDetails.splice(index, 1);
  }

  addSubsidary() {
    let subDetails = new SubsidiaryDetails()
    this.quoteDandOOptions.subsidaryDetails.push(subDetails)
  }

  searchOptionsCountries() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.LIABILITY_SUBSIDIARY_LOCATION).subscribe({
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
  downloadSubsidiaryauditedfinancialReport() {
    this.liabilityTemplateService.SubsidiaryauditedfinancialReportDownload(this.quoteDandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        // a.href = objectUrl
        // a.download = fileName;
        // a.click();

        window.open(objectUrl, '_blank');

        URL.revokeObjectURL(objectUrl);

      }
    })
  }
  getFilenameFromPath() {
    // const pathParts = filePath.split('/');

    // const filenameWithExtension = pathParts[pathParts.length - 1];

    // return filenameWithExtension;
    //return 'sunsidairy-audited-financial-report.pdf';
    this.liabilityTemplateService.getSubsidairyFinantialReportFileName(this.quoteDandOOptions._id).subscribe({
      next: (dto: any) => {
        if (dto.status == 'success') {
          this.subsidairyfilename = dto.message
        }
        else {
          this.subsidairyfilename = 'subsidairy-audited-financial-report.pdf';
        }
      }
    })
  }
  downloadFileSubsidiaryauditedfinancialReport() {
    this.liabilityTemplateService.SubsidiaryauditedfinancialReportDownload(this.quoteDandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy audited financial Report';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        a.href = objectUrl
        a.download = fileName;
        a.click();


      }
    })
  }

  save() {
    let totalIndictiveQuoteAmtWithGst = Number(this.quoteDandOOptions.totalPremiumAmt * 0.18)
    this.quoteService.update(this.quote._id, { totalIndictiveQuoteAmtWithGst: totalIndictiveQuoteAmtWithGst }).subscribe({
      next: quote => {
        this.liabilityTemplateService.updateArray(this.quoteDandOOptions._id, this.quoteDandOOptions).subscribe({
          next: quote => {
            console.log("Added Successfully");
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
    });

  }
}
