import React from 'react';

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

  onToggleShowHelp = () => {
    const helpButton = document.getElementById('helpButton');
    if (helpButton) {
      helpButton.click();
    }
  };

  render() {
    return (
      <div id="help">
        <hr></hr>
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
          notes app. The source code is available on{' '}
          <a
            href="https://github.com/TheodoreChu/append-editor"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            GitHub
          </a>
          .
        </p>
        <h3>How do I use the Append Editor?</h3>
        <p>
          This editor supports{' '}
          <a
            href="https://guides.github.com/features/mastering-markdown/"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            Markdown
          </a>
          ,{' '}
          <a
            href="https://katex.org/docs/support_table.html"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            KaTeX
          </a>
          , and{' '}
          <a
            href="https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md"
            target="_blank"
            rel="nofollow noreferrer noopener"
          >
            emoji codes
          </a>
          , syntax highlighting, in-line HTML, table of contents, footnotes,
          auto-linking, printing, and more. For the full list of features and
          keyboard shortcuts, please visit the documentation at{' '}
          <a
            href="https://appendeditor.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            appendeditor.com
          </a>
          .
        </p>
        <h3>How do I Install the Append Editor in Standard Notes?</h3>
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
        </ol>
        <h3>What do I write about?</h3>
        Here are some questions to help you get started:
        <ul>
          <li>How are you? What's happening?</li>
          <li>What might be affecting your mood?</li>
          <li>Which feelings fit your mood and to what extent?</li>
          <details onToggle={this.onToggleShowFeelings}>
            <summary>
              {!this.state.showFeelings && [
                <p className="link">Show feelings</p>,
              ]}
              {this.state.showFeelings && [
                <p className="link">Hide feelings</p>,
              ]}
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
              {!this.state.showMoreQuestions && [
                <p className="link">Show more questions</p>,
              ]}
              {this.state.showMoreQuestions && [
                <p className="link">Show fewer questions</p>,
              ]}
            </summary>
          </details>
          {this.state.showMoreQuestions && [
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
            </div>,
          ]}
        </ul>
        <details onToggle={this.onToggleShowFeedback}>
          <summary>
            <p className="link">Need more help?</p>
          </summary>
          {this.state.showFeedback && [
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
              You are using version <code>1.1.2</code>. The release notes are
              available on{' '}
              <a
                href="https://github.com/TheodoreChu/append-editor/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>,
          ]}
        </details>
        Click&nbsp;
        <svg
          role="button"
          aria-label="Toggle show help"
          onClick={this.onToggleShowHelp}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.16675 15.0001H10.8334V13.3334H9.16675V15.0001ZM10.0001 1.66675C8.90573 1.66675 7.8221 1.8823 6.81105 2.30109C5.80001 2.71987 4.88135 3.3337 4.10753 4.10753C2.54472 5.67033 1.66675 7.78995 1.66675 10.0001C1.66675 12.2102 2.54472 14.3298 4.10753 15.8926C4.88135 16.6665 5.80001 17.2803 6.81105 17.6991C7.8221 18.1179 8.90573 18.3334 10.0001 18.3334C12.2102 18.3334 14.3298 17.4554 15.8926 15.8926C17.4554 14.3298 18.3334 12.2102 18.3334 10.0001C18.3334 8.90573 18.1179 7.8221 17.6991 6.81105C17.2803 5.80001 16.6665 4.88135 15.8926 4.10753C15.1188 3.3337 14.2002 2.71987 13.1891 2.30109C12.1781 1.8823 11.0944 1.66675 10.0001 1.66675ZM10.0001 16.6668C6.32508 16.6668 3.33342 13.6751 3.33342 10.0001C3.33342 6.32508 6.32508 3.33342 10.0001 3.33342C13.6751 3.33342 16.6668 6.32508 16.6668 10.0001C16.6668 13.6751 13.6751 16.6668 10.0001 16.6668ZM10.0001 5.00008C9.11603 5.00008 8.26818 5.35127 7.64306 5.97639C7.01794 6.60151 6.66675 7.44936 6.66675 8.33342H8.33342C8.33342 7.89139 8.50901 7.46747 8.82157 7.1549C9.13413 6.84234 9.55806 6.66675 10.0001 6.66675C10.4421 6.66675 10.866 6.84234 11.1786 7.1549C11.4912 7.46747 11.6667 7.89139 11.6667 8.33342C11.6667 10.0001 9.16675 9.79175 9.16675 12.5001H10.8334C10.8334 10.6251 13.3334 10.4167 13.3334 8.33342C13.3334 7.44936 12.9822 6.60151 12.3571 5.97639C11.732 5.35127 10.8841 5.00008 10.0001 5.00008Z"
            fill={'var(--sn-stylekit-info-color)'}
          />
        </svg>
        &nbsp;in the top menu to close this section.
        <hr></hr>
      </div>
    );
  }
}
