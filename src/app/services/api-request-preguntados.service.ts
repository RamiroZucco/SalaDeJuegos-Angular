import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestPreguntadosService {
  http = inject(HttpClient);
  categorias: string[] = [
    'geography',
    'arts%26literature',
    'entertainment',
    'science%26nature',
    'sports%26leisure',
    'history'
  ];
  categoria_actual: number = -1;
  pagina_actual: string | null = null;

  traerPregunta() {
    const apiUrl = `https://api.quiz-contest.xyz/questions?limit=1&page=${this.pagina_actual}&category=${this.categorias[this.categoria_actual]}&format=multiple`;

    return this.http.get(apiUrl, {
      responseType: 'json',
      headers: {
        Authorization: '$2b$12$r1FaImEYBRYgkrfuEu3uuu8KE2XWeul8gQyMflOVd7Xjuo4wQWYpq',
      }
    });
  }

  private getFiltroExtra(categoria: string): string {
  switch (categoria) {
    case 'geography':
      return 'map';
    case 'arts%26literature':
      return 'books';
    case 'entertainment':
      return 'cinema';
    case 'science%26nature':
      return 'experiment';
    case 'sports%26leisure':
      return 'sport';
    case 'history':
      return 'museum';
    default:
      return '';
  }
}
  traerImagenSobrePregunta() {
    const categoriaOriginal = this.categorias[this.categoria_actual];

    const categoriaNormalizada = decodeURIComponent(categoriaOriginal).replace('&', 'and');

    const filtroExtra = this.getFiltroExtra(categoriaOriginal);

    const queryFinal = `${categoriaNormalizada} ${filtroExtra}`.trim();

    const apiUrl = `https://api.unsplash.com/search/photos?client_id=CXTqJZq4rTadML5sVLFAr7yQk6Ni6qB19px26pTra68&orientation=landscape&query=${queryFinal}`;

    return this.http.get(apiUrl);
  }
}
