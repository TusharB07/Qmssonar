# inexchg

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0-rc.1.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Boilerplate set of commands

cd /Users/harishpatel/Code/csharp/Course/skinet/clientGroup/src/app
ng g m user
cd user 
ng g m user-routing --flat 
ng g s user --flat --skip-tests 
ng g c user-list --skip-tests 

ng g m test-error
cd test-error 
ng g m test-error-routing --flat 
ng g s test-error --flat --skip-tests 
ng g c test-error --skip-tests 

ng g m client-contact
cd client-contact
ng g m bsc-client-contact-routing --flat 
ng g s otp --flat --skip-tests 
ng g c bsc-client-contact-list --skip-tests 
ng g c bsc-client-contact-form --skip-tests 
cd ../

ng g m todo-list
cd todo-list    
ng g m todo-list-routing --flat
ng g s todo-list --flat --skip-tests
cd ../

To Create a Crud
1. Navigate to cd src/app/features/admin
2. ng g m <component-name>                                eg. ng g m claim-experience
3. cd <componennt-name>                                   eg. cd claim-experience

4. ng g m <component-name>-routing --flat                 eg. ng g m claim-experience-routing --flat
5. ng g s <component-name> --flat --skip-tests            eg. ng g s claim-experience --flat --skip-tests

6. create new file as <component-name>.model.ts           eg. claim-experience.model.ts 
7. Make model interface refereing from node model

8. ng g c <component-name>-list --skip-tests              eg. ng g c claim-experience-list --skip-tests
9. ng g c <component-name>-form --skip-tests              eg. ng g c claim-experience-form --skip-tests

10. Refer List Component and Form Component HTML and TS from city and make according to given model
\

ng g m <component-name>
cd <componennt-name>
ng g m <component-name>-routing --flat
ng g s <component-name> --flat --skip-tests
touch <component-name>.model.ts
ng g c <component-name>-list --skip-tests
ng g c <component-name>-form --skip-tests

ng g m machinery-electrical-breadown-cover
cd machinery-electrical-breadown-cover
ng g m machinery-electrical-breadown-cover-routing --flat
ng g s machinery-electrical-breadown-cover --flat --skip-tests
touch machinery-electrical-breadown-cover.model.ts
ng g c machinery-electrical-breadown-cover-list --skip-tests
ng g c machinery-electrical-breadown-cover-form --skip-tests

\\




#22/11/2022 - #23/11/2022
        Crud

claim experience for admin
and 
bsc product partner configaration 






#24/11/2022
standerd addons tab


#25/11/2022 starting

ng g m fire-floater-addon-cover
cd fire-floater-addon-cover
ng g m fire-floater-addon-cover-routing --flat
ng g s fire-floater-addon-cover --flat --skip-tests
touch fire-floater-addon-cover.model.ts
ng g c fire-floater-addon-cover-list --skip-tests
ng g c fire-floater-addon-cover-form --skip-tests
cd ../

ng g m floater-cover-addon
cd floater-cover-addon
ng g m floater-cover-addon-routing --flat
ng g s floater-cover-addon --flat --skip-tests
touch floater-cover-addon.model.ts
ng g c floater-cover-addon-list --skip-tests
ng g c floater-cover-addon-form --skip-tests
cd ../
 
ng g m loss-of-rent-cover
cd loss-of-rent-cover
ng g m loss-of-rent-cover-routing --flat
ng g s loss-of-rent-cover --flat --skip-tests
touch loss-of-rent-cover.model.ts
ng g c loss-of-rent-cover-list --skip-tests
ng g c loss-of-rent-cover-form --skip-tests
cd ../
 
ng g m rent-for-alternative-accomodation-cover
cd rent-for-alternative-accomodation-cover
ng g m rent-for-alternative-accomodation-cover-routing --flat
ng g s rent-for-alternative-accomodation-cover --flat --skip-tests
touch rent-for-alternative-accomodation-cover.model.ts
ng g c rent-for-alternative-accomodation-cover-list --skip-tests
ng g c rent-for-alternative-accomodation-cover-form --skip-tests
cd ../
 
ng g m personal-accident-cover
cd personal-accident-cover
ng g m personal-accident-cover-routing --flat
ng g s personal-accident-cover --flat --skip-tests
touch personal-accident-cover.model.ts
ng g c personal-accident-cover-list --skip-tests
ng g c personal-accident-cover-form --skip-tests
cd ../
 
ng g m product-partner-ic-configuration
cd product-partner-ic-configuration
ng g m product-partner-ic-configuration-routing --flat
ng g s product-partner-ic-configuration --flat --skip-tests
touch product-partner-ic-configuration.model.ts
ng g c product-partner-ic-configuration-list --skip-tests
ng g c product-partner-ic-configuration-form --skip-tests
cd ../

ng g m product-partner-ic-configuration
cd product-partner-ic-configuration
ng g m product-partner-ic-configuration-routing --flat
ng g s product-partner-ic-configuration --flat --skip-tests
touch product-partner-ic-configuration.model.ts
ng g c product-partner-ic-configuration-list --skip-tests
ng g c product-partner-ic-configuration-form --skip-tests

 




#26/11/2022

product partner configaration 



#27/11/2022
otc-product-limit-exceeded-confirmation-dialog
choose-payment-mode-dialog
proceed-with-offline-payment-dialog


#28/11/22



ng g m Warranty
cd Warranty
ng g m Warranty-routing --flat
ng g s Warranty --flat --skip-tests
touch Warranty.model.ts
ng g c Warranty-list --skip-tests
ng g c Warranty-form --skip-tests
cd ../

ng g m Subjectivity
cd Subjectivity
ng g m Subjectivity-routing --flat
ng g s Subjectivity --flat --skip-tests
touch Subjectivity.model.ts
ng g c Subjectivity-list --skip-tests
ng g c Subjectivity-form --skip-tests
cd ../

ng g m Exclusion
cd Exclusion
ng g m Exclusion-routing --flat
ng g s Exclusion --flat --skip-tests
touch Exclusion.model.ts
ng g c Exclusion-list --skip-tests
ng g c Exclusion-form --skip-tests
cd ../

ng g m risk-management-features
cd risk-management-features
ng g m risk-management-features-routing --flat
ng g s risk-management-features --flat --skip-tests
touch category-product-master.model.ts
ng g c risk-management-features-list --skip-tests
ng g c risk-management-features-form --skip-tests


ng g c choose-verification-mode --skip-tests



5/12/2022


claim-experience
risk inspection- claim experience
risk management feature tab




ng g m Icrm-Contact
cd Icrm-Contact
ng g m Icrm-Contact-routing --flat
ng g s Icrm-Contact --flat --skip-tests
touch Icrm-Contact.model.ts
ng g c quote-slip-template-for-fire --skip-tests
ng g c Icrm-Contact-form --skip-tests
cd ../


07/12/22

1. Bharat Griha Raksha Policy - Personal Accident Cover Issue- DONE

2. Bharat Griha Raksha Policy - Risk inspection status and claim experience Issue - DONE

3. Bharat Griha Raksha Policy - Covers Opted Issue- ALREADY DONE

4. Bharat Sukshma Udyam Suraksha - Risk inspection status and claim experience Issue --done

5. RM Issue  1- The download and view option does not work---not done

6. RM Issue- 2  ---need to check

7. Burglary & Housebreaking (including Theft & RSMD) Issue - done
   Cannot able to upload an excel sheet in View breakup for all locations- PENDING



8. Create Client Issues - done

9. B L U S Risk inspection status and claim experience Issue- done

10. Select your client & get started Issue --dropdown     --  done



<!-- <app-risk-inspection-card [quote]="this.quote" [permissions]="['read','update']"></app-risk-inspection-card> -->



 id: string;
    quote: IQuoteSlip;
    requestSentDialog: boolean = false;
    editNextQuote: boolean = false;
    //   quoteId: string = '';
    selectedQuoteLocationOccpancyId: string;
    currentUser$:any;

    private currentQuote: Subscription;
    private currentQuoteLocationOccupancyId: Subscription;
    private currentUser: Subscription;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private quoteService: QuoteService,
        private accountService: AccountService,
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get("quote_id");

        this.currentUser = this.accountService.currentUser$.subscribe({
            next: user => {
                this.currentUser$ = user;
            }
        });
       

        this.currentQuote = this.quoteService.currentQuote$.subscribe({
            next: (quote: IQuoteSlip) => {
                this.quote = quote
            }
        });

        this.currentQuoteLocationOccupancyId = this.quoteService.currentQuoteLocationOccupancyId$.subscribe({
            next: (quoteLocationOccupancyId: string) => {
                this.selectedQuoteLocationOccpancyId = quoteLocationOccupancyId // Set the Id to this component

                if (quoteLocationOccupancyId) {
                    //   this.quoteService.get(`${this.quote._id}?quoteLocationOccupancyId=${quoteLocationOccupancyId}`).subscribe({
          this.quoteService.get(`${this.quote._id}`, {'quoteLocationOccupancyId': quoteLocationOccupancyId}).subscribe({
                        next: (dto: IOneResponseDto<IQuoteSlip>) => {
                            this.quoteService.setQuote(dto.data.entity)
                        },
                        error: e => {
                            console.log(e);
                        }
                    });
                }
            }
        });
    }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");
        
        this.quoteService.get(this.id, { allCovers: true }).subscribe({
            next: (dto: IOneResponseDto<IQuoteSlip>) => {
                // console.log(dto.data.entity)
                this.quoteService.setQuote(dto.data.entity)
            },
            error: e => {
                console.log(e);
            }
        });
     }
     \

                         creator                             approver                            insurer

BLUS - `Done`            BLUS-MITC-2022-00000030        BLUS-MITC-2022-00000030             BLUS-MITC-2022-00000030
BGRP - `Done`            BGRP-MITC-2022-00000024
BSUSP -`Done`            BSUSP-MITC-2022-27
fire - `not available`  FIPR-MITC-2022-00000026         FIPR-MITC-2022-00000026             FIPR-MITC-2022-00000026 





bug -- basic details tab headoffice field not saving 
bug --  when "FIRE" type quote send for  approver getting invalid Id , but BLUS didn't getting this type of error


     

     23-12-2022
     BLUS ---- broker creater --in Electronic Equipments-view breakup dialog not populating new values
     BLUS ---- broker approver --
     BLUS ---- insurer 
     Fire ---- broker creater --Upload Bsc Covers and Download not downloading
                              --risk-management-features-card works!
                RM ---- -       invalid id when quote sending to under writer    only for fire                          
     BGRP ---- broker creater --Upload Bsc Covers and Download not downloading
     BGRP ---- broker creater --placed onc e made payment
     BSUSP ---- broker creater --placed onc e made payment



#10/01/2023
- Quote Requisition: Risk Inspection Sheet Auto reload after Upload  `Done`
- Hypothecation Multi Input Field - Give a plus after Input 1 and onclick it will add anothe input below and on submit it send array of bank names `frontend`
- Kanban Card show Broker Name - For Insurer Kanban Card you will get broker name from Quote Reponse model - `pending Broker name`
- Insurer RM - Comment Out Sector Avg. Add-ons from Addons `Done`
- Insurer RM - Hide the Upload button in popups don't disable it `Done`
- Insurer RM - Crud Permission not proper for Risk Inspection Report `Done`




## 13/03/2023

issue no 25:
        Deleted the delete icons and button
        and restrict the sub-menus
         solved except dashboard and quote menu
        
issue no 22:
        BLUES - Search - Location - Occupancy
issue no 34:
       1.Working Properly in my local
       2.also done 





Valuable Content Agreed Value
        amount
        Discription


        


# 17/03/2023

- Seperate List of Values in 3 Parts - LP - 
    - At least make 3 pages each loading same as list-view-component - ` Prudhvi` - ` Mehboob`
    - But with different name as  ` Prudhvi` - ` Mehboob`
    - si-split-list-view-component ` Prudhvi` - ` Mehboob`
    - dropdown-list-view-component ` Prudhvi` - ` Mehboob`
    - risk-paramter-list-view-component ` Prudhvi` - ` Mehboob`
    - Later we will segragate the form - ` Danish`


`Done`
- If quote is in pending payment broker approver must only see quoteSlip ` Prudhvi` - ` Mehboob` `
    - We have to move current function to operations role of IC admin at pending payment ` Prudhvi` - ` Mehboob`
    - Make the changes in sub-view-kanban, sub-view-table, dashboard ` Prudhvi` - ` Mehboob`
    - Must be operational ` Prudhvi` - ` Mehboob`


- Check for the cause of the Issue - BLUES - Laghu package - QCR quote slip ` Prudhvi` - ` Mehboob`
- Check for the cause of BSC Accompanied Baggage Issue - ` Danish`
- Sum Insured Split - Upload - ` Danish`
- Addon Cover Curd Rectification - ` Danish`
- Make auto copy action on check by admin - LP - ` Danish`



ng g c list-of-value-master-si-split-list --skip-tests
ng g c list-of-value-master-dropdown-list --skip-tests
ng g c risk-cover-letter-template --skip-tests



<!-- Config.preprod.env
STORAGE_PATH='D:\Documents\inexchange\Node\inexchg_node\public\uploads' -->



//
if headoffice acording to location - not working

Burglary & Housebreaking (including Theft & RSMD) value not caluclated for BLUSPolicy
S o n a r   b a s e l i n e   s c a n  
 