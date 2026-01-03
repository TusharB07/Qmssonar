// category-names.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CategoryNamesService {
    private categoryNameListSubject = new BehaviorSubject<string[]>([]);
    categoryNameList$ = this.categoryNameListSubject.asObservable();

    // Inside CategoryNamesService
    updateCategoryNameList(categoryNames: string[]): void {
        console.log('Updating category names:', categoryNames);
        this.categoryNameListSubject.next(categoryNames);
    }

}

