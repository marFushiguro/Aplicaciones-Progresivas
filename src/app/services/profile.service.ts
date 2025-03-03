import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:3000/api'; 

  //oobtener el perfil del usuario
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

 
    async updateProfile(token: string, userId: string, updateData: any) {
        console.log('➡️  updateProfile() - userId recibido:', userId); 
        console.log('➡️  updateProfile() - API URL:', `${this.apiUrl}/users/${userId}`); 

        try {
            const response = await axios.put(`${this.apiUrl}/users/${userId}`, updateData, { 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    //Daniela Peña Rangel

  
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