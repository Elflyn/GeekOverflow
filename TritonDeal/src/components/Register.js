import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import { Input, Icon, Overlay } from 'react-native-elements';
import GradientButton from './GradientButton';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import { Actions } from 'react-native-router-flux';
import Dialog from './Dialog';
import message from '../message';

export default class Register extends React.Component {

  state = {
    email: 'example@ucsd.edu',
    password: 'password',
    unsubscribe: null,
    isVisible: false,
    dialogText: '',
    passwordError: '',
    emailError: '',
    finished: true,
  };

  componentDidMount = () => {
    var unsub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!user.emailVerified) {
          var actionCodeSettings = {
            url: 'https://ucsd.edu',
            android: {
              packageName: 'com.tritondeal',
              installApp: true,
              minimumVersion: '12'
            },
            handleCodeInApp: true,
            dynamicLinkDomain: "tritondeal.page.link"
          };
          user.sendEmailVerification(actionCodeSettings).then(() => {
            this.setState(prev => ({
              ...prev,
              isVisible: true,
              dialogText: message.VALIDATE_EAMIL,
            }));
          });
        }
      }
    });

    this.setState({ unsubscribe: unsub });
  };

  componentWillUnmount = () => {
    if (this.state.unsubscribe) {
      this.state.unsubscribe();
    }
  }

  toggleActivityIndicator = () => {
    this.setState({ finished: !this.state.finished });
  };

  handleCreateUser = () => {
    this.toggleActivityIndicator();
    this.setState(prev => ({
      ...prev,
      dialogText: '',
      passwordError: '',
      emailError: '',
    }));
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
      this.toggleActivityIndicator();
    }).catch((error) => {
      this.toggleActivityIndicator();
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        if (errorCode == 'auth/weak-password') {
          this.setState(prev => ({
            ...prev,
            emailError: '',
            passwordError: message.WEAK_PASSWORD,
          }));
        } else if (errorCode == 'auth/invalid-email') {
          this.setState(prev => ({
            ...prev,
            passwordError: '',
            emailError: message.INVALID_EMAIL,
          }));
        } else if (errorCode == 'auth/email-already-in-use') {
          this.setState(prev => ({
            ...prev,
            passwordError: '',
            emailError: message.EMAIL_IN_USE,
          }));
        } else {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: errorMessage,
          }));
        }
      }
    })
  };

  render() {
    return (
      <View style={style.container}>
        <Overlay
          isVisible={!this.state.finished}
          width="auto"
          height="auto"
        >
          <ActivityIndicator size='large' color='#eabb33' />
        </Overlay>
        <Input
          placeholder="Enter your email"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="envelope" type="evilicon" />
          }
          keyboardType="email-address"
          onChangeText={(value) => this.setState({ email: value })}
          errorStyle={style.errorStyle}
          errorMessage={this.state.emailError}
        />
        <Input
          placeholder="Enter your username"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="user" type="evilicon" />
          }
        />
        <Input
          placeholder="Password"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="lock" type="evilicon" />
          }
          secureTextEntry={true}
          onChangeText={(value) => this.setState({ password: value })}
          errorStyle={style.errorStyle}
          errorMessage={this.state.passwordError}
        />
        <Input
          placeholder="Confirm Password"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="lock" type="evilicon" />
          }
          secureTextEntry={true}
        />
        <Input
          placeholder="Phone number"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="phone-android" type="MaterialIcons" />
          }
          keyboardType="phone-pad"
        />
        <GradientButton
          text={"Sign Up"}
          onPress={this.handleCreateUser}
        />
        <Dialog isVisible={this.state.isVisible} text={this.state.dialogText} onPress={() => { this.setState({ isVisible: false }); Actions.pop(); }} />
      </View>
    )
  };
};

const style = StyleSheet.create({

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  iconStyle: {
    marginRight: 15,
    color: '#004862',
  },

  hyperlink: {
    color: '#94B4AF',
    textDecorationLine: 'underline',
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 10,
  },

  container: {
    paddingHorizontal: 38,
    textAlign: 'center',
  },

  errorStyle: {
    color: 'red',
    paddingLeft: 45,
    fontSize: 18,
  }

});;

