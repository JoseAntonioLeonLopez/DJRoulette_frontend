import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Song } from '../models/song.model';
import { Observable } from 'rxjs';

export class SongService {
  private http = inject(HttpClient);
  private API = "https://djroulette-backend.onrender.com/dj_roulette/songs";

  getAll(): Observable<Song[]> {
    return this.http.get<Song[]>(this.API);
  }

  create(song: Song): Observable<Song> {
    return this.http.post<Song>(this.API, song);
  }

  deleteAll(): Observable<void> {
    return this.http.delete<void>(this.API);
  }

  delete(title: string, artist: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${title}/${artist}`);
  }
}
