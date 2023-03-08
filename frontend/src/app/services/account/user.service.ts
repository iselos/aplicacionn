import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../../models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>('http://localhost:3000/api/accounts');
  }

  getUser(id?: number, username?: string) {
    return this.http.get<any>(`http://localhost:3000/api/accounts/${[id, username]}`);
  }

  addUser(user: UserInterface) {
    return this.http.post<any>('http://localhost:3000/api/accounts/add', user);
  }

  updateUser(id: number, user: any) {
    return this.http.put<any>(`http://localhost:3000/api/accounts/update/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`http://localhost:3000/api/accounts/delete/${id}`);
  }
}
