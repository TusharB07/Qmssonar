

#Broker  Kanban

Draft               | Requision         | Waiting for Approval      | Sent to Insurer       | QCR Stage         | Placed


#Insurer Kanban

Waiting for RM Approval   |     Underwriter Review         | Sent to Broker        |       Placed



# 14 / 10 / 2022 - Morning - UAT Deployment - Issue to be Resolved
1. Angular - All Occupancies and My Occupancies - Show My Occupancies First
2. Angular -The Quote Set should be unsubscribed and must not load repeatedly
3. Anuglar - Sum Insured Details Component in Requision Tab Loading Twice
4. Node - Send to Insurer Sector Id on Null
5. Angular & Node - Check All BSC dialogs are working
6. Anuglar - Broker Name in Quote Edit Page
7. Note - ILov Dropdowns Missing - Values in Default



# 17 / 10 / 2022
1. Risk Start Date and End Date in Draft Page and Insured Details Pop Fontend Backend Both - Partial
2. Backend Role Permissions - Partial
3. Insurer Validity Date - Pending
4. Draw IO Schema Update - LP - Pending
5. RM Readonly Validations - Pending
6.



# 23 / 10 / 2022
## 1. BSC - Burglary #12
 - Default "First loss %" should be 100% 
    ` Validation Currently on Submit `
 - It should be between 0 to 100
 ` Validation Currently on Submit `
 - We already decided that Stock will be from Breakup and cannot be modifiable ` Made Readonly `
 - View Breakup of All locations
    - Location should be Location name-City-Pin ` Done`
    - Link - "Download Sample File" and "Upload Excel Sheet" should be in one line ` Done`
    - Download sample file gives Exception ` Done`
## 2. FLOP #11
 - default for Indemnity Period should be 12 months. User may change it if required.
## 3. Location wise Breakup of Total Indicative Pricing #10
 - Where is Total Amount derived from?
 - Dont show Decimal for SI  ` Done`
## 4. Covers Opted cannot be toggled #9
 - Access denied error is shown on select/deselect of EQ-terrorism-STFI ` Fixed Permission issue in backend`
## 5. Edit Sum Insured Split #8
 - Location should be "Location Name-City-Pin" ` Done`
 - Dont show Decimal in SI amount. ` Done`
 - Tool Tip Doesnt show any value. ` Done`
 - We need to fit all the elements (as far as possible) in one visible area. User needs to scroll down to check the total of break entered to tally the location SI
 - The total should change on key down event, currently it is on focus out.
 - It should restrict to enter breakup more that total SI for the location
 - Upload breakup is not available ` On Hold `
## 6. Generate Quote - Indicative quote is not calculated #7
 - Indicative quote is not calculated. 
 - Upload of Risk Inspection & Location Photo not working. `On Hold`
## 7. Risk Location Occupancy - Selection #6
 - Page- Select Sector - Engineering Workshop 
 - Add Risk Location Occupancy Need Clarity on "My Occupancy" and "All Occupancy" (All Occupancy show occupancy with sector name in it)
 - enter eng in in search (on above image), the result shows empty ` E Must be Capital`
 - Same is the case with "My Occupancies" 
 - Dont Show Decimal in SI twice. ` Done`
 - Press Save without selecting location, it gives no indication. ` Done`
 - The card title should show "Location name-City-Pin", currently it is only showing "location name". Please Implement it as a standard all over ` Done`
 - "Risk Code" and "Rate Code" always show 1.
 -The card should be in one row and Pagination if all doesnt fit the view. ` Done`
 - Same location selected twice then it gives a Technical Error. Please provide a layman wording. Position of success message and error is different
 - Upload Location is Missing ` On Hold`
## 8. Font-Layout-element-width-hight #5
 - Require redefine styles (font/elements height and width) to fit most of the option in visibility area.

## 9. Dashboard - Cards  #4
 - Show Client name below product type ` Done`
 - The Swimlane from Kanban view should be in descending order. Latest data on top ` Done`

---

# 25 / 10 / 20222

1. Create Client Location 
2. Underwriter trail



---

# 26 / 10 / 2022

1. UI Scaling Discussion 
2. Risk start date should be greator than today
3. Risk Occupancy Search should not be case sensitive
4. Create client location save it, get back and select location
5. Add risk location validation more user friendly
6. Delete Location Occupancy Access for Broker Creator - ` Done`
7. Location Wise Breakup Scroll Visibility 
    - Pincode come on next line
    - Space after rupee sign
    - Where to show location wise total - UI Discussion - Rupesh (Designer)
    - Pagination 
    - Check why rate is comming zero .
8. Insurer Details Popup
    - Renewal Policy Period - 3 Months, 6 Months, 9 Months, 12 Months, 18 Months
    - All Fields will be readonly except - Renewal Policy Period,  CRM Arjun ID,
9. Every Cover Tooltip (i) must show its description on hover
10. Sum Insured Breakup Split
    - Add client side validations also
11. Risk inspection report Upload, Location Photographs Upload
12. Add * for higher value location or color
13. Total Indication Quote Quote Slip Pop 
    - Prepare data
14. Burglary & Housebreaking (including Theft & RSMD)
    - Default 100%
    - Location Name
15. Add more append down UI discussion - Rupesh (Designer)
16. Quote Slip
    - Load all covers calculation
17. Update in Send to insurer flow
    - Remove the UI for send to insurer in broker creator 
    - The broker approver will select the insurers and send it to insurers
18. New UI to create IC Contacts Mapping - Broker Admin
    - IC Name or Reference 
    - Contacts - Contact Name, Email, Mobile Number (No validation)


*Role:* Admin
*Email:* admin@inexchange.io
*Password:* Test@123
*Partner:* In Exchange

*Role:* Broker Admin
*Email:* anand@anandrathi.co.in
*Password:* Test@123
*Partner:* Anand Rathi Financial Services Limited

*Role:* Broker Creator
*Email:* broker_creator@anandrathi.co.in	
*Password:* Test@123
*Partner:* Anand Rathi Financial Services Limited

*Role:* Broker Approver
*Email:* broker_approver@anandrathi.co.in	
*Password:* Test@123
*Partner:* Anand Rathi Financial Services Limited

*Role:* Insurer RM
*Email:* mehdi.rizvi@libertyinsurance.in
*Password:* Test@123
*Partner:* Liberty General Insurance Ltd


# 31/10/2022

1. Underwriter Comparision - Paramaters and Mapping
2. Quote Slip Workflow after the QCR


# 2/10/2022

1. Get a mail and close discussion regarding the screen resolution size and update it to 1366×768 (6.22%) as base and not 1920×1080 (9.94%) and prepare futher UI screens in 1366×768 (6.22%) and reduce all metic value by 40-30%
2. 

---
# 4/10/2022

## Journey 1 - Bharat Laghu Udyam Suraksha
- Super Admin - Master Privilages - ` Done`
- Clone Data From Self Partner - ` Done`
- Broker IC Mapping and Quote Sequence - ` Done`
- Broker Client Creation - ` Done`
- Broker Draft Quote Creation - ` Done`
- Broker Generate Indicative Quote - ` Done`
- Broker Generate Quote Slip - ` Done`
- Broker Approval and Send to Insurer - ` Done`
- Insurer RM Review and Sent to Underwriter- ` Done`
- Insurer Underwriter Review and Sent to Broker - ` Done`
- Broker Quote Comparison and Select Quote to be Placed - ` Done`
- Broker Quote Placed Successfully - ` Done`


# 5/10/2022 

Note:Validation for PAN and GST - ` Done`
Insured Business --->> nature of business - ` Done`
logo on left as per partner login - ` Currently Proceeded with Static Logo`
in words put at down - ` Pending`
Preffered Insurred will be IC Name's - ` Done`
Change IC Selection option to Broker Approver
add Created date at Kanban view - ` Done`
To Broker Approver give View Quote button when it is stage to Send TO Ic(Next Week) - ` Done`
Show Preimum in IC Screen - ` Done`

Test
Similar testing On UAT


Error's
 
Client create given issue for visiting card and UI for drop down - ` Pending`
validation for breakup sumAssured show in top - ` On Hold - They are planning to change the structure of it`
terrorism put as a grey for readonly - ` Done`
burglary by default should be 100% - ` Done`
rsmd & theft Should be true in Excel - ` Unindetifiable Issue in node | Giving null value`
all location in not show in all locatiion Wise breakup in BSC - ` Done`
while save BSC we need to click 2 time to save BSC - ` Done`

---
# 7/10/2022

**Meeting:-** 12:25 PM

- Issues
    - Occupancy Search query regex not taking first word in search - ` Done`
    - State City Country Pincode Master have real data - ` Done`
    - Create client location in risk location occupancy dialog - ` Not allowing number in location name`
    - BSC Buglary RSMD, THEFT Default yes, Automatically create cover and calculations on entry of breakup - CHECK for burglary on UAT - HIGH - ` Need time to make cover calculation`
    - Money in Safe / Till, Money in Transit,Electronic Equipment, Fixed Plate Glass needs to save twise - LP - ` Done`
    - Preserve scroll on save - ` Needs more time`
    - Fixed Plate Glass View Dialog Values not loading - ` Done`
    - Risk Inspection Status Dropdowns
    - Deductibles/Excess PD - as Currency - ` Done`
    - Deductibles/Excess FLOP - as currency  - ` Done`
    - Deductibles/Excess MBLOP - as Currency  - ` Done`
    - Preferred insurer - show Insurers from IC mapping 
    - Quote Slip
        - Sum Insured / Sum assured is value entered in dialog
        - Net Premium which is calculated from the Backend  - ` Done`
        - GST - Default 18% on premium  - ` Done`
        - Total Premium = Net Premium + GST  - ` Done`

        - Below table show premium location wise eg. 2 or 4 as location occupancy dropdown
    - Quote creation popup Hurry spell check - ` Done`
    - Quote Warrentiescreation data and time in kanban - ` Done`
    - UAT - Create new broker with broker_inexchange.com
    - , Exclusions, Subjectivities make disabled - ` Done`
    - Decision Matrix Remove fields after target premium - ` Done`
    - Check for change in UAT
    - Show default (type1) quote slip to Insurer
    - Prepare underwitter users for liberty with level 1,2,3 - and give access to partner_admin to make their users
    - Underwriter UAT send for Approval - FIX



- Dropdowns Values
- User Mapping
    - Tenant
    - Tenant Domain
    - 

# 9/11/2022

1. Create Client Form
2. Burglary cover needed to be saved twice
3. Values for Risk Inspection dropdowns from Excel Sheet
4. Input Currency Focus Popup on All Input Currency Fields
5. Risk Management Tab in Insurer RM Screen for Fire Product
6. Role and Permission Module Initialization
7. Check for Bugs and Issues and Closures and Validation


* Create Client Form - ` Done`
* Pincode Mapping - ` Done`
* Quote Slip Covers Calcuation 
* Burglary Dialog - ` Done`
* Refresh 


UI Tasks 
- buttons
    - .btn : for giving it shape

    - .btn-lg : for button with more padding
    - .btn-sm : for button with less padding

    - .btn-primary : for blue button
    - .btn-primary-outline : for outline blue button
    - .btn-primary-fluid : same as outline button without outline

    - .btn.disabled, .btn:disabled : to make button disabled with grey and pointer disabled

    - Classes for button reference from bootstrap (.btn-primary, .btn-success)

    

- inputs
    - .form-control : give padding to the field and border to the field with base font size

    - .form-control:hover : give blue border 
    - .form-control:focus : give blue border 

    - .form-control-lg : give more padding and bigger font
    - .form-control-sm : give less padding and smaller font

    - .form-control:disabled : make input background grey and text grey 
    - .form-control:disabled:readonly : make input background grey but keep text readable

    - .form-control-plaintext : remove the border from the input box

    - .ng-invalid : give red text
    - .form-control.ng-invalid : give red border

- select 
    - .form-select : give padding to the field and border to the field with base font size
    
    - .form-select:hover : give blue border 
    - .form-select:focus : give blue border 

    - .form-select-lg : give more padding and bigger font
    - .form-select-sm : give less padding and smaller font

    - .form-select:disabled : make input background grey and text grey 
    - .form-select:disabled:readonly : make input background grey but keep text readable

    - .form-select-plaintext : remove the border from the input box

    - .ng-invalid : give red text
    - .form-select.ng-invalid : give red border 

# 10/11/2022

* Morning Standup Call 
* Bug and Issues Resolving 
* Client Meet

- Update in Risk Inspection Status & Claim Experience Tab For Broker - ` Done`
    - Values changed from List of value To Standard Dropdowns  - ` Done`
    - Also For Insurer Quote Edit Tabs  - ` Done`
    - Risk Inspection Status & Claim Experience Download and Upload reprepare keep disabled - ` Today` ` Done`

- BSC Dropdowns from List of value to Standard Dropdowns - ` Done`

- Risk inspection report(pdf), Location Photographs(image) all location based should be store in local strorage - ` later`

- Locatiton Wise Breakup From Sidebar 
    - Fix Arrows  - ` Tomorrow`
    - Text Align to Right Top  - ` Tomorrow`
    - Padding for 2 Columns   - ` Tomorrow`
    - Scrollable  - ` Tomorrow`

- Sum Insured Details
    - Property Value will be Total Sum Assured and Also Value Label to Total Sum Assured - ` Today` ` Done`
    - Change Premium to Total Permium - ` Today` ` Done`

- Quote Slip Sum Assured for Every Cover - ` Today` ` Done`

- Map Hypothetical as Free Text - ` Today` - ` Done`

- UI Scalling - ` Later`

- Remove Indicative Quote Tab for Laghu - ` Today` ` Done`

- In Other Details - Make Avg Premium as Total Premium - ` Today` ` Done`

- Insurer RM 
    - Risk Inspection Status (Last 2 Years) - Risk Inpection Report - ` Today` ` Done`
    - Show Uploads - ` Later`

- Create 4 Models Warrany Exclusion Subjective - Non Location Based - Product Aware and Tenant Aware - ` Later`

- Remove Lorem Ipsum if any where - ` Today` ` Done`

- Under Quote Must be Accessable for Specified Underwriter - ` Today` ` Done`

- QCR UI
    -   Particulars 
        - Remove Insured Name - ` Today` ` Pending`
        - Remove Policy Type  - ` Today` ` Pending`
        - QCR Insurer Quote Give Error  - ` Today` ` Pending`
        - Create Seperate Component For Placement Slip  - ` Today` ` Pending`
        - Show BSC Covers only with value more than 0 - ` Today` ` Pending`

- Underwriter Overlapping Validation - ` Later` 

- Show IC Mapping only if tenant type broker 
- Partner Will be created from Inexchange Admin


SERVER ERROR

- While sending quote to insuer - ` Today` ` Pending`

# 11/11/2022

*Inxchange Agent*
*Broker Admin*
*Email:* broker_admin@inxchange.co.in
*Password:* Test@123

*Broker Creator*
*Email:* liberty.agent@inxchange.co.in
*Password:* Test@123

*Broker Approver*
*Email:* liberty.agent1@inxchange.co.in
*Password:* Test@123

* Inxchange Insurer*
*Email:* libertyrm@inxchange.co.in
*Password:* Test@123

*Email:* libertyuw1@inxchange.co.in
*Password:* Test@123

*Email:* libertyuw2@inxchange.co.in
*Password:* Test@123

*Email:* libertyuw3@inxchange.co.in
*Password:* Test@123

Preprod Tenant and User Creation

# 16/11/2022

- Pending
    - Quote Slip All Calculation in a single api
    - Put current user id on quote created by
    - Tenant Id and Partner Id loading unidentical so the calculations are shown as 0
    - Page to Show Logged in Partner Profile for Admin's

- Required
    - Excel Upload and Download
    - Risk Inspection Image Upload
    - Claims Experience Box

- Change in BLUS
    - Every Cover can be a product by itself
    - Configurability based on calculations 
    - Admin workflows need discussions and proper validations
    - Mapping of Addons and Covers In Admin
- 
## Changes Done till Now

1. Risk Location Occupancy Is Master Filter and default selection to be My Occupancies and Is Master Check show occupancy from (self) InExchange
2. Seeder for Default List of Dynamic Value  for Breakup for Laghu 
3. Risk Start Date and End Date in Draft Page and Insured Details 4op Frontend Backend Both
4. Quote Slip Template One - Load All BSC Covers and GST and Net Premium Calculation
5. Based on risk start date filter the rates and manage calculations in backend
6. Backend Role Permissions - Initialize Roles based restirction for every user eg: only broker creator can create the quote
7. Resolved Tickets created on the git.inexchange.co.in depending on the clarity on given context
8. Make Location Name Constant as Location Name - Pincode in broker journey and insurer journey for laghu
9. Default values for few of the BSC Covers to be loaded by system
10. Covers Opted should be made readonly for Laghu in Frontend and Backend
11. UI Scale Down for 1366 x 768 Resolution
12. Create Client Location form and validation in Risk Location Occupancy Popup
13. Insurer Details Change Indemity Period from List of dynamic Values to Standard dropdown
14. Add * for Higher value Risk Location Occupancy
15. Internal Demo for Journey 1 - Bharat Laghu Udyam Suraksha
16. Created Date in Kanban Screens
17. True Master Data for State City Pincode Country
18. Quote Requsion Risk Inpection & Claim Experience Tab - List of Dynamic Values to Standard Dropdowns for Broker and Insurer for Laghu


# 18 /11 /2022

- Quote Slip Template One
- Partner Form 
    - GST Validation Response
    - Proper Validation
- User Form
    - Show Partner Dropdown if logged in role admin
    - Proper Validation
    - Role Based Restriction for Tenant Admin

# 21 / 11 / 2022

- Risk Location Report Upload
- Risk Locaiton Photos Upload

- Meeting


-- Risk Location Images - Per Image Description
# 22 / 11 / 2022 

As per task given

# 23 / 11 / 2022 

Standup Meeting - 11:00 - 11:30

- Photograph upload description size should be small - UAT - ` Done`
- Product From SI toSI validation should be greator than or equal to 0 - UAT  - ` Done`
- BSC Product Partner Show Covers based on Incoming mapping array in quote - UAT - ` Done`
- Node product and partner populate in product partner mapping - UAT - ` Done`
- Partner Disabled - UAT - ` Done`


Client Meeting - 12:30 - 13:45
    - Product Partner Mapping is Required

Meeting - 13:50 - 14:10

Lunch - 14:10 - 15:00

Meeting - 17:30 - 18:30

- Claim Experience Fix - ` Done`


# 24 / 11 / 2022

- Backend Image API - ask clarity
- New role as  creator & approver - ` Done`
- Total Indicative Quote Correction Total Premium and Base Premium - ` Done`
- Fix validation on touch - ` Done`

# 25 / 11 / 2022

- Permissions on Risk Inspection Report and Location Photographs Component - ` Done`
- Risk Inspection Report and Location Photographs Component in Insurer Screen
- Create toggle for product in admin - ` Done`
- Dynamic Cover loading from ts file - ` Done`
- Map Configuration from model for new covers in admin ui - ` Done`
- Link cover dialogs to each - ` Done`
- Correct the all cover location wise allBscCover
- Create Form for each


# 26 / 11 / 2022

 - Covers for Created - ` Done`
 - allBSCArray to locationBasedCovers - ` Done`

 - FLOATER_ADDON_STOCKS

 - All the breakup elements flagged as FLOATER_ADDON_STOCKS will be summed together and make the Sum Insuerd for Floater 
 - Lov Reference Multiple Values for Mapping - Later

 - Product Partner Model Tenant Aware ??

# 27 / 11 / 2022 

Step 1. On new breakup record is created FLOATER_ADDON_STOCKS as reference 
Step 2. Load all breakup Records with FLOATER_ADDON_STOCKS for this location
Step 3. Start value with current body value as this is in pre so current in not yet created
Step 4. Sum the values of all FLOATER_ADDON_STOCKS for this location
Step 5. Check for  FloaterCoverAddOn() if it is available
Step 6. If yes Update the cover with totalFloaterSumInsuredOfLocation value
Step 7. Else Create the cover with totalFloaterSumInsuredOfLocation value
Step 8. Check for all the covers available in this quote
Step 9. Check highest sum insured in floater
Step 10. set hightest sum insured as maximumValueAtAnyOneLocation


for(let i = 0; i < this.products.length; i++) {
    let newProductArray = [];
    
    let j = 0;

    newProductsArray[j] = [];
    newProductsArray[j].push(this.products[i])

    if(j % 4 == 0) {
        j++;
    }

}


- OTC Popup on condition

# 28 / 11 / 2022 - # 29 / 11 2022

Meeting 
    - Pan as PAN in partner form - Danish - ` Done`
    - Box Size same in quote draft page - Ravindra
    - Quote Draft Product Selected UI Change reduce opacity - Ravindra 
    - Only Fire readonly in griha - Danish
    - Take breakup from UI - Danish - Seeder
    - Total Indicative Quote - TOTAL PERMIUM as - Danish - ` Done`
    - Total Indicative Quote Amount Not Shown in first glism - Danish
    - BSC Cover Card - Danish
        - Base Premium - to be shown as Sum Insured - Danish - ` Done`
        - Total to be as Permium of location - Danish - ` Done`
        - Personal Accident Cover - Danish
            - Name remove as readonly and give free text - ` Done`
            - Age as conditional validation
        - Valueble - spell check - Danish - ` Done`
        - inspection report spell check - Danish - ` Done`
        - Size Limitation - 1MB - Danish - Later

    - Make card interface for trail - Danish - ` Done`

    - Claim Experience - Danish - Front End Backend - ` Done`
        - No. of claims - Integer - ` Done`
        - Nature of Claim - String - ` Done`
    - Risk Inpection Status Popup - Ravindra
        - Header Text Alignment

    - Quoteslip - Danish
        - Section Covers
        - Amount right align

    - Placement Slip Generate to be replaced with Pending Payment Status - Danish - Frontend Backend

    - Kanban page - Requsition - From Mail or google - Danish - ` Done`

    - Insurer - Danish - Frontend Backend
        - Pending Payment Stage 

    - SI Limit to be <= from < - Hasan
    - Erro Notification to be removed - Danish - ` Done`

    - Floater - Danish
        - Floater N/A Sum Insured N/A - Danish - ` Done`
        - Sum Insured to be from maximum - Danish - ` Done`
        - Stock Value Yes and No to be toggled from UI - Danish

    - All Currency Values to be right aligned - Ravindra

    - Risk Letter Header - Prudhvi - ` Done`



## On Breakup value change
1. On creation on FLOATER_ADDON_STOCK mapped quoteLocationBreakup value
2. It will check for all breakup values mapped on this location and do sum of all stockValues 
3. Create floater with respective data either update it
4. Loop around all the floaters and get highest stockValue 
5. set Highest stock value as Sum Insured for all the floaters

## On Save operation on Floater Form
1. It will send the array of all selected Locations
2. Delete all the floaters
3. For the location received in the array create new floaters
4. It will again check for all the values from breakup with respective location
5. Loop around all the floaters and get highest stockValue 
6. set Highest stock value as Sum Insured for all the floaters


# 30 / 11 / 2022
1. Seeder for griha
2. Correct the flow for OTC
3. QuoteSlip
4. Floater Sum Inusred 


## UAT Meeting

- Product Name

Bharat Laghu Udyam Suraksha	BLUS 
to 
Bharat Laghu Udyam Suraksha Package	BLUS

- Make users for Liberty 
- Alwrite Agent (Tenant: Broker)
    - agent.admin@alwrite.in - Broker Admin
    - agent.insurer@alwrite.in - Broker Creator And Approver
- Alwrite Insurer (Tenant: Insurer)
    - insurer.rm@alwrite.in - Rm
    - underwriter1.insurer@alwrite.in
    - underwriter2.insurer@alwrite.in
    - insurer.admin1@alwrite.in - Insurer Admin

Inxchange Agent
Broker Admin
Email: broker_admin@inxchange.co.in
Password: Test@123
 
Broker Creator
Email: liberty.agent@inxchange.co.in
Password: Test@123
 
Broker Approver
Email: liberty.agent1@inxchange.co.in
Password: Test@123
 
* Inxchange Insurer*
Email: libertyrm@inxchange.co.in
Password: Test@123
 
Email: libertyuw1@inxchange.co.in
Password: Test@123
 
Email: libertyuw2@inxchange.co.in
Password: Test@123
 
Email: libertyuw3@inxchange.co.in
Password: Test@123
 
Insurer admin
insureradmin@inxchange.co.in
Test@123

- Update
    - BSC Product Partner Configuration filter product based on Mapped Product

- Steps
0. Copy Data 
1. Product Partner Configration
2. Product Partner Cover Configuration
3. Broker Admin Quote Sequence 
4. IC Mapping

- From SI to SI in product configuration (HASAN)

- Product Flow
1. Login as Inexchange Admin
2. Go Product Master
3. Go to BSC

- Quote Premium Not calculating in Initail Calculation - ` Done`

- Personal Accident Cover Sum Insurered should be 5 L - ` Done`

- Valuation Certification Upload - Crud ` Later`

- Remove the OTC Notification POPUP Screen - and to be Shown if OTC is breaching the Validation - ` Done` ` Later Configurable`

- Quote Slip Correction 
    - Policy Type - Camel - ` Done`
    - IMD - Issue - - ` Done`
    - Correspondence Address - Issue
    - Quote Date - Date quote is created - ` Done`
    - Policy Inception Date - Risk Start Date - ` Done`
    - Hypotication if No show N/A - ` Done`

    - Sum Insured Details - GST @ 18% - ` Done`
    - Show Base Cover - Calculation of fire stfi eq tr - ` Done`


    - Quotation is valid for 15 days from the date of quotation Signed for and on behalf of the Client X, at - Take it to the bottom - ` Done`

    - Rs Sign in premiums - ` Done`

    - Add-on Covers - Sum Insured <-> Premium - ` Done`

    - Location Based Premium as -  Base Premium - ` Done`

    - Change Send to Insurer Button - Generate Proposal - ` Done`

- Proceed with Payment Dialog
    - Show online response - ` Done`

    - Instrument Transfer Amount - Amount - ` Done`

    - Risk Letter head Download Button and Go To Dashboard  - ` Done`

- Dashboard
    - After Quote Placed Just show Risk Head Letter - ` Done`

- Floater Cover Addon
    - Sum Insured to be highest from selected - ` Done`
    - If not selected show NA - ` Done`

- Quote Slip Dialog - Make Payment Button - ` Done`

- Bharat Laghu Udyam Suraksha Policy - OTC Mapping Not Showing



# 05 / 12 / 2022

Toggle Covers
- Disabled for All Products
- Enabled stif, eq and tr for product shortName FIPR 
- Enabled All for product shortName BGRP - Girha

# 06 / 12 / 2022

- Client Location Uploads
- Quote Location Occupancy Uploads

# 09 / 12 / 2022

1. Issue #34 - Insured Details Issue - ` Resolved`
1. Issue #35 - Select your client & get started Issue - ` Resolved`
1. Issue #36 - Risk inspection status and claim experience Issue - ` Resolved`
1. Issue #37 - Create Client Issues - ` Resolved`
1. Issue #43 - Bharat Sukshma Udyam Suraksha - Insured Details Issue - ` Resolved`
1. Issue #46 - Bharat Sukshma Udyam Suraksha - Covers Opted Issue(Fire) - ` Resolved`
1. Issue #47 - Bharat Sukshma Udyam Suraksha - Risk inspection status and claim experience Issue - ` Resolved`
1. Issue #50 - Bharat Griha Raksha Policy - Insured Details Issue - ` Resolved`
1. Issue #51 - Bharat Griha Raksha Policy - Covers Opted Issue -  ` Resolved`
1. Issue #54 - Bharat Griha Raksha Policy - Risk inspection status and claim experience Issue - ` Resolved`
1. Issue #56 - Bharat Griha Raksha Policy - Personal Accident Cover Issue - ` Resolved`
1. Issue #44 - Bharat Sukshma Udyam Suraksha - Covers Opted Issue - ` Covers needs to be disabled` ` Resolved`
1. Issue #42 - RM Issue - ` Resolved`

1. Issue #48 - Bharat Sukshma Udyam Suraksha - Declaration Policy Issue - ` Based on Indemity Period Calculation` - ` Resolved`
1. Issue #49 - Bharat Sukshma Udyam Suraksha - Generate Quote Slip Premium Issue - ` Based on Indemity Period Calculation`
1. Issue #45 - Bharat Sukshma Udyam Suraksha - Premium Calculation Issue - ` Based on Indemity Period Calculation`
1. Issue #52 - Bharat Griha Raksha Policy - Premium Calculation Issue - ` Based on Indemity Period Calculation`
1. Issue #53 - Bharat Griha Raksha Policy - Covers Opted Issue(Fire) - ` Based on Indemity Period Calculation`
1. Issue #55 - Bharat Griha Raksha Policy - Standard Addons Issue - ` Based on Indemity Period Calculation`
1. Issue #57 - Bharat Griha Raksha Policy - Generate Quote Slip Premium Issue - ` Based on Indemity Period Calculation`
1. Issue #58 - Bharat Laghu Udyam Suraksha Package - Generate Quote Slip Premium Issue - ` Based on Indemity Period Calculation`

1. Issue #39 - Burglary & Housebreaking (including Theft & RSMD) Issue - ` Require Backend Computation`
1. Issue #38 - Total premium Issue - ` Based on Partner Id Miss Matched`
1. Issue #40 - UI Issue - ` For UI Developer`
1. Issue #41 - RM Issue - ` Needs to put import and export permissions`


# 16 / 12 / 2022

1. Issue #16 - Add risk location validation more user friendly - ` Resolved`
2. Issue UAT - Quote Location Occupancy Excel Download 



# 21 / 12 / 2022

-  Issue #37
-  Issue #26


# 28 / 12 / 2022

*Steps to check OTC configuration*
1. On Generate Quote Number find productPartnerIcConfiguration
2. Check for productPartnerIcConfiguration on productId and brokerPartnerId
3. If no records found check with productId and selfPartnerId
4. If Found More than one record popup more than 1 Configuration found (as case not covered)
5. If No records found popup no Configuration found
6. If Only one record is Found and its Otc Type is BOTH then Check for its occupancyRules
7. If quote's quoteLocationOccupancy has occupancy in occupancyRules
8. And its sum insured limit is exceeded then make the quote NON-OTC 
9. If no rule is exceeded then keep it OTC
10. If Only one record is Found and its Otc Type is OTC then keep quote OTC
11. If Only one record is Found and its Otc Type is NON-OTC then keep quote NON-OTC
12. Generate Quote Number and update quote:isOtc = true | false
13. Save the Found Configuration in QuoteSlip Model so it can be used futher in the quote for Discount and other points


# 09 / 12 / 2022
1. Client Location Validation - locationName unique

# 28 / 12 / 2022

*Steps to check OTC configuration*
1. On Generate Quote Number find productPartnerIcConfiguration
2. Check for productPartnerIcConfiguration on productId and brokerPartnerId
3. If no records found check with productId and selfPartnerId
4. If Found More than one record popup more than 1 Configuration found (as case not covered)
5. If No records found popup no Configuration found
6. If Only one record is Found and its Otc Type is BOTH then Check for its occupancyRules
7. If quote's quoteLocationOccupancy has occupancy in occupancyRules
8. And its sum insured limit is exceeded then make the quote NON-OTC 
9. If no rule is exceeded then keep it OTC
10. If Only one record is Found and its Otc Type is OTC then keep quote OTC
11. If Only one record is Found and its Otc Type is NON-OTC then keep quote NON-OTC
12. Generate Quote Number and update quote:isOtc = true | false
13. Save the Found Configuration in QuoteSlip Model so it can be used futher in the quote for Discount and other points



# 09 / 12 / 2022
1. Client Location Validation - locationName unique, max 100 - ` Done`
1. Client Location Validation - address max 255 - ` Done`
2. All Sheets - Column Name should be locked and should not be changable
3. Quote Location Occupancy Validtion - Sum Insured should be number
4. Quote Location Occupancy Validation - Sum Insured should be betweeen Product partner configuration
5. Quote Locaiton View Breakup Download - Show Total Location Wise
6. Add Sheet validation for excel4node - 
7. Quote Locaiton Breakup Validation - Sum Insured Total should be exact
8. Bsc Buglary Divide by 100 to get percentage - ` Done`
9. Bsc Buglary Exception as Total Failed for particular location -
10. Risk Inspection Sheet Auto reload - ` Done`
11. Hypothecation Multi Input Field - ` Check`
12. Kanban Card show Broker Name - ` Check`
13. Insurer RM - Download All Excel MultiLocation Annexure 
14. Insurer RM - Sector Avg. Add-ons - ` Check `
15. Can Underwriter Edit any BSC ?
16. warranties exclusion tab hide for RM
17. Remove Warranties and descision matrix for RM
18. 


# 06 / 01 / 2023

 - Discount Flow
 - Add BMA Type in break 
 - Allow multipe reference in quoteLocationbreakup
 - QCR Quote Placement

# 11 / 01 / 2023

1) getting issue invalid _id while enter pincode  While create new partner.(Danish) - ` Done`
2) domain should apply for role in user creator based on partner(Danish)
3)Send Welcome Email to user while create(New) 
4) Age remove from user(Danish) - ` Done`
5) Add agent role agent_admin,agent_creator,agent_creator_approver(Done) - ` Done`
6) user admin cannot see their own user record(Danish)
7) Create IC RM Contact model fields IC,RM Name, RM Email,active,mobile no. and while send quote to IC it will check from this table and Show Ic name and their Email and check email will check user of RM and send otherwise it will directly go to UDr1(mehbooob,Danish)
8) give active field in Ic partner Mapping and remove effective from and TO - ` Done`
9) all in Occupancy Rules - ` Done`
10) give selection option of Bsc in product table which will max BSc and it will come to BSC product mapping based on product selection. ` Done`    
11) add active boolean field in all mapping - ` Done`


### Sheet Validation
- Client Location Sheet
  - Backend Structural Validation
    -  Headers Must be only Location Name, Address, Pincode, State, City
    -  Header Sequence Validation
    -  Location Name must not be empty
    -  Location Name must be unique
    -  Location Name must not be more than 100 Characters
    -  Address must not be empty
    -  Address must not be more than 255 Characters
    -  Pincode must not be empty
    -  Pincode must be from the Dropdown 
    -  State must not be empty
    -  City must not be empty
  - Backend Data Validation
    -  Location Name should be unique
    -  Pincode enteres should exist
    -  DB Validations
  - Operation
    -  On Download Sample Sheet
       -  Prepare the Sheet with existing client locations
       -  Lock the existing client locations
       -  Add Client Side Validations similar to Structural Validations
       -  Add Dropdown for Pincode and Auto Complete Lookup for State and City
    -  On Upload Sample Sheet
       - Parse the sheet and perform Backend Structural Validation
       - If passed perform Backend Data Validation
       - If passed return create new enteries of client location
       - OnError 
          - Recreated the Sample Sheet with user data
          - Append Catched Errors in the Sheet
          - Location the existing client locations  
          -  Add Client Side Validations similar to Structural Validations
          -  Add Dropdown for Pincode and Auto Complete Lookup for State and City
          -  Keep error cells unlocked

 
# 12 / 01 / 2023
- Role Restrict Type as Dropdown in roles 
- On Client Location Uploads Done show a toast - ` Done`
- Create ENUM for product template - ` Done`
- List of value product not showing in admin - ` Done`
- Buglary Permium Percentage Issue - ` Done`
- Toogle for Rates - ` Done`
j
# 13 / 01 / 2023

Discount - Payout, Amount  Will be 0
Discount - Base Premium totalIndicativeAmount we get from dicount

# 16 / 01 / 2023
View Location Wise Breakup in code - Left Align
Portable Equipment Not Uploading Not Uploading
RM In select change cover not toggling

# 21 / 01 / 2023
- Test Cases: Broker Creator Journey: Laghu Udyam Suraksha
    - DRAFT ------------------------------------------------------------------------------------
    - Create Quote as Draft
        - Select Product - ` Working`
            - Load Product From Product Partner Configuration - ` Working`
        - Select Client Location - ` Working`
            - Download Sample Sheet - ` Working`
            - Upload Client Locations - ` Working`
            - Validate Sheet Data - ` Working`
        - Select Occupancy - ` Working`
        - Insert Sum Insured Value   - ` Working`
    - Generate Indicative Quote
        - Initial Premium Calculation - ` Working`
    - REQUISION ------------------------------------------------------------------------------------
    - Sidebar
        - Quote Edit Popup
            - Renewal Policy Period - ` Working`
            - HO -` Working Need to set HO first in db`
            - CRM ID - ` Working`
        - Covers - ` Working`
        - View Location Wise Breakup 
            - Download Sample - ` Working`
        - 
    - Sum Insured Details Tab
        - Indicative Quote Card
            - Sum Insured Split Popup
                - Create and Update Breakup Value
                - Recompute BSC Buglary Based on Given Value
            - Total Permium
            - Base Premium
            - Sum Insured
        - Risk Inspection Report
            - Upload 
            - View
            - Delete
        - Location Photographs
            - Upload Multipe
            - Add Description
            - Delete
            - Upload More
        - Covers OPTED
        - Discount Base on OTC TYPE
    - Business Suraksha Covers
        - Fire Loss of Profit
            - Form - ` Working`
        - Burglary & Housebreaking (including Theft & RSMD)
            - Form - ` Working`
            - Upload
                - Validation
                - Recomputation
        - Money In Safe / Till
            - Form - ` Working`
            - Upload
                - Validation
                - Recomputation
        - Money In Transit
            - Form - ` Working`
        - Electronic Equipments
            - Form - ` Working`
            - Upload
                - Validation
                - Recomputation
        - Portable Equipments
            - Form - ` Working`
        - Fixed Plate Glass
            - Form - ` Working`
            - Upload - ` Pending`
                - Validation
                - Recomputation
        - Accompanied Baggage
            - Form - ` Working`
        - Fidelity Gurantee
            - Form - ` Working`
        - Signage
            - Form - ` Working`
        - Liability Section
            - Form - ` Working`
    - Risk Inspection Status & Claim Experience
        - Risk Inspection Card
            - Form (All Fields Required) - ` Working`
        - Claim Experience Card
            - Form - ` Working`
    - Other Details Form
        - Form - ` Working`
        - Hypothecation Detail - ` Pending Check`
    - Quote Review
        - Quote Slip
        - Print
        - Send for Approval
    - WAITING FOR APPROVAL ----------------------------------------------------------------------
    - Review Quote 
    - Verify Proposal
        - Online
            - Send OTP
            - Verify OTP
        - Offline
            - Download Form
            - Upload Form
    - Sent to Insurer
        - Insurer List from Configuration and IC from ICRM
        - Send to Insurers
    - SENT_TO_INSURER_RM -------------------------------------------------------------------------------
    - Edit and Send for Approval
        - Basic Details
        - Documents Uploaded
        - Sum Insured Details - ` Pending`
        - MultiLocation Annexure
        - Add On's
        - Business Suraksha Covers
        - Risk Inspection Status
        - Preview & Download
        - Rates Toggle - ` Pending Check`
    - SENT_TO_UNDERWRITER LEVEL 1 -------------------------------------------------------------------------------
    - Edit and Send for Approval
        - Basic Details
        - Documents Uploaded
        - Sum Insured Details - ` Pending`
        - MultiLocation Annexure
        - Add On's
        - Business Suraksha Covers
        - Risk Inspection Status
        - Warranties, Exclusion & Subjectives
        - Decision Matrix
        - Preview & Download
        - Rates Toggle - ` Pending Check` 
    - SENT_TO_UNDERWRITER LEVEL 2 -------------------------------------------------------------------------------
    - Edit and Send for Approval
        - Basic Details
        - Documents Uploaded
        - Sum Insured Details - ` Pending`
        - MultiLocation Annexure
        - Add On's
        - Business Suraksha Covers
        - Risk Inspection Status
        - Warranties, Exclusion & Subjectives
        - Decision Matrix
        - Preview & Download
        - Rates Toggle - ` Pending Check` 
    - SENT_TO_UNDERWRITER LEVEL 3 -------------------------------------------------------------------------------
    - Edit and Send for Approval
        - Basic Details
        - Documents Uploaded
        - Sum Insured Details - ` Pending`
        - MultiLocation Annexure
        - Add On's
        - Business Suraksha Covers
        - Risk Inspection Status
        - Warranties, Exclusion & Subjectives
        - Decision Matrix
        - Preview & Download
        - Rates Toggle - ` Pending Check` 
    - SENT_FOR_QCR ------------------------------------------------------------------------------------------------
    - View Quotes of Multiple IC
        - Select Quote for Particaular IC
        - Generate Placement Slip
    - PENDING PAYMENT ------------------------------------------------------------------------------------------------
    - Select Payment Method
        - Online 
            - Make Payment - ` Waiting`
        - Offline
            - Collect Payment Details
            - Payment Confirmation Screen
            - Payment Recieved Action
            - Show Risk Cover Letter
    - Quote Placed ------------------------------------------------------------------------------------------------



# 23 / 01 / 2023
- Unauthorize Error 401 - Needs cache clearance
- admin@inexchange.io - Login ---------------------------------------------
    - Configure Product
        - Bsc Covers 
        - Product Template
    - Partner 
        - Product Partner
    - Configuration
        - Bsc Product Partner - `WORK - If not found then return Bsc Covers all true which is mapped in product` - Done
        - Product Partner Ic Configuration
            - For Self
            - For Broker
    - Lov Reference Mapping
    - Check if agent roles are there or not --- 
- broker_creator@anandrathi.co.in - Login ----------------------------------------
    - Create Quote
        - Sector - Cement 
        - Client - Manav Trading
        - Type - New
    - DRAFT -----------------------------------------
        - Select Product
        - Upload Client Location
            - Backend Validation - `ISSUE - Pincode with ' required ` - Done
            - Frontend Auto Download - SOLVED
        - Quote Location Occupancy Upload
            - Backend Validation ` Working`
            - Frontend Auto Download - `ISSUE - Auto download not working` - Done
            - `MISSING - Total Sum Insured` - Done
        - Get Indicative Quote - ACTION
    - REQUSISION -------------------------------------
        - Sidebar
            - Location Wise Breakup Download
        - Tabs
            - `MISSING - Store selected location in localstorage for reload`
            - Sum Insured Details Tab
                - Download Quote Location Breakup
            - ...
            - Risk Inspection Download and Upload
            - Other Details - `PENDING - HYPOTHICATION` - Done
        - Policy Period Change 
        - REVIEW -------------------
            - Verify Proposal
                - Online - Working
            - Select Insurer
            - Send to Insurer
- mehdi.rizvi@relianceada.com - LOGIN ----------------------------------------
- SENT_TO_INSUER_RM -----------------
    - Basic Details
    - Document Updated
    - Sum Insured Details - ` Make Readonly for RM`
    - Multi Location Annexure
    - Addon's 
    - Business Suraksha Covers
    - Risk Inspection Status & Claim Experice 
        - Claim Experience  - ` Show blank and not NA`  - Done
        - Risk Inpection Report - ` Check working or now` - Done
    - Preview and Download
        - Send for Approval
- SENT_TO_UNDERWRITER A --------------------------
- 
    
- ......
- Pending Payment
- Don't Save Payment Mode

- OTC - ` Bsc Covers not visible for otc` - Issue Due to Total
- OTC Send for approval issue - `Was not working for offline verification` - Done


# 24 - 01 - 2023

## Testing For Laghu
LOGIN - SUPER ADMIN - admin@inexchange.io - 
- Configurations
    1. Set Product Configuration
        - Can Set the product Templated based on use case
        - Can set the Max Allowed Covers
    2. Allocate Product to Partner
        - Prepares the List for which product partner can create quote
    3. Manage Allowed Covers from Product specified to partner
        - If not configured the products will be refered from product master
        - 
    4. Product Broker Ic Configuration (OTC Configuration)
        -  Will have the default with self (system)
        -  Configure the IC Allocation for broker based on particular product
        -  Also Create the rule for OTC configuration
        -  
LOGIN - BROKER ADMIN - anand@anandrathi.co.in
    1. Broker RM Contacts

LOGIN - BROKER CREATOR - 
    1. Create New Client
        -  Fill the form
    2. QUOTE CREATION
        - Select Sector
        - Select Client Name
        - Select 

*Further Scope*
- Product Master
    - Remove From SI and To SI from Product Master
    - Remove Category
- Product Partner IC Configuration
    - Unique Constraint based on ProductId, brokerPartnerId, insurerPartnerId
- Create New Client
    - Remove Short Name from Required
    - Alter Quote Number as <ProductShortName>-<Year>-<Sequence>
- Quote Draft Page
    - Have a where clause to show the product whose ic configuration is done particular partner or system
- Quote Location Occupancy Upload
    - Try to bring INTRINSIC for sum insured based on ic configuration
    - If any error there will be no upload at any case - Give Check

*Issue*
- Create New Client 
    - Max limit for client name should be 255 - ` Done`
- Create Location
    - Name - Remove only number validation for UI also - ` Done`
- Quote Requision
    - Sum Insured Details Tab
        - Premium Keep text nowrap and decimal as fixed 2 - ` Done`
        - 

# 25 -01 - 2023


# 01 - 02 - 2023
- Floater Addon Dialog  
    - Send Sum Insured For Higher Selected
- Quote Slip
    - 


## Type 1
[
    {
        "Client Details": [
            {
                "key": "Type of Policy",
                "rfq": "Name",
                "insurer1": true,
                "insurer2": true
            },
            {
                "key": "InsurerName",
                "rfq": "Name",
                "insurer1": false,
                "insurer2": false
            }
        ]
    }
]
## Type2
[
    {
        "Client Details": {
            "Type of Policy": {
                "rfq": "Name",
                "insurer1": true,
                "insurer2": true
            },
            "Insurer Name": {
                "rfq": "Name",
                "insurer1": false,
                "insurer2": false
            }
        },
        "Sum Insured Detail": {
            "key": {

            }
        }
    }
]



KEYS                |       RFQ                 | Insurer 1                 | Insurer 2
Client Details
    Type of Policy  | Something                 | true                      | false
    Insurer Name    | Something                 | true                      | false




# 06 / 02 / 2023
`BUGS`
- Broker - Quote Slip Fire Dont show 0 for parent levels - `Done`
- Insurer - Breakup Invalid Data ` Due to Copy`
- Insurer - Floater Clause Should be resticted for RM - `Pridhvi`
- Insurer - UI - Select Location Dropdown 
- Insurer - Backend Review - Risk Managment Feature Copy - ` Hasan`
- Broker - Risk Managment Features Create issue

`MISSING`
- Insurer - Decision Matrix Data Missing - `Pridhvi`
- Insurer - All Documents - `Pridhvi`

`Changes`
- Broker - Buglary Breakup Prevent Auto Compute - `Harsh`


`QCR Fire`
- Client Details 
    - Type of Policy
    - Insured Name
    - Type of Proposal
    - <strong>Details </strong>
    - Name of Insurer
    - City of Insurer Office
    - DO No.
    - <strong>Current Policy </strong>
    - Expiring Policy Period
    - Policy Period
    - Policy Range Month / Year
    - Renewal Policy Period
    - Insured's Business
    - Risk Location/s
    - Risk Description
- Sum Insured Details
    - TODO:: FROM BREAKUP
- Risk Management Features
    - TODO:: FROM QUOTE LOCATION RISK MANAGEMENT FEATURES
- Risk Inspection Status & Claim Experience
- Add-ons
- Other Details

`TASK`
- Broker Wise Comparision On IC Side - ` Mehboob`


# 09 / 02 / 2023
 - Offline Payment Interface should be accessable by Insurer only
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/6 - ` Done` - `Pushed `
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/13 - ` Done` - Added to SI Field below Total
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/14 - Fixed Plate glass Upload - ` Unintentional - Values auto transforming to small case`
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/12 - Client Location Issue - 
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/16 - Location Occupancy Issue - ` Mehboob` - ` Done`
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/15 - Location Occupancy Issue - UI Error -Minor


# 10 / 02 / 2023
- Fire Claims and Risk management Screen, RM login. Not showing properly - `UI` - ` Done`
- Under writter Mapping - ` Done`
- For floater, it is not picking the highest stock
- Avg premium showing as SI value only - `UI` - ` Done`
- Location details not showing in Fire quote slip - ` Done`
- Boxes not dynamic, can't see values being entered - Fire - `UI`

# 13 / 02 / 2023
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/14 - Fixed Plate glass Upload - ` Unintentional - Values auto transforming to small case`
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/12 - Client Location Issue - 
- https://git.inexchange.co.in/himanshu/inx-gui/-/issues/15 - Location Occupancy Issue - UI Error -Minor
- For floater, it is not picking the highest stock


# 16 / 02 / 2023

# 17 / 02 / 2023
1. Claim Experince Broker Wise - ` Done`
2. Data Model
3. Underwriter Listing Status - ` Done`
    - Loop throung underwriter 1 to 10
    - If Found any user then show the record
4. Audit Log - ` Done`
5. Id Where every requried
6. Reject Ic Quote on Placement 


# 28 / 02 / 2023
- Seeder - ` Done`
- Copy for Partner - ` Done`
- Filter on the basis of dropdown 
- Api to be linked for 

# 01 / 03 / 2023
- IAR Sum Insured Details
    - Section II:Business Interruption (BI)
    - Fire Loss of Profit will be BSC Fire Loss of Profit (Flop)
        - INPUT : Gross Profit
        - DROPDOWN : Indmenity Period 
        - REFERENCE : Terrorism of Higher Sum Insured
        - BUTTON : Create / Update
    - Section II:Business Interruption (BI)
    - (B) Machinery Loss of Profit (MBLOP) * will be model machinarylossofprofitmodel
        - INPUT : Gross Profit
        - DROPDOWN : Indmenity Period 
        - REFERENCE : Terrorism of Higher Sum Insured
        - BUTTON : Create / Update

    - Section II:Property Damage (PD)
    - (B) Machinery/ Electrical Breakdown *
        - Reduction in sum insured on account of piping etc.
        - Percentage % Response Value
        - Save

 
# 03 / 03 / 2023
- Breakup on Insurer Side


# 04 / 03 / 2023
- New Filter in Quotes
    - Date - 3 Days
    - Product Wise Filter
    - Client Wise Filter
    - Insurer Wise Filter
- Search In terms of Quote No   
- Maybe if Export to Excel for Quotes

# 09 / 03 / 2023
1) In Sum Insured Details >> Under Indicative Quote on the left side card - ` Done`
	a) ADD Section Ⅰ: Property Damage (PD) 
	b) Sum Insured  with right side current quote  Location Sum Insured in Bold
2) In Sum Insured Details >> - ` Done`
	Total PD Sum Insured will be Sum Insured  of current quote  Location occupancy + Machinery/Electrical BreakDown Sum Insured
	
3) In (B) Machinery Loss Of Profit (MBLOP) Will show Gross profit only not premium - ` Done`

4) (A) Fire Loss Profit (Flop) * Will show Gross profit only not premium - ` Done`

5) Total BI Sum Insured  will be Machinery Loss Of Profit (MBLOP) gross profit + Fire Loss Profit (Flop)  gross profit - ` Done`

6) Total Sum Insured(PD+BI) will be Total PD Sum Insured + Total BI Sum Insured - ` Done`

IC View ---->

7) Sum Insured will be shown as we are having Broker side View and make sure RM can have read-only and UW can edit access - ` Done`

8) Broker-wise IC comparison
	--> Sum Assured Details Tabe after a breakup will Add Machinery/Electrical BreakDown of High sum Insured, Fire Loss Profit (Flop), Machinery Loss Of Profit (MBLOP) 
	
	---> Addons after Earthquake,STFI, Terrorism write Property Damage in Bold and show property damage Addons then same For Business Interruption
9) same as point 8 for QCR Comparison


# 13 / 03 / 2023

## Types of Bugs
- Performance Bug
- Secutiry Bug
- Unit Level Bug
- Functional Bug
- Usability Bug
- Syntax Error
- Compatibility Errors
- Logic Bugs

## Types of Testing
- Unit Testing - When the module is completed just test that much
- Functional Testing - Check for relational nodes of unit testing
- End to End Testing - Checking function or business logic based on what we check in functional testing
- Acceptance Testing - Validation the cases based on the clients requirement

## Blocks of Testing
- Number of Cases (8)
- Number of Passed Cases (6)
- Number of Failed Cases (2)

### Issues Worked 
- Issue #25 - Menus
    - Remove Delete From Every UI - ` Done`
    - All Master Enteries should have status active / in active - ` Partial needs more test and implementation`
    - Change Onboarding to User Maintainance for IC and Broker Admin - ` Done`
    - Remove Menus And Sub Menus Based on given case - ` Done`
- Issue #34 - Lov Master
    - Lov Record Issue - ` This as an issue due to invalid values in db`
    - Error in list after adding new value - ` Done`
    - It is a non product aware lov
- Issue #30 - Maste Grid View
    - Search and Filter dont work - ` Done`
    - Global Search Not Working - ` Partial`
- Issue #29 - Breakup Total Indicative Pricing
    -  Total amount to be removed from UI and excel sheet - ` Done`
- Issue #28 - BLUES Bsc Cover selector
    - Misfunction in cover selection if closed - ` Done`
- Issue #24 - Quotes Home Page
    - Remove revised quote option from Draft Quote - ` Partial`
    - Remove Images as currently no use of it - ` Done`
    - Revision Icon to be Altered - ` Done`
        - Confirmation on Quote review click - ` FEATURE :: needs  to be developed`
    - The date should be updated at and it null should be created at - `FEATURE :: needs to be developed`
    - Stop History back / forward navigation - ` Its a default browser functionality of tester not system code`

### Issues To be Worked
- Issue #37 - Sent to Insurer
- Issue #36 - Photograph Upload
- Issue #35 - Blues - Quote Slip
- Issue #33 - Blus Buglary
- Issue #32 - Guidelines for all pages
- Issue #31 - SI Split - Reopened
- Issue #27 - Login Page
- Issue #23 - Point need to be check

# 14 / 02 / 2023

Great lets setup labels and boards

Currently it has labels as 
- BLUES - Bug
- BLUES - Business Logic
- In Testing 
- Testing Complete
- UI asthetics
- New Requirement
- Show Stopper
- Scope Creep
- Additional Features

And Boards as 
- Open 
- Closed

As we are using the gitlab for handling issue we can have the labels as 
- Product Labels - BLUS, FIRE, IAR, BLUSP, etc
- Status Labels


*Minutes of Meeting* - 14-03-2023 01:00 PM - 01:40 PM - Danish, Himanshu
- LOV Master give the tenant name column in the table for admin login for all masters
- Breakup respective to stock
    - Recompute on stock value change after creating buglary also
- Master grid as primeng table should have no errors on filters or search everywhere
- Want Status Active / Inactive Everywhere and make a list where it is functional currently and later we can add correspondingly
- Umang and Himanshu will give list regarding the masters data entry the IC, Broker and Users will do and following should work correct seamlesly
- Restict the back and forth of the browser as shown in Issue #24 (If Possible)

*Minutes of Meeting* - 14-03-2023 02:00 PM - 02:30 PM - Danish, Mehboob, Prudhvi
- Discussed Points as dicussed in client meet 
- LOV Master Must have Partern Column and if we have time add for other tenantaware masters too. - *Mehboob* - *Prudhvi*
- Admin table must not have have any error if something is incomplete hide it or disable it for time and keep not  but should not give any error - *Harsh*
- Check for points if any in the sheet - *Mehboob* - *Prudhvi*
- Make dropdown product aware in bsc dialogs - *Danish*
- Breakup Upload - *Danish*
- BSC Recompute on Breakup change - *Danish*


##  More issue
*Minutes of Meeting* - 14-03-2023 06:00 PM - 07:10 PM - Danish, Prudhvi, Mehboob, Harsh
- UAT Deployment and Issue Closure
- Listing debounced issue and Task for tomorrow
    - Add created by id in dashboard filter as showing count based on global
    - Bsc Product Partner Populate not working
    - Total Premium of all Quotes card text is over flowing.
    - Admin filter getting lost on clicking on apply 
    - 
    - Check System based on sheet shared by umang
    - Work on pending task in issue and new scopes

# 15 - 03 - 2023
- SI Breakup Not Upload Working - ` Done`
- Dropdowns not showing - ` Partial`
- Remove unwanted fields from Addon Form

# 15 - 03 - 2023
- Insurer Configuration
    - Product Configuration
        - Make the cover configuratable based on product by admin
        - First make Fire stfi and terrorism ,eq in frontend 
        - Mandatory / Optional 
        - Show / Hide
        - Impact
            - Frontend - Generation
            - Frontend - Quoteslip
            - Frontend - IC Journey
            - 
    - Add Ons
        - Category - Property Damage - Business Interruption
        - Rate Type - Policy Rate, Perc of policy rate, Times of policy rate,Direct Rate
        - Addon Type Flag - Free, Condition Fix Paid, Condition Perc Paid, Paid
        - Product Aware
        - Tenenat Aware
        - Free Upto 5 Crs
        - Impact 
            - Admin Addon Cover Form
            - Proceed based on sheet 
        - Exisiting UI Usability
    - Additional Covers -
        - We can show hide dynamically at product level, tenant level, and quote level
        - Change Rates based for IC ?

    - Data Collection 
        - SI Split 
            - Give some proper note how it can be operated
            - Creation at system level is it getting copied at tenant level
        -  BSC Cover Dropdowns
            - To be done from lov by giving rates 
            - Copy to all tenant and rates managed at IC level
        - Remove Garbage From lov and divide it 
            - Lovs for Split
            - Lovs for BSC Dropdowns
            - Lovs for Risk Paramaters
                - Make it dynamic 
                - Make the logic ?
                - Do we have to make questions dynamic ?
        - 
        - Other Details and Risk paramters Tab will have dynamic form fields
    - Validations
        - SI Wise- Ready in otc configuration
        - Occupancy Wise- Ready in otc configuration
        - Geography (Pincode) - We dont have
        - User Wise - Ready in otc configuration
        - Check Validations
    - Underwriter
        - Assignment Logic - Not just pincode wise rest all it good
        - Assignment Logic - If Overlapping configuration which on to pick
        - Assignment Logic - Currently it will take more detailed configuration
        - Editing Rights   
            1. Can Edit rates - We have
            2. Provide discount - Not Have
            3. Deny Add ons - We have
            4. Deny covers - Have to make it 0
            5. Raise queries - We dont have
            6. Assign Subjectivities, Warranties, Exclusions - We have
            7. Reject Quote - We have
        - Decline right - Discussed but we dont have
        - Decision Matrix - TBD
    - Master we need upload 
        - Must have proper validation
        - Proper Sample Download
        - We'll device how we can
        - For Given in document
    - Users Hieracrhy configuration - TBD


# 16 - 03 - 2023
- *NEW FUNCTIONALITY* - Make Fire, STFI, Earthquate and Terrorism dynamically configurable at product level
- *UPDATE ON EXISTING* - In Underwriter Configuration add pincodes also
- *UPDATE ON EXISTING* - Underwriter can decline the quote
- *UPDATE ON EXISTING* - Seperate Lovs in 3 Different Menus as SI SPLIT, BSC Cover Dropdown, Other/Risk Paramaters Dropdowns
- *UPDATE ON EXISTING* - OTC Configuration should be also on based on geography (pincode)
- *UPDATE ON EXISTING* - Do rectification of Addon List and Form in admin
- *NEW FUNCTIONALITY* - Uploads for Occupancies in Admin
- *NEW FUNCTIONALITY* - Uploads for EarthQuotes Rates in Admin
- *NEW FUNCTIONALITY* - Uploads for Terrorism Rates in Admin
- *NEW FUNCTIONALITY* - Uploads for Addon in Admin
- *NEW FUNCTIONALITY* - Uploads for Subjectivites
- *NEW FUNCTIONALITY* - Uploads for Warranties
- *NEW FUNCTIONALITY* - Uploads for Exclusion
- *NEW FUNCTIONALITY* - Risk Paramters and Other Details Form should be dynamic

## Make Fire, STFI, Earthquate and Terrorism dynamically 



- Accompanied Baggage Issue if one record is removed 

# 17 / 03 / 2023
- Seperate List of Values in 3 Parts - LP - 
    - At least make 3 pages each loading same as list-view-component - ` Prudhvi` - ` Mehboob`
    - But with different name as  ` Prudhvi` - ` Mehboob`
    - si-split-list-view-component ` Prudhvi` - ` Mehboob`
    - dropdown-list-view-component ` Prudhvi` - ` Mehboob`
    - risk-paramter-list-view-component ` Prudhvi` - ` Mehboob`
    - Later we will segragate the form - ` Danish`
- If quote is in pending payment broker approver must only see quoteSlip ` Prudhvi` - ` Mehboob`
    - We have to move current function to operations role of IC admin at pending payment ` Prudhvi` - ` Mehboob`
    - Make the changes in sub-view-kanban, sub-view-table, dashboard ` Prudhvi` - ` Mehboob`
    - Must be operational ` Prudhvi` - ` Mehboob`
- Check for the cause of the Issue - BLUES - Laghu package - QCR quote slip ` Prudhvi` - ` Mehboob`
- Check for the cause of BSC Accompanied Baggage Issue - ` Danish` - ` Done`
- Sum Insured Split - Upload - ` Danish`
- Addon Cover Curd Rectification - ` Danish` - `Done`
- Make auto copy action on check by admin - LP - ` Danish`

- Disable Button of BSC Cover Download in quote Draft - ` Danish` - ` Done`
- Check the same BLUS - laghu package - upload risk location occupancy sheet - ` Harsh`
- And keep eye on - https://git.inexchange.co.in/himanshu/inx-gui/-/issues



*Today's Executions by our team*

We resolved these issues todays
- Issue #49 - Resolved
- Issue #48 - Resolved
- Issue #47 - Resolved
- Issue #46 - Resolved
- Issue #42 - Resolved
- Issue #41 - Resolved
- Issue #40 - Resolved
- Issue #39 - Waiting for clarity

Work regarding the scope we got from Master Menu Workflow Sheet
- Addon Cover Rectification
    - Refactored the List view based on desired format
    - Refactored the Form view with proper dropdowns
- Made the workflow for Insurer Operations Role
    - To accept payment and generate risk letter head
- Seperated the List of Values in 3 Parts as 
    - List of values for SI Split
        - Will show value for Breakup L1, L2, L3, L4
    - List of values for BSC Dropdowns
        - Will show value for bscPortableEquipmentType,BscFixedPlateGlassType,BscAccompaniedBaggageType,BscFidelityGuranteeRiskType,BscSignageType, BscLiabilitySectionRiskType, 
    - List of values for Risk Paramters
        - Will show values for renewalPolicyPeriod,QuoteAgeOfBuilding,QuoteConstructionType,QuoteThreeYearLossHistory,QuoteFireProtection,QuoteAmcForFireProtection,QuoteDistanceToNearestFireBrigade,QuotePremisesFloor

# 18 / 03 / 2023
- Check for dashboard based on umangs sheet
- The form must not allow to enter characters more than its limit
    - Eg if limit is 10 then 11th value cannot be inserted 
- UI asthetics 
    - Everywhere the currency should be right aligned
    - If Rs is given in header should not show in every field


*Meeting *
- Blues QCR 
    - Show Proper Insure Name
    - Remove NA From Insured Name and show Insured Name
- Audit Trail 
    - Make the some what similar to git
- Clear all the issues
- Master, UI - Asthetics and Bugs - To be done currently


# 20 / 03 / 2023
*Things we need to make sure are available and should work properly*
1. Masters - Single [Insert / Update]
    - Remove Delete operation from Every Admin Crud
    - Status - Active / Inactive Should be maintained
    - Field level right to modify or restict
        - Eg: Only rates must be editable rest all will be readonly
    - Field Level Search and Global search should be working everywhere
    - On Create or Update of [self] should update for all intermediaries [broker,agent]
2. Audit Trail
    - There must be properly readable UI
3. Operation Role
4. Dashboard
5. Uploads of Master
6. Guidelines for all pages
    - Textbox length should restricting user from inserting values more than allowed
    - Number should be right aligned everywhere
    - Rs sign should in header where every possible to reduce the UI clutter
    - SI should not have decimal anywhere
    - Location display should be maintainer in ASC alphabatically everywhere
    - Higher Sum Insured Location should be highlighted with *
7. SI Split 
    - Client Form
    - Download Sample
    - Bulk Upload

*Masters we require auto copy*
If changed for In Exchange must copy for all intermediaries
*Note:* IC can change his rates so his rates should not be overwritten and intermediaries should be restricted from create/update
- BSC Rates
- Addon Covers Rates
- Occupancy Rates
- Earthquake Rates
- Terrorism Rates


*Master management tenant wise*
(We have to maintain certain constraint ic can only change rate, description and others fields should be readonly)
- BSC Covers - self - insurer
- Underwriter - insurer
- Exclusions - insurer
- Subjectivites - insurer
- Warranties - insurer
- Addon Rates - self - insurer
- Occupancy - self - insurer
- Earthquake - self - insurer
- Terrorism - self - insurer
- OTC - self  

*All Tasks (depenedencies and notes)*
- Audit Trail - Node
    - Populate the id parameters and return response in label,value
    - Filter the unwanted key by making filterArray as ['__v',...] to elimiate if more records
- Audit Trail - Angular
    - Improve the User Interface
- Operation Role Kanban- Angular
    - Swimlane - Online Pending Payment Quotes - Open Quote Slip
    - Swimlane - Offline Pending Payment Quotes - Open Screen of payment accepted or not
    - Swimlane - Quote Placed - Open RM Edit Screen with tabs as 
        - Basic Details
        - Documents Uploaded
        - Preview & Download
        - Risk Head Letter
- Risk Head Letter - Angular
    - Populate the actual value for static values like [quote number] and [Risk start date]
- Masters - Node
    - Auto copy for models with rates for intermediaries
- Masters - Node
    - Status Field for all masters
- BSC Cover Master - Angular
    - Only self can create a new record and will be copied for all intermediaries
    - Insurer can update only rates and all fields will be readonly
    - Proper filters and search in list view 
    - Proper Form Validation
- Underwriter Mapping Master - Angular
    - Insurer can create or update 
    - Proper Form Validation
    - Proper filters and search in list view 
- Exclusion, Warranties, Subjectivities Master- Angular
    - Insurer can create or update 
    - Proper Form Validation
    - Proper filters and search in list view 
- Addon Cover Master - Angular
    - Only self can create a new record and will be copied for all intermediaries
    - Insurer can update only rates and all fields will be readonly
    - Proper filters and search in list view 
    - Proper Form Validation
- Occupancy Master- Angular
    - Only self can create a new record and will be copied for all intermediaries
    - Insurer can update only rates and all fields will be readonly
    - Proper filters and search in list view 
    - Proper Form Validation
- Earthquake Master- Angular
    - Only self can create a new record and will be copied for all intermediaries
    - Insurer can update only rates and all fields will be readonly
    - Proper filters and search in list view 
    - Proper Form Validation
- Terrorism Master- Angular
    - Only self can create a new record and will be copied for all intermediaries
    - Insurer can update only rates and all fields will be readonly
    - Proper filters and search in list view 
    - Proper Form Validation
- Guidelines for all Pages - Angular
    - Textbox length should restricting user from inserting values more than allowed
    - Number should be right aligned everywhere
    - Rs sign should in header where every possible to reduce the UI clutter
    - SI should not have decimal anywhere
    - Location display should be maintainer in ASC alphabatically everywhere
    - Higher Sum Insured Location should be highlighted with *
- TAT Calculation - Node
    - Make records of when each state changed for the quote
- TAT Presentation - Angular
    - Based on the response of TAT Model present UI
- OTC / NON OTC Breach Popup - Node 
    - Api to return why otc response
- OTC / NON OTC Breach Popup - Angular
    - Popup before generate quote slip why NON-OTC 
    - Will only show for if configuration type both
- Discount IC
    - Insure side discount action
- Downloader
    - Generate a complete excel with all the details of the quote
- Upload of Masters
- Payment Gateway Integration
- Policy Number Update


# 21 / 03 / 2023
*Minutes of meeting - 21 / 03 / 2023 - Mehboob, Prudhvi, Harsh, Danish*
- Operation Role - *Mehboob*
    - Swimlane - Online Pending Payment Quotes - Open Quote Slip
    - Swimlane - Offline Pending Payment Quotes - Open Screen of payment accepted or not
    - Swimlane - Quote Placed - Open RM Edit Screen with tabs as 
        - Basic Details
        - Documents Uploaded
        - Preview & Download
        - Risk Head Letter
- Why OTC Popup - *Prudhvi*
    - Why otc popup on generate quote button based on selected otc configuration
- Risk Head letter - *Prudhvi*
    - Make values as per selected quote
- SI Split - *Danish*
- Pre prod Deployment - *Danish*
    - Upload 
    - Download
    - Form 
- Dashboard - TAT - *Hasan*
    - Functions to capture the 4 types of TATs
    - make an api as getBrokerTat()
        - Will return tillRequision, tillApproval, tillQcr, tillPendingPayment, tillPlaced
        - For each state the function must return as
        {
            tillRequision: 23,
            tillApproval: 6
            tillQcr: 8
            tillPendingPayment: 5
            tillPlaced: 3
        }
        - The above values are the in hours the time taken for all the quote to reach till state
        - Make it in a way we need to assign filter based on product wise, insurer wise , user wise, product-insurer wise


# 22 / 03 / 2023
*Minutes of meeting - 22 / 03 / 2023*

mongodump --uri=mongodb://AdminInexchg:AdminInexchg3214@3.6.8.195:27017/inexchg?authSource=admin --out=preprod_dump

mongorestore --uri=mongodb://AdminInexchg:AdminInexchg3214@43.204.209.164:27017/inexchg_backup_230320231119H?authSource=admin  preprod_dump/inexchg

mongorestore --uri=mongodb://AdminInexchg:AdminInexchg3214@43.204.209.164:27017/inexchg?authSource=admin  preprod_dump/inexchg

<!-- mongorestore --uri=mongodb://AdminInexchg:AdminInexchg3214@43.204.209.164:27017/inexchg_backup_230320231119H?authSource=admin  preprod_dump/inexchg -->



lovIdentity must be added while create  


TODO : payment details saved popup

TODO: Once payment method save then should show popup payment method already selected


# 28 / 03 / 2023
- Payment Details Confirmed Dialog Creation
- Show Payment Details Confirmed Dialog if payment mode selected
- Else Show Hightlight to broker approver that he is pending with paymentMode Selection
- And let broker approver select the payment mode
- Add Warranties, Subjectivities and Exculsions in 
    - Fire Quote Slip
    - Blus Quote Slip
    - IAR Quote Slip
- Popup for insurer sent to underwriter must be logical 


# 30 / 03 / 2023
Issue for Risk management Features
1) In Quote slip it is not showing proper ---Hasan
4) Risk head letter policy period is not showing proper --- Mehboob
2) In Ic Side On Location Change Risk management Features not reflect  --- Danish - ` Done`
3) In Brokerwise Comparison showing console error for Risk management Features -- Danish - ` Done`
5) Remove Industry Average Quote card --- Danish - ` Done`


# 24 / 04 / 2023
- Material Damange Section - Ignore the Machinery Breakdown and show total of all other breakups of all location
- Machinery / Electrical Breakdown - As per new structure and calculation
- Total PD
- Higher location terorism in right side cards 
-


# 27 / 04 / 2023
## Laundry List Frontend End
- Structural Improvement (Refactoring)
    - Proper navigation of page components thoughout modules
        - As there is old code of Broker and Insurer Module which should be eliminated
        - And quote related components should be in side quote module
        - And if intermediary and Insurer and Admin Seperation is required then we'll do
    - Proper naming of components 
        - As Card Should be suffixed with <componentName>-card
        - As Cards Should be suffixed with <componentName>-cards
        - Dialog Should be suffixed with <componentName>-dialog
        - Form should be suffixed with <componentName>-form
        - Forms should be suffixed with <componentName>-forms
        - List / Table should be suffixed with <componentName>-list
        - And If product specific then should be prefixed with <productName>-<componentName>
        - And if Sub Template then should be prefixed with  <componentName>-sub-template-<productName>
    - The directory structure will be specific to Module as Quote  Module / Admin Module / Commmon  Module/ Account  Module
- Service Call Improvement (Refactoring)
    - Proper Naming of Services and function should be coherent
    - The Request and response type should be genunine for additional functions
- General Component Level Improvement (Refactoring)
    - TS File
        - Coherent naming of variables and functions
        - Follow incremental and grouped apprach for declaring the function and variable
            - Eg. There should not be here and there of function as developer must not go up and down to search every function
        - Proper use of Interface and Enums where ever possible as it will prevent us from runtime exceptions 
        - Keep proper use of @Input() and @Output() and Model for better usability
    - HTML FILE
        - Keep minimal and donot put ant business logic (prgramming) in html file
        - All programming should be in TS File
    - SCSS FILE
        - Do not keep any CSS in component level scss file as we are using lazy loading so it changes the view after load and give side effects on UI if used ng-deep
        - 
- Dialog Component Level Improvement (Refactoring)
    - Dialogs Should be specific to render the form component or card component or raw component
    - There should be not heavy business logic in the dialog components

- Form Component Level Improvements (Refactoring)
    - TS File
        - Must have proper form functions and variable and services
        - Every form should be independenent to its componenent 
        - Any any componenent is having multiple forms then must be surffixed with <componentName>-forms
    - HTML File 
        - UI Aesthetics guidelines should be followed 
        - Proper Validations and Field Type of every form control must be coherent
- Developer Duties
    - Keep the code commented as
        - Every Function Name and variable Name must be straightforward
        - Every new change before the commit must be marked with ticket url / ticket number
        - If left pending or partial commit keep a comment as TODO: <DeveloperName> - <TicketNumber> - <Message>


# 28 / 04 / 2023
- Logged In Broker Creator
- Draft quote with broker creator Using Client As Test Client Alwrite
- Select Product as Fire
- Upload Quote Location Occupancy Via Excel
    - Cement Factory - 110008 - ₹ 10,00,00,000
    - Cement Factory 2 - 400005 - ₹ 2,00,00,000
    - Cement Factory 3 - 134107 - ₹ 4,00,00,000
    - Cement Factory 4 - 400061 - ₹ 8,00,00,000
- Compute Total Sum Insured - ₹ 24,00,00,000
- Generate Quote Slip - Total Permium - ₹ 3,66,200.00
- Toggle Covers
    - Cement Factory -    [x]Fire, [-]Earthquake, [x]STFI, [x]Terrorism
    - Cement Factory 2 -  [x]Fire, [x]Earthquake, [-]STFI, [x]Terrorism
    - Cement Factory 3 -  [x]Fire, [x]Earthquake, [x]STFI, [-]Terrorism
    - Cement Factory 4 -  [x]Fire, [x]Earthquake, [x]STFI, [x]Terrorism
- Total Premium Recomputed as - ₹ 3,36,200.00
- View Location Wise Breakup - Working UI
- Indicative Quote Details
    - 03 Months Premium - ₹ 84,050.00
    - 06 Months Premium - ₹ 1,68,100.00
    - 09 Months Premium - ₹ 2,52,150.00
    - 12 Months Premium - ₹ 3,36,200.00
    - 18 Months Premium - ₹ 5,04,300.00
- ADD-ONS, COVERAGES & CLAUSES
    - Flexa Covers
        - 24 Covers Allocated
    - Conditional Free Addons
        - Upto 54 Covers Allocated
    - Sector Average Addons
        - Added Floater Clause as 
            - ₹ 40,00,000 and Got premium as ₹ 786.00
- Total Premium Recomputed as ₹ 5,05,086.00
- SI Upload
    - Not Working due to special character in Header Error in Query
    - Sequence should be proper
    - 


# 02 / 05 / 2023
Products
- BLUS - Different
    - BLUSP - Condition / Cover
    - Griha - Condition / Cover
    - BSUSP - Condition / Cover
    - OTC / NONOTC
- FIRE - Different
- IAR - Different

Code Architechture
- Stage
    - Draft
    - Requisition
    - Waiting for Approval
    - Sent To Insurer - COPY OF SQL RECORD
    - QCR 
    - Pending Payment
    - Placed

    1 Quote - 5 Quotes

Tenants
- Intermediary - Broker and Agent
    - Draft - Broker_Creator, Broker_Creator_and_Approver, Agent_Creator, Agent_Creator_and_Approver
    - Requisition - Broker_Creator, Broker_Creator_and_Approver, Agent_Creator, Agent_Creator_and_Approver
    - Waiting for Approval - Broker_Approver, Broker_Creator_and_Approver, Agent_Approver, Agent_Creator_and_Approver
    - Sent To Insurer - COPY OF SQL RECORD
    - QCR 
    - Pending Payment
    - Placed
- Insurer
    - RM Review
    - Underwriter Review 
        - Level 1
        - Level 2
        - Level 3
        - ...
        - Level 10
    - Pending QCR
    - Pending Payment
    - Quote Placed
    
- 



# 04 - 05 - 2023

## Change
- `Done` Fire Indicative Quote Card - 
    - `Done`  Total Indicative Quote -> Total Indicative Quote For All Location 
    - `Done` Base Premium -> Location Premium
- `Done`  SI Split - All Products
    - (B) Machinery/Electrical Breakdown Damage -> (B) Machinery/Electrical Sum Insured
- Fire - `Ask Hasan` 
    - (B) Machinery/Electrical Breakdown Damage - Sum Insured -> BMA Flagged
- IAR - `Ask Hasan`
    - (B) Machinery/Electrical Breakdown Damage - Sum Insured -> BMA Flagged -> Machinery
- `Done` For Location Specific Dialogs 
    - Show Location Name in Dialog
        - Section Conditional Paid Addons
        - Flexa Covers
        - Etc
- `Done` Upload Location Photograph Should Allow one at a Time
- `Done` QuoteSlip 
    - 
- Quote Review Page
    - Back Button and Requsition Page will not be page will not be visible if quote is verified
- `Done` Sent to Insurer Dialog 
    - Keep Quote Text and Sub text of different sizes
- RM View - ` Required Discussion`
    - By Default Higher Location In Dropdown
    - Multi Location Annexure
        - If floater selected
            - Max Stock at Single Location - Show Stock of higher location
            - Total Floater Show SI of floater
            - Total SI -> Sum Insured
        - Remove including 10% text
        - Collect Excel for Grid
    - Addons
        - All boxes to be of same size
- `Done` Other Details
    - To be Exact as Broker
- `Done` On Quote sent to underwriter by RM
    - Keep title as 
        - Your quote has been sent to underwriter
    - Sub Title
        - Quote has been approved by you
- `Done` On Quote sent to underwriter 2 
    - Keep title as 
        - Your quote has been sent to next underwriter
    - Sub Title
        - Quote has been approved by you

## Issue
- `Done` Risk Management Features Make Save Link -> Save Button and View All Button - `Rushabh `
- `Done` Make a Save Toast on Every Form Save
    - Other Details - ` Rushabh`
- `Done` Conditional Paid Addons Dialog
    - Current Format Should be Indian - ` Rushabh`
- `Done` Quote Slip
    - Correspondence Address Not Visible - ` Mehboob`
    - SI Split - Remove decimal from sum issured - ` Mehboob`
    - Location Address Table Current Format Invalid - ` Mehboob`
        - No Comma
- RM View
    - Basic Details 
        - Head Office Address Not Showing - ` Partial`
        - `Done` Change Label - Sum Assured -> Sum Insured
        - `Done` And Currency Format Invalid

    - Document Updated - Alignment - Cosmetics
    - `Done` Sum Insured Details
        - Remove Collapse
- `Done` On sent to underwriter keep the state maintained - NEED HIGH INSPECTION as premium is also changed
- The Premium is Changed when quote to sent Underwriter
- `Done` Change Underwritter -> underwriter every where in code
- `Done` RM Warranties 
    - Other Textbox Overflow
    - Save Button Must be Proper button

- RM other Details Should be exact as for broker
    - Check for placeholders also
- `Done` On proceeded remove the Toasts 
    
## Suggestion
- Quoteslip 
    - Addons should be shown as Paid an non paid
- Select Insurer
    - Keep All Insurer Selected And First RM as Default
- 


# 05 / 05 / 2023

## Danish
- SI Split - All Products
    - (B) Machinery/Electrical Breakdown Damage -> (B) Machinery/Electrical Sum Insured
- Fire 
    - (B) Machinery/Electrical Breakdown Damage - Sum Insured -> BMA Flagged
- IAR
    - (B) Machinery/Electrical Breakdown Damage - Sum Insured -> BMA Flagged -> Machinery
- Quote Review Page
    - Back Button and Requsition Page will not be page will not be visible if quote is  verified
    `Make redirection to Review Page if proposal verified`
- Change Liberty to Name

## Mehboob
- Quote Review Page
    - Back Button and Requsition Page will not be page will not be visible if quote is verified
    `Make a singular backend field to identify proposal verified or not`
- MIS Issues 
- Quote Details Head Office Location on Both Broker and Insurer Side

## Suraj
- Fire Indicative Quote Card - 
    - Total Indicative Quote -> Total Indicative Quote For All Location 
    - Base Premium -> Location Premium
- RM Warranties 
    - Other Textbox Overflow
    - Save Button Must be Proper button
- Risk Management Features Pop to be Contextualized

## Rushabh
- For Location Specific Dialogs 
    - Show Location Name in Dialog
        - Section Conditional Paid Addons
        - Flexa Covers
        - Etc

## Prudhvi
- Upload Location Photograph Should Allow one at a Time

*MOM - 12:30 - 13:30 - 05-05-2023 - Umang, Danish*
## Changes
- Broker Wise Comparision
    - Client Details
        - `Done` Insured Name on All Quotes
        - `Done`Risk Location/s - Will be number of location
        - `Done`Expiring Policy Period will be only for Renewal Quote
        - `Done`Remove Renewal Policy Period
    - Sum Insured Details
        - `Done`Add Total Insured in Top - Total Sum Insured
        - `Done`Higher Location Sum Insured - Highest Location Sum Insured
        - `Done`Add Line Break
    - `Done`Change Addons Tab to Coverage and Addons
    - `Done`Bring Addons Above Risk Management Features
    - Other Details
        - `Done`Reference From Broker Other Details
        - `Done`Check format of quote submission date
        - `Done`Remove Prefered Insured
- Underwriter Review
    - Document Uploaded
        - `Done`Show Empty Message
    - Addons
        - Make a Card of Total Addons 
            - Addon Covers - Show Premium as Currency
    - Warrenties and Exclusion
        - Make + and - For others
        -`Done` Other text must not be show for Others
        - Keep List Maintained For Others
    - Decision Matrix 
        - `Done`Quote Submission Date will Be readonly
        - `Partial (Backed neeeded)`Add One More Card
            - keep it above hypothication details
            - Title Premium Details
            - Broker Calculated Premium (totalIndicateQuoteFromBroker) before changed
            - Insurer Calculated Permium
            (totalIndicateQuoteFromInsurer) after changed
        - `Done` Remove Location Toggle
    - `Done` Quote Sent to QCR Dialog
        - Title 
            - Quote Sent to Intermediary
- Quote Comparision Review
    - `Done`Client Details Same as Broker wise comparision
    - `Done`Sum Insured Details Same as BWC
    - `Done`keep Side tabs as BWC
    - `Done`Other details also as BWC
- Risk Head Letter 
    - `Done`Remove Image of Liberty
## Issues
- Underwriter Review
    - `Done`Broker Wise Comparision Button Size Must be consistent
    ` Buttons are big and small`
    - `Done ` by Selecting on brokers you'll be able to compare all brokers. -> By Selecting on brokers you'll be able to compare all selected brokers.
    
- Underwritter Review
    - Addons Tab 
        - `Done` Prevent Reload on Dialog If nothing changed
        - `Done` Remove Cover Opted
    - `Done` Risk Management Features
        - Label is Missing
        - Keep Label is Risk Management Features for Location Name
    - `Done` Risk Inspection Status 
        - Label is Missing
        - Keep Label is Risk Inspection Status for Location Name
- Generate Placement Slip
    - Correct all Popup
    - Make a list all popups and Correct the context
- All over the system Premium Must be consitent
    - Payment Giving Different Value
    - On Different Placed *******
- Proceed with payment Offline payment Dialog
    - `Done`Instrument Type
        - Invalid Case for Options
    - `Done`Remove Drawee Bank and Instrument Transfer Code
- Payment Details Confirmed
    Dialog Value not seen in preprod


# 08 / 05 / 2023
- Quote Review Page
    - Back Button and Requsition Page will not be page will not be visible if quote is verified
- Correct All the Dialogs
    - Sent to Insurer Dialog 
    -


# 10 / 05 / 2022
- Internal Demo

## Issues
- `Done `- Floater Cover Addons Dialog Not Closing on Save
- `Done `- FIRE Add-ons Should be dynamic and location specific
- `Done `- Risk Inspection Status Crud Card
- `Done `- Dropdown must also have higher location by default
- `Done `- Risk Inspection Status Must not show required 
## Changes
- `Done `- BLUS Remove Section II: Business Interruption (BI)
- `Done `- View Location breakup 
    label needs location name 
- Edit Sum Insured Split 
    - Wrap should maintain the margin
- In quote slip 
    - keep description of **
    - Keep line marker after location ends
    -`Done `-  Correspondence 
    - In quote slip after verification add verifed at timestamp in bottom for all Quoteslips
        - If offline add * and show url of uploaded slip
- `Done `- Quote slip PDF Getting Id as null
- `Done `- After verification dont show requistion screen
- OTC Confirmation POP up show only breach

## Observation
- Select Client Location Encounted the Page Not Responsing

Report Of Changes and In Between Features
- UI Aesthetics
- Download Quote
- Broker Dashboard 
- Insurer Dashboard
- Tat Computation
- Filters in Kanban 
- Quote Specific BSC Selection
- IAR Sum Insured Split Complete Change
- Restrict Quote After Verification
- New Status for Quote
- SI Split Values Change
- Risk Inspection Status Paramters Change
- Other Details Parameters Change
- Multi Alocation Annexure Change in UI Mapping
- QCR and Broker wise comparision Parameters Change
- Change in Quote Slip UI
- All Location Specific Dialogs Label Change
- All Status Dialogs Context Change
- Update in RHL context
- Risk Inpection Report and Photograph Update
- Claim Experience Changed to Renewal Quote
- New Operation Journey and Change in kanban and table view for linking
- Policy Number Update
- Removed Delete Operation from Every CRUD of admin
- Admin LOV Seperation in 3 Splits
- Addon Cover Rectification




// Location 1 Photo Graph
https://uatapi.inexchange.co.in/api/v1/quote-locations/6461fe835d7db3150504e3e8/upload-location-photographs?imagePath=/opt/gitco/inexchg_node/public/uploads/QuoteSlip-6461f2420f340d0ccce8324a/QuoteLocationOccupancy-6461f9e85d7db3150504b7a9/location_photograph_0.png

https://uatapi.inexchange.co.in/api/v1/quote-locations/6461fe835d7db3150504e3e8/upload-location-photographs?imagePath=/opt/gitco/inexchg_node/public/uploads/QuoteSlip-6461f2420f340d0ccce8324a/QuoteLocationOccupancy-6461f9e85d7db3150504b7a9/location_photograph_0.png


// Location 2 Photo Graph
https://uatapi.inexchange.co.in/api/v1/quote-locations/6461fe835d7db3150504e3f6/upload-location-photographs?imagePath=/opt/gitco/inexchg_node/public/uploads/QuoteSlip-6461f2420f340d0ccce8324a/QuoteLocationOccupancy-6461f9fd5d7db3150504b988/location_photograph_0.png

https://uatapi.inexchange.co.in/api/v1/quote-locations/6461fe835d7db3150504e3e8/upload-location-photographs?imagePath=/opt/gitco/inexchg_node/public/uploads/QuoteSlip-6461f2420f340d0ccce8324a/QuoteLocationOccupancy-6461f9fd5d7db3150504b988/location_photograph_0.png

# 20 / 05 / 2023
- Make SI Split Herraical for Quote Slip
    - ` Done` - Made the backend changed to load Section II also for Fire and IAR
    - ` Done` - Only the leaf node will be Bold and any parent node will not have Rupees for Fire and IAR
- Make SI Split Herraical for QCR
    - ` Done` - SI Split will now have the Herraical now and only leaf node will have value and parent node will be bolder for Fire and IAR
    - ` Done` - Made Space for IAR extra values
- Make SI Split Herraical for Broker Wise Comparision
    - ` Done` - SI Split will now have the Herraical now and only leaf node will have value and parent node will be bolder for Fire and IAR
    - ` Done` - Made Space for IAR extra values


# 22 / 05 / 2023
- Testing
    - Product 
        - BLUS
            - OTC - 
                - Sector: Steel 
                - To SI: 50,00,00,000
                - Occupancy
                    - All - 25,00,00,000
                    - Engineering - 10,00,00,000
            - NONOTC
        - FIRE
            - 1 Location
            - 2 Location
        - IAR
    - Underwriter
        - Broker Wise
        - UW Assignment



# 24 / 05 / 2023
- Mail Templates
    - Quote Slip Template
        - 
    - 
