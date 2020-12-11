import React, { ReactNode } from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import { debounce, throttle } from 'lodash';

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

/** Throttle because we want it to work even when typing lots of characters in a short amount of time. */
const isLongString = throttle((text: string) => {
  //console.log('length', text.length);
  if (text.length > 10000) {
    return true;
  } else {
    return false;
  }
}, 1000);

export const renderLongMarkdown = debounce((text: string) => {
  //console.log('renderLongMarkdownText');
  const markdown = processor.processSync(text).result as ReactNode;
  return markdown;
}, 500);

export const renderMarkdown = (text: string) => {
  let textIsLong = false as boolean | undefined;
  textIsLong = isLongString(text);
  //console.log('textIsLong', textIsLong);
  if (textIsLong) {
    return renderLongMarkdown(text);
  } else {
    //console.log('renderShortMarkdownText');
    const markdown = processor.processSync(text).result as ReactNode;
    return markdown;
  }
};
