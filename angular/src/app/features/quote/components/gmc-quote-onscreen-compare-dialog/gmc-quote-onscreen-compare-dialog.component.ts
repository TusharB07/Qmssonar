import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { GMCTemplate, AllowedGMCPARENTabsTypes } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { IEmployeesDemoSummary, IQuoteGmcTemplate, IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { IcOptions, QCRQuestionAnswer, QcrHeaders, QcrAnswers, ComparasionwithBrokerModel } from '../../pages/quote-comparision-review-detailed-page-gmc/quote-comparasion-review-detailed-page.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gmc-quote-onscreen-compare-dialog',
  templateUrl: './gmc-quote-onscreen-compare-dialog.component.html',
  styleUrls: ['./gmc-quote-onscreen-compare-dialog.component.scss']
})
export class GmcQuoteOnscreenCompareDialogComponent implements OnInit {
  quote: IQuoteSlip;
  selectedQuoteTemplate: IQuoteGmcTemplate[] = []
  selectedOptions: ILov[];
  comparasionwithBrokerModel: ComparasionwithBrokerModel = new ComparasionwithBrokerModel()
  cols: MenuItem[] = []
  mainCols: MenuItem[] = []
  isCloseErrow: boolean = false;
  isOpenErrow: boolean = true;
  colSpan: number = 0
  brokerOption1: GMCTemplate = new GMCTemplate();
  icQuoteOption: GMCTemplate[] = []
  icOptionsLst: IcOptions[] = []
  questionAnswerList: QCRQuestionAnswer[] = []
  questionAnswerListTwo: QCRQuestionAnswer[] = []
  questionAnswerListToBind: QCRQuestionAnswer[] = []
  qmodel: QCRQuestionAnswer = new QCRQuestionAnswer()
  qcrHeadersLst: QcrHeaders[] = []
  qcrHeaderTwoLst: QcrHeaders[] = []
  employeeInfo: IEmployeesDemoSummary[] = [];
  qcrHeaderBasicDetailsLst: QcrHeaders[] = []
  qcrHeaderBasicDetailsTwoLst: QcrHeaders[] = []
  quoteGmcOptionsLst: IQuoteGmcTemplate[];
  showTableForExcel: boolean = false;
  constructor(public config: DynamicDialogConfig,
    public ref: DynamicDialogRef, private quoteService: QuoteService, private messageService: MessageService) {
    this.selectedOptions = this.config.data.selectedOptions;
    this.quote = this.config.data.quote;
    let selectedTemplate = this.config.data.selectedQuoteTemplate;
    console.log("this.selectedOptions---" + this.config.data.selectedOptions);
    console.log(this.selectedOptions);
    this.selectedOptions.forEach(element => {
      if (selectedTemplate.some(x => x._id == element.value)) {
        let template = selectedTemplate.filter(x => x._id == element.value)[0];
        this.selectedQuoteTemplate.push(template);
      }
    });
  }

  ngOnInit(): void {

    this.quoteService.get(`${this.quote._id}`, { allCovers: true, qcr: true }).subscribe({
      next: (dto: IOneResponseDto<IQuoteSlip>) => {
        console.log(dto.data.entity)
        this.quoteService.setQuote(dto.data.entity)
        this.loadData(dto.data.entity);
      },
      error: e => {
        console.log(e);
      }
    });

  }

  loadData(brokerQuote: IQuoteSlip) {

    // Setting the headers
    this.cols.push({ id: 'labels', style: "width:200px" })


    //Pushing Options Headings
    for (const option of this.selectedQuoteTemplate) {
      this.mainCols.push({ id: option._id, label: option.optionName, style: "width:200px" })
    }

    // Pushing the Broker Quote Header
    this.cols.push({ id: brokerQuote._id, label: brokerQuote.originalIntermediateName, style: "width:200px" })

    // Pushing  Insurer Quote Headers
    this.colSpan = +brokerQuote.insurerProcessedQuotes.length + 1;
    // for (const insurerQuote of brokerQuote.insurerProcessedQuotes) {
    //   this.cols.push({ id: insurerQuote._id, label: insurerQuote.partnerId['name'], style: "width:200px" })
    // }
    //Broker Quote
    this.comparasionwithBrokerModel.brokerData = this.selectedQuoteTemplate
    //this.brokerOption1 = this.selectedQuoteTemplate.filter(x => x.optionIndex == 1)[0].gmcTemplateData.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0];
    //Foreach option
    this.questionAnswerList = [];

    const qcrHeaders = new QcrHeaders();
    qcrHeaders.label = ""
    this.qcrHeadersLst.push(qcrHeaders);

    const qcrHeaderstwo = new QcrHeaders();
    qcrHeaderstwo.label = ""
    qcrHeaderstwo.quoteId = "";
    this.qcrHeaderTwoLst.push(qcrHeaderstwo);

    let i = 0
    brokerQuote.allCoversArray.gmcOptions.forEach(element => {
      //if (this.selectedOptions.some(x => x.label == element.optionName)) {
      // const qcrHeaderstwo = new QcrHeaders();
      // qcrHeaderstwo.label = brokerQuote.partnerId['name']
      // qcrHeaderstwo.quoteId = brokerQuote._id;
      // qcrHeaderstwo.quoteFor = "Broker"
      // this.qcrHeaderTwoLst.push(qcrHeaderstwo);
      // for (const insurerQuote of brokerQuote.insurerProcessedQuotes) {
      //   const qcrHeaderstwo = new QcrHeaders();
      //   qcrHeaderstwo.quoteId = insurerQuote._id;
      //   const options = insurerQuote.allCoversArray.gmcOptions[i];
      //   qcrHeaderstwo.label = insurerQuote.partnerId['name'] + ' [' + (options.isAccepted == 'Accept' ? 'Accepted' : 'Rejected') + ']'
      //   qcrHeaderstwo.quoteFor = "IC"
      //   qcrHeaderstwo.indicativePremium = options.indicativePremium;
      //   qcrHeaderstwo.optionId = options._id;
      //   qcrHeaderstwo.showButton = (options.isAccepted == 'Accept' ? true : false)
      //   this.qcrHeaderTwoLst.push(qcrHeaderstwo);
      //   console.log(this.qcrHeaderTwoLst);
      // };
      // i++;
      //}

    });


    let indexForQuote = 1
    //Other Tabs
    brokerQuote.allCoversArray.gmcOptions.forEach(element => {
      if (this.selectedOptions.some(x => x.label == element.optionName)) {
        let qcrHeaders = new QcrHeaders();
        qcrHeaders.label = element.optionName
        qcrHeaders.colspan = (+brokerQuote.insurerProcessedQuotes.length) + 1;
        this.qcrHeadersLst.push(qcrHeaders);
        //Optiom Index
        const optionIndex = element.optionIndex;


        const sortOrder = [
          'Basic Details',
          'Family Composition',
          'Standard Coverages',
          'Maternity Benifits',
          'Enhanced Covers',
          'Other Restrictions',
          'Other Details'
        ];

        // // Sorting the gmcTemplateData array by parentTabName according to the defined sortOrder
        // element.gmcTemplateData = element.gmcTemplateData.sort((a, b) => {
        //   const aIndex = sortOrder.indexOf(a.parentTabName);
        //   const bIndex = sortOrder.indexOf(b.parentTabName);

        //   // If aIndex or bIndex is -1 (not found in sortOrder), push those to the end
        //   if (aIndex === -1) return 1; // If a is not found in sortOrder, push it to the end
        //   if (bIndex === -1) return -1; // If b is not found in sortOrder, push it to the end

        //   return aIndex - bIndex; // Sort in the order defined in sortOrder
        // });
        // Check the condition based on product type
        if (this.quote.productId['type'].toLowerCase() === 'group health policy top up') {
          // If the product type is "group health policy top up", filter only 'Other Details'
          //element.gmcTemplateData = element.gmcTemplateData.filter(item => item.parentTabName === 'Other Details');
        } else {
          // Otherwise, sort the data based on the sortOrder array
          element.gmcTemplateData = element.gmcTemplateData.sort((a, b) => {
            const aIndex = sortOrder.indexOf(a.parentTabName);
            const bIndex = sortOrder.indexOf(b.parentTabName);

            // If aIndex or bIndex is -1 (not found in sortOrder), push those to the end
            if (aIndex === -1) return 1; // If a is not found in sortOrder, push it to the end
            if (bIndex === -1) return -1; // If b is not found in sortOrder, push it to the end

            return aIndex - bIndex; // Sort in the order defined in sortOrder
          });
        }


        element.gmcTemplateData.forEach(tempdata => {
          //Temp ID
          const tempId = tempdata._id

          if (tempdata.parentTabName === 'Other Product') {
            return;
          }
          if (tempdata.parentTabName.trim() === 'Claim Analytics' && brokerQuote.quoteType == 'new') {
            return;
          }

          tempdata.gmcSubTab.forEach(gmcsTab => {
            //Sub Tab Id        
            const subtabId = gmcsTab._id
            //Subtab Name                  
            if (indexForQuote == 1) {
              this.qmodel = new QCRQuestionAnswer();
              this.qmodel.parentTabName = tempdata.parentTabName
              this.qmodel.quoteId = element.quoteId;
              this.qmodel.question = gmcsTab.subTabName;
              this.qmodel.isHeader = true;
              this.qmodel.isSubHeader = false;
              this.qmodel.isLabel = false;
              this.qmodel.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
              this.questionAnswerList.push(this.qmodel);


              this.qmodel = new QCRQuestionAnswer();
              this.qmodel.parentTabName = tempdata.parentTabName
              this.qmodel.quoteId = element.quoteId;
              this.qmodel.question = gmcsTab.subTabName;
              this.qmodel.isHeader = false;
              this.qmodel.isSubHeader = true;
              this.qmodel.isLabel = false;
              this.qmodel.colspan = 1 + (+brokerQuote.insurerProcessedQuotes.length + 1) * this.selectedQuoteTemplate.length;
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
                  this.qmodel.parentTabName = tempdata.parentTabName
                  this.qmodel.isActive = eQues.isActive
                  //Answer Broker Ans
                  const qcrAnswers = new QcrAnswers();
                  // if (eQues.question.trim() == "Family Definition") {
                  //   const ans = element.coverageTypeName
                  //   qcrAnswers.answer.push(ans.toString());
                  // }
                  // else {
                  qcrAnswers.answer = this.getAnswer(eQues, element);
                  //}

                  qcrAnswers.icType = "Broker" + optionIndex;
                  qcrAnswers.id = questId;
                  qcrAnswers.optionIndex = optionIndex

                  if (indexForQuote == 1) {

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
                  for (const insurerQuote of brokerQuote.insurerProcessedQuotes) {
                    const options = insurerQuote.allCoversArray.gmcOptions;
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
                    }
                    else {
                      qcrAnswers.answer = this.getAnswer(gmcQuestionAnswers, insurerQuote)
                    }


                    qcrAnswers.icType = "IC" + optionIndex;
                    qcrAnswers.id = questId;
                    qcrAnswers.optionIndex = optionIndex
                    if (indexForQuote == 1) {
                      this.qmodel.answer.push(qcrAnswers);
                    }
                    else {
                      //Search in answer array and add answer
                      this.questionAnswerList.filter(x => x.isHeader == false && x.question.trim() == eQues.question.trim() && x.subtabId == subtabId && x.gmcLabelForSubTabId == gmcLabelForSubTabId && x.questId == questId && x.parentTabName == this.qmodel.parentTabName)[0].answer.push(qcrAnswers)
                      console.log("IC option")
                      // console.log(this.questionAnswerList)
                    }
                  }
                  if (indexForQuote == 1) {
                    this.questionAnswerList.push(this.qmodel);
                    console.log("IC option1")
                    //console.log(this.questionAnswerList)
                  }
                });
              }


            });
          });
          // }


          i++;

        });
        indexForQuote++
      }
    });
    this.questionAnswerList.forEach((qModel) => {
      qModel.answer.forEach((ans, index, arr) => {
        // Check if the answer is different from others
        if (index > 0) {
          if (arr.some(a => a.answer != ans.answer)) {
            ans.isChanged = true;
          }
        }
      });
    });
    // console.log(this.questionAnswerList)   
    this.questionAnswerListToBind = this.questionAnswerList;
  }

  getAnswer(coveritemQuetions, element) {
    //console.log(coveritemQuetions)
    let text = ""
    if (coveritemQuetions.inputControl == 'dropdown') {

      if (coveritemQuetions.question == "Family Demography") {
        return element.coverageTypeName;
      }
      else {
        let ans = coveritemQuetions.answer.filter(x => x._id == coveritemQuetions.selectedAnswer)[0]
        if (ans != undefined) {
          return ans.answer == '' ? '--' : ans.answer
        }
        else {
          return 'Not Selected'
        }
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
      this.exportTableToExcel("execeltbl", "GMC_ComparasionExcel.xlsx");
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
        colWidths[C] = Math.max(colWidths[C], cellValue.length);

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
        sz: 12,
        bold: styles.fontWeight === 'bold',
        color: { rgb: this.rgbToHex(styles.color) }
      },
      alignment: {
        horizontal: styles.textAlign as any,
        vertical: 'center'
      },
      border: this.getBorderStyles(styles)
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
}
