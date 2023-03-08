import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: any, password: any) {
    return this.http.post<any>('http://localhost:3000/api/auth/login', { username, password });
  }

}
