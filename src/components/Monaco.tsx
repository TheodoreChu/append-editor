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