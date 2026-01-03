import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-banca-dashboard',
    templateUrl: './banca-dashboard.component.html',
    styleUrls: ['./banca-dashboard.component.scss','./../dashboard.component.scss']
})
export class BancaDashboardComponent implements OnInit {

    @Input() user;

    constructor() { }

    ngOnInit(): void {
    }

}
