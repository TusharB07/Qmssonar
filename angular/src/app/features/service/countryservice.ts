import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class CountryService {
  darkMode:boolean = false;
  toggleStatus = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  getClientName() {
    return this.http
      .get<any>("assets/demo/data/countries.json")
      .toPromise()
      .then(res => res.data as any[])
      .then(data => data);
  }

  toggleDarkMode(): boolean {
    this.darkMode = !this.darkMode;
    this.setTheme();
    return this.darkMode;
  }
  
  setTheme(): void {
    console.log(this.darkMode)
    if (this.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  setToggle(res){
    this.toggleStatus.next(res);
  }
  getToggle(){
    return this.toggleStatus as Observable<boolean>;
  }

}
