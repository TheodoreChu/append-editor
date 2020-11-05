/**
 * This component is derived from the "browser-esm-webpack-typescript-react" found
 * at https://github.com/microsoft/monaco-editor-samples,
 * which is released under MIT, Copyright (c) 2016 Microsoft Corporation.
 * This modified version is released under AGPL-3.0 as indicated in the README.md
 * in the root directory. A copy of AGPL-3.0 is available there.
 * */
import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

const debugMode = false;
const MonacoEditorContainerID = 'MonacoEditorContainer';
const MonacoDiffEditorContainerID = 'MonacoDiffEditorContainer';

/*eslint no-restricted-globals: ["error", "event", "monaco"]*/
// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    if (label === 'json') {
      return './json.worker.bundle.js';
    }
    if (label === 'css') {
      return './css.worker.bundle.js';
    }
    if (label === 'html') {
      return './html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './ts.worker.bundle.js';
    }
    return './editor.worker.bundle.js';
  },
};

const onKeyDown = (keyCode: string, debugMode = false) => {
  if (debugMode) {
    console.log('IKeyboardEvent Up: ' + keyCode);
  }
};

const onKeyUp = (keyCode: string, debugMode = false) => {
  if (debugMode) {
    console.log('IKeyboardEvent Up: ' + keyCode);
  }
};

interface MonacoEditorTypes {
  id?: string;
  language?: string;
  onKeyDown?: Function;
  onKeyUp?: Function;
  saveText?: Function;
  tabSize?: number;
  text: string;
  theme?: string;
}

export const MonacoEditor: React.FC<MonacoEditorTypes> = ({
  id = MonacoEditorContainerID,
  language = 'markdown',
  saveText,
  tabSize = 4,
  text,
  theme = 'vs-dark',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  let editor: monaco.editor.IStandaloneCodeEditor;

  useEffect(() => {
    if (divEl.current) {
      editor = monaco.editor.create(divEl.current, {
        value: [text].join('\n'),
        language: language,
        theme: theme,

        autoClosingOvertype: 'auto',
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,

        wrappingStrategy: 'advanced',
        fontSize: 16,
        tabSize: tabSize,
      });
      // Keyboard Events
      editor.onKeyDown((e: monaco.IKeyboardEvent) => {
        onKeyDown(e.code, debugMode);
        if (e.ctrlKey && e.code === 'KeyS') {
          e.preventDefault();
        }
      });
      editor.onKeyUp((e: monaco.IKeyboardEvent) => {
        onKeyUp(e.code, debugMode);
      });
      // Content Change Events
      editor.onDidChangeModelContent(
        (e: monaco.editor.IModelContentChangedEvent) => {
          if (saveText) {
            saveText(editor.getValue());
          }
        }
      );
    }
    return () => {
      editor.dispose();
    };
  }, []);
  return <div id={id} className={MonacoEditorContainerID} ref={divEl}></div>;
};

export const MonacoDiffEditor: React.FC<MonacoEditorTypes> = ({
  id = MonacoDiffEditorContainerID,
  language = 'markdown',
  saveText,
  tabSize = 4,
  text,
  theme = 'vs-dark',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  let diffEditor: monaco.editor.IStandaloneDiffEditor;
  useEffect(() => {
    if (divEl.current) {
      const originalModel = monaco.editor.createModel(
        'heLLo world!',
        'markdown'
      );
      const modifiedModel = monaco.editor.createModel(
        'hello orlando!',
        'markdown'
      );
      diffEditor = monaco.editor.createDiffEditor(divEl.current, {
        originalEditable: true, // for left panel
        readOnly: true, // for right panel
        autoClosingOvertype: 'auto',
        wordWrap: 'on',
        fontSize: 16,
      });
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
    }
    return () => {
      diffEditor.dispose();
    };
  }, []);
  return (
    <div id={id} className={MonacoDiffEditorContainerID} ref={divEl}></div>
  );
};

export default class DiffEditor extends React.Component<{}, {}> {
  initMonaco() {
    //@ts-ignore
    require.config({ paths: { vs: 'monaco-editor/min/vs' } });
    //@ts-ignore
    window.require(['vs/editor/editor.main'], function () {
      const originalModel = monaco.editor.createModel('heLLo world!', 'python');
      const modifiedModel = monaco.editor.createModel(
        'hello orlando!',
        'python'
      );
      var diffEditor = monaco.editor.createDiffEditor(
        //@ts-ignore
        document.getElementById('monaco_container')
      );
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });
    });
  }
  // @ts-ignore

  destroyMonaco() {
    // @ts-ignore
    if (typeof this.editor != 'undefined') this.editor.destroy();
  }

  componentDidMount() {
    this.initMonaco();
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }
  render() {
    return (
      <div
        id="monaco_container"
        style={{ height: '900px', width: '600px' }}
      ></div>
    );
  }
}
