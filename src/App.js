import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import './App.css';

class App extends Component {
  state = {
    value: '',
    output: [],
    folders: [],
  };

  handleChange = ({ target: { value } }) => this.setState({ value });

  handleKeyPress = ({ key }) => {
    const { output, value, folders } = this.state;
    let outputProcessed = output.concat(value);
    let foldersList = folders;

    if (key.includes('Enter')) {
      if (_.isEqual(value, 'clear') || _.isEqual(value, 'exit')) {
        outputProcessed = [];
      } else if (value.includes('mkdir')) {
        foldersList = folders.concat(value.trim().split(' ').slice(1));
      } else if (value.includes('rm')) {
        const toRemove = value.trim().split(' ').slice(1);

        toRemove.forEach(name => {
          const index = folders.indexOf(name);

          if (index !== -1) {
            foldersList = folders.slice(index);
          }
        });
      } else if (_.isEqual(value, 'ls')) {
        outputProcessed = output.concat(value).concat(folders);
      }

      this.setState({
        value: '',
        output: outputProcessed || output,
        folders: foldersList || folders,
      });
    }
  };

  render() {
    const { value, output } = this.state;
    return (
      <div className="app">
        <h1><FontAwesome name="terminal" className="icon" /> Terminal<span>.js</span></h1>
        <h2>Simple React Single Page App</h2>

        <div className="content">
          <div className="terminal">
            <div className="output">
              {output.map((line, index) => <p key={index}>{line}</p>)}
            </div>
            <div className="input">
              <FontAwesome name="angle-right" className="icon" />
              <input
                autoFocus
                value={value}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
            </div>
          </div>
        </div>
        <footer>&copy; 2016 | glarivie@student.42.fr | All rights reserved.</footer>
      </div>
    );
  }
}

export default App;
