import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";

import { ProgressSpinnerModule } from "primeng/progressspinner";
import { AccordionModule } from "primeng/accordion";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AvatarModule } from "primeng/avatar";
import { AvatarGroupModule } from "primeng/avatargroup";
import { BadgeModule } from "primeng/badge";
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { ChartModule } from "primeng/chart";
import { CheckboxModule } from "primeng/checkbox";
import { ChipModule } from "primeng/chip";
import { ChipsModule } from "primeng/chips";
import { CodeHighlighterModule } from "primeng/codehighlighter";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ColorPickerModule } from "primeng/colorpicker";
import { ContextMenuModule } from "primeng/contextmenu";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { FieldsetModule } from "primeng/fieldset";
import { FileUploadModule } from "primeng/fileupload";
import { FullCalendarModule } from "@fullcalendar/angular";
import { GalleriaModule } from "primeng/galleria";
import { ImageModule } from "primeng/image";
import { InplaceModule } from "primeng/inplace";
import { InputNumberModule } from "primeng/inputnumber";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { KnobModule } from "primeng/knob";
import { LightboxModule } from "primeng/lightbox";
import { ListboxModule } from "primeng/listbox";
import { MegaMenuModule } from "primeng/megamenu";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { OrderListModule } from "primeng/orderlist";
import { OrganizationChartModule } from "primeng/organizationchart";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { PanelModule } from "primeng/panel";
import { PanelMenuModule } from "primeng/panelmenu";
import { PasswordModule } from "primeng/password";
import { PickListModule } from "primeng/picklist";
import { ProgressBarModule } from "primeng/progressbar";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { RippleModule } from "primeng/ripple";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { ScrollTopModule } from "primeng/scrolltop";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from "primeng/sidebar";
import { SkeletonModule } from "primeng/skeleton";
import { SlideMenuModule } from "primeng/slidemenu";
import { SliderModule } from "primeng/slider";
import { SplitButtonModule } from "primeng/splitbutton";
import { SplitterModule } from "primeng/splitter";
import { StepsModule } from "primeng/steps";
import { TabMenuModule } from "primeng/tabmenu";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TagModule } from "primeng/tag";
import { TerminalModule } from "primeng/terminal";
import { TieredMenuModule } from "primeng/tieredmenu";
import { TimelineModule } from "primeng/timeline";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import { TreeModule } from "primeng/tree";
import { TreeTableModule } from "primeng/treetable";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { NgxSpinnerModule } from "ngx-spinner";

// Application Components
import { AppComponent } from "./app.component";
import { AppBreadcrumbComponent } from "./components/app-breadcrumb/app.breadcrumb.component";
import { AppMainComponent } from "./components/app-main/app.main.component";
import { AppConfigComponent } from "./components/app-config/app.config.component";
import { AppRightMenuComponent } from "./components/app-rightmenu/app.rightmenu.component";
import { AppInlineMenuComponent } from "./components/app-inlinemenu/app.inlinemenu.component";
import { AppMenuComponent } from "./components/app-menu/app.menu.component";
import { AppMenuitemComponent } from "./components/app-menuitem/app.menuitem.component";
import { AppTopbarComponent } from "./components/app-topbar/app.topbar.component";
import { AppFooterComponent } from "./components/app-footer/app.footer.component";

// Demo pages
import { DashboardDemoComponent } from "./features/view/dashboarddemo.component";
import { FormLayoutDemoComponent } from "./features/view/formlayoutdemo.component";
import { TableDemoComponent } from "./features/view/tabledemo.component";
import { MenusComponent } from "./features/view/menus/menus.component";
import { EmptyDemoComponent } from "./features/view/emptydemo.component";
import { AppCrudComponent } from "./pages/app.crud.component";
import { AppNotfoundComponent } from "./error/app.notfound.component";
import { AppErrorComponent } from "./error/app.error.component";
import { AppAccessdeniedComponent } from "./error/app.accessdenied.component";
import { AppLoginComponent } from "./pages/app.login.component";

// Demo services
import { CountryService } from "./features/service/countryservice";
import { CustomerService } from "./features/service/customerservice";
import { EventService } from "./features/service/eventservice";
import { IconService } from "./features/service/iconservice";
import { NodeService } from "./features/service/nodeservice";
import { PhotoService } from "./features/service/photoservice";
import { ProductService } from "./features/service/productservice";

// Application services
import { MenuService } from "./components/app-menu/app.menu.service";
import { AppBreadcrumbService } from "./components/app-breadcrumb/app.breadcrumb.service";
import { ConfigService } from "./features/service/app.config.service";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { AccountModule } from "./features/account/account.module";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { ConfirmationService, MessageService } from "primeng/api";
import { ErrorInfoComponent } from "./error/error-info/error-info.component";
import { LoadingInterceptor } from "./interceptors/loading.interceptor";
import { RiskOccupancyLocationService } from "./risk-occupancy-location.service";
import { NgxCurrencyModule } from "ngx-currency";
import { NgDragDropModule } from 'ng-drag-drop';
import { QuoteModule } from "./features/quote/quote.module";
import { CreateClientComponent } from "./features/global/create-client/create-client.component";
import { SharedModule } from "./shared/shared.module";
import { ExternalPaymentComponent } from './public/external-payment/external-payment.component';
import { CategoryNamesService } from "./shared/category-names.service.ts";
import { SendMailComponent } from "./features/BrokerModule/send-mail/send-mail.component";
import { EditorModule } from 'primeng/editor';
import { AgmCoreModule } from "@agm/core";
import { ThemeService } from "./features/account/my-organization/theme.service";
import { GenerateAiComponent } from "./features/quote/components/generate-ai-dialog/generate-ai-dialog.component";
import { MailParsingAIComponent } from "./features/view/mail-parsingAI/mail-parsing-ai.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { ExternalQcrComponent } from "./public/external-qcr/external-qcr.component";
import { ExternalGmcQcrComponent } from './public/external-gmc-qcr/external-gmc-qcr.component';

FullCalendarModule.registerPlugins([dayGridPlugin, timeGridPlugin, interactionPlugin]);

@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        DynamicDialogModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        AccountModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarGroupModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ProgressSpinnerModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        KnobModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TagModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        NgxSpinnerModule,
        NgxCurrencyModule,
        InputNumberModule,
        SelectButtonModule,
        SharedModule,
        EditorModule,
        QuoteModule,
        NgCircleProgressModule.forRoot({
            // Default configuration for all progress bars in your app
            radius: 60,
            outerStrokeWidth: 10,
            innerStrokeWidth: 5,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300
          }),
        NgDragDropModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDshPQ0dxKnI9YK-uQDJETTjME8R9VklkE',
            libraries: ['places'] 
          }),
    ],
    declarations: [
        AppComponent,
        AppBreadcrumbComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppConfigComponent,
        AppRightMenuComponent,
        AppInlineMenuComponent,
        AppTopbarComponent,
        AppFooterComponent,

        DashboardDemoComponent,
        FormLayoutDemoComponent,
        TableDemoComponent,
        MenusComponent,
        EmptyDemoComponent,
        AppCrudComponent,
        AppLoginComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        ErrorInfoComponent,

        CreateClientComponent,
        ExternalPaymentComponent,
        SendMailComponent,
        GenerateAiComponent,
        MailParsingAIComponent,
        ExternalQcrComponent,
        ExternalGmcQcrComponent
    ],
    providers: [
        MessageService,
        // { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        CategoryNamesService,
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
        MenuService,
        AppBreadcrumbService,
        ConfigService,
        DialogService,
        RiskOccupancyLocationService,
        ConfirmationService,
        ThemeService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
