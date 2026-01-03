import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  private isOpenLeft = new BehaviorSubject<boolean>(true);
  isOpenLeft$ = this.isOpenLeft.asObservable();

  openSideBar(open :boolean){
    this.isOpenLeft.next(open);
  } 

}
