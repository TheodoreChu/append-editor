import 'regenerator-runtime/runtime';
import React from 'react';
import AppendEditor from './components/AppendEditor';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AppendEditor />
      </div>
    );
  }
}
