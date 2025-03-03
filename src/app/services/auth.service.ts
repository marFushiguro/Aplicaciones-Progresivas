import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  async login(data: { email: string; password: string }) {
    try {
      const response = await this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).toPromise();
      
      if (response?.token) { //se verifica si el token existe antes de guardarlo
        localStorage.setItem('token', response.token);
        return response;
      } else {
        throw new Error('No se recibió un token');
      }
    } catch (error) {
      console.error('❌ Error en el login:', error);
      throw error;
    }
  }
  //Daniela Peña Rangel 

  async register(data: { username: string; email: string; password: string; role: string }) {
    try {
      const response = await this.http.post(`${this.apiUrl}/register`, data).toPromise();
      console.log('✅ Registro exitoso:', response);
      return response;
    } catch (error) {
      console.error('❌ Error en el registro:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
