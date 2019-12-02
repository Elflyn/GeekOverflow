import React from 'react';
import { View, StyleSheet, ImageBackground, StatusBar } from 'react-native'
import { firebase } from '@react-native-firebase/auth';
import { SPLASH } from '../images';
import { Actions, ActionConst } from 'react-native-router-flux';
import ChatList from './ChatList';

export default class SplashScreen extends React.Component {

  state = {
    isUserLoggedIn: false
  }

  componentDidMount = async () => {
    const cl = new ChatList();
    this.props.updateList(await cl.getList());
    if (firebase.auth().currentUser) {
      setTimeout(() => Actions.root(), 500);
    } else {
      setTimeout(() => Actions.login(), 500);
    }
  }
  
  render() {
    return (
      <View style={style.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          animated
        />
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