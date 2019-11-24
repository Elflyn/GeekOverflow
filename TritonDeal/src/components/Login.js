import React from 'react';
import { StyleSheet, View, Text, Linking, ToastAndroid, Alert } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import OrBreak from './OrBreak';
import GradientButton from '../components/GradientButton';
import { firebase } from '@react-native-firebase/auth';
import Dialog from './Dialog';
import message from '../message';


export default class Login extends React.Component {

  state = {
    email: null,
    password: null,
    unsubscribe: null,
    isVisible: false,
    dialogText: '',
    passwordError: '',
    emailError: '',
  };

  handleLogin = () => {
    if (this.state.password && this.state.email) {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        if (!firebase.auth().currentUser.emailVerified) {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: message.EMAIL_NOT_VARIFIED,
          }));
        } else {
          this.setState(prev => ({
            ...prev,
            isVisible: true,
            dialogText: message.LOGIN_SUCCESS,
          }));
        }
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode) {
          if (errorCode == 'auth/invalid-email') {
            this.setState(prev=> ({...prev, passwordError: '', emailError: message.INVALIDEMAIL}))
          } else if (errorCode == 'auth/user-disabled') {
            this.setState(prev => ({
              ...prev,
              isVisible: true,
              dialogText: message.ACCOUNT_DISABLED,
            }));
          } else if (errorCode ==='auth/user-not-found' || errorCode === 'auth/wrong-password') {
            this.setState(prev => ({...prev, emailError: '', passwordError: message.WORNGCOMBINATION}))
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
  }

  render() {
    return (
      <View style={style.loginContainer}>
        <Input
          placeholder="Email Address"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="envelope" type="evilicon" />
          }
          keyboardType="email-address"
          onChangeText={(value) => this.setState({ email: value })}
          errorStyle={style.errorStyle}
          errorMessage={this.state.emailError}
        />

        <OrBreak />

        <Input
          placeholder="Username"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="user" type="evilicon" />
          }
        />
        <Input
          placeholder="Password"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="unlock" type="evilicon" />
          }
          secureTextEntry={true}
          onChangeText={(value) => this.setState({ password: value })}
          errorStyle={style.errorStyle}
          errorMessage={this.state.passwordError}
        />
        <Text
          style={style.hyperlink}
          onPress={() => Linking.openURL('http://google.com')}>
          Forget password?
    </Text>
        <GradientButton text={"Log in"} onPress = {this.handleLogin} />
        <Dialog text={this.state.dialogText} isVisible={this.state.isVisible} onPress={() => {this.setState({isVisible: false})}} />
      </View>
    );
  }

}

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

  loginContainer: {
    paddingHorizontal: 38,
    textAlign: 'center',
  },

  container: {
    paddingHorizontal: 38,
    textAlign: 'center',
  },

  errorStyle: {
    color: 'red',
    paddingLeft: 45,
  }
});
