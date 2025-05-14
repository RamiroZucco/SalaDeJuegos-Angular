import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router, private authGuard: AuthGuard ) {}

  ngOnInit(): void {
  }

  irAJuego(ruta: string) {
    if (!this.auth.isLoggedIn()) {
      this.mostrarModal();
      return;
    }
    this.router.navigate([ruta]);
  }

  mostrarModal() {
    const modal = document.getElementById("modal-login");
    if (modal) {
      modal.style.display = "flex";
    }
  }

  cerrarModal() {
    const modal = document.getElementById("modal-login");
    if (modal) {
      modal.style.display = "none";
    }
  }
}