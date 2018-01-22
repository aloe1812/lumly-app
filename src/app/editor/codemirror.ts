import * as CodeMirror from 'CodeMirror';
import 'CodeMirror/addon/scroll/simplescrollbars';
import 'CodeMirror/addon/lint/lint';
import 'CodeMirror/addon/mode/simple';

// создаем пустой mode, чтобы можно было использовать linter
CodeMirror.defineSimpleMode('uml', {
  start: [],
  comment: [],
  meta: {}
});

export default CodeMirror;
