import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalComponent } from './login.component';

@Injectable({ providedIn: 'root' })
export class LoginModalService {
    private isOpen = false;
    constructor(private modalService: NgbModal) {}

    open(): NgbModalRef | undefined {
        if (this.isOpen) {
            return undefined;
        }
        this.isOpen = true;
        const modalRef = this.modalService.open(LoginModalComponent);
        
        // Handle modal result but return the modal reference
        modalRef.result.then(
            () => {
                this.isOpen = false;
            },
            () => {
                this.isOpen = false;
            }
        );
        
        return modalRef;
    }
}
