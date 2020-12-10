import React, { ReactNode } from 'react';
import { EditingMode, useDynamicEditor, useMonacoEditor } from './AppendEditor';
import DynamicEditor from './DynamicEditor';
import Help from './Help';
import Intro from './Intro';

import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
const gfm = require('remark-gfm');
const breaks = require('remark-breaks');
const math = require('remark-math');
const rehypeKatex = require('rehype-katex');
const highlight = require('rehype-highlight');
const emoji = require('remark-emoji');
const externalLinks = require('remark-external-links');
const toc = require('remark-toc');
const footnotes = require('remark-footnotes');
const slug = require('remark-slug');
const raw = require('rehype-raw');

const processor = unified()
  .use(parse)
  .use(gfm)
  .use(breaks)
  .use(slug)
  .use(toc, { maxDepth: 6 })
  .use(externalLinks)
  .use(footnotes, { inlineNotes: true })
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(raw)
  .use(math)
  .use(rehypeKatex)
  .use(highlight, { ignoreMissing: true })
  .use(emoji)
  .use(rehype2react, { createElement: React.createElement });

interface ViewProps {
  debugMode: boolean;
  editingMode: EditingMode;
  monacoEditorLanguage: string;
  printURL: boolean;
  useDynamicEditor: useDynamicEditor;
  useMonacoEditor: useMonacoEditor;
  saveText: (text: string) => void;
  showHelp: boolean;
  text: string;
}

interface ViewState {
  showHelp: boolean;
}

export default class ViewNote extends React.Component<ViewProps, ViewState> {
  constructor(props: ViewProps) {
    super(props);

    this.state = {
      showHelp: this.props.showHelp,
    };
  }

  onToggleShowHelp = () => {
    const helpButton = document.getElementById('helpButton');
    if (helpButton) {
      helpButton.click();
    }
  };

  renderMarkdown = (text: string) => {
    const markdown = processor.processSync(text).result as ReactNode;
    return markdown;
  };

  render() {
    const { text } = this.props;
    return (
      <div
        className={
          'sk-panel main view' + (this.props.printURL ? ' printURL' : '')
        }
      >
        <div className="sk-panel-content view" id="view">
          <div>
            {!text && [<Intro />]}
            {this.state.showHelp && [
              <Help
                debugMode={this.props.debugMode}
                printURL={this.props.printURL}
              />,
            ]}
            <div
              id="renderedNote"
              className={
                '' +
                (this.props.editingMode === this.props.useDynamicEditor
                  ? ''
                  : 'rendered-note-section')
              }
            >
              {this.props.editingMode === this.props.useMonacoEditor &&
              this.props.monacoEditorLanguage !== 'markdown' &&
              this.props.monacoEditorLanguage !== 'html' &&
              text ? (
                this.renderMarkdown(
                  '```' +
                    this.props.monacoEditorLanguage +
                    '\n' +
                    text +
                    '\n```'
                )
              ) : this.props.editingMode === this.props.useDynamicEditor ? (
                <DynamicEditor
                  debugMode={this.props.debugMode}
                  onChange={this.props.saveText}
                  readOnly={true}
                  text={text}
                />
              ) : (
                this.renderMarkdown(text)
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
