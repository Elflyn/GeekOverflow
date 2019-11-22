import React from 'react';
import { StyleSheet, View, Text, Linking, ToastAndroid, Alert } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import OrBreak from './OrBreak';
import GradientButton from '../components/GradientButton';
import { firebase } from '@react-native-firebase/auth';


export default class Login extends React.Component {

  state = {
    email: null,
    password: null,
    unsubscribe: null
  };

  handleLogin = () => {
    if (this.state.password && this.state.email) {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
        if (!firebase.auth().currentUser.emailVerified) {
          Alert.alert(
            null,
            'Your email address is not verified. Please check your email',
            [{text: 'OK'}]
          );
        } else {
          Alert.alert(
            null,
            'Login successful!',
            [{text: 'OK'}]
          );
        }
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode) {
          if (errorCode == 'auth/invalid-email') {
            ToastAndroid.show('The email address is invalid.', ToastAndroid.SHORT);
          } else if (errorCode == 'auth/user-disabled') {
            ToastAndroid.show('Sorry, your account has been disabled.', ToastAndroid.SHORT);
          } else if (errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password') {
            ToastAndroid.show('Wrong email/password combination.', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
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
        />
        <Text
          style={style.hyperlink}
          onPress={() => Linking.openURL('http://google.com')}>
          Forget password?
    </Text>
        <GradientButton text={"Log in"} onPress = {this.handleLogin} />
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
});
