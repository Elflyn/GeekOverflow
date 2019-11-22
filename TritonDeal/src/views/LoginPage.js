import React, {Component} from 'react';
import {Input, Icon, Button} from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {HEADER} from '../images';
import Login from '../components/Login';
import { firebase } from '@react-native-firebase/auth';
import GradientButton from '../components/GradientButton';

class LoginPage extends Component {

  handleSignOut = () => {
    firebase.auth().signOut().then(() => ToastAndroid.show('Successfully signed out.', ToastAndroid.SHORT)).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        if (errorCode == 'auth/no-current-user') {
          ToastAndroid.show('No user is currently signed in.', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
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
              <Text style={style.bottomText}>Skip Login</Text>
            </TouchableOpacity>
          </View>
          <View tyle={style.bottomTextWrapper}>
            <TouchableOpacity onPress={() => {
              if (!firebase.auth().currentUser) {
                Actions.signup('Triton Deal')
              } else {
                ToastAndroid.show('You have already signed in', ToastAndroid.SHORT);
              }
            }}>
              <Text style={style.bottomText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}


const ThirdPartyLogin = () => (
  <View>
    <View style={{flexDirection: 'row'}}>
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
