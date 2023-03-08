import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  subirArchivo(files: any) {
    return this.http.post<any>('http://localhost:3000/api/uploads/', files);
  }

  getImg(username: string) {
    return this.http.get<any>(`http://localhost:3000/api/uploads/${username}`)
  }

  userAvatar(username: string, files: File) {
    return this.http.put<any>(`http://localhost:3000/api/uploads/${username}`, files)
  }
}
