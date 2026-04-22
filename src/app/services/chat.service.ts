import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
<<<<<<< HEAD
  // Using relative URL keeps it compatible with dev proxy and deployed environments.
  private apiUrl = '/api/chat/';
=======
  private apiUrl = `${environment.apiBaseUrl}/chat/`;
>>>>>>> origin/main

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message });
  }
}