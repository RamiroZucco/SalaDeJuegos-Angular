import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-color-detector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-detector.component.html',
  styleUrls: ['./color-detector.component.css']
})
export class ColorDetectorComponent implements OnInit {
  tiempoRestante: number = 60;
  intervalo: any;
  gridSize: number = 2;
  maxGridSize: number = 6;
  cuadros: { color: string, esDiferente: boolean }[] = [];

  baseColor: string = '';
  diffColor: string = '';
  score: number = 0;

  showModal: boolean = false;
  modalTitulo: string = '';
  modalMensaje: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.iniciarCronometro();
    this.generarGrid();
  }

  iniciarCronometro() {
    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        clearInterval(this.intervalo);
        this.mostrarModal('¡Fin del tiempo!', `Tu puntaje fue: ${this.score}`);
        this.guardarResultado();
      }
    }, 1000);
  }

  generarGrid() {
    this.baseColor = this.colorAleatorio();
    this.diffColor = this.colorSimilar(this.baseColor);

    const total = this.gridSize * this.gridSize;
    const posicionDiferente = Math.floor(Math.random() * total);
    this.cuadros = [];

    for (let i = 0; i < total; i++) {
      this.cuadros.push({
        color: i === posicionDiferente ? this.diffColor : this.baseColor,
        esDiferente: i === posicionDiferente
      });
    }
  }

  colorAleatorio(): string {
    const r = 100 + Math.floor(Math.random() * 156);
    const g = 100 + Math.floor(Math.random() * 156);
    const b = 100 + Math.floor(Math.random() * 156);
    return `rgb(${r}, ${g}, ${b})`;
  }

  colorSimilar(base: string): string {
    const match = base.match(/\d+/g);
    if (!match) return base;

    const [r, g, b] = match.map(Number);
    const factor = Math.floor(Math.random() * 10) + 10;

    return `rgb(${r - factor}, ${g - factor}, ${b})`;
  }

  seleccionar(esDiferente: boolean) {
    if (esDiferente) {
      this.score++;
      if (this.gridSize < this.maxGridSize) this.gridSize++;
      this.generarGrid();
    } else {
      clearInterval(this.intervalo);
      this.mostrarModal('¡Fin del juego!', `Tu puntaje fue: ${this.score}`);
      this.guardarResultado();
    }
  }

  mostrarModal(titulo: string, mensaje: string) {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.showModal = true;
  }

  cerrarModal() {
    clearInterval(this.intervalo);
    this.router.navigate(['/home']);
  }

  async guardarResultado() {
    const { error } = await this.auth.sb.supabase
      .from('color_detector_resultados')
      .insert([{
        usuario: this.auth.usuarioActual?.email,
        puntaje: this.score
      }]);

    if (error) {
      console.error("Error al guardar en Supabase:", error.message);
    }
  }
}