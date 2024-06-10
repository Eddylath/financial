import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'tu-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    title = 'financial';
    
    icons: string[] = [
        'close',
        'emptyAccount',
        'emptyInvoice',
        'emptyRate',
        'filledAccount',
        'filledInvoice',
        'filledRate',
    ];

    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
    ) {}

    ngOnInit(): void {
        this.icons.forEach((icon) => {
            this.matIconRegistry.addSvgIcon(
                icon,
                this.domSanitizer.bypassSecurityTrustResourceUrl(`/assets/svg-icons/${icon}.svg`)
            );
        })
    }
}
