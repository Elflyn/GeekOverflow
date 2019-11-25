import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Scene, Router, Stack, Actions} from 'react-native-router-flux';
import LoginPage from './src/views/LoginPage';
import SignupPage from './src/views/SignupPage';
import {Icon} from 'react-native-elements';
import Dialog from './src/components/Overlay';
import EditProfile from './src/views/EditProfile';

const RouterComponent = () => {
  return(
    <Router>
      <Stack key="root" headerLayoutPreset="center">
        <Scene key="EditProfile"
               component={EditProfile}
               navigationBarStyle={style.nav}
               title="Edit Profile"
               titleStyle={style.title}
               renderLeftButton={() => renderBackButton()}
        />
        <Scene key="login" hideNavBar={true} component={LoginPage} />
        <Scene key="signup"
          component={SignupPage}
          navigationBarStyle={style.nav}
          title="Register"
          titleStyle={style.title} 
          renderLeftButton={() => renderBackButton()}   
          />
      </Stack>
    </Router>
  );
};

const renderBackButton = () => (
  <TouchableOpacity
      onPress={() => Actions.pop()}
  >
      <View style={{ alignItems: 'center' }}>
        <Icon  iconStyle={style.iconStyle} name="keyboard-arrow-left" type="MaterialIcons" />
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
  }
})



export default RouterComponent;
