import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ Environment import kiya gaya hai

@Injectable({
  providedIn: 'root'
})
export class CodeExecutionService {

  // ✅ FIXED: Hardcoded 'http://localhost:8000/api/execute/' hata kar environment variable use kiya hai
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