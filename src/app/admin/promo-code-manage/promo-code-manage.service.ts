import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
// import { SERVER_API_URL } from 'app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeManageService {
  // url = SERVER_API_URL + 'api/promocodes';

  constructor(private http: HttpClient) {}

  create(_data: Record<string, unknown>): Observable<unknown> {
    // return this.http.post(this.url, data, { observe: 'response' });
    return of(null);
  }
  get(): Observable<unknown> {
    // return this.http.get(this.url, { observe: 'response' });
    return of(null);
  }
  update(_data: Record<string, unknown>): Observable<unknown> {
    // return this.http.put(this.url, data, { observe: 'response' });
    return of(null);
  }
  delete(_id: string | number): Observable<unknown> {
    // return this.http.delete(this.url + '/' + id, { observe: 'response' });
    return of(null);
  }
}
