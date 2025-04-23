import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private baseUrl = 'https://api.github.com/users';

  constructor(private http: HttpClient) { }

  getUserData(username: string) {
    return this.http.get(`${this.baseUrl}/${username}`);
  }
}
