import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment'; // ✅ Environment import kiya

// --- Interfaces ---
interface AdminFormData {
  id: string; 
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experienceYears: number | null; 
  imageUrl: string;
}

interface AdminApiPayload {
    csmit_id: string; 
    full_name: string;
    email: string;
    phone: string;
    experience_years: number; 
    image_url: string;         
}

// ✅ FIXED: environment.apiBaseUrl use kiya
const API_BASE_URL = `${environment.apiBaseUrl}/admins/`;

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  constructor(private http: HttpClient) { }

  private transformToPayload(data: AdminFormData): AdminApiPayload {
    const experienceYears = data.experienceYears ?? 0;
    return {
      csmit_id: data.id, 
      full_name: `${data.firstName} ${data.lastName}`, 
      email: data.email,
      phone: data.phone,
      experience_years: experienceYears, 
      image_url: data.imageUrl,         
    };
  }
  
  private transformFromApi(apiData: any): AdminFormData {
      const parts = apiData.full_name ? apiData.full_name.split(' ') : [];
      const lastName = parts.length > 1 ? parts.pop() || '' : ''; 
      const firstName = parts.join(' '); 

      return {
          id: apiData.csmit_id, 
          firstName: firstName,
          lastName: lastName,
          email: apiData.email,
          phone: apiData.phone,
          experienceYears: apiData.experience_years, 
          imageUrl: apiData.image_url,              
      };
  }

  getAdmins(): Observable<AdminFormData[]> {
    return this.http.get<any[]>(API_BASE_URL).pipe(
        map(apiDataArray => apiDataArray.map(data => this.transformFromApi(data)))
    );
  }

  createAdmin(adminData: AdminFormData): Observable<any> {
    const payload = this.transformToPayload(adminData);
    return this.http.post<any>(API_BASE_URL, payload);
  }

  updateAdmin(adminData: AdminFormData): Observable<any> {
    const payload = this.transformToPayload(adminData);
    const url = `${API_BASE_URL}${adminData.id}/`; 
    return this.http.put<any>(url, payload); 
  }

  deleteAdmin(adminId: string): Observable<any> {
    const url = `${API_BASE_URL}${adminId}/`;
    return this.http.delete<any>(url);
  }
}

export { AdminFormData as Admin };