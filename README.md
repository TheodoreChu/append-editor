# Append Editor
<div align="center">

[![License](https://img.shields.io/github/license/theodorechu/append-editor?color=blue)](https://github.com/theodorechu/append-editor/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/theodorechu/append-editor/graphs/commit-activity)
[![Not ready for use](https://img.shields.io/badge/Ready%20for%20use%3F-no-red)](https://github.com/theodorechu/append-editor#development)
[![GitHub issues](https://img.shields.io/github/issues/theodorechu/append-editor.svg)](https://github.com/theodorechu/append-editor/issues/)
[![Slack](https://img.shields.io/badge/slack-standardnotes-CC2B5E.svg?style=flat&logo=slack)](https://standardnotes.org/slack)
[![Twitter Follow](https://img.shields.io/badge/follow-%40standardnotes-blue.svg?style=flat&logo=twitter)](https://twitter.com/standardnotes)

</div>

The Append Editor is a [Custom Editor](https://standardnotes.org/help/77/what-are-editors) for [Standard Notes](https://standardnotes.org). It is currently in development. When it is ready for use, it will be part of the [Standard Notes Extensions](https://standardnotes.org/extensions). :smile:

## Features
- GitHub flavored Markdown as provided by [Unified/Remark](https://github.com/remarkjs/remark)
- LaTeX via hosted [KaTeX](https://github.com/KaTeX/KaTeX)
- Read notes by default
- Append text to notes without accidentally editing old notes
 
## Development

The instructions for local setup can be found [here](https://docs.standardnotes.org/extensions/local-setup). All commands are performed in the root directory:

1. Run `npm install` to locally install the packages in `package.json`
2. Create `ext.json` as shown [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:8003/dist/index.html"`. Optionally, create your `ext.json` as a copy of `ext.json.sample`.
3. Install http-server using `npm install -g http-server`
4. Start the server at `http://localhost:8003` using `npm run server`
5. Import the extension into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app with `http://localhost:8003/ext.json`.
6. To build the editor, open another command window and run `npm run build`. For live builds, use `npm run watch`. You can also run `npm run start` and open the editor at `http://localhost:8080`.
