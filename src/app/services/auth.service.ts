import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', 
})
export class AuthService {
  private registros: any[] = []; 

  constructor() {}

  
  register(user: any) {
    this.registros.push(user);
  }

  // Método para validar credenciales
  login(user: string, password: string): boolean {
    const usuarioValido = this.registros.find(
      (registro) => registro.user === user && registro.password === password
    );
    return !!usuarioValido; 
  }

  getRegistros() {
    return this.registros;
  }
}