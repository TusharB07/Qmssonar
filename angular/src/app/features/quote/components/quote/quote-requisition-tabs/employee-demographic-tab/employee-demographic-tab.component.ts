import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ILov, IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { BasicDetailsAttachments, EmployeeDemographic, IEmployeeData, IEmployeesDemoSummary, IHypothication, IQuoteEmployeeData, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { ToWords } from 'to-words';
import { AccountService } from 'src/app/features/account/account.service';
import { CurrentTPA, DDLModel, DDLModelStr, NameOfLeadInsurer, TypeOfInsurer } from './employee-demographic-tab-model';
import { AnnualTurnOver } from './employee-demographic-tab-model';
import { GmcMasterService } from 'src/app/features/admin/gmc-master/gmc-master.service';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import { AppService } from 'src/app/app.service';
import { LeadInsurersService } from 'src/app/features/admin/LeadInsurers/leadInsurer.service';
import { ILeadInsurers } from 'src/app/features/admin/LeadInsurers/leadInsurer.model';
import { ThirdPartyAdministratorsService } from 'src/app/features/admin/thirdPartyAdministrators/thirdPartyAdministrators.service';
import { IEmpRates, IRates } from 'src/app/features/admin/emp-ratesTemplates/emprates.model';
import { EmpRatesService } from 'src/app/features/admin/emp-ratesTemplates/emprates.service';
import { MessageService } from 'primeng/api';
import { AnnualTurnoverService } from 'src/app/features/admin/annual-turnover/annual-turnover.service';
import { HttpHeaders } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
const DEFAULT_RECORD_FILTER = {
    first: 0,
    rows: 100,
    sortField: "",
    sortOrder: 1,
    multiSortMeta: [],
    filters: {}
};
@Component({
    selector: 'app-employee-demographic-tab',
    templateUrl: './employee-demographic-tab.component.html',
    styleUrls: ['./employee-demographic-tab.component.scss']
})
export class EmployeeDemographicTabComponent implements OnInit {
    employeeDemographic: EmployeeDemographic = new EmployeeDemographic()
    submitted: boolean = false;
    quote: IQuoteSlip
    moreTpa: string = ""
    turnoverLst: DDLModel[] = [];
    toWords = new ToWords();
    typeOfInsurerList: DDLModelStr[] = [];
    nameOfLeadInsurerList: DDLModelStr[] = [];
    tpaList: DDLModelStr[] = [];
    empDemoraphicDetailsForm: FormGroup;
    bankDetailForm: FormGroup;
    quoteSubmissionDates: any;
    today: string;
    checked: boolean = false;
    enableInput: boolean;
    targetPremiumChecked: any;
    optionsInsurers: ILov[];
    tpaLists: ILov[];
    annualTurnOverList: ILov[];
    showclientDescription: boolean = false;
    showtypeOfCompanyDescription: boolean = false
    showfundRaisingDescription: boolean = false;
    showanualTurnOverDescription: boolean = false;
    quoteGmcOptionsLst: IQuoteGmcTemplate[];
    ratesInfo: any;
    showBox: boolean = true;
    basicDeatilsFileInput: string = ""
    uploadbasicDeatilsAttachmentUrl: string;
    savedbasicDeatilsAttachment: any[] = []
    isAttachmentbasicDeatilsUpload: boolean = false;
    uploadHttpHeaders: HttpHeaders;
    attachmentDetails: any[] = []
    employeeInfo: IEmployeesDemoSummary[] = [];
    calculatedPremium: number = 0
    private currentQuote: Subscription;
    private currentSelectedTemplate: Subscription;
    private currentSelectedOption: Subscription;
    private currentSelectedOptions: Subscription;
    empDatawithGrades: IEmployeeData[] = []
    selectedQuoteTemplate: IQuoteGmcTemplate;
    optionNameForFirstTab: string = ""
    uploadDaycareUrl: string;
    subsidairyAttachment: BasicDetailsAttachments[] = []

    policyDetails = [
        { name: 'Employee Count', inception: 10, asOnDate: 10, change: 0, proposed: 10 },
        { name: 'Dependant Count', inception: 10, asOnDate: 10, change: 0, proposed: 10 },
        { name: 'Total Lives', inception: 20, asOnDate: 20, change: 0, proposed: 20 },
    ];

    claimDetails = [

        { name: 'Outstanding', count: 10, amount: 10 },
        { name: 'Paid', count: 20, amount: 20 },
        { name: 'Incurred', count: 10, amount: 10 },
        { name: 'Closed', count: 10, amount: 10 },
    ];

    premiumAtInception: number;
    premiumAsOnDate: number;
    earnedPremium: number;
    policyRunDate: string;
    policyRunDays: number;
    annualizedClaimAmount: number;
    averageClaimSize: number;
    claimRatioTotalPremium: number;
    claimRatioPremium: number;
    existingInsurer: string;
    existingTPA: string;
    existingBroker: string;
    coInsureDetails: string;
    coInsurePercentage: number;
    templateName: string = "";
    constructor(
        private messageService: MessageService,
        private empRateService: EmpRatesService,
        private quoteService: QuoteService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private qoutegmctemplateserviceService: QoutegmctemplateserviceService,
        private appService: AppService,
        private leadInsurerService: LeadInsurersService, private accountService: AccountService, private annualTurnOver: AnnualTurnoverService, private tpaService: ThirdPartyAdministratorsService
    ) {
        this.uploadHttpHeaders = this.accountService.bearerTokenHeader();
        this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.getLeadInsurer();
        this.getTpas();
        this.getAnnualTurnOver()
        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote) => {
                this.quote = quote
                this.templateName == this.quote?.productId['type'].toLowerCase()

            }
        })

        this.currentSelectedOption = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                const temp = template;
                //this.quoteService.setSelectedOptions(temp)
                this.uploadDaycareUrl = this.qoutegmctemplateserviceService.DayCareUploadUrl(this.selectedQuoteTemplate?._id);
                this.subsidairyAttachment = []
                if (this.selectedQuoteTemplate?.dayCareFilePath != null && this.selectedQuoteTemplate?.dayCareFilePath != ''
                    && this.selectedQuoteTemplate?.dayCareFilePath != null && this.selectedQuoteTemplate?.dayCareFilePath != ''
                ) {
                    this.subsidairyAttachment = []
                    var attachment = new BasicDetailsAttachments();
                    attachment.filePath = this.selectedQuoteTemplate.dayCareFilePath;
                    attachment.fileName = this.selectedQuoteTemplate.dayCareFileName;
                    attachment.id = this.selectedQuoteTemplate._id;
                    attachment.quoteId = this.quote._id;
                    attachment.templateId = this.selectedQuoteTemplate._id;

                    this.subsidairyAttachment.push(attachment);
                }

            }
        })


        this.currentSelectedTemplate = this.quoteService.currentSelectedOptions$.subscribe({
            next: (template) => {
                this.selectedQuoteTemplate = template;
                this.optionNameForFirstTab = this.selectedQuoteTemplate.optionName;
                //this.calculatedPremium = 0
                // this.selectedQuoteTemplate.calculatedPremium = 0
                this.employeeDemographic = this.selectedQuoteTemplate.employeeDemographic;
                const data = this.quote?.employeeDataId["employeeData"];
                this.employeeDemographic.livesCount = data.length ?? 0;
                if (+this.employeeDemographic.employeeHeadCount > 0) {
                }
                else {
                    this.employeeDemographic.employeeHeadCount = data.filter(x => x.relationShip == 'Self').length ?? 0;
                }
                this.employeeDemographic.empCountProposed = data.filter(x => x.relationShip == 'Self').length ?? 0;
                this.employeeDemographic.dependentCountProposed = data.filter(x => x.relationShip != 'Self').length ?? 0;

                if (this.quote.quoteType == 'new') {
                    this.employeeDemographic.employeeHeadCount = data.filter(x => x.relationShip == 'Self').length ?? 0;
                    this.employeeDemographic.empCountInception = data.filter(x => x.relationShip == 'Self').length ?? 0;
                    this.employeeDemographic.dependentCountInception = data.filter(x => x.relationShip != 'Self').length ?? 0;                    //this.saveEmpDemographic()
                }

                const totalLivesDetail = this.selectedQuoteTemplate.gmcBasicDetails.gmcPolicyDetails.find(
                    (detail) => detail.name === 'Total Lives'
                );

                const dependantCountDetail = this.selectedQuoteTemplate.gmcBasicDetails.gmcPolicyDetails.find(
                    (detail) => detail.name === 'Dependant Count'
                );

                dependantCountDetail.inception = this.employeeDemographic.dependentCountInception

                const employeeContDetail = this.selectedQuoteTemplate.gmcBasicDetails.gmcPolicyDetails.find(
                    (detail) => detail.name === 'Employee Count'
                );

                employeeContDetail.inception = this.employeeDemographic.empCountInception

                if (totalLivesDetail) {
                    totalLivesDetail.inception = +this.employeeDemographic.empCountInception + +this.employeeDemographic.dependentCountInception;

                }




                if (this.selectedQuoteTemplate != undefined) {
                    if (this.selectedQuoteTemplate != null) {
                        this.attachmentDetails = []
                        if (this.selectedQuoteTemplate.basicDeatilsQCRAttachments.length > 0) {
                            this.attachmentDetails = this.selectedQuoteTemplate.basicDeatilsQCRAttachments.filter(f => f.attachmentSubType == "RFQ")
                        }
                    }
                }


            }
        })

    }



    //File upload

    ngOnChanges(changes: SimpleChanges): void {
        this.uploadbasicDeatilsAttachmentUrl = this.qoutegmctemplateserviceService.BasicDetailsQCRAttachmentsUploadUrl(this.selectedQuoteTemplate?._id, this.basicDeatilsFileInput, "RFQ");
    }

    onBasicDeatilsFileInputFocusOut() {
        this.uploadbasicDeatilsAttachmentUrl = this.qoutegmctemplateserviceService.BasicDetailsQCRAttachmentsUploadUrl(this.selectedQuoteTemplate?._id, this.basicDeatilsFileInput, "RFQ");
    }

    checkIfListOfBasicDeatilsFileUploadVisible(): boolean {
        if (this.basicDeatilsFileInput != undefined && this.basicDeatilsFileInput != null && this.basicDeatilsFileInput != '') {
            return true;
        }
        else {
            return false;
        }
    }



    onUploadBasicDetailsAttachmentUpload() {

        this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.savedbasicDeatilsAttachment = dto.data.entity?.gmcTemplateDataId['basicDeatilsQCRAttachments']
                this.isAttachmentbasicDeatilsUpload = true
                this.attachmentDetails = this.savedbasicDeatilsAttachment
                this.saveEmpDemographic(false)
            },
            error: e => {
                console.log(e);
            }
        });
    }
    calculateAnualizedClaimAmount() {
        const incurred = this.selectedQuoteTemplate.gmcBasicDetails.gmcClaimDetails.find(claim => claim.name === 'Incurred');
        this.selectedQuoteTemplate.gmcBasicDetails.annualizedClaimAmount = parseFloat(((incurred.amount / this.selectedQuoteTemplate.gmcBasicDetails.policyRunDays) * 365).toFixed(2));
    }

    downloadBasicDetailsDetailsfile(fileId: string) {
        this.qoutegmctemplateserviceService.BasicDetailsQCRAttachmentsDownload(this.selectedQuoteTemplate._id, fileId).subscribe({
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
        this.qoutegmctemplateserviceService.BasicDetailsQCRAttachmentsDelete(this.selectedQuoteTemplate._id, fileId).subscribe({
            next: () => {
                this.quoteService.get(this.quote._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        // console.log(dto.data.entity)
                        this.quoteService.setQuote(dto.data.entity)
                        this.getOptions()
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }



    //file upload end





    calculateEarnedPremium() {
        // Calculate earned premium and round to 2 decimal places
        this.selectedQuoteTemplate.gmcBasicDetails.earnedPremium =
            parseFloat(
                ((this.selectedQuoteTemplate.gmcBasicDetails.premiumAsOnDate * this.selectedQuoteTemplate.gmcBasicDetails.policyRunDays) / 365).toFixed(2)
            );
    }

    calculateEarnedPremiumClaimRatio() {
        // Ensure earned premium is non-zero to avoid division errors
        if (this.selectedQuoteTemplate.gmcBasicDetails.earnedPremium > 0) {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium =
                parseFloat(
                    ((this.selectedQuoteTemplate.gmcBasicDetails.annualizedClaimAmount / this.selectedQuoteTemplate.gmcBasicDetails.earnedPremium) * 100).toFixed(2)
                );
        } else {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium = 0; // Handle edge case
        }
    }

    calculateTotalPremiumClaimRatio() {
        // Ensure premiumAsOnDate is non-zero to avoid division errors
        if (this.selectedQuoteTemplate.gmcBasicDetails.premiumAsOnDate > 0) {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium =
                parseFloat(
                    (this.selectedQuoteTemplate.gmcBasicDetails.annualizedClaimAmount / this.selectedQuoteTemplate.gmcBasicDetails.premiumAsOnDate).toFixed(2)
                );
        } else {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium = 0; // Handle edge case
        }
    }


    setChange(details) {
        details.proposed = +details.asOnDate
        details.change = ((+details.asOnDate - +details.inception) / +details.inception) * 100

        const totalLivesDetail = this.selectedQuoteTemplate.gmcBasicDetails.gmcPolicyDetails.find(
            (detail) => detail.name === 'Total Lives'
        );

        const dependantCountDetail = this.selectedQuoteTemplate.gmcBasicDetails.gmcPolicyDetails.find(
            (detail) => detail.name === 'Dependant Count'
        );

        const employeeContDetail = this.selectedQuoteTemplate.gmcBasicDetails.gmcPolicyDetails.find(
            (detail) => detail.name === 'Employee Count'
        );

        if (totalLivesDetail) {
            totalLivesDetail.inception = +dependantCountDetail.inception + +employeeContDetail.inception;
            totalLivesDetail.asOnDate = +dependantCountDetail.asOnDate + +employeeContDetail.asOnDate;
            totalLivesDetail.proposed = +dependantCountDetail.proposed + +employeeContDetail.proposed
            totalLivesDetail.change = ((totalLivesDetail.asOnDate - totalLivesDetail.inception) / totalLivesDetail.inception) * 100
        }
    }

    loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
        this.quoteService.setSelectedOptions(quoteOption)
    }
    ngOnInit(): void {
        this.turnoverLst = AnnualTurnOver;
        this.typeOfInsurerList = TypeOfInsurer;
        this.nameOfLeadInsurerList = NameOfLeadInsurer
        this.tpaList = CurrentTPA
        this.getLeadInsurer();
        this.getTpas();
        this.getAnnualTurnOver();
        this.uploadDaycareUrl = this.qoutegmctemplateserviceService.DayCareUploadUrl(this.selectedQuoteTemplate?._id);

    }

    ngOnDestroy(): void {
        this.currentQuote.unsubscribe();
    }
    saveEmpDemographicCount() {

    }
    onUploadSDayCareFile() {
        this.quoteService.get(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quoteService.setQuote(dto.data.entity)
                this.getOptions()

            },
            error: e => {
                console.log(e);
            }
        });
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

    errorHandler(e, uploader: FileUpload) {
        uploader.remove(e, 0)
    }

    deleteDayCareReport() {
        this.qoutegmctemplateserviceService.DayCareDelete(this.selectedQuoteTemplate._id).subscribe({
            next: () => {
                this.quoteService.get(this.quote._id).subscribe({
                    next: (dto: IOneResponseDto<IQuoteSlip>) => {
                        // console.log(dto.data.entity)
                        this.quoteService.setQuote(dto.data.entity)
                        this.getOptions()
                    },
                    error: e => {
                        console.log(e);
                    }
                });
            }
        })
    }

    downloadSubsidiaryauditedfinancialReport() {
        this.qoutegmctemplateserviceService.DayCareDownload(this.selectedQuoteTemplate._id).subscribe({
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

    downloadFileSubsidiaryauditedfinancialReport() {
        this.qoutegmctemplateserviceService.DayCareDownload(this.selectedQuoteTemplate._id).subscribe({
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


    getEmpCountVariant() {
        let neum = +this.employeeDemographic.empCountInception - +this.employeeDemographic.empCountProposed
        let denom = +this.employeeDemographic.empCountInception + +this.employeeDemographic.empCountProposed
        let per = (neum / (denom / 2)) * 100
        return Number.isNaN(per) ? 0 : per.toFixed(2);
    }

    getEmployeesDemographySummary() {
        let payload = {};
        payload['quoteId'] = this.quote._id;
        payload['fileType'] = this.selectedQuoteTemplate.fileUploadType;
        this.quoteService.viewEmployeesSummary(payload).subscribe({
            next: summary => {
                if (summary.status == "success") {
                    this.employeeInfo = summary.data.entities;
                    this.calculatePremium();
                } else {
                    this.messageService.add({
                        severity: 'fail',
                        summary: "Failed to Show",
                        detail: `${summary.status}`, //"error" TODO: Check
                    })
                }
            }
        })
    }
    calculateIndividualPremiumGraded(CoverageType: string, siRates: any, empWithGrades: any) {
        let substrCoverageTypeEmployee = 'E'
        let substrCoverageTypeSpouse = 'S'
        let substrCoverageTypeChild = 'C'
        let substrCoverageTypeSibling = 'L'
        let substrCoverageTypeParent = 'P'

        let ageBandWiseRate = []
        if (CoverageType.includes(substrCoverageTypeEmployee)) {
            let allEmp = empWithGrades.filter(x => x.relationShip == 'Self');
            allEmp.forEach(elementE => {
                const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
                if (ratesASPerSI != undefined) {
                    const siRates = ratesASPerSI[0].siRates;
                    ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
                        x.relation == 'Self'))
                }
            });

        }

        if (CoverageType.includes(substrCoverageTypeSpouse)) {
            let allEmp = empWithGrades.filter(x => x.relationShip == 'Spouse');
            allEmp.forEach(elementE => {
                const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
                if (ratesASPerSI != undefined) {
                    const siRates = ratesASPerSI[0].siRates;
                    ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
                        x.relation == 'Spouse'))
                }
            });
        }

        if (CoverageType.includes(substrCoverageTypeChild)) {
            let allEmp = empWithGrades.filter(x => x.relationShip == 'Child');
            allEmp.forEach(elementE => {
                const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
                if (ratesASPerSI != undefined) {
                    const siRates = ratesASPerSI[0].siRates;
                    ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
                        x.relation == 'Child'))
                }
            });
        }

        if (CoverageType.includes(substrCoverageTypeSibling)) {
            let allEmp = empWithGrades.filter(x => x.relationShip == 'Siblings');
            allEmp.forEach(elementE => {
                const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
                if (ratesASPerSI != undefined) {
                    const siRates = ratesASPerSI[0].siRates;
                    ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
                        x.relation == 'Siblings'))
                }
            });
        }
        if (CoverageType.includes(substrCoverageTypeParent)) {
            let allEmp = empWithGrades.filter(x => x.relationShip == 'Parent');
            allEmp.forEach(elementE => {
                const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == elementE.SI);
                if (ratesASPerSI != undefined) {
                    const siRates = ratesASPerSI[0].siRates;
                    ageBandWiseRate.push(...siRates.filter(x => +elementE.age >= +x.ageFrom && +elementE.age <= +x.ageTo &&
                        x.relation == 'Parent'))
                }
            });
        }

        this.calculatedPremium = 0
        console.log(ageBandWiseRate)
        ageBandWiseRate.forEach(elementAge => {
            switch (elementAge.relation) {
                case 'Self': {
                    //statements; 
                    this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

                    break;
                }
                case 'Spouse': {
                    //statements; 
                    this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

                    break;
                }
                case 'Child': {
                    //statements; 
                    this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

                    break;
                }
                case 'Parent': {
                    //statements; 
                    this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

                    break;
                }
                case 'Siblings': {
                    //statements; 
                    this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);

                    break;
                }
                default: {
                    //statements; 
                    break;
                }
            }
        });


    }

    calculateRateWisePremiumGraded(CoverageType: string, siRates: any, empWithGrades: any) {
        let substrCoverageTypeEmployee = 'E'
        let substrCoverageTypeSpouse = 'S'
        let substrCoverageTypeChild = 'C'
        let substrCoverageTypeSibling = 'L'
        let substrCoverageTypeParent = 'P'

        let selfCount = 0;
        let spouseCount = 0;
        let childCount = 0;
        let parentCount = 0;
        let siblingCount = 0;

        if (CoverageType.includes(substrCoverageTypeEmployee)) {
            selfCount = empWithGrades.filter(x => x.relationShip == 'Self').length;
        }
        if (CoverageType.includes(substrCoverageTypeSpouse)) {
            spouseCount = empWithGrades.filter(x => x.relationShip == 'Spouse').length;
        }
        if (CoverageType.includes(substrCoverageTypeChild)) {
            childCount = empWithGrades.filter(x => x.relationShip == 'Child').length;
        }
        if (CoverageType.includes(substrCoverageTypeSibling)) {
            siblingCount = empWithGrades.filter(x => x.relationShip == 'Siblings').length;
        }
        if (CoverageType.includes(substrCoverageTypeParent)) {
            parentCount = empWithGrades.filter(x => x.relationShip == 'Parent').length;
        }


        empWithGrades.forEach(element => {
            let ageBandWiseRate = []
            if (element.relationShip == 'Self') {
                if (CoverageType.includes(substrCoverageTypeEmployee)) {
                    ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
                        x.relation == 'Self'))
                }
            }
            if (element.relationShip == 'Spouse') {
                if (CoverageType.includes(substrCoverageTypeSpouse)) {
                    ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
                        x.relation == 'Spouse'))
                }
            }
            if (element.relationShip == 'Child') {
                if (CoverageType.includes(substrCoverageTypeChild)) {
                    ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
                        x.relation == 'Child'))
                }
            }
            if (element.relationShip == 'Siblings') {
                if (CoverageType.includes(substrCoverageTypeSibling)) {
                    ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
                        x.relation == 'Siblings'))
                }
            }
            if (element.relationShip == 'Parent') {
                if (CoverageType.includes(substrCoverageTypeParent)) {
                    ageBandWiseRate.push(...siRates.filter(x => +element.age >= +x.ageFrom && +element.age <= +x.ageTo &&
                        x.relation == 'Parent'))
                }
            }
            //this.calculatedPremium = 0
            console.log(ageBandWiseRate)
            ageBandWiseRate.forEach(elementAge => {
                switch (elementAge.relation) {
                    case 'Self': {
                        //statements; 
                        if (selfCount != undefined) {
                            this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
                        }
                        break;
                    }
                    case 'Spouse': {
                        //statements; 
                        if (spouseCount != undefined) {
                            this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
                        }
                        break;
                    }
                    case 'Child': {
                        //statements; 
                        if (childCount != undefined) {
                            this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
                        }
                        break;
                    }
                    case 'Parent': {
                        //statements; 
                        if (parentCount != undefined) {
                            this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
                        }
                        break;
                    }
                    case 'Siblings': {
                        //statements; 
                        if (siblingCount != undefined) {
                            this.calculatedPremium = this.calculatedPremium + (+elementAge.premium);
                        }
                        break;
                    }
                    default: {
                        //statements; 
                        break;
                    }
                }
            });
        });

    }

    calculateRateWisePremium(CoverageType: string, siRates: any) {
        this.calculatedPremium = 0
        let substrCoverageTypeEmployee = 'E'
        let substrCoverageTypeSpouse = 'S'
        let substrCoverageTypeChild = 'C'
        let substrCoverageTypeSibling = 'L'
        let substrCoverageTypeParent = 'P'
        this.employeeInfo.forEach(element => {
            let ageBandWiseRate = []
            if (CoverageType.includes(substrCoverageTypeEmployee)) {
                ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Self'))
            }
            if (CoverageType.includes(substrCoverageTypeSpouse)) {
                ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Spouse'))
            }
            if (CoverageType.includes(substrCoverageTypeChild)) {
                ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Child'))
            }
            if (CoverageType.includes(substrCoverageTypeSibling)) {
                ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Siblings'))
            }
            if (CoverageType.includes(substrCoverageTypeParent)) {
                ageBandWiseRate.push(...siRates.filter(x => x.ageband.toString() == element.ageBand.toString() && x.relation == 'Parent'))
            }
            ageBandWiseRate.forEach(elementAge => {
                switch (elementAge.relation) {
                    case 'Self': {
                        //statements; 
                        if (element.selfCount > 0) {
                            this.calculatedPremium = this.calculatedPremium + (element.selfCount * elementAge.premium);
                        }
                        break;
                    }
                    case 'Spouse': {
                        //statements; 
                        if (element.spouseCount > 0) {
                            this.calculatedPremium = this.calculatedPremium + (element.spouseCount * elementAge.premium);
                        }
                        break;
                    }
                    case 'Child': {
                        //statements; 
                        if (element.childCount > 0) {
                            this.calculatedPremium = this.calculatedPremium + (element.childCount * elementAge.premium);
                        }
                        break;
                    }
                    case 'Parent': {
                        //statements; 
                        if (element.parentCount > 0) {
                            let totalParentCount = element.parentCount
                            this.calculatedPremium = this.calculatedPremium + (totalParentCount * elementAge.premium);
                        }
                        break;
                    }
                    case 'Siblings': {
                        //statements; 
                        if (element.siblingsCount > 0) {
                            this.calculatedPremium = this.calculatedPremium + (element.siblingsCount * elementAge.premium);
                        }
                        break;
                    }
                    default: {
                        //statements; 
                        break;
                    }
                }
            });
        });
    }
    calculatePremium() {
        //ratesInfo
        let totalEMpCount = 0
        let totalSpouseCount = 0
        let totalCount = 0
        //this.calculatedPremium = 0
        if (this.selectedQuoteTemplate.coverageTypeName != '') {
            let CoverageType = this.selectedQuoteTemplate.coverageTypeName;
            let substrCoverageTypeEmployee = 'E'
            let substrCoverageTypeSpouse = 'S'
            let substrCoverageTypeChild = 'C'
            let substrCoverageTypeSibling = 'L'
            let substrCoverageTypeParent = 'P'
            if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeEmployee)) {
                const sum = this.employeeInfo.reduce((sum, current) => sum + current.selfCount, 0);
                totalEMpCount = totalEMpCount + sum;
            }
            if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeSpouse)) {
                const sum = this.employeeInfo.reduce((sum, current) => sum + current.spouseCount, 0);
                totalEMpCount = totalEMpCount + sum;
            }
            if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeChild)) {
                const sum = this.employeeInfo.reduce((sum, current) => sum + current.childCount, 0);
                totalEMpCount = totalEMpCount + sum;
            }
            if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeSibling)) {
                const sum = this.employeeInfo.reduce((sum, current) => sum + current.siblingsCount, 0);
                totalEMpCount = totalEMpCount + sum;
            }
            if (this.selectedQuoteTemplate.coverageTypeName.includes(substrCoverageTypeParent)) {
                const sum = this.employeeInfo.reduce((sum, current) => sum + current.parentCount, 0);
                totalEMpCount = totalEMpCount + sum;
            }
            if (this.selectedQuoteTemplate.planType == "Floater") {
                if (this.selectedQuoteTemplate.siType == "Flat") {
                    this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
                        next: (dto: IManyResponseDto<any>) => {
                            this.ratesInfo = dto.data.entities
                            if (this.ratesInfo != undefined || this.ratesInfo != null) {
                                const SIAmount = this.selectedQuoteTemplate.siFlat
                                const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == SIAmount);
                                if (ratesASPerSI != undefined) {
                                    //Calculate Premium
                                    const siRates = ratesASPerSI[0].siRates;
                                    this.calculateRateWisePremium(CoverageType, siRates);
                                }
                            }
                            else {
                                console.log("------getting 0 here ------")
                                //this.calculatedPremium = 0
                            }
                            this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
                            const updatePayload = this.selectedQuoteTemplate;
                            this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                                next: partner => {
                                    console.log("ttest");
                                },
                                error: error => {
                                    console.log(error);
                                }
                            });
                            // console.log(data);
                        },
                        error: e => {
                            console.log(e)
                        }
                    });
                }
                else {
                    this.quoteService.empGradewiseDataByQuoteId(this.quote._id).subscribe({
                        next: (dto: IOneResponseDto<any>) => {
                            this.empDatawithGrades = dto.data.entity.employeeData;
                            this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
                                next: (dto: IManyResponseDto<any>) => {
                                    this.ratesInfo = dto.data.entities
                                    if (this.ratesInfo != undefined || this.ratesInfo != null) {
                                        this.selectedQuoteTemplate.gmcGradedSILst.forEach(elementGraded => {
                                            let empWithGrades = this.empDatawithGrades.filter(x => x.designation == elementGraded.grade)
                                            const SIAmount = +elementGraded.siAmount.label
                                            const ratesASPerSI = this.ratesInfo.SIRatesData.filter(x => x.sumInsured == SIAmount);
                                            if (ratesASPerSI != undefined) {
                                                const siRates = ratesASPerSI[0].siRates;
                                                //this.calculatedPremium = 0
                                                this.calculateRateWisePremiumGraded(CoverageType, siRates, empWithGrades);
                                            }
                                        });
                                    }
                                    else {
                                        this.calculatedPremium = 0
                                    }
                                    this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
                                    const updatePayload = this.selectedQuoteTemplate;
                                    this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                                        next: partner => {
                                            //console.log("ttest");
                                        },
                                        error: error => {
                                            console.log(error);
                                        }
                                    });
                                },
                                error: e => {
                                    console.log(e)
                                }
                            });
                            // console.log(data);
                        },
                        error: e => {
                            console.log(e)
                        }
                    });

                }
            }
            else {
                //Individual
                this.quoteService.empGradewiseDataByQuoteId(this.quote._id).subscribe({
                    next: (dto: IOneResponseDto<any>) => {
                        this.empDatawithGrades = dto.data.entity.employeeData;
                        this.empRateService.getAllRateTemplate(totalEMpCount).subscribe({
                            next: (dto: IManyResponseDto<any>) => {
                                this.ratesInfo = dto.data.entities
                                if (this.ratesInfo != undefined || this.ratesInfo != null) {
                                    this.calculateIndividualPremiumGraded(CoverageType, this.ratesInfo, this.empDatawithGrades);
                                }
                                else {
                                    this.calculatedPremium = 0
                                }
                                this.selectedQuoteTemplate.calculatedPremium = this.calculatedPremium;
                                const updatePayload = this.selectedQuoteTemplate;
                                this.qoutegmctemplateserviceService.updateArray(this.selectedQuoteTemplate._id, updatePayload).subscribe({
                                    next: partner => {
                                        //console.log("ttest");
                                    },
                                    error: error => {
                                        console.log(error);
                                    }
                                });
                            },
                            error: e => {
                                console.log(e)
                            }
                        });
                        // console.log(data);
                    },
                    error: e => {
                        console.log(e)
                    }
                });
            }


            const updatePayload = this.selectedQuoteTemplate

            this.qoutegmctemplateserviceService.updateArray(updatePayload._id, updatePayload).subscribe({
                next: partner => {
                    console.log("ttest");
                },
                error: error => {
                    console.log(error);
                }
            });


        }

    }
    onKeyUp(rowIndex: number) {
        const claimDetails = this.selectedQuoteTemplate.gmcBasicDetails.gmcClaimDetails;

        // Get references to the Outstanding, Paid, and Incurred rows
        const outstanding = claimDetails.find(claim => claim.name === 'Outstanding');
        const paid = claimDetails.find(claim => claim.name === 'Paid');
        const incurred = claimDetails.find(claim => claim.name === 'Incurred');

        if (outstanding && paid && incurred) {
            // Update Incurred values
            incurred.count = (+outstanding.count || 0) + (+paid.count || 0);
            incurred.amount = (+outstanding.amount || 0) + (+paid.amount || 0);
        }
        this.selectedQuoteTemplate.gmcBasicDetails.averageClaimSize = incurred.amount / incurred.count
        // Calculate Annualized Claim Amount
        this.selectedQuoteTemplate.gmcBasicDetails.annualizedClaimAmount =
            parseFloat(
                (((incurred.amount / this.selectedQuoteTemplate.gmcBasicDetails.policyRunDays) * 365) || 0).toFixed(2)
            );

        // Calculate Claim Ratio (Earned Premium)
        if (this.selectedQuoteTemplate.gmcBasicDetails.earnedPremium > 0) {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium =
                parseFloat(
                    ((this.selectedQuoteTemplate.gmcBasicDetails.annualizedClaimAmount / this.selectedQuoteTemplate.gmcBasicDetails.earnedPremium) * 100).toFixed(2)
                );
        } else {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium = 0; // Handle division by zero
        }

        // Calculate Claim Ratio (Total Premium)
        if (this.selectedQuoteTemplate.gmcBasicDetails.premiumAsOnDate > 0) {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioTotalPremium =
                parseFloat(
                    ((this.selectedQuoteTemplate.gmcBasicDetails.annualizedClaimAmount / this.selectedQuoteTemplate.gmcBasicDetails.premiumAsOnDate) * 100).toFixed(2)
                );
        } else {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioTotalPremium = 0; // Handle division by zero
        }


    }

    calcualteClaimratio() {
        if (this.selectedQuoteTemplate.gmcBasicDetails.earnedPremium > 0) {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium =
                parseFloat(
                    ((this.selectedQuoteTemplate.gmcBasicDetails.annualizedClaimAmount / this.selectedQuoteTemplate.gmcBasicDetails.earnedPremium) * 100).toFixed(2)
                );
        } else {
            this.selectedQuoteTemplate.gmcBasicDetails.claimRatioPremium = 0; // Default to 0 if division is not possible
        }
    }
    getDependantCountVariant() {
        let neum = +this.employeeDemographic.dependentCountInception - +this.employeeDemographic.dependentCountProposed
        let denom = +this.employeeDemographic.dependentCountInception + +this.employeeDemographic.dependentCountProposed
        let per = (neum / (denom / 2)) * 100
        return Number.isNaN(per) ? 0 : per.toFixed(2);
    }
    saveEmpDemographic(isFromButton: boolean) {
        if (this.isAttachmentbasicDeatilsUpload) {
            this.selectedQuoteTemplate.basicDeatilsQCRAttachments = this.savedbasicDeatilsAttachment
        }
        this.isAttachmentbasicDeatilsUpload = false
        const updatePayload = this.selectedQuoteTemplate

        this.qoutegmctemplateserviceService.updateArray(updatePayload._id, updatePayload).subscribe({
            next: partner => {

                console.log("saved")
            },
            error: error => {
                console.log(error);
            }
        });

        this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
            next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                this.quoteGmcOptionsLst = dto.data.entity;
                this.quoteGmcOptionsLst.forEach(element => {
                    element.employeeDemographic = this.employeeDemographic
                    this.qoutegmctemplateserviceService.updateArray(element._id, element).subscribe({
                        next: quote => {
                            // this.quote = quote.data.entity;
                            console.log(this.quote)
                            //If GMC master Create Template
                            if (isFromButton) {
                                // this.messageService.add({
                                //     severity: "success",
                                //     summary: "Successful",
                                //     detail: `Saved`,
                                //     life: 3000
                                // });
                            }

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

    showBoxDiv() {
        if (this.employeeDemographic.leadSharePercentage == 100) {
            this.showBox = false;
            this.employeeDemographic.coInsurer1 = ""
            this.employeeDemographic.coInsurer1Percentage = 0
            this.employeeDemographic.coInsurer2 = ""
            this.employeeDemographic.coInsurer2Percentage = 0
        }
        else {
            this.showBox = true;
        }
    }
    addTpa() {
        if (this.moreTpa != "") {
            this.employeeDemographic.otherTPA.push(this.moreTpa)
            this.moreTpa = ""
        }
    }

    removeTpa(items) {
        var index = this.employeeDemographic.otherTPA.indexOf(items);
        if (index !== -1) {
            this.employeeDemographic.otherTPA.splice(index, 1);
        }
    }

    submitHypothicationForm() {
        // console.log(this.bankDetailForm)

        let payload = { ...this.bankDetailForm.value };
        // payload["hypothications"] = this.bankDetailForm.value['hypothications'].map((hypothication: IHypothication) => ({
        //     hypothications: name.hypothication,

        // }))
        // console.log(payload)

        this.quoteService.update(this.quote._id, payload).subscribe({
            next: (dto: IOneResponseDto<any>) => {
                // this.quoteService.setQuote(dto.data.entity);
                // window.location.reload();
                console.log(dto.data.entity)
            },
            error: (e) => {
                console.log(e)
            }
        })
    }
    submitOtherDetailsForm() {
        // console.log(this.otherDetailsForm)

        let payload = { ...this.empDemoraphicDetailsForm.value };

        this.quoteService.update(this.quote._id, payload).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {

                // console.log(dto)
                // this.quoteService.setQuote(dto.data.entity);
                // this.quoteService.setQuote(this.quote);
                // window.location.reload();

            },
            error: (e) => {
                console.log(e)
            }
        })
    }



    get hypothications(): FormArray {
        return this.bankDetailForm.get("hypothications") as FormArray;
    };


    createHypothicationForm(hypothication?: IHypothication): FormGroup {
        // console.log(">>>>>ICNAME",mappedIcName);

        return this.formBuilder.group({
            name: [hypothication?.name, [Validators.required]],
        });
    };

    onAddHypothecation() {
        this.hypothications.push(this.createHypothicationForm());
    }
    onDeleteHypothecation(rowIndex: number): void {
        this.hypothications.removeAt(rowIndex);
    }

    downloadEmployeeDemographyExcel() {

        this.quoteService.downloadQuoteEmployeeDemographyExcel(this.quote?._id, this.selectedQuoteTemplate[0].fileUploadType).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }

    getLeadInsurer() {
        this.leadInsurerService.getManyAsLovs(event).subscribe({
            next: data => {
                this.optionsInsurers = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    getTpas() {
        this.tpaService.getManyAsLovs(event).subscribe({
            next: data => {
                this.tpaLists = data.data.entities.map(entity => ({ label: entity.name, value: entity._id }));
            },
            error: e => { }
        });
    }

    getAnnualTurnOver() {
        this.annualTurnOver.getManyAsLovs(event).subscribe({
            next: data => {
                this.annualTurnOverList = data.data.entities.map(entity => ({ label: entity.formattedString, value: entity._id }));
            },
            error: e => { }
        });
    }
}
