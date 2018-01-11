import { Component, OnInit, Input } from '@angular/core';

// TODO: не делать zommToFit, если ранее был zoomIn или zoomOut (при делать после того как сделают zoomToFit)
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() uml;

  constructor() { }

  ngOnInit() {
  }

  zoomIn() {
    this.uml.diagram.zoomIn();
  }

  zoomOut() {
    this.uml.diagram.zoomOut();
  }

  zoomToFit() {
    this.uml.diagram.zoomToFit();
  }

}
