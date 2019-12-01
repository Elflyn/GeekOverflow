import React from 'react';
import RouterComponent from './RouterComponent';
import {YellowBox} from 'react-native';

class App extends React.Component {
  
  componentDidMount() {
    YellowBox.ignoreWarnings(['Warning']);
  }
  render(){
    return (<RouterComponent />);
  }
}

export default App;
