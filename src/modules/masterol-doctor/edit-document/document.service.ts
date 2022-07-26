import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private httpClient: HttpClient) {
  }

  download(url: string): Observable<Blob> {
    return this.httpClient.get(url, {responseType: 'blob'})
  }
}
