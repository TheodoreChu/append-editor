# Append Editor
<div align="center">

[![License](https://img.shields.io/github/license/theodorechu/append-editor?color=blue)](https://github.com/theodorechu/append-editor/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/theodorechu/append-editor/graphs/commit-activity)
[![Not ready for use](https://img.shields.io/badge/Ready%20for%20use%3F-no-red)](https://github.com/theodorechu/append-editor#development)
[![GitHub issues](https://img.shields.io/github/issues/theodorechu/append-editor.svg)](https://github.com/theodorechu/append-editor/issues/)
[![Slack](https://img.shields.io/badge/slack-standardnotes-CC2B5E.svg?style=flat&logo=slack)](https://standardnotes.org/slack)
[![Twitter Follow](https://img.shields.io/badge/follow-%40standardnotes-blue.svg?style=flat&logo=twitter)](https://twitter.com/standardnotes)

</div>

The Append Editor is a [Custom Editor](https://standardnotes.org/help/77/what-are-editors) for [Standard Notes](https://standardnotes.org). It is currently in active development. When it is ready for use, it will be part of the [Standard Notes Extensions](https://standardnotes.org/extensions). :smile:

This editor follows the "read first" philosophy. The editor opens your notes in read/view mode so you don't accidentally edit old notes as you're reading them. While in view mode, you can easily add to the end of your notes with the Append box at the bottom. Support for Markdown and LaTeX/KaTeX are built-in. This editor is perfect for writing class notes and daily journals. 

This editor works best on the [Desktop app](https://standardnotes.org/download) and [web](https://app.standardnotes.org) app on a Chromium browser (e.g., Google Chrome), this editor works best when used with the [No Distraction](https://standardnotes.org/extensions/no-distraction) theme. 

## Features
- [Markdown](https://guides.github.com/features/mastering-markdown/) support via [Unified/Remark](https://github.com/remarkjs/remark)
- LaTeX/TeX via hosted [KaTeX](https://github.com/KaTeX/KaTeX)
- Emojis via [emoji codes](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- Google Code and GitHub Gist flavored Syntax Highlighting via [highlight.js](https://github.com/highlightjs/highlight.js) stylesheets
- Table of Contents (links don't work on mobile)
- Footnotes (links don't work on mobile)
- Inline HTML for underlining and highlighting
- Buttons to scroll to top and bottom of the note
- Read notes by default to prevent accidentally editing previous notes
- Append text to notes without exposing previous notes
- Notes are stored in plaintext (great for longevity)
- Changes to note in the Edit mode are automatically saved
- Text in the Append mode is automatically saved without automatically appending
- Edit mode is available with and without viewing
- If Edit mode and View mode are both on, text is rendered live
- Option to turn View mode off to improve editor performance when editing long notes
- Helpful questions to prompt writing
 
## Development

The instructions for local setup can be found [here](https://docs.standardnotes.org/extensions/local-setup). All commands are performed in the root directory:

1. Run `npm install` to locally install the packages in `package.json`
2. Create `ext.json` as shown [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:8003/dist/index.html"`. Optionally, create your `ext.json` as a copy of `ext.json.sample`.
3. Install http-server using `sudo npm install -g http-server`
4. Start the server at `http://localhost:8003` using `npm run server`
5. Import the extension into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app with `http://localhost:8003/ext.json`.
6. To build the editor, open another command window and run `npm run build`. For live builds, use `npm run watch`. You can also run `npm run start` and open the editor at `http://localhost:8080`.

## Sponsors
Please support this editor by subscribing to [Standard Notes Extended](https://standardnotes.org/extended) 🙏