import { inject, Injectable } from '@angular/core';
import { GlobalConfigService } from '../global-config.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
// decoded token interface (type)
export interface DecodedToken {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string;
  private http = inject(HttpClient);
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isloggedIn$ = this.loggedIn.asObservable();

  constructor(private config: GlobalConfigService) {
    this.baseUrl = this.config.baseUrl;
    console.log(this.baseUrl);
  }
  // Check if token exists initially
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }
  register(
    full_name: string,
    user_name: string,
    email: string,
    password: string,
    address: string,
    phone_number: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, {
      full_name,
      user_name,
      email,
      password,
      address,
      phone_number,
    });
  }

  // getting token from localstorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // getting user role from decoded token
  getUserRole(): 'user' | 'admin' | 'owner' | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // console.log(decoded.role);
      return decoded.role;
    } catch (error) {
      return null;
    }
  }

  // check if user logs in
  isLoggedIn(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  // logout functio
  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
  }
}
