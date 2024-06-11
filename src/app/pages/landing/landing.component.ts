import { Component, OnInit } from '@angular/core';
import { SongService } from '../../service/song.service';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  songs: Song[] = [];

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    const savedSongs = sessionStorage.getItem('songs');
    if (savedSongs) {
      this.songs = JSON.parse(savedSongs);
    } else {
      this.songService.getAll().subscribe(
        (songs: Song[]) => {
          this.songs = songs;
          sessionStorage.setItem('songs', JSON.stringify(songs));
        },
        (error) => {
          console.error('Error loading songs', error);
        }
      );
    }
  }
}
