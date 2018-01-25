import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as forEach from 'lodash/forEach';
import { Observable } from 'rxjs/Observable';
import { Range } from '../editor/ace';

@Injectable()
export class GenerationService {

  editor;
  codeCheckSub;

  private markers = [];

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
          } else if (data.errors) {
            this.setErrors(data.errors);
            observer.next(null);
          }

          observer.complete();
        },
        (error) => {
          console.log(error);
          alert('Error: cannot check code. Something wrong on server');
          observer.next(null);

          observer.complete();
        }
      );
    });
  }

  setEditor(editor) {
    this.editor = editor;
  }

  setErrors(errors) {
    if (this.markers.length) {
      this.clearErrors();
    }

    const session = this.editor.session;

    const annotations = [];

    forEach(errors, error => {
      annotations.push({
        row: error.start.line,
        column: 0,
        text: error.message,
        type: 'error'
      });

      this.markers.push(
        session.addMarker(new Range(error.start.line, error.start.offset, error.end.line, error.end.offset), 'editor-line-error', 'line', true)
      );
    });

    session.setAnnotations(annotations);
  }

  clearErrors() {
    const session = this.editor.session;

    if (this.markers.length) {
      forEach(this.markers, markId => {
        session.removeMarker(markId);
      });
      this.markers = [];
    }

    session.setAnnotations([]);
  }

  private cancelPrevChecks() {
    if (this.codeCheckSub) {
      this.codeCheckSub.unsubscribe();
    }
  }

}
