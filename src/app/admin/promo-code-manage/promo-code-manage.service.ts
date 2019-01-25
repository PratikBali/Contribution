import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { SERVER_API_URL } from 'app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeManageService {
  // url = SERVER_API_URL + 'api/promocodes';

  constructor(private http: HttpClient) {}

  create(data) {
    // return this.http.post(this.url, data, { observe: 'response' });
  }
  get() {
    // return this.http.get(this.url, { observe: 'response' });
  }
  update(data) {
    // return this.http.put(this.url, data, { observe: 'response' });
  }
  delete(id) {
    // return this.http.delete(this.url + '/' + id, { observe: 'response' });
  }
}
