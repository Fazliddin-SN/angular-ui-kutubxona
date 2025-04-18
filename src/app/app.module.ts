import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
<<<<<<< HEAD
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule],
  providers: [],
=======
import { AuthInterceptor } from './services/auth.interceptor';

@NgModule({
  imports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
>>>>>>> 079113d34c5c98610fffa2d38b1df42e0c1e3b0b
})
export class AppModule {}
