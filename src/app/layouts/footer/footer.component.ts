import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    selector: 'jhi-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['../../css/universal.css']
})
export class FooterComponent {
    constructor(private router: Router) {}
}
