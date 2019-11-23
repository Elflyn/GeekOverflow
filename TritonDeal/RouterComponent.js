import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Scene, Router, Stack, Actions} from 'react-native-router-flux';
import LoginPage from './src/views/LoginPage';
import SignupPage from './src/views/SignupPage';
import Profile from './src/views/Profile';
import {Icon} from 'react-native-elements';

const RouterComponent = () => {
  return (
    <Router>
      <Stack key="root" headerLayoutPreset="center">
        <Scene key="profile" hideNavBar={true} component={Profile} />
        <Scene
          key="signup"
          component={SignupPage}
          navigationBarStyle={style.nav}
          title="Register"
          titleStyle={style.title}
          renderLeftButton={() => renderBackButton()}
        />
        <Scene key="login" hideNavBar={true} component={LoginPage} />
      </Stack>
    </Router>
  );
};

const renderBackButton = () => (
  <TouchableOpacity onPress={() => Actions.pop()}>
    <View style={{alignItems: 'center'}}>
      <Icon
        iconStyle={style.iconStyle}
        name="keyboard-arrow-left"
        type="MaterialIcons"
      />
    </View>
  </TouchableOpacity>
);

const style = StyleSheet.create({
  nav: {
    backgroundColor: '#016C9A',
    textAlign: 'center',
  },

  title: {
    color: 'white',
    flex: 1,
  },
  iconStyle: {
    color: 'white',
  },
});

export default RouterComponent;
