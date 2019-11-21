import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {Text as H} from 'react-native-elements';
import Register from '../components/Register';

const SignupPage = () => {
  return (
    <View>
      <Text style={style.headerText}>Sign Up</Text>
      <Text style={style.smallText}>Welcome to UCSD community</Text>
      <Register />
    </View>
  );
};

const style = StyleSheet.create({
  headerText: {
    fontSize: 40,
    marginVertical: 30,
    marginLeft: 20,
  },

  smallText: {
    fontSize: 20,
    marginLeft: 20,
    color: 'grey',
    marginBottom: 20
  }
})


export default SignupPage;

