import { Component, Input } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.css']
})
export class SongModalComponent {
  @Input() song: any;
  show = false;
  faTimes = faTimes;

  open(song: any): void {
    this.song = song;
    this.show = true;
  }

  close(): void {
    this.show = false;
  }
}
