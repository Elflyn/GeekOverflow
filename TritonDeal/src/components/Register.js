import React from 'react';
import {StyleSheet, View, Text, Linking, TouchableOpacity} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import GradientButton from './GradientButton';

const Register = () => (
  <View style={style.container}>
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
    <Input
      placeholder="Phone number"
      leftIcon={
        <Icon iconStyle={style.iconStyle} name="phone-android" type="MaterialIcons" />
      }
    />
    <GradientButton text={"Sign Up"} />
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

  container: {
    paddingHorizontal: 38,
    textAlign: 'center',
  }
});;

export default Register;
