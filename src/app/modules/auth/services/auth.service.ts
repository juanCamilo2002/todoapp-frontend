import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface JwtPayload {
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/auth`;

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/login`, data);
  }

  register(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/register`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post(`${this.API}/reset-password`, data);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<LoginResponse>(`${this.API}/refresh`, { refreshToken });
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (error) {
      return true;
    }
  }
}
