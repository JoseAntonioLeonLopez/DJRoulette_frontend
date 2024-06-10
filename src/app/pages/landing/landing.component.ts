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
  data: any[] = [];
  view: [number, number] = [400, 300];
  showLegend = true;
  showLabels = true;
  gradient = true;

  constructor(private songService: SongService) {}

  ngOnInit(): void {
    this.loadSongs();
  }

  loadSongs(): void {
    this.songService.getAll().subscribe(
      (songs: Song[]) => {
        this.songs = songs;
        this.data = this.songs.map(song => ({ name: song.title, value: 1 })); // Cada canción tendrá el mismo valor inicial
      },
      (error) => {
        console.error('Error loading songs', error);
      }
    );
  }
}
