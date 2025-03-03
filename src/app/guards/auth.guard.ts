import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // ✅ Revisa si hay un token almacenado
    if (!token) {
      this.router.navigate(['/login']); // 🔹 Si no hay token, redirige a login
      return false;
    }
    return true;
  }
}
