import { Component, OnInit, SimpleChanges } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ILov, ILovSIDDL, IOneResponseDto } from 'src/app/app.model';
import { AllowedQuoteStates, IQuoteSlip, IWCRatesData, IWCTemplate, OPTIONS_EMPLOYEETDESCRIPTION, OPTIONS_EMPLOYEETYPES, WCRatesData, WCTemplate } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteWcTemplateService } from 'src/app/features/admin/quote/quoteWcTemplate.service';
import { IBusinessType } from 'src/app/features/admin/wc-business-type/wc-business-type.model';
import { BusinessTypeService } from 'src/app/features/admin/wc-business-type/wc-business-type.service';
import { WCDescriptionOfEmployeeService } from 'src/app/features/admin/wc-desc-of-employee/wc-desc-of-employee.service';
import { IWCTypeOfEmployee } from 'src/app/features/admin/wc-type-of-employee/wc-type-of-employee.model';
import { WCTypeOfEmployeeService } from 'src/app/features/admin/wc-type-of-employee/wc-type-of-employee.service';
import { IndicativePremiumCalcService } from '../workmen-coverages-tab/indicativepremiumcalc.service';
import { WCRatesService } from 'src/app/features/admin/wc-rates-master/wc-rate-master.service';
import { IWCRates } from 'src/app/features/admin/wc-rates-master/wc-rate-master.model';
import { SalarySlabsService } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.service';
import { ISalarySlabs } from 'src/app/features/admin/wc-salary-slabs/wc-salary-slabs.model';
import { WCRatesFileUploadService } from 'src/app/features/broker/quote-wc-ratesview-dialog/wc-ratesview-service';
import { AllowedQuoteView } from 'src/app/features/quote/pages/quote-view-page/quote-view-page.component';
import { IWCListOfValueMaster, WCAllowedListOfValuesMasters } from 'src/app/features/admin/list-of-value-master/list-of-value-master.model';
import { WCListOfValueMasterService } from 'src/app/features/admin/list-of-value-master/wc-list-of-value-master.service';
import { AllowedOtcTypes, IProductPartnerIcConfigration } from 'src/app/features/admin/product-partner-ic-configuration/product-partner-ic-configuration.model';
import { AllowedGSTPercentage } from 'src/app/features/admin/client/client.model';
import { HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/features/account/account.service';
import { FileUpload } from 'primeng/fileupload';
import { DeleteConfirmationDialogComponent } from '../../delete-confirmation-dialog/delete-confirmation-dialog.component';
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
  selector: 'app-workmen-details-tab',
  templateUrl: './workmen-details-tab.component.html',
  styleUrls: ['./workmen-details-tab.component.scss']
})
export class WorkmenDetailsTabComponent implements OnInit {
  quote: IQuoteSlip;
  wcTemplateModel: any
  wcDetails: WCRatesData[] = []
  deletedWCDetails: WCRatesData[] = []
  medicalExpensesAmountLst: ILovSIDDL[] = []
  medicalExpensesAmountDataList: IWCListOfValueMaster[] = []
  periodsinMonth: any[] = []
  private currentQuote: Subscription;
  allTypeOfEmployees: IWCTypeOfEmployee[] = []
  typesofEmployees: ILov[] = [];
  descriptionEmployees: ILov[] = [];
  optionAttachmentTypes: any[] = [];
  tableType: any[] = [];
  isNamed: boolean = true;
  natureOfWorks: ILov[] = []
  uploadHttpHeaders: HttpHeaders;
  selectedTableType: string = "";
  selectedAttachment: string = "";
  selectedAttachmentType: string = "";
  attachemntTypeOther: string = "";
  savedBasicDetailsAttachment: any[] = [];
  isAttachmentUpload: boolean = false;
  wcRatesMaster: IWCRates[]
  salarySlaRates: ISalarySlabs[]
  selectedViewType: AllowedQuoteView
  uploadbasicDetailsAttachmentUrl: string;
  selectedView = "table"
  private currentSelectedOption: Subscription;
  private currentSelectedOptions: Subscription;
  optionsViewTypes = [
    { label: 'Flip', code: AllowedQuoteView.FLIP, icon: 'pi pi-list' },
    { label: 'Table', code: AllowedQuoteView.TABLE, icon: 'pi pi-table' },
  ];
  //selectedBussiness: ILov
  //natureOfWorksToSearch:ILov[]
  constructor(private salarySlabsService: SalarySlabsService, private quoteWcTemplateService: QuoteWcTemplateService, private quoteService: QuoteService, private businessTypeService: BusinessTypeService, private messageService: MessageService,
    private wcRatesService: WCRatesService, private dialogService: DialogService, private wcfileUploadService: WCRatesFileUploadService, private wclistofmasterservice: WCListOfValueMasterService, private indicativePremiumCalcService: IndicativePremiumCalcService, private wcTypeOfEmployeeService: WCTypeOfEmployeeService, private wcDescriptionOfEmployeeService: WCDescriptionOfEmployeeService, private accountService: AccountService) {
    this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
    this.tableType = ['Named', 'Unnamed'];
    this.optionAttachmentTypes = [
      { label: 'Expiring Policy Copy', value: 'Expiring Policy Copy' },
      { label: 'Proposal Form', value: 'Proposal Form' },
      { label: 'Others', value: 'Others' },
    ];
    this.periodsinMonth.push({ label: "1", value: 1 },
      { label: "2", value: 2 }, { label: "3", value: 3 },
      { label: "4", value: 4 }, { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "7", value: 7 },
      { label: "8", value: 8 },
      { label: "9", value: 9 },
      { label: "10", value: 10 },
      { label: "11", value: 11 },
      { label: "12", value: 12 })

    this.currentQuote = this.quoteService.currentQuote$.subscribe({
      next: (quote) => {
        this.quote = quote
      }
    })

    this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
      next: (template) => {
        this.wcTemplateModel = template
        this.savedBasicDetailsAttachment = this.wcTemplateModel.basicDetailsAttchments
        if (this.wcTemplateModel.wcDetails.length == 0 && this.quote.wcRatesDataId) {
          this.selectedTableType = this.wcTemplateModel.tableType;
          this.isNamed = this.selectedTableType !== 'Unnamed';
          if(this.wcTemplateModel.wcDetails.length == 0) this.wcTemplateModel.wcDetails = this.quote.wcRatesDataId["wcRatesData"]
          this.wcDetails = this.wcTemplateModel.wcDetails
          console.log(this.wcTemplateModel.wcDetails)
        }
        else {
          this.selectedTableType = this.wcTemplateModel.tableType;
          this.isNamed = this.selectedTableType !== 'Unnamed';
          this.wcDetails = this.wcTemplateModel.wcDetails
        }
        console.log(this.wcDetails)
        this.loadCoverageMedicalExpenses();
      }
    })
  }

  errorHandler(e, uploader: FileUpload) {
    uploader.remove(e, 0)
  }

  ngOnInit(): void {
    this.getWcRatesMaster();
    let lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 20,
      sortField: null,
      sortOrder: 1,
      filters: {
        "productId": this.quote.productId["_id"]
      },
      globalFilter: null,
      multiSortMeta: null
    }
    this.loadNatureOfWorks(lazyLoadEvent);
    this.loadTypesOfEmployees(lazyLoadEvent);
    this.loadDescriptionOfEmployees(lazyLoadEvent);
    this.getAllTypesOfEmployeesByProductId(lazyLoadEvent);
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.uploadbasicDetailsAttachmentUrl = this.quoteWcTemplateService.BasicDetailsWCAttachmentsUploadUrl(this.wcTemplateModel?._id, this.selectedAttachment);
  }

  onOtherAttachmentInputFocusOut() {
    this.uploadbasicDetailsAttachmentUrl = this.quoteWcTemplateService.BasicDetailsWCAttachmentsUploadUrl(this.wcTemplateModel?._id, this.attachemntTypeOther);
  }


  onTableTypeChange(event: any) {
    if (this.wcDetails.length > 0) {
      const ref = this.dialogService.open(DeleteConfirmationDialogComponent, {
        header: 'You are changing the Table Type',
        width: '740px',
        styleClass: "flatPopup",
      });
      ref.onClose.subscribe((result) => {
        if (result?.confirmed) {
          // Clear wcDetails if the user confirmed
          this.wcDetails = [];
          console.log('Array has been cleared');
          console.log('Selected attachment type:', this.selectedTableType);
          this.isNamed = this.selectedTableType !== 'Unnamed';
        } else {
          this.selectedTableType = this.selectedTableType === 'Named' ? 'Unnamed' : 'Named';
        }
      });
    } else {
      console.log('Selected attachment type:', this.selectedTableType);
      this.isNamed = this.selectedTableType !== 'Unnamed';
    }
  }


  onAttachmentTypeChange(event: any) {
    console.log('Selected attachment type:', this.selectedAttachment);
    // const result = this.searchItemInArray(this.selectedAttachment);
    // this.selectedAttachmentType = result
    this.uploadbasicDetailsAttachmentUrl = this.quoteWcTemplateService.BasicDetailsWCAttachmentsUploadUrl(this.wcTemplateModel?._id, this.selectedAttachment);
  }

  searchItemInArray(searchTerm: string) {
    for (let parentItem of this.optionAttachmentTypes) {
      for (let item of parentItem.items) {
        if (item.label === searchTerm || item.value === searchTerm) {
          return parentItem.label;
        }
      }
    }
    return null;
  }

  checkIfFileUploadVisible(): boolean {
    if (this.selectedAttachment != undefined && this.selectedAttachment != null && this.selectedAttachment != '') {
      if (this.selectedAttachment == 'Others') {
        if (this.attachemntTypeOther != '') {
          return true;
        }
        else {
          return false;

        }
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  downloadBasicDetailsAttachmentsDetails(fileId: string) {
    this.quoteWcTemplateService.BasicDetailsWCAttachmentsDownload(this.wcTemplateModel._id, fileId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Basic Details';

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

  downloadBasicDetailsAttachmentsDetailsfile(fileId: string) {
    this.quoteWcTemplateService.BasicDetailsWCAttachmentsDownload(this.wcTemplateModel._id, fileId).subscribe({
      next: (response: any) => {
        console.log(response)
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Basic Details';
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

  deleteBasicDetailsAttachmentsDetails(fileId: string) {
    this.quoteWcTemplateService.BasicDetailsWCAttachmentsDelete(this.wcTemplateModel._id, fileId).subscribe({
      next: (response : any) => {
        this.savedBasicDetailsAttachment = response.data.entity['basicDetailsAttchments']
      },
      error: e => {
        console.log(e);
      }
    });
  }

  onUploadBasicDetailsAttachmentUpload() {
    this.quoteService.get(this.quote._id).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        this.savedBasicDetailsAttachment = dto.data.entity?.wcTemplateDataId['basicDetailsAttchments']
        this.isAttachmentUpload = true
        this.save()
        //this.quoteService.setQuote(dto.data.entity)
      },
      error: e => {
        console.log(e);
      }
    });
  }

  createRecord() {
    if (this.selectedTableType == 'Unnamed') {
      if (this.wcDetails.length < 10) {
        let datawc = new WCRatesData();
        this.wcDetails.push(datawc);
      }
      else {
        this.messageService.add({
          severity: "error",
          summary: "Fail",
          detail: "Cannot Add more than 10 records",
          life: 3000
        });
      }
    } else {
      let datawc = new WCRatesData();
      this.wcDetails.push(datawc);
    }
  }

  flipCard(model, event) {
    if (!(event.target instanceof HTMLInputElement && this.hasParentWithClass(event.target, 'p-element'))) {
      model.isFlipped = !model.isFlipped;
    }

  }

  changeView($event) {
    console.log($event)
    this.selectedView = $event
  }

  hasParentWithClass(element: EventTarget | null, className: string): boolean {
    while (element !== null && !(element instanceof HTMLElement)) {
      element = (element as Node).parentNode!;
      if ((element as HTMLElement).classList.contains(className)) {
        return true;
      }
    }
    return false;
  }

  getWcRatesMaster() {
    this.wcRatesService.getRatesMastersByProductId(this.quote?.productId["_id"]).subscribe({
      next: records => {
        this.wcRatesMaster = records.data.entities;
        this.getSalarySlabs()
      },
      error: e => {
        console.log(e);
      }
    });
  }
  deleteRecord(wcrates) {
    this.wcDetails = this.wcDetails.filter(obj => { return obj !== wcrates });
    this.deletedWCDetails = [];
    this.deletedWCDetails = this.wcDetails;
    this.setAmount()
  }


  getSalarySlabs() {
    this.salarySlabsService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: records => {
        this.salarySlaRates = records.data.entities;
        if (this.wcTemplateModel.wcDetails.length > 0) {
          this.recalPremium()
          this.save();
        }
      },
      error: e => {
        console.log(e);
      }
    });
  }

  rotateBack() {
    var rotatingDiv = document.getElementById('rotatingDiv');
    rotatingDiv.style.transform = 'rotate(0deg)';
  }

  recalPremium() {
    //allmedicalBenifitsYesNo
    // let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
    // this.wcTemplateModel.indicativePremium = wcDetails.reduce((sum, current) => sum + current.netPremium, 0);
    // this.wcTemplateModel.indicativePremium = this.wcTemplateModel.indicativePremium + this.wcTemplateModel.addonCoversAmount;
    // this.wcTemplateModel.targetPremium = this.wcTemplateModel.indicativePremium;
    // let targetpr = +this.wcTemplateModel.indicativePremium * ((100 - +this.wcTemplateModel.discountbasedonPremium) / 100)
    // this.wcTemplateModel.targetPremium = targetpr;
    // this.wcTemplateModel.adjustedPremium = this.wcTemplateModel.indicativePremium * 0.0950796
    // this.wcTemplateModel.indicativePremium = this.wcTemplateModel.adjustedPremium
    let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
    this.wcTemplateModel.indicativePremium = wcDetails.reduce((sum, current) => sum + current.netPremium, 0);
    this.wcTemplateModel.adjustedPremium = this.wcTemplateModel.indicativePremium * 0.0950796
    this.wcTemplateModel.indicativePremium = this.wcTemplateModel.adjustedPremium + this.wcTemplateModel.addonCoversAmount;
    this.wcTemplateModel.targetPremium = this.wcTemplateModel.indicativePremium;
    let targetpr = +this.wcTemplateModel.indicativePremium * ((100 - +this.wcTemplateModel.discountbasedonPremium) / 100)
    this.wcTemplateModel.targetPremium = targetpr;
  }

  onNatureOfWorkChange(item: WCRatesData, value) {
    let index_N = this.wcDetails.indexOf(item);
    //Get name from list
    //this.selectedBussiness=value
    let businessTypeName = this.natureOfWorks.find(x => x.value == item.businessTypeId).label;
    this.wcDetails[index_N].natureOfWork = businessTypeName;
  }

  setEmployeeSalary(item: WCRatesData, value) {
    let index_N = this.wcDetails.indexOf(item);
    this.wcDetails[index_N].salaryPerMonth = value;
  }



  loadNatureOfWorks(event: LazyLoadEvent) {
    this.businessTypeService.getManyAsLovsWC(event).subscribe({
      next: records => {
        this.natureOfWorks = records.data.entities.map(entity => ({ label: entity.businessType, value: entity._id }));
        //console.log(this.wcDetails)
      },
      error: e => {
        console.log(e);
      }
    });
  }

  //   searchOptionsnatureOfWorks(event) {

  //     event.filters = {
  //         // @ts-ignore
  //         businessType: [
  //             {
  //                 value: event.query,
  //                 matchMode: "contains",
  //                 operator: "and"
  //             }
  //         ]
  //     };
  //     event.sortField = 'businessType';
  //     event.sortOrder = -1;

  //     this.businessTypeService.getMany(event).subscribe({
  //         next: data => {
  //             this.natureOfWorks = data.data.entities.map(entity => {


  //                 //return { label: `${city.name} - ${pincode.name} - ${entity.locationName}`, value: entity._id }
  //                 return { label: entity.businessType, value: entity._id }

  //             });
  //         },
  //         error: e => { }
  //     });
  // }

  getTotalSalary() {
    let totalSalary = this.wcDetails.reduce((partialSum, a) => partialSum + +a.salaryPerMonth, 0);
    return totalSalary;
  }

  getTotalEmployee() {
    let totalEmployee = this.wcDetails.reduce((partialSum, a) => partialSum + +a.noOfEmployees, 0);
    return totalEmployee
  }


  onTypeOfEmployeeChange(item: WCRatesData) {
    let index_N = this.wcDetails.indexOf(item);
    //Get name from list
    let typeName = this.typesofEmployees.find(x => x.value == item.typeOfEmployeeId).label;
    this.wcDetails[index_N].typeOfEmployees = typeName;
  }

  loadTypesOfEmployees(event: LazyLoadEvent) {
    this.wcTypeOfEmployeeService.getMany(event).subscribe({
      next: records => {
        this.typesofEmployees = records.data.entities.map(entity => ({ label: entity.typeOfEmployee, value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }


  getAllTypesOfEmployeesByProductId(event: LazyLoadEvent) {
    this.wcTypeOfEmployeeService.getMany(event).subscribe({
      next: records => {
        this.allTypeOfEmployees = records.data.entities;
      },
      error: e => {
        console.log(e);
      }
    });
  }


  onDescOfEmployeeChange(item: WCRatesData) {
    let index_N = this.wcDetails.indexOf(item);
    //Get name from list
    let descriptionText = this.descriptionEmployees.find(x => x.value == item.descOfEmployeeId).label;
    this.wcDetails[index_N].descriptionOfEmployees = descriptionText;
  }


  loadDescriptionOfEmployees(event: LazyLoadEvent) {
    this.wcDescriptionOfEmployeeService.getMany(event).subscribe({
      next: records => {
        this.descriptionEmployees = records.data.entities.map(entity => ({ label: entity.description, value: entity._id }));
      },
      error: e => {
        console.log(e);
      }
    });
  }


  removeLastComma(inputString: string): string {
    if (inputString.endsWith(',')) {
      return inputString.slice(0, -1);
    }
    return inputString;
  }

  loadCoverageMedicalExpenses() {
    this.wclistofmasterservice.current(WCAllowedListOfValuesMasters.WC_COVERAGE_FOR_MEDICAL_EXPENSES).subscribe({
      next: records => {
        if (records.data.entities.length > 0) {
          records.data.entities = records.data.entities.sort((a, b) => (+a.lovKey < +b.lovKey ? -1 : 1));
        }
        this.medicalExpensesAmountLst = records.data.entities.map(entity => ({ label: entity.lovKey.toString(), value: entity._id, siAmount: Intl.NumberFormat('en-IN').format(+entity.lovKey).toString() }));
        this.medicalExpensesAmountDataList = records.data.entities;
      },
      error: e => {
        console.log(e);
      }
    });
  }


  setAmount() {
    if (this.wcTemplateModel &&
      this.wcTemplateModel.medicalBenifitsAmountId !== null &&
      this.wcTemplateModel.medicalBenifitsAmountId !== undefined &&
      this.wcTemplateModel.medicalBenifitsAmountId !== "") {
      this.wcTemplateModel.medicalBenifitsAmount = +this.medicalExpensesAmountLst.filter(x => x.value == this.wcTemplateModel.medicalBenifitsAmountId)[0].label;
      if (this.wcTemplateModel.medicalBenifitsAns != "No") {
        let totalSumOfEmployee = this.wcDetails.reduce((sum, current) => sum + +current.noOfEmployees, 0);
        let rate = this.medicalExpensesAmountDataList.filter(x => x._id == this.wcTemplateModel.medicalBenifitsAmountId)[0].lovValue
        this.wcTemplateModel.addonCoversAmount = 0
        this.wcTemplateModel.addonCoversAmount = +totalSumOfEmployee * +rate * 0.086436
        //this.recalPremium()
      }
    }
  }

  save() {

    let allFieldsSatisfyCondition = true;

    if (this.isNamed) {
      for (const item of this.wcDetails) {
        if (!this.validationsConditions(item.name)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Name is required, Please check your data", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else if (!this.validationsConditions(item.age)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Age is required and should be greater than 0, Please check your data", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else if (!this.validationsConditions(item.natureOfWork)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Type of Industry is required, Please check your data", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else if (!this.validationsConditions(item.typeOfEmployeeId)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Occupation of Employee is required, Please check your data", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else if (!this.validationsConditions(item.salaryPerMonth)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Earnings is required, please enter Salary", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else {
          let maxSalary = this.allTypeOfEmployees.find(x => x.typeOfEmployee == item.typeOfEmployees.trim()).maxSalary;
          if (item.salaryPerMonth > maxSalary) {
            this.messageService.add({
              severity: "error", summary: "Missing Information",
              detail: "Earnings per employee exceeds the maximum allowed amount: " + maxSalary + " for " + item.typeOfEmployees + " , Please check your data", life: 3000
            });
            allFieldsSatisfyCondition = false;
            break;
          }
        }
      }
    } else {
      for (const item of this.wcDetails) {
        if (!this.validationsConditions(item.businessTypeId)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Type of Industry is required, Please check your data", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else if (!this.validationsConditions(item.typeOfEmployees)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Occupation of Employee is required, Please check your data", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else if (!this.validationsConditions(item.noOfEmployees)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Total number of employees is required and should be greater than 0, Please check your data", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else if (!this.validationsConditions(item.salaryPerMonth)) {
          this.messageService.add({
            severity: "error", summary: "Missing Information",
            detail: "Earnings is required, please enter earnings", life: 3000
          });
          allFieldsSatisfyCondition = false;
          break;
        }
        else {
          let maxSalary = this.allTypeOfEmployees.find(x => x.typeOfEmployee == item.typeOfEmployees.trim()).maxSalary;
          let MaxNoOfEmployee = this.allTypeOfEmployees.find(x => x.typeOfEmployee == item.typeOfEmployees.trim()).maxNoOfEmployee;
          if (item.salaryPerMonth > maxSalary) {
            this.messageService.add({
              severity: "error", summary: "Missing Information",
              detail: "Earnings per employee exceeds the maximum allowed amount: " + maxSalary + " for " + item.typeOfEmployees + " , Please check your data", life: 3000
            });
            allFieldsSatisfyCondition = false;
            break;
          }
          if (item.noOfEmployees > MaxNoOfEmployee) {
            this.messageService.add({
              severity: "error", summary: "Missing Information",
              detail: "Total number of employees exceeds the maximum allowed no of employees: " + MaxNoOfEmployee + " for " + item.typeOfEmployees + " , Please check your data", life: 3000
            });
            allFieldsSatisfyCondition = false;
            break;
          }
        }
      }
    }


    if (allFieldsSatisfyCondition) {


      this.setAmount();
      this.wcTemplateModel.wcDetails = this.wcDetails;
      let wcDetails = this.indicativePremiumCalcService.CalculateWCPremium(this.wcRatesMaster, this.salarySlaRates, this.wcTemplateModel.wcDetails);
      this.recalPremium();
      this.wcTemplateModel.underWriteraddonCoversAmount = this.wcTemplateModel.addonCoversAmount;
      this.wcTemplateModel.underWriterdiscountbasedonPremium = this.wcTemplateModel.discountbasedonPremium;
      this.wcTemplateModel.underWriterindicativePremium = this.wcTemplateModel.indicativePremium;
      this.wcTemplateModel.underWritertargetPremium = this.wcTemplateModel.targetPremium;
      this.wcTemplateModel.underWritertotalPremiumAmt = this.wcTemplateModel.totalPremiumAmt;

      this.wcTemplateModel.underWritermedicalBenifitsAmount = this.wcTemplateModel.medicalBenifitsAmount;
      this.wcTemplateModel.underWritermedicalBenifitsAmountId = this.wcTemplateModel.medicalBenifitsAmountId;
      this.wcTemplateModel.underWritermedicalBenifitsOption = this.wcTemplateModel.medicalBenifitsOption;
      this.wcTemplateModel.underWriterisActual = this.wcTemplateModel.isActual;

      const updatePayload = this.wcTemplateModel;
      updatePayload.wcDetails = wcDetails

      const productPartnerIcConfigurations = this.quote.productPartnerIcConfigurations;
      const discountbasedonPremium = +this.wcTemplateModel.discountbasedonPremium;
      const totalEmployee = this.wcDetails.reduce((partialSum, a) => partialSum + +a.noOfEmployees, 0);
      const isMEActual = this.wcTemplateModel.isActual;

      const configurationOtcType = productPartnerIcConfigurations[0].productPartnerIcConfigurationId?.otcType;

      const isConfigurationOfTypeBoth = configurationOtcType.includes(AllowedOtcTypes.BOTH)

      if (isConfigurationOfTypeBoth) {
        if (productPartnerIcConfigurations[0].productPartnerIcConfigurationId.wcConfigurationDiscount < discountbasedonPremium || (totalEmployee >= 1000) || isMEActual) {

          let breachedValue = "";
          this.quote.otcType = AllowedOtcTypes.NONOTC;
          this.quote.isOtc = false;
          if (productPartnerIcConfigurations[0].productPartnerIcConfigurationId.wcConfigurationDiscount < discountbasedonPremium) {
            breachedValue = `Discount is more than  ${productPartnerIcConfigurations[0].productPartnerIcConfigurationId.wcConfigurationDiscount},`
          }
          if (isMEActual) {
            breachedValue += `Actual Referral Medical Extension,`
          }
          if (totalEmployee >= 1000) {
            breachedValue += totalEmployee == 1000 ? `Total number of employees: 1000` : `Total number of employees are more than 1000`
          }

          if (breachedValue != '') {
            breachedValue = this.removeLastComma(breachedValue)
          }

          this.quote.nonOtcBreachedValue = breachedValue;
        }
        else {
          this.quote.nonOtcBreachedValue = null;
          this.quote.otcType = AllowedOtcTypes.OTC;
          this.quote.isOtc = false;
        }
      }


      //this.quote.quoteState=AllowedQuoteStates.PENDING_REQUISTION_FOR_QUOTE
      let totalIndictiveQuoteAmtWithGst = Number(this.wcTemplateModel.totalPremiumAmt + this.wcTemplateModel.totalPremiumAmt * 0.18)
      this.quote.totalIndictiveQuoteAmtWithGst = totalIndictiveQuoteAmtWithGst;
      this.wcTemplateModel['tableType'] = this.selectedTableType
      let updatePayloadQuote = this.quote;
      this.quoteService.update(this.quote._id, updatePayloadQuote).subscribe({
        next: quote => {
          if (this.isAttachmentUpload) {
            this.wcTemplateModel.basicDetailsAttchments = this.savedBasicDetailsAttachment
          }
          this.isAttachmentUpload = false
          this.quoteWcTemplateService.updateArray(this.wcTemplateModel._id, updatePayload).subscribe({
            next: quote => {
              console.log("WC Updated Successfully");
              //update fileupload
              if (this.quote.wcRatesDataId) {
                const updatePayloadFileUpload = this.quote.wcRatesDataId;
                updatePayloadFileUpload['wcRatesData'] = wcDetails;
                this.wcfileUploadService.updateArray(this.quote.wcRatesDataId['_id'], updatePayloadFileUpload).subscribe({
                  next: rates => {
                    // this.quoteService.refresh(() => {
                    // })
                  },
                  error: error => {
                    console.log(error);
                  }
                });
              }

              // this.quoteService.refresh(() => {
              // })

            },
            error: error => {
              console.log(error);
            }
          });
        },
        error: error => {
          console.log(error);
        }
      });
    }
  }


  validationsConditions(item: string | number): boolean {
    if (typeof item === 'string') {
      // String validation 
      return item.length > 0;
    } else if (typeof item === 'number') {
      // Number validation 
      return !isNaN(item) && item != 0;
    } else {
      return false;
    }
  }

}
