import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  juegoSeleccionado: string = 'ahorcado';
  resultadosAhorcado: any[] = [];
  resultadosPreguntados: any[] = [];
  resultadosMayorOMenor: any[] = [];
  resultadosColorDetector: any[] = [];

  constructor(private sb: SupabaseService) {}

  async ngOnInit() {
    await this.cargarResultados();
  }

  async cargarResultados() {
    const { data: ahorcado } = await this.sb.supabase
      .from('resultados_ahorcado')
      .select()
      .order('resultado', { ascending: false }) 
      .order('tiempo', { ascending: true });

    const { data: preguntados } = await this.sb.supabase
      .from('preguntados_resultados')
      .select()
      .order('puntaje', { ascending: false });

    const { data: mayor } = await this.sb.supabase
      .from('resultados_mayoromenor')
      .select()
      .order('aciertos', { ascending: false });

    const { data: color } = await this.sb.supabase
      .from('color_detector_resultados')
      .select()
      .order('puntaje', { ascending: false });

    this.resultadosAhorcado = ahorcado || [];
    this.resultadosPreguntados = preguntados || [];
    this.resultadosMayorOMenor = mayor || [];
    this.resultadosColorDetector = color || [];
  }
}
