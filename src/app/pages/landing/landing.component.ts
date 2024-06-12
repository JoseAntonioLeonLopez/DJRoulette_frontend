import { Component } from '@angular/core';
import { SongService } from '../../service/song.service';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  songs: Song[] = [];
  loading: boolean = true;
  isModalOpen: boolean = false; // Agregar esta propiedad para controlar el estado del modal

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    const savedSongs = sessionStorage.getItem('songs');
    if (savedSongs) {
      this.songs = JSON.parse(savedSongs);
      this.loading = false;
    } else {
      this.songService.getAll().subscribe(
        (songs: Song[]) => {
          this.songs = songs;
          sessionStorage.setItem('songs', JSON.stringify(songs));
          this.loading = false;
        },
        (error) => {
          console.error('Error loading songs', error);
          this.loading = false;
        }
      );
    }
  }
}
