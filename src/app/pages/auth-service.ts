import { inject, Injectable } from '@angular/core';
import { GlobalConfigService } from '../global-config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string;
  private http = inject(HttpClient);

  constructor(private config: GlobalConfigService) {
    this.baseUrl = this.config.baseUrl;
    console.log(this.baseUrl);
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
}
