import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {Scene, Router, Stack, Actions, Tabs} from 'react-native-router-flux';
import LoginPage from './src/views/LoginPage';
import SignupPage from './src/views/SignupPage';
import Profile from './src/views/Profile';
import {Icon} from 'react-native-elements';
import EditProfile from './src/views/EditProfile';

const RouterComponent = () => {

  return(
    <Router>
      <Stack key="root" headerLayoutPreset="center">
        <Tabs
            key="nav"
            tabBarStyle={{ backgroundColor: '#FFFFFF' }}
            hideNavBar
            showLabel={false}
            activeTintColor ="#016C9A"
            inactiveTintColor='grey'
        >
          <Scene key="home" iconName={'home'} icon={TabIcon}>
            <Scene
                key="editProfile"
                component={EditProfile}
                navigationBarStyle={style.nav}
                title="Edit Profile"
                titleStyle={style.title}
            />
          </Scene>
          <Scene key="account" iconName={'account'} icon={TabIcon}>
            <Scene
              key="sigup"
              component={SignupPage}
              navigationBarStyle={style.nav}
              title="Register"
              titleStyle={style.title}
            />
          </Scene>
          <Scene key="post" iconName={'comment-plus-outline'} icon={TabIcon}>
            <Scene
              key="sigup"
              component={SignupPage}
              navigationBarStyle={style.nav}
              title="Register"
              titleStyle={style.title}
            />
          </Scene>
        </Tabs>

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

class TabIcon extends React.Component {
  render () {
    const color = this.props.focused
        ? this.props.activeTintColor 
        : this.props.inactiveTintColor

    return <Icon color={color} type="material-community" name={this.props.iconName} />
  }
}

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
