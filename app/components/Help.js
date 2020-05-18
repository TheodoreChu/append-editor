import React from 'react';

export default class Help extends React.Component {
  constructor(props) {
  super(props);

  this.state = {
    showFeelings: false,
    showMoreQuestions: false,
    showFeedback: false,
    };
    //this.onChange = this.onChange.bind(this);
  }

  onToggleShowFeelings = () => {
    this.setState({
      showFeelings: !this.state.showFeelings
    });
  };

  onToggleShowMoreQuestions = () => {
    this.setState({
      showMoreQuestions: !this.state.showMoreQuestions
    });
  };

  onToggleShowFeedback = () => {
    this.setState({
      showFeedback: !this.state.showFeedback
    });
  };

  render() {
    return (
      <div className={"sk-panel main view " + (this.props.printMode ? 'printModeOn' : 'printModeOff' ) + (this.props.printURL ? ' printURL' : ' printURLOff')}>
        <div className="sk-panel-content view">
          <div className="sk-panel-section">
          <div className="note-entry">
          <div className="note-details">
          <div className="note-info">
            <div className="note-content">
              <hr></hr>
              <h3>How do I use the Append Editor?</h3>
              This editor supports <a href="https://guides.github.com/features/mastering-markdown/" target="_blank" rel="nofollow noreferrer noopener">Markdown</a>, <a href="https://katex.org/docs/support_table.html" target="_blank" rel="nofollow noreferrer noopener">KaTeX</a>, and <a href="https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md" target="_blank" rel="nofollow noreferrer noopener">Emoji codes</a>, syntax highlighting, inline HTML, and more. For the full list of features and keyboard shortcuts, please visit the documentation at <a href="https://appendeditor.com" target="_blank" rel="noopener">appendeditor.com</a>.
              <h3>What do I write about?</h3>
              Here are some questions to help you get started:
              <ul>
                <li>How are you? What's happening?</li>
                <li>What might be affecting your mood?</li>
                <li>Which feelings fit your mood and to what extent?</li>
                  <details onToggle={this.onToggleShowFeelings}>
                  <summary>
                    {!this.state.showFeelings && ([<a>Show feelings</a>])}
                    {this.state.showFeelings && ([<a>Hide feelings</a>])}</summary>
                    <li><b>Positive Feelings:</b> bold, calm, cheerful, confident, content, eager, ecstatic, energized, engaged, enthusiastic, excited, grateful, happy, humorous, inspired, joyful, light, lively, loving, motivated, optimistic, passionate, peaceful, playful, proud, reassured, refreshed, relaxed, relieved, satisfied, secure, surprised, thrilled, wonderful</li>
                    <li><b>Negative Feelings:</b> afraid, angry, annoyed, anxious, ashamed, bored, burnt out, confused, demoralized, depressed, disappointed, disgusted, distraught, embarrassed, empty, exhausted, frustrated, furious, guilty, heavy, insecure, irritated, jealous, jittery, lethargic, lonely, nervous, numb, resentful, sad, self-conscious, sleepy, stressed, tired, winded, worried</li>
                  </details>
                <li>What thoughts are contributing to the way you're feeling?</li>
                  <details onToggle={this.onToggleShowMoreQuestions}>
                    <summary>
                    {!this.state.showMoreQuestions && ([<a>Show more questions</a>])}
                    {this.state.showMoreQuestions && ([<a>Show fewer questions</a>])}
                    </summary>
                  </details>
                {this.state.showMoreQuestions &&([
                <div>
                <li>What do you hope your life will look like in a week? a month? a year?</li>
                <li>What can you do today to make your life the way you want it?</li>
                <li>How will you feel when you've realized the goals that you have for yourself?</li>
                <li>Who or what do you feel grateful for and why?</li>
                <li>What did you enjoy about today?</li>
                </div>
                ])}
              </ul>
              <details onToggle={this.onToggleShowFeedback}>
                <summary><a>Give feedback</a></summary>
                {this.state.showFeedback && ([
                <div>
                Feel free to <a href="https://appendeditor.com/contact" target="_blank" rel="noopener">reach out</a> if you have any questions, comments, concerns, or feedback. 👋
                <br></br><br></br>
                </div>
                ])}
              </details>
              Click&nbsp;<strong>Help</strong>&nbsp;in the top menu to close this section.
              <hr></hr>
            </div>
          </div>
          </div>
          </div>
          </div>
        </div>
      </div>
  );
  }
}
