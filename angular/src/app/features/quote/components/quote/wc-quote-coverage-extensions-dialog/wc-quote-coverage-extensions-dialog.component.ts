import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, ILovSI, ILovSIDDL, IManyResponseDto } from 'src/app/app.model';
import { IDiffHistory } from 'src/app/components/audit-trail/audit-trail.model';
import { IQuoteSlip, WCRatesData } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { IUser } from 'src/app/features/admin/user/user.model';
import { IWCCoverageType } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.model';
import { WCCoverageTypeService } from 'src/app/features/admin/wc-coverage-type/wc-coverage-type.service';
import { IWCRates } from 'src/app/features/admin/wc-rates-master/wc-rate-master.model';
import { WCRatesService } from 'src/app/features/admin/wc-rates-master/wc-rate-master.service';
import { ISalarySlabs } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.model';
import { SalarySlabsService } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.service';
import { IndicativePremiumCalcService } from '../quote-requisition-tabs/workmen-coverages-tab/indicativepremiumcalc.service';
import { IWCCoverageForMedicalExpenses } from 'src/app/features/admin/wc-coverage-for-mefical-expenses/wc-coverage-for-mefical-expenses.model';
import { WCCoverageForMedicalExpensesService } from 'src/app/features/admin/wc-coverage-for-mefical-expenses/wc-coverage-for-mefical-expenses.service';
import { DialogService } from 'primeng/dynamicdialog';
const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 0,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};
@Component({
  selector: 'app-wc-quote-coverage-extensions-dialog',
  templateUrl: './wc-quote-coverage-extensions-dialog.component.html',
  styleUrls: ['./wc-quote-coverage-extensions-dialog.component.scss']
})
export class wcQuoteCoverageExtensionsDialogComponent implements OnInit {
  salarySlabRates: ISalarySlabs[]
  quote: IQuoteSlip
  wcTemplateModel: any
  wcRatesMaster: IWCRates[]
  private currentQuote: Subscription;
  wccoverageTypes: IWCCoverageType[];
  yesNoDDL: ILov[] = []
  medicalAmountDdl: ILov[] = []
  wcDetails: WCRatesData[] = []
  medicalExpensesAmountLst: ILovSIDDL[] = []
  medicalExpensesAmountDataList: IWCCoverageForMedicalExpenses[] = []
  constructor(private dialogService: DialogService,private wcCoverageMedicalExpensesService: WCCoverageForMedicalExpensesService, private messageService: MessageService, private quoteWcTemplateService: QuoteWcTemplateService, private indicativePremiumCalcService: IndicativePremiumCalcService, private quoteService: QuoteService, private wcCoverageTypeService: WCCoverageTypeService, private wcRatesService: WCRatesService, private salarySlabsService: SalarySlabsService) {
    this.loadCoverageMedicalExpenses(DEFAULT_RECORD_FILTER);

    this.yesNoDDL.push({ label: "Yes", value: "Yes" }, { label: "No", value: "No" })
    this.medicalAmountDdl.push({ label: "0", value: "0" }, { label: "2500", value: "2500" }, { label: "50000", value: "50000" }, { label: "100000", value: "100000" }, { label: "150000", value: "150000" }, { label: "200000", value: "200000" }, { label: "500000", value: "500000" }, { label: "1000000", value: "1000000" })
    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote

        this.wcTemplateModel = this.quote?.wcTemplateDataId;
        if (this.wcTemplateModel.wcCoverAddOnCovers.length == 0) {
          this.loadWCCoverageType();
        }
        this.getSalarySlabs()
        if (this.wcTemplateModel.wcDetails.length == 0) {
          this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
          this.wcDetails = this.wcTemplateModel.wcDetails
          console.log(this.wcTemplateModel.wcDetails)
        }
        else {
          this.wcDetails = this.wcTemplateModel.wcDetails
        }

        if (this.wcDetails.length > 0) {
          this.wcDetails.forEach(element => {
            if (element.medicalBenifitsAns != "Yes")
              element.medicalBenifitsAns = 'No';
          });
        }

      }
    })
  }

  ngOnInit(): void {

  }
  setAmount(model) {
    model.medicalBenifitsAmount = +this.medicalExpensesAmountLst.filter(x => x.value == model.medicalBenifitsAmountId)[0].label;
    let totalSumOfEmployee = this.wcTemplateModel.wcDetails.reduce((sum, current) => sum + +current.noOfEmployees, 0);
    let rate = this.medicalExpensesAmountDataList.filter(x => x._id == model.medicalBenifitsAmountId)[0].netPremiumPerEmployee
    this.wcTemplateModel.addonCoversAmount = +totalSumOfEmployee * +rate
    //this.recalPremium()
    this.save()
  }

  resetAmount(model) {
    model.medicalBenifitsAmount = 0
    model.medicalBenifitsAmountId =""
  }

  loadCoverageMedicalExpenses(event: LazyLoadEvent) {
    this.wcCoverageMedicalExpensesService.getMany(event).subscribe({
      next: records => {
        if(records.data.entities.length>0)
          {
            records.data.entities = records.data.entities.sort((a, b) => (a.limitPerEmployee < b.limitPerEmployee ? -1 : 1));

          }
        this.medicalExpensesAmountLst = records.data.entities.map(entity => ({ label: entity.limitPerEmployee.toString(), value: entity._id,siAmount: Intl.NumberFormat('en-IN').format(entity.limitPerEmployee).toString() }));
        this.medicalExpensesAmountDataList = records.data.entities;
      },
      error: e => {
        console.log(e);
      }
    });
  }
  getWcRatesMaster() {
    this.wcRatesService.getRatesMastersByProductId(this.quote?.productId["_id"]).subscribe({
      next: records => {
        this.wcRatesMaster = records.data.entities;
      },
      error: e => {
        console.log(e);
      }
    });
  }

  getSalarySlabs() {
    this.salarySlabsService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        this.salarySlabRates = records.data.entities;
        this.getWcRatesMaster();
      },
      error: e => {
        console.log(e);
      }
    });
  }
  recalPremium() {
    let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlabRates, this.wcTemplateModel.wcDetails);
    this.wcTemplateModel.indicativePremium = wcDetails.reduce((sum, current) => sum + current.netPremium, 0);
    this.wcTemplateModel.indicativePremium = this.wcTemplateModel.indicativePremium + this.wcTemplateModel.addonCoversAmount;
    this.wcTemplateModel.targetPremium = this.wcTemplateModel.indicativePremium;
    let targetpr = +this.wcTemplateModel.indicativePremium * ((100 - +this.wcTemplateModel.discountbasedonPremium) / 100)
    this.wcTemplateModel.targetPremium = targetpr;
    
  }

  save() {

    let isValid = true

    if (this.wcTemplateModel.wcDetails.some(x => x.medicalBenifitsAns == 'Yes' && x.medicalBenifitsAmount == 0)) {
      // this.messageService.add({
      //   severity: "error", summary: "Missing Information",
      //   detail: "Amount is required if Medical Extension Benifits is allowed (Yes) for", life: 3000
      // });
      isValid = false;

    }

    if (isValid) {


      let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlabRates, this.wcTemplateModel.wcDetails);
     // this.recalPremium();
      this.calculateAddonsAmount(this.wcTemplateModel.wcDetails)
      this.wcTemplateModel.underWriteraddonCoversAmount = this.wcTemplateModel.addonCoversAmount;
      this.wcTemplateModel.underWriterdiscountbasedonPremium = this.wcTemplateModel.discountbasedonPremium;
      this.wcTemplateModel.underWriterindicativePremium = this.wcTemplateModel.indicativePremium;
      this.wcTemplateModel.underWritertargetPremium = this.wcTemplateModel.targetPremium;
      this.wcTemplateModel.underWritertotalPremiumAmt = this.wcTemplateModel.totalPremiumAmt;
      const updatePayload = this.wcTemplateModel;
      updatePayload.wcDetails = wcDetails
      this.quoteWcTemplateService.updateArray(this.wcTemplateModel._id, updatePayload).subscribe({
        next: quote => {
          console.log("WC Updated Successfully");
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }


  calculateAddonsAmount(modelArr) {
    let addonAMtSUm = 0;
    modelArr.forEach(element => {
      if (element.medicalBenifitsAns == "Yes") {
        let rate = this.medicalExpensesAmountDataList.filter(x => x._id == element.medicalBenifitsAmountId)[0].netPremiumPerEmployee;
        addonAMtSUm = addonAMtSUm + (+rate * +element.noOfEmployees)
      }
    });
    this.wcTemplateModel.addonCoversAmount = addonAMtSUm;
    this.wcTemplateModel.totalPremiumAmt = this.wcTemplateModel.indicativePremium + this.wcTemplateModel.addonCoversAmount;

  }

  loadWCCoverageType() {
    this.wcCoverageTypeService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        this.wccoverageTypes = records.data.entities;
      },
      error: e => {
        console.log(e);
      }
    });
  }


  ngOnDestroy(): void {
    this.currentQuote.unsubscribe();
  }


}
