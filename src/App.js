import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import './App.css';

class App extends Component {
  state = {
    value: '',
    output: [],
    folders: [],
    history: [],
    historyIndex: 0,
  };

  handleChange = ({ target: { value } }) => this.setState({ value });

  handleKeyPress = async ({ key }) => {
    const { output, value, folders, history, historyIndex } = this.state;
    let outputProcessed = output.concat(
      <strong className="cmd">
        <FontAwesome name="angle-right" />&nbsp;{value}
      </strong>
    );
    let foldersList = folders;

    if (key.includes('Enter')) {
      if (_.isEqual(value, 'clear') || _.isEqual(value, 'exit')) {
        outputProcessed = [];
      } else if (value.includes('mkdir')) {
        foldersList = folders.concat(value.trim().split(' ').slice(1));
      } else if (value.includes('rm')) {
        const toRemove = value.trim().split(' ').slice(1);

        toRemove.forEach(name => {
          const index = foldersList.indexOf(name);
          if (index !== -1) foldersList.splice(index, 1);
        });
      } else if (_.isEqual(value, 'ls')) {
        const foldersProcessed = folders.length && (
          <span className="folders">
            {folders.map((el, index) => (
              <span className="folder" key={index}>{el}</span>
            ))}
          </span>
        );

        outputProcessed = outputProcessed.concat(foldersProcessed || []);
      } else {
        outputProcessed = outputProcessed.concat(
          <span className="err">
            [error] command not found: {value.split(' ')[0]}
          </span>
        );
      }

      await this.setState({
        value: '',
        output: outputProcessed.length > 19 ? outputProcessed.slice(-19) : (outputProcessed || output),
        folders: foldersList || folders,
        history: history.concat(value),
      });
      this.setState({ historyIndex: this.state.history.length - 1 });
    } else if (key.includes('ArrowUp')) {
      if (history[historyIndex - 1]) {
        this.setState({
          value: history[historyIndex - 1],
          historyIndex: historyIndex - 1,
        });
      }
    } else if (key.includes('ArrowDown')) {
      if (history[historyIndex + 1]) {
        this.setState({
          value: history[historyIndex + 1],
          historyIndex: historyIndex + 1,
        });
      }
    }
  };

  render() {
    const { value, output } = this.state;

    return (
      <div className="app">
        <h1><FontAwesome name="terminal" className="icon" /> Terminal<span>.js</span></h1>
        <h2>Simple terminal made with React</h2>

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
                onKeyDown={this.handleKeyPress}
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
