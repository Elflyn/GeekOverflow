import React from 'react';
import { StyleSheet, View, Text, Linking, TouchableOpacity, ToastAndroid, Alert } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import GradientButton from './GradientButton';
import auth from '@react-native-firebase/auth';
import { firebase } from '@react-native-firebase/auth';
import { Actions } from 'react-native-router-flux';
import Dialog from './Overlay';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isVisible: false, text: "empty"};
    }

  state = {
    email: 'example@ucsd.edu',
    password: 'password',
    unsubscribe: null
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
            Alert.alert(
              null,
              'Verification link has been sent to your email address.',
              [
                {text: 'OK', onPress: () => {Actions.pop()}}
              ],
              {cancelable: false}
            );
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
  };

  handleCreateUser = () => {
    return (
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode) {
          if (errorCode == 'auth/weak-password') {
              this.setState({ isVisible: true, text:"Your password is too weak."});
          } else if (errorCode == 'auth/invalid-email') {
            ToastAndroid.show('The email address is invalid.', ToastAndroid.SHORT);
          } else if (errorCode == 'auth/email-already-in-use') {
            ToastAndroid.show('The email address is already in use.', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
          }
        }
      })
    );
  };

  render() {
    return (
      <View style={style.container}>
        <Input
          placeholder="Enter your email"
          leftIcon={
            <Icon iconStyle={style.iconStyle} name="envelope" type="evilicon" />
          }
          keyboardType="email-address"
          onChangeText={(value) => this.setState({ email: value })}
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
        <Dialog isVisible={this.state.isVisible} text={this.state.text}/>
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
});

