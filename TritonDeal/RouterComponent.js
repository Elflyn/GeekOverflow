import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Scene, Router, Stack, Actions} from 'react-native-router-flux';
import LoginPage from './src/views/LoginPage';
import SignupPage from './src/views/SignupPage';
import Profile from './src/views/Profile';
import {Icon} from 'react-native-elements';
import Dialog from './src/components/Overlay';
import EditProfile from './src/views/EditProfile';

const RouterComponent = () => {
  const TabIcon = ({ selected, title }) => {
    return (
        <Text style={{color: selected ? 'red' :'black'}}>{title}</Text>
    );
  }

  return(
    <Router>
      <Stack key="root" headerLayoutPreset="center">
        <Scene
            key="tabbar"
            tabs={true}
            tabBarStyle={{ backgroundColor: '#FFFFFF' }}
            hideNavBar={true}
        >
          <Scene key="osu" title="HOME" icon={TabIcon}>
            <Scene
                key="sigup"
                component={SignupPage}
                navigationBarStyle={style.nav}
                title="Register"
                titleStyle={style.title}
            />
          </Scene>
          <Scene key="um" title="Profile" icon={TabIcon}>
            <Scene
                key="editProfile"
                component={EditProfile}
                navigationBarStyle={style.nav}
                title="Edit Profile"
                titleStyle={style.title}
            />
          </Scene>
        </Scene>

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
      onPress={() => Actions.login()}
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
  },
});

export default RouterComponent;
