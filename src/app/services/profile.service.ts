import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api'; // URL de tu backend

  // Obtener el perfil del usuario
  async getProfile(token: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

 // Actualizar el perfil del usuario
    async updateProfile(token: string, userId: string, updateData: any) {
        console.log('➡️  updateProfile() - userId recibido:', userId); // 👈 ¡AÑADIDO console.log() AQUÍ!
        console.log('➡️  updateProfile() - API URL:', `${this.apiUrl}/users/${userId}`); // 👈 ¡AÑADIDO console.log() AQUÍ!

        try {
            const response = await axios.put(`${this.apiUrl}/users/${userId}`, updateData, { // ✅ ¡CORREGIDO! COMILLAS INVERTIDAS Y LLAVES CORRECTAS
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

  // Eliminar el perfil del usuario
  async deleteProfile(token: string, userId: string) {
    try {
      const response = await axios.delete(`${this.apiUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}