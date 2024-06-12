import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SongModalComponent } from '../song-modal/song-modal.component'; // Asegúrate de importar correctamente

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.css']
})
export class RouletteComponent implements OnInit, OnChanges {
  @ViewChild('rouletteCanvas', { static: true }) rouletteCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild(SongModalComponent) songModal!: SongModalComponent;
  @Input('segmentsArray') segmentsArray: any[] = [];
  private context!: CanvasRenderingContext2D;
  private segmentAngle: number = 0;
  private currentAngle: number = 0;
  private angularVelocity: number = 0;
  private angularAcceleration: number = 0;
  private spinTimeout: any;
  private isSpinning: boolean = false;

  private readonly maxFontSize: number = 12; // Tamaño máximo de la fuente reducido
  private readonly minFontSize: number = 6; // Tamaño mínimo de la fuente reducido
  private readonly maxTextWidth: number = 100; // Ancho máximo del texto reducido

  constructor() {}

  ngOnInit(): void {
    this.context = this.rouletteCanvas.nativeElement.getContext('2d')!;
    this.updateSegments();
    this.drawRoulette();
    this.drawArrow();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['segmentsArray']) {
      this.updateSegments();
      this.drawRoulette();
      this.drawArrow();
    }
  }

  private updateSegments(): void {
    if (this.segmentsArray.length > 0) {
      this.segmentAngle = 2 * Math.PI / this.segmentsArray.length;
    } else {
      this.segmentAngle = 0;
    }
  }

  private drawRoulette(): void {
    this.context.clearRect(0, 0, 300, 300); // Ajustar al nuevo tamaño del canvas
    for (let i = 0; i < this.segmentsArray.length; i++) {
      this.drawSegment(i);
    }
  }

  private drawSegment(index: number): void {
    const startAngle = index * this.segmentAngle;
    const endAngle = startAngle + this.segmentAngle;
    const color = this.getColor(index);

    this.context.beginPath();
    this.context.moveTo(150, 150); // Ajustar al nuevo tamaño del canvas
    this.context.arc(150, 150, 150, startAngle, endAngle); // Ajustar al nuevo tamaño del canvas
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();

    // Dibujar el texto
    this.context.save();
    this.context.translate(150, 150); // Ajustar al nuevo tamaño del canvas
    this.context.rotate(startAngle + this.segmentAngle / 2);
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#FFFFFF';

    const text = this.segmentsArray[index].title;

    this.context.font = `bold ${this.maxFontSize}px 'Montserrat', sans-serif`;
    const textWidth = this.context.measureText(text).width;

    const fontSize = this.calculateFontSize(Math.max(textWidth));
    this.context.font = `bold ${fontSize}px 'Montserrat', sans-serif`;

    // Calcular la posición del texto de manera que esté centrado
    const radius = 150; // Radio de la ruleta
    const textRadius = radius * 0.6; // Ajustar este valor según sea necesario para centrar el texto mejor
    this.context.fillText(text, textRadius, 0); // Ajustar la posición del texto
    this.context.restore();
  }

  private calculateFontSize(textWidth: number): number {
    if (textWidth <= this.maxTextWidth) {
      return this.maxFontSize;
    }

    const scaleFactor = this.maxTextWidth / textWidth;
    const fontSize = Math.floor(this.maxFontSize * scaleFactor);

    return Math.max(this.minFontSize, fontSize);
  }

  private getColor(index: number): string {
    return index % 2 === 0 ? '#FF0000' : '#000000';
  }

  private drawArrow(color: string = '#FFD100'): void {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.moveTo(140, 0); // Ajustar al nuevo tamaño del canvas
    this.context.lineTo(160, 0); // Ajustar al nuevo tamaño del canvas
    this.context.lineTo(150, 20); // Ajustar al nuevo tamaño del canvas
    this.context.closePath();
    this.context.fill();
  }

  spin(): void {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.angularVelocity = Math.random() * 0.2 + 0.3;
    this.angularAcceleration = -0.0025;

    const spinStep = () => {
      this.currentAngle += this.angularVelocity;
      this.angularVelocity += this.angularAcceleration;
      this.context.clearRect(0, 0, 300, 300); // Ajustar al nuevo tamaño del canvas
      this.context.save();
      this.context.translate(150, 150); // Ajustar al nuevo tamaño del canvas
      this.context.rotate(this.currentAngle);
      this.context.translate(-150, -150); // Ajustar al nuevo tamaño del canvas
      this.drawRoulette();
      this.context.restore();
      this.drawArrow();

      if (this.angularVelocity > 0) {
        this.spinTimeout = requestAnimationFrame(spinStep);
      } else {
        this.isSpinning = false;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
        cancelAnimationFrame(this.spinTimeout);
        this.showResult();
      }
    };

    spinStep();
  }

  private showResult(): void {
    const normalizedAngle = this.currentAngle % (2 * Math.PI);  // Normalizar el ángulo
    const adjustedAngle = (2 * Math.PI - normalizedAngle + (3 * Math.PI / 2)) % (2 * Math.PI); // Ajustar el ángulo para que la flecha esté en la parte inferior
    const segmentIndex = Math.floor(adjustedAngle / this.segmentAngle) % this.segmentsArray.length;
    const song = this.segmentsArray[segmentIndex];
    this.songModal.open(song);
  }
}
