import React from 'react';
import {StyleSheet, View, Text, Linking, TouchableOpacity} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import OrBreak from './OrBreak';
import GradientButton from '../components/GradientButton';

const Login = () => (
  <View style={style.loginContainer}>
    <Input
      placeholder="Email Address"
      leftIcon={
        <Icon iconStyle={style.iconStyle} name="envelope" type="evilicon" />
      }
    />

    <OrBreak />

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
    <GradientButton text={"Login"} />
  </View>
);

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

export default Login;

