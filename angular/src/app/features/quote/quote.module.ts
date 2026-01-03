import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { QuoteRoutingModule } from './quote-routing.module';
import { SelectProductComponentComponent } from './components/quote/select-product-component/select-product-component.component';
import { SelectLocationOccupanyComponent } from './components/quote/select-location-occupany/select-location-occupany.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DropdownModule } from 'primeng/dropdown';
import { QuoteCreatePageComponent } from './pages/quote-create-page/quote-create-page.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { GlobalModule } from '../global/global.module';
import { FileUploadModule } from 'primeng/fileupload';
import { NgxCurrencyModule } from 'ngx-currency';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataViewModule } from 'primeng/dataview';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';
import { QuoteDraftPageComponent } from './pages/quote-draft-page/quote-draft-page.component';
import { QuoteRequisitionPageComponent } from './pages/quote-requisition-page/quote-requisition-page.component';
import { SidebarModule } from 'primeng/sidebar';
import { ToggleCoverOptedComponent } from './components/quote/toggle-cover-opted/toggle-cover-opted.component';
import { SumInsuredDetailsTabComponent } from './components/quote/quote-requisition-tabs/sum-insured-details-tab/sum-insured-details-tab.component';
import { IndicativeQuoteTabComponent } from './components/quote/quote-requisition-tabs/indicative-quote-tab/indicative-quote-tab.component';
import { BusinessSurakshaCoversTabComponent } from './components/quote/quote-requisition-tabs/business-suraksha-covers-tab/business-suraksha-covers-tab.component';
import { RiskInspectionStatusAndClaimExperienceTabComponent } from './components/quote/quote-requisition-tabs/risk-inspection-status-and-claim-experience-tab/risk-inspection-status-and-claim-experience-tab.component';
import { OtherDetailsTabComponent } from './components/quote/quote-requisition-tabs/other-details-tab/other-details-tab.component';
import { QuoteReviewPageComponent } from './pages/quote-review-page/quote-review-page.component';
import { StepsModule } from 'primeng/steps';
import { QuoteEditPageComponent } from './pages/quote-edit-page/quote-edit-page.component';
import { LocationWiseCoversBreakDialogComponent } from './components/quote/location-wise-covers-break-dialog/location-wise-covers-break-dialog.component';
import { QuoteCompareAndAnalyticsPageComponent } from './pages/quote-compare-and-analytics-page/quote-compare-and-analytics-page.component';
import { QuoteInsurerReviewBasicDetailsTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-basic-details-tab/quote-insurer-review-basic-details-tab.component';
import { SumInsuredDetailsComponent } from './components/quote/quote-edit-steps/sum-insured-details/sum-insured-details.component';
import { QuoteInsurerReviewMultilocationAnnexureTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-multilocation-annexure-tab/quote-insurer-review-multilocation-annexure-tab.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { QuoteInsurerReviewAddonTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-addon-tab/quote-insurer-review-addon-tab.component';
import { BusinessSurakshaCoversComponent } from './components/quote/quote-edit-steps/business-suraksha-covers/business-suraksha-covers.component';
import { QuoteEditStepsRiskInspectionClaimExperienceTabComponent } from './components/quote/quote-edit-steps/quote-edit-steps-risk-inspection-claim-experience-tab/quote-edit-steps-risk-inspection-claim-experience-tab.component';
import { QuoteInsurerReviewWarrentiesExclusionsSubjectivesTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-warrenties-exclusions-subjectives-tab/quote-insurer-review-warrenties-exclusions-subjectives-tab.component';
import { DialogModule } from 'primeng/dialog';
import { QuoteInsurerReviewDecisionMatrixTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-decision-matrix-tab/quote-insurer-review-decision-matrix-tab.component';
import { CalendarModule } from 'primeng/calendar';
import { QuoteInsurerReviewPreviewDownloadTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-preview-download-tab/quote-insurer-review-preview-download-tab.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { GapAnalysisTabComponent } from './components/quote/quote-requisition-tabs/gap-analysis-tab/gap-analysis-tab.component';
import { RiskManagementFeatureTabComponent } from './components/quote/quote-requisition-tabs/risk-management-feature-tab/risk-management-feature-tab.component';
import { FlexaCoversDialogComponent } from './components/quote/add-on-covers-dialogs/flexa-covers-dialog/flexa-covers-dialog.component';
import { SectorAvgFreeAddOnsDialogComponent } from './components/quote/add-on-covers-dialogs/sector-avg-free-add-ons-dialog/sector-avg-free-add-ons-dialog.component';
import { ConditionalFreeAddOnsDialogComponent } from './components/quote/add-on-covers-dialogs/conditional-free-add-ons-dialog/conditional-free-add-ons-dialog.component';
import { SectorAvgPaidAddOnsDialogComponent } from './components/quote/add-on-covers-dialogs/sector-avg-paid-add-ons-dialog/sector-avg-paid-add-ons-dialog.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { QuoteSentForApprovalDialogComponent } from './status_dialogs/quote-sent-for-approval-dialog/quote-sent-for-approval-dialog.component';
import { QuoteCompareConfirmationDialogComponent } from './components/quote/add-on-covers-dialogs/quote-compare-confirmation-dialog/quote-compare-confirmation-dialog.component';
import { FetchPastQuoteHistoryDialogComponent } from './components/quote/fetch-past-quote-history-dialog/fetch-past-quote-history-dialog.component';

import { ComparisonUnderWriteBApprovalDialogComponent } from './components/quote/comparison-under-write-b-approval-dialog/comparison-under-write-b-approval-dialog.component';
import { ComparisonRelfectChangesDialogComponent } from './components/quote/comparison-relfect-changes-dialog/comparison-relfect-changes-dialog.component';
import { ComparisonQuoteSlipDialogComponent } from './components/quote/comparison-quote-slip-dialog/comparison-quote-slip-dialog.component';
import { QuoteSelectBrokerForCompareDialogComponent } from './components/quote/add-on-covers-dialogs/quote-select-broker-for-compare-dialog/quote-select-broker-for-compare-dialog.component';
import { QouteSentForQcrDialogComponent } from './components/quote/qoute-sent-for-qcr-dialog/qoute-sent-for-qcr-dialog.component';
import { ConfirmationService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

import { FocusTrapModule } from 'primeng/focustrap';
import { QuoteUnderwritterReviewStatusDialogComponent } from './components/quote/quote-underwritter-review-status-dialog/quote-underwritter-review-status-dialog.component';
import { QuoteComparisionReviewPageComponent } from './pages/quote-comparision-review-page/quote-comparision-review-page.component';
import { QuoteSlipDialogComponent } from './components/quote-slip-dialog/quote-slip-dialog.component';
import { QuotePlacementPageComponent } from './pages/quote-placement-page/quote-placement-page.component';
import { UploadStepWiseExcelForQuoteComponent } from './components/upload-step-wise-excel-for-quote/upload-step-wise-excel-for-quote.component';
import { TabMenu, TabMenuModule } from 'primeng/tabmenu';
import { MenuModule } from 'primeng/menu';
import { QuotePlacementSlipReviewPageComponent } from './pages/quote-placement-slip-review-page/quote-placement-slip-review-page.component';
import { QuotePlacementSlipGeneratedDialogComponent } from './components/quote-placement-slip-generated-dialog/quote-placement-slip-generated-dialog.component';
import { QuoteSlipTemplateOneComponent } from './components/quote-slip-template-one/quote-slip-template-one.component';
import { CreateRiskLocationOccupancyDialogComponent } from '../broker/create-risk-location-occupancy-dialog/create-risk-location-occupancy-dialog.component';
import { QuoteInsurerReviewRiskManagementFeaturesTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-risk-management-features-tab/quote-insurer-review-risk-management-features-tab.component';
import { ClaimExperienceComponent } from './components/claim-experience/claim-experience.component';
import { StandardAddonsTabComponent } from './components/quote/quote-requisition-tabs/standard-addons-tab/standard-addons-tab.component';
import { LossOfRentDialogComponent } from './components/quote/standerd-addons-dialog/loss-of-rent-dialog/loss-of-rent-dialog.component';
// import { RentForAlternativeAccomodationComponent } from './components/quote/standerd-addons-dialog/rent-for-alternative-accomodation/rent-for-alternative-accomodation.component';
// import { PersonalAccidentCoverComponent } from './components/quote/standerd-addons-dialog/personal-accident-cover/personal-accident-cover.component';
import { ValuebleContentAgreedValueBasisDialogComponent } from './components/quote/standerd-addons-dialog/valueble-content-agreed-value-basis-dialog/valueble-content-agreed-value-basis-dialog.component';
import { RentForAlternativeAccomodationDialogComponent } from './components/quote/standerd-addons-dialog/rent-for-alternative-accomodation-dialog/rent-for-alternative-accomodation-dialog.component';
import { PersonalAccidentCoverDialogComponent } from './components/quote/standerd-addons-dialog/personal-accident-cover-dialog/personal-accident-cover-dialog.component';
import { IndicativeQuoteBasicCardComponent } from './components/indicative-quote-basic-card/indicative-quote-basic-card.component';
import { TotalIndicativeQuoteCoversOptedCardComponent } from './components/total-indicative-quote-covers-opted-card/total-indicative-quote-covers-opted-card.component';
import { RiskInspectionReportAndLocationPhotographsCrudCardComponent } from './components/risk-inspection-report-and-location-photographs-crud-card/risk-inspection-report-and-location-photographs-crud-card.component';
import { BscCoverCardComponent } from './components/bsc-cover-card/bsc-cover-card.component';
import { CarouselModule } from 'primeng/carousel';
import { DeclarationPolicyDialogComponent } from './components/quote/standerd-addons-dialog/declaration-policy-dialog/declaration-policy-dialog.component';
import { FloaterCoverAddonDialogComponent } from './components/quote/standerd-addons-dialog/floater-cover-addon-dialog/floater-cover-addon-dialog.component';
import { ChoosePaymentModeDialogComponent } from './components/quote/choose-payment-mode-dialog/choose-payment-mode-dialog.component';
import { ProceedWithOfflinePaymentDialogComponent } from './components/quote/proceed-with-offline-payment-dialog/proceed-with-offline-payment-dialog.component';
import { RiskInspectionCardComponent } from './components/risk-inspection-card/risk-inspection-card.component';
import { RiskCoverLetterDialogComponent } from './components/risk-cover-letter-dialog/risk-cover-letter-dialog.component';
import { PaymentCompletedSuccessfullyDialogComponent } from './components/payment-completed-successfully-dialog/payment-completed-successfully-dialog.component';
import { QuoteSlipPdfPreviewComponent } from './components/quote-slip-pdf-preview/quote-slip-pdf-preview.component';
import { RiskManagementFeaturesCardComponent } from './components/risk-management-features-card/risk-management-features-card.component';
import { QuoteLocationBreakupComponent } from './components/quote-location-breakup/quote-location-breakup.component';
import { ConfigureDiscountDialogeComponent } from './components/configure-discount-dialoge/configure-discount-dialoge.component';
import { SliderModule } from 'primeng/slider';
import { ChooseVerificationModeDialogComponent } from './components/choose-verification-mode-dialog/choose-verification-mode-dialog.component';
import { ChooseVerifierOtpDialogComponent } from './components/choose-verifier-otp-dialog/choose-verifier-otp-dialog.component';
import { EnterVerifierOtpDialogComponent } from './components/enter-verifier-otp-dialog/enter-verifier-otp-dialog.component';
import { ProposalVerifiedDialogComponent } from './components/proposal-verified-dialog/proposal-verified-dialog.component';
import { UploadProposalFormDialogComponent } from './components/upload-proposal-form-dialog/upload-proposal-form-dialog.component';
import { QuoteInsurerReviewDocumentsUploadedTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-documents-uploaded-tab/quote-insurer-review-documents-uploaded-tab.component';
import { ToggleCoverOptedRadioComponent } from './components/quote/toggle-cover-opted-radio/toggle-cover-opted-radio.component';
// import { FireFloaterCoverAddonComponent } from './components/fire-floater-cover-addon-dialog/fire-floater-cover-addon-dialog.component';
// import { FireFloaterCoverAddonCardComponent } from './components/fire-floater-cover-addon-card/fire-floater-cover-addon-card.component';
// import { FireFloaterCoverAddonDialogComponent } from './components/fire-floater-cover-addon-dialog/fire-floater-cover-addon-dialog.component';
import { FireFloaterCoverAddonDialogComponent } from './components/fire-floater-cover-addon-dialog/fire-floater-cover-addon-dialog.component';
import { FireFloaterCoverAddonCardComponent } from './components/fire-floater-cover-addon-card/fire-floater-cover-addon-card.component';
import { OfflinePaymentDetailsCardComponent } from './components/offline-payment-details-card/offline-payment-details-card.component';
import { QuoteSlipSentForPlacementDialogComponent } from './components/quote-slip-sent-for-placement-dialog/quote-slip-sent-for-placement-dialog.component';
import { QuoteOfflinePaymentPageComponent } from './pages/quote-offline-payment-page/quote-offline-payment-page.component';
// import { SidSumInsuredSplitDialogComponent } from '../broker/sid-sum-insured-split-dialog/sid-sum-insured-split-dialog.component';
import { QuoteSlipTemplateForFireComponent } from './components/quote-slip-template-for-fire/quote-slip-template-for-fire.component';
import { SubTemplateBlusComponent } from './components/quote-slip-template-one/sub-template-blus/sub-template-blus.component';
import { SubTemplateFireComponent } from './components/quote-slip-template-one/sub-template-fire/sub-template-fire.component';
import { QuoteComparisonReviewDetailedPageComponent } from './pages/quote-comparison-review-detailed-page/quote-comparison-review-detailed-page.component';
import { QuoteAuditTrailDialogComponent } from './components/quote/quote-audit-trail-dialog/quote-audit-trail-dialog.component';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { PanelModule } from 'primeng/panel';
import { RemoveAllowedProductBscCoverDialogComponent } from './components/remove-allowed-product-bsc-cover-dialog/remove-allowed-product-bsc-cover-dialog.component';
import { BusinessInterruptionPropertyDemageComponent } from './components/business-interruption-property-demage/business-interruption-property-demage.component';
import { QuoteLocationBreakupDialogComponent } from './components/quote-location-breakup-dialog/quote-location-breakup-dialog.component';
import { SubTemplateIarComponent } from './components/quote-slip-template-one/sub-template-iar/sub-template-iar.component';
import { SumInsuredDetailsSubTemplateFireComponent } from './components/quote/quote-requisition-tabs/sum-insured-details-tab/sum-insured-details-sub-template-fire/sum-insured-details-sub-template-fire.component';
import { SumInsuredDetailsSubTemplateBlusComponent } from './components/quote/quote-requisition-tabs/sum-insured-details-tab/sum-insured-details-sub-template-blus/sum-insured-details-sub-template-blus.component';
import { SumInsuredDetailsSubTemplateIarComponent } from './components/quote/quote-requisition-tabs/sum-insured-details-tab/sum-insured-details-sub-template-iar/sum-insured-details-sub-template-iar.component';
import { QuoteViewPageComponent } from './pages/quote-view-page/quote-view-page.component';
import { SubViewTableComponent } from './pages/quote-view-page/sub-view-table/sub-view-table.component';
import { SubViewKanbanComponent } from './pages/quote-view-page/sub-view-kanban/sub-view-kanban.component';
import { BadgeModule } from 'primeng/badge';
import { IarFireLossOfProfitCrudCardComponent } from './components/iar-fire-loss-of-profit-crud-card/iar-fire-loss-of-profit-crud-card.component';
import { IarMachineryElectricalBreakdownCrudCardComponent } from './components/iar-machinery-electrical-breakdown-crud-card/iar-machinery-electrical-breakdown-crud-card.component';
import { IarMachineryLossOfProfitCrudCardComponent } from './components/iar-machinery-loss-of-profit-crud-card/iar-machinery-loss-of-profit-crud-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuoteInsurerReviewRiskCoverLetterTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-risk-cover-letter-tab/quote-insurer-review-risk-cover-letter-tab.component';
import { RiskCoverLetterHeaderComponent } from './components/quote/quote-edit-steps/risk-cover-letter-header/risk-cover-letter-header.component';
import { PaymentDetailsPopupComponent } from './components/quote/payment-details-popup/payment-details-popup.component';
import { IndicativeQuoteViewDetailsDialogComponent } from '../broker/indicative-quote-view-details-dialog/indicative-quote-view-details-dialog.component';
import { SelectInsurerComponent } from './components/select-insurer/select-insurer.component';
import { MachineryBreakdownDialogComponent } from './components/machinery-breakdown-dialog/machinery-breakdown-dialog.component';
import { IarIndicativeQuoteBasicCardComponent } from './components/iar-indicative-quote-basic-card/iar-indicative-quote-basic-card.component';
import { RiskManagementFeaturesDialogComponent } from './components/risk-management-features-dialog/risk-management-features-dialog.component';
import { AgentDashboardComponent } from './pages/dashboard/agent-dashboard/agent-dashboard.component';
import { BancaDashboardComponent } from './pages/dashboard/banca-dashboard/banca-dashboard.component';
import { BrokerDashboardComponent } from './pages/dashboard/broker-dashboard/broker-dashboard.component';
import { CorporateAgentDashboardComponent } from './pages/dashboard/corporate-agent-dashboard/corporate-agent-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { InsurerDashboardComponent } from './pages/dashboard/insurer-dashboard/insurer-dashboard.component';
import { SelfDashboardComponent } from './pages/dashboard/self-dashboard/self-dashboard.component';
import { ChartModule } from 'primeng/chart';
import { QuoteRequisitionSidebarComponent } from './components/quote-requisition-sidebar/quote-requisition-sidebar.component';
import { QuoteRequisitionTabsHolderComponent } from './components/quote-requisition-tabs-holder/quote-requisition-tabs-holder.component';
import { OtcProductLimitExceededConfirmationDialogComponent } from './confirmation_dialogs/otc-product-limit-exceeded-confirmation-dialog/otc-product-limit-exceeded-confirmation-dialog.component';
import { EditInsuredDetailsDialogComponent } from '../broker/edit-insured-details-dialog/edit-insured-details-dialog.component';
import { BscFireLossOfProfitFormDialogComponent } from './blus_bsc_dialogs/bsc-fire-loss-of-profit-form-dialog/bsc-fire-loss-of-profit-form-dialog.component';
import { BscAccompaniedBaggageFormDialogComponent } from './blus_bsc_dialogs/bsc-accompanied-baggage-form-dialog/bsc-accompanied-baggage-form-dialog.component';
import { BscBurglaryAndHousebreakingFormDialogComponent } from './blus_bsc_dialogs/bsc-burglary-and-housebreaking-form-dialog/bsc-burglary-and-housebreaking-form-dialog.component';
import { BscElectronicEquipmentsFormDialogComponent } from './blus_bsc_dialogs/bsc-electronic-equipments-form-dialog/bsc-electronic-equipments-form-dialog.component';
import { BscElectronicEquipmentsViewQuoteBreakupDialogComponent } from './blus_bsc_dialogs/bsc-electronic-equipments-view-quote-breakup-dialog/bsc-electronic-equipments-view-quote-breakup-dialog.component';
import { BscFidelityGuranteeFormDialogComponent } from './blus_bsc_dialogs/bsc-fidelity-gurantee-form-dialog/bsc-fidelity-gurantee-form-dialog.component';
import { BscFixedPlateGlassFormDialogComponent } from './blus_bsc_dialogs/bsc-fixed-plate-glass-form-dialog/bsc-fixed-plate-glass-form-dialog.component';
import { BscFixedPlateGlassViewQuoteBreakupDialogComponent } from './blus_bsc_dialogs/bsc-fixed-plate-glass-view-quote-breakup-dialog/bsc-fixed-plate-glass-view-quote-breakup-dialog.component';
import { BscLiabilitySectionFormDialogComponent } from './blus_bsc_dialogs/bsc-liability-section-form-dialog/bsc-liability-section-form-dialog.component';
import { BscMoneyInSafeTillFormDialogComponent } from './blus_bsc_dialogs/bsc-money-in-safe-till-form-dialog/bsc-money-in-safe-till-form-dialog.component';
import { BscMoneyInSafeTillViewQuoteBreakupDialogComponent } from './blus_bsc_dialogs/bsc-money-in-safe-till-view-quote-breakup-dialog/bsc-money-in-safe-till-view-quote-breakup-dialog.component';
import { BscMoneyInTransitFormDialogComponent } from './blus_bsc_dialogs/bsc-money-in-transit-form-dialog/bsc-money-in-transit-form-dialog.component';
import { BscPortableEquipmentsFormDialogComponent } from './blus_bsc_dialogs/bsc-portable-equipments-form-dialog/bsc-portable-equipments-form-dialog.component';
import { BscSignageFormDialogComponent } from './blus_bsc_dialogs/bsc-signage-form-dialog/bsc-signage-form-dialog.component';
import { BscBuglaryAndHousebreakingViewQuoteBreakupDialogComponent } from './blus_bsc_dialogs/bsc-buglary-and-housebreaking-view-quote-breakup-dialog/bsc-buglary-and-housebreaking-view-quote-breakup-dialog.component';
import { NonOtcQuoteSentToInsurerDialogComponent } from './status_dialogs/non-otc-quote-sent-to-insurer-dialog/non-otc-quote-sent-to-insurer-dialog.component';
import { OtcQuotePlacementSlipGeneratedDialogComponent } from './status_dialogs/otc-quote-placement-slip-generated-dialog/otc-quote-placement-slip-generated-dialog.component';
import { NonOtcQuotePlacementSlipGeneratedDialogComponent } from './status_dialogs/non-otc-quote-placement-slip-generated-dialog/non-otc-quote-placement-slip-generated-dialog.component';
import { QuoteSentToUnderwritterByRmDialogComponent } from './status_dialogs/quote-sent-to-underwritter-by-rm-dialog/quote-sent-to-underwritter-by-rm-dialog.component';
import { QuoteSentToNextUnderwriterDialogComponent } from './status_dialogs/quote-sent-to-next-underwriter-dialog/quote-sent-to-next-underwriter-dialog.component';
import { OtherDetailsCrudCardComponent } from './components/other-details-crud-card/other-details-crud-card.component';
import { HypothicationDetailsCrudCardComponent } from './components/hypothication-details-crud-card/hypothication-details-crud-card.component';
import { OtherDetailsFormComponentComponent } from './components/other-details-crud-card/other-details-form-component/other-details-form-component.component';
import { QuoteInsurerReviewPageComponent } from './pages/quote-insurer-review-page/quote-insurer-review-page.component';
import { QuoteDiscussionPageComponent } from './pages/quote-discussion-page/quote-discussion-page.component';
import { QueryDiscussionBoxComponent } from './pages/quote-discussion-page/query-discussion-box/query-discussion-box.component';
import { QuoteComparisionReviewDetailedPageGmcComponent } from './pages/quote-comparision-review-detailed-page-gmc/quote-comparision-review-detailed-page-gmc.component';
import { GmcGradedSiDialogComponent } from './components/gmc-graded-si-dialog/gmc-graded-si-dialog.component';
import { SubTemplateGmcComponent } from './components/quote-slip-template-one/sub-template-gmc/sub-template-gmc.component';
import { ClaimAnalyticsTabComponent } from './components/quote/quote-requisition-tabs/claim-analytics-tab/clam-analytics-tab.component';
import { CostContainmentTabComponent } from './components/quote/quote-requisition-tabs/cost-containment-tab/cost-containment-tab.component';
import { EmployeeDemographicTabComponent } from './components/quote/quote-requisition-tabs/employee-demographic-tab/employee-demographic-tab.component';
import { FamilyCompositionTabComponent } from './components/quote/quote-requisition-tabs/family-composition-tab/family-composition-tab.component';
import { FinalRaterTabComponent } from './components/quote/quote-requisition-tabs/final-rater-tab/final-rater-tab.component';
import { GmcCoveregesTabComponent } from './components/quote/quote-requisition-tabs/gmc-covereges-tab/gmc-covereges-tab.component';
import { GmcOtherdetailsTabComponent } from './components/quote/quote-requisition-tabs/gmc-otherdetails-tab/gmc-otherdetails-tab.component';
import { MaternityBenifitsTabComponent } from './components/quote/quote-requisition-tabs/maternity-benifits-tab/maternity-benifits-tab.component';
import { GmcCoveragesOptionsDialogComponent } from './components/gmc-coverages-options-dialog/gmc-coverages-options-dialog.component';
import { GmcEmployeeDetailsComponent } from './components/quote/quote-edit-steps/gmc-employee-details/gmc-employee-details.component';
import { GmcCostContainmentComponent } from './components/quote/quote-edit-steps/gmc-cost-containment/gmc-cost-containment.component';
import { GmcCoveragesComponent } from './components/quote/quote-edit-steps/gmc-coverages/gmc-coverages.component';
import { GmcFamilyCompositionComponent } from './components/quote/quote-edit-steps/gmc-family-composition/gmc-family-composition.component';
import { GmcFinalRaterComponent } from './components/quote/quote-edit-steps/gmc-final-rater/gmc-final-rater.component';
import { GmcMaternityBenifitsComponent } from './components/quote/quote-edit-steps/gmc-maternity-benifits/gmc-maternity-benifits.component';
import { GmcOtherDetailsComponent } from './components/quote/quote-edit-steps/gmc-other-details/gmc-other-details.component';
import { GmcDescriptionDialogComponent } from './components/gmc-description-dialog/gmc-description-dialog.component';
import { GmcBasicDetailsComponent } from './components/quote/quote-edit-steps/gmc-basic-details/gmc-basic-details.component';
import { MarineCoveragesTabComponent } from './components/quote/quote-requisition-tabs/marine-coverages-tab/marine-coverages-tab.component';
import { MarineOtherdetailsTabComponent } from './components/quote/quote-requisition-tabs/marine-otherdetails-tab/marine-otherdetails-tab.component';
import { MarineSuminsuredDetailsTabComponent } from './components/quote/quote-requisition-tabs/marine-suminsured-details-tab/marine-suminsured-details-tab.component';
import { MarineClausesDialogComponent } from './components/quote/marine-clauses-dialog/marine-clauses-dialog.component';
import { ImportDialogComponent } from './components/quote/import-dialog/import-dialog.component';
import { ExportDialogComponent } from './components/quote/export-dialog/export-dialog.component';
import { ResetPasswordPopupDialogComponent } from './components/quote/reset-password-popup-dialog/reset-password-popup-dialog.component';
import { ChangePasswordDialogComponent } from './components/quote/change-password-dialog/change-password-dialog.component';
import { PasswordModule } from "primeng/password";
import { MarineSiDetailsComponent } from './components/quote/quote-edit-steps/marine-si-details/marine-si-details.component';
import { MarineCoveragesClausesComponent } from './components/quote/quote-edit-steps/marine-coverages-clauses/marine-coverages-clauses.component';
import { SubTemplateMarineComponent } from './components/quote-slip-template-one/sub-template-marine/sub-template-marine.component';
import { ClientCKYCDialogComponent } from './components/quote/client-ckycdialog/client-ckycdialog.component';
import { GmcGradedSiDialogRmunderwriterviewComponent } from './components/gmc-graded-si-dialog-rmunderwriterview/gmc-graded-si-dialog-rmunderwriterview.component';
import { CkycVerifiedDialogComponent } from './components/ckyc-verified-dialog/ckyc-verified-dialog.component';
import { GmcQuoteOnscreenCompareDialogComponent } from './components/gmc-quote-onscreen-compare-dialog/gmc-quote-onscreen-compare-dialog.component';
import { WorkmenDetailsTabComponent } from './components/quote/quote-requisition-tabs/workmen-details-tab/workmen-details-tab.component';
import { WorkmenCoveragesTabComponent } from './components/quote/quote-requisition-tabs/workmen-coverages-tab/workmen-coverages-tab.component';
import { WorkmenSummaryTabComponent } from './components/quote/quote-requisition-tabs/workmen-summary-tab/workmen-summary-tab.component';
import { SubTemplateWorkmenpolicyComponent } from './components/quote-slip-template-one/sub-template-workmenpolicy/sub-template-workmenpolicy.component';
import { FidelityEmployeeDataComponent } from './blus_bsc_dialogs/bsc-fidelity-gurantee-form-dialog/fidelity-employee-data/fidelity-employee-data.component';
import { EditQuoteLocationSumInsuredDialogComponent } from './components/edit-quote-location-sum-insured-dialog/edit-quote-location-sum-insured-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditSumSiConfimationDialogComponent } from './components/edit-sum-si-confimation-dialog/edit-sum-si-confimation-dialog.component';
import { QuoteRiskHeadLetterPageComponent } from './pages/quote-risk-head-letter-page/quote-risk-head-letter-page.component';
import { AnnexuresComponent } from './pages/quote-risk-head-letter-page/annexures/annexures.component';
import { BscWorkmenCompensationFormDialogComponent } from './blus_bsc_dialogs/bsc-workmen-compensation-form-dialog/bsc-workmen-compensation-form-dialog.component';
import { DeleteBscCoverComponent } from './components/delete-bsc-cover/delete-bsc-cover.component';
import { wcQuoteCoverageExtensionsDialogComponent } from './components/quote/wc-quote-coverage-extensions-dialog/wc-quote-coverage-extensions-dialog.component';
import { WcEmployeeDetailsComponent } from './components/quote/quote-edit-steps/wc-employee-details/wc-employee-details.component';
import { WcCoverageDetailsComponent } from './components/quote/quote-edit-steps/wc-coverage-details/wc-coverage-details.component';
import { BscPedalCycleFormDialogComponent } from './blus_bsc_dialogs/bsc-pedal-cycle-form-dialog/bsc-pedal-cycle-form-dialog.component';
import { BscAllRiskFormDialogComponent } from './blus_bsc_dialogs/bsc-all-risk-form-dialog/bsc-all-risk-form-dialog.component';
import { RejectQuoteDialogComponent } from './pages/quote-insurer-review-page/reject-quote-dialog/reject-quote-dialog.component';
import { ThirdPartyLiabilityFormDialogComponent } from './blus_bsc_dialogs/third-party-liability-form-dialog/third-party-liability-form-dialog.component';
import { TenantsLegalLiabilityFormDialogComponent } from './blus_bsc_dialogs/tenants-legal-liability-form-dialog/tenants-legal-liability-form-dialog.component';
import { RemovalOfDebrisFormDialogComponent } from './blus_bsc_dialogs/removal-of-debris-form-dialog/removal-of-debris-form-dialog.component';
import { ProtectionAndPreservationOfPropertyFormDialogComponent } from './blus_bsc_dialogs/protection-and-preservation-of-property-form-dialog/protection-and-preservation-of-property-form-dialog.component';
import { AdditionalCustomDutyFormDialogComponent } from './blus_bsc_dialogs/additional-custom-duty-form-dialog/additional-custom-duty-form-dialog.component';
import { LandscapingIncludingLawnsPlantShrubsOrTreesFormDialogComponent } from './blus_bsc_dialogs/landscaping-including-lawns-plant-shrubs-or-trees-form-dialog/landscaping-including-lawns-plant-shrubs-or-trees-form-dialog.component';
import { KeysAndLocksFormDialogComponent } from './blus_bsc_dialogs/keys-and-locks-form-dialog/keys-and-locks-form-dialog.component';
import { CoverOfValuableContentsFormDialogComponent } from './blus_bsc_dialogs/cover-of-valuable-contents-form-dialog/cover-of-valuable-contents-form-dialog.component';
import { ClaimPreparationCostFormDialogComponent } from './blus_bsc_dialogs/claim-preparation-cost-form-dialog/claim-preparation-cost-form-dialog.component';
import { AccidentalDamageFormDialogComponent } from './blus_bsc_dialogs/accidental-damage-form-dialog/accidental-damage-form-dialog.component';
import { DeteriorationofStocksinBFormDialogComponent } from './blus_bsc_dialogs/deteriorationof-stocksin-b-form-dialog/deteriorationof-stocksin-b-form-dialog.component';
import { DeteriorationofStocksinAFormDialogComponent } from './blus_bsc_dialogs/deteriorationof-stocksin-a-form-dialog/deteriorationof-stocksin-a-form-dialog.component';
import { EscalationFormDialogComponent } from './blus_bsc_dialogs/escalation-form-dialog/escalation-form-dialog.component';
import { InvoluntaryBettermentFormDialogComponent } from './blus_bsc_dialogs/involuntary-betterment-form-dialog/involuntary-betterment-form-dialog.component';
import { InsuranceOfAdditionalExpenseFormDialogComponent } from './blus_bsc_dialogs/insurance-of-additional-expense-form-dialog/insurance-of-additional-expense-form-dialog.component';
import { EmiProtectionCoverFormDialogComponent } from './blus_bsc_dialogs/emi-protection-cover-form-dialog/emi-protection-cover-form-dialog.component';

import { QuoteComparisionReviewPageWcComponent } from './pages/quote-comparision-review-page-wc/quote-comparision-review-page-wc.component';
import { SubTemplateLiabilityComponent } from './components/quote-slip-template-one/sub-template-liability/sub-template-liability.component';
import { BasicDetailsTabComponent } from './components/quote/quote-requisition-tabs/liabilityproducttabs/basic-details-tab/basic-details-tab.component';
import { TeritorySubsidaryDetailsTabComponent } from './components/quote/quote-requisition-tabs/liabilityproducttabs/teritory-subsidary-details-tab/teritory-subsidary-details-tab.component';
import { ExclusionSubjectivityDetailsTabComponent } from './components/quote/quote-requisition-tabs/liabilityproducttabs/exclusion-subjectivity-details-tab/exclusion-subjectivity-details-tab.component';
import { DeductiblesDetailsTabComponent } from './components/quote/quote-requisition-tabs/liabilityproducttabs/deductibles-details-tab/deductibles-details-tab.component';
import { CoBrokerFormDialogComponent } from './components/other-details-crud-card/co-broker-form-dialog/co-broker-form-dialog.component';
import { QuoteEditStepsClaimExperienceTabComponent } from './components/quote/quote-edit-steps/quote-edit-steps-claim-experience-tab/quote-edit-steps-claim-experience-tab.component';
import { LiabilityBasicDetailsComponent } from './components/quote/quote-edit-steps/liability-basic-details/liability-basic-details.component';
import { LiabilityTeritoryDetailsComponent } from './components/quote/quote-edit-steps/liability-teritory-details/liability-teritory-details.component';
import { LiabilityExclusionDetailsComponent } from './components/quote/quote-edit-steps/liability-exclusion-details/liability-exclusion-details.component';
import { LiabilityDeductiblesDetailsComponent } from './components/quote/quote-edit-steps/liability-deductibles-details/liability-deductibles-details.component';
import { QuoteComparisionReviewPageLiabilityComponent } from './pages/quote-comparision-review-page-liability/quote-comparision-review-page-liability.component';
import { LiabilityAddoncoversDialogComponent } from './components/quote/add-on-covers-dialogs/liability-addoncovers-dialog/liability-addoncovers-dialog.component';
import { LiabilityCurrencyDialogComponent } from './components/quote/liability-currency-dialog/liability-currency-dialog.component';
import { EditOptionsConfimationDialogComponent } from './components/edit-options-confirmation-dialog/edit-options-confirmation-dialog.component';
import { GapAnalysisReportPdfComponent } from './components/quote/quote-requisition-tabs/gap-analysis-report-pdf/gap-analysis-report-pdf.component';
import { BasicDetailsEandOTabComponent } from './components/quote/quote-requisition-tabs/liabilityEandOProductsTabs/basic-details-eando-tab/basic-details-eando-tab.component';
import { LiabilityEandOAddoncoversDialogComponent } from './components/quote/add-on-covers-dialogs/liability-eando-addoncovers-dialog/liability-eando-addoncovers-dialog.component';
import { TeritorySubsidaryDetailsEandOTabComponent } from './components/quote/quote-requisition-tabs/liabilityEandOProductsTabs/teritory-subsidary-details-eando-tab/teritory-subsidary-details-eando-tab.component';
import { DeductiblesEandODetailsTabComponent } from './components/quote/quote-requisition-tabs/liabilityEandOProductsTabs/deductibles-eando-details-tab/deductibles-eando-details-tab.component';
import { RevenueDetailsEandOTabComponent } from './components/quote/quote-requisition-tabs/liabilityEandOProductsTabs/revenue-details-eando-tab/revenue-details-eando-tab.component';
import { SubTemplateLiabilityEandOComponent } from './components/quote-slip-template-one/sub-template-liability-eando/sub-template-liability-eando.component';
import { DeleteConfirmationDialogComponent } from './components/quote/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { LiabilityEandOBasicDetailsComponent } from './components/quote/quote-edit-steps/eando-liability-basic-details/eando-liability-basic-details.component';
import { LiabilityEandOTeritoryDetailsComponent } from './components/quote/quote-edit-steps/eando-liability-teritory-details/eando-liability-teritory-details.component';
import { LiabilityEandODeductiblesDetailsComponent } from './components/quote/quote-edit-steps/eando-liability-deductibles-details/eando-liability-deductibles-details.component';
import { LiabilityEandORevenueDetailsComponent } from './components/quote/quote-edit-steps/eando-liability-revenue-details/eando-liability-revenue-details.component';
import { QuoteComparisionReviewPageLiabilityEandOComponent } from './pages/quote-comparision-review-page-eando/quote-comparision-review-page-eando.component';
import { RevenueDetailsTabComponent } from './components/quote/quote-requisition-tabs/liabilityproducttabs/revenue-details-tab/revenue-details-tab.component';
import { LiabilityRevenueDetailsComponent } from './components/quote/quote-edit-steps/liability-revenue-details/liability-revenue-details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MoodysPDFComponent } from './components/moodys-pdf/moodys-pdf.component';
import { LiabilityCGLAddoncoversDialogComponent } from './components/quote/add-on-covers-dialogs/liability-cgl-addoncovers-dialog/liability-cgl-addoncovers-dialog.component';
import { BasicDetailsCGLTabComponent } from './components/quote/quote-requisition-tabs/liabilityCGLProductsTabs/basic-details-cgl-tab/basic-details-cgl-tab.component';
import { TeritorySubsidaryDetailsCGLTabComponent } from './components/quote/quote-requisition-tabs/liabilityCGLProductsTabs/teritory-subsidary-details-cgl-tab/teritory-subsidary-details-cgl-tab.component';
import { TurnoverDetailsandClaimExperienceTabComponent } from './components/quote/quote-requisition-tabs/liabilityCGLProductsTabs/revenue-details-cgl-tab/revenue-details-cgl-tab.component';
import { SubTemplateLiabilityCGLComponent } from './components/quote-slip-template-one/sub-template-liability-CGL/sub-template-liability-cgl.component';
import { LiabilityCGLBasicDetailsComponent } from './components/quote/quote-edit-steps/liability-cgl-basic-details/liability-cgl-basic-details.component';
import { LiabilityCGLTeritoryDetailsComponent } from './components/quote/quote-edit-steps/liability-cgl-teritory-details/liability-cgl-teritory-details.component';
import { LiabilityTurnoverDetailsComponent } from './components/quote/quote-edit-steps/liability-cgl-tunover-details/liability-cgl-claim-experience-turnover-details.component';
import { QuoteComparisionReviewPageCGLLiabilityComponent } from './pages/quote-comparision-review-page-liability-cgl/quote-comparision-review-page-liability-cgl.component';
import { LiabilityCGLExclusionDetailsComponent } from './components/quote/quote-edit-steps/liability-cgl-exclusion-details/liability-cgl-exclusion-details.component';
import { BasicDetailsProductliabilityTabComponent } from './components/quote/quote-requisition-tabs/liabilityProductLiabilityTabs/basic-details-pl-tab/basic-details-pl-tab.component';
import { RevenueDetailsProductliabilityTabComponent } from './components/quote/quote-requisition-tabs/liabilityProductLiabilityTabs/revenue-details-productliability-tab/revenue-details-pl-tab.component';
import { LiabilityProductliabilityAddoncoversDialogComponent } from './components/quote/add-on-covers-dialogs/liability-productliability-addoncovers-dialog/liability-productliability-addoncovers-dialog.component';
import { TeritorySubsidaryDetailsProductliabilityTabComponent } from './components/quote/quote-requisition-tabs/liabilityProductLiabilityTabs/teritory-subsidary-details-pl-tab/teritory-subsidary-details-pl-tab.component';
import { QuoteComparisionReviewPageLiabilityProductliabilityComponent } from './pages/quote-comparision-review-page-liability-productliability/quote-comparision-review-page-liability-pl.component';
import { DeductiblesProductLiabilityDetailsTabComponent } from './components/quote/quote-requisition-tabs/liabilityProductLiabilityTabs/deductibles-pl-details-tab/deductibles-pl-details-tab.component';
import { SubTemplateProductLiabilityCGLComponent } from './components/quote-slip-template-one/sub-template-liability-pl/sub-template-liability-pl.component';
import { LiabilityProductliabilityDeductiblesComponent } from './components/quote/quote-edit-steps/liability-pl-deductibles-details/liability-pl-deductibles-details.component';
import { LiabilityProductliabilityTurnoverDetailsComponent } from './components/quote/quote-edit-steps/liability-pl-tunover-details/liability-pl-turnover-details.component';
import { LiabilityProductliabilityTeritoryDetailsComponent } from './components/quote/quote-edit-steps/liability-pl-teritory-details/liability-pl-teritory-details.component';
import { LiabilityProductliabilityExclusionDetailsComponent } from './components/quote/quote-edit-steps/liability-pl-exclusion-details/liability-pl-exclusion-details.component';
import { LiabilityProductliabilityBasicDetailsComponent } from './components/quote/quote-edit-steps/liability-pl-basic-details/liability-pl-basic-details.component';
import { TimelineModule } from 'primeng/timeline';
import { InsureDetailsCrudCardComponent } from './components/insure-details-crud-card/insure-details-crud-card.component';
import { LiabilityEandOExclusionDetailsComponent } from './components/quote/quote-edit-steps/liability-eando-exclusion-details/liability-eando-exclusion-details.component';
import { LiabilityWCExclusionDetailsComponent } from './components/quote/quote-edit-steps/liability-wc-exclusion-details/liability-wc-exclusion-details.component';
import { QuoteOptionListDialogComponent } from './pages/quote-insurer-review-page/quote-option-list-dialog/quote-option-list-dialog.component';
import { DeductiblesCGLTabComponent } from './components/quote/quote-requisition-tabs/liabilityCGLProductsTabs/deductibles-cgl-tab/deductibles-cgl-tab.component';
import { TerritoryWorkmenTabComponent } from './components/quote/quote-requisition-tabs/workmen-territory-tab/workmen-territory-tab.component';
import { LiabilityWCDeductiblesDetailsComponent } from './components/quote/quote-edit-steps/liability-wc-deductibles-details/liability-wc-deductibles-details.component';
import { AgmCoreModule } from '@agm/core';
import { LiabilityOptionsDialogComponent } from './components/liability-options-dialog/liability-options-dialog.component';
import { ExclusionDetailsComponent } from './components/quote/quote-requisition-tabs/liabilityproducttabs/exclusion-tab/exclusion-details.component';
import { EandOExclusionDetailsComponent } from './components/quote/quote-requisition-tabs/liabilityEandOProductsTabs/exclusions-eando-tab/eando-exclusion-details.component';
import { CGLExclusionDetailsComponent } from './components/quote/quote-requisition-tabs/liabilityCGLProductsTabs/exclusions-cgl-tab/cgl-exclusion-details.component';
import { ProductliabilityExclusionDetailsComponent } from './components/quote/quote-requisition-tabs/liabilityProductLiabilityTabs/pl-excluisons-tab/pl-exclusion-details.component';
import { LiabilityWorkmenAdOnCoverComponent } from './components/quote/add-on-covers-dialogs/liability-workmen-addoncovers-dialog/liability-workmen-addoncovers-dialog.component';
import { CoBrokerLiabilityFormDialogComponent } from './components/other-details-liability-crud-card/co-broker-liability-form-dialog/co-broker-liability-form-dialog.component';
import { OtherDetailsLiabilityCrudCardComponent } from './components/other-details-liability-crud-card/other-details-liability-crud-card.component';
import { OtherDetailsLiabilityFormComponent } from './components/other-details-liability-crud-card/other-details-liability-form-component/other-details-liability-form-component.component';
import { OtherDetailsLiabilityTabComponent } from './components/quote/quote-requisition-tabs/other-details-tab-liability/other-details-liability-tab.component';
import { LiabilityInsurerReviewDecisionMatrixTabComponent } from './components/quote/quote-edit-steps/liability-insurer-review-decision-matrix-tab/liability-insurer-review-decision-matrix-tab.component';
import { LiabilityCGLDeductiblesDetailsComponent } from './components/quote/quote-edit-steps/liability-cgl-deductibles-details/liability-cgl-deductibles-details.component';
//import { EandOExclusionDetailsComponent } from './components/quote/quote-requisition-tabs/liabilityEandOProductsTabs/exclusions-eando-tab/exclusion-details.component';
import { MoodysReviewDiscountDialogeComponent } from './components/moodys-review-discount-dialoge/moodys-review-discount-dialoge.component';
// import { FireFloatercoverAddonCardComponent } from './components/fire-floater-cover-add-on-card/fire-floater-cover-addon-card.component';
// import { FireFloaterAddOnDialogComponent } from './components/fire-floater-add-on-dialog/fire-floater-add-on-dialog.component';
// import { FireFloaterAddonCoverCardComponent } from './components/fire-floater-addon-cover-card/fire-floater-addon-cover-card.component';
// import { FireFloaterCoverAddonDialogComponent } from './components/fire-floater-addon-cover-dialog/fire-floater-addon-cover-dialog.component';
// import { FetchPastQuoteHistoryDialogComponent } from './components/quote/add-on-covers-dialogs/fetch-past-quote-history-dialog/fetch-past-quote-history-dialog.component';
// import {CardModule} from 'primeng/card';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { QuoteLossDialogComponent } from './components/quote-loss-dialog/quote-loss-dialog.component';
import { DeclarationClauseCardComponent } from './components/declaration-clause-card/declaration-clause-card.component';
import { CoInsuranceFormDialogComponent } from './components/other-details-crud-card/co-insurance-form-dialog/co-insurance-form-dialog.component';
import { PlacementDialogComponent } from './components/placementmaker&checker-dialog/placementmaker-dialog/placement-dialog.component';
import { PlacementcheckerDialogComponent } from './components/placementmaker&checker-dialog/placementchecker-dialog/placementchecker-dialog.component';
import { ExpiredDetailsDialogForm } from '../broker/expired-details-dialog-form/expired-details-dialog-form.component';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { ReasonForQuoteLossComponent } from './components/reason-for-quote-loss/reason-for-quote-loss.component';
import { DeductiblesWorkmanTabComponent } from './components/quote/quote-requisition-tabs/workmen-deductibles-tab copy/workmen-deductibles-tab.component';
import { GmcEnhancedCoversTabComponent } from './components/quote/quote-requisition-tabs/gmc-enhanced-covers-tab/gmc-enhanced-covers-tab.component';
import { LiabilityWCTerritoryDetailsComponent } from './components/quote/quote-edit-steps/liability-wc-territory-details/liability-wc-territory-details.component';
import { GmcEnhancedCoversComponent } from './components/quote/quote-edit-steps/gmc-enhanced-covers/gmc-enhanced-covers.component';
import { DeductiblesExcessCardComponent } from './components/deductibles-excess-card/deductibles-excess-card.component';
import { DeductiblesAddoncoverCardComponent } from './components/deductibles-addoncover-card/deductibles-addoncover-card.component';
import { InstallmentTabComponent } from './installment-tab/installment-tab.component';
import { ProjectDetailsDialogComponent } from '../broker/project-details-dialog/project-details-dialog.component';
import { PaymentDetailGmcComponent } from './components/payment-detail-gmc/payment-detail-gmc.component';
import { CoInsuranceFormDialogGmcComponent } from './components/co-insurance-form-dialog-gmc/co-insurance-form-dialog-gmc.component';
import { GMCFileUploadDialogComponent } from './components/quote/gmc-file-upload-qcr-dialog/gmc-file-upload-qcr-dialog.component';
import { QuoteSentForQcrDialogComponent } from './status_dialogs/quote-sent-for-qcr-dialog/quote-sent-for-qcr-dialog.component';
import { QuoteSentForPlacementCheckerMakerComponent } from './status_dialogs/quote-sent-for-placement-checker-maker/quote-sent-for-placement-checker-maker.component';
import { QuoteSentPlacementSlipIsApprovedDialogComponent } from './status_dialogs/quote-sent-placement-slip-is-approved-dialog/quote-sent-placement-slip-is-approved-dialog.component';
import { QuoteSentForPlacementMakerComponent } from './status_dialogs/quote-sent-for-placement-maker/quote-sent-for-placement-maker.component';
import { QuoteSentForPostPlacementDialogComponent } from './status_dialogs/quote-sent-for-post-placement-dialog/quote-sent-for-post-placement-dialog.component';
import { QuotePlacementSlipAproveDialogComponent } from './status_dialogs/quote-placement-slip-aprove-dialog/quote-placement-slip-aprove-dialog.component';
import { IcListDialogComponent } from './pages/quote-comparison-review-detailed-page/ic-list-dialog/ic-list-dialog.component';
import { LiabilityQuoteOnscreenCompareDialogComponent } from './components/liability-quote-onscreen-compare-dialog/liability-quote-onscreen-compare-dialog.component';
import { PaymentDetailLiabilityComponent } from './components/payment-detail-liability/payment-detail-liability.component';

@NgModule({
    declarations: [

        // Pages ------------------------------------------------------------------------------------------------------------
        QuoteViewPageComponent,
        QuoteCreatePageComponent,
        QuoteDraftPageComponent,
        QuoteRequisitionPageComponent,
        QuoteReviewPageComponent,
        QuoteEditPageComponent,
        QuoteCompareAndAnalyticsPageComponent,
        QuoteOfflinePaymentPageComponent,
        QuoteComparisonReviewDetailedPageComponent,
        QuoteSlipPdfPreviewComponent,

        // Dashboard
        DashboardComponent,
        SelfDashboardComponent,
        InsurerDashboardComponent,
        BrokerDashboardComponent,
        AgentDashboardComponent,
        BancaDashboardComponent,
        CorporateAgentDashboardComponent,


        // Dialogs ------------------------------------------------------------------------------------------------------------
        // Sidebar Dialogs
        EditInsuredDetailsDialogComponent,
        LocationWiseCoversBreakDialogComponent,
        RemoveAllowedProductBscCoverDialogComponent,

        FlexaCoversDialogComponent, // TODO: Tobe Checked
        SectorAvgFreeAddOnsDialogComponent, // TODO: Tobe Checked
        ConditionalFreeAddOnsDialogComponent, // TODO: Tobe Checked
        SectorAvgPaidAddOnsDialogComponent, // TODO: Tobe Checked

        // BSC Dialogs
        BscFireLossOfProfitFormDialogComponent,

        BscBurglaryAndHousebreakingFormDialogComponent,
        BscBuglaryAndHousebreakingViewQuoteBreakupDialogComponent,


        BscMoneyInSafeTillFormDialogComponent,
        BscMoneyInSafeTillViewQuoteBreakupDialogComponent,

        BscMoneyInTransitFormDialogComponent,

        BscElectronicEquipmentsFormDialogComponent,
        BscElectronicEquipmentsViewQuoteBreakupDialogComponent,

        BscPortableEquipmentsFormDialogComponent,

        BscFixedPlateGlassFormDialogComponent,
        BscFixedPlateGlassViewQuoteBreakupDialogComponent,

        BscAccompaniedBaggageFormDialogComponent,

        BscFidelityGuranteeFormDialogComponent,

        BscSignageFormDialogComponent,

        BscLiabilitySectionFormDialogComponent,

        // Status Dialogs
        QuoteSentForApprovalDialogComponent,
        NonOtcQuoteSentToInsurerDialogComponent,
        OtcQuotePlacementSlipGeneratedDialogComponent,
        NonOtcQuotePlacementSlipGeneratedDialogComponent,
        QuoteSentToUnderwritterByRmDialogComponent,
        QuoteSentToNextUnderwriterDialogComponent,

        // Other Dialogs
        OtcProductLimitExceededConfirmationDialogComponent,

        QuoteCompareConfirmationDialogComponent,
        // FetchPastQuoteHistoryDialogComponent,
        FetchPastQuoteHistoryDialogComponent,
        ComparisonUnderWriteBApprovalDialogComponent,
        ComparisonRelfectChangesDialogComponent,
        ComparisonQuoteSlipDialogComponent,
        QuoteSelectBrokerForCompareDialogComponent,
        QouteSentForQcrDialogComponent,
        QuoteUnderwritterReviewStatusDialogComponent,
        QuoteSlipDialogComponent,
        QuotePlacementSlipGeneratedDialogComponent,
        CreateRiskLocationOccupancyDialogComponent,
        LossOfRentDialogComponent,
        RentForAlternativeAccomodationDialogComponent,
        //  PersonalAccidentCoverComponent,
        ValuebleContentAgreedValueBasisDialogComponent,
        PersonalAccidentCoverDialogComponent,
        // RentForAlternativeAccomodationDialogComponent
        ChoosePaymentModeDialogComponent,
        ProceedWithOfflinePaymentDialogComponent,
        DeclarationPolicyDialogComponent,
        FloaterCoverAddonDialogComponent,
        RiskCoverLetterDialogComponent,
        PaymentCompletedSuccessfullyDialogComponent,
        ChooseVerificationModeDialogComponent,
        ChooseVerifierOtpDialogComponent,
        EnterVerifierOtpDialogComponent,
        ProposalVerifiedDialogComponent,
        UploadProposalFormDialogComponent,
        FireFloaterCoverAddonDialogComponent,
        QuoteSlipSentForPlacementDialogComponent,
        // SidSumInsuredSplitDialogComponent,
        QuoteAuditTrailDialogComponent,
        wcQuoteCoverageExtensionsDialogComponent,
        QuoteLocationBreakupDialogComponent,
        IndicativeQuoteViewDetailsDialogComponent,
        MachineryBreakdownDialogComponent,
        RiskManagementFeaturesDialogComponent,
        IarIndicativeQuoteBasicCardComponent,
        // FireFloaterAddOnDialogComponent,
        // FireFloaterAddonCoverDialogComponent,

        // Tabs ------------------------------------------------------------------------------------------------------------
        QuoteRequisitionSidebarComponent,
        QuoteRequisitionTabsHolderComponent,

        SumInsuredDetailsTabComponent,
        BusinessSurakshaCoversTabComponent,
        IndicativeQuoteTabComponent,
        RiskInspectionStatusAndClaimExperienceTabComponent,
        OtherDetailsTabComponent,
        GapAnalysisTabComponent,
        RiskManagementFeatureTabComponent,
        StandardAddonsTabComponent,

        QuoteEditStepsRiskInspectionClaimExperienceTabComponent,

        // Components ------------------------------------------------------------------------------------------------------
        SelectProductComponentComponent,
        SelectLocationOccupanyComponent,
        FireFloaterCoverAddonCardComponent,




        ToggleCoverOptedComponent,

        QuoteInsurerReviewBasicDetailsTabComponent,
        SumInsuredDetailsComponent,
        QuoteInsurerReviewMultilocationAnnexureTabComponent,
        QuoteInsurerReviewAddonTabComponent,
        BusinessSurakshaCoversComponent,
        QuoteInsurerReviewWarrentiesExclusionsSubjectivesTabComponent,
        QuoteInsurerReviewDecisionMatrixTabComponent,
        QuoteInsurerReviewPreviewDownloadTabComponent,

        QuoteComparisionReviewPageComponent,
        QuotePlacementPageComponent,
        QuotePlacementSlipReviewPageComponent,
        UploadStepWiseExcelForQuoteComponent,

        QuoteInsurerReviewRiskManagementFeaturesTabComponent,
        ClaimExperienceComponent,
        IndicativeQuoteBasicCardComponent,
        TotalIndicativeQuoteCoversOptedCardComponent,
        RiskInspectionReportAndLocationPhotographsCrudCardComponent,
        BscCoverCardComponent,
        RiskInspectionCardComponent,
        QuoteSlipTemplateOneComponent,
        RiskManagementFeaturesCardComponent,
        QuoteLocationBreakupComponent,
        ConfigureDiscountDialogeComponent,
        QuoteInsurerReviewDocumentsUploadedTabComponent,
        ToggleCoverOptedRadioComponent,
        // FireFloaterCoverAddonComponent,
        OfflinePaymentDetailsCardComponent,

        QuoteSlipTemplateForFireComponent,
        SubTemplateBlusComponent,
        SubTemplateFireComponent,
        BusinessInterruptionPropertyDemageComponent,
        SubTemplateIarComponent,
        SumInsuredDetailsSubTemplateFireComponent,
        SumInsuredDetailsSubTemplateBlusComponent,
        SumInsuredDetailsSubTemplateIarComponent,
        SubViewKanbanComponent,
        SubViewTableComponent,
        IarFireLossOfProfitCrudCardComponent,
        IarMachineryElectricalBreakdownCrudCardComponent,
        IarMachineryLossOfProfitCrudCardComponent,
        QuoteInsurerReviewRiskCoverLetterTabComponent,
        RiskCoverLetterHeaderComponent,
        PaymentDetailsPopupComponent,
        SelectInsurerComponent,
        OtherDetailsCrudCardComponent,
        HypothicationDetailsCrudCardComponent,
        OtherDetailsFormComponentComponent,
        QuoteInsurerReviewPageComponent,
        QuoteDiscussionPageComponent,
        QueryDiscussionBoxComponent,
        InsureDetailsCrudCardComponent,

        //Intergation-EB [Start]
        EmployeeDemographicTabComponent,
        FamilyCompositionTabComponent,
        GmcCoveregesTabComponent,
        MaternityBenifitsTabComponent,
        CostContainmentTabComponent,
        ClaimAnalyticsTabComponent,
        FinalRaterTabComponent,
        GmcCoveragesOptionsDialogComponent,
        GmcGradedSiDialogComponent,
        GmcEmployeeDetailsComponent,
        GmcFamilyCompositionComponent,
        GmcCoveragesComponent,
        GmcMaternityBenifitsComponent,
        GmcCostContainmentComponent,
        ClaimAnalyticsTabComponent,
        GmcFinalRaterComponent,
        GmcOtherDetailsComponent,
        SubTemplateGmcComponent,
        GmcOtherdetailsTabComponent,
        QuoteComparisionReviewDetailedPageGmcComponent,

        QuoteComparisionReviewDetailedPageGmcComponent,
        GmcGradedSiDialogComponent,
        GmcDescriptionDialogComponent,
        GmcBasicDetailsComponent,
        MarineSuminsuredDetailsTabComponent,
        MarineCoveragesTabComponent,
        MarineOtherdetailsTabComponent,
        MarineClausesDialogComponent,
        //Intergation-EB [End]
        ResetPasswordPopupDialogComponent,
        ChangePasswordDialogComponent,
        ImportDialogComponent,
        ExportDialogComponent,
        MarineSiDetailsComponent,
        MarineCoveragesClausesComponent,
        SubTemplateMarineComponent,
        ClientCKYCDialogComponent,
        ClientCKYCDialogComponent,
        CkycVerifiedDialogComponent,
        GmcGradedSiDialogRmunderwriterviewComponent,
        GmcQuoteOnscreenCompareDialogComponent,
        WorkmenDetailsTabComponent,
        WorkmenCoveragesTabComponent,
        WorkmenSummaryTabComponent,
        SubTemplateWorkmenpolicyComponent,
        FidelityEmployeeDataComponent,
        EditQuoteLocationSumInsuredDialogComponent,
        EditSumSiConfimationDialogComponent,
        QuoteRiskHeadLetterPageComponent,
        AnnexuresComponent,
        BscWorkmenCompensationFormDialogComponent,
        DeleteBscCoverComponent,
        WcEmployeeDetailsComponent,
        WcCoverageDetailsComponent,
        BscPedalCycleFormDialogComponent,
        BscAllRiskFormDialogComponent,
        RejectQuoteDialogComponent,
        QuoteComparisionReviewPageWcComponent,
        SubTemplateLiabilityComponent,
        SubTemplateLiabilityCGLComponent,
        BasicDetailsTabComponent,
        BasicDetailsEandOTabComponent,
        DeductiblesEandODetailsTabComponent,
        TeritorySubsidaryDetailsEandOTabComponent,
        TeritorySubsidaryDetailsTabComponent,
        ExclusionSubjectivityDetailsTabComponent,
        DeductiblesDetailsTabComponent,
        CoBrokerFormDialogComponent,
        ThirdPartyLiabilityFormDialogComponent,
        TenantsLegalLiabilityFormDialogComponent,
        RemovalOfDebrisFormDialogComponent,
        ProtectionAndPreservationOfPropertyFormDialogComponent,
        AdditionalCustomDutyFormDialogComponent,
        LandscapingIncludingLawnsPlantShrubsOrTreesFormDialogComponent,
        KeysAndLocksFormDialogComponent,
        CoverOfValuableContentsFormDialogComponent,
        ClaimPreparationCostFormDialogComponent,
        AccidentalDamageFormDialogComponent,
        DeteriorationofStocksinBFormDialogComponent,
        DeteriorationofStocksinAFormDialogComponent,
        EscalationFormDialogComponent,
        InvoluntaryBettermentFormDialogComponent,
        InsuranceOfAdditionalExpenseFormDialogComponent,
        EmiProtectionCoverFormDialogComponent,
        QuoteEditStepsClaimExperienceTabComponent,
        LiabilityBasicDetailsComponent,
        LiabilityTeritoryDetailsComponent,
        LiabilityExclusionDetailsComponent,
        LiabilityDeductiblesDetailsComponent,
        QuoteComparisionReviewPageLiabilityComponent,
        QuoteComparisionReviewPageLiabilityEandOComponent,
        LiabilityAddoncoversDialogComponent,
        LiabilityEandOAddoncoversDialogComponent,
        LiabilityCurrencyDialogComponent,
        EditOptionsConfimationDialogComponent,
        GapAnalysisReportPdfComponent,
        RevenueDetailsEandOTabComponent,
        SubTemplateLiabilityEandOComponent,
        DeleteConfirmationDialogComponent,
        LiabilityEandOBasicDetailsComponent,
        LiabilityEandOTeritoryDetailsComponent,
        LiabilityEandODeductiblesDetailsComponent,
        LiabilityEandORevenueDetailsComponent,
        RevenueDetailsTabComponent,
        LiabilityRevenueDetailsComponent,
        MoodysPDFComponent,
        LiabilityCGLAddoncoversDialogComponent,
        BasicDetailsCGLTabComponent,
        TeritorySubsidaryDetailsCGLTabComponent,
        TurnoverDetailsandClaimExperienceTabComponent,
        LiabilityCGLBasicDetailsComponent,
        LiabilityCGLTeritoryDetailsComponent,
        LiabilityTurnoverDetailsComponent,
        QuoteComparisionReviewPageCGLLiabilityComponent,
        LiabilityCGLExclusionDetailsComponent,
        BasicDetailsProductliabilityTabComponent,
        RevenueDetailsProductliabilityTabComponent,
        TeritorySubsidaryDetailsProductliabilityTabComponent,
        LiabilityProductliabilityAddoncoversDialogComponent,
        QuoteComparisionReviewPageLiabilityProductliabilityComponent,
        DeductiblesProductLiabilityDetailsTabComponent,
        SubTemplateProductLiabilityCGLComponent,
        LiabilityProductliabilityBasicDetailsComponent,
        LiabilityProductliabilityExclusionDetailsComponent,
        LiabilityProductliabilityTeritoryDetailsComponent,
        LiabilityProductliabilityTurnoverDetailsComponent,
        LiabilityProductliabilityDeductiblesComponent,
        LiabilityEandOExclusionDetailsComponent,
        LiabilityWCExclusionDetailsComponent,

        //  New_Quote_Option
        QuoteOptionListDialogComponent,
        DeductiblesCGLTabComponent,
        TerritoryWorkmenTabComponent,
        LiabilityWCDeductiblesDetailsComponent,
        LiabilityOptionsDialogComponent,
        ExclusionDetailsComponent,
        EandOExclusionDetailsComponent,
        CGLExclusionDetailsComponent,
        ProductliabilityExclusionDetailsComponent,
        LiabilityWorkmenAdOnCoverComponent,
        OtherDetailsLiabilityFormComponent,
        CoBrokerLiabilityFormDialogComponent,
        OtherDetailsLiabilityCrudCardComponent,
        OtherDetailsLiabilityTabComponent,
        LiabilityInsurerReviewDecisionMatrixTabComponent,
        LiabilityCGLDeductiblesDetailsComponent,


        // CurrencyDirective,
        MoodysReviewDiscountDialogeComponent,
        QuoteLossDialogComponent,
        DeclarationClauseCardComponent,
        CoInsuranceFormDialogComponent,
        ExpiredDetailsDialogForm,
        // CurrencyDirective,
        QuoteLossDialogComponent,
        PaymentDetailComponent,
        ReasonForQuoteLossComponent,
        DeductiblesWorkmanTabComponent,
        LiabilityWCTerritoryDetailsComponent,


        // CurrencyDirective,
        MoodysReviewDiscountDialogeComponent,
        GmcEnhancedCoversTabComponent,
        GmcEnhancedCoversComponent,
        // CurrencyDirective,
        // FireFloaterAddOnCardComponent,
        // FireFloaterAddonCoverCardComponent,
        // FireFloaterCoverAddonCardComponent,
        PlacementDialogComponent,
        PlacementcheckerDialogComponent,
        DeductiblesExcessCardComponent,
        DeductiblesAddoncoverCardComponent,
        InstallmentTabComponent,
        ProjectDetailsDialogComponent,
        PaymentDetailGmcComponent,
        CoInsuranceFormDialogGmcComponent,
        GMCFileUploadDialogComponent,
        QuoteSentForQcrDialogComponent,
        QuoteSentForPlacementCheckerMakerComponent,
        QuoteSentPlacementSlipIsApprovedDialogComponent,
        QuoteSentForPlacementMakerComponent,
        QuoteSentForPostPlacementDialogComponent,
        QuotePlacementSlipAproveDialogComponent,
        IcListDialogComponent,
        LiabilityQuoteOnscreenCompareDialogComponent,
        PaymentDetailLiabilityComponent,
    ],
    imports: [
        CommonModule,
        QuoteRoutingModule,
        SliderModule,
        BadgeModule,
        // CardModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        ToastModule,
        DynamicDialogModule,
        TabViewModule,
        AutoCompleteModule,
        ConfirmPopupModule,
        AccordionModule,
        DropdownModule,
        ToggleButtonModule,
        TableModule,
        MultiSelectModule,
        AutoCompleteModule,
        DataViewModule,
        TreeTableModule,
        CardModule,
        SelectButtonModule,
        PickListModule,
        SplitButtonModule,
        ProgressBarModule,
        CheckboxModule,
        TooltipModule,
        FileUploadModule,
        TabMenuModule,
        MenuModule,
        GlobalModule,
        NgxCurrencyModule,
        // TreeTableModule,
        ChartModule,
        RadioButtonModule,
        DialogModule,
        CalendarModule,
        InputNumberModule,
        NgDragDropModule,
        SplitButtonModule,
        SidebarModule,
        
        StepsModule,
        TabViewModule,
        AutoCompleteModule,

        RippleModule,
        FocusTrapModule,
        InputNumberModule,
        TableModule,
        InputNumberModule,
        InputTextModule,
        FormsModule,
        CarouselModule,
        NgCircleProgressModule,
        FileUploadModule,
        VirtualScrollerModule,
        PanelModule,
        ChartModule,
        SharedModule,
        PasswordModule,
        ConfirmDialogModule,
        FontAwesomeModule,
        TimelineModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDshPQ0dxKnI9YK-uQDJETTjME8R9VklkE',
            libraries: ['places']
        }),

    ],
    providers: [DatePipe, ConfirmationService],
    exports: [
        QuoteSlipTemplateOneComponent,
        QuoteLocationBreakupComponent,
    ]
})
export class QuoteModule { }
