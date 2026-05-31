import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, NgIf]
})
export class LoginComponent {
    email = '';
    password = '';
    cargando = false;
    errorMensaje: string | null = null;

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(): void {
        if (!this.email || !this.password) return;

        this.cargando = true;
        this.errorMensaje = null;

        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                this.cargando = false;
                this.router.navigate(['/denuncias/dashboard']);
            },
            error: (err) => {
                this.cargando = false;
                this.errorMensaje = 'Credenciales incorrectas. Verifica tu email y contraseña.';
            }
        });
    }
}
