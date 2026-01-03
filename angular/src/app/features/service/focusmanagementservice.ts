import { Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FocusManagementService {
  private focusableElements: HTMLElement[] = [];
  private currentFocusIndex: number = 0;
  private focusableElementsSubject = new BehaviorSubject<HTMLElement[]>([]);

  constructor() {
    // Listen for tab key events
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter(event => event.key === 'Tab')
      )
      .subscribe(event => {
        event.preventDefault();
        this.focusNextElement();
      });
  }

  registerFocusableElements(elements: HTMLElement[]) {
    this.currentFocusIndex = elements.length - 2;
    this.focusableElements = elements;
    this.focusableElementsSubject.next(this.focusableElements);
  }

  focusNextElement() {
    if (this.focusableElements.length === 0) {
      return;
    }
    this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
    this.focusableElements[this.currentFocusIndex].focus();
  }
}
