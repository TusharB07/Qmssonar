import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { IOneResponseDto, PermissionType } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { AllowedGMCPARENTabsTypes, GMCTemplate, IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { GmcClaimExperience, IGmcDataModel, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IUser } from 'src/app/features/admin/user/user.model';

@Component({
  selector: 'app-claim-analytics-tab',
  templateUrl: './clam-analytics-tab.component.html',
  styles: [
  ]
})
export class ClaimAnalyticsTabComponent implements OnInit {

  tabsData: IGMCTemplate = new GMCTemplate();
  quote: IQuoteSlip;
  private currentQuote: Subscription;
  quoteGmcOptionsLst: IQuoteGmcTemplate[];

  private currentSelectedTemplate: Subscription;
  selectedQuoteTemplate: IQuoteGmcTemplate;
  currentClaim: GmcClaimExperience = new GmcClaimExperience();

  acceptedFiles: string = ".pdf, .jpg, .png, .doc, .docx, .xls, .xlsx, .csv";
  currentUser$: Observable<IUser>;
  permissions: PermissionType[] = []
  uploadHttpHeaders: HttpHeaders;
  uploadDocumentUrl: string;
  currentSelectedOptionId: string;

  constructor(private accountService: AccountService, private quoteService: QuoteService, private gmcQuoteTemplateService: QoutegmctemplateserviceService, private messageService: MessageService) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
        // console.log(this.quote);

      }
    })

    this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.selectedQuoteTemplate = template;
        this.currentSelectedOptionId = template._id;
        this.tabsData = null//template.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.CLAIMANALYTICS)[0]
        this.currentClaim = template.claimExperience[0];
        this.uploadDocumentUrl = this.quoteService.claimAnalyticsDocumentUploadUrl(this.currentSelectedOptionId);
      }
    })

  }

  ngOnInit(): void {
    this.uploadDocumentUrl = this.quoteService.claimAnalyticsDocumentUploadUrl(this.currentSelectedOptionId);

    this.permissions = ['read', 'update', 'delete'];
    console.log(this.tabsData);
  }

  saveTabs() {
    // const updatePayload = this.selectedQuoteTemplate

    // this.gmcQuoteTemplateService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
    //   next: partner => {
    //     console.log("ttest");
    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.quoteGmcOptionsLst = dto.data.entity;
        this.quoteGmcOptionsLst.forEach(element => {
          element.claimExperience = this.selectedQuoteTemplate.claimExperience
          this.gmcQuoteTemplateService.updateArray(element._id, element).subscribe({
            next: quote => {
              // this.quote = quote.data.entity;
              // console.log(this.quote)
              // this.messageService.add({
              //   severity: "success",
              //   summary: "Successful",
              //   detail: `Saved`,
              //   life: 3000
              // });
              //If GMC master Create Template
            },
            error: error => {
              console.log(error);
            }
          });
        });

      },
      error: e => {
        console.log(e);
      }
    });
  }

  preyear(currentClaim) {
    const claimLength = this.selectedQuoteTemplate.claimExperience.length;
    let index = this.selectedQuoteTemplate.claimExperience.indexOf(currentClaim);
    if (index > 0) {
      if (index < claimLength) {
        this.currentClaim = this.selectedQuoteTemplate.claimExperience[index - 1]
      }
      else {
        this.currentClaim = this.selectedQuoteTemplate.claimExperience[claimLength]
      }

    }
    else {
      // this.currentClaim =  this.selectedQuoteTemplate.claimExperience[0]
    }


  }

  nextyear(currentClaim) {
    const claimLength = this.selectedQuoteTemplate.claimExperience.length;
    let index = this.selectedQuoteTemplate.claimExperience.indexOf(currentClaim);
    if (index >= 0) {
      if (index < claimLength - 1) {
        this.currentClaim = this.selectedQuoteTemplate.claimExperience[index + 1]
      }
      else {
        this.currentClaim = this.selectedQuoteTemplate.claimExperience[claimLength - 1]
      }

    }
    else {
      // this.currentClaim =  this.selectedQuoteTemplate.claimExperience[0]
    }
  }

  onUploadDocument() {
    // this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
    //   next: (template) => {
    //     this.currentSelectedOptionId=template._id;
    //     this.selectedQuoteTemplate = template;
    //     this.tabsData = template.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.CLAIMANALYTICS)[0]
    //     this.currentClaim = template.claimExperience[0];

    //     this.uploadDocumentUrl =this.quoteService.claimAnalyticsDocumentUploadUrl(this.currentSelectedOptionId);
    //   }
    // })
    // this.gmcQuoteTemplateService.get(this.selectedQuoteTemplate._id).subscribe({
    //   next: template => {
    //     let data = template.data.entity;
    //     this.currentSelectedOptionId = data._id;
    //     this.selectedQuoteTemplate = data;
    //     this.tabsData = data.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.CLAIMANALYTICS)[0]
    //     this.currentClaim = data.claimExperience[0];

    //   },
    //   error: error => {
    //     console.log(error);
    //   }
    // });

    this.getOptions();
  }
  getOptions() {
    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
        this.loadOptionsData(dto.data.entity);
        this.loadSelectedOption(dto.data.entity.filter(x => x.optionName == this.selectedQuoteTemplate.optionName)[0])
      },
      error: e => {
        console.log(e);
      }
    });
  }

  loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
    this.quoteService.setQuoteOptions(quoteOption)
  }

  loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
    this.quoteService.setSelectedOptions(quoteOption)
  }


  downloadClaimAnalyticsReport() {
    this.quoteService.claimAnalyticsDocumentDownload(this.currentSelectedOptionId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Risk Inspection Report';

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

  deleteClaimAnalyticsReport() {
    this.quoteService.claimAnalyticsDocumentDelete(this.currentSelectedOptionId).subscribe({
      next: () => {
        this.getOptions();
        // this.gmcQuoteTemplateService.get(this.currentSelectedOptionId).subscribe({
        //   next: template => {
        //     let data = template.data.entity;
        //     this.currentSelectedOptionId = data._id;
        //     this.selectedQuoteTemplate = data;
        //     this.tabsData = data.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.CLAIMANALYTICS)[0]
        //     this.currentClaim = data.claimExperience[0];

        //     this.uploadDocumentUrl = this.quoteService.claimAnalyticsDocumentUploadUrl(this.currentSelectedOptionId);
        //   },
        //   error: error => {
        //     console.log(error);
        //   }
        // });
      },
      error: e => {
        console.log(e);
      }
    })
  }

}
