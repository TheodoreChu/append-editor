import React from 'react';
import { EditingMode, useDynamicEditor, useMonacoEditor } from './AppendEditor';
import DynamicEditor from './DynamicEditor';
import Help from './Help';
import Intro from './Intro';
import { renderMarkdown } from '../lib/renderMarkdown';

interface ViewProps {
  bypassDebounce: boolean;
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
    const markdown = renderMarkdown(text, this.props.bypassDebounce);
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
                '```' + this.props.monacoEditorLanguage + '\n' + text + '\n```'
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
    );
  }
}
