/**
 * This component is derived from the "browser-esm-webpack-typescript-react" found
 * at https://github.com/microsoft/monaco-editor-samples,
 * which is released under MIT, Copyright (c) 2016 Microsoft Corporation.
 * This modified version is released under AGPL-3.0 as indicated in the README.md
 * in the root directory. A copy of AGPL-3.0 is available there.
 * */
import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

// @ts-ignore
window.self.MonacoEnvironment = {
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

//export const Editor: React.FC = () => {
export const MonacoEditor = ({
  text,
  saveText,
}: {
  text: string;
  saveText: Function;
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  let editor: monaco.editor.IStandaloneCodeEditor;

  useEffect(() => {
    if (divEl.current) {
      editor = monaco.editor.create(divEl.current, {
        value: [text].join('\n'),
        language: 'markdown',
        theme: 'vs-dark',

        autoClosingOvertype: 'auto',
        wordWrap: 'on',
        formatOnPaste: true,
        formatOnType: true,

        wrappingStrategy: 'advanced',
        fontSize: 16,
      });
      // Keyboard Events
      /*
      editor.onKeyDown((e: monaco.IKeyboardEvent) => {
        saveText(editor.getValue());
      });
      editor.onKeyUp((e: monaco.IKeyboardEvent) => {
        saveText(editor.getValue());
      });
      */
      // Content Change Events
      editor.onDidChangeModelContent(
        (e: monaco.editor.IModelContentChangedEvent) => {
          saveText(editor.getValue());
        }
      );
    }
    return () => {
      editor.dispose();
    };
  }, []);
  return <div className="MonacoEditorContainer" ref={divEl}></div>;
};
