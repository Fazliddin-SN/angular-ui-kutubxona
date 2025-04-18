import { inject, Injectable } from '@angular/core';
import { GlobalConfigService } from '../global-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../pages/admin-dashboard/CRUDs/user-register/user.model';
<<<<<<< HEAD
import { DecodedToken } from '../interfaces/token.model';
=======
// decoded token interface (type)
export interface DecodedToken {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  exp: number;
}

>>>>>>> 079113d34c5c98610fffa2d38b1df42e0c1e3b0b
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
    // console.log(this.baseUrl);
  }
  // Check if token exists initially
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  // login method
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }

  //sign method for guests
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

  // registering new users with roles 'admin', 'user', and 'owner'
  registerUser(userData: Partial<User>): Observable<any> {
    const { fullname, username, email, password, address, phone_number, role } =
      userData;

    // Retrieve token from localStorage or another source
    const token = localStorage.getItem('token');

    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // adjust if your API expects a different format
    });
    return this.http.post(
      `${this.baseUrl}/auth/sign-up`,
      {
        full_name: fullname,
<<<<<<< HEAD

=======
>>>>>>> 079113d34c5c98610fffa2d38b1df42e0c1e3b0b
        user_name: username,
        email,
        password,
        address,
        phone_number,
        role,
      },
      { headers }
    );
  }

<<<<<<< HEAD
  // registering new library for new user
  registerLib(user_email: string, library_name: string): Observable<any> {
    const token = localStorage.getItem('token');

    // Create HttpHeaders and attach the token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // adjust if your API expects a different format
    });

    return this.http.post(
      `${this.baseUrl}/library`,
      { library_name, user_email },
      {
        headers,
      }
    );
  }

=======
>>>>>>> 079113d34c5c98610fffa2d38b1df42e0c1e3b0b
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
