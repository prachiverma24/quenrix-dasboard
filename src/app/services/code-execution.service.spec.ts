import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodeExecutionService {

  private API_URL = `${environment.apiBaseUrl}/execute/`;

  constructor(private http: HttpClient) {}

  runCode(payload: {
    language: string;
    code: string;
    input?: string;
  }): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }
}
