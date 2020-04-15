import React from 'react';

// this component is unused

export default class NoteMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  onToggle = () => {
    this.setState({
      show: !this.state.show
    });
  };

  render() {
    //const {onFlip} = this.props

    return (
      <div className="note-menu">
        <div className="sk-button" onClick={this.onToggle}>
          <div className="sk-label">•••</div>
        </div>
        {this.state.show && [
          //<div className="note-overlay" onClick={this.onToggle} />,
          <div className="sk-menu-panel">
            <div className="sk-menu-panel-row">
              <div className="sk-label">Help</div>
            </div>
            <div className="sk-menu-panel-row">
              <div className="sk-label">Autosave</div>
            </div>
            <div className="sk-menu-panel-row">
              <div className="sk-label">Feedback</div>
            </div>
          </div>
        ]}
      </div>
    );
  }
}
