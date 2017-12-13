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
  @Input() src: string;

  constructor(
    private svgIconService: SvgIconService,
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    if (this.src) {
      this.svgIconService.getIconBySrc(this.src)
        .then(icon => {
          if (icon) {
            this.elementRef.nativeElement.appendChild(icon);
          }
        });
    } else if (this.icon) {
      this.svgIconService.getIconByName(this.icon)
        .then(icon => {
          if (icon) {
            this.elementRef.nativeElement.appendChild(icon);
          }
        });
    }

  }

}
