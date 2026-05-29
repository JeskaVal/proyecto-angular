import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Agregar token
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensaje = 'Error en la solicitud';

        if (error.status === 401) {
          mensaje = 'No autorizado. Por favor inicia sesión';
          localStorage.removeItem('token');
          // Redirigir a login
        } else if (error.status === 403) {
          mensaje = 'No tienes permisos para esta acción';
        } else if (error.status === 404) {
          mensaje = 'Recurso no encontrado';
        } else if (error.status === 422) {
          mensaje = 'Validación fallida';
        } else if (error.status === 500) {
          mensaje = 'Error del servidor';
        }

        console.error(mensaje, error);
        return throwError(() => new Error(mensaje));
      })
    );
  }
}