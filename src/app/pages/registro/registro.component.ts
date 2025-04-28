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
  nombre: string = '';
  apellido: string = '';
  edad: number | null = null;

  emailError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  nombreError: string = '';
  apellidoError: string = '';
  edadError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async registrar() {
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.nombreError = '';
    this.apellidoError = '';
    this.edadError = '';

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

    if (!this.nombre) {
      this.nombreError = 'El nombre es obligatorio';
      hasError = true;
    } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(this.nombre)) {
      this.nombreError = 'El nombre solo puede contener letras';
      hasError = true;
    }

    if (!this.apellido) {
      this.apellidoError = 'El apellido es obligatorio';
      hasError = true;
    } else if (!/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/.test(this.apellido)) {
      this.apellidoError = 'El apellido solo puede contener letras';
      hasError = true;
    }

    if (this.edad === null || this.edad === undefined) {
      this.edadError = 'La edad es obligatoria';
      hasError = true;
    } else if (this.edad < 1 || this.edad > 100) {
      this.edadError = 'Ingrese una edad válida';
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
      if (data.user) {
        const { error: insertError } = await this.authService.insertarUsuario({
          id_usuario: data.user.id,
          email: this.email,
          nombre: this.nombre,
          apellido: this.apellido,
          edad: this.edad
        });

        if (!insertError) {
          this.router.navigate(['/home']);
        } else {
          console.error('Error al guardar datos adicionales:', insertError.message);
        }
      } else {
        console.error('Error: No se pudo obtener el usuario luego de registrarlo.');
      }
    }
  }
}
