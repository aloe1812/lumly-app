import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CodeMirror from 'CodeMirror';
import * as forEach from 'lodash/forEach';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GenerationService {

  static GUTTER_ID = 'CodeMirror-lint-markers';

  marks = [];
  editor;
  codeCheckSub;

  constructor(
    private http: HttpClient
  ) { }

  checkCode(code): Observable<any> {
    return Observable.create((observer) => {
      this.cancelPrevChecks();

      this.clearErrors();

      if (!code) {
        observer.next(null);
        observer.complete();
        return;
      }

      this.codeCheckSub = this.http.post(
        'https://lzbtfkwzf7.execute-api.ap-northeast-1.amazonaws.com/test/interpreter',
        { code }
      ).subscribe(
        (data: any) => {
          if (data.diagram) {
            observer.next(data.diagram);
            observer.complete();
            return;
          } else if (data.errors) {
            this.setErrors(data.errors);
            observer.next(null);
            observer.complete();
            return;
          }
        },
        (error) => {
          console.log(error);
          alert('Error: cannot check code. Something wrong on server');
          observer.next(null);
          observer.complete();
          return;
        }
      );
    });
  }

  setEditor(editor) {
    this.editor = editor;
  }

  setEditorError(line, error) {
    const label = document.createDocumentFragment();
    label.appendChild(this.annotationTooltip(error));

    this.editor.setGutterMarker(line, GenerationService.GUTTER_ID, this.makeMarker(label));
  }

  // TODO: переделать tooltop ошибок c нуля
  setErrors(errors) {

    let lastErrorLine;

    forEach(errors, error => {
      this.marks.push(
        this.editor.markText(
          {line: error.start.line, ch: error.start.offset},
          {line: error.end.line, ch: error.end.offset},
          {
            className: 'editor-mark-error'
          }
        )
      );

      if (lastErrorLine !== error.start.line) {
        this.setEditorError(error.start.line, error.message);
      }

      lastErrorLine = error.start.line;
    });
  }

  clearErrors() {
    if (this.marks.length) {
      forEach(this.marks, mark => mark.clear());
      this.marks = [];
    }
    this.editor.clearGutter(GenerationService.GUTTER_ID);
  }

  private cancelPrevChecks() {
    if (this.codeCheckSub) {
      this.codeCheckSub.unsubscribe();
    }
  }

  private makeMarker(label) {
    const marker = document.createElement('div'), inner = marker;
    marker.className = 'CodeMirror-lint-marker-error';

    CodeMirror.on(inner, 'mouseover', (e) => {
      this.showTooltipFor(e, label, inner);
    });

    return marker;
  }

  private showTooltipFor(e, content, node) {
    let tooltip = this.showTooltip(e, content);

    const hide = () => {
      CodeMirror.off(node, 'mouseout', hide);
      if (tooltip) {
        this.hideTooltip(tooltip);
        tooltip = null;
      }
    };

    const poll = setInterval(() => {
      if (tooltip) {
        for (let n = node;; n = n.parentNode) {
          if (n && n.nodeType === 11) {
            n = n.host;
          }

          if (n === document.body) {
            return;
          }

          if (!n) {
            hide();
            break;
          }
        }
      }

      if (!tooltip) {
        return clearInterval(poll);
      }
    }, 400);

    CodeMirror.on(node, 'mouseout', hide);
  }

  private annotationTooltip(msg) {
    const tip = document.createElement('div');
    tip.appendChild(document.createTextNode(msg));

    return tip;
  }

  private showTooltip(e, content) {
    const tt = document.createElement('div');
    tt.className = 'CodeMirror-lint-tooltip';
    tt.appendChild(content.cloneNode(true));
    document.body.appendChild(tt);

    function position(ev) {
      if (!tt.parentNode) {
        return CodeMirror.off(document, 'mousemove', position);
      }
      tt.style.top = Math.max(0, ev.clientY - tt.offsetHeight - 5) + 'px';
      tt.style.left = (ev.clientX + 5) + 'px';
    }

    CodeMirror.on(document, 'mousemove', position);
    position(e);

    if (tt.style.opacity != null) {
      tt.style.opacity = '1';
    }

    return tt;
  }

  private hideTooltip(tt) {
    if (!tt.parentNode) {
      return;
    }
    if (tt.style.opacity == null) {
      rm(tt);
    }
    tt.style.opacity = 0;
    setTimeout(() => {
      rm(tt);
    }, 600);

    function rm(elt) {
      if (elt.parentNode) {
        elt.parentNode.removeChild(elt);
      }
    }
  }

}
