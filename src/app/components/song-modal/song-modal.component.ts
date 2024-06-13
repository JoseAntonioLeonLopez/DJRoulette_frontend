import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.css']
})
export class SongModalComponent {
  @Input() song: Song | undefined = undefined; // Inicializar con undefined
  @Input() isModalOpen: boolean = false;
  faTimes = faTimes;
  @Output() modalClosed = new EventEmitter<boolean>();

  close(): void {
    this.isModalOpen = false;
    this.modalClosed.emit(false);
  }
  
  open(song: Song): void {
    this.song = song;
    this.isModalOpen = true;
  }
}
