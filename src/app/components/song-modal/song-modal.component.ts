import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.css']
})
export class SongModalComponent {
  @Input() song: any;
  @Input() isModalOpen: boolean = false; // Definir isModalOpen como una propiedad de entrada
  show = false;
  faTimes = faTimes;
  @Output() modalClosed = new EventEmitter<boolean>();

  close(): void {
    this.show = false;
    this.modalClosed.emit(false);
  }

  open(song: any): void {
    this.song = song;
    this.show = true;
  }
}
