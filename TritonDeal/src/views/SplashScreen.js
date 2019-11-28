import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native'
import { firebase } from '@react-native-firebase/auth';
import { SPLASH } from '../images';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class SplashScreen extends React.Component {

  state = {
    isUserLoggedIn: false
  }

  componentDidMount = () => {
    if (firebase.auth().currentUser) {
      setTimeout(() => Actions.root(), 1000);
    } else {
      setTimeout(() => Actions.login(), 1000);
    }
  }
  
  render() {
    return (
      <View style={style.container}>
        <ImageBackground source={SPLASH} style={style.backgroundImage} />
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    resizeMode: 'center',
    flex: 1,
  },
});