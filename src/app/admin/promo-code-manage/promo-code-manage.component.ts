import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { PromoCodeManageService } from 'app/admin/promo-code-manage/promo-code-manage.service';
import { HttpResponse } from '@angular/common/http';
import { EventEmitter } from 'protractor';

class PromoCodeModel {
    id;
    plan;
    promocode;
    expiryDate;
    discount;
}

@Component({
    selector: 'jhi-promo-code-manage',
    templateUrl: './promo-code-manage.component.html',
    styleUrls: ['./promo.css']
})
export class PromoCodeManageComponent implements OnInit {
    closeResult;
    promo: PromoCodeModel = new PromoCodeModel();
    promoDate = new FormControl(new Date());
    dynamicPromo: any = [];
    event: EventEmitter;

    PlanTypeArray = [{ name: 'WISER' }, { name: 'WISEST' }];

    constructor(
        private modalService: NgbModal,
        private eventManager: JhiEventManager,
        private promoService: PromoCodeManageService,
        private alertService: JhiAlertService
    ) {}

    ngOnInit() {
        this.loadAll();
        this.registerChange();
        this.promo.expiryDate = this.promoDate.value;
    }

    registerChange() {
        this.eventManager.subscribe('promoCodeListModification', response => this.loadAll());
    }

    getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    openModal(content) {
        this.clear();
        this.modalService.open(content, { ariaLabelledBy: 'PromoModal' }).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
                const isPromoExist = this.checkPromoExist();
                if (isPromoExist) {
                    alert('Promocode already exist. Please delete previous or  try different name');
                } else {
                    this.AddPromo();
                }
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    checkPromoExist() {
        let flag = false;
        for (let index = 0; index < this.dynamicPromo.length; index++) {
            const element = this.dynamicPromo[index];
            if (element.promocode === this.promo.promocode) {
                flag = true;
                break;
            }
        }
        if (flag) {
            return true;
        } else {
            return false;
        }
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({
            name: 'promoCodeListModification',
            content: 'OK'
        });
    }

    private onSuccess(data) {
        this.dynamicPromo = data;
        this.event.emit('promocodeAdded');
    }

    private onError(error) {
        this.alertService.error(error.error, error.message, null);
    }

    clear() {
        this.promo.id = null;
        this.promo.plan = null;
        this.promo.promocode = null;
        this.promo.expiryDate = this.promoDate.value;
        this.promo.discount = null;
    }

    onEditDynamicField(id, content) {
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

    fill(id) {
        for (let index = 0; index < this.dynamicPromo.length; index++) {
            const element = this.dynamicPromo[index];
            if (element.id === id) {
                this.promo.id = element.id;
                this.promo.discount = element.discount;
                this.promo.expiryDate = element.expiryDate;
                this.promo.plan = element.plan;
                this.promo.promocode = element.promocode;
                break;
            }
        }
    }

    AddPromo() {
        this.promoService.create(this.promo).subscribe(response => this.onSaveSuccess(response));
        this.clear();
    }

    loadAll() {
        this.promoService
            .get()
            .subscribe(
                (res: HttpResponse<PromoCodeModel[]>) => this.onSuccess(res.body),
                (res: HttpResponse<any>) => this.onError(res.body)
            );
    }

    UpdatePromo() {
        this.promoService.update(this.promo).subscribe(res => this.loadAll());
        this.clear();
    }

    deleteFieldValue(id) {
        const ret = confirm('Are you sure to delete this PromoCode ?');
        if (ret) {
            this.promoService.delete(id).subscribe(res => this.loadAll());
        }
    }
}
