import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { BASEURL } from './constants';

@Injectable({
  providedIn: 'root',
})
export class GenericHttpService<T> {
  constructor(
    private http: HttpClient,
    @Inject(String) private entity: string
  ) {}

  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(`${BASEURL}/${this.entity}`)
      .pipe(take(1), catchError(this.handleError));
  }

  getBtId(id: number): Observable<T> {
    return this.http
      .get<T>(`${BASEURL}/${this.entity}/${id}`)
      .pipe(take(1), catchError(this.handleError));
  }

  create(data: T): Observable<T> {
    return this.http
      .post<T>(`${BASEURL}/${this.entity}`, data)
      .pipe(take(1), catchError(this.handleError));
  }

  update(data: T): Observable<T> {
    const urlWithId = `${BASEURL}/${this.entity}`;
    return this.http
      .put<T>(urlWithId, data)
      .pipe(take(1), catchError(this.handleError));
  }

  delete(id: number): Observable<number> {
    const urlWithId = `${BASEURL}/${this.entity}/${id}`;
    return this.http
      .delete<number>(urlWithId)
      .pipe(take(1), catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      //a client side error occurred and needs to be handled accordingly/
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      //a server side error occurred and needs to be handled accordingly
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.log(errorMessage);
    return throwError(()=>errorMessage);
  }//error handler
}
