import React from 'react';
//import { Remarkable } from 'remarkable';
//import ReactDom from 'react-dom'
import unified from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import rehype2react from 'rehype-react'

// additional for math
//import math from 'remark-math';
const math = require('remark-math');
//import rehypeKatex from 'rehype-katex';
const rehypeKatex = require('rehype-katex')

//for syntax highlighting
//import attacher from 'rehype-highlight';
var highlight = require('rehype-highlight');

const emoji = require('remark-emoji');

var processor = unified()
  .use(parse)
  .use(remark2rehype)
  .use(math)
  .use(rehypeKatex) 
  .use(highlight, {ignoreMissing: true})
  .use(emoji)
  .use(rehype2react, {createElement: React.createElement})

export default class ViewNote extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    text: this.props.text,
    viewMode: this.props.viewMode,
    };
    //this.onChange = this.onChange.bind(this);
  }

  render() {
    const text = this.props.text;

    return (
            <div className="sk-panel main">
        <div className="sk-panel-content">
          <div className="sk-panel-section">
          <div className="note-entry">
        <div className="note-details">
          <div className="note-info">
            <div className="note-content">
              { text ? ([
                <div className="note-back">
                  {processor.processSync(text).result}
                  </div>,
                ]) : ([
                <div className="note-back" style={{textAlign: "center"}}>
                  Your note is empty! Click the <strong>Append</strong> button to start appending. 🙂
                  <br></br><br></br>
                  This editor supports both Markdown and LaTeX.
                  <br></br><br></br>
                  Happy note-taking! 😄
                  </div>])}
            </div>
          </div>
        </div>
        <div className="note-options">
        </div>
      </div>
          </div>
        </div>
      </div>
  );
  }
}
