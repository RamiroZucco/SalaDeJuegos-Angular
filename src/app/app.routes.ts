import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { QuiensoyComponent } from './pages/quiensoy/quiensoy.component';

export const routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "registro", component: RegistroComponent },
    { path: "login", component: LoginComponent },
    { path: "home", component: HomeComponent },
    { path: "quiensoy", component: QuiensoyComponent }
  ];
