import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
// import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
// import { PromoCodeManageService } from 'app/admin/promo-code-manage/promo-code-manage.service';

class PromoCodeModel {
    id: string | number = '';
    plan: string = '';
    promocode: string = '';
    expiryDate: Date | string = '';
    discount: number = 0;
}

@Component({
    selector: 'jhi-promo-code-manage',
    templateUrl: './promo-code-manage.component.html',
    styleUrls: ['./promo.css']
})
export class PromoCodeManageComponent implements OnInit {
    closeResult: string = '';
    promo: PromoCodeModel = new PromoCodeModel();
    promoDate = new FormControl(new Date());
    dynamicPromo: PromoCodeModel[] = [];
    event: EventEmitter<string> = new EventEmitter<string>();

    PlanTypeArray = [{ name: 'WISER' }, { name: 'WISEST' }];

    constructor(
        private modalService: NgbModal,
        // private eventManager: JhiEventManager,
        // private promoService: PromoCodeManageService,
        // private alertService: JhiAlertService
    ) {}

    ngOnInit(): void {
        this.loadAll();
        this.registerChange();
        this.promo.expiryDate = this.promoDate.value || new Date();
    }

    registerChange(): void {
        // this.eventManager.subscribe('promoCodeListModification', response => this.loadAll());
    }

    getDismissReason(reason: ModalDismissReasons): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openModal(content: any): void {
        this.clear();
        this.modalService.open(content, { ariaLabelledBy: 'PromoModal' }).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                const isPromoExist = this.checkPromoExist();
                if (isPromoExist) {
                    // TODO: Show alert message for existing promo code
                    return;
                } else {
                    this.AddPromo();
                }
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    checkPromoExist(): boolean {
        let flag = false;
        for (let index = 0; index < this.dynamicPromo.length; index++) {
            const element = this.dynamicPromo[index];
            if (element && element.promocode === this.promo.promocode) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    private onSaveSuccess() {
        // this.eventManager.broadcast({
        //     name: 'promoCodeListModification',
        //     content: 'OK'
        // });
    }

    private onSuccess(data: PromoCodeModel[]): void {
        this.dynamicPromo = data;
        this.event.emit('promocodeAdded');
    }

    private onError() {
        // this.alertService.error(error.error, error.message, null);
    }

    clear(): void {
        this.promo.id = '';
        this.promo.plan = '';
        this.promo.promocode = '';
        this.promo.expiryDate = this.promoDate.value || new Date();
        this.promo.discount = 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onEditDynamicField(id: string | number, content: any): void {
        this.fill(id);

        this.modalService.open(content, { ariaLabelledBy: 'PromoModal' }).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                // const isPromoExist = this.checkPromoExist();
                this.UpdatePromo();
                // if (isPromoExist) {
                //     alert('Promocode already exist. Please delete previous or  try different name');
                // } else {
                // }
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    fill(id: string | number): void {
        for (let index = 0; index < this.dynamicPromo.length; index++) {
            const element = this.dynamicPromo[index];
            if (element && element.id === id) {
                this.promo.id = element.id;
                this.promo.discount = element.discount;
                this.promo.expiryDate = element.expiryDate;
                this.promo.plan = element.plan;
                this.promo.promocode = element.promocode;
                break;
            }
        }
    }

    AddPromo(): void {
        // this.promoService.create(this.promo).subscribe(response => this.onSaveSuccess(response));
        this.clear();
    }

    loadAll(): void {
        // this.promoService
        //     .get()
        //     .subscribe(
        //         (res: HttpResponse<PromoCodeModel[]>) => this.onSuccess(res.body),
        //         (res: HttpResponse<any>) => this.onError(res.body)
        //     );
    }

    UpdatePromo(): void {
        // this.promoService.update(this.promo).subscribe(res => this.loadAll());
        this.clear();
    }

    deleteFieldValue() {
        // TODO: Implement confirmation dialog and deletion logic
        // const ret = confirm('Are you sure to delete this PromoCode ?');
        // if (ret) {
        //     this.promoService.delete(id).subscribe(res => this.loadAll());
        // }
    }
}
