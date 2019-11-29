import { Overlay, Input, Icon } from 'react-native-elements';
import React from 'react';
import { View, Text, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import GradientButton from "./GradientButton";
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import message from '../message'

export default class ReauthDialog extends React.Component {
  state = { password: null, passwordError: '', visible: true, finished: true };

  handleReauthentication = () => {
    if (this.state.password) {
      this.toggleActivityIndicator();
      const user = firebase.auth().currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.state.password
      );
      user.reauthenticateWithCredential(credential).then(() => {
        firebase.auth().currentUser.updateEmail(this.props.newEmail).then(() => {
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
          firebase.auth().currentUser.sendEmailVerification(actionCodeSettings);
          ToastAndroid.show(message.VALIDATE_EAMIL, ToastAndroid.SHORT);
          this.toggleActivityIndicator();
          this.setState({ visible: false })
          firebase.auth().currentUser.reload();
        }).catch((error) => {
          this.toggleActivityIndicator();
          var errorCode = error.code;
          var errorMessage = error.message;
          ToastAndroid.show(errorCode + ": " + errorMessage, ToastAndroid.SHORT);
        });
      }).catch((error) => {
        this.toggleActivityIndicator();
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/wrong-password") {
          this.setState({ passwordError: 'Wrong password' });
        } else {
          ToastAndroid.show(errorCode + ": " + errorMessage, ToastAndroid.SHORT);
        }
      });
    }
  }

  toggleActivityIndicator = () => {
    this.setState({ finished: !this.state.finished });
  };

  render() {
    return (
      <View>
        <Overlay style={style.box}
          isVisible={this.props.visible && this.state.visible}
          windowBackgroundColor="rgba(255, 255, 255, .8)"
          overlayBackgroundColor="white"
          width={350}
          height="auto"
        >
          <View>
            <Text style={style.centerText}>Please re-enter your password</Text>
            <Input
              placeholder="Password"
              leftIcon={
                <Icon iconStyle={style.iconStyle} name="lock" type="evilicon" />
              }
              secureTextEntry={true}
              onChangeText={(value) => this.setState({password: value, passwordError: ''})}
              errorStyle={style.errorStyle}
              errorMessage={this.state.passwordError}
            />
            <GradientButton
              text={"OK"}
              onPress={this.handleReauthentication}
            />
          </View>
        </Overlay>
        <Overlay
          isVisible={!this.state.finished}
          width="auto"
          height="auto"
        >
          <ActivityIndicator size='large' color='#eabb33' />
        </Overlay>
      </View>
    )
  }
}

const style = StyleSheet.create({
  centerText: {
    textAlign: 'center',
    fontSize: 18,
    paddingRight: 30,
    paddingLeft: 30,
    paddingBottom: 5,
  },
  errorStyle: {
    color: 'red',
    paddingLeft: 45,
    fontSize: 15,
  },
});
