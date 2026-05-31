import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    login(email: string, password: string): Observable<{ token: string; user: any }> {
        return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap(res => {
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                }
            })
        );
    }

    logout(): void {
        this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
            complete: () => this.clearSession(),
            error: () => this.clearSession(),
        });
    }

    isAuthenticated(): boolean {
        if (!isPlatformBrowser(this.platformId)) return false;
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        return localStorage.getItem('token');
    }

    getUser(): any {
        if (!isPlatformBrowser(this.platformId)) return null;
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }

    private clearSession(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        this.router.navigate(['/login']);
    }
}
