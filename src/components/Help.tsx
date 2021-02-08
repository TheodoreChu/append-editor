import React from 'react';
import { GearIcon, HelpIcon, MenuIcon } from './Icons';
import {
  clickHelpButton,
  clickMenuButton,
  clickSettingsButton,
} from '../lib/clickButton';

interface HelpProps {
  debugMode: boolean;
  printURL: boolean;
}

interface HelpState {
  showFeelings: boolean;
  showMoreQuestions: boolean;
  showFeedback: boolean;
}

export default class Help extends React.Component<HelpProps, HelpState> {
  constructor(props: HelpProps) {
    super(props);

    this.state = {
      showFeelings: false,
      showMoreQuestions: false,
      showFeedback: false,
    };
  }

  onToggleShowFeelings = () => {
    this.setState({
      showFeelings: !this.state.showFeelings,
    });
  };

  onToggleShowMoreQuestions = () => {
    this.setState({
      showMoreQuestions: !this.state.showMoreQuestions,
    });
  };

  onToggleShowFeedback = () => {
    this.setState({
      showFeedback: !this.state.showFeedback,
    });
  };

  render() {
    return (
      <div id="help">
        <h2>Append Editor Help</h2>
        <p>
          The Append Editor is an <b>unofficial</b>{' '}
          <a
            href="https://standardnotes.org/help/77/what-are-editors"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            editor
          </a>{' '}
          for{' '}
          <a
            href="https://standardnotes.org/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            Standard Notes
          </a>
          , a free,{' '}
          <a
            href="https://standardnotes.org/knowledge/5/what-is-free-and-open-source-software"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            open-source
          </a>
          , and{' '}
          <a
            href="https://standardnotes.org/knowledge/2/what-is-end-to-end-encryption"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            end-to-end encrypted
          </a>{' '}
          notes app. The Append Editor is also free software licensed under{' '}
          <a
            href="https://github.com/TheodoreChu/append-editor/blob/main/LICENSE"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            AGPL-3.0
          </a>
          . Its source code is available on{' '}
          <a
            href="https://github.com/TheodoreChu/append-editor"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            GitHub
          </a>
          .
        </p>
        <h3>Append Editor Features</h3>
        <p>
          The Append Editor supports{' '}
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            Markdown
          </a>{' '}
          with{' '}
          <a
            href="https://katex.org/docs/support_table.html"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            KaTeX
          </a>
          , syntax highlighting, in-line HTML, table of contents, footnotes,
          auto-linking,{' '}
          <a
            href="https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            emoji codes
          </a>
          , and more.{' '}
        </p>
        <p>
          There are four editing modes: Plain Textarea, CodeMirror, Dynamic, and
          Monaco. You can read about each mode and choose which to use in the
          Settings
          <button
            className="inline-text-and-svg"
            onClick={clickSettingsButton}
            title="Open Settings"
          >
            <span>&nbsp;</span>
            <GearIcon role="button" />
            <span>&nbsp;</span>
          </button>
          . You can also choose default and per-note font sizes, font families,
          and custom styles (CSS).
        </p>
        <p>
          The Menu
          <button
            className="inline-text-and-svg"
            onClick={clickMenuButton}
            title="Open the Menu"
          >
            <span>&nbsp;</span>
            <MenuIcon role="button" />
            <span>&nbsp;</span>
          </button>
          has additional options to customize the appearance of the editor,
          share your note, and perform actions to quickly format and edit
          Markdown text.
        </p>
        <p>
          A more detailed documentation of the Append Editor is available at{' '}
          <a
            href="https://appendeditor.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            appendeditor.com
          </a>
          . If you like the Append Editor, please support it by giving it a star
          on{' '}
          <a
            href="https://github.com/TheodoreChu/append-editor/stargazers"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .{' '}
          <span role="img" aria-label="smile emoji">
            🙂
          </span>{' '}
        </p>
        <h3>How to install the Append Editor in Standard Notes</h3>
        <ol>
          <li>
            Download, install, and sign in to the Standard Notes{' '}
            <a
              href="https://standardnotes.org/download"
              target="_blank"
              rel="noopener noreferrer"
            >
              Desktop
            </a>{' '}
            app.
          </li>
          <li>
            In the bottom left corner of the app, click <b>Extensions</b>.
          </li>
          <li>
            Click <b>Import Extensions</b> and paste the following link into the
            input box. If you want to use the alpha version, replace{' '}
            <code>beta</code> with <code>alpha</code>:{' '}
            <code>
              <a
                href="https://raw.githubusercontent.com/TheodoreChu/append-editor/main/public/beta.ext.json"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://raw.githubusercontent.com/TheodoreChu/append-editor/main/public/beta.ext.json
              </a>
            </code>
          </li>
          <li>
            Press <b>Enter</b> or <b>Return</b> on your keyboard.
          </li>
          <li>
            The title of your selected note is near the top of the app. Under
            the title, click <b>Editor</b>, click <b>Append Editor</b>, and
            click <b>Continue</b> to begin using the editor. Enjoy!{' '}
            <span role="img" aria-label="clap emoji">
              👏
            </span>{' '}
          </li>
        </ol>
        <p>
          After you install the editor on the desktop app, it will automatically
          sync to the{' '}
          <a
            href="https://app.standardnotes.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            web
          </a>{' '}
          and{' '}
          <a
            href="https://standardnotes.org/download"
            target="_blank"
            rel="noopener noreferrer"
          >
            mobile apps
          </a>{' '}
          after you sign in.
        </p>
        <h3>What to write about</h3>
        <p>
          The Append Editor is great for writing articles, blog posts,
          checklists, code snippets, documentation, emails, essays, journals,
          lists, logs, notes, tables, todo lists, and much more. Here are some
          questions to help you get started with today's daily journal:
        </p>{' '}
        <ul>
          <li>How are you? What's happening?</li>
          <li>What might be affecting your mood?</li>
          <li>Which feelings fit your mood and to what extent?</li>
          <details onToggle={this.onToggleShowFeelings}>
            <summary>
              {!this.state.showFeelings && (
                <p className="link">Show feelings</p>
              )}
              {this.state.showFeelings && <p className="link">Hide feelings</p>}
            </summary>
            <li>
              <b>Positive Feelings:</b> bold, calm, cheerful, confident,
              content, eager, ecstatic, energized, engaged, enthusiastic,
              excited, grateful, happy, humorous, inspired, joyful, light,
              lively, loving, motivated, optimistic, passionate, peaceful,
              playful, proud, reassured, refreshed, relaxed, relieved,
              satisfied, secure, surprised, thrilled, wonderful
            </li>
            <li>
              <b>Negative Feelings:</b> afraid, angry, annoyed, anxious,
              ashamed, bored, burnt out, confused, demoralized, depressed,
              disappointed, disgusted, distraught, embarrassed, empty,
              exhausted, frustrated, furious, guilty, heavy, insecure,
              irritated, jealous, jittery, lethargic, lonely, nervous, numb,
              resentful, sad, self-conscious, sleepy, stressed, tired, winded,
              worried
            </li>
          </details>
          <li>What thoughts are contributing to the way you're feeling?</li>
          <details onToggle={this.onToggleShowMoreQuestions}>
            <summary>
              {!this.state.showMoreQuestions && (
                <p className="link">Show more questions</p>
              )}
              {this.state.showMoreQuestions && (
                <p className="link">Show fewer questions</p>
              )}
            </summary>
          </details>
          {this.state.showMoreQuestions && (
            <div>
              <li>
                What do you hope your life will look like in a week? a month? a
                year?
              </li>
              <li>
                What can you do today to make your life the way you want it?
              </li>
              <li>
                How will you feel when you've realized the goals that you have
                for yourself?
              </li>
              <li>Who or what do you feel grateful for and why?</li>
              <li>What did you enjoy about today?</li>
            </div>
          )}
        </ul>
        <details onToggle={this.onToggleShowFeedback}>
          <summary>
            <p className="link">Need more help?</p>
          </summary>
          {this.state.showFeedback && (
            <p>
              Feel free to{' '}
              <a
                href="https://appendeditor.com/contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                reach out
              </a>{' '}
              if you have any questions, comments, concerns, or feedback.{' '}
              <span role="img" aria-label="wave emoji">
                👋
              </span>
              <br />
              If you find any bugs or have a feature request, please{' '}
              <a
                href="https://github.com/TheodoreChu/append-editor/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                open an issue on GitHub
              </a>
              .{' '}
              <span role="img" aria-label="smile emoji">
                🙂
              </span>
              <br />
              You are using version <code>1.2.6-alpha.1</code>. The release
              notes and change log are available on{' '}
              <a
                href="https://github.com/TheodoreChu/append-editor/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          )}
        </details>
        Click Help
        <button
          className="inline-text-and-svg"
          onClick={clickHelpButton}
          title="Close Help"
        >
          <span>&nbsp;</span>
          <HelpIcon fill={'var(--sn-stylekit-info-color)'} role="button" />
          <span>&nbsp;</span>
        </button>
        to close this section.
        <hr></hr>
      </div>
    );
  }
}
