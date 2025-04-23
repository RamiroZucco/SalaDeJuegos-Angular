import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';

    let hasError = false;

    if (!this.email) {
      this.emailError = 'El correo es obligatorio';
      hasError = true;
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = 'Ingrese un correo válido';
      hasError = true;
    }

    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria';
      hasError = true;
    } else if (this.password.length < 6) {
      this.passwordError = 'Debe tener al menos 6 caracteres';
      hasError = true;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Debe confirmar su contraseña';
      hasError = true;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Las contraseñas no coinciden';
      hasError = true;
    }

    if (hasError) return;

    const { data, error } = await this.authService.crearCuenta(this.email, this.password);

    if (error) {
      if (error.message.includes('User already registered')) {
        this.emailError = 'Este correo ya está registrado';
      } else {
        this.emailError = `Error: ${error.message}`;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
