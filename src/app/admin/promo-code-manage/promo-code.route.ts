import { Route } from '@angular/router';

import { PromoCodeManageComponent } from 'app/admin/promo-code-manage/promo-code-manage.component';

export const promoRoute: Route = {
    path: 'manage-promo',
    component: PromoCodeManageComponent,
    data: {
        pageTitle: 'PromoCode Management'
    }
};
