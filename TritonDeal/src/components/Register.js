import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ToastAndroid, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { Input, Icon, Overlay } from 'react-native-elements';
import GradientButton from './GradientButton';
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/database';
import { Actions } from 'react-native-router-flux';
import Dialog from './Dialog';
import message from '../message';
import { tsParameterProperty } from '@babel/types';

export default class Register extends React.Component {

  state = {
    email: null,
    password: null,
    confirmpassword: null,
    username: null,
    unsubscribe: null,
    isVisible: false,
    dialogText: '',
    passwordError: '',
    emailError: '',
    usernameError: '',
    confirmError: '',
    finished: true,
    focusedEmail: false,
    focusedConfirm: false,
    emailMatch: false
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
            this.toggleActivityIndicator();
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
    if (!this.state.finished) {
      this.toggleActivityIndicator();
    }
    if (this.state.unsubscribe) {
      this.state.unsubscribe();
    }
  }

  onPressOK = () => {
    this.setState({ isVisible: false })
    if (this.state.dialogText === message.VALIDATE_EAMIL) {
      Actions.root();
    }
  }

  toggleActivityIndicator = () => {
    this.setState({ finished: !this.state.finished });
  };

  handleCreateUser = () => {
    var emailValid = false;
    if (this.state.email) {
      emailValid = emailReg.test(this.state.email);
      if (emailValid == true) {
        this.setState(prev => ({
          ...prev,
          emailMatch: true,
          emailError: '',
        }));
      } else {
        this.setState(prev => ({
          ...prev,
          emailMatch: false,
          emailError: 'Please enter a valid email address',
        }));
      }
    }
    if (this.state.password) {
      this.setState(prev => ({
        ...prev,
        passwordError: '',
      }));
    }
    if (this.state.password === this.state.confirmpassword) {
      this.setState(prev => ({
        ...prev,
        confirmError: '',
      }));
    }
    if (emailValid && this.state.password === this.state.confirmpassword && this.state.password && this.state.username) {
      this.toggleActivityIndicator();
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.username,
        }).then(() => {
          firebase.auth().currentUser.reload()
          const ref = firebase.database().ref('email_to_uid');
          ref.push({ email: this.state.email, uid: firebase.auth().currentUser.uid })
        });
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
    }
    if (!emailValid) {
      this.setState(prev => ({
        ...prev,
        emailError: 'Please enter a valid email address',
      }));
    }
    if (!this.state.username) {
      this.setState(prev => ({
        ...prev,
        usernameError: 'Please enter a username',
      }));
    }
    if (!this.state.password) {
      this.setState(prev => ({
        ...prev,
        passwordError: 'Please enter a password'
      }));
    }
    if (!(this.state.password === this.state.confirmpassword)) {
      this.setState(prev => ({
        ...prev,
        confirmError: 'Password doesn\'t match'
      }));
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={style.container}>
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
          onChangeText={(value) => this.setState({ email: value, emailError: '' })}
          errorStyle={style.errorStyle}
          errorMessage={this.state.emailError}
          onEndEditing={() => {
            var ifEmailMatch = emailReg.test(this.state.email)
            this.setState({ emailMatch: ifEmailMatch, focusedEmail: true })
            if (ifEmailMatch) {
              this.setState({ emailError: '' });
            }
          }}
          inputContainerStyle={this.state.emailMatch || !this.state.focusedEmail ? null : { borderBottomColor: 'red' }}
        />
        <Input
          placeholder="Enter your username"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="user" type="evilicon" />
          }
          onChangeText={(value) => this.setState({ username: value, usernameError: '' })}
          errorStyle={style.errorStyle}
          errorMessage={this.state.usernameError}
        />
        <Input
          placeholder="Password"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="lock" type="evilicon" />
          }
          secureTextEntry={true}
          onChangeText={(value) => this.setState({ password: value, passwordError: '' })}
          errorStyle={style.errorStyle}
          errorMessage={this.state.passwordError}
        />
        <Input
          placeholder="Confirm Password"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="lock" type="evilicon" />
          }
          errorStyle={style.errorStyle}
          errorMessage={this.state.confirmError}
          onChangeText={(value) => this.setState({ confirmpassword: value, confirmError: '' })}
          secureTextEntry={true}
          onFocus={() => this.setState({ focusedConfirm: true })}
          inputContainerStyle={this.state.password == this.state.confirmpassword || !this.state.focusedConfirm ? null : { borderBottomColor: 'red' }}
        />
        <GradientButton
          text={"Sign Up"}
          onPress={this.handleCreateUser}
        />
        <Dialog isVisible={this.state.isVisible} text={this.state.dialogText} onPress={this.onPressOK} />
      </KeyboardAvoidingView>
    )
  };
};

const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

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
    fontSize: 15,
  }

});;

