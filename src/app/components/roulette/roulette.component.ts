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

  private readonly maxFontSize: number = 16;
  private readonly minFontSize: number = 8;
  private readonly maxTextWidth: number = 200;

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
    this.context.clearRect(0, 0, 500, 500);
    for (let i = 0; i < this.segmentsArray.length; i++) {
      this.drawSegment(i);
    }
  }

  private drawSegment(index: number): void {
    const startAngle = index * this.segmentAngle;
    const endAngle = startAngle + this.segmentAngle;
    const color = this.getColor(index);

    this.context.beginPath();
    this.context.moveTo(250, 250);
    this.context.arc(250, 250, 250, startAngle, endAngle);
    this.context.closePath();
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();

    // Dibujar el texto
    this.context.save();
    this.context.translate(250, 250);
    this.context.rotate(startAngle + this.segmentAngle / 2);
    this.context.textAlign = 'right';
    this.context.fillStyle = '#FFFFFF';

    const text1 = this.segmentsArray[index].title;

    this.context.font = `${this.maxFontSize}px Verdana`;
    const textWidth1 = this.context.measureText(text1).width;

    const fontSize = this.calculateFontSize(Math.max(textWidth1));

    this.context.font = `${fontSize}px Verdana`;

    this.context.fillText(text1, 200, 0);
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
    this.context.moveTo(240, 0);
    this.context.lineTo(260, 0);
    this.context.lineTo(250, 20);
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
      this.context.clearRect(0, 0, 500, 500);
      this.context.save();
      this.context.translate(250, 250);
      this.context.rotate(this.currentAngle);
      this.context.translate(-250, -250);
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
