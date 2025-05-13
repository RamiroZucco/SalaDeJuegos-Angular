import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { QuiensoyComponent } from './pages/quiensoy/quiensoy.component';
import { AhorcadoComponent } from './pages/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './pages/mayor-o-menor/mayor-o-menor.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "registro", component: RegistroComponent },
  { path: "login", component: LoginComponent },
  { path: "quiensoy", component: QuiensoyComponent },
  { path: "ahorcado", component: AhorcadoComponent, canActivate: [AuthGuard] },
  { path: "mayor-o-menor", component: MayorOMenorComponent, canActivate: [AuthGuard] },
  { path: "chat", component: ChatComponent, canActivate: [AuthGuard] },
];