import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (!token) {
      return next.handle(req);
    }

    const header = req.clone({
      headers: req.headers.set('x-token', `${token}`)
    })

    return next.handle(header);
  }

}

//req:lo que se solicita.
//observable:Resuelve un evento.
//handle: deja pasar por el interceptor
//module: interceptor
//////////////////////////////////
//headers