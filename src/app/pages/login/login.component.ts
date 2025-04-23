import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.emailError = '';
    this.passwordError = '';

    let hasError = false;

    if (!this.email) {
      this.emailError = 'El correo es obligatorio';
      hasError = true;
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = 'Ingrese un correo válido';
      hasError = true;
    }

    if (!this.password) {
      this.passwordError = 'La clave es obligatoria';
      hasError = true;
    } else if (this.password.length < 6) {
      this.passwordError = 'Debe tener al menos 6 caracteres';
      hasError = true;
    }

    if (hasError) return;

    const { data, error } = await this.authService.iniciarSesion(this.email, this.password);

    if (error) {
      this.passwordError = 'Correo o contraseña incorrectos';
    } else{
      this.router.navigate(['/home']);
    }
  }

  completarCredenciales(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
