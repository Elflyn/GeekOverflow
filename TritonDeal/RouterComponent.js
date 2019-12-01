import React from 'react';
import { StyleSheet, TouchableOpacity, View, BackHandler, ToastAndroid, Alert, Linking, StatusBar } from 'react-native';
import { Scene, Router, Stack, Actions, Tabs, ActionConst } from 'react-native-router-flux';
import LoginPage from './src/views/LoginPage';
import SignupPage from './src/views/SignupPage';
import SplashScreen from './src/views/SplashScreen'
import Placeholder from './src/views/Placeholder'
import ChatList from './src/views/ChatList'
import Chat from './src/components/Chat'
import Post from './src/views/Post'
import Profile from './src/views/Profile';
import { Icon } from 'react-native-elements';
import EditProfile from './src/views/EditProfile';
import { firebase } from '@react-native-firebase/auth';
import message from './src/message';

export default class RouterComponent extends React.Component {

  async componentDidMount() {
    initLink = await firebase.dynamicLinks().getInitialLink();
    if (initLink) {
      var deepLinkParams = parseURL(initLink.url);
      var mode = deepLinkParams.mode;
      var oobCode = deepLinkParams.oobCode;

      switch (mode) {
        case 'verifyEmail':
         this.handleVerifyEmail(oobCode);
         break;
        default:
          ToastAndroid.show(initLink.url, ToastAndroid.SHORT);
      }
    }
    Linking.addEventListener("url", this.handeLaunchByUrl);
    BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handeLaunchByUrl);
    BackHandler.addEventListener('hardwareBackPress', () => this.handleBackButton())
  }

  handeLaunchByUrl = (event) => {
    if (event) {
      var deepLinkParams = parseURL(decodeURIComponent(parseURL(event.url).link));
      var mode = deepLinkParams.mode;
      var oobCode = deepLinkParams.oobCode;

      switch (mode) {
        case 'verifyEmail':
          this.handleVerifyEmail(oobCode);
          break;
        default:
          ToastAndroid.show(event.url, ToastAndroid.SHORT);
      }
    }
  };

  handleVerifyEmail = (oobCode) => {
    firebase.auth().applyActionCode(oobCode).then(() => {
      Alert.alert(
        null,
        'Thank you. Your email address has been verified.',
        [{ text: 'OK'}],
      );
      firebase.auth().currentUser.reload().then(() => {
        Actions.refresh();
      });
    }).catch(error => {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode) {
        if (errorCode == 'auth/expired-action-code') {
          ToastAndroid.show(message.LINK_EXPIRE, ToastAndroid.SHORT);
        } else if (errorCode == 'auth/invalid-action-code') {
          ToastAndroid.show(message.LINK_INVALID, ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
        }
      }
    });
  }

  handleBackButton = () => {
    if (Actions.currentScene === 'login') {
      Actions.root();
      return true;
    } else if (Actions.currentScene === 'splash') {
      return true;
    } else if (Actions.currentScene === 'home' || Actions.currentScene === 'message' || Actions.currentScene === 'profile') {
      Alert.alert(
        null,
        'Would you like to exit the app?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { text: 'OK', onPress: () => BackHandler.exitApp() },
        ],
      );
      return true;
    }
  }

  handleTabBarPress = ({ navigation, defaultHandler }) => {
    if (navigation.state.routeName == '_message' || navigation.state.routeName == "_account") {
      if (!firebase.auth().currentUser) {
        Actions.login();
        return true;
      }
    }
    defaultHandler()
  }

  render() {
    return (
      <Router>
        <Stack>
          <Scene key="root" headerLayoutPreset="center" hideNavBar>
            <Tabs
              key="nav"
              tabBarStyle={{ backgroundColor: '#FFFFFF' }}
              hideNavBar
              showLabel={false}
              activeTintColor="#016C9A"
              inactiveTintColor='grey'
              tabBarOnPress={this.handleTabBarPress}
            >
              <Scene key="_home" iconName={'home'} icon={TabIcon}>
                <Scene
                  key="home"
                  component={Placeholder}
                  navigationBarStyle={style.nav}
                  title="Register"
                  titleStyle={style.title}
                />
              </Scene>
              <Scene key="_post" iconName={'plus-box-outline'} icon={TabIcon}>
                <Scene
                  key="post"
                  component={Post}
                  navigationBarStyle={style.nav}
                  title="Post Item"
                  titleStyle={style.title}
                  renderLeftButton={() => renderBackButton()}
                />
              </Scene>
              <Scene key="_chatList" iconName={'message-text-outline'} icon={TabIcon}>
                <Scene
                  key="chatList"
                  component={ChatList}
                  navigationBarStyle={style.nav}
                  title="Chat"
                  titleStyle={style.title}
                  renderRightButton={() => renderAddButton()}
                />
                <Scene
                  key="chat"
                  component={Chat}
                  navigationBarStyle={style.nav}
                  title={this.props.title}
                  titleStyle={style.title}
                  hideTabBar
                  renderLeftButton={() => renderBackButton()}
                />
              </Scene>
              <Scene key="_account" iconName={'account'} icon={TabIcon}>
                <Scene key="profile" component={Profile} hideNavBar onEnter={() => {Actions.refresh()}}/>
              </Scene>
            </Tabs>
          </Scene>
          <Scene
            key="splash"
            component={SplashScreen}
            initial
            hideNavBar
          />
          <Scene
            key="login"
            hideNavBar
            component={LoginPage}
          />
          <Scene
            key="signup"
            component={SignupPage}
            navigationBarStyle={style.nav}
            title="Register"
            titleStyle={style.title}
            renderLeftButton={() => renderBackButton()}
          />
          <Scene
            key="editProfile"
            component={EditProfile}
            navigationBarStyle={style.nav}
            title="Edit Profile"
            titleStyle={style.title}
            renderLeftButton={() => renderBackButton()}
          />
        </Stack>
      </Router>
    );
  }
};

const renderBackButton = () => (
  <TouchableOpacity
    onPress={() => Actions.pop()}
  >
    <View style={{ alignItems: 'center' }}>
      <Icon iconStyle={style.iconStyle} name="keyboard-arrow-left" type="MaterialIcons" />
    </View>
  </TouchableOpacity>
);

const renderAddButton = () => (
  <TouchableOpacity
    onPress={() => {
      const cl = Actions.refs.chatList;
      cl.addChat();
    }}
  >
    <View style={{ alignItems: 'center' }}>
      <Icon iconStyle={style.addIconStyle} name="person-add" type="MaterialIcons" />
    </View>
  </TouchableOpacity>
);

function parseURL(url) {
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while (match = regex.exec(url)) {
    params[match[1]] = match[2];
  }
  return params;
}


class TabIcon extends React.Component {
  render() {
    const color = this.props.focused
      ? this.props.activeTintColor
      : this.props.inactiveTintColor

    return <Icon color={color} type="material-community" name={this.props.iconName} />
  }
}

const style = StyleSheet.create({
  nav: {
    height: StatusBar.currentHeight + 56,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#016C9A',
    textAlign: 'center',
  },

  title: {
    top: 0,
    color: 'white',
    flex: 1,
  },

  iconStyle: {
    color: 'white',
    marginLeft: 10,
  },

  addIconStyle: {
    color: 'white',
    marginRight: 10,
  },
});