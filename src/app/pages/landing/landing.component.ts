import { Component, OnInit } from '@angular/core';
import { SongService } from '../../service/song.service';
import { Song } from '../../models/song.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  songs: Song[] = [];
  loading: boolean = true;
  isModalOpen: boolean = false;

  constructor(
    private songService: SongService,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    const savedSongs = sessionStorage.getItem('songs');
    if (savedSongs) {
      this.songs = JSON.parse(savedSongs);
      this.loading = false;
      this.cdr.detectChanges(); // Forzar la detección de cambios
    } else {
      this.songService.getAll().subscribe(
        (songs: Song[]) => {
          this.songs = songs;
          sessionStorage.setItem('songs', JSON.stringify(songs));
          this.loading = false;
          this.cdr.detectChanges(); // Forzar la detección de cambios
        },
        (error) => {
          console.error('Error loading songs', error);
          this.loading = false;
          this.cdr.detectChanges(); // Forzar la detección de cambios
        }
      );
    }
  }
}
