import { Component } from 'react';
import Nav from './nav/Nav';
import { Route, withRouter } from 'react-router-dom';
import HelpMain from './help/HelpMain';
import ExportMain from './export/ExportMain';
import ImportMain from './import/ImportMain';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      test: 'OFFLINE',
      location: 'main'
    }
    this.testclick = () => {
      alert('test')
    }
  }

  componentDidMount() {
    fetch('/test')
    .then(response => response.json())
    .then(value => this.setState({test: value.test}))
  }

  render() {
    const { test } = this.state;

    return (
      <div className="App">
        <Route exact path = '/' component={Nav} />
        <Route path='/help' component={HelpMain}/>
        <Route path='/export' component={ExportMain}/>
        <Route path='/import' component={ImportMain}/>
        <p style={{position: 'fixed', top: '95vh', background: 'black', color: 'white'}} onClick={this.testclick}>Server status is: {test}</p>
      </div>
    );
  }
}

export default withRouter(App);