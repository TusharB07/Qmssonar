import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { liabilityEandOTemplateService } from 'src/app/features/admin/quote/quote.liabilityEandOTemplate.service';
import { IQuoteSlip, SubsidiaryDetails, SubsidiaryEandODetails, liabiltyEandOAddOnCovers } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { AllowedRoles, IRole } from 'src/app/features/admin/role/role.model';
import { AllowedProductTemplate } from 'src/app/features/admin/product/product.model';

@Component({
  selector: 'app-eando-liability-teritory-details',
  templateUrl: './eando-liability-teritory-details.component.html',
  styleUrls: ['./eando-liability-teritory-details.component.scss']
})
export class LiabilityEandOTeritoryDetailsComponent implements OnInit {
  quoteEandOOptions: any
  private currentQuote: Subscription;
  quote: IQuoteSlip;
  subsidaryDetails: SubsidiaryEandODetails[] = [];
  liabiltyCovers: liabiltyEandOAddOnCovers[] = [];
  optionCovers: ILov[] = [];
  subsidairyfilename: string = ""
  countryList: any = []
  showEditOption = false;
  OptionTerritoryAndJurasdiction: ILov[] = []
  private currentSelectedTemplate: Subscription;
  AllowedProductTemplate = AllowedProductTemplate;

  constructor(private accountService: AccountService, private quoteService: QuoteService, private wclistofmasterservice: WCListOfValueMasterService, private liabilityEandOTemplateService: liabilityEandOTemplateService) {
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

        // if (this.quote?.liabilityEandOTemplateDataId !=null && this.quote?.liabilityEandOTemplateDataId["_id"] != undefined) {
        //   this.liabilityEandOTemplateService.get(this.quote?.liabilityEandOTemplateDataId["_id"]).subscribe({
        //     next: quoteLiablitity => {
        //       this.quoteEandOOptions = quoteLiablitity.data.entity;
        //       this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers
        //       // this.basicDetailsattachment=this.quoteEandOOptions.basicDetailsAttchments;
        //       // this.quoteEandOOptions = this.quote?.liabilityEandOTemplateDataId;
        //       this.subsidaryDetails = this.quoteEandOOptions.subsidaryDetails
        //       this.subsidaryDetails.forEach(element => {
        //         if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
        //           element.activityName = 'N/A'
        //         }
        //       });
        //       this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers
        //       this.liabiltyCovers.forEach(element => {
        //         if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
        //           element.optionSelected = 'N/A'
        //         }
        //         if (element.description == '' || element.description == null || element.description == undefined) {
        //           element.description = 'N/A'
        //         }
        //       });
        //       this.getFilenameFromPath()

        //     },
        //     error: e => {
        //       console.log(e);
        //     }
        //   });
        // }
      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.liabilityEandOTemplateService.get(template._id).subscribe({
          next: quoteLiablitity => {
            this.quoteEandOOptions = quoteLiablitity.data.entity;
            this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers
            this.subsidaryDetails = this.quoteEandOOptions.subsidaryDetails
            this.subsidaryDetails.forEach(element => {
              if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
                element.activityName = 'N/A'
              }
            });
            this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers
            this.liabiltyCovers.forEach(element => {
              if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
                element.optionSelected = 'N/A'
              }
              if (element.description == '' || element.description == null || element.description == undefined) {
                element.description = 'N/A'
              }
            });
            this.getFilenameFromPath()
          },
          error: error => {
            console.log(error);
          }
        });
      }
    })
  }
  loadQuoteOption(templateId: string) {
    this.liabilityEandOTemplateService.get(templateId).subscribe({
      next: quoteLiablitity => {
        this.quoteEandOOptions = quoteLiablitity.data.entity;
        this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers
        // this.basicDetailsattachment=this.quoteEandOOptions.basicDetailsAttchments;
        // this.quoteEandOOptions = this.quote?.liabilityEandOTemplateDataId;
        this.subsidaryDetails = this.quoteEandOOptions.subsidaryDetails
        this.subsidaryDetails.forEach(element => {
          if (element.activityName == '' || element.activityName == null || element.activityName == undefined) {
            element.activityName = 'N/A'
          }
        });
        this.liabiltyCovers = this.quoteEandOOptions.liabiltyCovers
        this.liabiltyCovers.forEach(element => {
          if (element.optionSelected == '' || element.optionSelected == null || element.optionSelected == undefined) {
            element.optionSelected = 'N/A'
          }
          if (element.description == '' || element.description == null || element.description == undefined) {
            element.description = 'N/A'
          }
        });
        this.getFilenameFromPath()

      },
      error: e => {
        console.log(e);
      }
    });
  }

  ngOnInit(): void {
    this.searchOptionsCountries()
    this.loadTerritoryAndJurasdiction()
  }

  addSubsidary() {
    let subDetails = new SubsidiaryDetails()
    this.quoteEandOOptions.subsidaryDetails.push(subDetails)
  }

  loadTerritoryAndJurasdiction() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_TERRITORY_AND_JURISDICTION).subscribe({
      next: records => {

        this.OptionTerritoryAndJurasdiction = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }
  searchOptionsCountries() {

    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.EANDO_SUBSIDIARY_LOCATION).subscribe({
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

  removeRow(index: any) {
    this.quoteEandOOptions.subsidaryDetails.splice(index, 1);
  }


  downloadSubsidiaryauditedfinancialReport() {
    this.liabilityEandOTemplateService.SubsidiaryAnnualReportDownload(this.quoteEandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy annual Report';

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
    this.liabilityEandOTemplateService.getSubsidiaryAnnualReportDownloadFileName(this.quoteEandOOptions._id).subscribe({
      next: (dto: any) => {
        if (dto.status == 'success') {
          this.subsidairyfilename = dto.message
        }
        else {
          this.subsidairyfilename = 'subsidairy-annual-report.pdf';
        }
      }
    })
  }
  downloadFileSubsidiaryauditedfinancialReport() {
    this.liabilityEandOTemplateService.SubsidiaryAnnualReportDownload(this.quoteEandOOptions._id).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Subsidairy annual Report';

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
    //   },
    //   error: e => {
    //     console.log(e);
    //   }
    // });
  }
}
