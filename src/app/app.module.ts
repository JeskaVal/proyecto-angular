import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // 1. Importa HTTP_INTERCEPTORS

import { AppComponent } from './app.component';
// 2. Importa tu interceptor (asegúrate de que la ruta ./core/interceptors/... sea la correcta)
import { HttpInterceptorService } from './core/interceptors/http.interceptor'; 

@NgModule({
  declarations: [
    AppComponent
    // Tus otros componentes...
  ],
  imports: [
    BrowserModule,
    HttpClientModule // Requisito indispensable para que funcionen las peticiones HTTP
  ],
  providers: [
    // 3. Registras el interceptor aquí abajo:
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true // Permite que Angular use múltiples interceptores si los necesitas más adelante
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }