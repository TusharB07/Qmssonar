import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ConfirmationService, ConfirmEventType, LazyLoadEvent, MessageService } from "primeng/api";
import { FormMode, ILov, IOneResponseDto } from "src/app/app.model";
import {
  AllowedGMCPARENTabsTypes,
  GMCAnswers,
  GMCLabelForSubTab,
  GMCQuestionAnswers,
  GMCSubTab,
  GMCTemplate,
  IGMCSubTab,
  IGMCTemplate,
  OPTIONS_GMC_DATA_TYPE,
  OPTIONS_GMC_INPUT_CONTROL_SET,
  OPTIONS_GMC_PARENT_TABS
} from "../gmc-master-model";
import { GmcMasterService } from "../gmc-master.service";
import { IGMCLableValuev } from "../gmc-master.model";
import { AccountService } from "src/app/features/account/account.service";
import { IUser } from "../../user/user.model";
import { PartnerService } from "../../partner/partner.service";
import { AllowedPartnerTypes, IPartner } from "../../partner/partner.model";
import { ProductService } from '../../product/product.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AllowedProductTemplate, IProduct } from "../../product/product.model";


const DEFAULT_RECORD_FILTER = {
  first: 0,
  rows: 200,
  sortField: "",
  sortOrder: 1,
  multiSortMeta: [],
  filters: {}
};

@Component({
  selector: "app-gmc-master-form",
  templateUrl: "./gmc-master-form.component.html",
  styleUrls: ["./gmc-master-form.component.scss"]
})
export class GmcMasterFormComponent implements OnInit {
  @ViewChild("recordForm", { static: false })
  form: NgForm;
  id: string;
  mode: FormMode = "new";
  submitted: boolean = false;

  recordSingularName = "Template Master";
  recordPluralName = "Template Masters";
  modulePath: string = "/backend/admin/gmcmaster";
  optionsGMCParentTab: IGMCLableValuev[] = [];
  optionsinputControlsSet: IGMCLableValuev[] = [];
  optionsDataType: IGMCLableValuev[] = [];

  gmcTemplate: IGMCTemplate = new GMCTemplate();
  gmcTemplateLst: IGMCTemplate[];

  gmcSubTab: GMCSubTab = new GMCSubTab();
  gmcSubTabAll: GMCSubTab[] = [];
  gmcLabelForSubTab: GMCLabelForSubTab = new GMCLabelForSubTab();
  gmcLabelForSubTabAll: GMCLabelForSubTab[] = [];
  gmcQuestionAnswers: GMCQuestionAnswers = new GMCQuestionAnswers();
  gmcQuestionAnswersAll: GMCQuestionAnswers[] = [];
  gmcAnswerData: GMCAnswers = new GMCAnswers();
  gmcAnswerSet: GMCAnswers[] = [];

  optionsPratnerId: ILov[] = [];
  optionsProducts: ILov[] = [];

  //Contol names
  gmcParentTabName: string = "";
  gmcIsAllowOverwrite: boolean = true;
  gmcPreviosParentTabName: string = "";
  gmcSelectedParentTabName = "";
  gmcSubTabAdded: string = "";
  gmcSelectedSubTab: number = 0;
  gmcSubTabLabel: string = "";
  gmcSubTabNameLabel: number = 0;
  gmcSubTabLabelQuestion: string = "";
  gmcFreeText: boolean = true;
  gmcFreeTextValue: string = "";
  gmcIsInRenewal: boolean = false;
  gmcInputControlsSet: string = "";
  gmcParentQuestion: number = 0;
  isShowInList: boolean = true;
  gmcAnswer: string = "";
  premiumPercentage: number = 0;
  isPositive = true;
  isDefaultAnswer = false;
  gmcInputControlsSelection: number = 0;

  isSubTabActive: boolean = true;
  isLabelActive: boolean = true;
  isQuestionActive: boolean = true;
  isQuestionRequired: boolean = false;
  isAnswerActive: boolean = true;
  ansDataType: string = ""

  isParentTabSelected: boolean = false;
  issubTabSelected: boolean = false;
  issubTabLabelSelected: boolean = false;
  //currentUserPartnerId: string = ""
  user: IUser
  tempPartnerId: string = "";
  tempProductId: string = "";
  partnerId: string = "";
  productId: string = "";
  record: any
  partnerType: string = ""
  constructor(private accountService: AccountService, private confirmationService: ConfirmationService, private productService: ProductService,
    private partnerService: PartnerService, private router: Router,
    private messageService: MessageService, private gmcMasterService: GmcMasterService, private route: ActivatedRoute) {
    this.accountService.currentUser$.subscribe({
      next: user => {
        this.user = user;
        this.partnerType = this.user.partnerId['partnerType']
        //his.currentUserPartnerId = this.user.partnerId['_id'];
      }
    });

    this.optionsGMCParentTab = OPTIONS_GMC_PARENT_TABS;
    this.optionsinputControlsSet = OPTIONS_GMC_INPUT_CONTROL_SET;
    this.optionsDataType = OPTIONS_GMC_DATA_TYPE;
  }

  ngOnInit(): void {
    try {
      // this.gmcMasterService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      //   next: records => {
      //     console.log(records);
      //     this.gmcTemplateLst = records.data.entities;
      //     // this.createForm(records.data.entities[0]);
      //     if (this.gmcTemplateLst.length > 0) {
      //       this.gmcTemplate = this.gmcTemplateLst.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0];
      //       if (this.gmcTemplate != null && this.gmcTemplate != undefined) {
      //         this.gmcParentTabName = this.gmcTemplate.parentTabName;
      //         this.gmcSubTabAll = this.gmcTemplate.gmcSubTab;
      //         this.isParentTabSelected = true;
      //       }
      //     } else {
      //       this.gmcParentTabName = AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION;
      //       this.gmcSubTabAll = [];
      //       this.isParentTabSelected = true;
      //     }
      //   },
      //   error: e => {
      //     console.log(e);
      //   }
      // });
      this.id = this.route.snapshot.paramMap.get("id");

      // mode: Edit
      if (this.id !== "new") {
        this.mode = "edit";

        this.getData()


      } else {
        this.GetOptionsPartnerId()
        this.GetOptionsProducts()
      }


    } catch (error) {
      console.log("Error in GMC Form ngOnInit: " + error);
    }
  }


  getData() {
    this.gmcMasterService.get(this.id).subscribe({
      next: (dto: IOneResponseDto<IGMCTemplate>) => {
        this.record = dto.data.entity
        this.tempPartnerId = this.record.partnerId
        this.tempProductId = this.record.productId
        this.GetOptionsPartnerId()
        this.GetOptionsProducts()

        this.gmcMasterService.getPartnerwise(this.tempPartnerId, this.tempProductId).subscribe({
          next: records => {
            console.log(records);
            this.gmcTemplateLst = records.data.entities;
            // this.createForm(records.data.entities[0]);

            if (this.gmcTemplateLst.length > 0) {
              const parentTabNames = [...new Set(this.gmcTemplateLst.map(x => x.parentTabName))];
              if (this.partnerType != "self") {
                this.optionsGMCParentTab = this.optionsGMCParentTab.filter(option => parentTabNames.includes(option.label.toString()));
              }
              this.gmcTemplate = this.gmcTemplateLst.filter(x => x.parentTabName == AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION)[0];
              if (this.gmcTemplate != null && this.gmcTemplate != undefined) {
                this.gmcParentTabName = this.gmcTemplate.parentTabName;
                this.gmcSubTabAll = this.gmcTemplate.gmcSubTab;
                this.isParentTabSelected = true;
              }
            } else {
              this.gmcParentTabName = AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION;
              this.gmcSubTabAll = [];
              this.isParentTabSelected = true;
            }
          },
          error: e => {
            console.log(e);
          }
        });
      },
      error: e => {
        console.log(e);
      }
    });
  }


  confirmDelete(id: string, parentTabName: string): void {
    this.confirmationService.confirm({
      message: `Do you want to delete the parent tab "${parentTabName}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteParentTab(id, parentTabName);
      },
    });
  }

  deleteParentTab(id: string, parentTabName: string): void {
    // Implement delete logic here
    console.log('Deleted Parent Tab with ID:', id);
    this.gmcTemplateLst = this.gmcTemplateLst.filter((item) => item._id !== id);
    this.gmcMasterService.delete(id).subscribe({
      next: partner => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Parent Tab "${parentTabName}" has been deleted successfully.`,
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }

  // Method to add a new answer row
  addNewAnswer() {
    const newAnswer: GMCAnswers = {
      answer: '',
      isSelected: false,
      isActive: true,
      weightage: 1,
      premiumPercentage: 0,
      isPositive: false,
      isDefaultAnswer: false,
      showAnsinList: false,
      ansDataType: '',
      order: 1
    };
    this.gmcAnswerSet = [...this.gmcAnswerSet, newAnswer];
  }

  // Add Answer to the current GMCQuestionAnswers
  addAnswerInternal(gmcQuestionAnswersValue: GMCQuestionAnswers): void {
    const newAnswer: GMCAnswers = {
      _id: 0,
      answer: '',
      isActive: true,
      ansDataType: '',
      isPositive: false,
      isDefaultAnswer: false,
      isSelected: false,
      weightage: 1,
      premiumPercentage: 0,
      showAnsinList: false,
      order: 0
    };
    newAnswer.order = gmcQuestionAnswersValue.answer.length + 1;
    newAnswer._id = gmcQuestionAnswersValue.answer.length + 1;
    gmcQuestionAnswersValue.answer.push(newAnswer); // Add new answer to the answers array
  }

  // Method to remove a specific answer from a question's 'answer' array
  removeAnswerInternal(gmcAnswerValue: GMCAnswers, gmcQuestionAnswersValue: GMCQuestionAnswers): void {
    const index = gmcQuestionAnswersValue.answer.indexOf(gmcAnswerValue); // Find the index of the answer to remove

    if (index !== -1) {
      gmcQuestionAnswersValue.answer.splice(index, 1); // Remove the answer at the found index
    }
  }
  saveRecord() {
    try {
      this.gmcTemplate.parentTabName = this.gmcParentTabName;
      this.gmcTemplate.isAllowOverwrite = this.gmcIsAllowOverwrite;
      this.gmcTemplate.gmcSubTab = this.gmcSubTabAll;
      if (this.gmcTemplate._id == undefined) {
        //API call
        this.gmcTemplate.partnerId = this.partnerId
        this.gmcTemplate.productId = this.productId
        this.gmcTemplate._id = null;
        this.gmcMasterService.create(this.gmcTemplate).subscribe({
          next: partner => {
            this.gmcMasterService.getPartnerwise(this.partnerId, this.productId).subscribe({
              next: records => {
                this.gmcTemplateLst = records.data.entities;
                if (this.gmcTemplateLst.length > 0) {
                  this.gmcTemplate = this.gmcTemplateLst.filter(x => x.parentTabName == this.gmcSelectedParentTabName)[0];
                  if (this.gmcTemplate != null && this.gmcTemplate != undefined) {
                    this.gmcParentTabName = this.gmcTemplate.parentTabName;
                    this.gmcSubTabAll = this.gmcTemplate.gmcSubTab;
                    this.isParentTabSelected = true;
                  }
                } else {
                  this.gmcParentTabName = AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION;
                  this.gmcSubTabAll = [];
                  this.isParentTabSelected = true;
                }
                //this.getData();
              },
              error: e => {
                console.log(e);
              }
            });
          },
          error: error => {
            console.log(error);
          }
        });
      } else {
        //API call
        this.gmcMasterService.update(this.gmcTemplate._id, this.gmcTemplate).subscribe({
          next: partner => {
            this.gmcMasterService.getPartnerwise(this.partnerId, this.productId).subscribe({
              next: records => {
                this.gmcTemplateLst = records.data.entities;
                if (this.gmcTemplateLst.length > 0) {
                  this.gmcTemplate = this.gmcTemplateLst.filter(x => x.parentTabName == this.gmcSelectedParentTabName)[0];
                  if (this.gmcTemplate != null && this.gmcTemplate != undefined) {
                    this.gmcParentTabName = this.gmcTemplate.parentTabName;
                    this.gmcSubTabAll = this.gmcTemplate.gmcSubTab;
                    this.isParentTabSelected = true;
                  }
                } else {
                  this.gmcParentTabName = AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION;
                  this.gmcSubTabAll = [];
                  this.isParentTabSelected = true;
                }
              },
              error: e => {
                console.log(e);
              }
            });
            //this.getData();
          },
          error: error => {
            console.log(error);
          }
        });
      }
      this.gmcIsAllowOverwrite = true;
    } catch (error) {
      console.log("Error in GMC Form saveRecord: " + error);
    }
  }

  onParentTabChange(name) {
    try {
      this.showConfirm();
      //call changed tab values and set them
    } catch (error) {
      console.log("Error in GMC Form onParentTabChange: " + error);
    }
  }

  GetOptionsProducts() {

    this.productService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: data => {
        const prodductRecords = data.data.entities.filter(p => p.productTemplate == AllowedProductTemplate.GMC)
        this.optionsProducts = prodductRecords.map(entity => ({ label: entity.type, value: entity._id }));
        if (this.mode == "edit") {
          let data = this.optionsProducts.find(x => x.value == this.tempProductId);
          this.productId = data.value
        }
      },
      error: e => { }
    });
  }

  GetOptionsPartnerId() {


    this.partnerService.getMany(DEFAULT_RECORD_FILTER).subscribe({
      next: data => {

        this.optionsPratnerId = data.data.entities.map(entity => ({ label: entity.name, value: entity._id, partnerType: entity.partnerType }));
        //this.optionsPratnerId = this.optionsPratnerId.filter(item => item.partnerType == AllowedPartnerTypes.self)
        if (this.mode == "edit") {
          let data = this.optionsPratnerId.find(x => x.value == this.tempPartnerId);
          this.partnerId = data.value
          this.partnerType = data.partnerType
        }
        else {
          this.optionsPratnerId = this.optionsPratnerId.filter(item => item.partnerType == AllowedPartnerTypes.self)
        }
      },
      error: e => { }
    });
  }

  addSubTab() {
    try {
      if (this.gmcSubTabAdded.trim() === "") {
        this.showMessages("error", "Error", "Please enter GMC Sub Tab name and try again.");
        return;
      }
      this.gmcSubTab = new GMCSubTab();
      var id: number = 1;
      if (this.gmcSubTabAll != null) {
        if (this.gmcSubTabAll != undefined) {
          if (this.gmcSubTabAll.length > 0) {
            id = 1 + Math.max(...this.gmcSubTabAll.map(o => o._id));
          } else {
            this.gmcSubTabAll = [];
          }
        } else {
          this.gmcSubTabAll = [];
        }
      } else {
        this.gmcSubTabAll = [];
      }

      this.gmcSubTab._id = id;
      this.gmcSubTab.subTabName = this.gmcSubTabAdded;
      this.gmcSubTab.isActive = this.isSubTabActive;
      this.gmcSubTabAll.push(this.gmcSubTab);
      this.gmcSubTabAll = [...this.gmcSubTabAll];
      this.gmcSubTabAdded = "";
      this.isSubTabActive = true;
      this.gmcSelectedSubTab = 0;
    } catch (error) {
      console.log("Error in GMC Form addSubTab: " + error);
    }
  }

  onSubTabChange() {
    try {
      this.issubTabSelected = true;
      this.clearValuesByStage("gmcsubtab");
    } catch (error) {
      console.log("Error in GMC Form onSubTabChange: " + error);
    }
  }

  addSubTabLabel() {
    try {
      if (this.gmcSubTabLabel.trim() === "") {
        this.showMessages("error", "Error", "Please enter GMC Sub Tab label name and try again.");
        return;
      }
      this.gmcLabelForSubTab = new GMCLabelForSubTab();
      var id: number = 1;
      if (this.gmcLabelForSubTabAll != null) {
        if (this.gmcLabelForSubTabAll != undefined) {
          if (this.gmcLabelForSubTabAll.length > 0) {
            id = 1 + Math.max(...this.gmcLabelForSubTabAll.map(o => o._id));
          } else {
            this.gmcLabelForSubTabAll = [];
          }
        } else {
          this.gmcLabelForSubTabAll = [];
        }
      } else {
        this.gmcLabelForSubTabAll = [];
      }

      this.gmcLabelForSubTab._id = id;
      this.gmcLabelForSubTab.labelName = this.gmcSubTabLabel;
      this.gmcLabelForSubTab.isActive = this.isLabelActive;
      this.gmcLabelForSubTabAll.push(this.gmcLabelForSubTab);

      this.gmcSubTabAll.find(x => x._id === this.gmcSelectedSubTab).gmcLabelForSubTab = this.gmcLabelForSubTabAll;
      this.gmcSubTabAll = [...this.gmcSubTabAll];

      this.gmcSubTabLabel = "";
      this.isLabelActive = true;
    } catch (error) {
      console.log("Error in GMC Form addSubTabLabel: " + error);
    }
  }

  onSubTabLabelChange() {
    try {
      this.issubTabLabelSelected = true;
      this.clearValuesByStage("gmclabel");
    } catch (error) {
      console.log("Error in GMC Form onSubTabLabelChange: " + error);
    }
  }

  onInputControlChange() {
    try {
      if (this.gmcInputControlsSet == "dropdown" || this.gmcInputControlsSet == "multiselectdropdown") {
        this.gmcInputControlsSelection = 1;
      } else if (this.gmcInputControlsSet == "radiobutton") {
        this.gmcInputControlsSelection = 2;
      } else if (this.gmcInputControlsSet == "checkbox" || this.gmcInputControlsSet == "textbox") {
        this.gmcInputControlsSelection = 3;
      } else if (this.gmcInputControlsSet == "date" || this.gmcInputControlsSet == "textarea") {
        this.gmcInputControlsSelection = 4;
      }
    } catch (error) {
      console.log("Error in GMC Form onInputControlChange: " + error);
    }
  }

  addAnswer() {
    try {

      if (this.gmcSubTabLabelQuestion == "") {
        this.showMessages("error", "Error", "Please enter Coverage question.");
        return;
      }
      if (this.gmcAnswer.trim() === "" && this.gmcInputControlsSelection != 3) {
        this.showMessages("error", "Error", "Please enter answer and try again.");
        return;
      }

      this.gmcAnswerData = new GMCAnswers();

      var id: number = 1;
      if (this.gmcAnswerSet != null) {
        if (this.gmcAnswerSet != undefined) {
          if (this.gmcAnswerSet.length > 0) {
            id = 1 + Math.max(...this.gmcAnswerSet.map(o => o._id));
          } else {
            this.gmcAnswerSet = [];
          }
        } else {
          this.gmcAnswerSet = [];
        }
      } else {
        this.gmcAnswerSet = [];
      }

      this.gmcAnswerData._id = id;
      this.gmcAnswerData.answer = this.gmcAnswer;
      this.gmcAnswerData.premiumPercentage = this.premiumPercentage;
      this.gmcAnswerData.isActive = true;
      this.gmcAnswerData.isSelected = false;
      this.gmcAnswerData.weightage = 1;
      this.gmcAnswerData.isPositive = this.isPositive;
      this.gmcAnswerData.isDefaultAnswer = this.isDefaultAnswer;
      this.gmcAnswerData.ansDataType = this.ansDataType;
      this.gmcAnswerData.order = 1;
      this.gmcAnswerSet.push(this.gmcAnswerData);
      try {
        if (this.isDefaultAnswer === true) {
          this.gmcAnswerSet.map(x => {
            if (this.gmcAnswer === x.answer) {
              x.isDefaultAnswer = true;
              x.isSelected = true;
            } else {
              x.isDefaultAnswer = false;
              x.isSelected = false;
            }
          });
        }
      } catch (error) {
        console.log("Error in GMC Form onQIsDefaultAnswerCheckBoxChange: " + error);
      }
      this.gmcAnswer = "";
      this.isPositive = true;
      this.isDefaultAnswer = false;
      this.isAnswerActive = true;
    } catch (error) {
      console.log("Error in GMC Form addAnswer: " + error);
    }
  }

  addQuestion() {
    try {
      if (this.gmcSubTabLabelQuestion.trim() === "") {
        this.showMessages("error", "Error", "Please enter question and try again.");
        return;
      }
      if (this.gmcInputControlsSet.trim() === "") {
        this.showMessages("error", "Error", "Please select input control and try again.");
        return;
      }
      if (this.gmcInputControlsSet == "dropdown" && this.gmcAnswerSet.length == 0) {
        this.showMessages("error", "Error", "Please add at least one answer and try again.");
        return;
      }
      if (this.gmcInputControlsSet == "radiobutton" && this.gmcAnswerSet.length != 2) {
        this.showMessages("error", "Error", "Please add two answer and try again.");
        return;
      }
      if (this.gmcInputControlsSet == "checkbox" && this.gmcAnswerSet.length != 1) {
        this.showMessages("error", "Error", "Please add one answer and try again.");
        return;
      }
      if (this.gmcInputControlsSet == "textbox" && this.gmcAnswerSet.length != 1) {
        this.showMessages("error", "Error", "Please add one answer and try again.");
        return;
      }

      this.gmcQuestionAnswers = new GMCQuestionAnswers();

      var id: number = 1;
      if (this.gmcQuestionAnswersAll != null) {
        if (this.gmcQuestionAnswersAll != undefined) {
          if (this.gmcQuestionAnswersAll.length > 0) {
            id = 1 + this.gmcQuestionAnswersAll.length;
          } else {
            this.gmcQuestionAnswersAll = [];
          }
        } else {
          this.gmcQuestionAnswersAll = [];
        }
      } else {
        this.gmcQuestionAnswersAll = [];
      }

      this.gmcQuestionAnswers._id = id;
      this.gmcQuestionAnswers.isActive = true;
      this.gmcQuestionAnswers.weightage = 23;
      this.gmcQuestionAnswers.question = this.gmcSubTabLabelQuestion;
      this.gmcQuestionAnswers.freeText = this.gmcFreeText;
      this.gmcQuestionAnswers.freeTextValue = this.gmcFreeTextValue;
      this.gmcQuestionAnswers.isInRenewal = this.gmcIsInRenewal;
      this.gmcQuestionAnswers.inputControl = this.gmcInputControlsSet;
      if (this.gmcParentQuestion != 0) {
        this.gmcQuestionAnswers.parentQuestionId = this.gmcParentQuestion;
        try {
          var txtQuestion = this.gmcQuestionAnswersAll.find(x => x._id == this.gmcParentQuestion).question;
          this.gmcQuestionAnswers.parentQuestionText = txtQuestion;
        } catch (error) {
          this.gmcQuestionAnswers.parentQuestionText = "";
        }
      } else {
        this.gmcQuestionAnswers.parentQuestionId = 0;
        this.gmcQuestionAnswers.parentQuestionText = "";
      }
      this.gmcQuestionAnswers.answer = this.gmcAnswerSet;
      if (this.gmcAnswerSet.filter(x => x.isDefaultAnswer == true).length > 0) {
        this.gmcQuestionAnswers.selectedAnswer = this.gmcAnswerSet.filter(x => x.isDefaultAnswer == true)[0]._id //new GMCAnswers();
      }
      else {
        this.gmcQuestionAnswers.selectedAnswer = 0
      }
      this.gmcQuestionAnswers.isActive = this.isQuestionActive;
      this.gmcQuestionAnswers.isShowInList = this.isShowInList;
      this.gmcQuestionAnswers.isQuestionRequired = this.isQuestionRequired

      this.gmcQuestionAnswersAll.push(this.gmcQuestionAnswers);
      this.gmcLabelForSubTabAll.find(x => x.labelName === this.gmcLabelForSubTabAll.find(y => y._id == this.gmcSubTabNameLabel).labelName).gmcQuestionAnswers =
        this.gmcQuestionAnswersAll;
      this.gmcLabelForSubTabAll = [...this.gmcLabelForSubTabAll];

      this.gmcSubTabAll.find(x => x._id == this.gmcSelectedSubTab).gmcLabelForSubTab = this.gmcLabelForSubTabAll;
      this.gmcSubTabAll = [...this.gmcSubTabAll];

      this.gmcSubTabLabelQuestion = "";
      this.gmcFreeText = true;
      this.gmcIsInRenewal = false;
      this.isQuestionActive = true;
      this.isQuestionRequired = false;
      this.gmcInputControlsSet = "";
      this.gmcParentQuestion = 0;
      this.gmcInputControlsSelection = 0;
      this.gmcAnswerSet = [];
      this.isShowInList = true;
    } catch (error) {
      console.log("Error in GMC Form addQuestion: " + error);
    }
  }

  removeSubTab(subTab, id) {
    try {
      const index: number = this.gmcSubTabAll.indexOf(subTab);
      if (index !== -1) {
        if (id === this.gmcSubTabNameLabel) {
          this.issubTabSelected = false;
          this.gmcSelectedSubTab = 0;
        }
        try {
          this.gmcSubTabAll.find(x => x._id === id).gmcLabelForSubTab = [];
        } catch (error) { }

        this.gmcSubTabAll = [...this.gmcSubTabAll];
        this.gmcSubTabAll.splice(index, 1);
        this.gmcSubTabAll = [...this.gmcSubTabAll];
        this.clearValuesByStage("gmcsubtab");
      }
    } catch (error) {
      console.log("Error in GMC Form removeAnswer: " + error);
    }
  }

  removeLabel(label, id) {
    try {
      const index: number = this.gmcLabelForSubTabAll.indexOf(label);
      if (index !== -1) {
        if (id === this.gmcSubTabNameLabel) {
          this.issubTabLabelSelected = false;
          this.gmcSubTabNameLabel = 0;
        }
        try {
          this.gmcLabelForSubTabAll.find(x => x.labelName === this.gmcLabelForSubTabAll.find(y => y._id == id).labelName).gmcQuestionAnswers = [];
        } catch (error) { }

        this.gmcLabelForSubTabAll = [...this.gmcLabelForSubTabAll];
        this.gmcLabelForSubTabAll.splice(index, 1);
        this.gmcSubTabAll.find(x => x._id === this.gmcSelectedSubTab).gmcLabelForSubTab = this.gmcLabelForSubTabAll;
        this.gmcSubTabAll = [...this.gmcSubTabAll];
        this.clearValuesByStage("gmclabel");
      }
    } catch (error) {
      console.log("Error in GMC Form removeAnswer: " + error);
    }
  }

  removeQuestion(question) {
    try {
      const index: number = this.gmcQuestionAnswersAll.indexOf(question);
      if (index !== -1) {
        this.gmcQuestionAnswersAll.splice(index, 1);
        this.gmcLabelForSubTabAll.find(x => x.labelName === this.gmcLabelForSubTabAll.find(y => y._id == this.gmcSubTabNameLabel).labelName).gmcQuestionAnswers =
          this.gmcQuestionAnswersAll;
        this.gmcLabelForSubTabAll = [...this.gmcLabelForSubTabAll];

        this.gmcSubTabAll.find(x => x._id == this.gmcSelectedSubTab).gmcLabelForSubTab = this.gmcLabelForSubTabAll;
        this.gmcSubTabAll = [...this.gmcSubTabAll];
      }
    } catch (error) {
      console.log("Error in GMC Form removeAnswer: " + error);
    }
  }

  removeAnswer(answer) {
    try {
      const index: number = this.gmcAnswerSet.indexOf(answer);
      if (index !== -1) {
        this.gmcAnswerSet.splice(index, 1);
      }
    } catch (error) {
      console.log("Error in GMC Form removeAnswer: " + error);
    }
  }

  onSubTabCheckBoxChange() {
    try {
      this.gmcSubTabAll = [...this.gmcSubTabAll];
    } catch (error) {
      console.log("Error in GMC Form onLabelCheckBoxChange: " + error);
    }
  }

  onLabelCheckBoxChange() {
    try {
      this.gmcLabelForSubTabAll = [...this.gmcLabelForSubTabAll];
      this.gmcSubTabAll.find(x => x._id == this.gmcSelectedSubTab).gmcLabelForSubTab = this.gmcLabelForSubTabAll;
      this.gmcSubTabAll = [...this.gmcSubTabAll];
    } catch (error) {
      console.log("Error in GMC Form onLabelCheckBoxChange: " + error);
    }
  }
  setSelecetedAnswer(gmcAnswerValue, gmcAnswerSet) {

    gmcAnswerSet.answer.forEach(element => {
      if (element._id != gmcAnswerValue._id) {
        element.isDefaultAnswer = false;
      }
    });

    if (gmcAnswerValue.isDefaultAnswer) {
      gmcAnswerValue.isSelected = true;
      gmcAnswerSet.selectedAnswer = +gmcAnswerValue._id
    }
    else {
      gmcAnswerSet.selectedAnswer = 0
    }
  }
  onQuestionAndAnswerCheckBoxChange() {
    try {

      this.gmcQuestionAnswersAll = [...this.gmcQuestionAnswersAll];
      this.gmcLabelForSubTabAll = [...this.gmcLabelForSubTabAll];
      this.gmcSubTabAll.find(x => x._id == this.gmcSelectedSubTab).gmcLabelForSubTab = this.gmcLabelForSubTabAll;
      this.gmcSubTabAll = [...this.gmcSubTabAll];
    } catch (error) {
      console.log("Error in GMC Form onAnswerCheckBoxChange: " + error);
    }
  }

  clearValuesByStage(stage) {
    try {
      if (stage == "gmctab") {
        this.gmcLabelForSubTabAll = [];
        this.gmcSubTabNameLabel = 0;
        this.gmcQuestionAnswersAll = [];
        this.gmcSubTabLabelQuestion = "";
        this.gmcFreeText = true;
        this.gmcIsInRenewal = false;
        this.isQuestionActive = true;
        this.isQuestionRequired = false;
        this.gmcInputControlsSet = "";
        this.gmcParentQuestion = 0;
        this.gmcAnswer = "";
        this.isPositive = true;
        this.isDefaultAnswer = false;
        this.isAnswerActive = true;
        this.gmcInputControlsSelection = 0;
        this.gmcAnswerSet = [];
        this.issubTabLabelSelected = false;
        this.gmcSubTabAll = [];
        this.issubTabSelected = false;
        this.isShowInList = true;
        this.gmcIsAllowOverwrite = true;
      } else if (stage == "gmcsubtab") {
        this.gmcSubTabNameLabel = 0;
        this.gmcQuestionAnswersAll = [];
        this.gmcSubTabLabelQuestion = "";
        this.gmcFreeText = true;
        this.gmcIsInRenewal = false;
        this.isQuestionActive = true;
        this.isQuestionRequired = false;
        this.gmcInputControlsSet = "";
        this.gmcParentQuestion = 0;
        this.gmcAnswer = "";
        this.isPositive = true;
        this.isDefaultAnswer = false;
        this.isAnswerActive = true;
        this.gmcInputControlsSelection = 0;
        this.gmcAnswerSet = [];
        this.issubTabLabelSelected = false;
        this.isShowInList = true;
        try {
          this.gmcLabelForSubTabAll = this.gmcSubTabAll.find(x => x._id == this.gmcSelectedSubTab).gmcLabelForSubTab;
        } catch (error) {
          this.gmcLabelForSubTabAll = [];
        }
        if (this.gmcLabelForSubTabAll == undefined) {
          this.gmcLabelForSubTabAll = [];
        }
        this.gmcLabelForSubTabAll = [...this.gmcLabelForSubTabAll];
      } else if (stage == "gmclabel") {
        this.gmcSubTabLabelQuestion = "";
        this.gmcFreeText = true;
        this.gmcIsInRenewal = false;
        this.isQuestionActive = true;
        this.isQuestionRequired = false;
        this.gmcInputControlsSet = "";
        this.gmcParentQuestion = 0;
        this.gmcAnswer = "";
        this.isPositive = true;
        this.isDefaultAnswer = false;
        this.isAnswerActive = true;
        this.gmcInputControlsSelection = 0;
        this.isShowInList = true;
        this.gmcAnswerSet = [];
        try {
          this.gmcQuestionAnswersAll = this.gmcLabelForSubTabAll.find(
            x => x.labelName === this.gmcLabelForSubTabAll.find(y => y._id == this.gmcSubTabNameLabel).labelName
          ).gmcQuestionAnswers;
        } catch (error) {
          this.gmcQuestionAnswersAll = [];
        }
        if (this.gmcQuestionAnswersAll == undefined) {
          this.gmcQuestionAnswersAll = [];
        }
        this.gmcQuestionAnswersAll = [...this.gmcQuestionAnswersAll];
        this.gmcLabelForSubTabAll = [...this.gmcLabelForSubTabAll];
      }
    } catch (error) {
      console.log("Error in GMC Form clearValuesByStage: " + error);
    }
  }

  showMessages(severityInfo, summaryInfo, detailInfo) {
    this.messageService.add({ severity: severityInfo, summary: summaryInfo, detail: detailInfo });
  }

  showConfirm() {
    if (this.gmcSubTabAll.length > 0) {
      this.confirmationService.confirm({
        message: "This will delete unsaved data if any.",
        header: "Are you sure that you want to proceed?",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.showMessages("info", "Confirmed", "GMC Parent Tab changed.");
          this.isParentTabSelected = true;
          // do the changes that clear everthing and start new
          this.clearValuesByStage("gmctab");
          this.gmcPreviosParentTabName = this.gmcParentTabName;
          this.gmcSelectedParentTabName = this.optionsGMCParentTab.find(x => x.value == this.gmcParentTabName).label;

          if (this.gmcTemplateLst.length > 0) {
            this.gmcTemplate = this.gmcTemplateLst.filter(x => x.parentTabName == this.gmcSelectedParentTabName)[0];
            if (this.gmcTemplate != null && this.gmcTemplate != undefined) {
              this.gmcParentTabName = this.gmcTemplate.parentTabName;
              this.gmcSubTabAll = this.gmcTemplate.gmcSubTab;
              this.gmcSelectedSubTab = 0
              this.isParentTabSelected = true;
            } else {
              this.gmcTemplate = null;
              this.gmcTemplate = new GMCTemplate();
              this.gmcParentTabName = this.gmcSelectedParentTabName;
              this.gmcSubTabAll = [];
              this.isParentTabSelected = true;
            }
          } else {
            this.gmcTemplate = new GMCTemplate();
            this.gmcParentTabName = AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION;
            this.gmcSubTabAll = [];
            this.isParentTabSelected = true;
          }








        },
        reject: type => {
          // switch (type) {
          //     case ConfirmEventType.REJECT:
          //         this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
          //         break;
          //     case ConfirmEventType.CANCEL:
          //         this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
          //         break;
          // }
          this.gmcSubTabAll = [];
          this.gmcTemplate = new GMCTemplate();
          this.isParentTabSelected = true;
          this.gmcParentTabName = this.gmcPreviosParentTabName;
          this.gmcSelectedParentTabName = this.optionsGMCParentTab.find(x => x.value == this.gmcParentTabName).label;
          return;
        }
      });
    } else {
      this.gmcPreviosParentTabName = this.gmcParentTabName;
      this.gmcSelectedParentTabName = this.optionsGMCParentTab.find(x => x.value == this.gmcParentTabName).label;
      this.isParentTabSelected = true;
      if (this.gmcTemplateLst.length > 0) {
        this.gmcTemplate = this.gmcTemplateLst.filter(x => x.parentTabName == this.gmcSelectedParentTabName)[0];
        if (this.gmcTemplate != null && this.gmcTemplate != undefined) {
          this.gmcParentTabName = this.gmcTemplate.parentTabName;
          this.gmcSubTabAll = this.gmcTemplate.gmcSubTab;
          this.isParentTabSelected = true;
        } else {
          this.gmcTemplate = new GMCTemplate();
          this.gmcParentTabName = this.gmcSelectedParentTabName;
          this.gmcSubTabAll = [];
          this.isParentTabSelected = true;
        }
      } else {
        this.gmcTemplate = new GMCTemplate();
        this.gmcParentTabName = AllowedGMCPARENTabsTypes.FAMILYCOMPOSITION;
        this.gmcSubTabAll = [];
        this.isParentTabSelected = true;
      }
    }
  }

  onCancel() {
    this.gmcMasterService.setFilterValueExist(true);
    this.router.navigateByUrl(`${this.modulePath}`);
  }
}


