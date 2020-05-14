# Append Editor
<div align="center">

[![License](https://img.shields.io/github/license/theodorechu/append-editor?color=blue)](https://github.com/theodorechu/append-editor/blob/master/LICENSE)
[![Maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg)](https://github.com/theodorechu/append-editor/graphs/commit-activity)
[![Status](https://img.shields.io/badge/status-open%20beta-orange.svg)](https://appendeditor.com/#installation)
[![Cost](https://img.shields.io/badge/cost-free-darkgreen.svg)](https://appendeditor.com/#installation)
[![GitHub issues](https://img.shields.io/github/issues/theodorechu/append-editor.svg)](https://github.com/theodorechu/append-editor/issues/)
[![Slack](https://img.shields.io/badge/slack-standardnotes-CC2B5E.svg?style=flat&logo=slack)](https://standardnotes.org/slack)

</div>

## Introduction
The Append Editor is an **unofficial** [Custom Editor](https://standardnotes.org/help/77/what-are-editors) for [Standard Notes](https://standardnotes.org), a free, open-source, and [end-to-end encrypted](https://standardnotes.org/knowledge/2/what-is-end-to-end-encryption) notes app.  

You can find the beta demo at [beta.appendeditor.com](https://beta.appendeditor.com).

The Append Editor follows the "read first" philosophy. When you open your notes, the editor starts in read/view mode so you can't accidentally accidentally edit old notes. You can easily add to the end of your notes with the Append box at the bottom.

The editor supports Markdown, $\LaTeX/ \KaTeX$, emoji codes, syntax highlighting, inline HTML, table of contents, footnotes, auto-linking and more. It is perfect for writing class notes and daily journals. You can append to your notes whenever you need to jot anything down. 

This editor works best on the [desktop app](https://standardnotes.org/download) and [web app](https://app.standardnotes.org) on a Chromium browser (e.g., Google Chrome), this editor works best when used with the [No Distraction](https://standardnotes.org/extensions/no-distraction) theme. It currently does not work offline but will in the future. 

## Features
- [Markdown](https://guides.github.com/features/mastering-markdown/) support via [Unified/Remark](https://github.com/remarkjs/remark)
- $\LaTeX/\KaTeX$ via hosted [KaTeX](https://github.com/KaTeX/KaTeX)
- Emojis via [emoji codes](https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md)
- Google Code and GitHub Gist flavored Syntax Highlighting via [highlight.js](https://github.com/highlightjs/highlight.js) stylesheets
- Table of Contents (links don't work on mobile) via [Remark TOC](https://github.com/remarkjs/remark-toc)
- Footnotes (links don't work on mobile) via [Remark footnotes](https://github.com/remarkjs/remark-footnotes)
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
- Option to add new line or start new paragraph when appending
- Helpful questions to prompt writing

## Installation

1. Register for an account at Standard Notes using the [Desktop App](https://standardnotes.org/download) or [Web app](https://app.standardnotes.org). Remember to use a strong and memorable password. 
1. Click **Extensions** in the lower left corner.
1. Click **Import Extension**.
1. Paste this into the box: 
    ```
    https://notes.theochu.com/p/mEyBECVK7i
    ```
1. Press Enter or Return on your keyboard.
1. Click **Install**.
1. At the top of your note, click **Editor**, then click **Append Editor - Beta**.

After you have installed the editor on the web or desktop app, it will automatically sync to your [mobile app](https://standardnotes.org/download) after you log in.

## Keyboard Shortcuts
| Action                 | Shortcut                      
| :--------------------- | :-----------------------------------  
| Toggle Edit Mode       | Ctrl/⌘ + E                        
| Toggle Append Mode     | Ctrl/⌘ + U                      
| Toggle View Mode       | Ctrl/⌘ + P                      
| Escape Edit/View Mode  | Escape                      
| Save/Append Text       | Ctrl/⌘ + S and Ctrl/⌘ + Enter            

## Style Guide
| Result             | Markdown                                     | Shortcut*          |
| :------------      | :------------------------------------------- | :--------          |
| **Bold**           | \*\*text\*\* or \_\_text\_\_                 | Ctrl/⌘ + B        |                 
| *Emphasize*        | \*text\* or \_text\_                         | Ctrl/⌘ + I        |
| ~~Strike-through~~ | \~text\~ or \~\~text\~\~                     | Ctrl/⌘ + Alt + U  
| Link 	             | [text]\(http://) 	                          | Ctrl/⌘ + K
| Image              | ![text]\(http://) 	                          | Ctrl/⌘ + Alt + I
| `Inline Code` 	   | \`code\` 	                                  | Ctrl/⌘ + Alt + K
| Code Block 	       | \`\`\`code\`\`\` 	                          | 4 spaces 
| Unordered List     | * item <br></br> - item <br></br> + item     | 	Ctrl/⌘ + L
| Ordered List 	     | 1. item                                      | Ctrl/⌘ + Alt + L 
| Task List          | `- [ ] Task` or `- [x] Task`                 | N/A
| Blockquote 	       | \> quote 	                                  | Ctrl + ' or Ctrl + "
| H1 	               | # Heading 	                                  | Ctrl/⌘ + H
| H2 	               | ## Heading 	                                | Ctrl/⌘ + H (×2)
| H3 	               | ### Heading 	                                | Ctrl/⌘ + H (×3)

*The shortcuts are currently available only on the Desktop app and Chrome based web apps such as Google Chrome and the latest Microsoft Edge. 

The Append Editor also supports inline HTML.  
You can create underlined text using the following format: 

```html
<u> Text to be underlined </u>
```

You can create highlighted text using the following format: 

```html 
<span style="background-color: rgb(255, 255, 0);"> Text to be highlighted </span>
```

## Line Breaks
To have a line break without a paragraph, you will need to add two spaces, called trailing spaces, to the end of your sentence. This line is separate, but is considered to be within the same paragraph. To create a new paragraph, skip two lines.

The **New Line** checkbox adds two spaces and a new line to the beginning of your note. The **New Paragraph** checkbox adds two spaces and two new lines to the beginning of your note. If both are checked, new paragraph will take precedence. 

## $\KaTeX$

For inline KaTeX, use single or double dollar signs inline. For example, `$\int_0^\infty f(x)dx$` or `$$\pi$$` should yield $\int_0^\infty f(x)dx$ and $\pi$.

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

### $\KaTeX$ Tables

The tables for $\KaTeX$ are availble [here](https://katex.org/docs/supported.html) and [here](https://katex.org/docs/support_table.html).

## Table of Contents
You can create a table of contents: 

```md
#### Table of Contents
```

The links generated by the table of contents do not work properly on mobile. 

## Lists

The Append Editor supports unordered and ordered lists, but does not mix them well if they're both on the first level. Copy this into your editor to see what it creates:

```md
1. First ordered list item
1. Another item.   
  a. Two spaces for lettered list  
  b. Add two trailing spaces to create new lettered item  
  c. Third lettered list
   - Three or four spaces for unordered sub sublist  
   - Three or four spaces for unordered sub sublist
   1. Three or four spaces for ordered sub sublist 
  a. Lett
    1. Ordered list on same level
* Unordered List
   1. Ordered sublist  
    - Unordered sub sublist  
      - Unordered sublist   
        1. Seven spaces for ordered sub sub sub sub list 
        1. Seven spaces for ordered sub sub sub sub list 
  1. Numbered list doesn't resume 
```

## Tables
Colons can be used to align columns.  
Copy this into your editor to see what it creates:
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

## Footnotes

The Append Editor supports footnotes. The footnote links do not work properly on mobile. Copy this into your note to see how they're used: 

```md
You can create footnote references that are short[^1] or long.[^2] 
You can also create them inline.^[which may be easier, 
since you don't need to pick an identifier and move down to type the note] 
The footnotes are automatically numbered at the bottom of your note, 
but you'll need to manually number your superscripts. 
Make sure to count your variable[^variable] footnotes.[^5]

[^1]: Here's a footnote.

[^2]: Here’s a footnote with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

        { eight spaces for some code }

    The whole paragraph can be indented, or just the first
    line.  In this way, multi-paragraph footnotes work like
    multi-paragraph list items.

This paragraph won’t be part of the footnote, because it
isn’t indented.

[^variable]: The variable footnote is the fourth footnote.

[^5]: This is the fifth footnote.
```


## Development

The instructions for local setup can be found [here](https://docs.standardnotes.org/extensions/local-setup). All commands are performed in the root directory:

1. Run `npm install` to locally install the packages in `package.json`
2. Create `ext.json` as shown [here](https://docs.standardnotes.org/extensions/local-setup) with `url: "http://localhost:8003/dist/index.html"`. Optionally, create your `ext.json` as a copy of `ext.json.sample`.
3. Install http-server using `sudo npm install -g http-server`
4. Start the server at `http://localhost:8003` using `npm run server`
5. Import the extension into the [web](https://app.standardnotes.org) or [desktop](https://standardnotes.org/download) app with `http://localhost:8003/ext.json`.
6. To build the editor, open another command window and run `npm run build`. For live builds, use `npm run watch`. You can also run `npm run start` and open the editor at `http://localhost:8080`.

## License
Copyright (c) Theodore Chu. All Rights Reserved. Licensed under [AGPL-3.0](https://github.com/TheodoreChu/append-editor/blob/master/LICENSE).

## Further Resources

- [GitHub](https://github.com/theodorechu/append-editor)
- [Docs](https://docs.theochu.com/append-editor)
- [Contact](https://theochu.com/contact)
- [To do List](https://notes.theochu.com/13704/append-editor-todo)