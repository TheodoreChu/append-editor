import React from 'react';
import ViewNote from './ViewNote'

export default class ViewMode extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { text, viewMode} = this.props

    return (
        <ViewNote
          viewMode={viewMode}
          text={text}
        />
    );
  }
}
