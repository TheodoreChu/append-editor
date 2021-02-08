import React, { ReactNode } from 'react';
import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';
import { debounce, throttle } from 'lodash';

// Remark
const breaks = require('remark-breaks');
const externalLinks = require('remark-external-links');
const footnotes = require('remark-footnotes');
const gfm = require('remark-gfm');
const gemoji = require('remark-gemoji');
const math = require('remark-math');
const slug = require('remark-slug');
const toc = require('remark-toc');

// Rehype
const highlight = require('rehype-highlight');
const rehypeKatex = require('rehype-katex');
const raw = require('rehype-raw');

const processor = unified()
  .use(parse)
  .use(gfm)
  .use(breaks)
  .use(slug)
  .use(toc, { maxDepth: 6 })
  .use(externalLinks)
  .use(footnotes, { inlineNotes: true })
  .use(gemoji)
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(raw)
  .use(math)
  .use(rehypeKatex)
  .use(highlight, { ignoreMissing: true })
  .use(rehype2react, { createElement: React.createElement });

export const processMarkdown = (text: string) => {
  const markdown = processor.processSync(text).result as ReactNode;
  return markdown;
};

/** Throttle instead of debounce because
 * we want it to work even when typing
 * lots of characters in a short amount of time. */
export const isLongString = throttle((text: string) => {
  //console.log('length', text.length);
  if (text.length > 2500) {
    return true;
  } else {
    return false;
  }
}, 1000);

/** Debounce the rendering of long notes to prevent lagging.
 * There is no max on the debounce to prevent lagging
 * even for very, very long notes */
export const renderLongMarkdown = debounce((text: string) => {
  //console.log('renderLongMarkdownText');
  const markdown = processMarkdown(text);
  return markdown;
}, 500);

export const renderMarkdown = (text: string, bypassDebounce: boolean) => {
  if (bypassDebounce) {
    //console.log('renderBypassDebounceText');
    const markdown = processMarkdown(text);
    return markdown;
  }
  let textIsLong = false as boolean | undefined;
  textIsLong = isLongString(text);
  //console.log('textIsLong', textIsLong);
  if (textIsLong) {
    return renderLongMarkdown(text);
  } else {
    //console.log('renderShortMarkdownText');
    const markdown = processMarkdown(text);
    /** Render both to improve transition between short and long
     * This is computationally inefficient,
     * so we keep the threshold for isLongString (such as 2,500)
     */
    renderLongMarkdown(text);
    return markdown;
  }
};
