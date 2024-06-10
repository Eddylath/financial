import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RouteOption } from './home.types';
import { Translationi18nKey, Translations } from '../../translations.constants';

@Component({
    selector: 'tu-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
    translations: Translationi18nKey = Translations;

    routes: RouteOption[] = [
        {
            name: 'overviewReport',
            icon: 'Rate'
        },
        {
            name: 'customers',
            icon: 'Account'
        },
        {
            name: 'invoices',
            icon: 'Invoice'
        },
        {
            name: 'billingPlans',
            icon: 'Rate'
        },
    ];

    constructor(
        private router: Router
    ) {}

    isActive(address: string): boolean {
        return this.router.isActive(address, true);
    }

    getLink(address: string): string[] {
        return [`/${address}`]
    }

    getIcon(route: RouteOption): string {
        return this.isActive(route.name) ? `filled${route.icon}` : `empty${route.icon}`
    }
}
