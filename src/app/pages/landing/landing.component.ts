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
    this.songService.getAll().subscribe(
      (songs: Song[]) => {
        this.songs = songs;
      },
      (error) => {
        console.error('Error loading songs', error);
      }
    );
  }
}
