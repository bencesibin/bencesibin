import { Directive, Input, AfterViewInit, ElementRef, SimpleChanges, OnChanges } from '@angular/core';

@Directive({
  selector: '[appBS]'
})
export class BingoSelectedDirective implements AfterViewInit, OnChanges {

  @Input() appBS: any;
  @Input() RandanGenratedArray: any[];
  @Input() index: any[];
  @Input() selected: boolean;

  constructor(
    private eleref: ElementRef
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const [i, j, val, len] = this.appBS;
    const v = ['B', 'I', 'N', 'G', 'O'];
    if (changes.appBS.currentValue !== changes.appBS.previousValue) {
      if (!this.selected && this.RandanGenratedArray && this.RandanGenratedArray.length && this.RandanGenratedArray.find(vala => vala === String(`${v[j]}${val}`))) {
        this.eleref.nativeElement.classList.add('ticked');
        this.index[i][j] = 1;
        this.index[j + 5][i] = 1;
        this.selected = true;
      }
    }
  }
}
