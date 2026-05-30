import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
    }

    const handled = next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let mensaje = 'Error en la solicitud';

        if (error.status === 401) {
          mensaje = 'No autorizado. Por favor inicia sesión';
          if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
          }
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

    // Garantizar que todos los callbacks HTTP ejecuten dentro de NgZone
    // para que Angular detecte los cambios correctamente con SSR+hydration.
    return new Observable<HttpEvent<unknown>>(observer => {
      const sub = handled.subscribe({
        next:     (event) => this.ngZone.run(() => observer.next(event)),
        error:    (err)   => this.ngZone.run(() => observer.error(err)),
        complete: ()      => this.ngZone.run(() => observer.complete()),
      });
      return () => sub.unsubscribe();
    });
  }
}
