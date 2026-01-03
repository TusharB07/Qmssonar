import { SubViewTableComponent } from './../../features/quote/pages/quote-view-page/sub-view-table/sub-view-table.component';
import { Component, OnInit, SimpleChanges } from "@angular/core";
import { Observable } from "rxjs";
import { AppComponent } from "../../app.component";
import { AppMainComponent } from "../app-main/app.main.component";
import { IUser } from "../../features/admin/user/user.model";
import { AccountService } from "../../features/account/account.service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { QmsService } from "src/app/features/quote/pages/quote-discussion-page/qms.service";
import { QuoteService } from 'src/app/features/admin/quote/quote.service';
import { LazyLoadEvent } from 'primeng/api';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ThemeService } from 'src/app/features/account/my-organization/theme.service';

@Component({
  selector: "app-topbar",
  templateUrl: "./app.topbar.component.html",
  providers: [SubViewTableComponent],
})
export class AppTopbarComponent implements OnInit{
  currentUser$: Observable<IUser>;
  staticUrl = environment.staticUrl;
  notificationCount = 0;
  queries : any
  allNotifications = []
  unique = []
  user : any
  photo: any
  isMobile: boolean = false;

  constructor(
    public app: AppComponent, 
    public appMain: AppMainComponent,
    private accountService: AccountService,
    public router: Router,
    private qmsService : QmsService,
    private quoteService : QuoteService,
    private subViewTableComponent : SubViewTableComponent,
    private deviceService: DeviceDetectorService,
    private themeService:ThemeService

    ) {
    this.currentUser$ = this.accountService.currentUser$;
    this.currentUser$.subscribe(user => {
      if(user){
        this.photo = user.photo;        
      }
    })
    
  }
  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    this.allNotifications = [
      // {'data' : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, facilis. Dicta magnam aliquid fugiat quia ea deleniti placeat corrupti corporis, animi, enim, cum neque labore quo. Quo excepturi atque ipsa?'},
      // {'data' : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, facilis. Dicta magnam aliquid fugiat quia ea deleniti placeat corrupti corporis, animi, enim, cum neque labore quo. Quo excepturi atque ipsa?'},
      // {'data' : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, facilis. Dicta magnam aliquid fugiat quia ea deleniti placeat corrupti corporis, animi, enim, cum neque labore quo. Quo excepturi atque ipsa?'},
      // {'data' : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, facilis. Dicta magnam aliquid fugiat quia ea deleniti placeat corrupti corporis, animi, enim, cum neque labore quo. Quo excepturi atque ipsa?'},
      // {'data' : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, facilis. Dicta magnam aliquid fugiat quia ea deleniti placeat corrupti corporis, animi, enim, cum neque labore quo. Quo excepturi atque ipsa?'},
      // {'data' : 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Molestiae, facilis. Dicta magnam aliquid fugiat quia ea deleniti placeat corrupti corporis, animi, enim, cum neque labore quo. Quo excepturi atque ipsa?'},
    ]

     this.currentUser$.subscribe({
      next : user => {
        if(user){
          this.user = user
          this.qmsService.notificationcount().subscribe({
            next : (response) => {
              // @ts-ignore
              this.queries = response.data.entity
              
              this.queries = this.queries.filter(query => query.state == 'Open')
      
              this.unique = [...new Set(this.queries.flatMap(item => item.quoteId))];
      
              let  lazyLoadEvent: LazyLoadEvent = {
                first: 0,
                rows: 200,
                sortField: null,
                sortOrder: 1,
                filters: {
                  // @ts-ignore
                  _id: [
                    {
                      value: this.unique,
                      matchMode: "in",
                      operator: "and"
                    }
                  ]
                },
                globalFilter: null,
                multiSortMeta: null
              }
      
              // this.unique.map(quoteId => {
              //   console.log(quoteId)
              //   this.quoteService.get(quoteId).subscribe(quoteData => {
              //     console.log(quoteData.data.entity)
              //     this.allNotifications.push(quoteData.data.entity)
              //   })
              // })
      
              // this.quoteService.getMany(lazyLoadEvent).subscribe({
              //   next : (data) => {
              //     console.log(data)
              //   }
              // })
            }
          })
        }
      }
     })
   
  }

  tempFunction(notificationId){
    this.subViewTableComponent.openQuote(notificationId)
    this.quoteService.get(notificationId).subscribe(quote => {
      this.subViewTableComponent.openQuote(quote.data.entity)
    })
  }
  
  logout() {
    this.accountService.logout().subscribe(res => {
      this.themeService.setTheme(false);
    });
  }

  loadProfile() {
    // this.router.navigateByUrl(`/backend/admin/partners/${this.currentUser$}` )
}
}
