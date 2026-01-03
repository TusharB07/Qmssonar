import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem, LazyLoadEvent, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { IOneResponseDto, IManyResponseDto, IBulkImportResponseDto } from 'src/app/app.model';
import { IClaimExperience } from 'src/app/features/admin/claim-experience/claim-experience.model';
import { ClaimExperienceService } from 'src/app/features/admin/claim-experience/claim-experience.service';
import { IProduct, AllowedProductTemplate, AllowedPushbacks } from 'src/app/features/admin/product/product.model';
import { QuoteLocationOccupancyService } from 'src/app/features/admin/quote-location-occupancy/quote-location-occupancy.service';
import { AllowedQuoteStates, AllowedQuoteTypes, IEmployeesDemoSummary, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { QuoteSlipDialogComponent } from '../../components/quote-slip-dialog/quote-slip-dialog.component';
import { ComparasionwithBrokerModel, IcOptions, IcOptionsList, QCRQuestionAnswer, QcrAnswers, QcrHeaders } from './quote-comparasion-review-detailed-page.model';
import { AllowedGMCPARENTabsTypes, GMCTemplate, IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { AppService } from 'src/app/app.service';
import { QoutegmctemplateserviceService } from 'src/app/features/admin/gmc-master/qoutegmctemplateservice.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { HttpHeaders } from '@angular/common/http';
import { AccountService } from 'src/app/features/account/account.service';
import { FileUpload } from 'primeng/fileupload';
import html2canvas from 'html2canvas';
import { IUser } from 'src/app/features/admin/user/user.model';
import { PaymentDetailComponent } from '../../components/payment-detail/payment-detail.component';
import { PaymentDetailGmcComponent } from '../../components/payment-detail-gmc/payment-detail-gmc.component';
import { CoInsuranceFormDialogGmcComponent } from '../../components/co-insurance-form-dialog-gmc/co-insurance-form-dialog-gmc.component';
import { GMCFileUploadDialogComponent } from '../../components/quote/gmc-file-upload-qcr-dialog/gmc-file-upload-qcr-dialog.component';
import { FormBuilder } from '@angular/forms';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { GmcOptionsService } from '../../components/gmc-coverages-options-dialog/gmc-options.service';
import { IcListDialogComponent } from '../quote-comparison-review-detailed-page/ic-list-dialog/ic-list-dialog.component';
import { QuoteOptionService } from 'src/app/features/admin/quote/quoteOption.service';
@Component({
    selector: 'app-quote-comparision-review-detailed-page-gmc',
    templateUrl: './quote-comparision-review-detailed-page-gmc.component.html',
    styleUrls: ['./quote-comparision-review-detailed-page-gmc.component.scss']
})
export class QuoteComparisionReviewDetailedPageGmcComponent implements OnInit {

    id: string;
    quote: IQuoteSlip;
    sendLinkForm: any;

    private currentQuote: Subscription;
    //Intergation-EB [Start]
    private currentSelectedTemplate: Subscription;
    selectedQuoteTemplate: IQuoteGmcTemplate[];
    quoteGmcOptionsLst: IQuoteGmcTemplate[];
    comparasionwithBrokerModel: ComparasionwithBrokerModel = new ComparasionwithBrokerModel()
    //Intergation-EB [End]
    tabs: MenuItem[] = [];
    showTableForExcel: boolean = false;
    // openDropDownClaimExpireance:object = { 'display': 'none' };
    openDropDownClaimExpireance: boolean = false;
    isCloseErrow: boolean = false;
    isOpenErrow: boolean = true;
    colSpan: number = 0
    attachmentDetails: any[] = []
    brokerOption1: GMCTemplate = new GMCTemplate();
    icQuoteOption: GMCTemplate[] = []
    icOptionsLst: IcOptions[] = []
    questionAnswerList: QCRQuestionAnswer[] = []
    questionAnswerListTwo: QCRQuestionAnswer[] = []
    questionAnswerListToBind: QCRQuestionAnswer[] = []
    questionAnswerListToBindQuickQCR: QCRQuestionAnswer[] = []
    qmodel: QCRQuestionAnswer = new QCRQuestionAnswer()
    qcrHeadersLst: QcrHeaders[] = []
    quickQcrHeadersLst: QcrHeaders[] = []
    qcrHeaderTwoLst: QcrHeaders[] = []
    quickQCRHeaderTwoLst: QcrHeaders[] = []
    employeeInfo: IEmployeesDemoSummary[] = [];
    allInsurerList: { id: string, version: string, partnerName: string, createdAt: Date }[] = [];
    showModal: boolean = false;

    qcrHeaderBasicDetailsLst: QcrHeaders[] = []
    qcrHeaderBasicDetailsTwoLst: QcrHeaders[] = []

    visibleSidebar = false;
    displayBasic = false;
    quickView = false;
    message: any;
    versionOptions: { label: string, value: number }[] = [];
    selectedVersion: number = 1;
    insurerProcessedQuotes: IQuoteSlip[] = []
    private currentUser: Subscription;
    user: IUser;
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private dialogService: DialogService,
        private claimExperienceService: ClaimExperienceService,
        private appService: AppService,
        private accountService: AccountService,
        private templateService: QoutegmctemplateserviceService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private gmcOptionsService: GmcOptionsService, private quoteOptionService: QuoteOptionService,


    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");
        this.selectedTabId = this.activatedRoute.snapshot.queryParams.tab

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
                // Dynamically generate the version options based on qcrversion
                for (let i = 1; i <= this.quote.qcrVersion; i++) {
                    this.versionOptions.push({ label: `Version ${i}`, value: i });
                }
            }
        })
        //Intergation-EB [Start]
        this.currentSelectedTemplate = this.quoteService.currentQuoteOptions$.subscribe({
            next: (template) => {
                this.selectedQuoteTemplate = template;
                this.loadData(this.quote)
            }
        })
        this.sendLinkForm = this.fb.group({
            email: ['']
        })
        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
                this.user = user;
                console.log(user);
            }
        });
        //Intergation-EB [End]
    }

    claimExperiences: IClaimExperience[] = []
    selectedTabId: string;


    ViewUploadAttachments() {
        const ref = this.dialogService.open(GMCFileUploadDialogComponent, {
            header: "Upload File",
            width: '70%',
            styleClass: 'customPopup',
            closable: false,
            closeOnEscape: false,
            data: {
                quote: this.quote,
                selectedQuoteTemplate: this.selectedQuoteTemplate,
                attachmentDetails: this.attachmentDetails
            }
        }).onClose.subscribe((selectedCovers) => {
            this.loadData(this.quote)
            this.quoteService.refresh()
        })
    }


    ngOnInit(): void {

        this.qmodel = new QCRQuestionAnswer();
        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 5,
            sortField: '_id',
            sortOrder: -1,
            filters: {
                // @ts-ignore
                quoteId: [
                    {
                        value: this.quote?._id,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        };

        this.claimExperienceService.getMany(lazyLoadEvent).subscribe({
            next: (dto: IManyResponseDto<IClaimExperience>) => {
                this.claimExperiences = dto.data.entities
                console.log('***', this.claimExperiences)
            }
        })
        if (this.quote == undefined) {
            this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true }).subscribe({
                next: (dto: IOneResponseDto<IQuoteSlip>) => {
                    this.quoteService.setQuote(dto.data.entity)
                    this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.quoteGmcOptionsLst = dto.data.entity;
                            this.loadOptionsData(dto.data.entity) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                            this.loadSelectedOption(dto.data.entity[0])

                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                    //this.loadData(this.quote)
                },
                error: e => {
                    console.log(e);
                }
            });

        }
        else {
            this.loadData(this.quote)
        }

    }

    visible() {
        this.visibleSidebar = true
    }
    toggleQuickView(): any {
        this.quickView = !this.quickView
    }

    loadOptionsData(quoteOption: IQuoteGmcTemplate[]) {
        this.quoteService.setQuoteOptions(quoteOption)
    }
    loadSelectedOption(quoteOption: IQuoteGmcTemplate) {
        this.quoteService.setSelectedOptions(quoteOption)
    }

    ngOnDestroy(): void {
        // this.currentQuoteLocationOccupancyId.unsubscribe();
        this.currentQuote.unsubscribe();
    }

    sendQuoteForApproval() {
        this.quoteService.sendForQCRApproval(this.quote._id, { qcrApprovalRequested: true, quoteSlipApprovalRequested: false }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                this.quoteService.refresh((quote) => {
                    this.router.navigateByUrl(`/`);
                })
            },
            error: error => {
                console.log(error);
            }
        });
    }

    downloadPdf() {
        const element = document.getElementById('execeltbl'); // Replace 'execeltbl' with your table's ID
        if (!element) {
            console.error(`Element with id "execeltbl" not found.`);
            return;
        }

        // Add the class to make the table visible for export
        element.classList.add('visible-for-export');
        this.showTableForExcel = true;

        const margin = 10; // Margin for the PDF (in mm)
        const headerHeight = 15; // Height reserved for the header (in mm)
        const headerText = 'GMC Review Report'; // Text for the header

        // Ensure the table is visible before exporting
        setTimeout(() => {
            html2canvas(element, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png'); // Convert canvas to Data URL in PNG format
                const pdf = new jsPDF('p', 'mm', 'a4'); // Initialize jsPDF

                const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2; // Width with margins
                const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2 - headerHeight; // Height with top and bottom margins and header

                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                // Calculate height for PDF while maintaining aspect ratio
                const imgPDFHeight = (imgHeight * pdfWidth) / imgWidth;

                let position = 0; // Initialize position to track where to start each slice
                const pageHeightInCanvas = (pdfHeight * imgWidth) / pdfWidth; // Height of one PDF page in canvas scale

                // Loop over the image height to create pages
                while (position < imgHeight) {
                    const canvasPage = document.createElement('canvas'); // Create a temporary canvas for each page
                    const context = canvasPage.getContext('2d');

                    canvasPage.width = imgWidth;
                    canvasPage.height = pageHeightInCanvas; // Height per page (scaled to canvas)

                    // Draw the portion of the image corresponding to this page
                    context.drawImage(
                        canvas, // Source canvas
                        0, position, // Start at (x=0, y=position)
                        imgWidth, pageHeightInCanvas, // Dimensions to crop
                        0, 0, // Place at (x=0, y=0) in new canvas
                        imgWidth, pageHeightInCanvas // Dimensions in the new canvas
                    );

                    const pageImgData = canvasPage.toDataURL('image/png'); // Convert page canvas to PNG

                    const pdfHeightForPage = (pageHeightInCanvas * pdfWidth) / imgWidth; // Height in PDF units

                    // Add header text before the image on each page
                    pdf.setFontSize(12);
                    pdf.text(headerText, margin, margin + 5); // Position the header text

                    // Add the image to the PDF with margins and below the header
                    pdf.addImage(pageImgData, 'PNG', margin, margin + headerHeight, pdfWidth, pdfHeightForPage);

                    position += pageHeightInCanvas; // Move position to the next portion of the image

                    // Add a new page if there's more content to render
                    if (position < imgHeight) {
                        pdf.addPage();
                    }
                }

                pdf.save('GMC_QCR_Review.pdf'); // Save the PDF

                // Remove the class after exporting
                element.classList.remove('visible-for-export');
                this.showTableForExcel = false;
            }).catch(error => {
                console.error("Error generating PDF:", error);
            });
        }, 100); // Adjust the delay as needed (100 milliseconds = 0.1 second)
    }


    downloadExcel(): void {

        const table = document.getElementById("execeltbl");
        if (!table) {
            console.error(`Table with id "execeltbl" not found.`);
            return;
        }

        // Add the class to make the table visible
        table.classList.add("visible-for-export");

        this.showTableForExcel = true;
        // Add a delay to ensure the table is visible before exporting
        setTimeout(() => {
            this.exportTableToExcel("execeltbl", "GMC_QCRExcel.xlsx");
            // Remove the class after exporting
            table.classList.remove("visible-for-export");
            this.showTableForExcel = false;
        }, 100); // Adjust the delay as needed (1000 milliseconds = 1 second)
        //this.exportTableToExcel("execeltbl", "GMC_QCRExcel.xlsx");
        //this.showTableForExcel = false;
    }


    exportTableToExcel(tableId: string, fileName: string = 'excel_file.xlsx'): void {
        const table = document.getElementById(tableId);
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
        // Apply formatting and adjust column widths
        this.applyFormattingAndAdjustWidths(worksheet, table);

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, fileName);
    }
    private applyFormattingAndAdjustWidths(worksheet: XLSX.WorkSheet, table: HTMLElement): void {
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        const colWidths: number[] = new Array(range.e.c - range.s.c + 1).fill(10);

        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                const cell = worksheet[cellAddress];
                if (!cell) continue;

                const htmlCell = table.querySelector(`tr:nth-child(${R + 1}) td:nth-child(${C + 1})`) as HTMLElement;
                if (!htmlCell) continue;

                const cellValue = String(cell.v);
                colWidths[C] = 20;

                // Extract and apply styles
                const styles = this.getCellStyles(htmlCell);
                cell.s = styles;
            }
        }

        worksheet['!cols'] = colWidths.map(w => ({ wch: w + 2 }));
    }

    private getCellStyles(htmlCell: HTMLElement): any {
        const styles = window.getComputedStyle(htmlCell);
        return {
            fill: {
                fgColor: { rgb: this.rgbToHex(styles.backgroundColor) }
            },
            font: {
                name: 'Arial',
                sz: parseInt(styles.fontSize) || 12,
                bold: parseInt(styles.fontWeight) >= 700, // Covering all bold weights
                color: { rgb: this.rgbToHex(styles.color) }
            },
            alignment: {
                horizontal: styles.textAlign as any,
                vertical: styles.verticalAlign === 'middle' ? 'center' : 'top'
            },
            border: this.getBorderStyles(styles),
            wrapText: true // Enable text wrapping
        };
    }

    private getBorderStyles(styles: CSSStyleDeclaration): any {
        const borders = ['top', 'bottom', 'left', 'right'];
        const borderStyles: any = {};
        borders.forEach(border => {
            const style = styles[`border${border.charAt(0).toUpperCase() + border.slice(1)}Style`];
            const width = styles[`border${border.charAt(0).toUpperCase() + border.slice(1)}Width`];
            const color = styles[`border${border.charAt(0).toUpperCase() + border.slice(1)}Color`];
            if (style !== 'none') {
                borderStyles[border] = { style: this.borderStyleMap(style), color: { rgb: this.rgbToHex(color) } };
            }
        });
        return borderStyles;
    }

    private borderStyleMap(style: string): string {
        const styleMap: { [key: string]: string } = {
            'solid': 'thin',
            'dotted': 'dotted',
            'dashed': 'dashed',
            // Add more mappings as needed
        };
        return styleMap[style] || 'thin';
    }

    private rgbToHex(rgb: string): string {
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
        return result ? `FF${this.toHex(result[1])}${this.toHex(result[2])}${this.toHex(result[3])}` : 'FFFFFFFF';
    }

    private toHex(value: string): string {
        return ('0' + parseInt(value, 10).toString(16)).slice(-2).toUpperCase();
    }
    mappingQCR = []
    mappingQCRArr = []
    mapping = []
    // mapping: Array<{
    //     [colId: string]: {
    //         type: 'html' | 'string' | 'button' | 'boolean' | 'currency',
    //         value: string | number,
    //         buttonClassName?: string
    //         buttonOnClick?: any

    //     }
    // }> = []

    cols: MenuItem[] = []
    mainCols: MenuItem[] = []
    // ---------------------------------------------------------------
    onVersionChange(event: any) {
        const selectedValue = event.value;
        console.log('Selected version:', selectedValue);
        this.loadData(this.quote)
    }

    revisedQuote(quote: IQuoteSlip) {
        this.quoteService.get(`${quote._id}`, { allCovers: true, qcr: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                let allQuotes = dto.data.entity;
                this.quote = dto.data.entity;
                this.quoteService.setQuote(allQuotes)
                this.allInsurerList = []; // Reset the cols array
                for (const insurerQuote of allQuotes.insurerProcessedQuotes) {
                    this.allInsurerList.push({
                        id: insurerQuote._id,
                        version: "Version " + insurerQuote.qcrVersion + (insurerQuote.parentQuoteId ? " (Expiry Terms)" : ""),
                        partnerName: insurerQuote.partnerId['name'],
                        createdAt: insurerQuote.createdAt
                    });
                }

                this.showModal = true; // Show the modal
            },
            error: e => {
                console.log(e);
            }
        });
    }

    qcrEdit() {
        const ref = this.dialogService.open(IcListDialogComponent, {
            header: "Select IC",
            width: "400px",
            styleClass: "flatPopup",
            data: {
                quoteId: this.quote,
            }
        })
    }

    generateqcrEdit(quoteNo) {
        this.templateService.editQCR(quoteNo).subscribe({
            next: response => {
                //this.quoteOptionService.refreshQuoteOption()
                this.router.navigateByUrl(`/backend/quotes`)
            }
        });
    }

    generateqcrVersion(quoteId: string) {
        const payload = {};
        payload["pushBackFrom"] = AllowedPushbacks.QCR;
        payload["pushBackToState"] = AllowedQuoteStates.UNDERWRITTER_REVIEW;
        this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
            this.router.navigateByUrl('/backend/quotes')
        })
    }

    loadData(brokerQuote: IQuoteSlip) {
        this.tabs = this.loadTabs(brokerQuote.productId as IProduct)
        this.insurerProcessedQuotes = brokerQuote.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion);
        this.selectTab(this.tabs.find(tab => tab.id == this.selectedTabId))

        this.cols = []
        this.quickQcrHeadersLst = []
        this.qcrHeadersLst = []
        this.qcrHeaderTwoLst = []
        this.quickQCRHeaderTwoLst = []
        this.mainCols = []
        // Setting the headers
        this.cols.push({ id: 'labels', style: "width:200px" })


        let selectedQuoteTemplate = this.selectedQuoteTemplate.filter(x => x.version == this.selectedVersion)

        if (selectedQuoteTemplate && selectedQuoteTemplate.length > 0) {
            this.attachmentDetails = []; // Initialize an empty array
            selectedQuoteTemplate.forEach(template => {
                if (template.basicDeatilsQCRAttachments?.length) {
                    const filteredAttachments = template.basicDeatilsQCRAttachments.filter(
                        attachment => attachment.attachmentSubType === "QCR"
                    );
                    this.attachmentDetails.push(...filteredAttachments);
                }
            });
        } else {
            this.attachmentDetails = [];
        }
        //Pushing Options Headings

        for (const option of selectedQuoteTemplate) {
            this.mainCols.push({ id: option._id, label: option.optionName, style: "width:200px" })
        }

        // Pushing the Broker Quote Header
        this.cols.push({ id: brokerQuote._id, label: brokerQuote.originalIntermediateName, style: "width:200px" })


        // Pushing  Insurer Quote Headers
        if (brokerQuote.partnerId["brokerModeStatus"] == true) {
            for (const insurerQuote of this.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion)) {
                if (insurerQuote.parentQuoteId) {
                    insurerQuote.partnerId['name'] = "Expiry Term"
                }
                this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
            }
        } else {
            for (const insurerQuote of this.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion)) {
                this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })

            }
        }

        this.cols.push({ id: brokerQuote._id, label: "Existing Third Party Administrator (TPA)", style: "width:200px" })
        for (const insurerQuote of this.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion)) {
            this.cols.push({ id: insurerQuote._id, label: "Existing Third Party Administrator (TPA)", style: "width:200px" })

        }

        // // Pushing  Insurer Quote Headers
        // this.colSpan = +brokerQuote.insurerProcessedQuotes.length + 1;
        // for (const insurerQuote of brokerQuote.insurerProcessedQuotes) {
        //     this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
        // }

        //Broker Quote
        this.comparasionwithBrokerModel.brokerData = selectedQuoteTemplate

        this.brokerOption1 = selectedQuoteTemplate.filter(x => x.optionIndex == 1)[0].gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0];

        //Foreach option
        this.questionAnswerList = [];

        const qcrHeaders = new QcrHeaders();
        qcrHeaders.label = ""
        this.qcrHeadersLst.push(qcrHeaders);
        this.quickQcrHeadersLst.push(qcrHeaders);
        const qcrHeaderstwo = new QcrHeaders();
        qcrHeaderstwo.label = ""
        qcrHeaderstwo.quoteId = "";
        this.qcrHeaderTwoLst.push(qcrHeaderstwo);
        this.quickQCRHeaderTwoLst.push(qcrHeaderstwo);

        let i = 0
        brokerQuote.allCoversArray.gmcOptions.filter(x => x.version == this.selectedVersion).forEach(element => {
            const qcrHeaderstwo = new QcrHeaders();
            qcrHeaderstwo.label = brokerQuote.partnerId['name']
            qcrHeaderstwo.quoteId = brokerQuote._id;
            qcrHeaderstwo.optionIndex = element.optionIndex
            qcrHeaderstwo.quoteFor = "Broker"
            qcrHeaderstwo.showButton = (element.bankName == undefined || element.bankName == '') ? false : true
            qcrHeaderstwo.bankName = element.bankName
            this.qcrHeaderTwoLst.push(qcrHeaderstwo);
            this.quickQCRHeaderTwoLst.push(qcrHeaderstwo);

            for (const insurerQuote of this.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion)) {
                const qcrHeaderstwo = new QcrHeaders();
                qcrHeaderstwo.quoteId = insurerQuote._id;
                const options = insurerQuote.allCoversArray.gmcOptions.filter(x => x.version == this.selectedVersion)[i];
                if (options != undefined) {
                    qcrHeaderstwo.label = insurerQuote.partnerId['name'] + ' [' + (options.isAccepted == 'Accept' ? 'Accepted' : 'Rejected') + ']'
                    qcrHeaderstwo.quoteFor = "IC"
                    qcrHeaderstwo.indicativePremium = options.indicativePremium;
                    qcrHeaderstwo.optionId = options._id;
                    //qcrHeaderstwo.showButton = (options.isAccepted == 'Accept' ? true : false)
                    qcrHeaderstwo.showButton = (options.bankName == undefined || options.bankName == '') ? false : true
                    qcrHeaderstwo.bankName = options.bankName
                    //quoteOption.quoteOptionStatus == "Accept"                     
                    this.qcrHeaderTwoLst.push(qcrHeaderstwo);
                }
                const quickQCRHeaderstwo = new QcrHeaders();
                quickQCRHeaderstwo.label = insurerQuote.partnerId['name']
                quickQCRHeaderstwo.quoteId = brokerQuote._id;
                quickQCRHeaderstwo.quoteFor = "IC"
                quickQCRHeaderstwo.optionIndex = element.optionIndex
                quickQCRHeaderstwo.optionId = options._id;
                this.quickQCRHeaderTwoLst.push(quickQCRHeaderstwo);
            };
            i++;
        });

        //Other Tabs
        brokerQuote.allCoversArray.gmcOptions.filter(x => x.version == this.selectedVersion).forEach(element => {
            let qcrHeaders = new QcrHeaders();
            qcrHeaders.label = element.optionName
            qcrHeaders.optionIndex = element.optionIndex
            qcrHeaders.colspan = (+this.insurerProcessedQuotes.length) + 1;
            this.qcrHeadersLst.push(qcrHeaders);
            this.quickQcrHeadersLst.push(qcrHeaders);
            //Optiom Index
            const optionIndex = element.optionIndex;

            element.gmcTemplateData.forEach(tempdata => {
                //Temp ID
                const tempId = tempdata._id
                tempdata.gmcSubTab.forEach(gmcsTab => {

                    //Sub Tab Id        
                    const subtabId = gmcsTab._id
                    //Subtab Name                  
                    if (optionIndex == 1) {
                        this.qmodel = new QCRQuestionAnswer();
                        this.qmodel.parentTabName = tempdata.parentTabName
                        this.qmodel.quoteId = element.quoteId;
                        this.qmodel.question = gmcsTab.subTabName;
                        this.qmodel.isHeader = false;
                        this.qmodel.isSubHeader = true;
                        this.qmodel.isLabel = false;
                        this.qmodel.bankName = element.bankName
                        this.qmodel.colspan = 1 + (+this.insurerProcessedQuotes.length + 1) * selectedQuoteTemplate.length;
                        this.questionAnswerList.push(this.qmodel);
                        // console.log(this.questionAnswerList)
                    }
                    gmcsTab.gmcLabelForSubTab.forEach(pos => {
                        //GMC LabelSubTabId
                        const gmcLabelForSubTabId = pos._id;
                        if (pos.gmcQuestionAnswers != undefined) {
                            pos.gmcQuestionAnswers.forEach(eQues => {
                                //QuestionId
                                const questId = eQues._id;

                                this.qmodel = new QCRQuestionAnswer();
                                this.qmodel.quoteId = element.quoteId;
                                this.qmodel.tempId = tempId;
                                this.qmodel.subtabId = subtabId;
                                this.qmodel.gmcLabelForSubTabId = gmcLabelForSubTabId;
                                this.qmodel.questId = questId;
                                this.qmodel.isHeader = false;
                                this.qmodel.isSubHeader = false;
                                this.qmodel.isLabel = true;
                                this.qmodel.bankName = element.bankName
                                this.qmodel.parentTabName = tempdata.parentTabName
                                //Answer Broker Ans
                                const qcrAnswers = new QcrAnswers();
                                if (eQues.question.trim() == "Family Definition") {
                                    const ans = element.coverageTypeName
                                    qcrAnswers.answer.push(ans.toString());
                                }
                                else {
                                    qcrAnswers.answer = this.getAnswer(eQues);
                                }

                                qcrAnswers.icType = "Broker" + optionIndex;
                                qcrAnswers.id = questId;
                                qcrAnswers.optionIndex = optionIndex

                                if (optionIndex == 1) {

                                    //Answer Broker Question
                                    this.qmodel.parentTabName = tempdata.parentTabName
                                    this.qmodel.question = eQues.question;
                                    this.qmodel.answer.push(qcrAnswers);
                                }
                                else {
                                    //Search in answer array and add answer
                                    this.questionAnswerList.filter(x => x.isHeader == false && x.question.trim() == eQues.question.trim() && x.subtabId == subtabId && x.gmcLabelForSubTabId == gmcLabelForSubTabId && x.questId == questId && x.parentTabName == this.qmodel.parentTabName)[0].answer.push(qcrAnswers)
                                    // console.log(this.questionAnswerList)
                                }


                                //this.questionAnswerList.push(this.qmodel);
                                //Get Ansert for ICs
                                for (const insurerQuote of this.insurerProcessedQuotes.filter(x => x.qcrVersion == this.selectedVersion)) {
                                    const options = insurerQuote.allCoversArray.gmcOptions.filter(x => x.version == this.selectedVersion);
                                    //ForEach Option
                                    const icOptions = new IcOptions()
                                    const optionAsperIndex = options.filter(x => x.optionIndex == optionIndex)[0]
                                    const gmcTemplateData = optionAsperIndex.gmcTemplateData.filter(x => x._id == tempId)[0]
                                    const gmcSubTab = gmcTemplateData.gmcSubTab.filter(x => x._id == subtabId)[0]
                                    const gmcLabelForSubTab = gmcSubTab.gmcLabelForSubTab.filter(x => x._id == gmcLabelForSubTabId)[0]
                                    const gmcQuestionAnswers = gmcLabelForSubTab.gmcQuestionAnswers.filter(x => x._id == questId)[0]
                                    //IC Answer
                                    if (gmcTemplateData.parentTabName == "Other Details") {
                                        console.log("Other details");
                                    }
                                    const qcrAnswers = new QcrAnswers();
                                    qcrAnswers.quoteId = insurerQuote._id;
                                    if (gmcQuestionAnswers.question.trim() == "Family Definition") {
                                        const ans = optionAsperIndex.coverageTypeName

                                        qcrAnswers.answer.push(ans.toString());
                                        if (element.coverageTypeName != ans) {
                                            qcrAnswers.isChanged = true;
                                        }
                                    }
                                    else {
                                        qcrAnswers.answer = this.getAnswer(gmcQuestionAnswers)
                                        if (eQues.selectedAnswer != gmcQuestionAnswers.selectedAnswer) {
                                            qcrAnswers.isChanged = true;
                                        }
                                    }
                                    qcrAnswers.icType = "IC" + optionIndex;
                                    qcrAnswers.id = questId;
                                    qcrAnswers.optionIndex = optionIndex
                                    if (optionIndex == 1) {
                                        this.qmodel.answer.push(qcrAnswers);
                                    }
                                    else {
                                        //Search in answer array and add answer
                                        this.questionAnswerList.filter(x => x.isHeader == false && x.question.trim() == eQues.question.trim() && x.subtabId == subtabId && x.gmcLabelForSubTabId == gmcLabelForSubTabId && x.questId == questId && x.parentTabName == this.qmodel.parentTabName)[0].answer.push(qcrAnswers)
                                        console.log("IC option")
                                        // console.log(this.questionAnswerList)
                                    }
                                }
                                if (optionIndex == 1) {
                                    this.questionAnswerList.push(this.qmodel);
                                    console.log("IC option1")
                                    //console.log(this.questionAnswerList)
                                }
                            });

                        }
                    });
                });
                // }

            });
        });
        // console.log(this.questionAnswerList)



        //Add data for the QCR Quick view
        //family_composition
        // var qcrMapping = new QCRQuestionAnswer();
        // qcrMapping.question = "Family Composition";
        // qcrMapping.isHeader = true;
        // qcrMapping.isSubHeader = false;
        // qcrMapping.isLabel = false;
        // qcrMapping.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
        // this.questionAnswerListToBindQuickQCR.push(qcrMapping);
        // const familyComposition = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)
        // this.questionAnswerListToBindQuickQCR.push(...familyComposition);

        // //coverages
        // qcrMapping = new QCRQuestionAnswer();
        // qcrMapping.question = "Coverages";
        // qcrMapping.isHeader = true;
        // qcrMapping.isSubHeader = false;
        // qcrMapping.isLabel = false;
        // qcrMapping.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
        // this.questionAnswerListToBindQuickQCR.push(qcrMapping);
        // const coverages = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COVERAGES)
        // this.questionAnswerListToBindQuickQCR.push(...coverages);



        // //Maternity Benifits
        // qcrMapping = new QCRQuestionAnswer();
        // qcrMapping.question = "Maternity Benifits";
        // qcrMapping.isHeader = true;
        // qcrMapping.isSubHeader = false;
        // qcrMapping.isLabel = false;
        // qcrMapping.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
        // this.questionAnswerListToBindQuickQCR.push(qcrMapping);
        // const maternityBenifits = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.MATERNITY)
        // this.questionAnswerListToBindQuickQCR.push(...maternityBenifits);



        // //Maternity Benifits
        // qcrMapping = new QCRQuestionAnswer();
        // qcrMapping.question = "Other Restrictions";
        // qcrMapping.isHeader = true;
        // qcrMapping.isSubHeader = false;
        // qcrMapping.isLabel = false;
        // qcrMapping.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
        // this.questionAnswerListToBindQuickQCR.push(qcrMapping);
        // const costContainment = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COSTCONTAINMENT)
        // this.questionAnswerListToBindQuickQCR.push(...costContainment);


        // //Maternity Benifits
        // qcrMapping = new QCRQuestionAnswer();
        // qcrMapping.question = "Other Details";
        // qcrMapping.isHeader = true;
        // qcrMapping.isSubHeader = false;
        // qcrMapping.isLabel = false;
        // qcrMapping.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
        // this.questionAnswerListToBindQuickQCR.push(qcrMapping);
        // const otherDetails = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.OTHERDETAILS)
        // this.questionAnswerListToBindQuickQCR.push(...otherDetails);


        // //other product
        // qcrMapping = new QCRQuestionAnswer();
        // qcrMapping.question = "Other Product";
        // qcrMapping.isHeader = true;
        // qcrMapping.isSubHeader = false;
        // qcrMapping.isLabel = false;
        // qcrMapping.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
        // this.questionAnswerListToBindQuickQCR.push(qcrMapping);
        // const otherProduct = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.OTHERPRODUCT)
        // this.questionAnswerListToBindQuickQCR.push(...otherProduct);


        // this.questionAnswerListToBindQuickQCR = this.questionAnswerListToBindQuickQCR.filter(qcrQuestionAnswer =>
        //     qcrQuestionAnswer.answer.some(answer => answer.isChanged) || qcrQuestionAnswer.isHeader || qcrQuestionAnswer.isSubHeader
        // );
        this.QuickViewFunction()
    }


    downloadExcelNew(): void {
        if (this.quote.productId['productTemplate'] == AllowedProductTemplate.GMC) {
            // Use this.quote.id instead of this.quoteId
            this.quoteOptionService.downloadQCRExcelGmcWithInsurer(this.quote._id, this.quote.quoteNo).subscribe({
                next: (dto: IOneResponseDto<IBulkImportResponseDto>) => {
                    if (dto.status == 'success') {
                        // Download the sample file
                        this.appService.downloadQCRExcel('QCR report', dto.data.entity.downloadablePath)

                    }
                }
            })
        }

    }

    QuickViewFunction() {
        let familyCompositionString = {};
        let coveragesString = {};
        let maternityBenefitsString = {};
        let enhancedCoversString = {};
        let costContainmentString = {};
        let otherDetailsString = {};

        // Helper function to filter data
        function filterFun(arr) {
            return arr.filter(item => item.answer.some(answer => true));
        }

        // Family Composition
        let familyComposition = filterFun(this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION));
        if (familyComposition.length > 0) {
            familyCompositionString = {
                question: "Family Composition",
                isHeader: true,
                isSubHeader: false,
                isLabel: false
            };
            this.mappingQCR = [familyCompositionString, ...familyComposition];

        }

        // Coverages
        let coverages = filterFun(this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COVERAGES));
        if (coverages.length > 0) {
            coveragesString = {
                question: "Standard Coverages",
                isHeader: true,
                isSubHeader: false,
                isLabel: false
            };
            this.mappingQCR = [...(this.mappingQCR || []), coveragesString, ...coverages];
        }

        // Maternity Benefits
        let maternityBenefits = filterFun(this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.MATERNITY));
        if (maternityBenefits.length > 0) {
            maternityBenefitsString = {
                question: "Maternity Benefits",
                isHeader: true,
                isSubHeader: false,
                isLabel: false
            };
            this.mappingQCR = [...(this.mappingQCR || []), maternityBenefitsString, ...maternityBenefits];
        }

        //enhancedCoversString
        let enhancedCovers = filterFun(this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.ENHANCEDCOVERS));
        if (enhancedCovers.length > 0) {
            enhancedCoversString = {
                question: "Enhanced Covers",
                isHeader: true,
                isSubHeader: false,
                isLabel: false
            };
            this.mappingQCR = [...(this.mappingQCR || []), enhancedCoversString, ...enhancedCovers];
        }
        // Other Restrictions
        let costContainment = filterFun(this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COSTCONTAINMENT));
        if (costContainment.length > 0) {
            costContainmentString = {
                question: "Other Restrictions",
                isHeader: true,
                isSubHeader: false,
                isLabel: false
            };
            this.mappingQCR = [...(this.mappingQCR || []), costContainmentString, ...costContainment];
        }

        // Other Details
        let otherDetails = filterFun(this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.OTHERDETAILS));
        if (otherDetails.length > 0) {
            otherDetailsString = {
                question: "Other Details",
                isHeader: true,
                isSubHeader: false,
                isLabel: false
            };
            this.mappingQCR = [...(this.mappingQCR || []), otherDetailsString, ...otherDetails];
        }
        this.mappingQCR.forEach((qModel) => {
            if (qModel.answer) {
                const processedOptionIndexes = new Set();

                qModel.answer.forEach((ans, index, arr) => {
                    //console.log(`Processing optionIndex: ${ans.optionIndex}`);

                    if (processedOptionIndexes.has(ans.optionIndex)) {
                        //console.log(`Skipping optionIndex: ${ans.optionIndex}`);
                        return;
                    }
                    const sameOptionIndexItems = arr.filter(a => a.optionIndex === ans.optionIndex);

                    if (sameOptionIndexItems.length > 1) {
                        sameOptionIndexItems.forEach((item, i) => {
                            if (i > 0) {
                                item.isChanged = item.answer.toString() != sameOptionIndexItems[0].answer.toString();
                            }
                            else {
                                item.isChanged = false;
                            }
                        });

                        const allUnchanged = sameOptionIndexItems.every(item => item.isChanged === false);

                        if (allUnchanged) {
                            sameOptionIndexItems.forEach(item => {
                                item.showEmpty = true;
                            });
                        }
                    }

                    processedOptionIndexes.add(ans.optionIndex);
                });
            }
        });

        const filteredQCR = this.mappingQCR.filter((qModel) => {
            if (qModel.isHeader) {
                return true;
            }
            return qModel.answer &&
                qModel.answer.some(answer => answer.isChanged);
        });


        this.mappingQCR = filteredQCR;
        const allChangedAnswers = this.mappingQCR.reduce((acc, item) => {
            if (item.answer) {
                const changedAnswers = item.answer.filter(answer => answer.isChanged);
                return acc.concat(changedAnswers);
            }
            return acc;
        }, []);

        const distinctOptionIndexes = [
            ...new Set(allChangedAnswers.map(answer => answer.optionIndex))
        ];

        const filteredQCRHeadersLst = this.quickQcrHeadersLst.filter(header =>
            distinctOptionIndexes.includes(header.optionIndex) || (header.label == "" && header.optionIndex == 0)
        );

        const filteredquickQCRHeaderTwoLst = this.quickQCRHeaderTwoLst.filter(header =>
            distinctOptionIndexes.includes(header.optionIndex) || (header.label == "" && header.optionIndex == 0)
        );

        this.quickQCRHeaderTwoLst = filteredquickQCRHeaderTwoLst
        this.quickQcrHeadersLst = filteredQCRHeadersLst;

        this.mappingQCR = this.mappingQCR.map(item => {
            if (item.answer) {
                const filteredAnswers = item.answer.filter(answer =>
                    distinctOptionIndexes.includes(answer.optionIndex)
                );
                return { ...item, answer: filteredAnswers };
            }
            return item;
        });
        this.mappingQCRArr = (this.mappingQCR || []).filter(item => Object.keys(item).length > 0);

    }


    getEmployeesDemographySummary() {
        let payload = {};
        payload['quoteId'] = this.quote._id;
        payload['fileType'] = this.selectedQuoteTemplate[0].fileUploadType;
        this.quoteService.viewEmployeesSummary(payload).subscribe({
            next: summary => {
                this.employeeInfo = summary.data.entities;
            }
        })
    }


    downloadEmployeeDemographyExcel() {
        let selectedQuoteTemplate = this.selectedQuoteTemplate.filter(x => x.version == this.selectedVersion)
        this.quoteService.downloadQuoteEmployeeDemographyExcel(this.quote?._id, selectedQuoteTemplate[0].fileUploadType).subscribe({
            next: (response: any) => this.appService.downloadSampleExcel(response),
            error: e => {
                console.log(e)
            }
        })
    }

    createQuoteOptionQCRVersioning(insurerQuoteOptionId) {
        this.quoteService.revisedQuote(insurerQuoteOptionId, this.quote._id).subscribe({
            next: response => {
                this.router.navigateByUrl(`/backend/quotes`)
            }
        });
    }


    getAnswer(coveritemQuetions) {
        //console.log(coveritemQuetions)
        let text = ""
        if (coveritemQuetions.inputControl == 'dropdown') {
            let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
            if (ans != undefined) {
                return ans.answer == '' ? '--' : ans.answer
            }
            else {
                return '--'
            }
        } else if (coveritemQuetions.inputControl == 'multiselectdropdown') {
            if (coveritemQuetions.selectedAnswer != 0) {

                if (Array.isArray(coveritemQuetions.selectedAnswer)) {
                    const answersString = coveritemQuetions.selectedAnswer
                        .map((item) => item.answer) // Extract `answer` property
                        .filter((answer) => answer) // Remove undefined or empty values
                        .join(", "); // Join with commas
                    console.log("selectedAnswer is an array");
                    return answersString;
                } else {
                    console.log("selectedAnswer is not an array");
                    return "-"
                }


            }
            else {
                return "-"
            }



        }
        else {
            return coveritemQuetions.selectedAnswer == '' || coveritemQuetions.selectedAnswer.length == 0 ? '--' : coveritemQuetions.selectedAnswer
        }
    }

    getBrokerSubTab(temp) {
        return temp.gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0].gmcSubTab;
    }

    getICSubTab(temp, opt) {
        return opt.optionsLst.filter(x => x.optionIndex == temp.optionIndex)[0].gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0].gmcSubTab;
    }
    // ---------------------------------------------------------------


    // ----------------------------------------------------------

    loadTabs(product: IProduct): MenuItem[] {
        switch (product.productTemplate) {
            case AllowedProductTemplate.BLUS:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Risk Inspection Status & Claim Experience", id: "risk_inspection_status_and_claim_experience" },
                    { label: "Add-ons", id: "add_ons" },
                    { label: "Other Details", id: "other_details" },
                ]

            case AllowedProductTemplate.FIRE:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Add-ons", id: "add_ons" },
                    { label: "Other Details", id: "other_details" },
                ]
            case AllowedProductTemplate.IAR:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Add-ons", id: "add_ons" },
                    { label: "Other Details", id: "other_details" },
                ]
            case AllowedProductTemplate.MARINE:
                return [
                    { label: "Client Details", id: "client_details" },
                    { label: "Sum Insured Details", id: "sum_insured_details" },
                    { label: "Risk Management Features", id: "risk_management_features" },
                    { label: "Add-ons", id: "add_ons" },
                    { label: "Other Details", id: "other_details" },


                ]
            case AllowedProductTemplate.WORKMENSCOMPENSATION:
                return [
                    { label: "Workmen Details", id: "wm_details" },
                    { label: "Additional Coverages", id: "additional_coverages" },
                ]
            case AllowedProductTemplate.GMC:
                if (this.quote.quoteType != 'new') {
                    return [
                        { label: "Basic Details", id: "basic_details" },
                        { label: "Employee Demographic Details", id: "employee_details" },
                        { label: "Family Composition", id: "family_composition" },
                        { label: "Standard Coverages", id: "coverages" },
                        { label: "Enhanched Covers", id: "enhanched" },
                        { label: "Maternity Benifits", id: "maternity_benifits" },
                        { label: "Other Restrictions", id: "cost_containment" },
                        { label: "Claim Analytics", id: "claim_analytics" },
                        { label: "Final Rater", id: "final_rater" },
                        { label: "Other Details", id: "other_details_gmc" },
                    ]
                }
                else {
                    if (this.quote.productId["type"].toLowerCase() === "group health policy") {
                    return [
                        { label: "Basic Details", id: "basic_details" },
                        { label: "Employee Demographic Details", id: "employee_details" },
                        { label: "Family Composition", id: "family_composition" },
                        { label: "Standard Coverages", id: "coverages" },
                        { label: "Enhanched Covers", id: "enhanched" },
                        { label: "Maternity Benifits", id: "maternity_benifits" },
                        { label: "Other Restrictions", id: "cost_containment" },
                        { label: "Other Details", id: "other_details_gmc" },
                    ]}
                    else if (this.quote.productId["type"].toLowerCase() === "group health policy top up") {
                        return [
                            { label: "Basic Details", id: "basic_details" },
                            { label: "Employee Demographic Details", id: "employee_details" },
                            { label: "Family Composition", id: "family_composition" },
                            { label: "Standard Coverages", id: "coverages" },
                            { label: "Other Restrictions", id: "cost_containment" },
                            { label: "Other Details", id: "other_details_gmc" },
                        ];
                    }
                    else
                    {
                        return [
                            { label: "Basic Details", id: "basic_details" },
                            { label: "Employee Demographic Details", id: "employee_details" },
                            { label: "Family Composition", id: "family_composition" },
                            { label: "Standard Coverages", id: "coverages" },
                            { label: "Enhanched Covers", id: "enhanched" },
                            { label: "Other Details", id: "other_details_gmc" },
                        ];
                    }
                }
            case AllowedProductTemplate.LIABILITY:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    // { label: "Exclusion & Subjectivity", id: "exclusionsubjectivity" },
                    { label: "Deductibles", id: "deductibles" },
                ]
            case AllowedProductTemplate.LIABILITY_EANDO:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    { label: "Revenue Details", id: "revenue_details" },
                    { label: "Deductibles", id: "deductibles" },
                ]

            case AllowedProductTemplate.LIABILITY_CGL:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    { label: "Claim Experience & Turnover Details", id: "revenue_details" },
                ]
            case AllowedProductTemplate.LIABILITY_PRODUCT:
                return [
                    { label: "Basic Details", id: 'basic_details' },
                    { label: "Territory & Subsidiary Details", id: 'territorysubsidiary' },
                    { label: "Turnover Details", id: 'revenue_details' },
                    { label: "Deductibles & Claim Experience", id: 'deductibles' }
                ]
            case AllowedProductTemplate.LIABILITY_CYBER:
                return [
                    { label: "Basic Details", id: 'basic_details' },
                    { label: "Territory & Subsidiary Details", id: 'territorysubsidiary' },
                    { label: "Breakup Details", id: 'revenue_details' },
                    { label: "Deductibles & Claim Experience", id: 'deductibles' }
                ]
            case AllowedProductTemplate.LIABILITY_PUBLIC:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory Details", id: "territorysubsidiary" },
                    { label: "Turnover Details", id: "revenue_details" },
                ]
            case AllowedProductTemplate.LIABILITY_CRIME:
                return [
                    { label: "Basic Details", id: "basic_details" },
                    { label: "Territory & Subsidiary Details", id: "territorysubsidiary" },
                    { label: "Breakup Details", id: 'revenue_details' },
                    { label: "Deductibles & Claim Experience", id: 'deductibles' }

                ]

        }
    }



    selectTab(tab?: MenuItem) {
        console.log(tab)

        if (!tab) tab = this.tabs.find(tab => tab.id == this.selectedTabId) ?? this.tabs[0]
        this.router.navigate([], { queryParams: { tab: tab?.id } });
        this.selectedTabId = tab?.id
        this.mapping = []

        // this.mapping.push(Object.assign({
        //     'labels': { type: 'string', value: "" },
        //     [this.quote._id]: { type: 'button', buttonClassName: "btn btn-primary p-0 px-2", onClick: () => this.openQuoteSlip(), value: 'View Quote' },
        // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
        //     return ({
        //         [quote._id]: {
        //             type: 'buttons', buttons: [
        //                 { onClick: () => this.openQuoteSlip(quote._id), buttonClassName: "btn btn-primary p-0 px-2", value: 'View Quote' },
        //                 { onClick: () => this.generatePlacementSlip(quote._id), buttonClassName: "btn btn-success p-0 px-2 ml-2", value: 'Generate Placement Slip' },
        //             ]
        //         }
        //     })
        // })));


        // this.mapping.push(Object.assign({
        //     'labels': { type: 'string', value: "" },
        //     [this.quote._id]: { type: 'string', value: this.quote.quoteNo },
        // }, ...this.quote.insurerProcessedQuotes.map((quote) => {
        //     return ({ [quote._id]: { type: 'string', value: quote.quoteNo } })
        // })));



        switch (tab?.id) {
            case 'client_details':
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Policy" },
                    [this.quote._id]: { type: 'string', value: this.quote.productId['type'] },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.productId['type'] != quote.productId['type'] ? quote.productId['type'] : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured Name" },
                    [this.quote._id]: { type: 'string', value: this.quote.clientId['name'] },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Type of Proposal" },
                    [this.quote._id]: { type: 'string', value: this.quote.quoteType },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.quoteType != quote.quoteType ? this.quote.quoteType : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Details of Existing Insurer</strong>" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Name of Insurer" },
                    [this.quote._id]: { type: 'string', value: '' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "City of Insurer Office", },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "DO No." },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'html', value: "<strong>Current Policy Details</strong>" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Expiring Policy Period" },
                    [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Policy Period" },
                    [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Policy Range Month / Year" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Renewal Policy Period" },
                    [this.quote._id]: { type: 'string', value: this.quote.renewalPolicyPeriod },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'tickOrValue', value: this.quote.renewalPolicyPeriod != quote.renewalPolicyPeriod ? quote.renewalPolicyPeriod : null } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Insured's Business" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Risk Location/s" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Risk Description" },
                    [this.quote._id]: { type: 'string', value: '-' },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: '-' } })
                })));

                break;

            case 'sum_insured_details':

                // Get Higher Breakup Name
                let higherSumAssuredLocatioName = `${this.quote.allCoversArray?.higherSumAssuredLocation?.clientLocationId['locationName']} - ${this.quote.allCoversArray?.higherSumAssuredLocation?.pincodeId['name']}`

                let breakupKeys = []

                // Loop Over entire breakup and pushs the data to mapping

                if (this.quote.allCoversArray) {
                    Object.entries(this.quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([breakUpkey, breakup]) => {

                        // Select Value of Higher Breakup from breakup response
                        let value = Object.entries(breakup).find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]


                        this.mapping.push(Object.assign({
                            'labels': { type: 'string', value: breakUpkey.split('::>::')[2] },
                            [this.quote._id]: { type: 'currency', value: value },
                        }, ...this.quote.insurerProcessedQuotes.map((quote) => {

                            let insurerBreakupValue;

                            Object.entries(quote.allCoversArray?.quoteLocationBreakupMaster).forEach(([insurerBreakUpkey, insurerBreakup]) => {

                                if (insurerBreakUpkey == breakUpkey) {
                                    insurerBreakupValue = Object.entries(insurerBreakup).find(([locationName, value]) => locationName == higherSumAssuredLocatioName)[1]

                                    insurerBreakupValue = value ?? 0
                                }
                            })

                            return ({ [quote._id]: { type: 'currency', value: insurerBreakupValue } })
                        })));
                    })
                }


                break;

            case 'other_details':
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Deductibles/Excess" },
                    [this.quote._id]: { type: 'string', value: this.quote.deductiblesExcessPd },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.deductiblesExcessPd } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Brokerages" },
                    [this.quote._id]: { type: 'string', value: this.quote.brokerage },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.brokerage } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Quote Submission Date" },
                    [this.quote._id]: { type: 'string', value: this.quote.quoteSubmissionDate },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.quoteSubmissionDate } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Target Premium" },
                    [this.quote._id]: { type: 'string', value: this.quote.targetPremium },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.targetPremium } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Existing Broker and Brokers Involved for current year" },
                    [this.quote._id]: { type: 'string', value: this.quote.existingBrokerCurrentYear },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.existingBrokerCurrentYear } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Preferred insurer" },
                    [this.quote._id]: { type: 'string', value: this.quote.preferredInsurer },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.preferredInsurer } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Other Terms" },
                    [this.quote._id]: { type: 'string', value: this.quote.otherTerms },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.otherTerms } })
                })));
                this.mapping.push(Object.assign({
                    'labels': { type: 'string', value: "Any Additional Information" },
                    [this.quote._id]: { type: 'string', value: this.quote.additionalInfo },
                }, ...this.quote.insurerProcessedQuotes.map((quote) => {
                    return ({ [quote._id]: { type: 'string', value: quote.additionalInfo } })
                })));
                break;
            case 'basic_details':
                this.questionAnswerListToBind = []

                break;
            case 'employee_details':
                this.questionAnswerListToBind = []
                this.getEmployeesDemographySummary()
                break;
            case 'family_composition':
                this.questionAnswerListToBind = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)
                break;
            case 'coverages':
                this.questionAnswerListToBind = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COVERAGES)
                break;
            case 'enhanched':
                this.questionAnswerListToBind = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.ENHANCEDCOVERS)
                break;
            case 'maternity_benifits':
                this.questionAnswerListToBind = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.MATERNITY)
                break;
            case 'cost_containment':
                this.questionAnswerListToBind = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.COSTCONTAINMENT)
                break;
            case 'other_details_gmc':
                this.questionAnswerListToBind = this.questionAnswerList.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.OTHERDETAILS)
                break;
            case 'final_rater':
                this.questionAnswerListToBind = []
                break;
            case 'claim_analytics':
                this.questionAnswerListToBind = []
                break;
            case 'excel_export':
                //this.questionAnswerListToBind = []
                break;
        }



        // console.log(this.mapping)
    }
    // --------------------------------------------------------------



    // openQuoteSlip(quoteId) {
    //     console.log(quoteId)

    //     const quote = quoteId ? this.quote.insurerProcessedQuotes.find((quote) => quote._id == quoteId) : this.quote

    //     if (quote) {
    //         console.log(quote)

    //         const ref = this.dialogService.open(QuoteSlipDialogComponent, {
    //             header: quote.quoteNo,
    //             width: '1200px',
    //             styleClass: 'customPopup-dark',
    //             data: {
    //                 quote: quote,
    //             }
    //         })
    //     }
    // }


    openQuoteSlip() {


        if (this.quote) {
            const ref = this.dialogService.open(QuoteSlipDialogComponent, {
                header: this.quote.quoteNo,
                width: '1200px',
                styleClass: 'customPopup-dark',
                data: {
                    quote: this.quote,
                }
            })
        }
    }
    // }
    onSubmit() {
        let payload = {};
        payload['email'] = this.sendLinkForm.value.email;
        payload['quoteId'] = this.quote._id;

        this.quoteService.sendQCREmailToClient(payload).subscribe(response => {
            //@ts-ignore
            if (response.status == 'success') {
                this.messageService.add({
                    severity: "success",
                    summary: "Successful",
                    detail: `Email Send Sucessfully`,
                    life: 3000
                });
                this.sendLinkForm.reset();
            } else {
                this.messageService.add({
                    severity: "error",
                    summary: "Failed",
                    //@ts-ignore
                    detail: response.message,
                    life: 3000
                });
            }
        })
    }


    submitCoinsurerDetails(quoteId, optionId) {
        console.log("Submitting Bank Details:", optionId);
        const ref = this.dialogService.open(CoInsuranceFormDialogGmcComponent, {
            header: "Co-Insurance Details",
            styleClass: 'customPopup',
            width: '1000px',
            data: {
                quoteId: quoteId,
                optionId: optionId
            }
        })

        ref.onClose.subscribe((data) => {
        });
    }
    // pushBackTo(quoteId: string) {
    //     const payload = {};
    //     payload["pushBackFrom"] = AllowedPushbacks.QCR;
    //     payload["pushBackToState"] = AllowedQuoteStates.QCR_FROM_UNDERWRITTER;
    //     this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
    //         this.router.navigateByUrl('/backend/quotes')
    //     })
    // }

    pushBackTo() {
        const payload = {};
        payload["pushBackFrom"] = AllowedPushbacks.QCR;
        payload["pushBackToState"] = AllowedQuoteStates.QCR_FROM_UNDERWRITTER;
        this.quoteService.pushBackTo(this.quote._id, payload).subscribe((res) => {
            this.router.navigateByUrl('/backend/quotes')
        })
    }


    submitBankDetails(quoteId, optionId) {
        console.log("Submitting Bank Details:", optionId);

        if (optionId) {
            const ref = this.dialogService.open(PaymentDetailGmcComponent, {
                header: "Payment Details",
                width: '1200px',
                styleClass: 'customPopup-dark',
                data: {
                    optionId: optionId,
                    quoteId: quoteId
                }
            }
            )
            ref.onClose.subscribe({
                next: () => {
                    this.quoteService.get(`${this.id}`, { allCovers: true, qcr: true }).subscribe({
                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                            this.quoteService.setQuote(dto.data.entity)
                            this.quoteService.getAllQuoteOptions(this.quote._id).subscribe({
                                next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                                    this.quoteGmcOptionsLst = dto.data.entity;
                                    this.loadOptionsData(dto.data.entity) //.map(entity => ({ label: entity.optionName, value: entity._id })))
                                    this.loadSelectedOption(dto.data.entity[0])
        
                                },
                                error: e => {
                                    console.log(e);
                                }
                            });
                            //this.loadData(this.quote)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
            })
        }
    }

    generatePlacementSlip(quoteId, optionId) {

        const quote = this.quote.insurerProcessedQuotes.find((quote) => quote._id == quoteId)

        if (quote) {
            //this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}`)
            this.templateService.updateQuotePlacedOption(quoteId, optionId).subscribe({
                next: partner => {
                    console.log("ttest");
                    this.quoteService.getAllQuoteOptions(quoteId).subscribe({
                        next: (dto: IOneResponseDto<IQuoteGmcTemplate[]>) => {
                            this.quoteGmcOptionsLst = dto.data.entity;
                            this.loadOptionsData(this.quoteGmcOptionsLst);
                            let selectedOption = this.quoteGmcOptionsLst.filter(x => x._id == optionId)[0]
                            this.loadSelectedOption(selectedOption);

                            this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}`)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                    //    this.router.navigateByUrl(`/backend/quotes/${this.quote._id}/placement-slip-review/${quote._id}`)
                },
                error: error => {
                    console.log(error);
                }
            });


        }
    }



    // openDropDown(){
    //     this.openDropDownClaimExpireance = true;
    //     this.isCloseErrow = true;
    //     this.isOpenErrow= false;
    // }
    // closeDropDown(){
    //     this.openDropDownClaimExpireance = false;
    //     this.isCloseErrow = false;
    //     this.isOpenErrow= true;

    // }

}
