import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as forEach from 'lodash/forEach';
import { Observable } from 'rxjs/Observable';
import { Range } from '../editor/ace';
import * as Ranges from 'range-calculator';

@Injectable()
export class GenerationService {

  editor;
  codeCheckSub;

  private markers = [];
  private markersRanges: any = {};

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
    this.editor.session.on('change', () => {
      if (this.markers.length) {
        this.clearErrors();
      }
    });
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

      // записываем это в хранилище Ranges, чтобы не ставить одину и ту же позитицию маркер несколько раз
      if (error.start.line === error.end.line) {
        if (this.markersRanges[error.start.line]) {
          this.markersRanges[error.start.line].add([error.start.offset, error.end.offset]);
        } else {
          this.markersRanges[error.start.line] = new Ranges(error.start.offset, error.end.offset)
        }
      }
    });

    forEach(this.markersRanges, (ranges, line) => {
      forEach(ranges.ranges, range => {
        this.markers.push(
          session.addMarker(new Range(line, range[0], line, range[1]), 'editor-line-error', 'line', true)
        );
      });
    });

    session.setAnnotations(annotations);
  }

  clearErrors() {
    const session = this.editor.session;

    this.markersRanges = {};

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
