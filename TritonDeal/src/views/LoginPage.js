import React, { Component } from 'react';
import { Input, Icon, Button, Overlay } from 'react-native-elements';
import { Linking, ActivityIndicator } from 'react-native';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  Alert
} from 'react-native';
import { Actions} from 'react-native-router-flux';
import { HEADER } from '../images';
import Login from '../components/Login';
import { firebase } from '@react-native-firebase/dynamic-links';
import GradientButton from '../components/GradientButton';
import Dialog from '../components/Dialog';
import message from '../message';

function parseURL(url) {
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while (match = regex.exec(url)) {
    params[match[1]] = match[2];
  }
  return params;
}

class LoginPage extends Component {
  state = {
    isVisible: false,
    dialogText: '',
    finished: true,
  };

  componentDidMount() {
    Linking.getInitialURL().then(this.handeLaunchByUrl);
    Linking.addEventListener("url", this.handeLaunchByUrl);
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handeLaunchByUrl);
  }

  handeLaunchByUrl = (event) => {
    if (event) {
      var deepLinkParams = parseURL(decodeURIComponent(parseURL(event.url).link));
      var mode = deepLinkParams.mode;
      var oobCode = deepLinkParams.oobCode;

      switch (mode) {
        case 'verifyEmail':
          this.handleVerifyEmail(oobCode);
          break;
        default:
          console.warn('Wrong action!');
      }
    }
  };

  handleVerifyEmail = (oobCode) => {
    firebase.auth().applyActionCode(oobCode).then(() => {
      Alert.alert(
        null,
        'Thank you. Your email address has been verified.',
        [{text: 'OK'}],
      );
      firebase.auth().currentUser.reload();
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        if (errorCode == 'auth/expired-action-code') {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: message.LINK_EXPIRE,
          }));
        } else if (errorCode == 'auth/invalid-action-code') {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: message.LINK_INVALID,
          }));
        } else {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: errorMessage,
          }));
        }
      }
    });
  }

  handleSignOut = () => {
    firebase.auth().signOut().then(() => ToastAndroid.show('Successfully signed out.', ToastAndroid.SHORT)).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        if (errorCode == 'auth/no-current-user') {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: message.NO_USER,
          }));
        } else {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: errorMessage,
          }));
        }
      }
    });
  };

  render() {
    return (
      <ImageBackground source={HEADER} style={style.header}>
        <Text style={style.text}>Triton Deal</Text>
        <Login />
        <GradientButton
          text={"Sign Out"}
          onPress={this.handleSignOut}
        />
        <View style={style.bottomTextContainer}>
          <View style={style.bottomTextWrapper}>
            <TouchableOpacity>
              <Text style={style.bottomText} onPress={() => Actions.EditProfile()}>Skip Login</Text>
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
    height: '100%',
    width: '100%',
  },

  text: {
    textAlign: 'center',
    color: '#006EA6',
    fontWeight: 'bold',
    fontSize: 35,
    marginTop: 250,
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
  },

  bottomTextWrapper: {
    flex: 1,
  },
});

export default LoginPage;
