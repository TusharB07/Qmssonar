import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuoteCreatePageComponent } from './pages/quote-create-page/quote-create-page.component';
import { QuoteDraftPageComponent } from './pages/quote-draft-page/quote-draft-page.component';
import { QuoteRequisitionPageComponent } from './pages/quote-requisition-page/quote-requisition-page.component';
import { QuoteReviewPageComponent } from './pages/quote-review-page/quote-review-page.component';
import { QuoteEditPageComponent } from './pages/quote-edit-page/quote-edit-page.component';
import { QuoteInsurerReviewBasicDetailsTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-basic-details-tab/quote-insurer-review-basic-details-tab.component';
import { SumInsuredDetailsComponent } from './components/quote/quote-edit-steps/sum-insured-details/sum-insured-details.component';
import { QuoteInsurerReviewMultilocationAnnexureTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-multilocation-annexure-tab/quote-insurer-review-multilocation-annexure-tab.component';
import { QuoteInsurerReviewAddonTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-addon-tab/quote-insurer-review-addon-tab.component';
import { BusinessSurakshaCoversComponent } from './components/quote/quote-edit-steps/business-suraksha-covers/business-suraksha-covers.component';
import { QuoteCompareAndAnalyticsPageComponent } from './pages/quote-compare-and-analytics-page/quote-compare-and-analytics-page.component';
import { QuoteComparisionReviewPageComponent } from './pages/quote-comparision-review-page/quote-comparision-review-page.component';
import { QuoteEditStepsRiskInspectionClaimExperienceTabComponent } from './components/quote/quote-edit-steps/quote-edit-steps-risk-inspection-claim-experience-tab/quote-edit-steps-risk-inspection-claim-experience-tab.component';
import { QuoteInsurerReviewWarrentiesExclusionsSubjectivesTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-warrenties-exclusions-subjectives-tab/quote-insurer-review-warrenties-exclusions-subjectives-tab.component';
import { QuoteInsurerReviewDecisionMatrixTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-decision-matrix-tab/quote-insurer-review-decision-matrix-tab.component';
import { QuoteInsurerReviewPreviewDownloadTabComponent } from './components/quote/quote-edit-steps/quote-insurer-review-preview-download-tab/quote-insurer-review-preview-download-tab.component';
import { QuotePlacementPageComponent } from './pages/quote-placement-page/quote-placement-page.component';
import { QuotePlacementSlipReviewPageComponent } from './pages/quote-placement-slip-review-page/quote-placement-slip-review-page.component';
import { QuoteSlipPdfPreviewComponent } from './components/quote-slip-pdf-preview/quote-slip-pdf-preview.component';
import { QuoteOfflinePaymentPageComponent } from './pages/quote-offline-payment-page/quote-offline-payment-page.component';
import { QuoteComparisonReviewDetailedPageComponent } from './pages/quote-comparison-review-detailed-page/quote-comparison-review-detailed-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QuoteViewPageComponent } from './pages/quote-view-page/quote-view-page.component';
import { QuoteListViewComponent } from '../global/quote-list-view/quote-list-view.component';
import { QuoteInsurerReviewPageComponent } from './pages/quote-insurer-review-page/quote-insurer-review-page.component';
import { QuoteDiscussionPageComponent } from './pages/quote-discussion-page/quote-discussion-page.component';
import { QuoteComparisionReviewDetailedPageGmcComponent } from './pages/quote-comparision-review-detailed-page-gmc/quote-comparision-review-detailed-page-gmc.component';
import { InsurerGuard, QCRGuard, QuoteCreateGuard, QuoteRequisitionReviewGuard } from 'src/app/guards/auth.guard';
import { QuoteRiskHeadLetterPageComponent } from './pages/quote-risk-head-letter-page/quote-risk-head-letter-page.component';
import { QuoteComparisionReviewPageWcComponent } from './pages/quote-comparision-review-page-wc/quote-comparision-review-page-wc.component';
import { QuoteComparisionReviewPageLiabilityComponent } from './pages/quote-comparision-review-page-liability/quote-comparision-review-page-liability.component';
import { GapAnalysisReportPdfComponent } from './components/quote/quote-requisition-tabs/gap-analysis-report-pdf/gap-analysis-report-pdf.component';
import { QuoteComparisionReviewPageLiabilityEandOComponent } from './pages/quote-comparision-review-page-eando/quote-comparision-review-page-eando.component';
import { MoodysPDFComponent } from './components/moodys-pdf/moodys-pdf.component';
import { QuoteComparisionReviewPageCGLLiabilityComponent } from './pages/quote-comparision-review-page-liability-cgl/quote-comparision-review-page-liability-cgl.component';
import { QuoteComparisionReviewPageLiabilityProductliabilityComponent } from './pages/quote-comparision-review-page-liability-productliability/quote-comparision-review-page-liability-pl.component';
// import { PlacedQuoteListViewComponent } from '../global/placed-quote-list-view/placed-quote-list-view.component';



const routes: Routes = [
    {
        path: "",
        component: QuoteViewPageComponent
    },
    {
        path : ":quote_id/moodysPDF",
        component: MoodysPDFComponent
    },
    {
        path: "new",
        canActivate: [QuoteCreateGuard],
        component: QuoteCreatePageComponent
    },
    {
        path: ":quote_id",
        canActivate: [QuoteCreateGuard],
        component: QuoteDraftPageComponent
    },
    {
        path: ":quote_id/requisition",
        canActivate: [QuoteRequisitionReviewGuard],
        component: QuoteRequisitionPageComponent
    },
    {
        path: ":quote_id/requisition/review",
        canActivate: [QuoteRequisitionReviewGuard],
        component: QuoteReviewPageComponent
    },
    {
        path: ":quote_id/edit",
        canActivate: [InsurerGuard],
        component: QuoteInsurerReviewPageComponent,
    },
    {
        path: ":quote_id/compare-and-analytics",
        canActivate: [InsurerGuard],
        component: QuoteCompareAndAnalyticsPageComponent
    },
    {
        path: ":quote_id/comparision-review",
        component: QuoteComparisionReviewPageComponent
    },
    {
        path: ":quote_id/comparision-review-detailed",
        canActivate: [QCRGuard],
        component: QuoteComparisonReviewDetailedPageComponent
    },
    //Intergation-EB [Start]
    {
        path: ":quote_id/comparision-review-detailed-gmc",
        component: QuoteComparisionReviewDetailedPageGmcComponent,
    },
    {
        path: ":quote_id/comparision-review-detailed-wc",
        component: QuoteComparisionReviewPageWcComponent,
    },
    {
        path: ":quote_id/comparision-review-detailed-liability",
        component: QuoteComparisionReviewPageLiabilityComponent,
    },
    {
        path: ":quote_id/comparision-review-detailed-liabilityeando",
        component:QuoteComparisionReviewPageLiabilityEandOComponent
    },
    {
        path: ":quote_id/comparision-review-detailed-liabilitycgl",
        component:QuoteComparisionReviewPageCGLLiabilityComponent
    },
    {
        path: ":quote_id/comparision-review-detailed-liabilityproduct",
        component:QuoteComparisionReviewPageLiabilityProductliabilityComponent
    },
    //Intergation-EB [End]
    {
        path: ":quote_id/placement",
        component: QuotePlacementPageComponent
    },
    {
        path: ":quote_id/placement-slip-review/:selected_quote_id",
        canActivate: [QCRGuard],
        component: QuotePlacementSlipReviewPageComponent
    },
    {
        path: ":quote_id/pdf-preview",
        component: QuoteSlipPdfPreviewComponent
    },
    {
        path: ":quote_id/offline-payment",
        component: QuoteOfflinePaymentPageComponent
    },
    {
        path: ":quote_id/quote-discussion",
        component: QuoteDiscussionPageComponent
    },
    {
        path: ":quote_id/quote-risk-head-letter",
        component: QuoteRiskHeadLetterPageComponent
    },
    {
        path: ":quote_id/gap-analysis-report",
        component: GapAnalysisReportPdfComponent
    },
];


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class QuoteRoutingModule {
}
