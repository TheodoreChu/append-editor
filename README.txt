# Append Editor for Standard Notes

<div align="center">

[![Release](https://img.shields.io/github/release/theodorechu/append-editor.svg)](https://github.com/theodorechu/append-editor/releases)
[![License](https://img.shields.io/github/license/theodorechu/append-editor?color=blue)](https://github.com/theodorechu/append-editor/blob/main/LICENSE)
[![Status](https://img.shields.io/badge/status-ready%20for%20use-brightgreen.svg)](https://appendeditor.com/#installation)
[![Cost](https://img.shields.io/badge/cost-free-darkgreen.svg)](https://appendeditor.com/#installation)
[![GitHub issues](https://img.shields.io/github/issues/theodorechu/append-editor.svg)](https://github.com/theodorechu/append-editor/issues/)
[![Slack](https://img.shields.io/badge/slack-standardnotes-CC2B5E.svg?style=flat&logo=slack)](https://standardnotes.org/slack)
[![Downloads](https://img.shields.io/github/downloads/theodorechu/append-editor/total.svg?style=flat)](https://github.com/theodorechu/append-editor/releases)
[![GitHub Stars](https://img.shields.io/github/stars/theodorechu/append-editor?style=social)](https://github.com/theodorechu/append-editor)

</div>

<details width="100%">
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#introduction">Introduction</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#keyboard-shortcuts">Keyboard Shortcuts</a></li>
    <li><a href="#style-guide">Style Guide</a></li>
    <li><a href="#line-breaks">Line Breaks</a></li>
    <li><a href="#lists">Lists</a></li>
    <li><a href="#tables">Tables</a></li>
    <li><a href="#katex">KaTeX</a></li>
    <li><a href="#table-of-contents"> Table of Contents</a></li>
    <li><a href="#footnotes">Footnotes</a></li>
    <li><a href="#printing">Printing</a></li>
    <li><a href="#settings">Settings</a></li>
    <li><a href="#privacy-and-security">Privacy and Security</a></li>
    <li><a href="#development">Development</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
    <li><a href="#further-resources">Further Resources</a></li>
  </ul>
</details>

## Introduction

The Append Editor is an **unofficial** [editor](https://standardnotes.org/help/77/what-are-editors) for [Standard Notes](https://standardnotes.org), a free, [open-source](https://standardnotes.org/knowledge/5/what-is-free-and-open-source-software), and [end-to-end encrypted](https://standardnotes.org/knowledge/2/what-is-end-to-end-encryption) notes app.

Try the demo at [beta.appendeditor.com](https://beta.appendeditor.com) or learn more at [appendeditor.com](https://appendeditor.com).

The Append Editor follows the "read first" philosophy. When you open your notes, the editor starts in Read/View Only Mode so you can't accidentally accidentally edit old notes. You can easily add to the end of your notes with the Append box at the bottom.

The editor supports Markdown, $\LaTeX/ \KaTeX$, syntax highlighting, in-line HTML, table of contents, footnotes, auto-linking, emoji codes, printing/saving to PDF (with and without URLs), custom fonts, optional in-line formatting, autocompletion, search and replace, and more. It is perfect for writing blog posts, class notes, daily journals, to-do checklists, and code snippets. You can append to your notes whenever you need to jot anything down.

This editor works best on the [desktop app](https://standardnotes.org/download) and [web app](https://app.standardnotes.org) on a Chromium browser (e.g., Google Chrome or the latest Microsoft Edge) with the [No Distraction](https://standardnotes.org/extensions/no-distraction) theme.

## Features

### Main Features

- CommonMark and [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/) provided by [Remark](https://github.com/remarkjs/remark) and [Rehype](https://github.com/rehypejs/rehype)
- $\LaTeX/\KaTeX$ provided by [Remark Math](https://github.com/remarkjs/remark-math) and hosted [KaTeX](https://github.com/KaTeX/KaTeX) stylesheets
- Visual Studio Code flavored Syntax Highlighting provided by [Rehype Highlight](https://github.com/rehypejs/rehype-highlight) and hosted [Highlight.js](https://github.com/highlightjs/highlight.js) stylesheets
- Table of Contents (links don't work on mobile) provided by [Remark TOC](https://github.com/remarkjs/remark-toc)
- Footnotes (links don't work on mobile) provided by [Remark Footnotes](https://github.com/remarkjs/remark-footnotes)
- In-line HTML for underlining, highlighting, and HTML rendering provided by [Rehype Raw](https://github.com/rehypejs/rehype-raw)
- Optional in-line formatting for Markdown provided by [CodeMirror](https://codemirror.net)
- Optional dynamic, what-you-see-is-what-you-get live formatting provided by the [Rich Markdown Editor](https://github.com/outline/rich-markdown-editor) developed by [Outline](https://www.getoutline.com/). Checkboxes are clickable in read/View Only Mode
- Optional in-line syntax highlighting for Markdown and more than 60 other programming languages, intelligent autocompletion, and sophisticated search and replace provided by the [Monaco Editor](https://microsoft.github.io/monaco-editor/) (Visual Studio Code)
  - Languages supported: abap, aes, apex, azcli, bat, c, cameligo, clojure, coffeescript, cpp, csharp, csp, css, dart, dockerfile, fsharp, go, graphql, handlebars, hcl, html, ini, java, javascript, json, julia, kotlin, less, lexon, lua, markdown, mips, msdax, mysql, objective-c, pascal, pascaligo, perl, pgsql, php, plaintext, postiats, powerquery, powershell, pug, python, r, razor, redis, redshift, restructuredtext, ruby, rust, sb, scala, scheme, scss, shell, sol, sql, st, swift, systemverilog, tcl, twig, typescript, vb, verilog, xml, yaml
- Debounced Markdown rendering: When your note is somewhat long (over `2500` characters), the editor will automatically slow the rendering of your Markdown until you finish typing. This significantly improves the experience of editing long notes.

### More Features

- Emojis provided by [Remark Gemoji](https://github.com/remarkjs/remark-gemoji) and [emoji codes](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- Print/Save to PDF the rendered Markdown/HTML text with or without URLs (works best on Chromium browsers)
- Buttons to copy the raw text and rendered HTML of the note
- Buttons to format Markdown text with Prettier
- Button to uncheck all checkboxes
- Buttons to scroll to top and bottom of the note
- Notes are stored in plaintext (great for longevity)
- Read notes by default to prevent accidentally editing previous notes
- Append text to notes without accidentally editing previous notes
- Changes to note in the Edit Mode are automatically saved
- Text in the Append Mode is automatically saved without automatically appending
- Option to render Markdown text live while editing without sacrificing performance when editing long notes
- Option to turn View Mode off to focus on editing
- Option to add new line or start new paragraph when appending
- Helpful questions to prompt writing
- On Web and Desktop, switching notes does not reset the Edit and View Modes, making it easy to edit multiple notes in one session
- Four additional options for adjusting the appearance of the editor: Borderless, Fixed Height, Full Width, and Horizontal Overflow. These are saved in the editor and persist between editing sessions and devices.
- Option to choose custom font sizes, font families, and custom CSS to further customize the look and feel of the editor
- Option to save and load personal default settings

## Installation

1. Register for an account at Standard Notes using the [Desktop App](https://standardnotes.org/download) or [Web app](https://app.standardnotes.org). Remember to use a strong and memorable password.
2. In the bottom left corner of the app, click **Extensions**.
3. Click **Import Extension**.
4. To install the Beta version, paste this into the input box:
   ```
   https://notes.theochu.com/p/mEyBECVK7i
   ```
   or paste this into the input box on **desktop**:
   ```
   https://raw.githubusercontent.com/TheodoreChu/append-editor/main/public/beta.ext.json
   ```
5. To install the Alpha version, paste this into the input box:
   ```
   https://notes.theochu.com/p/wVH1OyOI0Y
   ```
   or paste this into the input box on **desktop**:
   ```
   https://raw.githubusercontent.com/TheodoreChu/append-editor/main/public/alpha.ext.json
   ```
6. Press Enter or Return on your keyboard.
7. Click **Install**.
8. At the top of your note, click **Editor**, then click **Append Editor - Beta** (or **Alpha**).
9. When prompted to activate the extension, click **Continue**.

After you have installed the editor on the web or desktop app, it will automatically sync to your [mobile app](https://standardnotes.org/download) after you sign in.

## Keyboard Shortcuts

:::note
The keyboard shortcuts should work in Plaintext and CodeMirror editing modes, but most currently do not work in the Dynamic and Monaco editing modes. Better support for keyboard shortcuts will hopefully be improved in the future.
:::

| Action                                     | Shortcut                                  |
| :----------------------------------------- | :---------------------------------------- |
| Toggle Edit Mode                           | Ctrl/⌘ + `E`                              |
| Toggle Append Mode                         | Ctrl/⌘ + `U` or Ctrl/⌘ + `M`              |
| Toggle View Mode                           | Ctrl/⌘ + `P`                              |
| Toggle View and Edit Modes (for Edit Only) | Ctrl/⌘ + `<`                              |
| Toggle View and Append Modes               | Ctrl/⌘ + `>`                              |
| Escape Edit/View Mode^                     | Escape                                    |
| Save/Append Text^                          | Ctrl/⌘ + `S` and Ctrl/⌘ + Enter           |
| Toggle Append New Line^                    | Ctrl/⌘ + Alt + `N`                        |
| Toggle Append New Paragraph^               | Ctrl/⌘ + Alt + `P`                        |
| Increase number of rows in Append box      | Ctrl/⌘ + `.` (period)                     |
| Decrease number of rows in Append box\*\*  | Ctrl/⌘ + `,` (comma)                      |
| Skip to Top/Bottom (fast)                  | Ctrl/⌘ + `[` and `]`                      |
| Skip to beginning or end of text area^     | Ctrl/⌘ + Home and Ctrl/⌘ + End            |
| Open Search (in CodeMirror or Monaco)      | Ctrl/⌘ + `F` or Alt + `F` (in CodeMirror) |
| Close Search                               | Escape or same as open search             |

^ Perform in corresponding edit box
\*\* The Append box has a minimum of 5 rows

## Style Guide

| Result             | Markdown                                     | Shortcut\*               |
| :----------------- | :------------------------------------------- | :----------------------- |
| **Bold**           | \*\*text\*\* or \_\_text\_\_                 | Ctrl/⌘ + B               |
| _Emphasize_        | \*text\* or \_text\_                         | Ctrl/⌘ + I               |
| ~~Strike-through~~ | \~\~text\~\~                                 | Ctrl/⌘ + Alt + U         |
| Link               | [text]\(http://)                             | Ctrl/⌘ + K               |
| Image              | ![text]\(http://)                            | Ctrl/⌘ + Alt + I         |
| `In-line Code`     | \`code\`                                     | Ctrl/⌘ + Alt + K         |
| Code Block         | \`\`\`language <br></br>code <br></br>\`\`\` | 4 spaces or Ctrl/⌘ + Tab |
| Unordered List     | \* item <br></br> - item <br></br> + item    | Ctrl/⌘ + L               |
| Ordered List       | 1. item                                      | Ctrl/⌘ + Alt + L         |
| Task List          | `- [ ] Task` or `- [x] Task`                 | N/A                      |
| Blockquote         | \> quote                                     | Ctrl + ' or Ctrl + "     |
| H1                 | # Heading                                    | Ctrl/⌘ + H               |
| H2                 | ## Heading                                   | Ctrl/⌘ + H (×2)          |
| H3                 | ### Heading                                  | Ctrl/⌘ + H (×3)          |
| H4                 | #### Heading                                 | Ctrl/⌘ + H (×4)          |
| Section Breaks     | `---` or `***`                               | N/A                      |

\*The shortcuts are currently available only on the Desktop app and Chrome based web apps such as Google Chrome and the latest Microsoft Edge.

### In-line HTML

The Append Editor also supports in-line HTML. You can use `<div> </div>` tags for formatting sections and `<span></span>` for formatting text in-line. Here are some examples.

1. Underlined text:

   ```html
   <u> Text to be underlined </u>
   ```

1. Highlighted text:

   ```html
   <span style="background-color: rgb(255, 255, 0);">
     Text to be highlighted
   </span>
   ```

1. Different font families and sizes:

   ```html
   This is in-line
   <span style="font-family: consolas; font-size: 14px"> monospace</span> text.
   <div style="font-family: Times New Roman; font-size: 12pt">
     This is 12pt Times New Roman for writing papers.
   </div>
   ```

## Line Breaks

The Markdown rendering in the Append Editor respects line breaks. This is different from the Markdown specification known as CommonMark, which requires two spaces, called trailing spaces, at the end of your line to create a line break without a paragraph break.

In the Append Editor, you do not need trailing spaces. To create a new line, simply press enter/return on your keyboard. To create a new paragraph, skip two lines.

In the Append Mode, the **New Line** checkbox adds two spaces and a new line to the beginning of your note. The **New Paragraph** checkbox adds two spaces and two new lines to the beginning of your note. If both are checked, new paragraph will take precedence. I am considering to switch these to radio buttons, but that would require at least one option to be checked at all times.

## Lists

The Append Editor supports unordered and ordered lists, but does not mix them well if they're both on the first level. Copy this into your editor to see what it renders:

```md
1. First ordered list item
1. Another item.  
   a. Two spaces for lettered list  
   b. Add two trailing spaces to create new lettered item  
   c. Third lettered list
   - Three or four spaces for unordered sub sub list
   - Three or four spaces for unordered sub sub list
   1. Three or four spaces for ordered sub sub list  
      a. Lettered list  
      b. Lettered list
   1. Ordered list on same level

- Unordered List
  1.  Ordered sub list
  - Unordered sub sub list
    - Unordered sub list
      1. Seven spaces for ordered sub sub sub sub list
      1. Seven spaces for ordered sub sub sub sub list
  1. Numbered list doesn't resume
```

If you want lists to continue automatically when you press Enter, then I recommend using the CodeMirror or Dynamic editing modes.

## Tables

Colons can be used to align columns.  
Copy this into your editor to see what it renders:

```
| Tables           |      Are      |   Cool    |
| ---------------- | :-----------: | --------: |
| col 2 is         |   centered    |    \$149   |
| col 3 is         | right-aligned |    \$4.17  |
| privacy is       |    neat       |    \$2.48  |
| rows don't need to  |be pretty|     what? |
| the last line is | unnecessary   |   really?
| one more         |    row        |   Yay! 😆
```

## $\KaTeX$

For in-line KaTeX, use single or double dollar signs in-line. For example, `$\int_0^\infty f(x)dx$` or `$$\pi$$` should yield $\int_0^\infty f(x)dx$ and $\pi$.

For display mode KaTeX, use double dollar signs on new lines. For example,:

```latex
$$
\int_0^\infty f(x)dx
$$
```

should yield:

$$
\int_0^\infty f(x)dx
$$

#### $\KaTeX$ Tables

Please see [here](https://katex.org/docs/supported.html) and [here](https://katex.org/docs/support_table.html) for tables of all the functions and symbols that $\KaTeX$ supports.

## [](/#table-of-contents) Table of Contents

You can create a table of contents:

```md
#### Table of Contents
```

The links generated by the table of contents do not work properly on mobile. This is an issue with the mobile app and not the editor.

## Footnotes

The Append Editor supports footnotes. The footnote links do not work properly on mobile. This is an issue with the mobile app and not the editor. Copy this into your note to see how they're used:

```md
You can create footnote references that are short[^1] or long.[^2]
You can also create them in-line.^[which may be easier,
since you don't need to pick an identifier and move down to type the note]
The footnotes are automatically numbered at the bottom of your note,
but you'll need to manually number your superscripts.
Make sure to count your variable[^variable] footnotes.[^5]

[^1]: Here's a footnote.
[^2]: Here's a footnote with multiple blocks.

    Subsequent paragraphs are indented to show that they belong to the previous footnote.

        { eight spaces for some code }

    The whole paragraph can be indented, or just the first
    line. In this way, multi-paragraph footnotes work like
    multi-paragraph list items.

This paragraph won't be part of the footnote, because it
isn't indented.

[^variable]: The variable footnote is the fourth footnote.
[^5]: This is the fifth footnote.
```

## Printing

Printing and saving to PDF are available on the desktop and web apps. On Windows, the feature works best on a Chromium browser (e.g., Google Chrome or the latest Microsoft Edge) because you can enable Background Graphics such as background colors for highlighting, code snippets, and tables. To make your links clickable in the PDF, click **Save to PDF** instead of ~~Microsoft Print to PDF~~ when choosing your printer.

#### Printing URLs

When you click **Print**, you get to choose whether to print the URLs or not. Printing the URLs will print [embedded URLS](https://appendeditor.com/#printing) [(https://appendeditor.com/#printing)](https://appendeditor.com/#printing) with their URLs next to them. The URLs for Tables of Contents and Footnotes will also be printed. Not printing the URLs will print the [embedded URLs](https://appendeditor.com/#printing) without the URLs next to them. In both cases, the links will be clickable if you choose **Save to PDF** when choosing your printer as described above.

## Settings

You can choose between four editing modes: Plain Textarea, CodeMirror, Dynamic, and Monaco. Each have their own pros and cons and their own use cases.

### Custom Fonts

You can choose your own custom fonts for the Edit/Append and View/Print Modes. The Settings Menu has a predefined list of fonts to help you with your selection, but you can type in a different one if it is not on the list. If you choose a font that is unavailable on your device or browser, then the editor might use your device or browser's default font such as Times New Roman.

You can define multiple fonts in the order of your preference and separate them by commas. The editor will automatically display the next font if your preferred font is unavailable. For example, if you want to use a monospace font on all your devices but would prefer not to use `Courier New` if other monospace fonts are available, then you can submit a list of fonts such as `SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace`. This is useful if you use many devices with many different operating systems.

The Dynamic mode uses the same fonts for Edit/Append and View/Print, so the custom font option for View/Print is hidden. The Monaco mode does not support custom fonts, so the custom font option for Edit/Append is hidden.

### Custom CSS

You can also add finer-tuned Custom Styles via CSS.

:::warning
Custom styles from third parties can potentially betray your privacy. Only use styles from trusted sources.
:::

#### Custom Highlight.js Stylesheets

You can also use custom Highlight.js stylesheets for syntax highlighting if you prefer specific themes. The list of all the themes and the link to their stylesheets are available [here](https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/styles) (the default is the `vs` theme). For example, if you want to use the Google Code theme, add this to the top of your Custom Styles:

```css
@import url('https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@latest/build/styles/googlecode.min.css');
```

You can also add custom fonts (e.g., from [Google Fonts](https://fonts.google.com/)) to the top of your Custom Styles:

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');
```

#### Custom Fonts with CSS

Then update your fonts like this:

```css
.CodeMirror,
.DynamicEditor,
.ProseMirror,
#editTextArea,
#appendTextArea,
#renderedNote {
  font-family: 'Open Sans';
}
```

Make sure to declare `@import` above/before you declare the font-family.

If you want to edit the font-sizes for the view, edit, and append textareas, you can use this (default is `16px`) or use the built-in font size setting:

```css
.CodeMirror,
.DynamicEditor,
.MonacoEditorContainer,
.ProseMirror,
#editTextArea,
#appendTextArea,
#renderedNote {
  font-size: 17px;
}
```

#### How Custom CSS Works

The custom font sizes, font families, and Custom Styles work by adding a `<style>` element to the end of the `<body>` element in the HTML. The Custom Styles take precedence over the higher settings because they are lower on the stylesheet.

If you accidentally add hide your settings with CSS (e.g., `* {display: none;}`), then open the developer inspector, remove the custom stylesheet, and adjust your Settings.

Settings are saved on a per-note basis, but you can save your settings as your personal default for the editor. New notes will use your personal default settings. If you want to use your personal default settings for the old notes, click the refresh/sync button in the second row of the Settings menu.

The styling of the editor (class names, etc.) are subject to change as the editor continues to improve.

Please let me know if you want to add more fonts to the list or need help implementing custom styles.

## Privacy and Security

The Append Editor is an **unofficial** editor for Standard Notes. Since it is **unofficial**, how can we trust it? How do we know it is "safe" to use?

The question of how and whether to trust a piece of software is a good one. Probably the best way to come to the conclusion of whether we can trust it is to have many, many knowledgeable, intelligent, and experienced people inspect the source code and come to independent conclusions about its trustworthiness, then discuss and deliberate their conclusions amongst themselves to determine a group conclusion that we can then follow. But, unfortunately for us, the Append Editor is a small app in the sea of software that we find ourselves drowning in. We don't have the resources to conduct independent reviews of the editor since it is itself a small independent project, but here are some reasons to suggest that the editor is trustworthy enough to work as an extension for Standard Notes.

1. The Standard Notes app requires editors to ask for permission before interacting with your data. If it does not receive permission, then it won't work. The Append Editor only asks for permission to interact with your working note. It does not ask for permission to read all of your notes, tags, folders, other editors, and so on.
2. If you browse the network tab in the developer console while you are using the editor on its own in the demo or in the Standard Notes app, then you won't see any outgoing requests from the editor. The editor isn't sending your data anywhere, and it doesn't keep your data. If you refresh the page in the demo, then your data is gone. If you switch to another editor and back to the Append Editor, then the editor needs to read your data again before working with it.
3. The editor is open source. If you browse the source code, then you won't see any outgoing requests.You can download the source code and build the app from the source to verify that the one I'm serving is actually reflective of the source. The build is included in the Git repository, so you can easily see if there are any changes in your build when comparing it to mine.
4. All the dependencies that I use are well-known or are built by developers who seem trustworthy and well-known. This isn't definitive, of course, since I'm not able to personally verify that the dependencies are 100% secure, but the fact that the packages that I use are also built and used by developers much more talented than I am suggest to me that they are safe to use.
5. Finally, I try to keep the dependencies up to date.

The app does not have any analytics of any kind. I don't know how many people use it, how long or how much they use it, how long their notes are, which devices they use, where they are from, and so on. The only thing I'm able to see is how many times the editor is downloaded, and that's calculated by GitHub.

Trust is very important when developing and sharing a software product. I try to be very transparent in the development of the Append Editor. The release notes are very detailed, and I try to reference specific commits when describing new features, fixes, improvements, and changes behind the scenes. The commit messages are also detailed, and I try to write helpful, explanatory comments throughout the source code.

The editor is fully functional even if your device is offline. If you want to confirm this, you can load the editor on mobile, web, and desktop and turn on airplane mode. If you download the Append Editor using the links [provided above](#installation), then you can use the editor offline on the desktop app without loading it from the hosted version.

The beta version of the editor is hosted on GitHub pages, and the Alpha and dev versions are hosted on my private development server at DigitalOcean. If you do not want to use the hosted version or do not want to automatically update the editor when I publish new releases, then you can disable these features in the Standard Notes web and desktop apps.

## Development

**Prerequisites:** Install [Node.js](https://nodejs.org/en/), [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable), and [Git](https://github.com/git-guides/install-git) on your computer.

The general instructions setting up an environment to develop Standard Notes extensions can be found [here](https://docs.standardnotes.org/extensions/local-setup). You can also follow these instructions:

1. Fork the [repository](https://github.com/theodorechu/append-editor) on GitHub.
2. [Clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository) your fork of the repository.
3. Run `cd append-editor` to enter the `append-editor` directory.
4. Run `yarn install` to install the dependencies on your machine as they are described in `yarn.lock`.

### Testing in the browser

1. To run the app in development mode, run `yarn start` and visit http://localhost:3001. Press `ctrl/cmd + C` to exit development mode.

### Testing in the Standard Notes app

1.  Create an `ext.json` in the `public` directory. You have three options:
    1.  Use `sample.ext.json`.
    2.  Create `ext.json` as a copy of `sample.ext.json`.
    3.  Follow the instructions [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:3000/index.html"`.
2.  Install `http-server` using `sudo npm install -g http-server` then run `yarn server` to serve the `./build` directory at http://localhost:3000.
3.  To build the app, run `yarn build`.
4.  Install the editor into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app with `http://localhost:3000/sample.ext.json` or with your custom `ext.json`. Press `ctrl/cmd + C` to shut down the server.

### Deployment

1. To make the source code prettier, run `yarn pretty`.
2. To the deploy the build into the `gh-pages` branch of your repository on GitHub, run `yarn deploy-stable`.
3. To deploy the build into to the `dev` branch for testing, run `yarn deploy-dev`.
4. To deploy the built into the `build` branch for distributing, run `yarn deploy-build` for distributing builds.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

#### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## License

Copyright (c) Theodore Chu. All Rights Reserved. Licensed under [AGPL-3.0](https://github.com/TheodoreChu/append-editor/blob/main/LICENSE) or later.

## Acknowledgements

Early stages of this editor were based heavily on the Standard Notes [Token Vault](https://github.com/sn-extensions/token-vault) editor. The Token Vault editor is licensed under AGPL-3.0 and is available for use through [Standard Notes Extended](https://standardnotes.org/extensions).

## Further Resources

- [GitHub](https://github.com/TheodoreChu/append-editor) for the source code of the Append Editor
- [GitHub Issues](https://github.com/TheodoreChu/append-editor/issues) for reporting issues concerning the Append Editor
- [Docs](https://docs.theochu.com/append-editor) for how to use the Append Editor
- [Contact](https://theochu.com/contact) for how to contact the developer of the Append Editor
- [Append Editor To do List](https://github.com/TheodoreChu/append-editor/projects/1) for the roadmap of the Append Editor
- [Standard Notes Slack](https://standardnotes.org/slack) for connecting with the Standard Notes Community
- [Standard Notes Help](https://standardnotes.org/help) for help with issues related to Standard Notes but unrelated to this editor
