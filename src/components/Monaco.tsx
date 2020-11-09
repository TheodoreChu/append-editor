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
  fontSize?: string;
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
  fontSize = '16',
  id = MonacoEditorContainerID,
  language = 'markdown',
  saveText,
  tabSize = 2,
  text,
  theme = 'vs-dark',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  let editor: monaco.editor.IStandaloneCodeEditor;

  if (fontSize === '') {
    fontSize = '16px';
  }
  useEffect(() => {
    if (divEl.current) {
      editor = monaco.editor.create(divEl.current, {
        value: [text].join('\n'),
        language: language,
        theme: theme,
        fontSize: parseInt(fontSize.replace('px', '')),
        tabSize: tabSize,

        autoClosingOvertype: 'auto',
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',
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

interface MonacoDiffEditorTypes extends MonacoEditorTypes {
  modifiedText: string;
}

export const MonacoDiffEditor: React.FC<MonacoDiffEditorTypes> = ({
  id = MonacoDiffEditorContainerID,
  language = 'markdown',
  saveText,
  text,
  modifiedText,
  theme = 'vs-dark',
}) => {
  const divEl = useRef<HTMLDivElement>(null);
  let diffEditor: monaco.editor.IStandaloneDiffEditor;
  useEffect(() => {
    if (divEl.current) {
      const originalModel = monaco.editor.createModel(
        [text].join('\n'),
        language
      );
      const modifiedModel = monaco.editor.createModel(
        [modifiedText].join('\n'),
        language
      );

      diffEditor = monaco.editor.createDiffEditor(divEl.current, {
        // Same settings as above
        theme: theme,
        fontSize: 16,
        // tabSize: tabSize, // not available in Diff Editor

        autoClosingOvertype: 'auto',
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',

        // Specific to Diff Editor
        originalEditable: true, // for left panel
        readOnly: true, // for right panel
      });
      diffEditor.setModel({
        original: originalModel,
        modified: modifiedModel,
      });

      // Content Change Events
      originalModel.onDidChangeContent(
        (e: monaco.editor.IModelContentChangedEvent) => {
          if (saveText) {
            saveText(originalModel.getValue());
          }
        }
      );
    }
    return () => {
      diffEditor.dispose();
    };
  }, []);
  return (
    <div id={id} className={MonacoDiffEditorContainerID} ref={divEl}></div>
  );
};
