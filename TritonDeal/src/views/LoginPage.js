import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { HEADER } from '../images';
import Login from '../components/Login';
import { firebase } from '@react-native-firebase/dynamic-links';
import Dialog from '../components/Dialog';
import message from '../message';

class LoginPage extends Component {
  state = {
    isVisible: false,
    dialogText: '',
    finished: true,
  };

  render() {
    return (
      <ImageBackground source={HEADER} style={style.header}>
        <Text style={style.text}>Triton Deal</Text>
        <Login />
        <View style={style.bottomTextContainer}>
          <View style={style.bottomTextWrapper}>
            <TouchableOpacity>
              <Text style={style.bottomText} onPress={() => Actions.root()}>Skip Login</Text>
            </TouchableOpacity>
          </View>
          <View tyle={style.bottomTextWrapper}>
            <TouchableOpacity onPress={() => {
              if (!firebase.auth().currentUser) {
                Actions.signup('Triton Deal')
              } else {
                firebase.auth().currentUser.reload().then(() => {
                  if (firebase.auth().currentUser.emailVerified) {
                    this.setState(prev => ({
                      ...prev,
                      isVisible: true,
                      dialogText: message.SIGNED_IN,
                    }));
                  } else {
                    this.setState(prev => ({
                      ...prev,
                      isVisible: true,
                      dialogText: message.EMAIL_NOT_VARIFIED,
                    }));
                  }
                })
              }
            }}>
              <Text style={style.bottomText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Dialog text={this.state.dialogText} isVisible={this.state.isVisible} onPress={() => {this.setState({isVisible: false})}} />
      </ImageBackground>
    );
  }
}


const ThirdPartyLogin = () => (
  <View>
    <View style={{ flexDirection: 'row' }}>
      <View style={style.line} />
      <Text style={style.middleText}>Or connect with</Text>
      <View style={style.line} />
    </View>
    <View style={style.iconContainer}>
      <Icon raised name="facebook" type="font-awesome" color="#3b5998" />
      <Icon raised name="google-plus" type="font-awesome" color="#D01400" />
    </View>
  </View>
);

const style = StyleSheet.create({
  header: {
    paddingTop: StatusBar.currentHeight,
    height: '100%',
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  text: {
    textAlign: 'center',
    color: '#006EA6',
    fontWeight: 'bold',
    fontSize: 35,
    marginTop: 220,
    marginBottom: 40,
  },

  centerText: {
    textAlign: 'center',
  },

  formContainer: {
    width: 350,
    marginTop: 110,
    marginBottom: 15,
    height: 'auto',
  },

  form: {
    paddingHorizontal: 20,
    paddingTop: 25,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
  },

  centerContent: {
    textAlign: 'center',
  },

  bottomTextContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    marginTop: 25,
  },

  bottomText: {
    color: '#94B4AF',
    textDecorationLine: 'underline',
    fontSize: 18,
    paddingRight: 10,
    marginTop: 30
  },

  bottomTextWrapper: {
    flex: 1,
  },
});

export default LoginPage;
