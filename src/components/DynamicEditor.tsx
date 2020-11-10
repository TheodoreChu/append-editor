/**
 * This component is derived from the example found at
 * https://github.com/outline/rich-markdown-editor/blob/develop/example/src/index.js,
 * which is released under BSD-3 License, Copyright (c) 2020 General Outline,
 * Inc (https://www.getoutline.com/) and individual contributors.
 * This modified version is released under AGPL-3.0 as indicated in the README.md
 * in the root directory. A copy of AGPL-3.0 is available there.
 * */

import * as React from 'react';
import debounce from 'lodash/debounce';
import RichMarkdownEditor from 'rich-markdown-editor';

class YouTubeEmbed extends React.Component<any, any> {
  render() {
    const { attrs } = this.props;
    const videoId = attrs.matches[1];

    return (
      <iframe
        title={`Youtube Embed ${videoId}`}
        className={
          this.props.isSelected ? 'YouTube ProseMirror-selectednode' : 'YouTube'
        }
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
      />
    );
  }
}

export default class DynamicEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      readOnly: this.props.readOnly,
      template: false,
      value: undefined,
    };
  }

  handleToggleReadOnly = () => {
    this.setState({ readOnly: !this.state.readOnly });
  };

  handleChange = debounce((value) => {
    const text = value();
    if (this.props.debugMode) {
      console.log(text);
    }
    this.props.onChange(text);
  }, 50);

  render() {
    return (
      <RichMarkdownEditor
        className={'DynamicEditor'}
        placeholder={"Type '/' to insert..."}
        id={'DynamicEditor'}
        readOnly={this.state.readOnly}
        readOnlyWriteCheckboxes
        value={this.state.value}
        defaultValue={this.props.text}
        scrollTo={window.location.hash}
        onCancel={() => {
          if (this.props.debugMode) {
            console.log('Cancel triggered');
          }
        }}
        autoFocus
        onChange={(value) => this.handleChange(value)}
        embeds={[
          {
            title: 'YouTube',
            keywords: 'youtube video tube google',
            icon: () => (
              <img
                alt="YouTube Logo"
                src="/icons/ic-YouTube.svg"
                width={24}
                height={24}
              />
            ),
            //@ts-ignore
            matcher: (url) => {
              return url.match(
                /(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([a-zA-Z0-9_-]{11})$/i
              );
            },
            component: YouTubeEmbed,
          },
        ]}
      />
    );
  }
}
