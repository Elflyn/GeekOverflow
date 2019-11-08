import React, {Component} from 'react';
import {Input, Icon, Button, Text as Header} from 'react-native-elements';
import {StyleSheet, View, Text, ImageBackground, Linking} from 'react-native';
import {BACKGROUND} from '../images';

class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      navTab: 'LOGIN',
    };
    this.switchTab = this.switchTab.bind(this);
  }

  switchTab = link => {
    this.setState(() => ({navTab: link}));
  };

  render() {
    return (
      <ImageBackground source={BACKGROUND} style={style.background}>
        <Header h1>logo</Header>
        <View>
          <View style={style.formContainer}>
            <Nav onPress={this.switchTab} active={this.state.navTab} />
            <View style={style.form}>
              {this.state.navTab === 'LOGIN' ? <Login /> : <Register />}
            </View>
          </View>
          <ThirdPartyLogin />
        </View>
      </ImageBackground>
    );
  }
}

const Login = () => (
  <View>
    <Input
      placeholder="Email Address"
      leftIcon={
        <Icon iconStyle={style.iconStyle} name="envelope" type="evilicon" />
      }
    />
    <View style={{flexDirection: 'row'}}>
      <View style={style.line} />
      <Text style={style.middleText}>OR</Text>
      <View style={style.line} />
    </View>
    <Input
      placeholder="Username"
      leftIcon={
        <Icon iconStyle={style.iconStyle} name="user" type="evilicon" />
      }
    />
    <Input
      placeholder="password"
      leftIcon={
        <Icon iconStyle={style.iconStyle} name="unlock" type="evilicon" />
      }
    />
    <Text
      style={style.hyperlink}
      onPress={() => Linking.openURL('http://google.com')}>
      Forget password?
    </Text>
    <Button buttonStyle={style.button} title="Login" />
  </View>
);

const Register = () => (
  <View>
    <Input
      placeholder="Enter your email"
      leftIcon={
        <Icon iconStyle={style.iconStyle} name="envelope" type="evilicon" />
      }
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
    />
    <Input
      placeholder="Confirm Password"
      leftIcon={
        <Icon iconStyle={style.iconStyle} name="lock" type="evilicon" />
      }
    />
    <Button buttonStyle={style.button} title="Sign Up" />
  </View>
);

const Nav = ({onPress, active}) => (
  <View style={style.nav}>
    <Button
      onPress={() => onPress('LOGIN')}
      type="clear"
      buttonStyle={style.navTab}
      titleStyle={active === 'LOGIN' ? style.activeTab : style.disabledTab}
      title="LOGIN"
    />
    <Button
      onPress={() => onPress('REG')}
      buttonStyle={style.navTab}
      titleStyle={active === 'REG' ? style.activeTab : style.disabledTab}
      type="clear"
      title="SIGN UP"
    />
  </View>
);

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
  background: {
    height: '100%',
    alignItems: 'center',
    width: '100%',
  },

  button: {
    marginVertical: 30,
    width: 150,
    alignSelf: 'center',
    backgroundColor: '#1d3e53',
  },

  buttonContainer: {
    color: '#1d3e53',
  },

  navTab: {
    width: 175,
  },

  activeTab: {
    fontSize: 32,
    fontFamily: 'Roboto-Thin',
    color: '#f8f8f8',
  },

  disabledTab: {
    fontFamily: 'Roboto-Thin',
    fontSize: 32,
    color: '#ececec',
    opacity: 0.3,
  },

  centerText: {
    textAlign: 'center',
  },

  nav: {
    flexDirection: 'row',
    justifyContent: 'center',
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

  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  line: {
    backgroundColor: 'black',
    height: 1,
    flex: 1,
    paddingHorizontal: 1,
    alignSelf: 'center',
    marginVertical: 15,
  },

  middleText: {
    paddingHorizontal: 5,
    alignSelf: 'center',
    fontSize: 20,
  },

  iconStyle: {
    marginRight: 15,
  },

  hyperlink: {
    color: 'grey',
    textDecorationLine: 'underline',
    textAlign: 'right',
    fontSize: 18,
    paddingRight: 10,
  },
});

export default LoginPage;
