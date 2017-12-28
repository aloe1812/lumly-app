import { Component, OnInit, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import { SvgIconService } from './svg-icon.service';

@Component({
  selector: 'svg-icon',
  template: '',
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'svg-icon'}
})
export class SvgIconComponent implements OnInit {

  @Input() icon: string;

  constructor(
    private svgIconService: SvgIconService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    const svg = this.svgIconService.getIcon(this.icon);
    if (svg) {
      this.elementRef.nativeElement.appendChild(svg);
    }
  }

}
